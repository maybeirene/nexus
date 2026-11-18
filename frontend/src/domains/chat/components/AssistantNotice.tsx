import { Alert } from "../../../design-system/molecules/Alert";
import { Button } from "../../../design-system/atoms/Button";
import { useHealth } from "../../system/context/useHealth";

/** Explica por qué el asistente no puede responder y cómo arreglarlo. */
export function AssistantNotice() {
  const { status, refresh } = useHealth();
  if (status.state === "ready" || status.state === "checking") return null;

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-3">
      <Alert
        tone={status.state === "offline" ? "danger" : "warning"}
        title={status.label}
        action={
          <Button size="sm" onClick={() => void refresh()}>
            Comprobar de nuevo
          </Button>
        }
      >
        <code className="font-sans break-words">{status.hint}</code>
      </Alert>
    </div>
  );
}
