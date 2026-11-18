import { Alert } from "../../../design-system/molecules/Alert";
import { Button } from "../../../design-system/atoms/Button";
import { Panel } from "../../../design-system/organisms/Panel";
import { useWeather } from "../hooks/useWeather";
import { MADRID } from "../model/types";
import { ForecastDay } from "./ForecastDay";
import { WeatherCurrent } from "./WeatherCurrent";

export function WeatherPanel() {
  const { data, error, loading, reload } = useWeather(MADRID);

  return (
    <Panel title={`Tiempo · ${MADRID.name}`} className="shrink-0">
      {data ? (
        <div className="flex flex-col gap-3">
          <WeatherCurrent current={data.current} />
          <ul aria-label="Próximos días" className="grid grid-cols-3 gap-2 border-t border-line pt-3">
            {data.forecast.map((day) => (
              <ForecastDay key={day.date.toISOString()} day={day} />
            ))}
          </ul>
          {error ? <p className="text-caption text-warning">No se ha podido actualizar. Muestro el último dato.</p> : null}
        </div>
      ) : error ? (
        <Alert
          title="No he podido cargar el tiempo"
          action={
            <Button size="sm" onClick={() => void reload()} disabled={loading}>
              Reintentar
            </Button>
          }
        >
          {error.message} Lo intento de nuevo cada 15 minutos.
        </Alert>
      ) : (
        <p role="status" className="py-6 text-center text-caption text-muted">
          Cargando el tiempo…
        </p>
      )}
    </Panel>
  );
}
