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

/** Die Verwaltung verwendet dieselben Downloads wie der Kundenbereich. */
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
];

export function findGuideAdminDocument(slug: string) {
  const existing = GUIDE_ADMIN_DOCUMENTS.find(document => document.slug === slug);
  if (existing) return existing;
  const product = catalogGuideProduct(slug);
  return product ? { ...product, productId: product.id } : null;
}
