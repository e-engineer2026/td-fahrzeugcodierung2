export const homeVehicleSelectedEvent = "td:home-vehicle-selected";
export const homeVehicleUpdatedEvent = "td:home-vehicle-updated";
export const homeVehicleReadyEvent = "td:home-vehicle-ready";
export const vehiclePrefillStorageKey = "td_vehicle_prefill";

export type HomeVehicleSelection = {
  brand: string;
  model: string;
  year: number;
  mode: "onsite" | "remote";
};

type VehicleChoice = { brand: string; model: string; startYear: number; endYear: number };

export function resolveHomeVehicleSelection(value: unknown, catalog: readonly VehicleChoice[]): HomeVehicleSelection | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const vehicle = catalog.find((item) => item.brand === input.brand && item.model === input.model);
  if (!vehicle) return null;
  const requestedYear = typeof input.year === "number" || typeof input.year === "string" ? Number(input.year) : 0;
  const year = Number.isInteger(requestedYear) && requestedYear >= vehicle.startYear && requestedYear <= vehicle.endYear ? requestedYear : 0;
  return { brand: vehicle.brand, model: vehicle.model, year, mode: input.mode === "remote" ? "remote" : "onsite" };
}

export function vehicleBookingHref(vehicle: { brand: string; model: string; year?: number }) {
  const params = new URLSearchParams({ brand: vehicle.brand, model: vehicle.model });
  if (vehicle.year) params.set("year", String(vehicle.year));
  return `/?${params.toString()}#fahrzeugauswahl`;
}
