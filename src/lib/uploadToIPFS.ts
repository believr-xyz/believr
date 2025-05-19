import { storageClient } from "@/lib/lens/storage-client";

interface UploadResult {
  success: boolean;
  uri?: string;
  mimeType?: string;
  error?: string;
}

/**
 * Converts a file to base64 format as a fallback upload method
 * @param file File to convert
 * @returns Promise that resolves to a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Uploads a file to IPFS with fallback methods
 * @param file File to upload
 * @returns Upload result with success flag and URI if successful
 */
export async function uploadToIPFS(file: File): Promise<UploadResult> {
  try {
    // Standard IPFS upload via storage client
    try {
      const { files } = await storageClient.uploadFolder([file]);
      if (files && files.length > 0) {
        return {
          success: true,
          uri: files[0].uri,
          mimeType: file.type,
        };
      }
    } catch (uploadError) {
      console.error("Standard IPFS upload failed:", uploadError);

      // Check if it's a CORS-related error
      const isCorsError =
        uploadError instanceof Error &&
        (uploadError.message.includes("CORS") || uploadError.message.includes("Failed to fetch"));

      // Fallback: Use base64 encoding for small files (< 5MB)
      if (file.size < 5 * 1024 * 1024) {
        console.log("Trying base64 fallback for small file");
        try {
          const base64Data = await fileToBase64(file);
          return {
            success: true,
            uri: base64Data,
            mimeType: file.type,
          };
        } catch (fallbackError) {
          console.error("Base64 fallback also failed:", fallbackError);
          throw new Error("All upload methods failed");
        }
      } else {
        throw new Error("File too large for base64 fallback (max 5MB)");
      }
    }

    throw new Error("Upload failed with no specific error");
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Uploads multiple files to IPFS
 * @param files Array of files to upload
 * @returns Array of upload results
 */
export async function uploadMultipleToIPFS(files: File[]): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadToIPFS(file)));
}
