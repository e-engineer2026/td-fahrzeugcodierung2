"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { platformCodingSources } from "../data/platformCodingLists";
import { mqbCodingEntries } from "../data/mqbCodingList";

type VehicleSummary = {
  key: string;
  brand: string;
  model: string;
  years: string;
};

type Props = {
  platformVehicles: Record<string, VehicleSummary[]>;
};

const platformLabels: Record<string, string> = {
  MQB: "MQB",
  MQBevo: "MQB evo",
  MLBevo: "MLB evo",
};

const platformOrder = ["Alle", "MQB", "MQBevo", "MLBevo"] as const;

const codingSources = platformCodingSources.map((source) =>
  source.id === "mqb"
    ? { ...source, entries: mqbCodingEntries.map((name) => ({ name })) }
    : source
);

function SfdBadge({ value }: { value?: "Ja" | "Nein" | "Unklar" }) {
  if (!value) return null;
  if (value === "Ja") {
    return <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700">SFD</span>;
  }
  if (value === "Nein") {
    return <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">kein SFD</span>;
  }
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">SFD unklar</span>;
}

export default function CodingExplorer({ platformVehicles }: Props) {
  const [platform, setPlatform] = useState<(typeof platformOrder)[number]>("Alle");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("de");

  const displayedSources = useMemo(() => {
    return codingSources
      .filter((source) => platform === "Alle" || source.platform === platform)
      .map((source) => ({
        ...source,
        entries: normalizedQuery
          ? source.entries.filter((entry) => entry.name.toLocaleLowerCase("de").includes(normalizedQuery))
          : source.entries,
      }))
      .filter((source) => !normalizedQuery || source.entries.length > 0);
  }, [normalizedQuery, platform]);

  const totalMatches = displayedSources.reduce((sum, source) => sum + source.entries.length, 0);

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {platformOrder.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPlatform(item)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  platform === item
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {item === "Alle" ? "Alle Plattformen" : platformLabels[item]}
              </button>
            ))}
          </div>

          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Codierung suchen</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="z. B. Staging, ACC, Tagfahrlicht …"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          {totalMatches} {normalizedQuery ? "Treffer" : "Funktionen"} in {displayedSources.length} {displayedSources.length === 1 ? "Liste" : "Listen"}
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {displayedSources.map((source) => {
          const allVehicles = platformVehicles[source.platform] ?? [];
          const exactReferenceVehicles = source.referenceModels?.length
            ? allVehicles.filter((vehicle) => source.referenceModels?.includes(vehicle.key))
            : allVehicles;

          return (
            <article key={source.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    {platformLabels[source.platform]}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{source.scope}</span>
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{source.title}</h2>
                <p className="mt-3 max-w-4xl leading-7 text-slate-600">{source.description}</p>

                <div className="mt-5">
                  <div className="text-xs font-black uppercase tracking-[.12em] text-slate-500">
                    {source.referenceModels?.length ? "Direktes Referenzfahrzeug" : "Zugeordnete Fahrzeuge auf dieser Plattform"}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exactReferenceVehicles.map((vehicle) => (
                      <span key={vehicle.key} className="rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
                        {vehicle.brand} · {vehicle.model} · {vehicle.years}
                      </span>
                    ))}
                  </div>
                  {source.referenceModels?.length ? (
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Weitere {platformLabels[source.platform]}-Fahrzeuge können technisch ähnliche Funktionen besitzen. Die Referenzliste wird deshalb nicht ungeprüft auf jede Baureihe übertragen.
                    </p>
                  ) : null}
                </div>
              </div>

              <details className="group" open={Boolean(normalizedQuery)}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-blue-700 sm:px-7">
                  <span>{source.entries.length} Funktionen anzeigen</span>
                  <span className="text-xl transition group-open:rotate-45">+</span>
                </summary>
                <div className="border-t border-slate-100 px-5 pb-6 sm:px-7">
                  <div className="divide-y divide-slate-100">
                    {source.entries.map((entry, index) => (
                      <div key={`${source.id}-${entry.name}-${index}`} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="pr-4 text-sm font-medium leading-6 text-slate-800">{entry.name}</div>
                        <div className="flex shrink-0 flex-wrap gap-1.5">
                          <SfdBadge value={entry.sfd} />
                          {entry.status === "Ungetestet" ? (
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">ungetestet</span>
                          ) : entry.status === "Getestet" ? (
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">getestet</span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </article>
          );
        })}

        {!displayedSources.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            Keine passende Funktion gefunden. Versuche einen allgemeineren Suchbegriff.
          </div>
        ) : null}
      </div>
    </div>
  );
}
