import { Button } from "../../../design-system/atoms/Button";
import { EmptyState } from "../../../design-system/molecules/EmptyState";
import { Panel } from "../../../design-system/organisms/Panel";
import { ScrollArea } from "../../../design-system/atoms/ScrollArea";
import { useNow } from "../../../shared/hooks/useNow";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

export function NotificationsPanel() {
  const now = useNow(30_000);
  const { notifications, unread, markRead, markAllRead, dismiss } = useNotifications();

  return (
    <Panel
      title="Notificaciones"
      className="min-h-64 flex-1 md:min-h-0"
      action={
        unread > 0 ? (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Marcar leídas
          </Button>
        ) : null
      }
    >
      <ScrollArea className="-mx-1">
        {notifications.length === 0 ? (
          <EmptyState title="Sin avisos" description="Aquí verás lo que necesite tu atención." />
        ) : (
          <ul aria-label="Lista de notificaciones">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                now={now}
                onRead={markRead}
                onDismiss={dismiss}
              />
            ))}
          </ul>
        )}
      </ScrollArea>
    </Panel>
  );
}
