import type { Metadata } from "next";
import GuideCatalogPage from "../components/GuideCatalogPage";
import GuideSelector from "../components/GuideSelector";
import { ensureGuideShopSchema } from "../lib/guideShopDb";
import { GUIDE_ADMIN_DOCUMENTS } from "../lib/vzeAdminDocuments";
import { MQB_GUIDE_PRODUCTS } from "../lib/mqbGuideProducts";
import { readMqbGuideDocument } from "../lib/mqbGuideDocument";
import { isGuidePdf } from "../lib/guideDocuments";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Professionelle Codier-PDF-Anleitungen | TD Fahrzeugcodierung",
  description: "Professionelle VAG-Codieranleitungen mit Angaben zu geeignetem Interface und Hardwarevoraussetzungen. Für qualifizierte Fachkräfte.",
  alternates: { canonical: "/codieranleitungen" },
  // Erst indexieren, wenn die ersten tatsächlich kaufbaren PDFs bereitstehen.
  robots: { index: false, follow: true },
};

/** Die öffentliche Liste enthält ausschließlich tatsächlich abrufbare, freigegebene PDFs.
 * Entwürfe, zurückgezogene Einträge und reine Produktkatalog-Datensätze bleiben intern.
 * Die Produkt-IDs in der Datenbank dürfen sich durch diese Anzeige nicht ändern.
 */
export default async function CodieranleitungenPage() {
  const publishedPdfSlugs = new Set<string>();
  try {
    const sql = await ensureGuideShopSchema();
    const rows = await sql`SELECT product_id, sha256, assigned_filename, withdrawn,
      octet_length(file_data) AS file_size,
      encode(substring(file_data from 1 for 5), 'hex') AS pdf_header
      FROM td_guide_documents`;
    const productById = new Map(GUIDE_ADMIN_DOCUMENTS.map(document => [document.productId, document]));
    const byId = new Map(rows.map(row => [String(row.product_id), row]));

    for (const row of rows) {
      if (row.withdrawn === true || Number(row.file_size) < 16 || row.pdf_header !== "255044462d") continue;
      const id = String(row.product_id);
      const known = productById.get(id);
      if (typeof row.assigned_filename !== "string" &&
          (!known?.sha256 || row.sha256 !== known.sha256)) continue;
      publishedPdfSlugs.add(known?.slug ?? id);
    }

    // Verschlüsselt mitgelieferte MQB-PDFs sind nur nach erfolgreicher Entschlüsselung
    // und SHA256-Prüfung sichtbar. Ein expliziter Rückzug sperrt auch diese Varianten.
    for (const product of MQB_GUIDE_PRODUCTS) {
      if (byId.get(product.id)?.withdrawn === true || publishedPdfSlugs.has(product.slug)) continue;
      const bytes = readMqbGuideDocument(product);
      if (bytes && isGuidePdf(bytes)) publishedPdfSlugs.add(product.slug);
    }
  } catch {
    // Ohne verlässlichen Dateistatus niemals unfertige PDFs öffentlich anzeigen.
    publishedPdfSlugs.clear();
  }

  return <GuideCatalogPage>
    <section className="container-x py-5 sm:py-7" aria-label="Anleitung und Fahrzeug auswählen">
      <GuideSelector publishedCatalogSlugs={[...publishedPdfSlugs]} />
    </section>
  </GuideCatalogPage>;
}
