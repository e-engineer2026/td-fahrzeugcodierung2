"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, LockKeyhole } from "lucide-react";
type Mode = "off" | "sandbox" | "live";
type PurchaseInfo = { golf7Vze?: { paid: boolean; documentAvailable: boolean; version: string | null } };
export default function Golf7VzeCheckout({ mode }: { mode: Mode }) {
  const [accepted, setAccepted] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [paid, setPaid] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function sync() {
      try {
        const check = await fetch("/api/guide-shop/purchases", { cache: "no-store" });
        if (check.ok && active) {
          const data = await check.json() as PurchaseInfo;
          setPaid(data.golf7Vze?.paid === true);
          setDocumentReady(data.golf7Vze?.documentAvailable === true);
        }
      } catch { /* Kontostatus kann später erneut geladen werden. */ }
    }
    void sync();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (mode === "off") return;
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (url.searchParams.get("payment") !== "approved" || !token) return;
    let active = true;
    void (async () => {
      setBusy(true);
      try {
        const response = await fetch("/api/guide-shop/orders/capture", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypalOrderId: token })
        });
        const data = await response.json() as { paid?: boolean; error?: string };
        if (!active) return;
        if (response.ok && data.paid) {
          setPaid(true);
          setMessage("Zahlung bestätigt. Deine Datei steht im Kundenkonto bereit.");
          url.searchParams.delete("token");
          url.searchParams.delete("PayerID");
          url.searchParams.delete("payment");
          window.history.replaceState({}, "", url.pathname);
        } else setMessage(data.error ?? "Zahlung ist noch nicht bestätigt.");
      } catch {
        if (active) setMessage("PayPal-Bestätigung konnte nicht abgerufen werden.");
      } finally { if (active) setBusy(false); }
    })();
    return () => { active = false; };
  }, [mode]);

  async function beginPayment() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/guide-shop/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "golf7-vze", termsAccepted: accepted,
          immediateDeliveryConsent: immediate, withdrawalAcknowledged: understood }),
      });
      const data = await response.json() as { approveUrl?: string; error?: string };
      if (!response.ok || !data.approveUrl) throw new Error(data.error ?? "PayPal nicht verfügbar.");
      window.location.assign(data.approveUrl);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Zahlung konnte nicht gestartet werden.");
      setBusy(false);
    }
  }

  if (paid) return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6">
      <p className="font-bold text-green-900">PDF-Kauf für dieses Kundenkonto bestätigt.</p>
      {documentReady ? <div className="mt-3 flex flex-wrap gap-2">
        <a href="/api/guide-shop/download/golf7-vze"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800">
          <Download size={17} /> PDF herunterladen
        </a>
        <a href="/api/guide-shop/confirmation/golf7-vze"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-blue-800">
          Bestellbestätigung speichern
        </a>
      </div> : <p>PDF-Datei wird derzeit geprüft. Bitte Kundenservice kontaktieren.</p>}
      <p className="mt-2">{message}</p>
    </div>
  );

  if (mode === "off") return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <p className="font-bold">Noch kein Verkauf oder PayPal-Checkout aktiviert.</p>
      <p>Die technische Freigabe der Golf-7-VZE-Anleitung und der abschließende Shop-Test stehen noch aus.
        Der Dokumentpreis ist vorgesehen, aber keine Zahlung wird ausgelöst.</p>
    </div>
  );

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 text-sm leading-6 sm:p-5">
      {mode === "sandbox" && <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-2 font-bold text-amber-900">
        PayPal-Sandbox: Nur Testzahlungen, kein echter Kauf.
      </p>}
      <p className="font-bold">Digitale PDF-Anleitung per PayPal erwerben</p>
      <fieldset className="mt-3 space-y-3 text-sm text-slate-700" disabled={busy}>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1 h-4 w-4" />
          <span>Ich habe die <Link href="/agb" className="text-blue-700 underline">AGB</Link> und
            die <Link href="/widerruf" className="text-blue-700 underline">Widerrufsbelehrung</Link> gelesen.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={immediate} onChange={e => setImmediate(e.target.checked)} className="mt-1 h-4 w-4" />
          <span>Ich stimme ausdrücklich zu, dass mit der Bereitstellung des digitalen Inhalts vor Ende der Widerrufsfrist begonnen wird.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={understood} onChange={e => setUnderstood(e.target.checked)} className="mt-1 h-4 w-4" />
          <span>Ich bestätige meine Kenntnis, dass mein Widerrufsrecht mit Beginn der Bereitstellung unter den gesetzlichen Voraussetzungen erlischt.</span>
        </label>
      </fieldset>
      <button type="button" onClick={() => void beginPayment()} disabled={busy || !accepted || !immediate || !understood}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
        <LockKeyhole size={17} /> {busy ? "Bitte warten …" : mode === "sandbox" ? "PayPal-Sandbox testen (0,00 € echte Zahlung)" : "Zahlungspflichtig bestellen · 13,99 € (PayPal)"}
      </button>
      {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
    </div>
  );
}
