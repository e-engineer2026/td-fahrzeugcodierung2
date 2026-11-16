"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, ExternalLink, LockKeyhole, Search } from "lucide-react";
import { codingCatalog, codingsForVehicle, vehicles, type Coding, type Vehicle } from "../data/catalog";
import { formatGuidePrice, guideDifficultyLevel, guideDifficultyStep, guidePrice, guidePriceTiers } from "../lib/guidePricing";
import GuideDifficultyBar from "./GuideDifficultyBar";
import { retrofitFocusFor } from "../lib/retrofitFocus";
import { referenceIdeasForVehicle, type ReferenceIdea } from "../data/referenceIdeas";
import { researchedGuidesForModel, type ResearchCategory, type ResearchGuide } from "../data/guideResearch";

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

function researchTopicFor(entry: ResearchGuide): string {
  if (entry.topic) return entry.topic;
  const name = entry.title;
  if (/scheinwerfer|xenon|leuchtweiten|kurvenlicht|led.rückleuchten|heckleuchten|matrix.led|lichtumbau|voll.led/i.test(name)) return "Scheinwerfer & Licht";
  if (/lenkrad|schaltwippen|multifunktion|mufu/i.test(name)) return "Lenkrad & Bedienung";
  if (/\bacc\b|pacc|radar|stauassistent|abstandsregel|tempomat.*radar/i.test(name)) return "ACC & pACC";
  if (/cockpit|kombiinstrument|mib|mmi|infotainment|fahrprofil/i.test(name)) return "Cockpit & Infotainment";
  return "Weitere Umbauten";
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
  const [researchTopic, setResearchTopic] = useState("Alle");
  const [retrofitFilter, setRetrofitFilter] = useState<"Alle" | "Praxis-Auswahl" | "Kompakter Einbau">("Alle");

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
  const sourceIdeas = useMemo(() => vehicle ? referenceIdeasForVehicle(vehicle) : [], [vehicle]);
  const categoryCounts = useMemo(
    () => guideCategories.map((category) => ({
      category,
      count: (category === "Nachrüstungen" || category === "Umbauten"
        ? researchEntries.filter((entry) => entry.category === category).length
        : codings.filter((coding) => guideCategory(coding) === category).length
      ) + sourceIdeas.filter((idea) => idea.category === category).length,
    })),
    [codings, researchEntries, sourceIdeas]
  );
  const researchCategory = activeCategory === "Nachrüstungen" || activeCategory === "Umbauten";
  const retrofitEntries = researchEntries.filter((entry) => entry.category === "Nachrüstungen");
  const focusCount = retrofitEntries.filter((entry) => retrofitFocusFor(entry)).length;
  const compactCount = retrofitEntries.filter((entry) => retrofitFocusFor(entry)?.scope === "Kompakter Einbau").length;
  const visibleResearch = researchEntries.filter((entry) =>
    entry.category === activeCategory &&
    (activeCategory !== "Umbauten" || researchTopic === "Alle" || researchTopicFor(entry) === researchTopic) &&
    (activeCategory !== "Nachrüstungen" || retrofitFilter === "Alle" ||
      (retrofitFilter === "Praxis-Auswahl" && !!retrofitFocusFor(entry)) ||
      (retrofitFilter === "Kompakter Einbau" && retrofitFocusFor(entry)?.scope === "Kompakter Einbau")) &&
    [entry.title, entry.note, entry.sourceName, entry.category === "Umbauten" ? researchTopicFor(entry) : (retrofitFocusFor(entry)?.topic ?? "")].join(" ").toLocaleLowerCase("de")
      .includes(codingSearch.trim().toLocaleLowerCase("de"))
  ).sort((a, b) =>
    activeCategory === "Nachrüstungen" && retrofitFilter !== "Alle"
      ? Number(retrofitFocusFor(a)?.scope === "Zusätzliche Vorprüfung") - Number(retrofitFocusFor(b)?.scope === "Zusätzliche Vorprüfung")
        || a.title.localeCompare(b.title, "de")
      : 0
  );
  const visibleSourceIdeas = sourceIdeas.filter((idea) =>
    idea.category === activeCategory &&
    (activeCategory !== "Nachrüstungen" || retrofitFilter === "Alle") &&
    (activeCategory !== "Umbauten" || researchTopic === "Alle" || researchTopic === "Weitere Umbauten") &&
    [idea.title, idea.note, idea.sourceName].join(" ").toLocaleLowerCase("de")
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
    setResearchTopic("Alle");
    setRetrofitFilter("Alle");
  }

  function chooseModel(next: Vehicle) {
    setModel(next.model);
    setShowModels(false);
    setCodingSearch("");
    setResearchTopic("Alle");
    setRetrofitFilter("Alle");
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
      setActiveCategory(researchedGuidesForModel(next.model, "Nachrüstungen").length ? "Nachrüstungen"
        : researchedGuidesForModel(next.model, "Umbauten").length ? "Umbauten"
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
              <p className="mt-1 text-xs text-slate-600">{vehicle.model} · {codings.length} bestehende Codierfunktionen · {researchEntries.length} Nachrüst-/Umbauquellen · {sourceIdeas.length} zusätzliche PDF-Referenzthemen</p>
            </div>
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
                onClick={() => { setActiveCategory(category); setResearchTopic("Alle"); setRetrofitFilter("Alle"); }}
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
          {!researchCategory && visibleSourceIdeas.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-xl border border-amber-200 bg-white">
              <div className="border-b border-amber-100 bg-amber-50 px-3 py-2.5 sm:px-4">
                <p className="text-sm font-bold text-slate-900">Zusätzliche Funktionen aus technischen Referenzlisten</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-700">
                  Noch keine TD-Freigabe und kein PDF-Angebot. Die Quellen nennen mögliche Codierungen,
                  nicht die geprüfte Machbarkeit jedes Fahrzeugs. Baujahr, Software, Hardware und SFD beachten.
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {visibleSourceIdeas.map((idea: ReferenceIdea) => (
                  <div key={idea.id} className="px-3 py-3 sm:px-4">
                    <p className="text-sm font-bold leading-5 text-slate-900">{idea.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{idea.note}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Quelle: {idea.sourceName}, S. {idea.sourcePage} · {idea.status === "tested"
                        ? "Laut Quelle getestet, nicht von TD verifiziert"
                        : "Historische Plattformreferenz, individuelle Prüfung erforderlich"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {researchCategory && (
            <>
              <p className="mt-3 text-xs leading-6 text-slate-600">
                Recherchierte Themen mit verlinkten Originalquellen. Öffentlich zugängliche Praxisberichte sind nicht automatisch geprüfte Herstelleranleitungen; manches ist nur als Vorschau oder Anbieterleistung verfügbar.
                Hier gibt es vorerst nur eine Liste, keine eigenen TD-PDFs und keine Kaufpreise.
              </p>
              {activeCategory === "Nachrüstungen" && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Nachrüstungen filtern">
                    {([
                      { value: "Alle", label: "Alle Nachrüstungen", count: retrofitEntries.length },
                      { value: "Praxis-Auswahl", label: "TD-Praxis-Auswahl", count: focusCount },
                      { value: "Kompakter Einbau", label: "Kompakte Einbauten", count: compactCount },
                    ] as const).map((option) => (
                      <button key={option.value} type="button" aria-pressed={retrofitFilter === option.value}
                        onClick={() => setRetrofitFilter(option.value)}
                        className={"rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-blue-400 " +
                          (retrofitFilter === option.value ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600")}>
                        {option.label} ({option.count})
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Die TD-Praxis-Auswahl bündelt Beleuchtung, Ladefunktionen, Reifendruck und kleinere Komfort-/Parksysteme.
                    „Kompakt“ beschreibt nur den voraussichtlichen Hardwareumfang. VCDS/VCP, Hersteller-Dongles,
                    PR-Codes, SFD und tatsächliche Machbarkeit müssen je Fahrzeug geprüft werden.
                  </p>
                </div>
              )}
              {activeCategory === "Umbauten" && (
                <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Umbauten nach Thema">
                  {["Alle", "Scheinwerfer & Licht", "ACC & pACC", "Lenkrad & Bedienung", "Cockpit & Infotainment", "Weitere Umbauten"].map((topic) => {
                    const count = researchEntries.filter((entry) => entry.category === "Umbauten" &&
                      (topic === "Alle" || researchTopicFor(entry) === topic)).length +
                      sourceIdeas.filter((idea) => idea.category === "Umbauten" &&
                        (topic === "Alle" || topic === "Weitere Umbauten")).length;
                    return (
                      <button key={topic} type="button" aria-pressed={researchTopic === topic}
                        onClick={() => setResearchTopic(topic)}
                        className={"rounded-full border px-3 py-1.5 text-xs font-semibold hover:border-blue-400 " +
                          (researchTopic === topic ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600")}>
                        {topic} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
              {visibleResearch.length > 0 && (
                <div className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {visibleResearch.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 px-3 py-3 sm:px-4">
                      <div className="min-w-0 flex-1">
                        {activeCategory === "Umbauten" && (
                          <p className="mb-0.5 text-[11px] font-semibold text-blue-700">{researchTopicFor(item)}</p>
                        )}
                        {activeCategory === "Nachrüstungen" && retrofitFocusFor(item) && (
                          <p className="mb-0.5 text-[11px] font-semibold text-blue-700">
                            TD-Praxis-Auswahl · {retrofitFocusFor(item)?.topic} · {retrofitFocusFor(item)?.scope}
                          </p>
                        )}
                        <p className="text-sm font-bold leading-5 text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{item.note}</p>
                        {activeCategory === "Nachrüstungen" && retrofitFocusFor(item) && (
                          <p className="mt-1 text-xs font-medium text-slate-700">
                            Codierung/Inbetriebnahme: {retrofitFocusFor(item)?.activation}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-500">{item.sourceName} · {item.access === "öffentlich" ? "Öffentlicher Ratgeber / Praxisbericht" : item.access === "Vorschau / Kauf" ? "Vorschau, Vollversion nur beim Anbieter" : item.access === "beim Nachrüstsatz" ? "Anleitung beim Nachrüstsatz" : item.access === "Anbieterleistung" ? "Fachbetrieb / Anbieterleistung, keine freie Anleitung" : item.access === "Produktinformation" ? "Nur Produktinformationen, keine Anleitung" : "Produkt-/Serviceinformation, keine Komplettanleitung"}</p>
                      </div>
                      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                        aria-label={item.title + ": Originalquelle öffnen"}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:border-blue-400 hover:bg-blue-50">
                        Quelle öffnen <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {visibleSourceIdeas.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-xl border border-amber-200 bg-white">
                  <div className="border-b border-amber-100 bg-amber-50 px-3 py-2.5 sm:px-4">
                    <p className="text-sm font-bold text-slate-900">Weitere Themen aus technischen Referenzlisten</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-700">
                      Nur Prüfkandidaten. Kein TD-Funktionstest, keine zugesagte VCDS-/VCP-Freischaltung und keine kaufbare PDF-Anleitung.
                    </p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {visibleSourceIdeas.map((idea: ReferenceIdea) => (
                      <div key={idea.id} className="px-3 py-3 sm:px-4">
                        <p className="text-sm font-bold leading-5 text-slate-900">{idea.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{idea.note}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Quelle: {idea.sourceName}, S. {idea.sourcePage} · {idea.status === "tested"
                            ? "In der Quelle als getestet aufgeführt (nicht von TD bestätigt)"
                            : idea.status === "unverified"
                              ? "Quelle enthält teilweise ungetestete Nachrüstungen"
                              : "Historische Plattformreferenz, Fahrzeugprüfung erforderlich"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {visibleResearch.length === 0 && visibleSourceIdeas.length === 0 && (
                <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  {codingSearch.trim() ? "Kein passender Rechercheeintrag gefunden." : activeCategory === "Nachrüstungen" && retrofitFilter !== "Alle" ? "Für dieses Fahrzeug ist in der ausgewählten TD-Praxis-Liste noch kein Kandidat erfasst. Unter „Alle Nachrüstungen“ findest du die restliche Recherche." : "Für dieses Fahrzeug sind noch keine recherchierten Anleitungen in diesem Bereich erfasst."}
                </p>
              )}
            </>
          )}
          {!researchCategory && codings.length > 0 && visibleCodings.length === 0 && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              {codingSearch.trim() ? "Keine passenden Anleitungen gefunden." : "Für dieses Fahrzeug sind in diesem Bereich noch keine Anleitungen zugeordnet."}
            </p>
          )}
          {codings.length === 0 && researchEntries.length === 0 && sourceIdeas.length === 0 && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Für dieses Fahrzeug sind derzeit keine ausreichend geprüften Anleitungen hinterlegt.
              {vehicle.startYear >= 2024 ? " Für neuere Modelle ist vor einer Freigabe insbesondere der SFD-/SFD2-Schutz zu prüfen." : ""}
            </p>
          )}
          {!researchCategory && codings.length > 0 && <p className="mt-3 text-xs leading-6 text-slate-500">
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
