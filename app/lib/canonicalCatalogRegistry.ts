import { createHash } from "node:crypto";
import { codingCatalog, codingsForVehicle, vehicles } from "../data/catalog";
import { catalogDocumentSlug } from "./guideCatalogLinks";
import { codingDocumentSlug, guideCategory } from "./guideCatalogDocuments";
import { guidePrice } from "./guidePricing";

export type CanonicalCatalogRow = {
  id: string;
  brand: string;
  model: string;
  codingId: string;
  title: string;
  yearFrom: number;
  yearTo: number;
  platform: string;
  category: string;
  servicePriceCents: number;
  pdfPriceCents: number;
  pdfSlug: string;
  hardware: string;
  requirements: string;
  sourceHash: string;
};

export function catalogModels(): string[] {
  return Array.from(new Set(vehicles.map(vehicle => vehicle.model))).sort((a, b) =>
    a.localeCompare(b, "de", { numeric: true }));
}

/** Import uses existing vehicle-price mapping as canonical *source*, never invents an ECU coding.
 * The database copy stays an internal review draft until a separate adoption rollout.
 */
export function canonicalRowsForModel(model: string): CanonicalCatalogRow[] {
  const vehicle = vehicles.find(item => item.model === model);
  if (!vehicle) return [];
  const codingIds = new Set(codingsForVehicle(vehicle));
  const rows = codingCatalog.filter(coding => codingIds.has(coding.id));
  return rows.map(coding => {
    const source = {
      brand: vehicle.brand,
      model: vehicle.model,
      codingId: coding.id,
      title: coding.name,
      yearFrom: vehicle.startYear,
      yearTo: vehicle.endYear,
      platform: vehicle.platform,
      category: guideCategory(coding),
      servicePriceCents: Math.round(coding.price * 100),
      pdfPriceCents: Math.round(guidePrice(coding) * 100),
      pdfSlug: codingDocumentSlug(vehicle, coding) ??
        catalogDocumentSlug(vehicle.model, "coding-" + coding.id),
      hardware: coding.hardware ?? "",
      requirements: coding.requirements ?? "",
    };
    const id = createHash("sha256").update(vehicle.brand + "\u0000" + model + "\u0000" + coding.id).digest("hex");
    const sourceHash = createHash("sha256").update(JSON.stringify(source)).digest("hex");
    return { id, ...source, sourceHash };
  }).filter(row => Number.isInteger(row.servicePriceCents) && row.servicePriceCents >= 0 &&
    row.servicePriceCents <= 2_000_000);
}

export function registryAudit(rows: readonly CanonicalCatalogRow[]) {
  const seen = new Set<string>();
  const byName = new Map<string, string>();
  const byPdf = new Map<string, string>();
  const duplicateKeys: string[] = [];
  const duplicateLabelCandidates: string[] = [];
  const sharedPdfCandidates: string[] = [];
  const invalidPrices: string[] = [];
  const reviewRequired: string[] = [];
  for (const row of rows) {
    const key = row.model + ":" + row.codingId;
    if (seen.has(key)) duplicateKeys.push(key);
    seen.add(key);
    const nameKey = row.model + ":" + row.title.toLowerCase().normalize("NFKD")
      .replace(/\\p{M}/gu, "").replace(/[^a-z0-9]+/g, "");
    if (byName.has(nameKey)) duplicateLabelCandidates.push(key);
    else byName.set(nameKey, key);
    const pdfKey = row.model + ":" + row.pdfSlug;
    if (byPdf.has(pdfKey)) sharedPdfCandidates.push(key);
    else byPdf.set(pdfKey, key);
    if (row.servicePriceCents < 0 || row.pdfPriceCents < 0 ||
      !Number.isInteger(row.servicePriceCents) || !Number.isInteger(row.pdfPriceCents))
      invalidPrices.push(key);
    if (/assistenz|sfd2|kamera|radar|freischalt/i.test([row.category, row.hardware, row.requirements].join(" ")))
      reviewRequired.push(key);
  }
  return { total: rows.length, duplicates: duplicateKeys, duplicateLabelCandidates,
    sharedPdfCandidates, invalidPrices, reviewRequired: reviewRequired.length };
}
