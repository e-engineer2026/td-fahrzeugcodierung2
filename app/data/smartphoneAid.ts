import type { Coding, Vehicle } from "./catalog8Base";

// Conditional offers, reviewed against upstream compatibility matrices on 2026-10-27.
// Model/year alone never establishes compatibility: the exact unit, train and cluster
// must be checked before accepting an order. MIB3 and SFD2 are not covered.
const profiles = {
  vw: {
    hardware: "Harman Discover Pro MIB2/MIB2.5 High und originales, kartentaugliches Active Info Display (AID 790/791/794) mit vorhandener MOST-Kartenverbindung. App-Connect muss bereits freigeschaltet sein; kompatibles Smartphone und USB-Datenverbindung erforderlich.",
    software: "CarPlay-Karte: unterstützte MHI2-Version MU1102 oder MU1367 mit passender AID-Variante. Android-Auto-Karte: MHI2_ER_VWG13_P4521 oder K4525; andere Versionen nur nach gesonderter Prüfung.",
    sourceUrl: "https://github.com/omonob/MHI2-Carplay-Maps",
  },
  skoda: {
    hardware: "Harman Columbus MIB2/MIB2.5 High und originales, kartentaugliches Virtual Cockpit (790) mit vorhandener MOST-Kartenverbindung. SmartLink muss bereits freigeschaltet sein; kompatibles Smartphone und USB-Datenverbindung erforderlich.",
    software: "CarPlay-Karte: unterstützte Škoda-MHI2-Version MU1440 mit 790-Kombiinstrument. Android-Auto-Karte: MHI2_ER_SKG13_P4526. Vollständigen Software-Train und Kombiinstrument vorab prüfen.",
    sourceUrl: "https://github.com/omonob/MHI2-Carplay-Maps",
  },
  seat: {
    hardware: "Harman Navi System Plus MIB2 High und originales, kartentaugliches Digital Cockpit mit vorhandener MOST-Kartenverbindung. Full Link muss bereits freigeschaltet sein; kompatibles Smartphone und USB-Datenverbindung erforderlich.",
    software: "Unterstützte Software-Trains MHI2_ER_SEG11_P4708 oder P4709. Android-Auto-Kartenanzeige und Abbiegehinweise je Software; CarPlay-Karte nur nach Prüfung der unterstützten Version und Darstellungsstabilität.",
    sourceUrl: "https://github.com/MacsInSpace/mib-cluster-map",
  },
  audiMhi2: {
    hardware: "MMI Navigation plus MIB2 High (Harman) und originales, kartentaugliches Audi Virtual Cockpit mit bestehender Kartenverbindung. Audi smartphone interface mit aktivem Apple CarPlay und iPhone per USB-Kabel erforderlich.",
    software: "A3 8V: MHI2_ER_AU37x_P5089 (MU1326). Q2: unterstütztes MHI2_AU276, beispielsweise P5088; vollständigen Train und Patch-Version vorab prüfen. Apple Karten/Google Maps unterstützen Abbiegehinweise; Waze nur Kartenanzeige. Android Auto ist in diesem Angebot für Audi nicht enthalten.",
    sourceUrl: "https://github.com/chefranov/mhi2-au37x-carplay",
  },
  audiMhi2q: {
    hardware: "MMI Navigation plus MIB2 High mit Qualcomm-Haupteinheit (MHI2Q) und originalem Audi Virtual Cockpit. Audi smartphone interface mit aktivem Apple CarPlay und iPhone per USB-Kabel erforderlich.",
    software: "Unterstützte europäische Software-Trains MHI2Q_ER_AUG22_P5092 oder P5152 (MU1329). Kein Angebot für andere MHI2-/MIB3-Geräte. Android Auto ist in diesem Angebot für Audi nicht enthalten.",
    sourceUrl: "https://github.com/luka-dev/mib2q-carplay-rgi",
  },
} as const;

const rules = [
  { brand: "Volkswagen", model: "Golf 7 (5G)", from: 2017, until: 2020, profile: "vw" },
  { brand: "Volkswagen", model: "Passat B8 (3G)", from: 2015, until: 2020, profile: "vw" },
  { brand: "Volkswagen", model: "Tiguan II (AD/BW)", from: 2016, until: 2020, profile: "vw" },
  { brand: "Volkswagen", model: "Arteon 3H", from: 2017, until: 2020, profile: "vw" },
  { brand: "Škoda", model: "Octavia 3 5E Facelift", from: 2018, until: 2020, profile: "skoda" },
  { brand: "Škoda", model: "Superb 3V", from: 2019, until: 2020, profile: "skoda" },
  { brand: "Škoda", model: "Kodiaq NS", from: 2018, until: 2020, profile: "skoda" },
  { brand: "Škoda", model: "Karoq NU", from: 2018, until: 2020, profile: "skoda" },
  { brand: "SEAT / CUPRA", model: "SEAT Leon 5F", from: 2018, until: 2020, profile: "seat" },
  { brand: "SEAT / CUPRA", model: "SEAT Ateca KH7", from: 2018, until: 2020, profile: "seat" },
  { brand: "SEAT / CUPRA", model: "CUPRA Ateca KH7", from: 2018, until: 2020, profile: "seat" },
  { brand: "SEAT / CUPRA", model: "SEAT Tarraco KN2", from: 2019, until: 2020, profile: "seat" },
  { brand: "Audi", model: "A3 / S3 8V", from: 2016, until: 2020, profile: "audiMhi2" },
  { brand: "Audi", model: "Q2 GA", from: 2016, until: 2023, profile: "audiMhi2" },
  { brand: "Audi", model: "A4 / S4 B9", from: 2017, until: 2019, profile: "audiMhi2q" },
  { brand: "Audi", model: "A5 / S5 F5", from: 2017, until: 2019, profile: "audiMhi2q" },
  { brand: "Audi", model: "Q5 FY", from: 2017, until: 2020, profile: "audiMhi2q" },
  { brand: "Audi", model: "Q7 4M", from: 2017, until: 2019, profile: "audiMhi2q" },
] as const;

export const smartphoneAidCodings: Coding[] = rules.map((rule, index) => {
  const profile = profiles[rule.profile];
  return {
    id: `smartphone-aid-${index + 1}`,
    name: "Smartphone-Navigation im Active Info Display",
    price: 49,
    category: "Standard-Codierungen",
    uiGroup: "Infotainment",
    hardware: profile.hardware,
    interfaceInfo: "Softwareinstallation am Infotainment nach Geräteprüfung und Sicherung des Originalzustands",
    sourceUrl: profile.sourceUrl,
  };
});

export function smartphoneAidForVehicle(vehicle: Pick<Vehicle, "brand" | "model">, year?: number) {
  const index = rules.findIndex((rule) => rule.brand === vehicle.brand && rule.model === vehicle.model && (year === undefined || (Number.isInteger(year) && year >= rule.from && year <= rule.until)));
  return index < 0 ? undefined : smartphoneAidCodings[index];
}

export function isSmartphoneAidId(id: string) {
  return /^(vehicle-)?smartphone-aid-\d+$/.test(id);
}
