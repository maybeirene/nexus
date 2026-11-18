export type NotificationLevel = "info" | "success" | "warning" | "danger";

export type Notification = {
  id: string;
  title: string;
  level: NotificationLevel;
  createdAt: Date;
  read: boolean;
};

export const LEVEL_LABEL: Record<NotificationLevel, string> = {
  info: "Información",
  success: "Correcto",
  warning: "Aviso",
  danger: "Error",
};

const minutesBefore = (now: Date, minutes: number) => new Date(now.getTime() - minutes * 60_000);

export function seedNotifications(now: Date): Notification[] {
  return [
    {
      id: "n-1",
      title: "La reunión de las 16:00 se ha movido a las 17:00",
      level: "warning",
      createdAt: minutesBefore(now, 2),
      read: false,
    },
    { id: "n-2", title: "Nuevo mensaje del agente de tareas", level: "info", createdAt: minutesBefore(now, 25), read: true },
    {
      id: "n-3",
      title: "No se ha podido sincronizar el calendario",
      level: "danger",
      createdAt: minutesBefore(now, 90),
      read: false,
    },
    { id: "n-4", title: "Copia de seguridad completada", level: "success", createdAt: minutesBefore(now, 300), read: true },
  ];
}

export function markRead(list: Notification[], id: string): Notification[] {
  return list.map((item) => (item.id === id ? { ...item, read: true } : item));
}

export function markAllRead(list: Notification[]): Notification[] {
  return list.map((item) => (item.read ? item : { ...item, read: true }));
}

export function dismiss(list: Notification[], id: string): Notification[] {
  return list.filter((item) => item.id !== id);
}

export function countUnread(list: Notification[]): number {
  return list.filter((item) => !item.read).length;
}
