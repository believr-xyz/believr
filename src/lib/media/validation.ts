import { toast } from "sonner";

export const IMAGE_UPLOAD_LIMIT = 50000000; // 50MB
export const VIDEO_UPLOAD_LIMIT = 500000000; // 500MB
export const AUDIO_UPLOAD_LIMIT = 100000000; // 100MB

/**
 * Validates that a file is within the size limits for its type
 */
export function validateFileSize(file: File): boolean {
  const isImage = file.type.includes("image");
  const isVideo = file.type.includes("video");
  const isAudio = file.type.includes("audio");

  if (isImage && file.size > IMAGE_UPLOAD_LIMIT) {
    toast.error(`Image size should be less than ${IMAGE_UPLOAD_LIMIT / 1000000}MB`);
    return false;
  }

  if (isVideo && file.size > VIDEO_UPLOAD_LIMIT) {
    toast.error(`Video size should be less than ${VIDEO_UPLOAD_LIMIT / 1000000}MB`);
    return false;
  }

  if (isAudio && file.size > AUDIO_UPLOAD_LIMIT) {
    toast.error(`Audio size should be less than ${AUDIO_UPLOAD_LIMIT / 1000000}MB`);
    return false;
  }

  return true;
}
