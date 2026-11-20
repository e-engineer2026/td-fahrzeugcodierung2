"use client";

import { useEffect, useState } from "react";

export type GmailReceipt = {
  messageId: string;
  subject: string;
  messageAt: string;
  transactionId: string | null;
  amountCents: number | null;
  currency: string | null;
};

type ConnectionStatus = {
  configured: boolean;
  lastReceivedAt: string | null;
  receipts: GmailReceipt[];
};

export default function GuideAdminGmailConnection({
  onUseReceipt,
}: {
  onUseReceipt: (receipt: GmailReceipt) => void;
}) {
  const [state, setState] = useState<ConnectionStatus | null>(null);
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const response = await fetch("/api/guide-shop/admin/gmail-connection", {
        credentials: "same-origin", cache: "no-store",
      });
      const data = await response.json() as ConnectionStatus & { error?: string };
      if (!response.ok) throw new Error(data.error || "Gmail-Status nicht abrufbar.");
      setState(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Gmail-Status nicht abrufbar."); }
  }
  useEffect(() => { void refresh(); }, []);

  async function createKey() {
    if (state?.configured && !window.confirm(
      "Ein neuer Schlüssel deaktiviert die bisherige Verbindung. Neuen Schlüssel erstellen?"
    )) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/guide-shop/admin/gmail-connection", {
        method: "POST", credentials: "same-origin",
      });
      const data = await response.json() as { secret?: string; error?: string };
      if (!response.ok || !data.secret) throw new Error(data.error ?? "Schlüssel konnte nicht erstellt werden.");
      setSecret(data.secret);
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Schlüssel konnte nicht erstellt werden."); }
    finally { setBusy(false); }
  }

  return <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="font-bold text-slate-900">Gmail-Zahlungsbenachrichtigungen</h3>
      <button type="button" onClick={() => void refresh()}
        className="rounded-lg border border-blue-300 px-3 py-2 font-bold text-blue-800">
        Aktualisieren
      </button>
    </div>
    <p className="mt-2 text-slate-700">PayPal.Me-Zahlungseingänge aus deinem Gmail-Postfach automatisch
      als unverifizierte Hinweise in diese Verwaltung übernehmen. Die PDF wird niemals allein durch eine Mail freigeschaltet.</p>
    <p className="mt-2 text-xs text-slate-600">
      {state?.configured ? "Verbindungsschlüssel eingerichtet." : "Noch kein Verbindungsschlüssel eingerichtet."}
      {" "}Letzter erfolgreicher Import: {state?.lastReceivedAt
        ? new Date(state.lastReceivedAt).toLocaleString("de-DE")
        : "Noch keiner"}
    </p>

    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" disabled={busy} onClick={() => void createKey()}
        className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 font-bold text-blue-800 disabled:opacity-50">
        {state?.configured ? "Verbindungsschlüssel erneuern" : "Verbindungsschlüssel erstellen"}
      </button>
      <a href="/td-paypal-gmail-import.gs.txt" target="_blank" rel="noopener noreferrer"
        className="rounded-lg border border-slate-300 px-3 py-2 font-bold text-blue-700">
        Google-Apps-Script-Vorlage
      </a>
    </div>
    {secret && <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <p className="font-semibold text-slate-900">Nur einmal sichtbar: Verbindungsschlüssel</p>
      <p className="mt-1 break-all font-mono text-xs text-slate-800">{secret}</p>
      <button type="button" onClick={() => void navigator.clipboard.writeText(secret)}
        className="mt-2 rounded-lg border border-amber-300 bg-white px-3 py-2 font-bold text-slate-900">
        Schlüssel kopieren
      </button>
      <p className="mt-2 text-xs text-slate-700">Den Schlüssel nicht weitergeben.
        Nach dem Schließen dieser Seite kann er nicht erneut angezeigt, nur erneuert werden.</p>
    </div>}
    <div className="mt-3 text-xs leading-5 text-slate-700">
      <strong>Einmalige Einrichtung:</strong>
      <ol className="ml-5 mt-1 list-decimal space-y-1">
        <li><a href="https://script.google.com/home/projects/create" target="_blank"
          rel="noopener noreferrer" className="text-blue-700 underline">Google Apps Script öffnen</a>
          {" "}und mit dem Gmail-Konto anmelden, das die PayPal-Mails empfängt.</li>
        <li>Die Vorlage öffnen, ihren gesamten Inhalt kopieren und als <code>Code.gs</code> einsetzen.</li>
        <li>Unter <strong>Projekteinstellungen → Skripteigenschaften</strong> die Eigenschaft
          {" "}<code>TD_PDF_WEBHOOK_KEY</code> mit dem hier erzeugten Schlüssel anlegen.</li>
        <li>Die Funktion <code>tdInstallTrigger</code> einmal ausführen und Gmail-Zugriff erlauben.
          Der Verbindungstest läuft sofort, danach werden neue passende Nachrichten regelmäßig übertragen.</li>
      </ol>
    </div>
    <div className="mt-4 border-t border-slate-200 pt-3">
      <h4 className="font-bold">Importierte PayPal-Mailhinweise</h4>
      {state?.receipts.length ? <ul className="mt-2 space-y-2">
        {state.receipts.map((receipt) => {
          const relevant = receipt.amountCents === 1399 && receipt.currency === "EUR";
          const actionable = relevant && !!receipt.transactionId;
          return <li key={receipt.messageId} className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold">{receipt.subject}</p>
            <p className="text-xs text-slate-600">E-Mail-Datum: {new Date(receipt.messageAt).toLocaleString("de-DE")}
              {" "}· {relevant ? "13,99 EUR erkannt" : "Betrag nicht eindeutig erkannt"}
              {" "}· Transaktion: {receipt.transactionId ?? "nicht erkannt"}</p>
            <p className="mt-1 text-xs font-semibold text-amber-900">
              Ungeprüfte Gmail-Meldung, keine bestätigte PayPal-Zahlung
            </p>
            {actionable && <button type="button" onClick={() => onUseReceipt(receipt)}
              className="mt-2 rounded-lg border border-blue-300 bg-white px-3 py-2 font-bold text-blue-800">
              Als möglichen Treffer übernehmen
            </button>}
          </li>;
        })}
      </ul> : <p className="mt-2 text-xs text-slate-600">Noch keine passenden Nachrichten importiert.</p>}
    </div>
    {error && <p className="mt-3 text-red-700" role="alert">{error}</p>}
  </section>;
}
