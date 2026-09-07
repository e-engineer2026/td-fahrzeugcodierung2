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

export const codingCatalog: Coding[] = baseCodingCatalog.map((coding) => {
  if (!smartphoneIntegrationPattern.test(coding.name)) return coding;

  return {
    ...coding,
    name: smartphoneIntegrationName,
    price: 35,
    hardware: smartphoneIntegrationHardware,
    requirements: undefined,
  };
});
