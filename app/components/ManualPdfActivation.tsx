"use client";

import { useState } from "react";
import { Download, LockKeyhole } from "lucide-react";

export default function ManualPdfActivation() {
  const [loading, setLoading] = useState(false);
  const [released, setReleased] = useState(false);
  const [message, setMessage] = useState("");

  async function activate() {
    if (loading) return;
    const match = /^#token=([0-9a-f]{64})$/.exec(window.location.hash);
    if (!match) {
      setMessage("Der Freigabelink ist unvollständig oder nicht gültig. Bitte die vollständige E-Mail-Verknüpfung öffnen.");
      return;
    }
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/guide-shop/manual/redeem", {
        method: "POST", cache: "no-store", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: match[1] }),
      });
      const body = await response.json() as { released?: boolean; error?: string };
      if (!response.ok || !body.released) throw Error(body.error ?? "Freigabe fehlgeschlagen.");
      window.history.replaceState({}, "", window.location.pathname);
      setReleased(true);
      setMessage("Deine Zahlung wurde von TD Fahrzeugcodierung bestätigt. Die PDF ist freigegeben.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Freigabe nicht möglich.");
    } finally { setLoading(false); }
  }

  return (
    <section className="mt-6 rounded-2xl border border-blue-200 bg-white p-5 sm:p-8">
      <h1 className="text-2xl font-black text-slate-900">Golf 7 VZE – PDF-Freigabe</h1>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Dein Zahlungseingang wurde von TD Fahrzeugcodierung geprüft.
        Aktiviere mit dem persönlichen Freigabelink aus unserer E-Mail den geschützten Download.
        Der Link kann nur einmal eingelöst werden. Danach bleibt die Datei in demselben
        Browser 30 Tage abrufbar. Bitte speichere die PDF direkt.
      </p>
      {released ? (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-bold text-green-900">PDF freigegeben</p>
          <a href="/api/guide-shop/download/golf7-vze"
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3
              font-bold text-white hover:bg-blue-800">
            <Download size={18} aria-hidden="true" /> PDF jetzt herunterladen
          </a>
          <a href="/api/guide-shop/guest/confirmation"
            className="mt-3 inline-flex min-h-11 items-center font-bold text-blue-800 underline">
            Bestellbestätigung herunterladen
          </a>
        </div>
      ) : <button type="button" onClick={() => void activate()} disabled={loading}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg
          bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-50">
        <LockKeyhole size={18} aria-hidden="true"/>
        {loading ? "Freigabe wird geprüft …" : "PDF-Zugriff aktivieren"}
      </button>}
      {message && <p className="mt-3 text-sm text-slate-700" role="status">{message}</p>}
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Ein PayPal-Zahlungsbeleg allein öffnet den Download nicht. Nur ein von TD Fahrzeugcodierung
        nach überprüftem Zahlungseingang ausgestellter Freigabelink berechtigt zur Aktivierung.
      </p>
    </section>
  );
}
