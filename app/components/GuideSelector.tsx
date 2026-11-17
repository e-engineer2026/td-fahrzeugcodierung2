"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, LockKeyhole, Search } from "lucide-react";
import { codingCatalog, codingsForVehicle, vehicles, type Coding, type Vehicle } from "../data/catalog";
import { guideDifficultyLevel, guideDifficultyStep, guidePrice } from "../lib/guidePricing";
import GuideTable, { type GuideTableRow } from "./GuideTable";
import { guideDetails } from "../lib/guideDetails";
import { guideInterface } from "../lib/guideInterface";
import { guideVehicleRequirements } from "../lib/guideVehicleRequirements";
import { researchGuideEstimate, referenceIdeaEstimate } from "../lib/researchGuidePricing";
import { retrofitFocusFor } from "../lib/retrofitFocus";
import { referenceIdeasForVehicle } from "../data/referenceIdeas";
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
  const [codingSearch, setCodingSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GuideCategory>("Codierungen");

  const models = useMemo(
    () => vehicles.filter((vehicle) => manufacturer && manufacturerOf(vehicle) === manufacturer)
      .sort((a, b) => a.model.localeCompare(b.model, "de", { numeric: true, sensitivity: "base" })),
    [manufacturer]
  );
  const vehicle = models.find((item) => item.model === model);
  const codings = useMemo(() => vehicle ? availableModelCodings(vehicle) : [], [vehicle]);
  const researchEntries = useMemo(
    () => vehicle
      ? (["Nachrüstungen", "Umbauten"] as ResearchCategory[]).flatMap((category) => researchedGuidesForModel(vehicle.model, category)).filter((entry) => entry.access !== "Anbieterleistung")
      : [],
    [vehicle]
  );
  const sourceIdeas = useMemo(() => vehicle ? referenceIdeasForVehicle(vehicle) : [], [vehicle]);
  const categoryCounts = useMemo(
    () => guideCategories.map((category) => ({
      category,
      count: codings.filter((coding) => guideCategory(coding) === category).length
        + researchEntries.filter((entry) => entry.category === category).length
        + sourceIdeas.filter((idea) => idea.category === category).length,
    })),
    [codings, researchEntries, sourceIdeas]
  );
  const visibleResearch = researchEntries.filter((entry) =>
    entry.category === activeCategory &&
    [entry.title, entry.note].join(" ").toLocaleLowerCase("de")
      .includes(codingSearch.trim().toLocaleLowerCase("de"))
  );
  const visibleSourceIdeas = sourceIdeas.filter((idea) =>
    idea.category === activeCategory &&
    [idea.title, idea.note].join(" ").toLocaleLowerCase("de")
      .includes(codingSearch.trim().toLocaleLowerCase("de"))
  );
  const visibleCodings = codings.filter((coding) =>
    guideCategory(coding) === activeCategory &&
    [coding.name, coding.uiGroup ?? ""].join(" ").toLocaleLowerCase("de")
      .includes(codingSearch.trim().toLocaleLowerCase("de"))
  );

  const visibleGuideRows: GuideTableRow[] = [
    ...visibleCodings.map((coding) => {
      const step = guideDifficultyStep(coding);
      const details = guideDetails({
        title: coding.name,
        note: coding.requirements,
        explicitHardware: coding.hardware
      });
      const diagnosticInterface = guideInterface({
        id: coding.id,
        title: coding.name,
        category: guideCategory(coding),
        note: coding.requirements,
        interfaceInfo: coding.interfaceInfo,
        vehicleYear: vehicle?.startYear,
        platform: vehicle?.platform
      });
      return {
        id: "coding-" + coding.id,
        title: coding.name,
        requirements: guideVehicleRequirements({
          title: coding.name,
          original: details.prerequisites,
          note: coding.requirements
        }),
        diagnosticInterface,
        description: details.description,
        estimate: { step, level: guideDifficultyLevel(step), price: guidePrice(coding) }
      };
    }),
    ...visibleResearch.map((item) => {
      const focus = activeCategory === "Nachrüstungen" ? retrofitFocusFor(item)?.activation : undefined;
      const details = guideDetails({ title: item.title, note: item.note, activation: focus });
      const diagnosticInterface = guideInterface({
        id: item.id,
        title: item.title,
        note: item.note,
        activation: focus,
        category: item.category,
        vehicleYear: vehicle?.startYear,
        platform: vehicle?.platform
      });
      return {
        id: "research-" + item.id,
        title: item.title,
        requirements: guideVehicleRequirements({ title: item.title, original: details.prerequisites, note: item.note }),
        diagnosticInterface,
        description: details.description,
        estimate: researchGuideEstimate(item)
      };
    }),
    ...visibleSourceIdeas.map((idea) => {
      const details = guideDetails({ title: idea.title, note: idea.note });
      const diagnosticInterface = guideInterface({
        id: idea.id,
        title: idea.title,
        note: idea.note,
        category: idea.category,
        vehicleYear: vehicle?.startYear,
        platform: vehicle?.platform
      });
      return {
        id: "reference-" + idea.id,
        title: idea.title,
        requirements: guideVehicleRequirements({ title: idea.title, original: details.prerequisites, note: idea.note }),
        diagnosticInterface,
        description: details.description,
        estimate: referenceIdeaEstimate(idea)
      };
    })
  ];

  function chooseManufacturer(next: Manufacturer) {
    setManufacturer(next);
    setModel("");
    setShowModels(true);
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
      const candidates = referenceIdeasForVehicle(next);
      setActiveCategory(researchedGuidesForModel(next.model, "Nachrüstungen").some((entry) => entry.access !== "Anbieterleistung") ? "Nachrüstungen"
        : researchedGuidesForModel(next.model, "Umbauten").some((entry) => entry.access !== "Anbieterleistung") ? "Umbauten"
        : candidates.some((idea) => idea.category === "Codierungen") ? "Codierungen"
        : candidates.length ? candidates[0].category : "Codierungen");
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
              {vehicle && (
                <p className="text-xs text-slate-500">
                  {String(vehicle.startYear) + "–" + String(vehicle.endYear >= 2026 ? "heute" : vehicle.endYear)}
                </p>
              )}
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
              <div className="mt-2 grid max-h-72 gap-1.5 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Fahrzeugmodelle">
                {models.map((item) => (
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
            </>
          )}
        </section>
      )}

      {vehicle && (
        <section className="mt-6" aria-label="Fahrzeuganleitungen" aria-live="polite">
          <div className="flex justify-end">
            {(codings.length > 0 || researchEntries.length > 0 || sourceIdeas.length > 0) && (
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

          <GuideTable rows={visibleGuideRows} />
          {visibleGuideRows.length === 0 && (codings.length > 0 || researchEntries.length > 0 || sourceIdeas.length > 0) && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              {codingSearch.trim()
                ? "Keine passenden Anleitungen gefunden."
                : "Für dieses Fahrzeug sind in diesem Bereich noch keine Anleitungen zugeordnet."}
            </p>
          )}
          {codings.length === 0 && researchEntries.length === 0 && sourceIdeas.length === 0 && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Für dieses Fahrzeug sind derzeit keine ausreichend geprüften Anleitungen hinterlegt.
              {vehicle.startYear >= 2024 ? " Für neuere Modelle ist vor einer Freigabe insbesondere der SFD-/SFD2-Schutz zu prüfen." : ""}
            </p>
          )}
          {(codings.length > 0 || researchEntries.length > 0 || sourceIdeas.length > 0) && <p className="mt-3 text-xs leading-6 text-slate-500">
            Die konkrete Codierbarkeit hängt von Baujahr, Ausstattung, Steuergerät, Softwarestand und ggf. SFD-Schutz ab.
          </p>}
          {<p className="mt-2 flex items-start gap-2 text-xs leading-6 text-slate-500">
            <LockKeyhole size={15} className="mt-1 shrink-0" aria-hidden="true" />
            Noch keine PDFs kaufbar. Downloads erst nach fertiggestellter Anleitung und serverseitig bestätigter PayPal-Zahlung.
          </p>}
        </section>
      )}
    </div>
  );
}
