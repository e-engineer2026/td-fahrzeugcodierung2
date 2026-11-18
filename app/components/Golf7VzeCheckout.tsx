"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, LockKeyhole } from "lucide-react";
type Mode = "off" | "sandbox" | "live";
type GuestStatus = {
  golf7Vze?: { paid: boolean; documentAvailable: boolean; version?: string | null };
};

export default function Golf7VzeCheckout({ mode }: { mode: Mode }) {
  const [accepted, setAccepted] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [paid, setPaid] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const resp = await fetch("/api/guide-shop/guest/status", {
          cache: "no-store", credentials: "same-origin",
        });
        if (!resp.ok || !active) return;
        const status = await resp.json() as GuestStatus;
        if (!active) return;
        setPaid(status.golf7Vze?.paid === true);
        setReady(status.golf7Vze?.documentAvailable === true);
      } catch { /* Ein erneutes Öffnen der Seite prüft den Kauf wieder. */ }
      finally { if (active) setChecking(false); }
    }

    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (mode !== "off" && url.searchParams.get("payment") === "approved" && token) {
      void (async () => {
        setBusy(true);
        try {
          const resp = await fetch("/api/guide-shop/orders/capture", {
            method: "POST", credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paypalOrderId: token }),
          });
          const result = await resp.json() as { paid?: boolean; error?: string };
          if (!active) return;
          if (!resp.ok || !result.paid) {
            setMessage(result.error ?? "Zahlung nicht bestätigt. Bitte keine zweite Bestellung auslösen.");
            return;
          }
          setMessage("PayPal-Zahlung bestätigt. Die PDF kann jetzt heruntergeladen werden.");
          url.searchParams.delete("token");
          url.searchParams.delete("PayerID");
          url.searchParams.delete("payment");
          window.history.replaceState({}, "", url.pathname);
          await refresh();
        } catch {
          if (active) setMessage("Die Zahlungsprüfung konnte nicht abgeschlossen werden. Seite erneut öffnen.");
        } finally {
          if (active) { setBusy(false); setChecking(false); }
        }
      })();
    } else {
      if (url.searchParams.get("payment") === "cancelled") {
        setMessage("PayPal wurde abgebrochen. Es wurde kein Download freigeschaltet.");
        url.searchParams.delete("payment");
        window.history.replaceState({}, "", url.pathname);
      }
      void refresh();
    }
    return () => { active = false; };
  }, [mode]);

  async function beginPayment() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const resp = await fetch("/api/guide-shop/orders", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "golf7-vze", termsAccepted: accepted,
          immediateDeliveryConsent: immediate, withdrawalAcknowledged: understood,
        }),
      });
      const result = await resp.json() as { approveUrl?: string; error?: string };
      if (!resp.ok || !result.approveUrl) throw new Error(result.error ?? "PayPal derzeit nicht erreichbar.");
      window.location.assign(result.approveUrl);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "PayPal konnte nicht gestartet werden.");
      setBusy(false);
    }
  }

  if (checking) return (
    <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600" role="status">
      Gastbestellung wird geprüft …
    </p>
  );

  if (paid) return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6">
      <p className="font-bold text-green-900">PayPal-Zahlung bestätigt. Kein Kundenkonto erforderlich.</p>
      {ready ? <div className="mt-3 flex flex-wrap gap-2">
        <a href="/api/guide-shop/download/golf7-vze"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800">
          <Download size={17} /> PDF herunterladen
        </a>
        <a href="/api/guide-shop/guest/confirmation"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-blue-800">
          Bestellbestätigung speichern
        </a>
      </div> : <p>Das Dokument ist noch nicht verfügbar. Bitte den Support kontaktieren.</p>}
      <p className="mt-2 text-xs text-green-900">Speichere die PDF direkt. Du kannst sie in diesem Browser
        innerhalb von 30 Tagen nach dem Kauf erneut herunterladen, solange du die Cookies nicht löschst.</p>
      {message && <p role="status" className="mt-2">{message}</p>}
    </div>
  );

  if (mode === "off") return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <p className="font-bold">PayPal-Verkauf noch nicht freigeschaltet.</p>
      <p>Die Golf-7-VZE-Anleitung muss vor echten Verkäufen fachlich geprüft werden.
        Die spätere Zahlung und der Download funktionieren ohne Registrierung.</p>
    </div>
  );

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 text-sm leading-6 sm:p-5">
      {mode === "sandbox" && <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-2 font-bold text-amber-900">
        PayPal-Sandbox: Testzahlung über 13,99 € mit virtuellem Geld, keine echte Abbuchung.
      </p>}
      <p className="font-bold">PDF per PayPal kaufen, ohne Kundenkonto</p>
      <p className="mt-1 text-slate-600">Nach erfolgreicher Zahlung kannst du die Anleitung
        direkt hier herunterladen. Die Bestellung wird anhand eines sicheren Browser-Cookies zugeordnet.</p>
      <fieldset className="mt-3 space-y-3 text-sm text-slate-700" disabled={busy}>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
            className="mt-1 h-4 w-4" />
          <span>Ich habe die <Link href="/agb" className="text-blue-700 underline">AGB</Link> und die
            <Link href="/widerruf" className="text-blue-700 underline">Widerrufsbelehrung</Link> gelesen.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={immediate} onChange={e => setImmediate(e.target.checked)}
            className="mt-1 h-4 w-4" />
          <span>Ich stimme ausdrücklich zu, dass mit der Bereitstellung des digitalen Inhalts
            vor Ablauf der Widerrufsfrist begonnen wird.</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={understood} onChange={e => setUnderstood(e.target.checked)}
            className="mt-1 h-4 w-4" />
          <span>Ich bestätige meine Kenntnis, dass mein Widerrufsrecht mit Beginn der Bereitstellung
            unter den gesetzlichen Voraussetzungen erlischt.</span>
        </label>
      </fieldset>
      <button type="button" onClick={() => void beginPayment()}
        disabled={busy || !accepted || !immediate || !understood}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
        <LockKeyhole size={17} />
        {busy ? "PayPal wird geöffnet …" : mode === "sandbox"
          ? "Testbestellung · 13,99 € (PayPal Sandbox)"
          : "Zahlungspflichtig bestellen · 13,99 € (PayPal)"}
      </button>
      <p className="mt-2 text-xs text-slate-500">Kein Benutzerkonto notwendig. Nach dem Kauf
        30 Tage erneuter Zugriff über denselben Browser; beim Löschen der Cookies geht der
        automatische Zugriff verloren. PDF daher direkt speichern.</p>
      {message && <p role="alert" className="mt-3 text-sm text-red-700">{message}</p>}
    </div>
  );
}
