import type { Metadata } from "next";
import GuideCatalogPage from "../components/GuideCatalogPage";
import GuideSelector from "../components/GuideSelector";
import { ensureGuideShopSchema } from "../lib/guideShopDb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Professionelle Codier-PDF-Anleitungen | TD Fahrzeugcodierung",
  description: "Professionelle VAG-Codieranleitungen mit Angaben zu geeignetem Interface und Hardwarevoraussetzungen. Für qualifizierte Fachkräfte.",
  alternates: { canonical: "/codieranleitungen" },
  // Erst indexieren, wenn die ersten tatsächlich kaufbaren PDFs bereitstehen.
  robots: { index: false, follow: true },
};

export default async function CodieranleitungenPage() {
  let publishedCatalogSlugs: string[] = [];
  try {
    const sql = await ensureGuideShopSchema();
    const documents = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id LIKE 'catalog:%' AND NOT withdrawn AND assigned_filename IS NOT NULL`;
    publishedCatalogSlugs = documents.map(document => String(document.product_id));
  } catch { /* Der Fahrzeugkatalog bleibt erreichbar. */ }
  return <GuideCatalogPage>
    <section className="container-x py-5 sm:py-7" aria-label="Anleitung und Fahrzeug auswählen">
      <GuideSelector publishedCatalogSlugs={publishedCatalogSlugs} />
    </section>
  </GuideCatalogPage>;
}
