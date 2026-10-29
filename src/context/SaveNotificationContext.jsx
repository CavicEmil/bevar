import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ButtonIcon } from "../components/ui/Button";

const SaveNotificationContext = createContext(null);

export function SaveNotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const timer = useRef(null);
  const sequence = useRef(0);

  const notifySave = useCallback((saved) => {
    clearTimeout(timer.current);
    setNotification({ saved, id: ++sequence.current });
    timer.current = setTimeout(() => setNotification(null), 1500);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <SaveNotificationContext.Provider value={notifySave}>
      {children}
      <div className="save-notification-region" role="status" aria-live="polite" aria-atomic="true">
        {notification && (
          <div className="save-notification" key={notification.id}>
            <ButtonIcon name="saved" filled={notification.saved} />
            <span>{notification.saved ? "Saved to favourites" : "Removed from favourites"}</span>
          </div>
        )}
      </div>
    </SaveNotificationContext.Provider>
  );
}

export function useSaveNotification() {
  return useContext(SaveNotificationContext);
}
