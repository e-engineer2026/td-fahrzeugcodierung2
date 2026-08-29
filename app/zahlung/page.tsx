"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PendingBooking {
  vehicle:string;
  year:number;
  vin?:string;
  codings:string;
  total:number;
  prepay:number;
  finalpay:number;
  paypalUrl:string;
  savedAt:number;
}

export default function ZahlungPage(){
  const [booking,setBooking]=useState<PendingBooking|null>(null);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    try{
      const raw=window.localStorage.getItem("td_pending_booking");
      if(raw) setBooking(JSON.parse(raw));
    }catch{}
    setLoaded(true);
  },[]);

  return <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
    <div className="container-x max-w-3xl">
      <Link href="/" className="text-sm font-semibold text-blue-700 hover:underline">← Zurück zur Startseite</Link>

      <section className="card mt-5 p-5 sm:p-8">
        <div className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Termin gebucht</div>
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Jetzt Vorauszahlung abschließen</h1>
        <p className="mt-4 leading-7 text-slate-600">Vielen Dank für deine Terminbuchung. Für Remote-Termine sind jetzt 70 % des Gesamtbetrags per PayPal vorauszuzahlen. Nach Eingang der Vorauszahlung gilt der Termin als verbindlich bestätigt.</p>

        {!loaded ? <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-slate-600">Buchungsdaten werden geladen …</div>
        : booking ? <>
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="text-slate-500">Fahrzeug</span><b className="mt-1 block">{booking.vehicle}</b></div>
              <div><span className="text-slate-500">Baujahr</span><b className="mt-1 block">{booking.year}</b></div>
              {booking.vin&&<div className="sm:col-span-2"><span className="text-slate-500">FIN</span><b className="mt-1 block break-all">{booking.vin}</b></div>}
              <div className="sm:col-span-2"><span className="text-slate-500">Codierungen</span><b className="mt-1 block">{booking.codings}</b></div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><span className="text-sm text-slate-500">Gesamt</span><b className="mt-1 block text-2xl">{booking.total.toFixed(2)} €</b></div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><span className="text-sm text-blue-700">Jetzt 70 %</span><b className="mt-1 block text-2xl text-blue-900">{booking.prepay.toFixed(2)} €</b></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><span className="text-sm text-slate-500">Danach 30 %</span><b className="mt-1 block text-2xl">{booking.finalpay.toFixed(2)} €</b></div>
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">1 · Vorauszahlung vor dem Termin</div>
            <h2 className="mt-2 text-xl font-black">70 % jetzt bezahlen</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Die Vorauszahlung bestätigt deinen Remote-Termin nach Zahlungseingang verbindlich.</p>
            <a href={booking.paypalUrl} target="_blank" rel="noreferrer" className="btn-primary mt-4 w-full text-center sm:w-auto">Jetzt {booking.prepay.toFixed(2)} € per PayPal vorauszahlen</a>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">2 · Restbetrag nach Durchführung</div>
            <h2 className="mt-2 text-xl font-black">30 % nach erfolgreicher Codierung</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Dieser Restbetrag wird erst nach Durchführung der vereinbarten Codierung fällig.</p>
            <a href={`https://paypal.me/TiDrechsler/${booking.finalpay.toFixed(2)}`} target="_blank" rel="noreferrer" className="btn-secondary mt-4 w-full text-center sm:w-auto">{booking.finalpay.toFixed(2)} € Restbetrag per PayPal zahlen</a>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
            <b>Wichtig:</b> Die Terminbuchung allein bestätigt den Remote-Termin noch nicht verbindlich. Die verbindliche Bestätigung erfolgt nach Eingang der 70-%-Vorauszahlung. Die verbleibenden 30 % werden erst nach Durchführung der vereinbarten Codierung fällig.
          </div>
        </> : <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Die Buchungsdaten konnten auf diesem Gerät nicht gefunden werden. Öffne die Zahlungsseite am besten direkt nach der Terminbuchung im selben Browser oder gehe zurück zur Startseite und starte den Buchungsablauf erneut.
        </div>}
      </section>
    </div>
  </main>;
}
