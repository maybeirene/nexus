import { Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { IconButton } from "../../../design-system/atoms/IconButton";
import { Input } from "../../../design-system/atoms/Input";
import { MAX_REMINDER_CHARS } from "../model/reminder";

export function ReminderForm({ onAdd }: { onAdd: (text: string) => boolean }) {
  const [text, setText] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (onAdd(text)) setText("");
  };

  return (
    <form onSubmit={submit} className="flex shrink-0 gap-2">
      <Input
        value={text}
        maxLength={MAX_REMINDER_CHARS}
        onChange={(event) => setText(event.target.value)}
        placeholder="Añadir recordatorio"
        aria-label="Nuevo recordatorio"
        className="h-8"
      />
      <IconButton
        type="submit"
        icon={Plus}
        size="md"
        aria-label="Añadir recordatorio"
        disabled={!text.trim()}
        className="size-8"
      />
    </form>
  );
}
