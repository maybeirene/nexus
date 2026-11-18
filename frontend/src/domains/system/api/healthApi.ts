import { request } from "../../../shared/api/http";
import type { Health } from "../model/health";

export function getHealth(signal?: AbortSignal): Promise<Health> {
  return request<Health>("/api/v1/health", { signal });
}
