/**
 * Creates a video thumbnail from a specified timestamp
 * @param file Video file
 * @param currentTime Time in seconds to capture thumbnail from
 * @returns Promise that resolves to a data URL of the thumbnail
 */
export const createVideoThumbnailAtTime = (file: File, currentTime: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        // Make sure we don't go beyond the video duration
        const actualTime = Math.min(currentTime, video.duration - 0.1);
        video.currentTime = actualTime;
      };

      video.oncanplay = () => {
        setTimeout(() => {
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

          URL.revokeObjectURL(video.src); // Clean up
          resolve(canvas.toDataURL("image/png"));
        }, 100);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src); // Clean up
        reject(new Error("Error loading video"));
      };
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Creates a video thumbnail from 25% of the way through the video
 * @param file Video file
 * @returns Promise that resolves to a data URL of the thumbnail
 */
export const createVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        // Calculate time at 25% of the video
        const targetTime = video.duration * 0.25;

        // Clean up this video element
        URL.revokeObjectURL(video.src);

        // Create thumbnail at the calculated time
        createVideoThumbnailAtTime(file, targetTime).then(resolve).catch(reject);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video"));
      };
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates multiple thumbnails from a video at evenly spaced intervals
 * @param file Video file
 * @param count Number of thumbnails to generate
 * @returns Promise that resolves to an array of thumbnail data URLs
 */
export const generateVideoThumbnails = (file: File, count = 3): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      if (!file.size) {
        resolve([]);
        return;
      }

      const video = document.createElement("video");
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = async () => {
        const thumbnailArray: string[] = [];
        const averageSplitTime = video.duration / (count + 1);

        try {
          for (let i = 1; i <= count; i++) {
            const currentTime = averageSplitTime * i;
            const thumbnail = await createVideoThumbnailAtTime(file, currentTime);
            thumbnailArray.push(thumbnail);
          }

          resolve(thumbnailArray);
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(video.src);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video"));
      };
    } catch (error) {
      reject(error);
    }
  });
};
