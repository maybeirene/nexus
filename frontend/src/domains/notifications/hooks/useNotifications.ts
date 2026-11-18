import { useCallback, useState } from "react";
import { countUnread, dismiss, markAllRead, markRead, seedNotifications } from "../model/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState(() => seedNotifications(new Date()));

  return {
    notifications,
    unread: countUnread(notifications),
    markRead: useCallback((id: string) => setNotifications((list) => markRead(list, id)), []),
    markAllRead: useCallback(() => setNotifications(markAllRead), []),
    dismiss: useCallback((id: string) => setNotifications((list) => dismiss(list, id)), []),
  };
}
