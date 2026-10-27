import { useEffect, useState } from "react";

export function useLoader(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ignore the result if this loader was superseded or unmounted
    let stale = false;

    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!stale) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("useLoader caught:", err);
        if (!stale) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      stale = true;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}

/* how to use:

const { data: recipes, loading, error } = useLoader(
  () => getRecipes(sort.column, sort.ascending),
  [sortKey]
);

*/