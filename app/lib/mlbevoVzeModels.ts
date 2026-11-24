import type { Vehicle } from "../data/catalog";
import type { VzeVariantDraft } from "./vzeVariantDrafts";

export const MLBEVO_VZE_CODING_ID = "mlbevo-vze-pdf";

export const TOUAREG_CR_GUIDE_VEHICLE: Vehicle = {
  brand: "Volkswagen",
  model: "Touareg CR",
  startYear: 2018,
  endYear: 2026,
  platform: "MLBevo",
};

const models = [
  { model: "A4 / S4 B9", slug: "audi-a4-b9-8w", name: "Audi A4 B9", code: "8W" },
  { model: "A5 / S5 F5", slug: "audi-a5-f5", name: "Audi A5", code: "F5" },
  { model: "A6 / S6 C8", slug: "audi-a6-c8-4a", name: "Audi A6 C8", code: "4A" },
  { model: "A7 / S7 4K", slug: "audi-a7-c8-4k", name: "Audi A7 C8", code: "4K" },
  { model: "A8 D5 (4N)", slug: "audi-a8-d5-4n", name: "Audi A8 D5", code: "4N" },
  { model: "Q5 FY", slug: "audi-q5-fy", name: "Audi Q5", code: "FY" },
  { model: "Q7 4M", slug: "audi-q7-4m", name: "Audi Q7", code: "4M" },
  { model: "Q8 4M", slug: "audi-q8-4m", name: "Audi Q8", code: "4M", reviewOnly: true },
  { model: "e-tron GE", slug: "audi-e-tron-ge", name: "Audi e-tron", code: "GE", reviewOnly: true },
  { model: TOUAREG_CR_GUIDE_VEHICLE.model, slug: "vw-touareg-iii-cr", name: "VW Touareg III", code: "CR" },
] satisfies { model: string; slug: string; name: string; code: string; reviewOnly?: boolean }[];

export const MLBEVO_VZE_PRODUCTS = models.map(model => ({
  ...model,
  platform: "MLBevo" as const,
  filename: model.slug + "_vze_anleitung.pdf",
  productId: "vze-" + model.slug,
  sku: "TD-VZE-" + model.slug.toUpperCase(),
  sha256: "",
})) satisfies VzeVariantDraft[];

export function mlbevoVzeGuideForVehicle(vehicle: Vehicle) {
  if (vehicle.platform !== "MLBevo") return undefined;
  return MLBEVO_VZE_PRODUCTS.find(product => product.model === vehicle.model);
}
