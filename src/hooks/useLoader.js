// hooks/useLoader.js
import { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";

export function useLoader(fetcher) {
  const { start, end } = useLoading();
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    start();                                  // ← report to the global counter

    fetcher()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (!cancelled) setState({ data: null, loading: false, error }); })
      .finally(() => { if (!cancelled) end(); });   // ← always release, even on error

    return () => { cancelled = true; end(); };      // ← and on unmount/cancel
  }, []);

  return state;
}