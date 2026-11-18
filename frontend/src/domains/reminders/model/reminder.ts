export type Reminder = {
  id: string;
  text: string;
  done: boolean;
};

export const REMINDERS_STORAGE_KEY = "nexus.todos";

export const MAX_REMINDER_CHARS = 200;

export function seedReminders(): Reminder[] {
  return [
    { id: "seed-1", text: "Calibrar sensores de navegación", done: false },
    { id: "seed-2", text: "Revisar informe de la flota", done: true },
    { id: "seed-3", text: "Llamar a la estación orbital", done: false },
  ];
}

export function createReminder(text: string, id: string = crypto.randomUUID()): Reminder | null {
  const clean = text.trim().slice(0, MAX_REMINDER_CHARS);
  return clean ? { id, text: clean, done: false } : null;
}

export function toggleReminder(list: Reminder[], id: string): Reminder[] {
  return list.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
}

export function removeReminder(list: Reminder[], id: string): Reminder[] {
  return list.filter((item) => item.id !== id);
}

export function countPending(list: Reminder[]): number {
  return list.filter((item) => !item.done).length;
}
