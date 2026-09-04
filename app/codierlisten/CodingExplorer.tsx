"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { platformCodingSources } from "../data/platformCodingLists";
import type { PlatformCodingEntry, PlatformCodingSource } from "../data/platformCodingLists";
import { mqbCodingEntries } from "../data/mqbCodingList";
import {
  platformCodingGroups,
  pricePlatformSource,
  type PlatformCodingGroup,
  type PricedPlatformCodingEntry,
} from "../data/platformCodingPricing";

type VehicleSummary = {
  key: string;
  brand: string;
  model: string;
  years: string;
};

type Props = {
  platformVehicles: Record<string, VehicleSummary[]>;
};

type PricedPlatformCodingSource = Omit<PlatformCodingSource, "entries"> & {
  entries: PricedPlatformCodingEntry[];
};

const platformLabels: Record<string, string> = {
  MQB: "MQB",
  MQBevo: "MQB evo",
  MLBevo: "MLB evo",
};

const platformOrder = ["Alle", "MQB", "MQBevo", "MLBevo"] as const;

function discountRate(value: number) {
  return value >= 200 ? 0.2 : value >= 150 ? 0.15 : value >= 100 ? 0.1 : value >= 50 ? 0.05 : 0;
}

function nextTier(value: number) {
  return value < 50 ? 50 : value < 100 ? 100 : value < 150 ? 150 : value < 200 ? 200 : null;
}

const exactMqbSource = platformCodingSources.find((source) => source.id === "mqb");
const mlbEvoSource = platformCodingSources.find((source) => source.platform === "MLBevo");
const mqbEvoSources = platformCodingSources.filter((source) => source.platform === "MQBevo");

const mergedMqbEvoEntries = Array.from(
  new Map<string, PlatformCodingEntry>(
    mqbEvoSources.flatMap((source) => source.entries).map((entry) => [entry.name, entry])
  ).values()
);

const baseCodingSources: PlatformCodingSource[] = [
  ...(exactMqbSource
    ? [
        {
          ...exactMqbSource,
          entries: mqbCodingEntries.map((name) => ({ name })),
        },
      ]
    : []),
  ...(mqbEvoSources.length
    ? [
        {
          id: "mqbevo",
          platform: "MQBevo" as const,
          title: "MQB evo Codierungen",
          scope: "Plattformweite Referenzliste",
          description: "Zusammengefasste Codiermöglichkeiten für Fahrzeuge auf MQB evo.",
          entries: mergedMqbEvoEntries,
        },
      ]
    : []),
  ...(mlbEvoSource ? [mlbEvoSource] : []),
];

const codingSources: PricedPlatformCodingSource[] = baseCodingSources.map((source) => ({
  ...source,
  entries: pricePlatformSource(source),
}));

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
  const [activeGroup, setActiveGroup] = useState<"Alle" | PlatformCodingGroup>("Alle");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, PlatformCodingGroup[]>>({});
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const normalizedQuery = query.trim().toLocaleLowerCase("de");

  const displayedSources = useMemo(() => {
    return codingSources
      .filter((source) => platform === "Alle" || source.platform === platform)
      .map((source) => ({
        ...source,
        entries: source.entries
          .filter((entry) => activeGroup === "Alle" || entry.uiGroup === activeGroup)
          .filter((entry) => !normalizedQuery || entry.name.toLocaleLowerCase("de").includes(normalizedQuery)),
      }))
      .filter((source) => !normalizedQuery || source.entries.length > 0);
  }, [activeGroup, normalizedQuery, platform]);

  const totalMatches = displayedSources.reduce((sum, source) => sum + source.entries.length, 0);

  const toggleEntry = (sourceId: string, entryId: string) => {
    setSelected((current) => {
      const sourceSelection = current[sourceId] ?? [];
      const next = sourceSelection.includes(entryId)
        ? sourceSelection.filter((id) => id !== entryId)
        : [...sourceSelection, entryId];
      return { ...current, [sourceId]: next };
    });
  };

  const toggleGroup = (sourceId: string, group: PlatformCodingGroup) => {
    setExpandedGroups((current) => {
      const groups = current[sourceId] ?? [];
      return {
        ...current,
        [sourceId]: groups.includes(group) ? groups.filter((item) => item !== group) : [...groups, group],
      };
    });
  };

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

        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {["Alle", ...platformCodingGroups].map((group) => (
            <button
              type="button"
              key={group}
              onClick={() => setActiveGroup(group as "Alle" | PlatformCodingGroup)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                activeGroup === group
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <span>
            {totalMatches} {normalizedQuery ? "Treffer" : "Funktionen"} in {displayedSources.length}{" "}
            {displayedSources.length === 1 ? "Liste" : "Listen"}
          </span>
          <span className="font-semibold text-blue-700">Preise nach Codieraufwand</span>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {displayedSources.map((source) => {
          const allVehicles = platformVehicles[source.platform] ?? [];
          const fullSource = codingSources.find((item) => item.id === source.id) ?? source;
          const selectedIds = selected[source.id] ?? [];
          const selectedEntries = fullSource.entries.filter((entry) => selectedIds.includes(entry.id));
          const subtotal = selectedEntries.reduce((sum, entry) => sum + entry.price, 0);
          const rate = discountRate(subtotal);
          const discount = subtotal * rate;
          const total = subtotal - discount;
          const next = nextTier(subtotal);

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
                    Zugeordnete Fahrzeuge auf dieser Plattform
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allVehicles.map((vehicle) => (
                      <span
                        key={vehicle.key}
                        className="rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        {vehicle.brand} · {vehicle.model} · {vehicle.years}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs leading-5 text-slate-600 sm:p-4">
                  Die Preise sind nach dem typischen Codieraufwand eingestuft. Zusätzliche Parametrierung,
                  Kalibrierung, Datensätze oder Hardwarearbeiten werden vorab geprüft. Bei SFD1 kann die
                  Freischaltung zusätzlich berechnet werden.
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-2">
                  {platformCodingGroups.map((group) => {
                    const list = source.entries.filter((entry) => entry.uiGroup === group);
                    if (!list.length) return null;
                    const selectedInGroup = list.filter((entry) => selectedIds.includes(entry.id)).length;
                    const isExpanded =
                      activeGroup !== "Alle" ||
                      Boolean(normalizedQuery) ||
                      (expandedGroups[source.id] ?? []).includes(group);
                    const panelId = `${source.id}-${group.toLocaleLowerCase("de")}`;

                    return (
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={group}>
                        <button
                          type="button"
                          onClick={() => toggleGroup(source.id, group)}
                          aria-expanded={isExpanded}
                          aria-controls={panelId}
                          className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50 sm:px-4"
                        >
                          <span className="min-w-0 font-black text-blue-700">
                            {group} <span className="font-semibold text-slate-400">({list.length})</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            {selectedInGroup > 0 ? (
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-700">
                                {selectedInGroup} gewählt
                              </span>
                            ) : null}
                            <ChevronDown
                              className={`h-4 w-4 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              aria-hidden="true"
                            />
                          </span>
                        </button>

                        {isExpanded ? (
                          <div id={panelId} className="border-t border-slate-200 bg-slate-50/60 p-2 sm:p-3">
                            <div className="grid gap-2 lg:grid-cols-2">
                              {list.map((entry) => {
                                const isSelected = selectedIds.includes(entry.id);
                                return (
                                  <div
                                    key={entry.id}
                                    className={`rounded-lg border px-3 py-2.5 ${
                                      isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
                                    }`}
                                  >
                                    <label className="flex cursor-pointer items-start justify-between gap-2.5">
                                      <span className="flex min-w-0 flex-1 items-start text-sm leading-5">
                                        <input
                                          className="mr-2.5 mt-0.5 h-4 w-4 shrink-0"
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => toggleEntry(source.id, entry.id)}
                                        />
                                        <span>{entry.name}</span>
                                      </span>
                                      <b className="shrink-0 whitespace-nowrap text-sm leading-5">{entry.price} €</b>
                                    </label>
                                    {entry.sfd || entry.status ? (
                                      <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                                        <SfdBadge value={entry.sfd} />
                                        {entry.status === "Ungetestet" ? (
                                          <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">
                                            ungetestet
                                          </span>
                                        ) : entry.status === "Getestet" ? (
                                          <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
                                            getestet
                                          </span>
                                        ) : null}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-3 sm:p-4">
                  <div className="flex justify-between text-sm">
                    <span>Zwischensumme</span>
                    <b>{subtotal.toFixed(2).replace(".", ",")} €</b>
                  </div>
                  <div className="mt-1.5 flex justify-between text-sm text-blue-700">
                    <span>Rabatt ({Math.round(rate * 100)} %)</span>
                    <b>-{discount.toFixed(2).replace(".", ",")} €</b>
                  </div>
                  <div className="mt-3 flex justify-between gap-4 border-t pt-3 text-lg">
                    <b>Gesamt</b>
                    <b>{total.toFixed(2).replace(".", ",")} €</b>
                  </div>
                  {next ? (
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      Noch {(next - subtotal).toFixed(2).replace(".", ",")} € bis zur nächsten Rabattstufe ({next === 50 ? 5 : next === 100 ? 10 : next === 150 ? 15 : 20} %).
                    </p>
                  ) : (
                    <p className="mt-2 text-xs font-semibold text-blue-700">20 % Maximalrabatt erreicht.</p>
                  )}
                </div>
              </div>
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
