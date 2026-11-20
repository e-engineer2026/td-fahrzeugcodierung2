import type { Metadata } from "next";
import Link from "next/link";
import { VZE_VARIANT_DRAFTS } from "../../lib/vzeVariantDrafts";

export const metadata: Metadata = {
  title: "VZE-Codieranleitungen für 12 MQB-Modelle | TD Fahrzeugcodierung",
  description: "Fachlich freigegebene, modellbezogene VZE-Codieranleitungen für ausgewählte MQB-Modelle. Kundenkauf nach PDF-Bereitstellung.",
  robots: { index: false, follow: true },
};
export default function VzeModelDraftsPage() {
  return <main className="min-h-screen bg-slate-50 py-10 text-slate-900">
    <div className="container-x max-w-5xl">
      <Link className="text-sm font-semibold text-blue-700" href="/codieranleitungen">← Zurück zu PDF-Anleitungen</Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">TD Fahrzeugcodierung · VZE / Sign Assist</p>
      <h1 className="mt-2 text-3xl font-black">VZE-Modellanleitungen für 12 MQB-Modelle</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">TD Fahrzeugcodierung hat diese zwölf eigenständig formulierten Fachfassungen zur Veröffentlichung freigegeben.
        Sie ersetzen jedoch keine Prüfung am konkreten Fahrzeug. Frontkamera A5, Kombiinstrument 17,
        Infotainment 5F, Navigation, Lizenzen und eventuell notwendige Kalibrierungen
        entscheiden über die tatsächliche Umsetzung. Ein Kauf wird erst angeboten,
        nachdem die jeweilige PDF geschützt hinterlegt wurde.</p>
      <div className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {VZE_VARIANT_DRAFTS.map(draft => <div key={draft.slug}
          className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 last:border-b-0">
          <div>
            <p className="text-sm font-bold">{draft.name} <span className="text-slate-500">({draft.code})</span></p>
            <p className="text-xs text-slate-500">{draft.sku} · VZE / Verkehrszeichenerkennung · VCDS / VCP, soweit kompatibel</p>
          </div>
          <Link href={"/codieranleitungen/vze-modelle/" + draft.slug}
            className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100">
            Modellanleitung ansehen · 13,99 €
          </Link>
        </div>)}
      </div>
      <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-slate-700">
        Die fachliche Veröffentlichung wurde durch TD bestätigt. Eine Freigabe für jede mögliche Baujahr-, Kamera- und Steuergerätevariante ist damit nicht verbunden. Die PDF wird ausschließlich nach bestätigter PayPal-Zahlung im Kundenkonto freigegeben.
      </div>
      <Link href="/codieranleitungen/golf7-vze" className="mt-5 inline-block text-sm font-bold text-blue-700 underline">
        Zur bestehenden Golf-7-VZE-PDF
      </Link>
    </div>
  </main>;
}
