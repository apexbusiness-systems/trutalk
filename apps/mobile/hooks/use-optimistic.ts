import { useState, useCallback } from 'react';

/**
 * Optimistic UI hook for immediate feedback
 * Updates UI immediately, then syncs with server
 */
export function useOptimistic<T>(
  initialValue: T,
  updateFn: (value: T) => Promise<T>
) {
  const [value, setValue] = useState<T>(initialValue);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (optimisticValue: T) => {
      // Optimistically update UI
      setValue(optimisticValue);
      setIsPending(true);
      setError(null);

      try {
        // Sync with server
        const serverValue = await updateFn(optimisticValue);
        setValue(serverValue);
        return serverValue;
      } catch (err) {
        // Rollback on error
        setValue(initialValue);
        setError(err instanceof Error ? err : new Error('Update failed'));
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [updateFn, initialValue]
  );

  return { value, update, isPending, error };
}

