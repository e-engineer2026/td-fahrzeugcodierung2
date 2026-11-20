"use client";
import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
type Model = {
  slug: string; name: string; sku: string; paid: boolean;
  pending: boolean; documentAvailable: boolean;
};
type ApiResponse = {
  golf7Vze?: { paid: boolean; pending?: boolean; documentAvailable: boolean; purchasedAt: string | null };
  vzeModels?: Model[];
};
export default function GuidePurchasesPanel() {
  const [paid, setPaid] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    void fetch("/api/guide-shop/purchases", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then((data: ApiResponse | null) => {
        if (!active) return;
        setPaid(data?.golf7Vze?.paid === true);
        setPending(data?.golf7Vze?.pending === true);
        setReady(data?.golf7Vze?.documentAvailable === true);
        setModels(data?.vzeModels ?? []);
      }).catch(() => {}).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);
  const selected = models.filter(item => item.paid || item.pending);
  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <h2 className="flex items-center gap-2 text-xl font-black"><FileText size={21} /> Meine PDF-Anleitungen</h2>
    {!loaded && <p className="mt-2 text-sm text-slate-500">Käufe werden geladen …</p>}
    {loaded && !paid && !pending && selected.length === 0 &&
      <p className="mt-2 text-sm text-slate-500">Noch keine gekauften PDF-Dokumente.</p>}
    {loaded && (paid || pending) && <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="font-bold">Golf 7 · Verkehrszeichenerkennung (VZE)</p>
      {paid ? <>
        <p className="text-xs text-slate-600">Zahlung bestätigt. Zugriff nur mit diesem Konto.</p>
        {ready ? <div className="mt-3 flex flex-wrap gap-2">
          <a href="/api/guide-shop/download/golf7-vze"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white">
            <Download size={16}/> PDF herunterladen
          </a>
          <a href="/api/guide-shop/confirmation/golf7-vze"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-blue-800">
            Bestellbestätigung
          </a>
        </div> : <p className="mt-2 text-sm text-amber-800">Dokument noch nicht hinterlegt, bitte Support kontaktieren.</p>}
      </> : <p className="mt-2 text-sm text-amber-800">Bestellung angelegt. Freigabe nach Prüfung deiner PayPal.Me-Zahlung.</p>}
    </div>}
    {loaded && selected.map(item => <div key={item.slug}
      className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="font-bold">{item.name} · Verkehrszeichenerkennung (VZE)</p>
      <p className="text-xs text-slate-600">{item.sku} · Fachfassung Rev. 1.0</p>
      {item.paid ? item.documentAvailable ?
        <a href={"/api/guide-shop/download/vze/" + encodeURIComponent(item.slug)}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white">
          <Download size={16}/> PDF herunterladen
        </a>
        : <p className="mt-2 text-sm text-amber-800">PDF momentan nicht hinterlegt. Bitte Support kontaktieren.</p>
        : <p className="mt-2 text-sm text-amber-800">Zahlung wird geprüft. Der Download wird nach der Bestätigung hier freigeschaltet.</p>}
    </div>)}
  </section>;
}
