import { Badge} from "../../../design-system/atoms/Badge";
import { useReminders } from "../hooks/useReminders";
import { ReminderForm } from "@/domains/reminders/components/ReminderForm";
import { ReminderItem } from "@/domains/reminders/components/ReminderItem";
import { Panel } from "../../../design-system/organisms/Panel";
import { ScrollArea } from "../../../design-system/atoms/ScrollArea";
import { EmptyState } from "../../../design-system/molecules/EmptyState";

export function RemindersPanel() {
  const { reminders, pending, add, toggle, remove } = useReminders();

  return (
    <Panel
      title="Recordatorios"
      className="min-h-64 flex-1 md:min-h-0"
      bodyClassName="gap-2"
      action={<Badge>{pending} pendientes</Badge>}
    >
      <ReminderForm onAdd={add} />
      <ScrollArea className="-mx-1">
        {reminders.length === 0 ? (
          <EmptyState title="Todo al día" description="Añade lo que no quieras olvidar." />
        ) : (
          <ul aria-label="Lista de recordatorios">
            {reminders.map((reminder) => (
              <ReminderItem key={reminder.id} reminder={reminder} onToggle={toggle} onRemove={remove} />
            ))}
          </ul>
        )}
      </ScrollArea>
    </Panel>
  );
}
