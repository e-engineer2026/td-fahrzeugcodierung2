import type { Metadata } from "next";
import GuideCatalogPage from "../components/GuideCatalogPage";
import GuideSelector from "../components/GuideSelector";
import Link from "next/link";
import { publishedGuideCatalog, type PublishedGuideLink } from "../lib/publishedGuideCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Professionelle Codier-PDF-Anleitungen | TD Fahrzeugcodierung",
  description: "Professionelle VAG-Codieranleitungen mit Angaben zu geeignetem Interface und Hardwarevoraussetzungen. Für qualifizierte Fachkräfte.",
  alternates: { canonical: "/codieranleitungen" },
  robots: { index: true, follow: true },
};

/** Die öffentliche Liste enthält ausschließlich tatsächlich abrufbare, freigegebene PDFs.
 * Entwürfe, zurückgezogene Einträge und reine Produktkatalog-Datensätze bleiben intern.
 * Die Produkt-IDs in der Datenbank dürfen sich durch diese Anzeige nicht ändern.
 */
export default async function CodieranleitungenPage({ searchParams }: { searchParams: Promise<{ brand?: string | string[]; model?: string | string[]; year?: string | string[] }> }) {
  const params = await searchParams;
  const initialBrand = typeof params.brand === "string" ? params.brand : undefined;
  const initialModel = typeof params.model === "string" ? params.model : undefined;
  const initialYear = typeof params.year === "string" && /^\d{4}$/.test(params.year) ? Number(params.year) : undefined;
  let publishedPdfSlugs: string[] = [];
  let links: PublishedGuideLink[] = [];
  try {
    const published = await publishedGuideCatalog();
    publishedPdfSlugs = published.slugs;
    links = published.links;
  } catch (error) {
    console.error("Published PDF catalog unavailable", error);
  }

  return <GuideCatalogPage>
    <section className="container-x py-5 sm:py-7" aria-label="Anleitung und Fahrzeug auswählen">
      <GuideSelector key={JSON.stringify([initialBrand, initialModel, initialYear])} publishedCatalogSlugs={publishedPdfSlugs} initialBrand={initialBrand} initialModel={initialModel} initialYear={initialYear} />
    </section>
    {links.length > 0 && <section className="container-x pb-8" aria-label="Veröffentlichte PDF-Anleitungen">
      <details className="rounded-xl border border-slate-400/30 p-4">
        <summary className="cursor-pointer font-semibold">Alle verfügbaren PDF-Anleitungen ({links.length})</summary>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {links.map(link => <li key={link.href}><Link className="hover:underline" href={link.href}>{link.title}</Link></li>)}
        </ul>
      </details>
    </section>}
  </GuideCatalogPage>;
}
