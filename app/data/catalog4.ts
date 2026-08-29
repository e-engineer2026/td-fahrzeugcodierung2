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

// Standard-, Komfort-, Licht-, Infotainment- und Fahrdynamikfunktionen bleiben
// aus dem bisherigen modellbezogenen Katalog erhalten. Assistenzsysteme werden
// separat als VCDS-Kandidatenliste gepflegt und immer vorab fahrzeugspezifisch geprüft.
const standardCatalog = baseCodingCatalog.filter((coding) => coding.uiGroup !== "Assistenz");

const vcdsAssistCatalog: Coding[] = [
  {
    id: "vcds-lane-activate",
    name: "Lane Assist / Spurhalteassistent aktivieren",
    price: 69,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – fahrzeug- und steuergeräteabhängig",
    hardware: "Geeignete Frontkamera und kompatibles Fahrerassistenz-Steuergerät erforderlich.",
    requirements: "Nur nach VCDS-Vorprüfung. Je nach Fahrzeug können Parametrierung, Grundeinstellung und Kamerakalibrierung erforderlich sein.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-lane-memory",
    name: "Lane Assist – letzte Einstellung speichern",
    price: 29,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Kamera- und Softwarestand",
    hardware: "Lane Assist / Frontkamera muss bereits vorhanden sein.",
    requirements: "Anpassung nur bei unterstütztem Steuergerät und Softwarestand.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-lane-warning",
    name: "Lane Assist – Warnintensität / Eingriffszeitpunkt anpassen",
    price: 29,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Kamera- und Softwarestand",
    hardware: "Lane Assist / Frontkamera muss bereits vorhanden sein.",
    requirements: "Nur sofern die entsprechenden Anpassungskanäle im Fahrzeug vorhanden sind.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-fla",
    name: "Fernlichtassistent / Light Assist (FLA) aktivieren",
    price: 59,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – fahrzeug- und steuergeräteabhängig",
    hardware: "Geeignete Kamera/Sensorik, kompatibles Bordnetz und unterstützte Scheinwerfer erforderlich.",
    requirements: "Vorprüfung von Kamera, Bordnetz, Scheinwerfern und Softwarestand erforderlich.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-dla",
    name: "Dynamic Light Assist (DLA) aktivieren",
    price: 79,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – nur bei geeigneter Licht- und Kamera-Hardware",
    hardware: "Frontkamera sowie DLA-/Matrix-fähige Scheinwerfer und passende Lichtsteuergeräte erforderlich.",
    requirements: "Nicht bei jeder Scheinwerfervariante codierbar; Vorprüfung zwingend erforderlich.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-acc",
    name: "ACC – Adaptive Cruise Control aktivieren / anpassen",
    price: 69,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Radar, Gateway und Softwarestand",
    hardware: "Kompatibler Frontradar-Sensor und unterstützte Brems-/Motor-/Gateway-Steuergeräte erforderlich.",
    requirements: "Bei Nachrüstung können zusätzliche Parametrierung und Kalibrierung erforderlich sein.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-acc-mode",
    name: "ACC / GRA / Limiter – Moduswechsel freischalten",
    price: 39,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Lenksäulenelektronik und ACC/GRA-Hardware",
    hardware: "Passende Bedienelemente sowie kompatible ACC-/GRA-Steuergeräte erforderlich.",
    requirements: "Funktionsumfang hängt von Fahrzeug, Bedienteil und Softwarestand ab.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-pacc",
    name: "pACC – prädiktive ACC-Funktionen aktivieren / anpassen",
    price: 89,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – nur bei unterstützter Plattform und Software",
    hardware: "ACC/Radar, Frontkamera und kompatibles Navigations-/Infotainmentsystem erforderlich.",
    requirements: "Nur nach vollständiger Vorprüfung; nicht bei jedem MQB/MLB-Fahrzeug verfügbar.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-vze",
    name: "Verkehrszeichenerkennung aktivieren",
    price: 59,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Frontkamera, Kombiinstrument und Infotainment",
    hardware: "Geeignete Frontkamera sowie kompatibles Kombiinstrument/Infotainment erforderlich.",
    requirements: "Vorprüfung der Kamera-, Navigations- und Anzeigeunterstützung erforderlich.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-front-assist",
    name: "Front Assist – Einstellungen anpassen",
    price: 39,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Radar und Softwarestand",
    hardware: "Front-Assist-/ACC-Radarsensor muss bereits vorhanden sein.",
    requirements: "Nur vorhandene, vom Steuergerät unterstützte Anpassungen werden angeboten.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-park-assist",
    name: "Park-/Einparkassistenz aktivieren / anpassen",
    price: 59,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von PDC/PLA-Steuergerät und Sensorik",
    hardware: "Passende Ultraschallsensoren, PDC/PLA-Steuergerät und unterstützte Lenkhilfe erforderlich.",
    requirements: "Nachrüstung kann zusätzliche Sensorik, Parametrierung und Grundeinstellung erfordern.",
    sourceUrl: VCDS_WIKI_HOME,
  },
  {
    id: "vcds-rear-view",
    name: "Rückfahrkamera / Rear View aktivieren",
    price: 49,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Kamera und Infotainment",
    hardware: "Rückfahrkamera, Verkabelung und kompatibles Infotainment müssen vorhanden sein.",
    requirements: "Je nach Kamerasystem kann zusätzlich Parametrierung oder Kalibrierung erforderlich sein.",
    sourceUrl: VCDS_WIKI_HOME,
  },
];

export const codingCatalog: Coding[] = [
  ...standardCatalog,
  ...vcdsAssistCatalog,
];

const standardIds = new Set(standardCatalog.map((coding) => coding.id));
const assistIds = vcdsAssistCatalog.map((coding) => coding.id);

function getsVcdsAssistList(vehicle: Vehicle): boolean {
  if (vehicle.platform === "MQB") return true;
  if (vehicle.platform === "MLB") return true;
  if (vehicle.platform === "MLBevo" && !vehicle.sfd1From) return true;
  return false;
}

export function codingsForVehicle(vehicle: Vehicle): string[] {
  const standard = baseCodingsForVehicle(vehicle).filter((id) => standardIds.has(id));
  return getsVcdsAssistList(vehicle) ? [...standard, ...assistIds] : standard;
}
