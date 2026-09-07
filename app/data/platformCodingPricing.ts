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

export function pricePlatformSource(source: PlatformCodingSource): BasePricedPlatformCodingEntry[] {
  return basePricePlatformSource(source).map((entry) => {
    if (!smartphoneIntegrationPattern.test(entry.name)) return entry;

    return {
      ...entry,
      name: smartphoneIntegrationName,
      price: 35,
      uiGroup: "Infotainment",
      hardware: smartphoneIntegrationHardware,
    };
  });
}
