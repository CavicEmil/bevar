import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [pending, setPending] = useState(0);

  const start = useCallback(() => setPending((n) => n + 1), []);
  const end = useCallback(() => setPending((n) => Math.max(0, n - 1)), []);

  return (
    <LoadingContext.Provider value={{ pending, start, end }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used inside <LoadingProvider>");
  }
  return context;
}