import {
  codingCatalog as baseCodingCatalog,
  codingGroups,
  vehicles,
  brands,
  codingsForVehicle as baseCodingsForVehicle,
} from "./catalog3";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog3";

export type { Coding, CodingGroup, Platform, Vehicle };
export { vehicles, brands, codingGroups };

export const VCDS_WIKI_HOME = "https://wiki-online.vcds.de/de/home";

// Assistenzsysteme werden bewusst nicht aus der ASCoding-Quelle abgeleitet.
// Die bestehende Funktionsauswahl bleibt als Kandidatenliste erhalten, wird aber
// ausschließlich mit der VCDS.de-Wiki als Referenz und mit Vorprüfung angeboten.
export const codingCatalog: Coding[] = baseCodingCatalog.map((coding) => {
  if (coding.uiGroup !== "Assistenz") return coding;

  return {
    ...coding,
    sourceUrl: VCDS_WIKI_HOME,
    interfaceInfo: "VCDS – abhängig von Steuergerät, Softwarestand und vorhandener Assistenzhardware",
    requirements:
      "Assistenzfunktion wird vor Durchführung anhand Fahrzeug, Steuergerät, Softwarestand und VCDS.de-Wiki geprüft. Je nach System können Grundeinstellung oder Kalibrierung erforderlich sein.",
  };
});

const availableIds = new Set(codingCatalog.map((coding) => coding.id));

export function codingsForVehicle(vehicle: Vehicle): string[] {
  return baseCodingsForVehicle(vehicle).filter((id) => availableIds.has(id));
}
