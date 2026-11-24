"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Summary = {
  metrics: Record<string, number>;
  tasks: Array<{ key: string; label: string; href: string; count: number }>;
  generatedAt: string;
};
const tiles = [
  { key: "serviceNew", title: "Neue Kundenanfragen" },
  { key: "serviceReview", title: "Technische Vorprüfungen" },
  { key: "serviceScheduled", title: "Geplante Termine" },
  { key: "serviceActive", title: "Aktive Aufträge" },
  { key: "pdfDrafts", title: "PDF-Entwürfe" },
  { key: "pdfStoredPublished", title: "Gespeicherte, veröffentlichte PDFs" },
  { key: "accountPending", title: "Offene Konto-PDF-Bestellungen" },
  { key: "guestPending", title: "Offene Gast-PDF-Bestellungen" },
  { key: "unlinkedBookings", title: "Cal.com-Termine ohne Zuordnung" },
] as const;

export default function AdminDashboardOverview() {
  const [data, setData] = useState<Summary | null>(null);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/dashboard", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async response => {
        const body = await response.json() as Summary & { error?: string };
        if (!response.ok) throw new Error(body.error ?? "Übersicht nicht erreichbar.");
        if (!controller.signal.aborted) setData(body);
      }).catch(error => {
        if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Laden fehlgeschlagen.");
      });
    return () => controller.abort();
  }, [refreshKey]);
  const refresh = () => { setData(null); setMessage(""); setRefreshKey(i => i + 1); };
  return <section className="mt-6 rounded-xl border border-blue-200 bg-white p-4 sm:p-5" aria-labelledby="td-dashboard-heading">
    <div className="flex items-center justify-between gap-3">
      <h2 id="td-dashboard-heading" className="text-xl font-bold text-slate-900">Admin-Dashboard</h2>
      <button type="button" className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-bold text-blue-800"
        onClick={refresh}>Aktualisieren</button>
    </div>
    <p className="mt-1 text-xs text-slate-600">
      Live-Kennzahlen aus der internen Datenbank. Keine Bestätigung von PayPal-Zahlungen oder technischen Fahrzeugfreigaben.
    </p>
    {!data && !message && <p className="mt-4 text-sm text-slate-600" role="status">Kennzahlen werden geladen …</p>}
    {message && <p className="mt-4 text-sm font-semibold text-red-700" role="alert">{message}</p>}
    {data && <>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {tiles.map(tile => <div key={tile.key} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-2xl font-bold tabular-nums text-blue-800">{data.metrics[tile.key] ?? 0}</p>
          <p className="mt-1 text-xs font-semibold text-slate-600">{tile.title}</p>
        </div>)}
      </div>
      <h3 className="mt-5 font-bold text-slate-900">Offene Aufgaben</h3>
      {data.tasks.length === 0 ?
        <p className="mt-2 text-sm text-slate-600">Keine offenen Aufgaben in den erfassten Bereichen.</p> :
        <ul className="mt-2 space-y-2">{data.tasks.map(task =>
          <li key={task.key} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
            <span className="font-semibold">{task.label} ({task.count})</span>
            <Link href={task.href} className="font-bold text-blue-700 underline">Zur Bearbeitung</Link>
          </li>)}</ul>}
      <p className="mt-3 text-xs text-slate-500">
        Stand: {new Date(data.generatedAt).toLocaleString("de-DE")}.
        Technische Fehler aus Vercel und nicht zugeordnete externe FormSubmit-Anfragen sind hier noch nicht enthalten.
      </p>
    </>}
  </section>;
}
