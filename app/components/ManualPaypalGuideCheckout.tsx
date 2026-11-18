"use client";

import { useEffect, useState } from "react";
import { CreditCard, Download, Mail, ShieldCheck } from "lucide-react";

const paymentUrl = "https://paypal.me/TiDrechsler/13.99EUR";
const contactEmail = "info@td-fahrzeugcodierung.de";
const productRef = "TD-G7-AS-003";

export default function ManualPaypalGuideCheckout() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [manualDeliveryAccepted, setManualDeliveryAccepted] = useState(false);
  const [paymentOpened, setPaymentOpened] = useState(false);
  const [paid, setPaid] = useState(false);
  const [documentAvailable, setDocumentAvailable] = useState(false);
  const [orderRef, setOrderRef] = useState(productRef);

  useEffect(() => {
    let reference = window.sessionStorage.getItem("td_g7_pdf_order_ref");
    if (!reference) {
      reference = `${productRef}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      window.sessionStorage.setItem("td_g7_pdf_order_ref", reference);
    }
    setOrderRef(reference);
    let active = true;
    void fetch("/api/guide-shop/guest/status", {
      cache: "no-store", credentials: "same-origin",
    }).then(async (response) => {
      if (!response.ok) return;
      const data = await response.json() as {
        golf7Vze?: { paid: boolean; documentAvailable: boolean };
      };
      if (active && data.golf7Vze?.paid) {
        setPaid(true);
        setDocumentAvailable(data.golf7Vze.documentAvailable);
      }
    }).catch(() => { /* Seite bleibt im manuellen Bestellmodus. */ });
    return () => { active = false; };
  }, []);

  const contactSubject = encodeURIComponent("PDF-Bestellung Golf 7 VZE – " + orderRef);
  const contactBody = encodeURIComponent([
    "Guten Tag,",
    "",
    "ich habe die Golf-7-VZE-PDF-Anleitung (13,99 EUR) über PayPal.Me/TiDrechsler bezahlt.",
    "Bitte prüfen Sie den Zahlungseingang und senden Sie mir einen persönlichen PDF-Freigabelink.",
    "",
    "PayPal-Transaktionsnummer: ",
    `Bestellnummer / Verwendungszweck: ${orderRef}`,
    "Name bei PayPal: ",
    "E-Mail-Adresse für den PDF-Versand: ",
    "",
    "Hinweis: Der Download wird nicht automatisch freigeschaltet.",
  ].join("\n"));
  const contactUrl = `mailto:${contactEmail}?subject=${contactSubject}&body=${contactBody}`;

  if (paid) return (
    <section className="rounded-xl border border-green-200 bg-green-50 p-5 text-sm leading-6">
      <h2 className="font-bold text-green-900">Deine PDF wurde freigegeben</h2>
      <p className="mt-2 text-green-950">Deine Zahlung wurde geprüft. Du brauchst kein Kundenkonto.
        Die PDF kannst du in diesem Browser innerhalb von 30 Tagen nach Aktivierung herunterladen.</p>
      {documentAvailable ? <div className="mt-3 flex flex-wrap gap-3">
        <a href="/api/guide-shop/download/golf7-vze"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white">
          <Download size={17} aria-hidden="true" /> PDF herunterladen
        </a>
        <a href="/api/guide-shop/guest/confirmation"
          className="inline-flex min-h-11 items-center rounded-lg border border-green-300 px-4 py-2 font-bold text-blue-800">
          Bestellbestätigung
        </a>
      </div> : <p className="mt-2 text-red-800">Das Dokument ist derzeit nicht abrufbar. Bitte den Support kontaktieren.</p>}
    </section>
  );

  return (
    <section className="rounded-xl border border-blue-200 bg-white p-4 text-sm leading-6 sm:p-5"
      aria-label="Manuelle PayPal-Zahlung für die PDF-Anleitung">
      <div className="flex items-center gap-2 font-bold text-slate-900">
        <CreditCard size={19} aria-hidden="true" />
        PDF per PayPal bezahlen – 13,99 €
      </div>
      <p className="mt-2 text-slate-700">
        Bezahlung über dasselbe PayPal.Me-Profil wie bei den Fahrzeugcodierungen.
        Es ist keine PayPal-Developer-App und kein Kundenkonto auf dieser Website nötig.
      </p>
      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-950">
        <strong>Manuelle Zustellung:</strong> Nach der Zahlung bitte den Zahlungseingang
        per E-Mail melden. TD Fahrzeugcodierung prüft die Transaktion und versendet
        danach einen <strong>persönlichen Freigabelink per E-Mail</strong>.
        Mit diesem Link lässt sich der geschützte PDF-Download einmalig aktivieren.
        Die Freigabe erfolgt nicht automatisch mit der PayPal-Zahlung.
      </p>
      <p className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-950">
        <strong>Deine Bestellnummer: {orderRef}</strong><br />
        Trage sie bei PayPal als Nachricht oder Verwendungszweck ein. PayPal.Me überträgt sie
        nicht automatisch. Nenne sie zusammen mit der Transaktionsnummer in deiner E-Mail.
      </p>
      <div className="mt-4 space-y-3 text-slate-700">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0" />
          <span>Ich habe die <a className="font-semibold text-blue-700 underline" href="/agb">AGB</a> und
          die <a className="font-semibold text-blue-700 underline" href="/widerruf">Widerrufsbelehrung</a> gelesen.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={manualDeliveryAccepted}
            onChange={(event) => setManualDeliveryAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0" />
          <span>Ich habe verstanden, dass die Zahlung manuell geprüft wird und die PDF
          erst danach über einen persönlichen E-Mail-Freigabelink abrufbar wird.
          Gesetzliche Widerrufsrechte bleiben unberührt.</span>
        </label>
      </div>
      <a href={termsAccepted && manualDeliveryAccepted ? paymentUrl : undefined}
        onClick={(event) => {
          if (!termsAccepted || !manualDeliveryAccepted) {
            event.preventDefault();
            return;
          }
          setPaymentOpened(true);
        }}
        target="_blank" rel="noopener noreferrer"
        aria-disabled={!termsAccepted || !manualDeliveryAccepted}
        className={`mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center font-bold ${termsAccepted && manualDeliveryAccepted
          ? "bg-blue-700 text-white transition hover:bg-blue-800"
          : "cursor-not-allowed bg-slate-200 text-slate-500"}`}>
        <CreditCard size={18} aria-hidden="true" />
        Zahlungspflichtig per PayPal bezahlen · 13,99 €
      </a>
      <p className="mt-2 text-xs text-slate-600">
        Der Link führt zum bestehenden Profil paypal.me/TiDrechsler. Bitte vor der
        Zahlungsbestätigung den angezeigten Empfänger kontrollieren und eine
        geschäftliche Zahlung für Waren/Dienstleistungen verwenden.
      </p>
      <div className="mt-5 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Mail size={17} aria-hidden="true" /> Nach der Zahlung
        </div>
        <p className="mt-1 text-slate-700">Bitte die PayPal-Transaktionsnummer und deine
          E-Mail-Adresse für den Freigabelink mitteilen. Der Bezahlvorgang allein liefert uns
          nicht automatisch die benötigte Zuordnung zur PDF-Bestellung.</p>
        <a href={contactUrl} className="mt-3 inline-flex min-h-11 w-full items-center
          justify-center gap-2 rounded-lg border border-blue-300 px-4 py-2 text-center
          font-bold text-blue-800 hover:bg-blue-50 sm:w-auto">
          <Mail size={17} aria-hidden="true" /> Zahlung melden und PDF anfordern
        </a>
        {paymentOpened && <p role="status" className="mt-2 text-xs text-slate-600">
          PayPal wurde in einem neuen Tab geöffnet. Kehre nach deiner Zahlung
          hierher zurück und melde die Zahlung per E-Mail. Wir prüfen sie und senden dir einen Freigabelink.
        </p>}
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
        <ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        Die bestehende automatische PDF-Download-Sperre wird durch diesen
        Zahlungslink nicht aufgehoben.
      </p>
    </section>
  );
}
