import {
  codingCatalog as baseCodingCatalog,
  codingGroups,
  vehicles,
  brands,
  codingsForVehicle as baseCodingsForVehicle,
} from "./catalog8Base";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog8Base";

export type { Coding, CodingGroup, Platform, Vehicle };
export { codingGroups, vehicles, brands };

const smartphoneIntegrationPattern = /(wireless carplay|apple.*carplay|carplay.*aktivier|carplay.*freischalt|android auto|mirrorlink|smartphone.*integration)/i;
const smartphoneIntegrationName = "Apple CarPlay / Android Auto Wireless freischalten";
const smartphoneIntegrationHardware = "Kompatibles Infotainmentsystem/Smartphone-Schnittstelle; Funktionsfreigabe muss vom System unterstützt werden.";
const assistanceLightPattern = /(fernlichtassistent|light assist|dynamic light assist|dynamischer lichtassistent|matrix led|matrix-licht|matrix licht)/i;
const reducedAssistancePattern = /(verkehrszeichenerkennung|\bvze\b|traffic jam assist|stauassistent|\btja\b)/i;

const mqbevoLaneCodings: Coding[] = [
  {
    id: "mqbevo-lane-onstate",
    name: "Spurhalteassistent / Spurverlassenwarnung – Einschaltzustand anpassen",
    price: 29,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Kamera- und Softwarestand",
    hardware: "Spurhalteassistent / Frontkamera muss bereits vorhanden sein.",
    requirements: "Nur bei unterstütztem MQB-evo-Steuergerät und Softwarestand.",
  },
  {
    id: "mqbevo-adaptive-lane",
    name: "Adaptive Spurführung aktivieren",
    price: 29,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    interfaceInfo: "VCDS – abhängig von Kamera- und Softwarestand",
    hardware: "Geeignete Frontkamera und kompatibles Fahrerassistenz-Steuergerät erforderlich.",
    requirements: "Nur bei unterstütztem MQB-evo-Steuergerät. Nicht möglich bei Fahrzeugen mit Travel Assist ab Werk.",
  },
];

export const codingCatalog: Coding[] = [
  ...baseCodingCatalog.map((coding) => {
    if (smartphoneIntegrationPattern.test(coding.name)) {
      return {
        ...coding,
        name: smartphoneIntegrationName,
        price: 35,
        hardware: smartphoneIntegrationHardware,
        requirements: undefined,
      };
    }

    if (assistanceLightPattern.test(coding.name) || reducedAssistancePattern.test(coding.name)) {
      return {
        ...coding,
        price: Math.max(0, coding.price - 10),
      };
    }

    return coding;
  }),
  ...mqbevoLaneCodings,
];

export function codingsForVehicle(vehicle: Vehicle): string[] {
  const baseIds = baseCodingsForVehicle(vehicle);
  if (vehicle.platform === "MQBevo") {
    return Array.from(new Set([...baseIds, ...mqbevoLaneCodings.map((coding) => coding.id)]));
  }
  return baseIds;
}
