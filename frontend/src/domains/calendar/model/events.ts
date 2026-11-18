/** Días del mes con evento de ejemplo, hasta que exista la integración con el calendario. */
const SAMPLE_EVENT_DAYS = new Set([3, 9, 14, 21, 27]);

export function hasEvent(date: Date): boolean {
  return SAMPLE_EVENT_DAYS.has(date.getDate());
}
