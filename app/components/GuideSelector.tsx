"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, ExternalLink, LockKeyhole, Search } from "lucide-react";
import { codingCatalog, codingsForVehicle, vehicles, type Coding, type Vehicle } from "../data/catalog";
import { formatGuidePrice, guideDifficultyLevel, guideDifficultyStep, guidePrice, guidePriceTiers } from "../lib/guidePricing";
import GuideDifficultyBar from "./GuideDifficultyBar";
import { researchedGuidesForModel, type ResearchCategory } from "../data/guideResearch";

const manufacturers = ["Volkswagen", "Audi", "Škoda", "SEAT / CUPRA"] as const;
type Manufacturer = (typeof manufacturers)[number];
const guideCategories = ["Codierungen", "Assistenzsysteme", "Nachrüstungen", "Umbauten"] as const;
type GuideCategory = (typeof guideCategories)[number];

function manufacturerOf(vehicle: Vehicle): Manufacturer {
  return vehicle.brand as Manufacturer;
}

// Nur ausdrücklich als Nachrüstung oder Umbau bezeichnete Einträge in diese Bereiche einsortieren.
function guideCategory(coding: Coding): GuideCategory {
  const name = coding.name;
  if (/umbau|umrüst|umbauen|umrüsten|steuergeräte?tausch|steuergeraetetausch|kombiinstrument.*tausch|tacho.*tausch|upgrade/i.test(name)) return "Umbauten";
  if (/nachrüst|nachruest|retrofit|nachrüstung|nachruestung/i.test(name)) return "Nachrüstungen";
  if (coding.category === "Assistenzsysteme" || coding.uiGroup === "Assistenz") return "Assistenzsysteme";
  return "Codierungen";
}

function availableModelCodings(vehicle: Vehicle): Coding[] {
  if (vehicle.diagnosticsOnly || vehicle.startYear >= 2024) return [];
  const ids = new Set(codingsForVehicle(vehicle));
  const seen = new Set<string>();
  return codingCatalog
    .filter((coding) => ids.has(coding.id) && coding.id !== "diagnose" && coding.uiGroup !== "Diagnose")
    .filter((coding) => {
      const normalized = coding.name.toLocaleLowerCase("de").trim();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "de", { numeric: true }));
}

export default function GuideSelector() {
  const [manufacturer, setManufacturer] = useState<Manufacturer | "">("");
  const [model, setModel] = useState("");
  const [showModels, setShowModels] = useState(true);
  const [modelSearch, setModelSearch] = useState("");
  const [codingSearch, setCodingSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GuideCategory>("Codierungen");

  const models = useMemo(
    () => vehicles.filter((vehicle) => manufacturer && manufacturerOf(vehicle) === manufacturer)
      .sort((a, b) => a.model.localeCompare(b.model, "de", { numeric: true, sensitivity: "base" })),
    [manufacturer]
  );
  const visibleModels = models.filter((vehicle) =>
    [vehicle.model, vehicle.modelNote ?? "", vehicle.platform].join(" ").toLocaleLowerCase("de")
      .includes(modelSearch.trim().toLocaleLowerCase("de"))
  );
  const vehicle = models.find((item) => item.model === model);
  const codings = useMemo(() => vehicle ? availableModelCodings(vehicle) : [], [vehicle]);
  const researchEntries = useMemo(
    () => vehicle
      ? (["Nachrüstungen", "Umbauten"] as ResearchCategory[]).flatMap((category) => researchedGuidesForModel(vehicle.model, category))
      : [],
    [vehicle]
  );
  const categoryCounts = useMemo(
    () => guideCategories.map((category) => ({
      category,
      count: category === "Nachrüstungen" || category === "Umbauten"
        ? researchEntries.filter((entry) => entry.category === category).length
        : codings.filter((coding) => guideCategory(coding) === category).length,
    })),
    [codings, researchEntries]
  );
  const researchCategory = activeCategory === "Nachrüstungen" || activeCategory === "Umbauten";
  const visibleResearch = researchEntries.filter((entry) =>
    entry.category === activeCategory &&
    [entry.title, entry.note, entry.sourceName].join(" ").toLocaleLowerCase("de")
      .includes(codingSearch.trim().toLocaleLowerCase("de"))
  );
  const visibleCodings = codings.filter((coding) =>
    guideCategory(coding) === activeCategory &&
    [coding.name, coding.uiGroup ?? ""].join(" ").toLocaleLowerCase("de")
      .includes(codingSearch.trim().toLocaleLowerCase("de"))
  );

  function chooseManufacturer(next: Manufacturer) {
    setManufacturer(next);
    setModel("");
    setShowModels(true);
    setModelSearch("");
    setCodingSearch("");
    setActiveCategory("Codierungen");
  }

  function chooseModel(next: Vehicle) {
    setModel(next.model);
    setShowModels(false);
    setCodingSearch("");
    const available = availableModelCodings(next);
    const hasOwnCodings = guideCategories.some((category) =>
      (category === "Codierungen" || category === "Assistenzsysteme") &&
      available.some((item) => guideCategory(item) === category)
    );
    if (hasOwnCodings) {
      setActiveCategory(guideCategories.find((category) =>
        (category === "Codierungen" || category === "Assistenzsysteme") &&
        available.some((item) => guideCategory(item) === category)
      ) ?? "Codierungen");
    } else {
      setActiveCategory(researchedGuidesForModel(next.model, "Nachrüstungen").length ? "Nachrüstungen"
        : researchedGuidesForModel(next.model, "Umbauten").length ? "Umbauten" : "Codierungen");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600" aria-label="Schritte">
        <span className="rounded-full bg-blue-600 px-3 py-1.5 text-white">1. Fahrzeug</span>
        <span className={vehicle ? "rounded-full bg-blue-100 px-3 py-1.5 text-blue-800" : "rounded-full bg-slate-200 px-3 py-1.5"}>2. Anleitung &amp; Preis</span>
      </div>

      <section aria-labelledby="guide-manufacturer-title">
        <h2 id="guide-manufacturer-title" className="text-lg font-black sm:text-xl">Hersteller wählen</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Hersteller">
          {manufacturers.map((item) => (
            <button key={item} type="button" aria-pressed={manufacturer === item} onClick={() => chooseManufacturer(item)}
              className={"flex min-h-11 items-center justify-center rounded-lg border px-2 py-2 text-sm font-bold transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 " +
                (manufacturer === item ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-800")}>
              {item}
            </button>
          ))}
        </div>
      </section>

      {manufacturer && (
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4" aria-labelledby="guide-model-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 id="guide-model-title" className="text-base font-black">
                {vehicle ? vehicle.model : "Fahrzeug wählen"}
              </h2>
              <p className="text-xs text-slate-500">
                {vehicle ? String(vehicle.startYear) + "–" + String(vehicle.endYear >= 2026 ? "heute" : vehicle.endYear) : String(models.length) + " Modelle · alphabetisch"}
              </p>
            </div>
            {vehicle && (
              <button type="button" onClick={() => setShowModels((value) => !value)}
                aria-expanded={showModels}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50">
                Fahrzeug ändern {showModels ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
              </button>
            )}
          </div>

          {showModels && (
            <>
              <label className="relative mt-3 block">
                <span className="sr-only">Fahrzeug suchen</span>
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input type="search" value={modelSearch} onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Modell suchen" className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </label>
              <div className="mt-2 grid max-h-72 gap-1.5 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Fahrzeugmodelle">
                {visibleModels.map((item) => (
                  <button key={item.model} type="button" aria-pressed={model === item.model} onClick={() => chooseModel(item)}
                    className={"flex min-h-12 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 " +
                      (model === item.model ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white")}>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-5 text-slate-900">{item.model}</span>
                      <span className="block text-xs text-slate-500">{item.startYear}–{item.endYear >= 2026 ? "heute" : item.endYear}</span>
                    </span>
                    {model === item.model && <Check size={17} className="shrink-0 text-blue-700" aria-hidden="true" />}
                  </button>
                ))}
              </div>
              {!visibleModels.length && <p className="mt-3 text-sm text-slate-500">Kein passendes Fahrzeug gefunden.</p>}
            </>
          )}
        </section>
      )}

      {vehicle && (
        <section className="mt-6" aria-labelledby="guide-codings-title" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 id="guide-codings-title" className="text-xl font-black">Anleitungen und Rechercheliste</h2>
              <p className="mt-1 text-xs text-slate-600">{vehicle.model} · {codings.length} Codierfunktionen · {researchEntries.length} recherchierte Nachrüstungen/Umbauten</p>
            </div>
            {(codings.length > 0 || researchEntries.length > 0) && (
              <label className="relative block w-full sm:w-60">
                <span className="sr-only">Anleitungen suchen</span>
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input type="search" value={codingSearch} onChange={(event) => setCodingSearch(event.target.value)}
                  placeholder="Anleitung suchen"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </label>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Anleitungskategorien">
            {categoryCounts.map(({ category, count }) => (
              <button key={category} type="button" aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={"flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-bold transition hover:border-blue-400 " +
                  (activeCategory === category ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700")}>
                <span>{category}</span>
                <span className={activeCategory === category ? "rounded-full bg-white/20 px-2 py-0.5 text-xs" : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"}>{count}</span>
              </button>
            ))}
          </div>

          {!researchCategory && codings.length > 0 && (
            <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
              {visibleCodings.map((coding) => {
                const difficultyStep = guideDifficultyStep(coding);
                return (
                  <div key={coding.id} className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-5 text-slate-950">{coding.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">PDF-Anleitung in Vorbereitung</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black tabular-nums text-blue-700">{formatGuidePrice(guidePrice(coding))}</p>
                      <GuideDifficultyBar level={guideDifficultyLevel(difficultyStep)} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {researchCategory && (
            <>
              <p className="mt-3 text-xs leading-6 text-slate-600">
                Recherchierte Themen mit verlinkten Originalquellen. Bei Anbietern ist die vollständige Anleitung teilweise erst nach Kauf des Nachrüstsatzes zugänglich.
                Hier gibt es vorerst nur eine Liste, keine TD-PDFs und keine Kaufpreise.
              </p>
              {visibleResearch.length > 0 && (
                <div className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {visibleResearch.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 px-3 py-3 sm:px-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-5 text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{item.note}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.sourceName} · {item.access === "öffentlich" ? "Anleitung öffentlich" : item.access === "Vorschau / Kauf" ? "Vorschau, Vollversion beim Anbieter" : "Anleitung beim Nachrüstsatz"}</p>
                      </div>
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                        aria-label={item.title + ": Originalquelle öffnen"}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:border-blue-400 hover:bg-blue-50">
                        Quelle / Anleitung <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {visibleResearch.length === 0 && (
                <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  {codingSearch.trim() ? "Kein passender Rechercheeintrag gefunden." : "Für dieses Fahrzeug sind noch keine recherchierten Anleitungen in diesem Bereich erfasst."}
                </p>
              )}
            </>
          )}
          {!researchCategory && codings.length > 0 && visibleCodings.length === 0 && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              {codingSearch.trim() ? "Keine passenden Anleitungen gefunden." : "Für dieses Fahrzeug sind in diesem Bereich noch keine Anleitungen zugeordnet."}
            </p>
          )}
          {codings.length === 0 && researchEntries.length === 0 && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Für dieses Fahrzeug sind derzeit keine ausreichend geprüften Anleitungen hinterlegt.
              {vehicle.startYear >= 2024 ? " Für neuere Modelle ist vor einer Freigabe insbesondere der SFD-/SFD2-Schutz zu prüfen." : ""}
            </p>
          )}
          {!researchCategory && <p className="mt-3 text-xs leading-6 text-slate-500">
            Geplante PDF-Einzelpreise nach Schwierigkeit in 2-€-Schritten: {formatGuidePrice(guidePriceTiers[0])} bis {formatGuidePrice(guidePriceTiers[7])}.
            Die konkrete Codierbarkeit hängt von Baujahr, Ausstattung, Steuergerät, Softwarestand und ggf. SFD-Schutz ab.
          </p>}
          {!researchCategory && <p className="mt-2 flex items-start gap-2 text-xs leading-6 text-slate-500">
            <LockKeyhole size={15} className="mt-1 shrink-0" aria-hidden="true" />
            Noch keine PDFs kaufbar. Downloads erst nach fertiggestellter Anleitung und serverseitig bestätigter PayPal-Zahlung.
          </p>}
        </section>
      )}
    </div>
  );
}
