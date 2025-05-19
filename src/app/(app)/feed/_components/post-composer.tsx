"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaCompression } from "@/hooks/use-media-compression";
import { getLensClient } from "@/lib/lens/client";
import { storageClient } from "@/lib/lens/storage-client";
import { validateFileSize } from "@/lib/media/validation";
import { createVideoThumbnail } from "@/lib/media/video-thumbnails";
import { uploadToIPFS } from "@/lib/uploadToIPFS";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Group, SessionClient, evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchGroups } from "@lens-protocol/client/actions";
import { post } from "@lens-protocol/client/actions";
import {
  AudioMetadata,
  ImageMetadata,
  MediaAudioMimeType,
  MediaImageMimeType,
  MediaVideoMimeType,
  TextOnlyMetadata,
  VideoMetadata,
  audio,
  image,
  textOnly,
  video,
} from "@lens-protocol/metadata";
import { useAuthenticatedUser } from "@lens-protocol/react";
import {
  Image,
  Smiley,
  File,
  UsersThree,
  FilmStrip,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type MediaType = "image" | "video" | "audio" | null;
type PostTarget = "global" | "group";

export function PostComposer() {
  const { data: user } = useAuthenticatedUser();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [mediaDuration, setMediaDuration] = useState<number>(0);
  const [accountData, setAccountData] = useState<any>(null);
  const [postTarget, setPostTarget] = useState<PostTarget>("global");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { compressImage } = useMediaCompression();

  // Fetch account data for profile picture
  useEffect(() => {
    async function fetchUserAccount() {
      if (!user) return;

      try {
        const client = await getLensClient();
        const account = await fetchAccount(client, {
          address: user.address,
        }).unwrapOr(null);
        setAccountData(account);

        // Fetch user's groups - using the correct filter API
        const groupsResult = await fetchGroups(client, {
          filter: {
            member: user.address,
          },
        });

        if (groupsResult.isOk()) {
          // Convert readonly array to mutable array
          setGroups([...groupsResult.value.items]);
        }
      } catch (error) {
        console.error("Failed to fetch account:", error);
      }
    }

    fetchUserAccount();
  }, [user]);

  const handleMediaUpload = (type: MediaType) => {
    if (fileInputRef.current) {
      // Set accept attribute based on media type
      switch (type) {
        case "image":
          fileInputRef.current.accept = "image/*";
          break;
        case "video":
          fileInputRef.current.accept = "video/*";
          break;
        case "audio":
          fileInputRef.current.accept = "audio/*";
          break;
      }
      fileInputRef.current.click();
    }
  };

  // Get duration from audio element
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        // Round up to nearest second to ensure it's greater than 0
        const duration = Math.ceil(audio.duration);
        URL.revokeObjectURL(audio.src);
        resolve(duration);
      };

      audio.onerror = () => {
        console.error("Error loading audio metadata");
        URL.revokeObjectURL(audio.src);
        // Default to 1 second if we can't get the actual duration
        resolve(1);
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  // Get duration from video element
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        // Round up to nearest second to ensure it's greater than 0
        const duration = Math.ceil(video.duration);
        URL.revokeObjectURL(video.src);
        resolve(duration);
      };

      video.onerror = () => {
        console.error("Error loading video metadata");
        URL.revokeObjectURL(video.src);
        // Default to 1 second if we can't get the actual duration
        resolve(1);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (!validateFileSize(file)) {
      return;
    }

    // Determine file type
    let type: MediaType = null;
    let processedFile = file;

    if (file.type.startsWith("image/")) {
      type = "image";
      // Compress image if not a GIF
      if (!file.type.includes("gif")) {
        try {
          const compressedImage = await compressImage(file);
          processedFile = compressedImage;
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }
    } else if (file.type.startsWith("video/")) {
      type = "video";
      // Get video duration and thumbnail
      try {
        const duration = await getVideoDuration(file);
        setMediaDuration(duration);

        // Generate video thumbnail
        try {
          const thumbnail = await createVideoThumbnail(file);
          setVideoThumbnail(thumbnail);
        } catch (thumbnailError) {
          console.error("Error creating video thumbnail:", thumbnailError);
        }
      } catch (error) {
        console.error("Error getting video duration:", error);
        setMediaDuration(1); // Fallback to 1 second
      }
    } else if (file.type.startsWith("audio/")) {
      type = "audio";
      // Get audio duration
      try {
        const duration = await getAudioDuration(file);
        setMediaDuration(duration);
      } catch (error) {
        console.error("Error getting audio duration:", error);
        setMediaDuration(1); // Fallback to 1 second
      }
    } else {
      toast.error("Unsupported file type");
      return;
    }

    setSelectedFile(processedFile);
    setMediaType(type);

    // Create preview URL
    const url = URL.createObjectURL(processedFile);
    setPreviewUrl(url);
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setContent((prev) => prev + emoji.native);
  };

  // Determine media image type from file
  const determineImageType = (file: File): MediaImageMimeType => {
    const type = file.type.toLowerCase();
    if (type.includes("jpeg") || type.includes("jpg")) {
      return MediaImageMimeType.JPEG;
    } else if (type.includes("png")) {
      return MediaImageMimeType.PNG;
    } else if (type.includes("webp")) {
      return MediaImageMimeType.WEBP;
    } else if (type.includes("gif")) {
      return MediaImageMimeType.GIF;
    }
    return MediaImageMimeType.JPEG; // Default
  };

  // Determine media video type from file
  const determineVideoType = (file: File): MediaVideoMimeType => {
    const type = file.type.toLowerCase();
    if (type.includes("mp4")) {
      return MediaVideoMimeType.MP4;
    } else if (type.includes("webm")) {
      return MediaVideoMimeType.WEBM;
    } else if (type.includes("ogg")) {
      return MediaVideoMimeType.OGG;
    } else if (type.includes("quicktime") || type.includes("mov")) {
      return MediaVideoMimeType.QUICKTIME;
    }
    return MediaVideoMimeType.MP4; // Default
  };

  // Determine media audio type from file
  const determineAudioType = (file: File): MediaAudioMimeType => {
    const type = file.type.toLowerCase();
    if (type.includes("mp3") || type.includes("mpeg")) {
      return MediaAudioMimeType.MP3;
    } else if (type.includes("wav")) {
      return MediaAudioMimeType.WAV;
    } else if (type.includes("ogg")) {
      return MediaAudioMimeType.OGG_AUDIO;
    } else if (type.includes("mp4")) {
      return MediaAudioMimeType.MP4_AUDIO;
    } else if (type.includes("aac")) {
      return MediaAudioMimeType.AAC;
    } else if (type.includes("webm")) {
      return MediaAudioMimeType.WEBM_AUDIO;
    }
    return MediaAudioMimeType.MP3; // Default
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("You need to be logged in to post");
      return;
    }

    if (!content.trim() && !selectedFile) {
      toast.error("Post cannot be empty");
      return;
    }

    // Validate group selection if targeting a group
    if (postTarget === "group" && !selectedGroupId) {
      toast.error("Please select a group");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating post...");

    try {
      const client = await getLensClient();

      if (!client || !("getCredentials" in client)) {
        toast.error("Authentication required", { id: toastId });
        setIsLoading(false);
        return;
      }

      const sessionClient = client as SessionClient;

      // Handle media upload if there's a file
      let mediaURI = null;
      if (selectedFile) {
        // Use enhanced IPFS upload with fallbacks
        const uploadResult = await uploadToIPFS(selectedFile);

        if (uploadResult.success && uploadResult.uri) {
          mediaURI = uploadResult.uri;
        } else {
          toast.error(
            `Failed to upload media: ${uploadResult.error || "Unknown error"}`,
            {
              id: toastId,
            }
          );
          setIsLoading(false);
          return;
        }
      }

      // Create metadata based on media type
      let metadata:
        | ImageMetadata
        | VideoMetadata
        | AudioMetadata
        | TextOnlyMetadata;

      if (mediaURI && selectedFile) {
        if (mediaType === "image") {
          metadata = image({
            content: content,
            image: {
              item: mediaURI,
              type: determineImageType(selectedFile),
            },
          });
        } else if (mediaType === "video") {
          metadata = video({
            content: content,
            video: {
              item: mediaURI,
              type: determineVideoType(selectedFile),
              duration: mediaDuration, // Using the calculated duration
              cover: videoThumbnail || undefined, // Use generated thumbnail if available
            },
          });
        } else if (mediaType === "audio") {
          metadata = audio({
            content: content,
            audio: {
              item: mediaURI,
              type: determineAudioType(selectedFile),
              artist: "Believr Artist", // You might want to make this configurable
              duration: mediaDuration, // Using the calculated duration
            },
          });
        } else {
          metadata = textOnly({
            content: content,
          });
        }
      } else {
        metadata = textOnly({
          content: content,
        });
      }

      // Upload metadata
      const { uri } = await storageClient.uploadAsJson(metadata);

      // Create post with properly typed group ID if posting to a group
      const postRequest = {
        contentUri: uri,
        // Properly convert group ID to EVM address format when targeting a group
        ...(postTarget === "group" && selectedGroupId
          ? { groupId: evmAddress(selectedGroupId) }
          : {}),
      };

      const result = await post(sessionClient, postRequest);

      if (result.isOk()) {
        toast.success("Post created successfully", { id: toastId });
        setContent("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setMediaType(null);
        setVideoThumbnail(null);
        router.refresh();
      } else {
        console.error("Failed to create post:", result.error);
        toast.error(`Failed to create post: ${result.error.message}`, {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error creating post: ${errorMessage}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Get profile picture URL
  let profilePictureUrl = null;
  if (accountData?.metadata?.picture) {
    // Handle direct string URL
    if (typeof accountData.metadata.picture === "string") {
      profilePictureUrl = accountData.metadata.picture;
    }
    // Handle object structure with nested URI
    else if (accountData.metadata.picture?.optimized?.uri) {
      profilePictureUrl = accountData.metadata.picture.optimized.uri;
    } else if (accountData.metadata.picture?.raw?.uri) {
      profilePictureUrl = accountData.metadata.picture.raw.uri;
    }
  }

  const displayAddress = user?.address.substring(0, 2) || "?";

  // Render media preview based on media type
  const renderMediaPreview = () => {
    if (!previewUrl) return null;

    return (
      <div className="relative mb-2 overflow-hidden rounded-md">
        {mediaType === "image" && (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-48 w-auto rounded-md"
          />
        )}
        {mediaType === "video" && (
          <video
            controls
            src={previewUrl}
            className="max-h-48 w-auto rounded-md"
          >
            <track kind="captions" src="" label="Captions" />
          </video>
        )}
        {mediaType === "audio" && (
          <div className="rounded-md bg-gray-100 p-3">
            <audio controls src={previewUrl} className="w-full">
              <track kind="captions" src="" label="Captions" />
            </audio>
            <p className="mt-1 text-gray-500 text-sm">
              Audio: {selectedFile?.name}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1"
          onClick={() => {
            setSelectedFile(null);
            setPreviewUrl(null);
            setMediaType(null);
            setVideoThumbnail(null);
          }}
        >
          ✕
        </Button>
      </div>
    );
  };

  return (
    <Card className="mb-4 p-3 shadow-sm">
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8">
          {profilePictureUrl ? (
            <AvatarImage src={profilePictureUrl} alt="Profile" />
          ) : (
            <AvatarFallback className="bg-primary-foreground text-primary">
              {displayAddress}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <Textarea
            placeholder="What's happening?"
            className="mb-2 min-h-14 border-none pt-1 pr-3 pl-0 text-sm focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {renderMediaPreview()}

          {/* Compact post target selection */}
          <div className="mb-2">
            <Tabs
              value={postTarget}
              onValueChange={(value) => setPostTarget(value as PostTarget)}
              className="w-full"
            >
              <TabsList className="grid h-8 w-auto grid-cols-2 gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="global"
                  className="h-8 rounded px-3 text-xs data-[state=active]:bg-[#00A8FF]/10 data-[state=active]:text-[#00A8FF]"
                >
                  Global
                </TabsTrigger>
                <TabsTrigger
                  value="group"
                  className="flex h-8 items-center gap-1 rounded px-3 text-xs data-[state=active]:bg-[#00A8FF]/10 data-[state=active]:text-[#00A8FF]"
                >
                  <UsersThree className="h-3.5 w-3.5" />
                  Group
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {postTarget === "group" && (
              <select
                className="mt-2 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-[#00A8FF]"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group.address} value={group.address}>
                    {group.metadata?.name || group.address.substring(0, 8)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex gap-1">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMediaUpload("image")}
                    className="text-[#00A8FF] hover:bg-[#00A8FF]/10 hover:text-[#00A8FF]"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Image</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMediaUpload("video")}
                    className="text-[#00A8FF] hover:bg-[#00A8FF]/10 hover:text-[#00A8FF]"
                  >
                    <FilmStrip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Video</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMediaUpload("audio")}
                    className="text-[#00A8FF] hover:bg-[#00A8FF]/10 hover:text-[#00A8FF]"
                  >
                    <File className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Audio</p>
                </TooltipContent>
              </Tooltip>

              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#00A8FF] hover:bg-[#00A8FF]/10 hover:text-[#00A8FF]"
                      >
                        <Smiley className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add Emoji</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-full border-none p-0">
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={handleCreatePost}
              disabled={isLoading || (!content.trim() && !selectedFile)}
              size="sm"
              className="rounded-full bg-[#00A8FF] px-4 text-white hover:bg-[#00A8FF]/90"
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
