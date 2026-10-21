import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const [phase, setPhase] = useState("idle"); // idle | cover | reveal
  const navigate = useNavigate();

  const trigger = useCallback((to) => {
    setPhase("cover");
    setTimeout(() => {
      navigate(to);
      setPhase("reveal");
      setTimeout(() => setPhase("idle"), 600);
    }, 350);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ trigger }}>
      {children}
      <JuiceTransition phase={phase} />  
    </TransitionContext.Provider>
  );
}
