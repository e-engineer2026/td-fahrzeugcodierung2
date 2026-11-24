export const SERVICE_STATES = ["requested", "review", "quoted", "scheduled", "in_progress", "completed", "cancelled"] as const;
export type ServiceState = typeof SERVICE_STATES[number];
export type ServiceMode = "onsite" | "remote";
export type ServiceRequest = { brand: string; model: string; year: number; mode: ServiceMode; services: string };

const brands = new Set(["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA"]);

export function validateServiceRequest(value: unknown): ServiceRequest | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const brand = typeof data.brand === "string" ? data.brand.trim() : "";
  const model = typeof data.model === "string" ? data.model.trim() : "";
  const services = typeof data.services === "string" ? data.services.trim() : "";
  const year = data.year;
  const mode = data.mode;
  if (!brands.has(brand) || model.length < 2 || model.length > 120 ||
      services.length < 5 || services.length > 2000 ||
      typeof year !== "number" || !Number.isInteger(year) || year < 1980 || year > 2027 ||
      (mode !== "onsite" && mode !== "remote")) return null;
  return { brand, model, services, year, mode };
}

export function canTransitionServiceOrder(from: string, to: string): boolean {
  if (from === "completed" || from === "cancelled" || from === to) return false;
  if (to === "cancelled") return SERVICE_STATES.includes(from as ServiceState);
  const flow = ["requested", "review", "quoted", "scheduled", "in_progress", "completed"];
  return flow.indexOf(from) >= 0 && flow.indexOf(to) > flow.indexOf(from);
}
