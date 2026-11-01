"use client";

import { useState } from "react";
import { CalendarDays, MessageCircle } from "lucide-react";
import ArrivalGuide from "./ArrivalGuide";

type Snapshot = {
  count: number;
  sfdFee: number;
  prepay: number;
  finalpay: number;
  subtotal: string;
  discount: string;
  total: string;
  rate: number;
  nextTier: string;
  nextDifference: string;
  mode: "onsite" | "remote";
  calUrl: string;
  vehicle: string;
  codings: string[];
};

export default function ConfiguratorLiveActions({ snapshot, onBook, onPayment }: {
  snapshot: Snapshot | null;
  onBook: () => void;
  onPayment: () => void;
}) {
  const [showArrival, setShowArrival] = useState(false);
  const whatsappUrl = (() => {
    if (!snapshot) return "https://wa.me/4915563047044";
    const lines = [
      "Hallo, ich möchte folgende Codierungen anfragen:",
      "",
      `Terminart: ${snapshot.mode === "remote" ? "Remote-Codierung" : "Vor Ort in Leipzig-Süd"}`,
      `Fahrzeug: ${snapshot.vehicle}`,
      "Codierungen:",
      ...snapshot.codings.map((coding) => `• ${coding}`),
      "",
      `Normalpreis: ${snapshot.subtotal} €`,
      `Aktionsrabatt (${snapshot.rate} %): -${snapshot.discount} €`,
      "Für alle Kunden ohne Anmeldung, gültig bis einschließlich 30.11.2026.",
      ...(snapshot.sfdFee ? [`Im Normalpreis enthalten: SFD1-Freischaltung ${snapshot.sfdFee.toFixed(2).replace(".", ",")} € (Aktionsrabatt berücksichtigt).`] : []),
      `Mein Preis: ${snapshot.total} €`,
      "",
      "Bitte kurz Machbarkeit und Termin bestätigen.",
    ];
    return `https://wa.me/4915563047044?text=${encodeURIComponent(lines.join("\n"))}`;
  })();

  return (
    <div id="termin-zahlung" className="mt-4 scroll-mt-20" aria-label="Auswahl, Termin und Zahlung">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
        {snapshot ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[.14em] text-blue-700">Deine Auswahl</div>
                <div className="mt-1 font-black text-slate-950">{snapshot.count} Codierung(en) · {snapshot.vehicle}</div>
              </div>
              <a href="#konfigurator" className="text-sm font-bold text-blue-700 hover:underline">Auswahl ändern</a>
            </div>
            <div className="mt-4 grid gap-2 text-center min-[380px]:grid-cols-3">
              <div className="rounded-xl bg-white p-3"><div className="flex min-h-[3rem] items-center justify-center text-xs leading-tight text-slate-500">Normalpreis</div><div className="mt-1 font-black">{snapshot.subtotal} €</div></div>
              <div className="rounded-xl bg-white p-3"><div className="flex min-h-[3rem] items-center justify-center text-xs leading-tight text-slate-500">Aktionsrabatt</div><div className="mt-1 font-black text-blue-700">−{snapshot.discount} €</div><div className="mt-1 text-xs text-slate-500">({snapshot.rate} %)</div></div>
              <div className="rounded-xl bg-blue-600 p-3 text-white"><div className="flex min-h-[3rem] items-center justify-center text-xs leading-tight text-blue-100">Dein Preis</div><div key={snapshot.total} className="td-price-change mt-1 font-black">{snapshot.total} €</div></div>
            </div>
            <div className="mt-3 rounded-xl border border-blue-100 bg-white px-3 py-3 text-sm leading-6 text-slate-600">
              <div><b className="text-slate-800">Aktionsrabatt für alle:</b> 10 % ab 50 € · 15 % ab 100 € · 20 % ab 150 € · 25 % ab 200 €</div>
              <div className="mt-1 font-semibold text-blue-700">{snapshot.nextTier ? `Noch ${snapshot.nextDifference} € bis ${snapshot.nextTier} € (${snapshot.nextTier === "50" ? 10 : snapshot.nextTier === "100" ? 15 : snapshot.nextTier === "150" ? 20 : 25} % Rabatt).` : "25 % Maximalrabatt erreicht."}</div>
              <div className="td-discount-track" role="progressbar" aria-label="Fortschritt zur nächsten Rabattstufe" aria-valuemin={0} aria-valuemax={Number(snapshot.nextTier || 200)} aria-valuenow={Math.min(Number(snapshot.subtotal.replace(/\./g, "").replace(",", ".")), Number(snapshot.nextTier || 200))}><div style={{ width: `${Math.min(100, Number(snapshot.subtotal.replace(/\./g, "").replace(",", ".")) / Number(snapshot.nextTier || 200) * 100)}%` }} /></div><p className="mt-2">Gültig vom 04.10.2026 bis einschließlich 30.11.2026.</p>
            </div>
            <div className="mt-3 rounded-xl border border-blue-100 bg-white p-3 text-sm leading-6 text-slate-700">
              <b>Zahlung</b>
              {snapshot.mode === "onsite" ? <div className="mt-1">
                <p><b>Im Voraus:</b> PayPal</p>
                <p><b>Direkt beim Termin:</b> Bar · PayPal · Sofortüberweisung</p>
              </div> : <p>PayPal – 70 % vorab, 30 % nach Durchführung.</p>}
            </div>
            <a href={snapshot.calUrl} onClick={() => { onBook(); if (snapshot.mode === "onsite") setShowArrival(true); }} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
              <CalendarDays className="h-5 w-5" /> Termin online vereinbaren
            </a>
            {snapshot.mode === "onsite" ? <a href={`https://paypal.me/TiDrechsler/${snapshot.total.replace(/\./g, "").replace(",", ".")}EUR`} onClick={onPayment} target="_blank" rel="noreferrer" className="btn-secondary mt-3 w-full flex-col gap-1 text-center">
              <span>Gesamtbetrag im Voraus per PayPal zahlen</span><strong>{snapshot.total} €</strong>
            </a> : null}
            {snapshot.mode === "remote" && <div className="mt-4 space-y-3">
              <p className="text-sm leading-6 text-slate-700">Erst Machbarkeit abstimmen und Termin buchen, dann 70 % vorauszahlen. Der Termin wird nach Zahlungseingang verbindlich bestätigt. Die restlichen 30 % sind nach Durchführung fällig.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={`https://paypal.me/TiDrechsler/${snapshot.prepay.toFixed(2)}EUR`} onClick={onPayment} target="_blank" rel="noreferrer" className="btn-primary flex-col gap-1 text-center">
                  <span>70 % per PayPal vorauszahlen</span><strong>{snapshot.prepay.toFixed(2).replace(".", ",")} €</strong>
                </a>
                <a href={`https://paypal.me/TiDrechsler/${snapshot.finalpay.toFixed(2)}EUR`} onClick={onPayment} target="_blank" rel="noreferrer" className="btn-secondary flex-col gap-1 text-center">
                  <span>30 % nach Durchführung zahlen</span><strong>{snapshot.finalpay.toFixed(2).replace(".", ",")} €</strong>
                </a>
              </div>
              <a href="/zahlung" onClick={onPayment} className="inline-block text-sm font-semibold text-blue-700 underline">Zahlungsübersicht öffnen</a>
            </div>}
            <a href={whatsappUrl} onClick={() => { if (snapshot.mode === "onsite") setShowArrival(true); }} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:brightness-95 sm:w-auto">
              <MessageCircle className="h-5 w-5" /> Auswahl per WhatsApp senden
            </a>
            {showArrival && snapshot.mode === "onsite" && <div className="mt-4" aria-live="polite"><ArrivalGuide compact /></div>}
          </>
        ) : (
          <>
            <div className="text-xs font-black uppercase tracking-[.14em] text-blue-700">Schnell anfragen</div>
            <div className="mt-1 font-black text-slate-950">Codierungen auswählen und komplette Auswahl direkt per WhatsApp senden.</div>
            <button type="button" disabled className="mt-4 w-full cursor-not-allowed rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-500">Termin online vereinbaren – zuerst Codierungen auswählen</button>
            <p className="mt-2 text-sm leading-6 text-slate-600">Terminart, Fahrzeug, Codierungen, Aktionsrabatt und Gesamtpreis werden automatisch in die Nachricht übernommen.</p>
          </>
        )}
      </div>

    </div>
  );
}
