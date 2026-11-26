import type { Vehicle } from "../data/catalog";
import { catalogDocumentSlug } from "./guideCatalogLinks";
import { guidePriceTiers } from "./guidePricing";
import { codingEffortStep } from "./codingEffort";
import { TOUAREG_CR_GUIDE_VEHICLE } from "./mlbevoVzeModels";

type AffectedModel = string | readonly [model: string, firstYear: number, lastYear: number];

const platforms: ReadonlyArray<{
  key: string;
  label: string;
  models: readonly AffectedModel[];
}> = [
  { key: "pq25", label: "PQ25", models: [
    ["Polo 6R", 2009, 2014], ["SEAT Ibiza IV (6J / 6P)", 2008, 2015],
  ] },
  { key: "pq26", label: "PQ26", models: [
    ["Polo 6R", 2014, 2017], ["SEAT Ibiza IV (6J / 6P)", 2015, 2017], "Fabia 3 NJ",
  ] },
  { key: "pq35", label: "PQ35", models: [
    "Golf 5 (1K)", ["Touran 1T", 2003, 2006], ["Tiguan 5N", 2007, 2011],
    ["A3 / S3 8P", 2003, 2008], ["SEAT Leon 1P", 2005, 2009],
  ] },
  { key: "pq36", label: "PQ36", models: [
    "Golf 6 (1K)", ["Touran 1T", 2010, 2015], ["Tiguan 5N", 2011, 2016],
    ["A3 / S3 8P", 2008, 2013], ["SEAT Leon 1P", 2009, 2012],
  ] },
  { key: "mqb-a0", label: "MQB-A0", models: [
    "Polo AW", "T-Cross C1", "Fabia IV (PJ)", "Scala NW", "Kamiq NW", "SEAT Ibiza KJ", "SEAT Arona KJ7",
  ] },
  { key: "mqb", label: "MQB", models: [
    "Golf 7 (5G)", "Passat B8 (3G)", "Tiguan II (AD/BW)", "Touran 5T", "Octavia 3 5E",
    "Octavia 3 5E Facelift", "Superb 3V", "Kodiaq NS", "SEAT Leon 5F", "SEAT Ateca KH7", "SEAT Tarraco KN2",
  ] },
  { key: "mqb-evo", label: "MQB evo", models: [
    "Golf 8 (CD)", "Passat B9", "Tiguan III (CT)", "Octavia 4 NX", "Superb IV (3Y)",
    "Kodiaq II (PS)", "SEAT Leon KL", "CUPRA Formentor KM",
  ] },
  { key: "meb", label: "MEB", models: [
    "ID.3 (E11)", "ID.4 (E21)", "ID.5 (E39)", "ID.6", "ID.7", "ID. Buzz (EB)",
    "Q4 e-tron (FZ)", "Enyaq 5A", "CUPRA Born K11",
  ] },
  { key: "mlb", label: "MLB", models: [
    "A4 / S4 8K", "A5 / S5 8T", "A6 / S6 C7", "A7 / S7 4G", "A8 D4 (4H)", "Q5 8R", "Touareg 7P",
  ] },
  { key: "mlb-evo", label: "MLB evo", models: [
    "A4 / S4 B9", "A5 / S5 F5", "A6 / S6 C8", "A7 / S7 4K", "A8 D5 (4N)", "Q5 FY",
    TOUAREG_CR_GUIDE_VEHICLE.model,
  ] },
];

export const AHK_ADDITIONAL_GUIDE_VEHICLES: readonly Vehicle[] = [
  { brand: "SEAT / CUPRA", model: "SEAT Ibiza IV (6J / 6P)", startYear: 2008, endYear: 2017, platform: "PQ25" },
  { brand: "Škoda", model: "Fabia IV (PJ)", startYear: 2021, endYear: 2026, platform: "MQB-A0" },
  { brand: "Volkswagen", model: "Tiguan III (CT)", startYear: 2024, endYear: 2026, platform: "MQBevo" },
  { brand: "Škoda", model: "Superb IV (3Y)", startYear: 2024, endYear: 2026, platform: "MQBevo" },
  { brand: "Volkswagen", model: "ID.6", startYear: 2021, endYear: 2026, platform: "MEB" },
  { brand: "Volkswagen", model: "ID.7", startYear: 2023, endYear: 2026, platform: "MEB" },
  { brand: "Volkswagen", model: "ID. Buzz (EB)", startYear: 2022, endYear: 2026, platform: "MEB" },
];

const name = "Anhängerkupplung (AHK) nach Nachrüstung codieren";
const step = codingEffortStep(name) ?? 0;
const category = "Nachrüstungen" as const;
export const AHK_GUIDE_PRODUCTS = platforms.map(({ key, label, models }) => {
  const slug = catalogDocumentSlug(label, "ahk-nachruestung");
  return {
    id: slug, productId: slug, slug, name,
    title: name + " · " + label, model: label, category, models,
    sku: "TD-AHK-" + key.toUpperCase(),
    filename: key + "_anhaengerkupplung_codieren.pdf",
    priceCents: Math.round(guidePriceTiers[step] * 100), step,
    sha256: "", revision: "1.0",
  };
});

export function ahkGuidesForVehicle(model: string, year?: number) {
  return AHK_GUIDE_PRODUCTS.filter(product => product.models.some(entry => {
    if (typeof entry === "string") return entry === model;
    const [name, firstYear, lastYear] = entry;
    return name === model && (year === undefined || (year >= firstYear && year <= lastYear));
  }));
}
