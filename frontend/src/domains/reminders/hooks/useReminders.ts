import { useCallback } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import {
  countPending,
  createReminder,
  REMINDERS_STORAGE_KEY,
  removeReminder,
  seedReminders,
  toggleReminder,
} from "../model/reminder";

export function useReminders() {
  const [reminders, setReminders] = useLocalStorage(REMINDERS_STORAGE_KEY, seedReminders);

  const add = useCallback(
    (text: string) => {
      const reminder = createReminder(text);
      if (!reminder) return false;
      setReminders((list) => [...list, reminder]);
      return true;
    },
    [setReminders],
  );

  const toggle = useCallback((id: string) => setReminders((list) => toggleReminder(list, id)), [setReminders]);
  const remove = useCallback((id: string) => setReminders((list) => removeReminder(list, id)), [setReminders]);

  return { reminders, pending: countPending(reminders), add, toggle, remove };
}
