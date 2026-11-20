"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Order = { orderId: string; reference: string; paypalUrl: string };

function paypalOpenedForOrder(orderId: string): boolean {
  try { return sessionStorage.getItem("td-vze-paypal-opened:" + orderId) === "1"; }
  catch { return false; }
}

export default function AccountPaypalGuideCheckout({ signedIn }: { signedIn: boolean }) {
  const [terms, setTerms] = useState(false);

  const [order, setOrder] = useState<Order | null>(null);
  const [restoringOrder, setRestoringOrder] = useState(signedIn);
  const [referenceCopied, setReferenceCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [paid, setPaid] = useState(false);
  const [paypalOpened, setPaypalOpened] = useState(false);
  const [paymentCompletedByCustomer, setPaymentCompletedByCustomer] = useState(false);
  async function checkAccess() {
    try {
      const response = await fetch("/api/guide-shop/purchases", { cache: "no-store" });
      const data = response.ok ? await response.json() as { golf7Vze?: { paid?: boolean } } : null;
      const released = data?.golf7Vze?.paid === true;
      setPaid(released);
      if (!released) setMessage("Die Zahlung ist noch in Prüfung. Bitte später erneut prüfen.");
    } catch { setMessage("Freigabestatus derzeit nicht erreichbar."); }
  }
  useEffect(() => {
    if (!signedIn) return;
    void fetch("/api/guide-shop/purchases", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(data => setPaid(data?.golf7Vze?.paid === true)).catch(() => {});
    void fetch("/api/guide-shop/account-orders", { cache: "no-store", credentials: "same-origin" })
      .then(r => r.ok ? r.json() : null)
      .then((data: { order?: Order | null } | null) => {
        if (!data?.order) return;
        setOrder(data.order);
        setPaypalOpened(paypalOpenedForOrder(data.order.orderId));
      })
      .catch(() => { /* Das manuelle Bestellformular bleibt nutzbar. */ })
      .finally(() => setRestoringOrder(false));
  }, [signedIn]);

  useEffect(() => {
    if (!order || !paypalOpened) return;
    try { sessionStorage.setItem("td-vze-paypal-opened:" + order.orderId, "1"); }
    catch { /* Wiederherstellung ist Komfort, keine Zahlungsfreigabe. */ }
  }, [order, paypalOpened]);

  async function copyOrderReference() {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.reference);
      setReferenceCopied(true);
      setMessage("");
    } catch {
      setMessage("Die Bestellnummer konnte nicht kopiert werden. Bitte manuell markieren und kopieren.");
    }
  }

  async function prepare() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/guide-shop/account-orders", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsAccepted: terms }),
      });
      const data = await response.json() as Order & { error?: string };
      if (!response.ok || !data.orderId) throw new Error(data.error ?? "Bestellung nicht erreichbar.");
      setOrder(data);
      setReferenceCopied(false);
      setPaypalOpened(paypalOpenedForOrder(data.orderId));
      setPaymentCompletedByCustomer(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Bestellung fehlgeschlagen."); }
    finally { setBusy(false); }
  }

  if (!signedIn) return <section className="rounded-xl border border-blue-200 bg-white p-5 text-sm">
    <h2 className="text-lg font-bold">PDF mit Kundenkonto kaufen</h2>
    <p className="mt-2">Melde dich an, damit deine PDF nach der Zahlungsprüfung in „Mein Konto“ freigeschaltet wird.</p>
    <Link href="/sign-in?redirect_url=%2Fcodieranleitungen%2Fgolf7-vze"
      className="mt-3 inline-flex rounded-lg bg-blue-700 px-4 py-3 font-bold text-white">Anmelden</Link>
  </section>;

  if (paid) return <section className="rounded-xl border border-green-200 bg-green-50 p-5 text-sm">
    <h2 className="font-bold text-green-900">PDF in deinem Konto freigeschaltet</h2>
    <p className="mt-2 text-green-900">Nach der Zahlung ist nichts Weiteres nötig. Die PDF-Datei ist im Konto zum Download freigeschaltet.</p>
    <Link href="/konto" className="mt-3 inline-flex rounded-lg bg-blue-700 px-4 py-3 font-bold text-white">PDF in Mein Konto öffnen</Link>
  </section>;

  const email = order ? `mailto:info@td-fahrzeugcodierung.de?subject=${encodeURIComponent(`PDF-Zahlung ${order.reference}`)}&body=${encodeURIComponent(`Guten Tag,\n\nich habe die Golf-7-VZE-PDF (13,99 EUR) per PayPal.Me bezahlt.\nBestellnummer: ${order.reference}\nPayPal-Transaktionsnummer: \n\nBitte die Zahlung prüfen und die PDF in meinem Kundenkonto freischalten.`)}` : "";
  return <section className="rounded-xl border border-blue-200 bg-white p-5 text-sm leading-6">
    <h2 className="text-lg font-bold">Golf 7 VZE · PDF für 13,99 €</h2>
    <p className="mt-2">Nach Zahlungseingang wird die PDF in deinem Konto freigeschaltet.</p>
    {restoringOrder ? <p className="mt-4 text-slate-600" role="status">Deine Bestellung wird geladen …</p>
    : !order ? <div className="mt-4 space-y-3">
      <label className="flex items-start gap-3"><input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
        className="mt-1 h-5 w-5 min-w-5 shrink-0 rounded border-slate-300 p-0 accent-blue-700" />
        <span>Ich habe die <Link href="/agb" className="underline">AGB</Link> und
          die <Link href="/widerruf" className="underline">Widerrufsbelehrung</Link> gelesen.</span></label>

      <button type="button" disabled={!terms || busy} onClick={() => void prepare()}
        className="min-h-11 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">
        {busy ? "Bestellung wird erstellt …" : "Bestellung"}</button>
    </div> : <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 break-all"><strong>Deine Bestellnummer: {order.reference}</strong></p>
        <button type="button" onClick={() => void copyOrderReference()}
          className="min-h-10 rounded-lg border border-blue-300 bg-white px-3 py-2 font-bold text-blue-800">
          {referenceCopied ? "Nummer kopiert" : "Bestellnummer kopieren"}
        </button>
      </div>
      <p>Die Bestellnummer bei PayPal als Zahlungsnotiz eintragen, sofern das Nachrichtenfeld angeboten wird.</p>
      <a href={order.paypalUrl} target="_blank" rel="noopener noreferrer"
        onClick={() => setPaypalOpened(true)}
        className="mt-3 inline-flex min-h-11 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white">
        Zahlungspflichtig per PayPal bezahlen · 13,99 €</a>
      <p className="mt-2">Nach der Zahlung ist nichts Weiteres nötig.</p>
      {paypalOpened && !paymentCompletedByCustomer && (
        <button type="button" onClick={() => setPaymentCompletedByCustomer(true)}
          className="mt-3 block rounded-lg border border-blue-300 bg-white px-4 py-2 font-bold text-blue-800">
          Ich habe die PayPal-Zahlung abgeschlossen
        </button>
      )}
      {paymentCompletedByCustomer && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => void checkAccess()}
            className="rounded-lg border border-blue-300 bg-white px-4 py-2 font-bold text-blue-800">Freigabe prüfen</button>
          <a href={email} className="inline-flex rounded-lg border border-blue-300 bg-white px-4 py-2 font-bold text-blue-800">
            Bestellnummer vergessen? Zahlung melden</a>
        </div>
      )}
      <p className="mt-2 text-xs">Die offene Bestellung bleibt in deinem Konto gespeichert. Nach deiner Zahlung erfolgt die Freigabe nach Prüfung des tatsächlichen Zahlungseingangs.</p>
    </div>}
    {message && <p role="status" className="mt-3 text-red-700">{message}</p>}
  </section>;
}
