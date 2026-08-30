import {
  codingCatalog,
  codingGroups,
  vehicles as baseVehicles,
  brands,
  codingsForVehicle as baseCodingsForVehicle,
} from "./catalog6";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog6";

export type { Coding, CodingGroup, Platform, Vehicle };
export { codingCatalog, codingGroups, brands };

const caddyVehicles: Vehicle[] = [
  {
    brand: "Volkswagen",
    model: "Caddy III / IV (2K / SA)",
    startYear: 2003,
    endYear: 2020,
    platform: "PQ35",
  },
  {
    brand: "Volkswagen",
    model: "Caddy V (SB)",
    startYear: 2020,
    endYear: 2026,
    platform: "MQBevo",
    sfd1From: 2020,
  },
];

// Caddy wird als eigene Baureihe ergänzt. Da die bisherige Standard-Codierquelle
// keine eigene Caddy-Liste enthält, werden zunächst keine fremden Modelllisten
// übernommen. Diagnose bleibt verfügbar; weitere Funktionen werden separat geprüft.
export const vehicles: Vehicle[] = [
  ...baseVehicles.filter(
    (vehicle) =>
      !(vehicle.brand === "Volkswagen" && vehicle.model.startsWith("Caddy"))
  ),
  ...caddyVehicles,
];

export function codingsForVehicle(vehicle: Vehicle): string[] {
  if (vehicle.brand === "Volkswagen" && vehicle.model.startsWith("Caddy")) {
    return ["diagnose"];
  }
  return baseCodingsForVehicle(vehicle);
}
