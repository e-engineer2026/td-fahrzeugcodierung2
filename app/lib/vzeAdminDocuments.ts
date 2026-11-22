import { GOLF7_VZE_ADMIN_SLUG } from "./vzePdfVehicleLinks";
import { MQB_GUIDE_PRODUCTS } from "./mqbGuideProducts";
import { GOLF7_VZE } from "./guideShopShared";
import { VZE_VARIANT_DRAFTS, type VzeVariantDraft } from "./vzeVariantDrafts";

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
  ...VZE_VARIANT_DRAFTS,
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
    title: "Verkehrszeichenerkennung (VZE) · " + document.name,
    revision: vzeAdminDisplayRevision(document.productId),
  })),
  ...MQB_GUIDE_PRODUCTS.map(product => ({
    ...product,
    productId: product.id,
    title: product.name + " · MQB",
    code: "MQB",
  })),
];
