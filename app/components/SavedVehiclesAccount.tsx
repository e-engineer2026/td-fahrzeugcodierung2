"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";

type SavedVehicle = { id: string; brand: string; model: string; year: number; codings: string[]; created_at: string };

export default function SavedVehiclesAccount() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/saved-vehicles", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Daten konnten nicht geladen werden.");
      setVehicles(result.vehicles as SavedVehicle[]);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Daten konnten nicht geladen werden.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    if (!isLoaded || !user) return;
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [isLoaded, user, load]);

  async function remove(id: string) {
    const response = await fetch(`/api/saved-vehicles?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) { setError("Fahrzeug konnte nicht gelöscht werden."); return; }
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
  }

  async function deleteAccount() {
    if (!window.confirm("Konto und alle gespeicherten Fahrzeugauswahlen dauerhaft löschen?")) return;
    setDeletingAccount(true);
    setError("");
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Konto konnte nicht vollständig gelöscht werden. Bitte kontaktiere uns.");
      }
      router.replace("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Konto konnte nicht gelöscht werden.");
      setDeletingAccount(false);
    }
  }

  if (!isLoaded || loading) return <p className="text-slate-600">Konto wird geladen …</p>;
  return <div className="space-y-5">
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"><div><p className="font-bold">Angemeldet als</p><p className="text-slate-600">{user?.primaryEmailAddress?.emailAddress}</p></div><UserButton /></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {vehicles.length === 0 && !error ? <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-bold">Noch keine gespeicherten Fahrzeuge</p><p className="mt-1 text-slate-600">Wähle zuerst ein Fahrzeug im Konfigurator aus.</p><Link href="/#fahrzeugauswahl" className="mt-3 inline-block font-bold text-blue-700">Zum Konfigurator →</Link></div> : <div className="space-y-3">{vehicles.map((vehicle) => <article key={vehicle.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-black">{vehicle.brand} {vehicle.model} · {vehicle.year}</h2><p className="mt-2 text-sm text-slate-600">{vehicle.codings.length ? vehicle.codings.join(" · ") : "Noch keine Codierungen ausgewählt"}</p></div><button type="button" onClick={() => void remove(vehicle.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-bold text-red-700">Löschen</button></div></article>)}</div>}
    <section className="rounded-2xl border border-red-200 bg-white p-5"><h2 className="font-bold text-slate-900">Konto löschen</h2><p className="mt-1 text-sm text-slate-600">Dein Konto und alle gespeicherten Fahrzeugauswahlen werden dauerhaft gelöscht.</p><button type="button" onClick={() => void deleteAccount()} disabled={deletingAccount} className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-60">{deletingAccount ? "Konto wird gelöscht …" : "Konto dauerhaft löschen"}</button></section>
  </div>;
}
