/**
 * Process and normalize URLs
 * Ensures IPFS and other protocol URLs are properly formatted
 *
 * @param url The URL to process
 * @returns A normalized URL that can be used in Next.js Image component
 */
export function processUrl(url: string): string {
  if (!url) return "";

  // Handle IPFS URLs
  if (url.startsWith("ipfs://")) {
    // Convert IPFS URLs to gateway URLs
    const ipfsHash = url.replace("ipfs://", "");
    return `https://gateway.ipfscdn.io/ipfs/${ipfsHash}`;
  }

  // Handle AR URLs
  if (url.startsWith("ar://")) {
    const arweaveHash = url.replace("ar://", "");
    return `https://arweave.net/${arweaveHash}`;
  }

  // If the URL doesn't have a protocol, assume it's a relative URL
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // Return as is if it starts with a slash, otherwise add a slash
    return url.startsWith("/") ? url : `/${url}`;
  }

  return url;
}

/**
 * Extract image URL from metadata for Lens Protocol
 * Handles different image format structures
 *
 * @param mediaObject The media object from Lens Protocol
 * @returns A processed URL ready for use
 */
export function extractMediaUrl(mediaObject: any): string {
  if (!mediaObject) return "";

  // If mediaObject is a string, return it directly
  if (typeof mediaObject === "string") {
    return processUrl(mediaObject);
  }

  // Try different image formats from Lens Protocol
  if (mediaObject.optimized?.uri) {
    return processUrl(mediaObject.optimized.uri);
  }

  if (mediaObject.raw?.uri) {
    return processUrl(mediaObject.raw.uri);
  }

  if (mediaObject.original?.url) {
    return processUrl(mediaObject.original.url);
  }

  return processUrl(mediaObject.item || "");
}
