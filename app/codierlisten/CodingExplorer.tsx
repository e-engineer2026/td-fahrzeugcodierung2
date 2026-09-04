"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { platformCodingSources } from "../data/platformCodingLists";
import type { PlatformCodingEntry, PlatformCodingSource } from "../data/platformCodingLists";
import { mqbCodingEntries } from "../data/mqbCodingList";
import { codingCatalog, codingsForVehicle, vehicles, type Vehicle } from "../data/catalog";
import {
  platformCodingGroups,
  pricePlatformSource,
  type PlatformCodingGroup,
  type PricedPlatformCodingEntry,
} from "../data/platformCodingPricing";

type PricedPlatformCodingSource = Omit<PlatformCodingSource, "entries"> & {
  entries: PricedPlatformCodingEntry[];
};

type UnifiedCodingEntry = {
  id: string;
  name: string;
  price: number;
  uiGroup: PlatformCodingGroup;
  sfd?: "Ja" | "Nein" | "Unklar";
  status?: "Getestet" | "Ungetestet";
};

const platformLabels: Record<string, string> = {
  MQB: "MQB",
  MQBevo: "MQB evo",
  MLBevo: "MLB evo",
  MLB: "MLB",
  PQ35: "PQ35",
  PQ46: "PQ46",
  PQ26: "PQ26",
  PQ25: "PQ25",
  MEB: "MEB",
  T5: "T5 / T6",
  PL71: "PL71",
};

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

const brands = Array.from(new Set(vehicles.map((vehicle) => vehicle.brand)));

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

export default function CodingExplorer() {
  const [brand, setBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [year, setYear] = useState(0);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<"Alle" | PlatformCodingGroup>("Alle");
  const [expandedGroups, setExpandedGroups] = useState<PlatformCodingGroup[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const models = brand ? vehicles.filter((vehicle) => vehicle.brand === brand) : [];
  const selectedVehicle = vehicles.find(
    (vehicle) => vehicle.brand === brand && vehicle.model === vehicleModel
  );
  const hasVehicle = Boolean(selectedVehicle);
  const years = selectedVehicle
    ? Array.from(
        { length: selectedVehicle.endYear - selectedVehicle.startYear + 1 },
        (_, index) => selectedVehicle.endYear - index
      )
    : [];

  const isSfd1 = Boolean(
    selectedVehicle?.sfd1From && year >= selectedVehicle.sfd1From && year < 2024
  );
  const isSfd2 = Boolean(selectedVehicle?.sfd1From && year >= 2024);
  const platformSource = selectedVehicle
    ? codingSources.find((source) => source.platform === selectedVehicle.platform)
    : undefined;

  const allEntries = useMemo<UnifiedCodingEntry[]>(() => {
    if (!selectedVehicle || isSfd2) return [];

    if (platformSource) {
      return platformSource.entries.map((entry) => ({
        id: entry.id,
        name: entry.name,
        price: entry.price,
        uiGroup: entry.uiGroup,
        sfd: entry.sfd,
        status: entry.status,
      }));
    }

    const ids = new Set(codingsForVehicle(selectedVehicle));
    return codingCatalog
      .filter((coding) => ids.has(coding.id))
      .filter((coding) => {
        if (!isSfd1 || coding.category !== "Assistenzsysteme") return true;
        return !/(aktivieren|freischalten|codieren|parametrieren)/i.test(coding.name);
      })
      .map((coding) => ({
        id: `vehicle-${coding.id}`,
        name: coding.name,
        price: coding.price,
        uiGroup: coding.uiGroup as PlatformCodingGroup,
      }));
  }, [isSfd1, isSfd2, platformSource, selectedVehicle]);

  const normalizedQuery = query.trim().toLocaleLowerCase("de");
  const shownEntries = allEntries
    .filter((entry) => activeGroup === "Alle" || entry.uiGroup === activeGroup)
    .filter((entry) => !normalizedQuery || entry.name.toLocaleLowerCase("de").includes(normalizedQuery));

  const selectedEntries = allEntries.filter((entry) => selected.includes(entry.id));
  const subtotal = selectedEntries.reduce((sum, entry) => sum + entry.price, 0);
  const sfdFee = isSfd1 && selected.length > 0 ? 10 : 0;
  const rate = discountRate(subtotal);
  const discount = subtotal * rate;
  const total = subtotal - discount + sfdFee;
  const next = nextTier(subtotal);

  const resetSelection = () => {
    setSelected([]);
    setQuery("");
    setActiveGroup("Alle");
    setExpandedGroups([]);
  };

  const changeBrand = (value: string) => {
    setBrand(value);
    setVehicleModel("");
    setYear(0);
    resetSelection();
  };

  const changeModel = (value: string) => {
    setVehicleModel(value);
    resetSelection();
    if (!value) {
      setYear(0);
      return;
    }
    const vehicle = vehicles.find((item) => item.brand === brand && item.model === value);
    setYear(vehicle?.endYear ?? 0);
  };

  const changeYear = (value: number) => {
    setYear(value);
    resetSelection();
  };

  const toggleEntry = (entryId: string) => {
    setSelected((current) =>
      current.includes(entryId) ? current.filter((id) => id !== entryId) : [...current, entryId]
    );
  };

  const toggleGroup = (group: PlatformCodingGroup) => {
    setExpandedGroups((current) =>
      current.includes(group) ? current.filter((item) => item !== group) : [...current, group]
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">
          1 · Fahrzeug
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Marke, Modell und Baujahr</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label>
            <span className="mb-2 block text-sm font-semibold">Marke</span>
            <select value={brand} onChange={(event) => changeBrand(event.target.value)}>
              <option value="">Marke auswählen</option>
              {brands.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">Modell / Generation</span>
            <select
              value={vehicleModel}
              onChange={(event) => changeModel(event.target.value)}
              disabled={!brand}
            >
              <option value="">Modell auswählen</option>
              {models.map((vehicle) => (
                <option value={vehicle.model} key={`${vehicle.brand}-${vehicle.model}`}>
                  {vehicle.model}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold">Baujahr</span>
            <select
              value={year || ""}
              onChange={(event) => changeYear(Number(event.target.value))}
              disabled={!selectedVehicle}
            >
              <option value="">Baujahr auswählen</option>
              {years.map((item) => (
                <option value={item} key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        {selectedVehicle ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 sm:p-4">
            <span>
              Erkannt: <strong>{platformLabels[selectedVehicle.platform] ?? selectedVehicle.platform}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              {platformSource ? "Umfangreiche Plattformliste wird verwendet." : "Fahrzeugbezogene Bestandsliste wird verwendet."}
            </span>
          </div>
        ) : null}

        {isSfd1 ? (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-900 sm:p-4">
            <b>SFD1:</b> Für die Freischaltung geschützter Steuergeräte werden bei einer Auswahl einmalig <strong>10,00 €</strong> ergänzt.
          </div>
        ) : null}

        {isSfd2 ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-900 sm:p-4">
            <b>SFD2 / UNECE:</b> Für dieses Baujahr werden aktuell keine regulären Codierungsaufträge angeboten.
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">2 · Codierungen</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {selectedVehicle && year ? `${brand} ${selectedVehicle.model} · ${year}` : "Fahrzeug auswählen"}
            </h2>
          </div>
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Codierung suchen</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="z. B. Staging, ACC, Tagfahrlicht …"
              disabled={!hasVehicle || !year || isSfd2}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </label>
        </div>

        {hasVehicle && year && !isSfd2 ? (
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
        ) : null}

        {!hasVehicle || !year ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Bitte zuerst Marke, Modell und Baujahr auswählen.
          </div>
        ) : isSfd2 ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-900">
            Für dieses Fahrzeug und Baujahr wird die Codierauswahl aktuell nicht freigegeben.
          </div>
        ) : shownEntries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Für diesen Filter sind aktuell keine Funktionen hinterlegt. Nutze „Alle“ oder einen allgemeineren Suchbegriff.
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            {platformCodingGroups.map((group) => {
              const list = shownEntries.filter((entry) => entry.uiGroup === group);
              if (!list.length) return null;
              const selectedInGroup = list.filter((entry) => selected.includes(entry.id)).length;
              const isExpanded =
                activeGroup !== "Alle" || Boolean(normalizedQuery) || expandedGroups.includes(group);
              const panelId = `vehicle-coding-${group.toLocaleLowerCase("de")}`;

              return (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={group}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
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
                          const isSelected = selected.includes(entry.id);
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
                                    onChange={() => toggleEntry(entry.id)}
                                  />
                                  <span>{entry.name}</span>
                                </span>
                                <b className="shrink-0 whitespace-nowrap text-sm leading-5">{entry.price} €</b>
                              </label>
                              {entry.sfd || entry.status ? (
                                <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                                  <SfdBadge value={entry.sfd} />
                                  {entry.status === "Ungetestet" ? (
                                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">ungetestet</span>
                                  ) : entry.status === "Getestet" ? (
                                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">getestet</span>
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
        )}

        {hasVehicle && year && !isSfd2 ? (
          <div className="mt-5 rounded-xl bg-slate-50 p-3 sm:p-4">
            <div className="flex justify-between text-sm">
              <span>Zwischensumme</span>
              <b>{subtotal.toFixed(2).replace(".", ",")} €</b>
            </div>
            <div className="mt-1.5 flex justify-between text-sm text-blue-700">
              <span>Rabatt ({Math.round(rate * 100)} %)</span>
              <b>-{discount.toFixed(2).replace(".", ",")} €</b>
            </div>
            {sfdFee > 0 ? (
              <div className="mt-1.5 flex justify-between text-sm text-blue-700">
                <span>SFD1-Freischaltung</span>
                <b>+10,00 €</b>
              </div>
            ) : null}
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
        ) : null}

        {hasVehicle && year && !isSfd2 ? (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs leading-5 text-slate-600 sm:p-4">
            Die Auswahl ist eine technische Vorauswahl. Die tatsächliche Verfügbarkeit wird vor Durchführung anhand von Ausstattung, Steuergeräten, Softwarestand und vorhandener Hardware geprüft.
          </div>
        ) : null}
      </section>
    </div>
  );
}
