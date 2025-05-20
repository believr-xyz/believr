// Basic Lens error handling utilities

/**
 * Formats a Lens error into a user-friendly message
 */
export function formatLensError(error: unknown): string {
  if (!error) return "Unknown error";

  // Handle string errors
  if (typeof error === "string") return error;

  // Handle Error objects
  if (error instanceof Error) return error.message;

  // Handle Lens API errors which might be objects with a message property
  if (typeof error === "object" && error !== null) {
    // @ts-ignore - We don't know the exact shape of the error
    if (error.message) return error.message;

    // @ts-ignore - Try to get reason from Lens errors
    if (error.reason) return error.reason;
  }

  // Fallback for unexpected error formats
  return "An error occurred";
}

/**
 * Logs a Lens error to the console for debugging
 */
export function logLensError(action: string, error: unknown): void {
  console.error(`Error while ${action}:`, error);
}
