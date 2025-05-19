import { useState } from "react";
import { toast } from "sonner";

/**
 * A hook for polling transaction status until it completes
 */
export function usePollTransaction() {
  const [isPending, setIsPending] = useState(false);

  /**
   * Polls a transaction's status at regular intervals
   * @param hash The transaction hash to check
   * @param checkFn A function that checks if the transaction is complete
   * @param onComplete Callback to run when transaction completes
   * @param options Optional configuration
   */
  const pollTransactionStatus = async (
    hash: string,
    checkFn: (hash: string) => Promise<boolean>,
    onComplete: () => void,
    options?: {
      interval?: number; // Time between checks in ms
      maxChecks?: number; // Maximum number of checks
      toastId?: string | number; // Toast ID for updating existing toast
    },
  ) => {
    const interval = options?.interval ?? 3000; // Default: 3 seconds
    const maxChecks = options?.maxChecks ?? 10; // Default: 10 checks
    const toastId = options?.toastId;

    setIsPending(true);
    let checkCount = 0;

    const checkStatus = async () => {
      try {
        const isComplete = await checkFn(hash);

        if (isComplete || checkCount >= maxChecks) {
          setIsPending(false);
          if (checkCount >= maxChecks && !isComplete) {
            console.warn(`Transaction polling reached max attempts (${maxChecks})`);
          }
          onComplete();
        } else {
          checkCount++;
          setTimeout(checkStatus, interval);
        }
      } catch (error) {
        setIsPending(false);
        console.error("Error checking transaction status:", error);
        if (toastId) {
          toast.error("Failed to check transaction status", { id: toastId });
        } else {
          toast.error("Failed to check transaction status");
        }
      }
    };

    checkStatus();
  };

  return { isPending, pollTransactionStatus };
}
