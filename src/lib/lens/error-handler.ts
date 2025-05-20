/**
 * Utility functions for handling errors from Lens Protocol
 */

/**
 * Formats an error from Lens Protocol for better debugging and user messaging
 */
export function formatLensError(error: any): string {
  // Handle specific Lens error types if they have a standard format
  if (error?.message) {
    // Check for token errors
    if (error.message.includes("Failed to decode token decimals")) {
      return "Error with token: The specified token contract does not support the required decimals interface. Please check the token address.";
    }

    // Check for permission errors
    if (error.message.includes("not authorized")) {
      return "Authorization error: You do not have permission to perform this action.";
    }

    // Check for GraphQL errors
    if (error.message.includes("[GraphQL]")) {
      return `Server error: ${error.message.split("[GraphQL]")[1].trim()}`;
    }

    return error.message;
  }

  // Handle unknown error types
  return "An unknown error occurred. Please try again later.";
}

/**
 * Log detailed error information to console for debugging
 */
export function logLensError(action: string, error: any): void {
  console.error(`Lens Protocol error during ${action}:`, error);

  // Log additional error details if available
  if (error?.response) {
    console.error("Response details:", error.response);
  }

  if (error?.request) {
    console.error("Request details:", {
      method: error.request.method,
      url: error.request.url,
    });
  }
}
