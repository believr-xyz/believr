import imageCompression from "browser-image-compression";

/**
 * Hook for compressing images before uploading
 */
export function useMediaCompression() {
  /**
   * Compresses an image file to reduce file size
   * @param file The file to compress
   * @returns A compressed version of the file
   */
  const compressImage = async (file: File): Promise<File> => {
    if (file.type.includes("image") && !file.type.includes("gif")) {
      try {
        return await imageCompression(file, {
          maxSizeMB: 5, // compress to 5MB max
          maxWidthOrHeight: 4000,
          useWebWorker: true,
          exifOrientation: 1, // preserve orientation
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        return file; // Return original file if compression fails
      }
    }
    return file; // Return original file for non-images or GIFs
  };

  /**
   * Compresses multiple files (only compresses images)
   * @param files Array of files to compress
   * @returns Array of compressed files
   */
  const compressFiles = async (files: File[]): Promise<File[]> => {
    return Promise.all(files.map(async (file) => await compressImage(file)));
  };

  return { compressImage, compressFiles };
}
