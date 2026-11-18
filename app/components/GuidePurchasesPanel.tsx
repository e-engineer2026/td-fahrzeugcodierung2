"use client";
import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
type ApiResponse = { golf7Vze?: { paid: boolean; pending?: boolean; documentAvailable: boolean; purchasedAt: string | null } };
export default function GuidePurchasesPanel() {
  const [paid, setPaid] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
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
      }).catch(() => {}).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-xl font-black"><FileText size={21} /> Meine PDF-Anleitungen</h2>
      {!loaded ? <p className="mt-2 text-sm text-slate-500">Käufe werden geladen …</p> :
       !paid ? <p className="mt-2 text-sm text-slate-500">{pending ? "Golf 7 VZE: Bestellung angelegt. Die PDF erscheint hier nach Prüfung deiner PayPal.Me-Zahlung." : "Noch keine gekauften PDF-Dokumente."}</p> :
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="font-bold">Golf 7 · Verkehrszeichenerkennung (VZE)</p>
          <p className="text-xs text-slate-600">Bestellung bezahlt. Zugriff nur mit diesem Konto.</p>
          {ready ? <div className="mt-3 flex flex-wrap gap-2">
            <a href="/api/guide-shop/download/golf7-vze" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-bold text-white">
              <Download size={16} /> PDF herunterladen
            </a>
            <a href="/api/guide-shop/confirmation/golf7-vze" className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-blue-800">
              Bestellbestätigung
            </a>
          </div> : <p className="mt-2 text-sm text-amber-800">Dokument noch nicht hinterlegt, bitte Support kontaktieren.</p>}
        </div>}
    </section>
  );
}
