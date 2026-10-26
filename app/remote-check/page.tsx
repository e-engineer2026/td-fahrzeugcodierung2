"use client";

import { useState } from "react";
import Link from "next/link";

const interfaces = ["VCDS", "VCP", "OBD11", "Noch kein Interface", "Anderes Interface"];

export default function RemoteCheck() {
  const [brand, setBrand] = useState("Volkswagen");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [diagnostic, setDiagnostic] = useState("VCDS");
  const [functionWish, setFunctionWish] = useState("");
  const [windows, setWindows] = useState(false);
  const [internet, setInternet] = useState(false);
  const [power, setPower] = useState(false);
  const validYear = /^\d{4}$/.test(year) && Number(year) >= 1990 && Number(year) <= new Date().getFullYear() + 1;
  const ready = model.trim() && validYear && functionWish.trim();
  const message = [
    "Hallo, ich möchte eine Remote-Codierung vorprüfen lassen.",
    "Marke: " + brand,
    "Modell: " + model,
    "Baujahr: " + year,
    "Diagnoseinterface: " + diagnostic,
    "Gewünschte Codierung: " + functionWish,
    "Windows-PC am Fahrzeug: " + (windows ? "Ja" : "Nein / unklar"),
    "Stabile Internetverbindung: " + (internet ? "Ja" : "Nein / unklar"),
    "Spannungsversorgung geklärt: " + (power ? "Ja" : "Nein / unklar")
  ].join("\n");
  return <main className="mx-auto max-w-3xl px-5 py-12 text-slate-900">
    <Link href="/" className="text-sm font-semibold text-blue-700">← Zur Startseite</Link>
    <h1 className="mt-8 text-3xl font-bold">Remote-Codierung vorprüfen</h1>
    <p className="mt-4 text-slate-600">Prüfe die Voraussetzungen für eine Codierung per Fernzugriff. Die tatsächliche Machbarkeit hängt von Fahrzeug, Softwarestand, Ausstattung, Schutzmechanismen und Diagnoseinterface ab.</p>
    <div className="mt-8 grid gap-5 rounded-2xl border border-slate-200 p-6">
      <label className="grid gap-2">Marke<select className="rounded-lg border p-3" value={brand} onChange={e=>setBrand(e.target.value)}>{["Volkswagen","Audi","Škoda","SEAT","CUPRA"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="grid gap-2">Modell / Baureihe<input className="rounded-lg border p-3" value={model} onChange={e=>setModel(e.target.value)} placeholder="z. B. Golf 7" /></label>
      <label className="grid gap-2">Baujahr<input className="rounded-lg border p-3" inputMode="numeric" maxLength={4} value={year} onChange={e=>setYear(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="z. B. 2018" /></label>
      <label className="grid gap-2">Diagnoseinterface<select className="rounded-lg border p-3" value={diagnostic} onChange={e=>setDiagnostic(e.target.value)}>{interfaces.map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="grid gap-2">Gewünschte Codierung<textarea className="rounded-lg border p-3" rows={3} value={functionWish} onChange={e=>setFunctionWish(e.target.value)} placeholder="Was möchtest du ändern?" /></label>
      <div className="grid gap-3">
        <label><input type="checkbox" checked={windows} onChange={e=>setWindows(e.target.checked)} /> Windows-Laptop am Fahrzeug vorhanden</label>
        <label><input type="checkbox" checked={internet} onChange={e=>setInternet(e.target.checked)} /> Stabile Internetverbindung vorhanden</label>
        <label><input type="checkbox" checked={power} onChange={e=>setPower(e.target.checked)} /> Spannungsversorgung nach Absprache möglich</label>
      </div>
      <p className="text-sm text-slate-600">{windows && internet && power && diagnostic !== "Noch kein Interface" ? "Die allgemeinen Voraussetzungen wirken passend. Eine fahrzeugspezifische Freigabe ist erst nach Prüfung möglich." : "Einige Voraussetzungen sind noch offen. Du kannst trotzdem eine individuelle Vorprüfung anfragen."}</p>
      <a aria-disabled={!ready} className={`rounded-xl px-5 py-3 text-center font-semibold text-white ${ready ? "bg-blue-700" : "pointer-events-none bg-slate-400"}`} href={ready ? "https://wa.me/4915563047044?text=" + encodeURIComponent(message) : "#"}>Vorprüfung per WhatsApp anfragen</a>
      <p className="text-xs text-slate-500">Keine automatische Zusage. SFD2 und nicht unterstützte Schutzmechanismen sind ausgeschlossen.</p>
    </div>
  </main>;
}
