import { AHK_GUIDE_PRODUCTS } from "./ahkGuideProducts";
import { DOCUMENTED_MLBEVO_ASSISTANCE_PRODUCTS, MLB_LANE_ASSIST_PRODUCTS } from "./mlbevoAssistanceGuides";
import { GOLF7_VZE_ADMIN_SLUG } from "./vzePdfVehicleLinks";
import { catalogGuideProduct } from "./guideCatalogDocuments";
import { MQB_GUIDE_PRODUCTS } from "./mqbGuideProducts";
import { MQB_RFK_PDF_PRODUCTS } from "./mqbRfkProducts";
import { assistanceCategoryForName } from "./assistanceCategories";
import { GOLF7_VZE } from "./guideShopShared";
import { VZE_MODEL_PRODUCTS, type VzeVariantDraft } from "./vzeVariantDrafts";

/** Gemeinsame Admin-Liste. Die Shop-Produkt-IDs bleiben unverändert, damit
 * bestehende PayPal-Käufe weiterhin dem richtigen privaten PDF zugeordnet sind.
 * Die zwölf Rev.-1.0-Modellfassungen bleiben unabhängig von Golf 7 Rev. 1.3.
 */
export const GOLF7_ADMIN_DOCUMENT: VzeVariantDraft = {
  slug: GOLF7_VZE_ADMIN_SLUG,
  name: "VW Golf 7 / 7.5",
  code: "5G / AU",
  sku: GOLF7_VZE.sku,
  sha256: GOLF7_VZE.expectedSha256,
  filename: "TD_Golf7_03_Verkehrszeichenerkennung.pdf",
  productId: GOLF7_VZE.id,
};

export const VZE_ADMIN_DOCUMENTS: readonly VzeVariantDraft[] = [
  GOLF7_ADMIN_DOCUMENT,
  ...VZE_MODEL_PRODUCTS,
];

export function findVzeAdminDocument(slug: string): VzeVariantDraft | undefined {
  return VZE_ADMIN_DOCUMENTS.find((document) => document.slug === slug);
}

export function vzeAdminStorageVersion(productId: string): string {
  return productId === GOLF7_VZE.id ? GOLF7_VZE.revision : "1.0-fachfassung";
}

export function vzeAdminDisplayRevision(productId: string): string {
  return productId === GOLF7_VZE.id ? GOLF7_VZE.revision : "1.0";
}

const mlbVehicleGuides = [
  ["audi-a4-b8-8k", "Audi A4 B8 (8K)"],
  ["audi-a5-8t-8f", "Audi A5 (8T / 8F)"],
  ["audi-a6-c7-4g", "Audi A6 C7 (4G)"],
  ["audi-a7-c7-4g", "Audi A7 C7 (4G)"],
  ["audi-a8-d4-4h", "Audi A8 D4 (4H)"],
  ["audi-q5-8r", "Audi Q5 (8R)"],
  ["vw-touareg-ii-7p", "VW Touareg II (7P)"],
  ["porsche-macan-95b", "Porsche Macan I (95B)"],
  ["vw-phideon-3e", "VW Phideon (3E)"],
] as const;

const mlbAdminDocuments = mlbVehicleGuides.map(([vehicleId, name]) => {
  const slug = "mlb-assistenzsysteme-" + vehicleId;
  return {
    slug,
    productId: slug,
    name,
    title: "MLB-Assistenzsysteme · " + name,
    category: "Assistenzsysteme" as const,
    sku: "TD-MLB-" + vehicleId.toUpperCase(),
    filename: vehicleId + "_mlb_assistenzsysteme.pdf",
    sha256: "",
    revision: "1.0",
  };
});

/** Download-Ziele und Dateinamen für die interne PDF-Verwaltung. */
export const GUIDE_ADMIN_DOCUMENTS = [
  ...VZE_ADMIN_DOCUMENTS.map(document => ({
    ...document,
    title: "Verkehrszeichenerkennung (VZE) · " + document.name + (document.platform ? " (" + document.code + ")" : "") + (document.reviewOnly ? " · Prüffassung" : ""),
    category: "Assistenzsysteme" as const,
    revision: vzeAdminDisplayRevision(document.productId),
  })),
  ...MQB_GUIDE_PRODUCTS.map(product => ({
    ...product,
    productId: product.id,
    title: product.name + " · MQB",
    category: assistanceCategoryForName(product.name),
    code: "MQB",
  })),
  ...MQB_RFK_PDF_PRODUCTS,
  ...AHK_GUIDE_PRODUCTS,
  ...mlbAdminDocuments,
  ...MLB_LANE_ASSIST_PRODUCTS.map(product => ({ ...product, productId: product.id })),
  ...DOCUMENTED_MLBEVO_ASSISTANCE_PRODUCTS.map(product => ({ ...product, productId: product.id })),
];

export function findGuideAdminDocument(slug: string) {
  const existing = GUIDE_ADMIN_DOCUMENTS.find(document => document.slug === slug);
  if (existing) return existing;
  const product = catalogGuideProduct(slug);
  return product ? { ...product, productId: product.id } : null;
}
