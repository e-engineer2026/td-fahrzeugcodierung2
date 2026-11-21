"use client";

import { useState } from "react";
import { CreditCard, FileText, Settings2 } from "lucide-react";
import GuideAdminPdfUpload from "./GuideAdminPdfUpload";
import GuideAdminManualRelease from "./GuideAdminManualRelease";
import GuideAdminAccountOrders from "./GuideAdminAccountOrders";
import GuideAdminVzeVariants from "./GuideAdminVzeVariants";

type Check = { name: string; ready: boolean };
type Tab = "payments" | "documents" | "more";
type Props = {
  production: boolean;
  preview: boolean;
  liveMode: boolean;
  liveChecks: Check[];
  paypalChecks: Check[];
};

const tabs: { id: Tab; label: string; Icon: typeof CreditCard }[] = [
  { id: "payments", label: "Zahlungen", Icon: CreditCard },
  { id: "documents", label: "PDF-Dateien", Icon: FileText },
  { id: "more", label: "Weitere", Icon: Settings2 },
];

/** Nur die Oberfläche wird vereinfacht. Alle Berechtigungen bleiben serverseitig geprüft. */
export default function GuideAdminWorkspace({ production, preview, liveMode, liveChecks, paypalChecks }: Props) {
  const [active, setActive] = useState<Tab>(production ? "payments" : "documents");
  return <div className="mt-5">
    <nav className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1.5" aria-label="PDF-Verwaltung">
      {tabs.map(({ id, label, Icon }) => <button key={id} type="button"
        aria-current={active === id ? "page" : undefined}
        onClick={() => setActive(id)}
        className={"flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-xs font-bold sm:flex-row sm:gap-2 sm:text-sm " +
          (active === id ? "bg-white text-blue-800 shadow-sm ring-1 ring-blue-200" :
            "text-slate-600 hover:bg-white/70 hover:text-blue-800")}>
        <Icon size={17} aria-hidden="true" /> {label}
      </button>)}
    </nav>

    {active === "payments" && <section aria-label="Zahlungen und Bestellungen">
      <p className="mt-4 text-sm text-slate-600">Bestellungen prüfen, PayPal-Zahlungen zuordnen und den gekauften Download freigeben.</p>
      {production ? <GuideAdminAccountOrders /> :
        <p className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm">Bestellungen können nur in der Produktionsumgebung bearbeitet werden.</p>}
    </section>}

    {active === "documents" && <section aria-label="PDF-Dateien verwalten">
      <p className="mt-4 text-sm text-slate-600">Fertiggestellte Anleitungen sicher hinterlegen und verwalten.</p>
      {production && <GuideAdminVzeVariants />}
      <details className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-bold text-slate-900">Golf 7 VZE · PDF Rev. 1.3 verwalten</summary>
        <GuideAdminPdfUpload />
      </details>
    </section>}

    {active === "more" && <section aria-label="Weitere Funktionen">
      <p className="mt-4 text-sm text-slate-600">Sonderfälle und technische Informationen. Für normale Bestellungen nicht erforderlich.</p>
      {production && <details className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-bold text-slate-900">Gastkauf: Persönlichen PDF-Link erstellen</summary>
        <GuideAdminManualRelease />
      </details>}

      <details className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer font-bold text-slate-900">Technischer Shop-Status</summary>
        <p className="mt-2 text-xs text-slate-600">
          {production ? "PayPal.Me bleibt von der optionalen PayPal-Live-Konfiguration getrennt." :
            "Einstellungen dieser Vorschauumgebung."}
          {" "}Diese Prüfpunkte zeigen nur die Konfiguration, keinen bestätigten Zahlungsablauf.
        </p>
        <p className="mt-3 text-sm font-bold">{preview ? "Sandbox-Einstellungen" : "PayPal-Live-Einstellungen"}
          {production && <span className={"ml-2 text-xs " + (liveMode ? "text-green-700" : "text-slate-500")}>
            {liveMode ? "Konfiguriert" : "Nicht aktiviert"}
          </span>}
        </p>
        <ul className="mt-3 space-y-2">
          {(preview ? paypalChecks : liveChecks).map(check => <li key={check.name}
            className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 text-xs">
            <span className="text-slate-700">{check.name}</span>
            <span className={check.ready ? "font-bold text-green-700" : "font-medium text-slate-500"}>
              {check.ready ? "Eingerichtet" : "Offen"}
            </span>
          </li>)}
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-600">
          Eine grüne Konfiguration ersetzt weder eine echte Testzahlung noch die fachliche und rechtliche Prüfung.
        </p>
        <a href="https://vercel.com/e-engineer2026s-projects/td-fahrzeugcodierung/settings/environment-variables"
          target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-blue-700 underline">
          Vercel-Einstellungen
        </a>
      </details>
    </section>}
  </div>;
}
