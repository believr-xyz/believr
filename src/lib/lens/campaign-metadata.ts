import { MetadataAttributeType, audio, image, textOnly, video } from "@lens-protocol/metadata";
import type {
  AudioMetadata,
  ImageMetadata,
  MediaAudioMimeType,
  MediaImageMimeType,
  MediaVideoMimeType,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/metadata";

interface ImageMediaFile {
  uri: string;
  mimeType: MediaImageMimeType;
}

interface VideoMediaFile {
  uri: string;
  mimeType: MediaVideoMimeType;
}

interface AudioMediaFile {
  uri: string;
  mimeType: MediaAudioMimeType;
}

type MediaFile = ImageMediaFile | VideoMediaFile | AudioMediaFile;

export interface CampaignReward {
  title: string;
  description: string;
  tier?: string;
}

export interface CampaignMetadataArgs {
  title: string;
  content: string;
  mediaFile?: MediaFile;
  mediaType?: "image" | "video" | "audio";
  mediaDuration?: number;
  goalAmount: string;
  currency: string;
  endDate: string;
  rewards: CampaignReward[];
}

/**
 * Creates formatted attributes for campaign metadata conforming to Lens Protocol types
 */
function createCampaignAttributes(args: CampaignMetadataArgs) {
  return [
    {
      key: "type",
      value: "investment_campaign",
      type: MetadataAttributeType.STRING,
    },
    {
      key: "goalAmount",
      value: args.goalAmount,
      type: MetadataAttributeType.STRING,
    },
    {
      key: "currency",
      value: args.currency,
      type: MetadataAttributeType.STRING,
    },
    {
      key: "endDate",
      value: args.endDate,
      type: MetadataAttributeType.STRING,
    },
    {
      key: "rewards",
      value: JSON.stringify(args.rewards),
      type: MetadataAttributeType.JSON,
    },
  ];
}

/**
 * Creates metadata for a campaign based on the media type
 */
export function createCampaignMetadata(
  args: CampaignMetadataArgs,
): TextOnlyMetadata | ImageMetadata | VideoMetadata | AudioMetadata {
  // Base common options
  const baseOptions = {
    content: args.content,
    title: args.title,
  };

  // Create different metadata based on media type
  if (!args.mediaFile || !args.mediaType) {
    return textOnly({
      ...baseOptions,
      attributes: [
        {
          key: "type",
          value: "investment_campaign",
          type: MetadataAttributeType.STRING,
        },
        {
          key: "goalAmount",
          value: args.goalAmount,
          type: MetadataAttributeType.STRING,
        },
        {
          key: "currency",
          value: args.currency,
          type: MetadataAttributeType.STRING,
        },
        {
          key: "endDate",
          value: args.endDate,
          type: MetadataAttributeType.STRING,
        },
        {
          key: "rewards",
          value: JSON.stringify(args.rewards),
          type: MetadataAttributeType.JSON,
        },
      ],
    });
  }

  switch (args.mediaType) {
    case "image": {
      const imageFile = args.mediaFile as ImageMediaFile;
      return image({
        ...baseOptions,
        image: {
          item: imageFile.uri,
          type: imageFile.mimeType,
        },
        attributes: [
          {
            key: "type",
            value: "investment_campaign",
            type: MetadataAttributeType.STRING,
          },
          {
            key: "goalAmount",
            value: args.goalAmount,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "currency",
            value: args.currency,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "endDate",
            value: args.endDate,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "rewards",
            value: JSON.stringify(args.rewards),
            type: MetadataAttributeType.JSON,
          },
        ],
      });
    }

    case "video": {
      const videoFile = args.mediaFile as VideoMediaFile;
      if (!args.mediaDuration) {
        console.warn("No duration provided for video, using 1 second as fallback");
      }

      return video({
        ...baseOptions,
        video: {
          item: videoFile.uri,
          type: videoFile.mimeType,
          duration: args.mediaDuration || 1,
        },
        attributes: [
          {
            key: "type",
            value: "investment_campaign",
            type: MetadataAttributeType.STRING,
          },
          {
            key: "goalAmount",
            value: args.goalAmount,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "currency",
            value: args.currency,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "endDate",
            value: args.endDate,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "rewards",
            value: JSON.stringify(args.rewards),
            type: MetadataAttributeType.JSON,
          },
        ],
      });
    }

    case "audio": {
      const audioFile = args.mediaFile as AudioMediaFile;
      if (!args.mediaDuration) {
        console.warn("No duration provided for audio, using 1 second as fallback");
      }

      return audio({
        ...baseOptions,
        audio: {
          item: audioFile.uri,
          type: audioFile.mimeType,
          duration: args.mediaDuration || 1,
        },
        attributes: [
          {
            key: "type",
            value: "investment_campaign",
            type: MetadataAttributeType.STRING,
          },
          {
            key: "goalAmount",
            value: args.goalAmount,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "currency",
            value: args.currency,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "endDate",
            value: args.endDate,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "rewards",
            value: JSON.stringify(args.rewards),
            type: MetadataAttributeType.JSON,
          },
        ],
      });
    }

    default:
      return textOnly({
        ...baseOptions,
        attributes: [
          {
            key: "type",
            value: "investment_campaign",
            type: MetadataAttributeType.STRING,
          },
          {
            key: "goalAmount",
            value: args.goalAmount,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "currency",
            value: args.currency,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "endDate",
            value: args.endDate,
            type: MetadataAttributeType.STRING,
          },
          {
            key: "rewards",
            value: JSON.stringify(args.rewards),
            type: MetadataAttributeType.JSON,
          },
        ],
      });
  }
}
