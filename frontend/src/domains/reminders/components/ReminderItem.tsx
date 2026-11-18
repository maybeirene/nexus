import { X } from "lucide-react";
import { useId } from "react";
import { Checkbox } from "../../../design-system/atoms/Checkbox";
import { cn } from "../../../design-system/lib/cn";
import { IconButton } from "../../../design-system/atoms/IconButton";
import type { Reminder } from "../model/reminder";

type ReminderItemProps = {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function ReminderItem({ reminder, onToggle, onRemove }: ReminderItemProps) {
  const inputId = useId();
  return (
    <li className="group flex items-start gap-3 rounded-inner px-1 py-2 hover:bg-elevated/50">
      <Checkbox id={inputId} checked={reminder.done} onChange={() => onToggle(reminder.id)} className="mt-0.5" />
      <label
        htmlFor={inputId}
        className={cn("min-w-0 flex-1 cursor-pointer break-words", reminder.done ? "text-muted line-through" : "text-fg")}
      >
        {reminder.text}
      </label>
      <IconButton
        icon={X}
        aria-label={`Borrar «${reminder.text}»`}
        onClick={() => onRemove(reminder.id)}
        className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100"
      />
    </li>
  );
}
