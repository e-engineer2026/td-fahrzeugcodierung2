import "server-only";
import { shopDatabase } from "./guideShopDb";
import { GUIDE_ADMIN_DOCUMENTS, VZE_ADMIN_DOCUMENTS } from "./vzeAdminDocuments";
import { GOLF7_VZE } from "./guideShopShared";
import { MQB_GUIDE_PRODUCTS } from "./mqbGuideProducts";
import { readMqbGuideDocument } from "./mqbGuideDocument";
import { isGuidePdf } from "./guideDocuments";
import { catalogGuideProduct } from "./guideCatalogDocuments";
import { catalogDocumentHref } from "./guideCatalogLinks";

export type PublishedGuideLink = { href: string; title: string; searchText?: string; lastModified?: Date };

/** Read-only publication discovery. Never inspect drafts or expose PDF contents. */
export async function publishedGuideCatalog(): Promise<{ slugs: string[]; links: PublishedGuideLink[] }> {
  const sql = shopDatabase();
  const rows = await sql`SELECT product_id, sha256, assigned_filename, withdrawn, uploaded_at,
    (octet_length(file_data) >= 16
      AND substring(file_data from 1 for 5) = decode('255044462d', 'hex')
      AND position(decode('2525454f46', 'hex') in
        substring(file_data from greatest(octet_length(file_data) - 2047, 1))) > 0
      AND encode(sha256(file_data), 'hex') = sha256) AS valid_pdf
    FROM td_guide_documents`;
  const knownById = new Map(GUIDE_ADMIN_DOCUMENTS.map(doc => [doc.productId, doc] as const));
  const rowsById = new Map(rows.map(row => [String(row.product_id), row] as const));
  const published = new Map<string, Date | undefined>();

  for (const row of rows) {
    if (row.withdrawn === true || row.valid_pdf !== true) continue;
    const id = String(row.product_id);
    const known = knownById.get(id);
    if (typeof row.assigned_filename !== "string" &&
        (!known?.sha256 || row.sha256 !== known.sha256)) continue;
    const date = new Date(String(row.uploaded_at));
    published.set(known?.slug ?? id, Number.isNaN(date.getTime()) ? undefined : date);
  }

  for (const product of MQB_GUIDE_PRODUCTS) {
    if (rowsById.get(product.id)?.withdrawn === true || published.has(product.slug)) continue;
    const bytes = readMqbGuideDocument(product);
    if (bytes && isGuidePdf(bytes)) published.set(product.slug, undefined);
  }

  const links = new Map<string, PublishedGuideLink>();
  for (const [slug, lastModified] of published) {
    const vze = VZE_ADMIN_DOCUMENTS.find(doc => doc.slug === slug);
    const mqb = MQB_GUIDE_PRODUCTS.find(doc => doc.slug === slug);
    const catalog = !vze && !mqb ? catalogGuideProduct(slug) : null;
    const href = vze
      ? (vze.productId === GOLF7_VZE.id ? "/codieranleitungen/golf7-vze" : "/codieranleitungen/vze-modelle/" + encodeURIComponent(slug))
      : mqb ? "/codieranleitungen/mqb-assistenten/" + encodeURIComponent(slug)
      : catalog ? catalogDocumentHref(catalog.slug) : null;
    if (!href) continue; // Only actual canonical product routes, never download URLs.
    const title = vze ? "Verkehrszeichenerkennung (VZE) · " + vze.name
      : mqb ? mqb.name + " · " + mqb.model
      : catalog ? catalog.name + " · " + catalog.model : "";
    const searchText = vze ? (vze.platform === "MLBevo" ? "VCDS" : "VCDS VCP") : mqb ? mqb.description : catalog ? catalog.title : "";
    links.set(href, { href, title, searchText, ...(lastModified ? { lastModified } : {}) });
  }
  return { slugs: [...published.keys()], links: [...links.values()].sort((a, b) => a.title.localeCompare(b.title, "de")) };
}
