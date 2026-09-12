import {
  codingCatalog as baseCodingCatalog,
  codingGroups,
  vehicles,
  brands,
  codingsForVehicle,
} from "./catalog8Base";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog8Base";

export type { Coding, CodingGroup, Platform, Vehicle };
export { codingGroups, vehicles, brands, codingsForVehicle };

const smartphoneIntegrationPattern = /(wireless carplay|apple.*carplay|carplay.*aktivier|carplay.*freischalt|android auto|mirrorlink|smartphone.*integration)/i;
const smartphoneIntegrationName = "Apple CarPlay / Android Auto Wireless freischalten";
const smartphoneIntegrationHardware = "Kompatibles Infotainmentsystem/Smartphone-Schnittstelle; Funktionsfreigabe muss vom System unterstützt werden.";
const assistanceLightPattern = /(fernlichtassistent|light assist|dynamic light assist|dynamischer lichtassistent|matrix led|matrix-licht|matrix licht)/i;
const reducedAssistancePattern = /(verkehrszeichenerkennung|\bvze\b|traffic jam assist|stauassistent|\btja\b)/i;

export const codingCatalog: Coding[] = baseCodingCatalog.map((coding) => {
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
});
