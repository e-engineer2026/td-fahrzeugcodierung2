"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { useState } from "react";

type Props = { brand: string; model: string; year: number; codings: string[] };

export default function SaveVehicleCard({ brand, model, year, codings }: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const ready = Boolean(brand && model && year);

  async function save() {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/saved-vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, model, year, codings }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Speichern fehlgeschlagen.");
      setStatus("Fahrzeugauswahl wurde in deinem Konto gespeichert.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Speichern fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="mt-3 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between">
    <div><p className="font-bold text-slate-900">Fahrzeugauswahl speichern</p><p className="text-sm text-slate-600">Melde dich an, um Fahrzeug und Codierungen später wiederzufinden.</p>{status && <p role="status" className="mt-1 text-sm font-semibold text-blue-700">{status}</p>}</div>
    <Show when="signed-out"><Link href="/sign-in?redirect_url=%2F%23fahrzeugauswahl" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">Anmelden</Link></Show>
    <Show when="signed-in"><div className="flex flex-wrap gap-2"><button type="button" onClick={save} disabled={!ready || busy} className="min-h-11 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300">{busy ? "Wird gespeichert …" : "Auswahl speichern"}</button><Link href="/konto" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700">Mein Konto</Link></div></Show>
  </div>;
}
