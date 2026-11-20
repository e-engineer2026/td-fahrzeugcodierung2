"use client";

import { useEffect, useState } from "react";
import { suggestPayPalOrderByTime } from "../lib/paypalTimeMatching";

type Order = { id: string; email: string; createdAt: string; paypalStartedAt?: string | null; reference: string };

export default function GuideAdminAccountOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentTime, setPaymentTime] = useState("");
  const [paymentTransaction, setPaymentTransaction] = useState("");
  const [transactions, setTransactions] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [revokeTransaction, setRevokeTransaction] = useState("");
  async function refresh() {
    try {
      const response = await fetch("/api/guide-shop/admin/account-orders", { cache: "no-store" });
      const data = await response.json() as { orders?: Order[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Bestellungen konnten nicht geladen werden.");
      setOrders(data.orders ?? []);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Laden fehlgeschlagen."); }
  }
  useEffect(() => { void refresh(); }, []);
  async function release(order: Order) {
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/guide-shop/admin/account-orders", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, transactionId: transactions[order.id], paymentVerified: checked[order.id] }),
      });
      const data = await response.json() as { released?: boolean; error?: string };
      if (!response.ok || !data.released) throw new Error(data.error ?? "Freigabe fehlgeschlagen.");
      setNotice(`PDF für ${order.email} freigegeben. Der Kunde findet sie jetzt in „Mein Konto“. Bitte informiere ihn über die Freigabe.`);
      await refresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Freigabe fehlgeschlagen."); }
    finally { setBusy(false); }
  }
  async function revoke() {
    if (!window.confirm("PDF-Zugriff für diese PayPal-Transaktion wirklich sperren?")) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/guide-shop/admin/account-orders", {
        method: "DELETE", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: revokeTransaction }),
      });
      const data = await response.json() as { revoked?: boolean; error?: string };
      if (!response.ok || !data.revoked) throw new Error(data.error ?? "Sperrung fehlgeschlagen.");
      setNotice("Zugriff im Kundenkonto gesperrt. Bereits heruntergeladene Dateien bleiben beim Kunden.");
      setRevokeTransaction("");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Sperrung fehlgeschlagen."); }
    finally { setBusy(false); }
  }
  const suggestion = suggestPayPalOrderByTime(orders,
    paymentTime ? new Date(paymentTime).getTime() : Number.NaN);
  const suggestedOrder = suggestion.status === "single"
    ? orders.find((entry) => entry.id === suggestion.orderId) : undefined;

  function acceptSuggestion() {
    if (!suggestedOrder || !/^[a-z0-9-]{8,64}$/i.test(paymentTransaction.trim())) return;
    setTransactions((previous) => ({ ...previous,
      [suggestedOrder.id]: paymentTransaction.trim().toUpperCase() }));
    setChecked((previous) => ({ ...previous, [suggestedOrder.id]: false }));
    setNotice("Möglicher Treffer übernommen. Betrag, Empfänger, Transaktions-ID und abgeschlossenen Zahlungseingang bei PayPal prüfen. Danach erst das Prüfhäkchen setzen.");
  }

  return <section className="mt-6 rounded-xl border border-blue-200 bg-white p-5 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-bold">Offene PDF-Bestellungen mit Kundenkonto</h2>
      <button type="button" onClick={() => void refresh()} className="rounded-lg border border-blue-300 px-3 py-2 font-bold text-blue-800">Aktualisieren</button>
    </div>
    <p className="mt-2">Prüfe Betrag 13,99 €, Empfängerkonto, Bestellnummer und endgültigen Eingang direkt bei PayPal.
      Eine Kundenmeldung allein reicht nicht. Die Freigabe benötigt die PayPal-Transaktionsnummer.</p>
    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="font-bold text-slate-900">PayPal.Me-Zahlung nach Uhrzeit zuordnen</h3>
      <p className="mt-1 text-xs leading-5 text-slate-700">Übertrage aus der bestätigten PayPal-Transaktion die Transaktionsnummer und die Zahlungszeit.
        Eine E-Mail oder die Zeitähnlichkeit allein beweist keine Zahlung. Die Zuordnung ist nur ein Vorschlag.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block font-semibold">PayPal-Transaktionsnummer
          <input type="text" value={paymentTransaction} maxLength={64}
            onChange={(event) => setPaymentTransaction(event.target.value)}
            placeholder="Transaktions-ID aus PayPal"
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" />
        </label>
        <label className="block font-semibold">PayPal-Zahlungszeit (lokale Uhrzeit)
          <input type="datetime-local" value={paymentTime}
            onChange={(event) => setPaymentTime(event.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" />
        </label>
      </div>
      {paymentTime && suggestion.status === "single" && suggestedOrder && (
        <div className="mt-3 text-sm">
          <p className="font-bold text-blue-900">Ein möglicher Treffer: {suggestedOrder.reference}</p>
          <p className="break-all text-slate-700">{suggestedOrder.email} · PayPal-Aufruf {new Date(suggestedOrder.paypalStartedAt!).toLocaleString("de-DE")} ·
            Abstand {Math.max(0, Math.round(suggestion.minutesAfterStart))} Minuten</p>
          <button type="button" onClick={acceptSuggestion}
            disabled={!/^[a-z0-9-]{8,64}$/i.test(paymentTransaction.trim())}
            className="mt-2 rounded-lg border border-blue-400 bg-white px-3 py-2 font-bold text-blue-800 disabled:opacity-50">
            Vorschlag in Bestellung übernehmen
          </button>
          <p className="mt-2 text-xs text-slate-600">Das setzt keine Zahlungsbestätigung und gibt keine PDF frei.</p>
        </div>
      )}
      {paymentTime && suggestion.status === "ambiguous" && (
        <p className="mt-3 font-semibold text-amber-900" role="status">Mehrere Bestellungen passen zum Zeitraum.
          Keine automatische Zuordnung. Zahlung und Käufer manuell abgleichen.</p>
      )}
      {paymentTime && suggestion.status === "none" && (
        <p className="mt-3 text-slate-700" role="status">Kein sicherer Zeitkandidat gefunden.
          Die Zahlung kann weiterhin manuell zugeordnet werden.</p>
      )}
    </div>
    {orders.length === 0 && <p className="mt-3 text-slate-600">Keine offenen Bestellungen.</p>}
    <ul className="mt-3 space-y-3">{orders.map(order => <li key={order.id} className="rounded-lg border border-slate-200 p-3">
      <p className="font-bold">{order.reference} · {order.email}</p>
      <p className="text-xs text-slate-600">Bestellung: {new Date(order.createdAt).toLocaleString("de-DE")}
        {order.paypalStartedAt ? ` · PayPal geöffnet: ${new Date(order.paypalStartedAt).toLocaleString("de-DE")}` : " · Kein PayPal-Zeitstempel"}</p>
      <label className="mt-2 block font-semibold">PayPal-Transaktionsnummer
        <input value={transactions[order.id] ?? ""} onChange={e => setTransactions({ ...transactions, [order.id]: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-slate-300 p-2" maxLength={64} /></label>
      <label className="mt-2 flex gap-2"><input type="checkbox" checked={checked[order.id] ?? false}
        onChange={e => setChecked({ ...checked, [order.id]: e.target.checked })} />
        <span>Zahlung für genau diese Bestellung im PayPal-Konto geprüft.</span></label>
      <button type="button" disabled={busy || !checked[order.id] || !transactions[order.id]}
        onClick={() => void release(order)} className="mt-3 min-h-10 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">
        PDF im Kundenkonto freigeben</button>
    </li>)}</ul>
    <div className="mt-5 border-t border-slate-200 pt-4">
      <h3 className="font-bold">Freigabe bei Rückzahlung sperren</h3>
      <input aria-label="PayPal-Transaktionsnummer für Sperrung" value={revokeTransaction}
        onChange={e => setRevokeTransaction(e.target.value)} placeholder="PayPal-Transaktionsnummer"
        className="mt-2 w-full rounded-lg border border-slate-300 p-2" />
      <button type="button" disabled={busy || !revokeTransaction} onClick={() => void revoke()}
        className="mt-2 rounded-lg border border-red-300 px-4 py-2 font-bold text-red-700 disabled:opacity-50">Zugriff sperren</button>
    </div>
    {notice && <p role="status" className="mt-3 font-semibold">{notice}</p>}
  </section>;
}
