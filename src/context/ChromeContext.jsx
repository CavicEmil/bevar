import { createContext, useContext, useState } from "react";

const ChromeContext = createContext({ chromeless: false, setChromeless: () => {} });

export function ChromeProvider({ children }) {
  const [chromeless, setChromeless] = useState(false);
  return (
    <ChromeContext.Provider value={{ chromeless, setChromeless }}>
      {children}
    </ChromeContext.Provider>
  );
}

export const useChrome = () => useContext(ChromeContext);