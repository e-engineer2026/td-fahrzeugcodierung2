import type { Metadata } from "next";
import Link from "next/link";
import { VZE_VARIANT_DRAFTS } from "../../lib/vzeVariantDrafts";

export const metadata: Metadata = {
  title: "VZE-Modellanleitungen in Vorbereitung | TD Fahrzeugcodierung",
  description: "Fahrzeugbezogene Prüfunterlagen zur Verkehrszeichenerkennung für ausgewählte MQB-Modelle. Freigaben ausstehend.",
  robots: { index: false, follow: true },
};
export default function VzeModelDraftsPage() {
  return <main className="min-h-screen bg-slate-50 py-10 text-slate-900">
    <div className="container-x max-w-5xl">
      <Link className="text-sm font-semibold text-blue-700" href="/codieranleitungen">← Zurück zu PDF-Anleitungen</Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">TD Fahrzeugcodierung · VZE / Sign Assist</p>
      <h1 className="mt-2 text-3xl font-black">VZE-Modellanleitungen in Vorbereitung</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Für diese zwölf MQB-Baureihen liegen
        getrennte technische Prüffassungen vor. Der Golf-7-Code wird nicht ungeprüft übertragen:
        Frontkamera A5, Kombiinstrument 17, Infotainment 5F, Navigation, Freigaben und
        Kalibrierungsbedarf sind fahrzeugspezifisch zu prüfen. Die Fassungen werden erst
        nach Fachabnahme und Einrichtung eines geschützten Bezahl-Downloads verkauft.</p>
      <div className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {VZE_VARIANT_DRAFTS.map(draft => <div key={draft.slug}
          className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 last:border-b-0">
          <div>
            <p className="text-sm font-bold">{draft.name} <span className="text-slate-500">({draft.code})</span></p>
            <p className="text-xs text-slate-500">{draft.sku} · VZE / Verkehrszeichenerkennung · VCDS / VCP, soweit kompatibel</p>
          </div>
          <span className="text-xs font-semibold text-amber-800">Prüffassung · noch nicht kaufbar</span>
        </div>)}
      </div>
      <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-slate-700">
        Bereits technisch freigegeben ist nur die separat angebotene Golf-7-VZE-Anleitung.
        Die hier genannten Modellfamilien sind mögliche Kandidaten, keine Garantie für jede Baujahr- oder Steuergerätevariante.
      </div>
      <Link href="/codieranleitungen/golf7-vze" className="mt-5 inline-block text-sm font-bold text-blue-700 underline">
        Zur bestehenden Golf-7-VZE-PDF
      </Link>
    </div>
  </main>;
}
