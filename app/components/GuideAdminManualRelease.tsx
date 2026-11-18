"use client";

import { useState, type FormEvent } from "react";
import { Copy, LockKeyhole, Mail, ShieldCheck, ShieldX } from "lucide-react";

type ReleaseResult = { link?: string; recipientEmail?: string; error?: string };
type Payment = { id: string; date: string; amount: string; status: string;
  note: string; payerEmail: string; productMatch: boolean; released: boolean };

export default function GuideAdminManualRelease() {
  const [email, setEmail] = useState("");
  const [transaction, setTransaction] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [link, setLink] = useState("");
  const [releasedEmail, setReleasedEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [revocation, setRevocation] = useState("");
  const [revoking, setRevoking] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loadingPayments, setLoadingPayments] = useState(false);

  async function refreshPayments() {
    setLoadingPayments(true); setPaymentStatus("");
    try {
      const response = await fetch("/api/guide-shop/admin/payments", { cache: "no-store", credentials: "same-origin" });
      const data = await response.json() as { payments?: Payment[]; error?: string };
      if (!response.ok) {
        const messages: Record<string, string> = {
          not_configured: "PayPal-Umsatzsuche ist noch nicht mit dem Empfängerkonto verbunden.",
          credentials_rejected: "PayPal hat die Zugangsdaten abgelehnt.",
          reporting_scope_missing: "Der PayPal-App fehlt die Berechtigung „Transaction Search“.",
          reporting_permission_denied: "PayPal hat den Zugriff auf die Umsatzsuche verweigert.",
          too_many_results: "Mehr als 100 Treffer. Bitte direkt im PayPal-Konto prüfen.",
        };
        throw new Error(messages[data.error ?? ""] ?? "PayPal-Umsätze derzeit nicht abrufbar.");
      }
      setPayments(data.payments ?? []);
      setPaymentStatus(`${data.payments?.length ?? 0} Zahlungen über 13,99 € aus den letzten 14 Tagen gefunden. Neue Zahlungen können bei PayPal verzögert erscheinen.`);
    } catch (error) {
      setPayments([]);
      setPaymentStatus(error instanceof Error ? error.message : "Umsatzsuche fehlgeschlagen.");
    } finally { setLoadingPayments(false); }
  }

  async function issue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!paymentVerified || processing) return;
    setProcessing(true); setNotice(""); setLink("");
    try {
      const response = await fetch("/api/guide-shop/admin/manual-grants", {
        method: "POST", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: email, transactionId: transaction, paymentVerified }),
      });
      const data = await response.json() as ReleaseResult;
      if (!response.ok || !data.link) throw new Error(data.error ?? "Freigabelink konnte nicht erstellt werden.");
      setLink(data.link);
      setReleasedEmail(data.recipientEmail ?? email);
      setNotice("Freigabelink erstellt. Er wird NICHT automatisch verschickt. Bitte jetzt per E-Mail zustellen.");
      setPaymentVerified(false);
      void refreshPayments();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Freigabe fehlgeschlagen.");
    } finally { setProcessing(false); }
  }

  async function revoke(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.confirm("Freigabe zu dieser Transaktion wirklich sperren? Der Kunde verliert den erneuten PDF-Zugriff.")) return;
    setRevoking(true); setNotice(""); setLink("");
    try {
      const response = await fetch("/api/guide-shop/admin/manual-grants", {
        method: "DELETE", credentials: "same-origin", cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: revocation }),
      });
      const data = await response.json() as { revoked?: boolean; downloadBlocked?: boolean; error?: string };
      if (!response.ok || !data.revoked) throw new Error(data.error ?? "Sperrung fehlgeschlagen.");
      setNotice(data.downloadBlocked ? "Freigabe gesperrt. Auch der bereits aktivierte Download ist gesperrt."
        : "Noch nicht eingelöster Freigabelink gesperrt.");
      setRevocation("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Sperrung fehlgeschlagen.");
    } finally { setRevoking(false); }
  }

  const subject = encodeURIComponent("TD Fahrzeugcodierung – Golf 7 VZE PDF freigegeben");
  const message = encodeURIComponent([
    "Guten Tag,",
    "",
    "wir haben den Zahlungseingang für die PDF-Anleitung TD-G7-AS-003",
    "(Golf 7 / 7.5 Verkehrszeichenerkennung, 13,99 EUR) geprüft.",
    "",
    "Ihr persönlicher Freigabelink:",
    link,
    "",
    "Öffnen Sie den Link und klicken Sie auf „PDF-Zugriff aktivieren“.",
    "Anschließend können Sie die PDF und die Bestellbestätigung herunterladen.",
    "Der Einmallink ist 7 Tage gültig und kann nur einmal aktiviert werden.",
    "Nach Aktivierung ist der Abruf im selben Browser 30 Tage möglich.",
    "Bitte speichern Sie die PDF direkt.",
    "",
    "AGB: https://td-fahrzeugcodierung.de/agb",
    "Widerruf: https://td-fahrzeugcodierung.de/widerruf",
    "",
    "Freundliche Grüße",
    "TD Fahrzeugcodierung",
    "info@td-fahrzeugcodierung.de",
  ].join("\n"));
  const mailto = `mailto:${encodeURIComponent(releasedEmail)}?subject=${subject}&body=${message}`;

  return (
    <section className="mt-6 rounded-xl border border-blue-200 bg-white p-5 text-sm">
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <ShieldCheck size={20} aria-hidden="true" /> PayPal.Me-Zahlung prüfen und PDF freigeben
      </h2>
      <p className="mt-2 leading-6 text-slate-700">
        Nur für die manuelle Zahlung über PayPal.Me/TiDrechsler. Prüfe im
        tatsächlichen PayPal-Empfängerkonto, ob die Transaktion endgültig
        eingegangen ist, genau 13,99 EUR beträgt und zur Golf-7-VZE-Anleitung gehört.
        Eine Kundenmeldung oder ein Screenshot genügt nicht als Zahlungsnachweis.
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold">PayPal-Zahlungen im Empfängerkonto</h3>
          <button type="button" onClick={() => void refreshPayments()} disabled={loadingPayments}
            className="min-h-10 rounded-lg border border-blue-300 bg-white px-3 font-bold text-blue-800 disabled:opacity-50">
            {loadingPayments ? "Lade …" : "Zahlungen abrufen"}
          </button>
        </div>
        {paymentStatus && <p role="status" className="mt-2 text-xs text-slate-700">{paymentStatus}</p>}
        {payments.length > 0 && <ul className="mt-3 space-y-2">
          {payments.map(payment => <li key={payment.id} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="font-semibold">{payment.amount} € · {payment.date ? new Date(payment.date).toLocaleString("de-DE") : "Datum unbekannt"}</div>
            <p className="break-all text-xs">{payment.id} · {payment.payerEmail || "E-Mail unbekannt"}</p>
            <p className="text-xs">{payment.status === "S" ? "Abgeschlossen" : "Nicht abgeschlossen"} · {payment.productMatch ? "Artikelnummer gefunden" : "Artikel nicht eindeutig zugeordnet"}{payment.released ? " · Bereits freigegeben" : ""}</p>
            {payment.note && <p className="text-xs">Verwendungszweck: {payment.note}</p>}
            <button type="button" disabled={payment.status !== "S" || payment.released || !payment.productMatch}
              onClick={() => { setTransaction(payment.id); setEmail(payment.payerEmail); setPaymentVerified(false);
                setNotice("Zahlung ausgewählt. Empfänger und Artikel prüfen und unten bestätigen."); }}
              className="mt-2 rounded-lg border border-blue-300 px-3 py-2 font-bold text-blue-800 disabled:opacity-50">
              Für PDF-Freigabe übernehmen
            </button>
          </li>)}
        </ul>}
      </div>

      <form onSubmit={(event) => void issue(event)} className="mt-4 space-y-3">
        <div>
          <label className="block font-semibold" htmlFor="manual-recipient-email">E-Mail-Adresse für den Freigabelink</label>
          <input id="manual-recipient-email" type="email" required value={email}
            onChange={(event) => setEmail(event.target.value)} autoComplete="off"
            className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="kunde@beispiel.de" />
        </div>
        <div>
          <label className="block font-semibold" htmlFor="manual-transaction-id">PayPal-Transaktionsnummer</label>
          <input id="manual-transaction-id" type="text" required minLength={8} maxLength={64}
            value={transaction} onChange={(event) => setTransaction(event.target.value)}
            autoComplete="off" className="mt-1 w-full rounded-lg border border-slate-300 p-3"
            placeholder="Transaktionsnummer aus dem PayPal-Konto" />
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" checked={paymentVerified} required
            onChange={(event) => setPaymentVerified(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" />
          <span>Ich habe den echten Zahlungseingang in PayPal geprüft: 13,99 EUR, richtiger Artikel,
            richtige Transaktionsnummer, keine offene oder stornierte Zahlung.</span>
        </label>
        <button type="submit" disabled={processing || !paymentVerified}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg
            bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800 disabled:opacity-50">
          <LockKeyhole size={17} aria-hidden="true" />
          {processing ? "Erstelle Freigabelink …" : "Geprüfte Zahlung freigeben"}
        </button>
      </form>

      {link && <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="font-bold text-green-900">Einmaliger PDF-Freigabelink erstellt</p>
        <p className="mt-1 text-xs leading-5 text-green-900">
          Der Link ist vertraulich. Er wird nicht automatisch per E-Mail versendet.
          Nur an den tatsächlich zahlenden Kunden schicken.
        </p>
        <input type="text" readOnly value={link} aria-label="PDF-Freigabelink"
          className="mt-3 w-full rounded-lg border border-green-200 bg-white p-2 text-xs" />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => void navigator.clipboard.writeText(link)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 font-bold text-white">
            <Copy size={16} aria-hidden="true" /> Link kopieren
          </button>
          <a href={mailto} className="inline-flex min-h-10 items-center gap-2 rounded-lg
            border border-green-600 bg-white px-3 py-2 font-bold text-green-800">
            <Mail size={16} aria-hidden="true" /> E-Mail mit Link vorbereiten
          </a>
        </div>
      </div>}

      {notice && <p className="mt-3 text-sm text-slate-700" role="status">{notice}</p>}

      <form onSubmit={(event) => void revoke(event)}
        className="mt-6 border-t border-slate-200 pt-4">
        <h3 className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldX size={17} aria-hidden="true" /> Freigabe bei Rückzahlung sperren
        </h3>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Bei Erstattung, Storno oder Streitfall die Transaktionsnummer eingeben.
          Die vorhandene PDF-Datei beim Kunden kann nicht zurückgerufen werden.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input type="text" required minLength={8} maxLength={64}
            aria-label="PayPal-Transaktionsnummer sperren" value={revocation}
            onChange={(event) => setRevocation(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 p-2" />
          <button type="submit" disabled={revoking}
            className="min-h-10 rounded-lg border border-red-300 px-4 py-2 font-bold text-red-700
            disabled:opacity-50">Zugriff sperren</button>
        </div>
      </form>
    </section>
  );
}
