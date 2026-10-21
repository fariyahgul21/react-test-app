import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async API function and tracks loading / error / data.
 * Usage: const { data, loading, error, refetch } = useFetch(getDashboardStats);
 */
export function useFetch(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiFn());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}
