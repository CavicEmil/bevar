import { createContext, useContext, useState } from "react";

const ChromeContext = createContext(null);

export function ChromeProvider({ children }) {
  const [chromeless, setChromeless] = useState(false);
  return (
    <ChromeContext.Provider value={{ chromeless, setChromeless }}>
      {children}
    </ChromeContext.Provider>
  );
}


export function useChrome() {
  const context = useContext(ChromeContext);

  if (!context) {
    throw new Error("useChrome must be used inside <ChromeProvider>"); 
  }

  return context;
}