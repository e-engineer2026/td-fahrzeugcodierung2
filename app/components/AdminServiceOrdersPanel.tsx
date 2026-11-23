"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string; email: string; brand: string; model: string; year: number; mode: string;
  services: string; status: string; quoteCents: number | null;
  bookingReference: string | null; adminNote: string | null; createdAt: string;
};
const states = ["requested", "review", "quoted", "scheduled", "in_progress", "completed", "cancelled"];
const labels: Record<string, string> = {
  requested: "Anfrage", review: "Prüfung", quoted: "Angebot", scheduled: "Termin",
  in_progress: "Bearbeitung", completed: "Erledigt", cancelled: "Storniert",
};
type Edit = { status: string; price: string; bookingReference: string; adminNote: string };

export default function AdminServiceOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function refresh() {
    try {
      const response = await fetch("/api/service-orders/admin", { cache: "no-store", credentials: "same-origin" });
      const data = await response.json() as { orders?: Order[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Aufträge konnten nicht geladen werden.");
      const values = data.orders ?? [];
      setOrders(values);
      setEdits(Object.fromEntries(values.map(order => [order.id, {
        status: order.status, price: order.quoteCents === null ? "" : (order.quoteCents / 100).toFixed(2),
        bookingReference: order.bookingReference ?? "", adminNote: order.adminNote ?? "",
      }])));
    } catch (error) { setNotice(error instanceof Error ? error.message : "Laden fehlgeschlagen."); }
  }
  useEffect(() => { void refresh(); }, []);

  async function save(id: string) {
    const entry = edits[id];
    if (!entry) return;
    const numeric = Number(entry.price.replace(",", "."));
    if (entry.price && (!Number.isFinite(numeric) || numeric < 0 || numeric > 20000 ||
      Math.round(numeric * 100) / 100 !== numeric)) {
      setNotice("Angebotspreis prüfen."); return;
    }
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/service-orders/admin", {
        method: "PATCH", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: entry.status,
          quoteCents: entry.price ? Math.round(numeric * 100) : null,
          bookingReference: entry.bookingReference, adminNote: entry.adminNote }),
      });
      const data = await response.json() as { saved?: boolean; error?: string };
      if (!response.ok || !data.saved) throw new Error(data.error ?? "Speichern fehlgeschlagen.");
      setNotice("Auftrag aktualisiert."); await refresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Speichern fehlgeschlagen."); }
    finally { setBusy(false); }
  }

  function change(id: string, field: keyof Edit, value: string) {
    setEdits(old => ({ ...old, [id]: { ...old[id], [field]: value } }));
  }

  return <section className="mt-5" aria-labelledby="admin-service-title">
    <div className="flex items-center justify-between gap-2">
      <h2 id="admin-service-title" className="text-xl font-bold">Codier- und Diagnoseaufträge</h2>
      <button type="button" onClick={() => void refresh()} className="rounded-lg border px-3 py-2 text-sm font-semibold">Aktualisieren</button>
    </div>
    <p className="mt-1 text-sm text-slate-600">Manuell erfasste Terminreferenzen und geprüfte Angebote. Keine automatische Zahlungsfreigabe.</p>
    {!orders.length && <p className="mt-3 text-slate-600">Keine Anfragen vorhanden.</p>}
    <ul className="mt-4 space-y-4">{orders.map(order => <li key={order.id} className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="font-bold">{order.brand} {order.model} ({order.year}) · {order.mode === "remote" ? "Remote" : "Vor Ort"}</p>
      <p className="break-all text-sm">{order.email}</p>
      <p className="my-2 whitespace-pre-wrap text-sm">{order.services}</p>
      <p className="text-xs text-slate-600">Eingang: {new Date(order.createdAt).toLocaleString("de-DE")}</p>
      {edits[order.id] && <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">Auftragsstatus
          <select value={edits[order.id].status} onChange={e => change(order.id, "status", e.target.value)} className="mt-1 block w-full rounded-lg border p-2">
            {states.map(s => <option key={s} value={s}>{labels[s]}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Angebot in EUR (optional)
          <input type="text" inputMode="decimal" value={edits[order.id].price}
            onChange={e => change(order.id, "price", e.target.value)} className="mt-1 block w-full rounded-lg border p-2" />
        </label>
        <label className="text-sm font-semibold">Cal.com-Terminreferenz (optional)
          <input value={edits[order.id].bookingReference} onChange={e => change(order.id, "bookingReference", e.target.value)}
            maxLength={150} className="mt-1 block w-full rounded-lg border p-2" />
        </label>
        <label className="text-sm font-semibold">Interne Notiz (nur Admin)
          <textarea value={edits[order.id].adminNote} onChange={e => change(order.id, "adminNote", e.target.value)}
            maxLength={4000} rows={2} className="mt-1 block w-full rounded-lg border p-2" />
        </label>
        <button type="button" disabled={busy} onClick={() => void save(order.id)}
          className="rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50 sm:col-span-2">Auftrag speichern</button>
      </div>}
    </li>)}</ul>
    {notice && <p role="status" className="mt-3 font-semibold text-blue-800">{notice}</p>}
  </section>;
}
