"use client";

import Link from "next/link";
import {
  EQUIPMENT_LABELS,
  type EquipmentKey, type TechnicalEvidence, type PreflightResult,
} from "../lib/technicalPreflight";

type Props = {
  evidence: TechnicalEvidence;
  onChange: (next: TechnicalEvidence) => void;
  result: PreflightResult;
};

export default function TechnicalPreflightCard({ evidence, onChange, result }: Props) {
  if (!result.required.length && result.status === "bookable") return null;
  const update = (key: EquipmentKey, value: TechnicalEvidence[EquipmentKey]) =>
    onChange({ ...evidence, [key]: value });

  return <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4" aria-labelledby="td-preflight-title">
    <h3 id="td-preflight-title" className="text-lg font-bold text-blue-900">Technische Vorprüfung</h3>
    <p className="mt-1 text-sm text-blue-900">
      Prüfe die bekannte Fahrzeugausstattung. Unbekannte oder fehlende Voraussetzungen
      werden nicht als funktionstüchtige Ausstattung vorausgesetzt.
    </p>
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {result.required.map(key => <label key={key} className="text-sm font-semibold text-blue-950">
        {EQUIPMENT_LABELS[key]}
        <select className="mt-1 block w-full rounded-lg border border-blue-200 bg-white p-2 text-slate-900"
          value={evidence[key]} onChange={event => update(key, event.target.value as TechnicalEvidence[EquipmentKey])}>
          <option value="unknown">Noch nicht geprüft</option>
          <option value="yes">Vorhanden</option>
          <option value="no">Nicht vorhanden</option>
        </select>
      </label>)}
      <label className="text-sm font-semibold text-blue-950">SFD-Status laut Diagnose (nicht nach Baujahr geschätzt)
        <select className="mt-1 block w-full rounded-lg border border-blue-200 bg-white p-2 text-slate-900"
          value={evidence.sfd} onChange={event => onChange({ ...evidence, sfd: event.target.value as TechnicalEvidence["sfd"] })}>
          <option value="unknown">Nicht geprüft</option>
          <option value="none">Kein SFD-Schutz bekannt</option>
          <option value="sfd1">SFD1</option>
          <option value="sfd2">SFD2 bestätigt</option>
        </select>
      </label>
    </div>
    {result.status !== "bookable" && <div role="status"
      className={"mt-4 rounded-lg border p-3 text-sm " +
        (result.status === "blocked" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-blue-300 bg-white text-slate-800")}>
      <p className="font-bold">
        {result.status === "blocked" ? "Direkte Codierbuchung derzeit nicht möglich" : "Vor direkter Buchung ist eine technische Prüfung erforderlich"}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {result.reasons.map(reason => <li key={reason}>{reason}</li>)}
      </ul>
      <Link href="/#kontakt" className="mt-3 inline-block font-bold text-blue-700 underline">
        Auto-Scan und Fahrzeugdaten zur Vorprüfung senden
      </Link>
    </div>}
  </section>;
}
