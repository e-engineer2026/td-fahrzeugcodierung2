"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string; brand: string; model: string; year: number; mode: "onsite" | "remote";
  services: string; status: string; quoteCents: number | null; bookingReference: string | null;
  createdAt: string;
};
const states: Record<string, string> = {
  requested: "Anfrage eingegangen", review: "In Prüfung", quoted: "Angebot erstellt",
  scheduled: "Termin vereinbart", in_progress: "In Bearbeitung",
  completed: "Abgeschlossen", cancelled: "Storniert",
};
const initial = { brand: "Volkswagen", model: "", year: String(new Date().getFullYear()),
  mode: "onsite" as "onsite" | "remote", services: "" };

function prefillFromSelection(raw: string) {
  if (!raw || raw.length > 4000) return initial;
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (typeof data.brand !== "string" || !["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA"].includes(data.brand) ||
        typeof data.model !== "string" || data.model.length < 2 || data.model.length > 120 ||
        typeof data.services !== "string" || data.services.length < 5 || data.services.length > 2000 ||
        typeof data.year !== "number" || !Number.isInteger(data.year) || data.year < 1980 || data.year > 2027 ||
        (data.mode !== "remote" && data.mode !== "onsite")) return initial;
    return { brand: data.brand, model: data.model, year: String(data.year),
      mode: data.mode, services: data.services };
  } catch { return initial; }
}

export default function ServiceOrdersPanel({ initialSelection = "" }: { initialSelection?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState(() => prefillFromSelection(initialSelection));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  async function refresh() {
    try {
      const response = await fetch("/api/service-orders", { cache: "no-store", credentials: "same-origin" });
      const data = await response.json() as { orders?: Order[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Aufträge nicht verfügbar.");
      setOrders(data.orders ?? []);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Laden fehlgeschlagen."); }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/service-orders", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async response => {
        const data = await response.json() as { orders?: Order[]; error?: string };
        if (!response.ok) throw new Error(data.error ?? "Aufträge nicht verfügbar.");
        if (!controller.signal.aborted) setOrders(data.orders ?? []);
      })
      .catch(error => {
        if (!controller.signal.aborted) setNotice(error instanceof Error ? error.message : "Laden fehlgeschlagen.");
      });
    return () => controller.abort();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/service-orders", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, year: Number(form.year) }),
      });
      const data = await response.json() as { created?: boolean; error?: string };
      if (!response.ok || !data.created) throw new Error(data.error ?? "Anfrage nicht gespeichert.");
      setNotice("Deine Anfrage wurde gespeichert. Wir prüfen die Machbarkeit und melden uns.");
      setForm(initial);
      await refresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Speichern fehlgeschlagen."); }
    finally { setBusy(false); }
  }

  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6" aria-labelledby="service-orders-title">
    <h2 id="service-orders-title" className="text-xl font-bold">Meine Codieraufträge</h2>
    <p className="mt-1 text-sm text-slate-600">Anfragen und Bearbeitungsstand an einem Ort. Eine Anfrage ist noch keine bestätigte Buchung oder Zahlung.</p>
    {orders.length ? <ul className="mt-4 space-y-2">{orders.map(order => <li key={order.id} className="rounded-lg border border-slate-200 p-3 text-sm">
      <p className="font-bold">{order.brand} {order.model} ({order.year})</p>
      <p className="text-slate-700">{order.services}</p>
      <p className="mt-1 text-slate-600">{states[order.status] ?? order.status} · {order.mode === "remote" ? "Remote" : "Vor Ort"}</p>
      {order.quoteCents !== null && <p className="font-semibold">Angebot: {(Number(order.quoteCents) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</p>}
      {order.bookingReference && <p className="break-all text-slate-600">Terminreferenz: {order.bookingReference}</p>}
    </li>)}</ul> : <p className="mt-3 text-sm text-slate-600">Noch keine Codieranfrage hinterlegt.</p>}
    <details className="mt-5 rounded-lg border border-blue-200 p-4">
      <summary className="cursor-pointer font-bold text-blue-800">Neue Codieranfrage erfassen</summary>
      <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submit}>
        <label className="text-sm font-semibold">Marke
          <select className="mt-1 block w-full rounded-lg border p-2" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
            {["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA"].map(brand => <option key={brand}>{brand}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">Modell
          <input required minLength={2} maxLength={120} className="mt-1 block w-full rounded-lg border p-2" value={form.model}
            onChange={e => setForm({ ...form, model: e.target.value })} placeholder="z. B. Golf 7" />
        </label>
        <label className="text-sm font-semibold">Baujahr
          <input type="number" required min={1980} max={2027} className="mt-1 block w-full rounded-lg border p-2" value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value })} />
        </label>
        <label className="text-sm font-semibold">Durchführung
          <select className="mt-1 block w-full rounded-lg border p-2" value={form.mode}
            onChange={e => setForm({ ...form, mode: e.target.value as "onsite" | "remote" })}>
            <option value="onsite">Vor Ort Leipzig</option><option value="remote">Remote</option>
          </select>
        </label>
        <label className="text-sm font-semibold sm:col-span-2">Gewünschte Codierungen oder Diagnose
          <textarea required minLength={5} maxLength={2000} rows={3}
            className="mt-1 block w-full rounded-lg border p-2" value={form.services}
            onChange={e => setForm({ ...form, services: e.target.value })} />
        </label>
        <button type="submit" disabled={busy} className="rounded-lg bg-blue-700 px-4 py-3 font-bold text-white disabled:opacity-50 sm:col-span-2">
          {busy ? "Wird gespeichert …" : "Anfrage speichern"}
        </button>
      </form>
    </details>
    {notice && <p role="status" className="mt-3 text-sm font-semibold text-blue-800">{notice}</p>}
  </section>;
}
