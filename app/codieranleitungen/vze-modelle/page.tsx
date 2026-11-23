import type { Metadata } from "next";
import Link from "next/link";
import { VZE_VARIANT_DRAFTS } from "../../lib/vzeVariantDrafts";
import { ensureGuideShopSchema } from "../../lib/guideShopDb";
import { GOLF7_VZE } from "../../lib/guideShopShared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "VZE-Modellanleitungen für MQB-Fahrzeuge | TD Fahrzeugcodierung",
  description: "Modellbezogene VZE-Codieranleitungen. Kundenkauf erst nach ausdrücklicher PDF-Veröffentlichung.",
  robots: { index: false, follow: true },
};

export default async function VzeModelDraftsPage() {
  // Veröffentlichungen sind nur produktbezogene, nicht zurückgezogene Dateieinträge.
  // Neue Entwürfe in td_guide_document_drafts werden niemals in dieser Liste gezeigt.
  let published: typeof VZE_VARIANT_DRAFTS[number][] = [];
  let golf7Available = false;
  try {
    const sql = await ensureGuideShopSchema();
    const ids = [...VZE_VARIANT_DRAFTS.map(d => d.productId), GOLF7_VZE.id];
    const rows = await sql`SELECT product_id, sha256, assigned_filename,
      octet_length(file_data) AS file_size,
      encode(substring(file_data from 1 for 5), 'hex') AS pdf_header
      FROM td_guide_documents
      WHERE product_id=ANY(${ids}::text[]) AND NOT withdrawn`;
    const publishedFile = (id: string, expectedSha256: string) =>
      rows.some(row => row.product_id === id && Number(row.file_size) >= 16 &&
        row.pdf_header === "255044462d" &&
        (row.sha256 === expectedSha256 || typeof row.assigned_filename === "string"));
    published = VZE_VARIANT_DRAFTS.filter(draft => publishedFile(draft.productId, draft.sha256));
    golf7Available = publishedFile(GOLF7_VZE.id, GOLF7_VZE.expectedSha256);
  } catch {
    // Kein Datenbankstatus: keine potentiell unfreigegebenen Produkte zeigen.
  }
  return <main className="min-h-screen bg-slate-50 py-10 text-slate-900">
    <div className="container-x max-w-5xl">
      <Link className="text-sm font-semibold text-blue-700" href="/codieranleitungen">← Zurück zu PDF-Anleitungen</Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">TD Fahrzeugcodierung · VZE / Sign Assist</p>
      <h1 className="mt-2 text-3xl font-black">Veröffentlichte VZE-Modellanleitungen</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
        Hier erscheinen nur die ausdrücklich veröffentlichten Fachfassungen. Ein Kauf wird erst angeboten,
        nachdem die jeweilige PDF geschützt hinterlegt wurde. Die fahrzeugspezifische Eignung ist anhand
        von Frontkamera A5, Kombiinstrument 17, Infotainment 5F, Navigationssystem, Lizenzen und
        gegebenenfalls Kalibrierungsstatus vor jeder Codierung zu prüfen.
      </p>
      <div className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {published.length ? published.map(draft => <div key={draft.slug}
          className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 last:border-b-0">
          <div>
            <p className="text-sm font-bold">{draft.name} <span className="text-slate-500">({draft.code})</span></p>
            <p className="text-xs text-slate-500">{draft.sku} · VZE / Verkehrszeichenerkennung · VCDS / VCP, soweit kompatibel</p>
          </div>
          <Link href={"/codieranleitungen/vze-modelle/" + draft.slug}
            className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100">
            Modellanleitung ansehen · 13,99 €
          </Link>
        </div>) : <p className="p-4 text-sm text-slate-600">Derzeit sind keine VZE-Modellanleitungen veröffentlicht.</p>}
      </div>
      <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-slate-700">
        Die Veröffentlichung erfolgt ausschließlich nach Freigabe durch TD Fahrzeugcodierung.
        Sie ist keine pauschale Freigabe für jede Fahrzeug-, Kamera- und Softwarevariante.
        Die Lieferung erfolgt erst nach bestätigter Zahlung.
      </div>
      {golf7Available && <Link href="/codieranleitungen/golf7-vze" className="mt-5 inline-block text-sm font-bold text-blue-700 underline">
        Zur Golf-7-VZE-PDF
      </Link>}
    </div>
  </main>;
}
