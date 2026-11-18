import { type FormEvent, type KeyboardEvent, useId } from "react";
import { Button } from "../../../design-system/atoms/Button";
import { Textarea } from "../../../design-system/atoms/Textarea";
import { MAX_MESSAGE_CHARS } from "../model/suggestions";

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  busy: boolean;
};

export function ChatComposer({ value, onChange, onSubmit, busy }: ChatComposerProps) {
  const inputId = useId();
  const canSend = value.trim().length > 0 && !busy;

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (canSend) onSubmit(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="shrink-0 border-t border-line px-5 py-4">
      <div className="mx-auto flex max-w-[720px] items-end gap-2">
        <label htmlFor={inputId} className="sr-only">
          Mensaje para NEXUS
        </label>
        <Textarea
          id={inputId}
          value={value}
          maxLength={MAX_MESSAGE_CHARS}
          placeholder="Escribe a NEXUS…"
          aria-describedby={`${inputId}-hint`}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <span id={`${inputId}-hint`} className="sr-only">
          Enter para enviar, Shift más Enter para salto de línea.
        </span>
        <Button type="submit" variant="primary" disabled={!canSend}>
          Enviar
        </Button>
      </div>
    </form>
  );
}
