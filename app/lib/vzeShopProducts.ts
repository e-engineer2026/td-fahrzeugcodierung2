import { GOLF7_VZE } from "./guideShopShared";
import { findVzeDraft, VZE_VARIANT_DRAFTS, VZE_MODEL_PRICE_CENTS } from "./vzeVariantDrafts";
import { catalogGuideProduct } from "./guideCatalogDocuments";
import { findMqbGuideProduct } from "./mqbGuideProducts";

/** Technisch freigegebene Fachfassung bedeutet nicht: jedes Fahrzeug unterstützt diese Bytes. */
export type GuideOrderProduct = {
  id: string; name: string; slug: string | null; priceCents: number;
  sha256: string; revision: string; sku: string; model: string;
};

export function guideOrderProduct(slug?: string | null): GuideOrderProduct | null {
  if (!slug) return {
    id: GOLF7_VZE.id, name: GOLF7_VZE.title, slug: null,
    priceCents: GOLF7_VZE.priceCents, sha256: GOLF7_VZE.expectedSha256,
    revision: GOLF7_VZE.revision, sku: GOLF7_VZE.sku, model: GOLF7_VZE.model,
  };
  if (slug.startsWith("catalog:")) return catalogGuideProduct(slug);
  const mqb = findMqbGuideProduct(slug);
  if (mqb) return mqb;
  const draft = findVzeDraft(slug);
  if (!draft) return null;
  return {
    id: draft.productId, name: "Verkehrszeichenerkennung (VZE)",
    slug: draft.slug, priceCents: VZE_MODEL_PRICE_CENTS,
    sha256: draft.sha256, revision: "1.0", sku: draft.sku, model: draft.name,
  };
}

export function guideOrderProductFromId(productId: string): GuideOrderProduct | null {
  if (productId === GOLF7_VZE.id) return guideOrderProduct();
  if (productId.startsWith("catalog:")) return catalogGuideProduct(productId);
  const mqb = findMqbGuideProduct(productId);
  if (mqb) return mqb;
  const draft = VZE_VARIANT_DRAFTS.find(item => item.productId === productId);
  return draft ? guideOrderProduct(draft.slug) : null;
}

export function orderReference(id: string, product: GuideOrderProduct): string {
  const prefix = product.slug?.startsWith("catalog:") ? "TDPDF-" : product.slug?.startsWith("mqb-") ? "TDMQB-" : product.slug ? "TDVZE-" : "TDG7-";
  return prefix + id.slice(0, 8).toUpperCase();
}

export function paypalMeUrl(product: GuideOrderProduct): string {
  if (!Number.isSafeInteger(product.priceCents) || product.priceCents <= 0)
    throw new Error("PayPal.Me-Betrag nicht konfiguriert.");
  return "https://paypal.me/TiDrechsler/" + (product.priceCents / 100).toFixed(2) + "EUR";
}
