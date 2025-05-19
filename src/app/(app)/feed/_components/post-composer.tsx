"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getLensClient } from "@/lib/lens/client";
import { storageClient } from "@/lib/lens/storage-client";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { EvmAddress, SessionClient } from "@lens-protocol/client";
import { fetchGroups, post } from "@lens-protocol/client/actions";
import {
  ImageMetadata,
  MediaImageMimeType,
  TextOnlyMetadata,
  image,
  textOnly,
} from "@lens-protocol/metadata";
import { useAuthenticatedUser } from "@lens-protocol/react";
import { ImageIcon, SmileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
}

export function PostComposer() {
  const { data: user } = useAuthenticatedUser();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [postTarget, setPostTarget] = useState<"global" | "group">("global");
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch user's groups when the component loads and when the target is set to "group"
  const loadGroups = async () => {
    if (!user) return;

    try {
      const client = await getLensClient();
      // Use the correct structure for GroupsRequest based on the schema
      const result = await fetchGroups(client, {
        filter: {
          member: user.address,
        },
      });

      if (result.isOk()) {
        const userGroups = result.value.items.map((group) => ({
          id: group.address, // Use address instead of id based on SDK
          name: group.metadata?.name || "Unnamed Group",
        }));
        setGroups(userGroups);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept images
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setContent((prev) => prev + emoji.native);
  };

  // Determine media type from file
  const determineMediaType = (file: File): MediaImageMimeType => {
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

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("You need to be logged in to post");
      return;
    }

    if (!content.trim() && !selectedFile) {
      toast.error("Post cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const client = await getLensClient();

      if (!client || !("getCredentials" in client)) {
        toast.error("Authentication required");
        setIsLoading(false);
        return;
      }

      const sessionClient = client as SessionClient;

      // Handle media upload if there's a file
      let mediaURI = null;
      if (selectedFile) {
        try {
          const { files } = await storageClient.uploadFolder([selectedFile]);
          if (files && files.length > 0) {
            mediaURI = files[0].uri;
          }
        } catch (error) {
          console.error("Failed to upload image:", error);
          toast.error("Failed to upload image");
          setIsLoading(false);
          return;
        }
      }

      // Create metadata
      let metadata: ImageMetadata | TextOnlyMetadata;
      if (mediaURI && selectedFile) {
        metadata = image({
          content: content,
          image: {
            item: mediaURI,
            type: determineMediaType(selectedFile),
          },
        });
      } else {
        metadata = textOnly({
          content: content,
        });
      }

      // Upload metadata
      const { uri } = await storageClient.uploadAsJson(metadata);

      // Create post
      const postRequest = {
        contentUri: uri, // Note the camelCase here (not contentURI)
      };

      // Add group if selected
      if (postTarget === "group" && selectedGroup) {
        Object.assign(postRequest, {
          feed: selectedGroup,
        });
      }

      const result = await post(sessionClient, postRequest);

      if (result.isOk()) {
        toast.success("Post created successfully");
        setContent("");
        setSelectedFile(null);
        setPreviewUrl(null);
        router.refresh();
      } else {
        console.error("Failed to create post:", result.error);
        toast.error(`Failed to create post: ${result.error.message}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error creating post: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4 p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          {/* The AuthenticatedUser type only has address property */}
          <div className="flex h-full w-full items-center justify-center bg-primary-foreground text-primary">
            {user?.address ? user.address.substring(0, 2) : "?"}
          </div>
        </div>

        <div className="flex-1">
          <Tabs
            defaultValue="global"
            className="mb-2"
            onValueChange={(value) => {
              setPostTarget(value as "global" | "group");
              if (value === "group") {
                loadGroups();
              }
            }}
          >
            <TabsList className="mb-2">
              <TabsTrigger value="global">Global Feed</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
            </TabsList>

            {postTarget === "group" && (
              <Select onValueChange={setSelectedGroup}>
                <SelectTrigger className="mb-2 w-full">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Tabs>

          <Textarea
            placeholder="What's happening?"
            className="mb-2 min-h-24 border-none p-0 focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {previewUrl && (
            <div className="relative mb-3 overflow-hidden rounded-md">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-80 w-auto rounded-md"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleImageUpload}
                title="Add image"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" title="Add emoji">
                    <SmileIcon className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
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
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
