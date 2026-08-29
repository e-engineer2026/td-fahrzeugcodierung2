import {
  codingCatalog as baseCodingCatalog,
  codingGroups,
  vehicles,
  brands,
  codingsForVehicle as broadCodingsForVehicle,
} from "./catalog4";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog4";

export type { Coding, CodingGroup, Platform, Vehicle };
export { vehicles, brands, codingGroups };

export const codingCatalog: Coding[] = baseCodingCatalog;

const assistIdSet = new Set(
  baseCodingCatalog.filter((coding) => coding.uiGroup === "Assistenz").map((coding) => coding.id)
);
const allAssistIds = Array.from(assistIdSet);

// MQB: breite VCDS-Kandidatenliste, weiterhin mit Hardware-/Software-Vorprüfung.
const mqbAssistIds = allAssistIds;

// MLB: konservativ nach Baureihe. Keine pauschalen MQB-spezifischen DLA-/pACC-/Limiter-Funktionen.
const mlbAssistByModel: Record<string, string[]> = {
  "Audi|A4 / S4 8K": [
    "vcds-lane-activate",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|A5 / S5 8T": [
    "vcds-lane-activate",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|Q5 8R": [
    "vcds-lane-activate",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|A6 / S6 C6": [
    "vcds-fla",
    "vcds-acc",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|A6 / S6 C7": [
    "vcds-lane-activate",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|A7 / S7 4G": [
    "vcds-lane-activate",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Volkswagen|Touareg 7P": [
    "vcds-lane-activate",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
};

// MLBevo ohne SFD: Audi-spezifisch konservativ. DLA-/Limiter-Begriffe werden nicht pauschal übernommen.
const mlbevoAssistByModel: Record<string, string[]> = {
  "Audi|A4 / S4 B9": [
    "vcds-lane-activate",
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|A5 / S5 F5": [
    "vcds-lane-activate",
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|Q5 FY": [
    "vcds-lane-activate",
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|A6 / S6 C8": [
    "vcds-lane-activate",
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|A7 / S7 4K": [
    "vcds-lane-activate",
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|Q7 4M": [
    "vcds-lane-activate",
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|Q8 4M": [
    "vcds-lane-activate",
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
  "Audi|e-tron GE": [
    "vcds-lane-memory",
    "vcds-lane-warning",
    "vcds-fla",
    "vcds-acc",
    "vcds-vze",
    "vcds-park-assist",
    "vcds-rear-view",
  ],
};

function keyFor(vehicle: Vehicle): string {
  return `${vehicle.brand}|${vehicle.model}`;
}

function assistIdsForVehicle(vehicle: Vehicle): string[] {
  if (vehicle.platform === "MQB") return mqbAssistIds;
  if (vehicle.platform === "MLB") return mlbAssistByModel[keyFor(vehicle)] ?? [];
  if (vehicle.platform === "MLBevo" && !vehicle.sfd1From) {
    return mlbevoAssistByModel[keyFor(vehicle)] ?? [];
  }
  return [];
}

export function codingsForVehicle(vehicle: Vehicle): string[] {
  const broad = broadCodingsForVehicle(vehicle);
  const standard = broad.filter((id) => !assistIdSet.has(id));
  return [...standard, ...assistIdsForVehicle(vehicle)];
}
