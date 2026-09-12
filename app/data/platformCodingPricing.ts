import type { PlatformCodingSource } from "./platformCodingLists";
import { pricePlatformSource as basePricePlatformSource } from "./platformCodingPricingBase";
import type { PricedPlatformCodingEntry as BasePricedPlatformCodingEntry } from "./platformCodingPricingBase";

export {
  platformCodingGroups,
  groupForPlatformCoding,
  priceForPlatformCoding,
  hardwareForPlatformCoding,
} from "./platformCodingPricingBase";

export type {
  PlatformCodingGroup,
  PricedPlatformCodingEntry,
} from "./platformCodingPricingBase";

const smartphoneIntegrationPattern = /(wireless carplay|apple.*carplay|carplay.*aktivier|carplay.*freischalt|android auto|mirrorlink|smartphone.*integration)/i;
const smartphoneIntegrationName = "Apple CarPlay / Android Auto Wireless freischalten";
const smartphoneIntegrationHardware = "Kompatibles Infotainmentsystem/Smartphone-Schnittstelle; Funktionsfreigabe muss vom System unterstützt werden.";
const assistanceLightPattern = /(fernlichtassistent|light assist|dynamic light assist|dynamischer lichtassistent|matrix led|matrix-licht|matrix licht)/i;
const reducedAssistancePattern = /(verkehrszeichenerkennung|\bvze\b|traffic jam assist|stauassistent|\btja\b)/i;

export function pricePlatformSource(source: PlatformCodingSource): BasePricedPlatformCodingEntry[] {
  return basePricePlatformSource(source).map((entry) => {
    if (smartphoneIntegrationPattern.test(entry.name)) {
      return {
        ...entry,
        name: smartphoneIntegrationName,
        price: 35,
        uiGroup: "Infotainment",
        hardware: smartphoneIntegrationHardware,
      };
    }

    if (assistanceLightPattern.test(entry.name) || reducedAssistancePattern.test(entry.name)) {
      return {
        ...entry,
        price: Math.max(0, entry.price - 10),
      };
    }

    return entry;
  });
}
