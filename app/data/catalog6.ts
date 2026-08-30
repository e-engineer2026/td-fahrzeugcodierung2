import {
  codingCatalog as baseCodingCatalog,
  codingGroups,
  vehicles as baseVehicles,
  brands,
  codingsForVehicle as baseCodingsForVehicle,
} from "./catalog5";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog5";

export type { Coding, CodingGroup, Platform, Vehicle };
export { brands, codingGroups };

const GENERIC_REQUIREMENT =
  "Verfügbarkeit abhängig von Ausstattung, Modelljahr, Steuergerät, Softwarestand und vorhandener Hardware.";

// Den pauschalen Verfügbarkeitshinweis nicht mehr in jeder Codierkarte anzeigen.
// Spezifische Hardware-/Assistenzhinweise bleiben erhalten.
export const codingCatalog: Coding[] = baseCodingCatalog.map((coding) =>
  coding.requirements === GENERIC_REQUIREMENT
    ? { ...coding, requirements: undefined }
    : coding
);

// Quellenlinks bleiben in den internen Daten erhalten, werden aber nicht mehr
// als AS.Coding-Text im Fahrzeugbereich der Website ausgegeben.
export const vehicles: Vehicle[] = baseVehicles.map((vehicle) => ({
  ...vehicle,
  sourceUrl: undefined,
}));

export function codingsForVehicle(vehicle: Vehicle): string[] {
  return baseCodingsForVehicle(vehicle);
}
