"use client";

import { useMemo, useState } from "react";
import { Check, FileText, LockKeyhole, Search } from "lucide-react";
import {
  codingCatalog,
  codingsForVehicle,
  vehicles,
  type Coding,
  type Vehicle,
} from "../data/catalog";

const manufacturerNames = ["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA"] as const;
type Manufacturer = (typeof manufacturerNames)[number];

function manufacturerOf(vehicle: Vehicle): Manufacturer {
  if (vehicle.brand === "SEAT / CUPRA") {
    return vehicle.model.toUpperCase().startsWith("CUPRA ") ? "CUPRA" : "SEAT";
  }
  return vehicle.brand as Manufacturer;
}

function isComplexGuide(coding: Coding): boolean {
  return coding.category === "Assistenzsysteme" ||
    /nachrüst|nachruest|parametrier|flash|softwareupdate|steuergerät.*tausch|steuergeraet.*tausch|kalibrier|SWaP|FEC|retrofit|kamera.*aktivier/i.test(coding.name);
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(price);
}

function availableModelCodings(vehicle: Vehicle): Coding[] {
  if (vehicle.diagnosticsOnly || vehicle.startYear >= 2024) return [];

  const eligibleIds = new Set(codingsForVehicle(vehicle));
  const seen = new Set<string>();

  return codingCatalog
    .filter((coding) => eligibleIds.has(coding.id) && coding.id !== "diagnose" && coding.uiGroup !== "Diagnose")
    .filter((coding) => {
      const key = coding.name.toLocaleLowerCase("de").trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) =>
      String(a.uiGroup ?? a.category).localeCompare(String(b.uiGroup ?? b.category), "de") ||
      a.name.localeCompare(b.name, "de", { numeric: true })
    );
}

export default function GuideSelector() {
  const [manufacturer, setManufacturer] = useState<Manufacturer | "">("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [codingSearch, setCodingSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Alle");

  const modelList = useMemo(
    () => vehicles
      .filter((vehicle) => manufacturer && manufacturerOf(vehicle) === manufacturer)
      .sort((a, b) => a.model.localeCompare(b.model, "de", { numeric: true, sensitivity: "base" })),
    [manufacturer]
  );
  const visibleModels = modelList.filter((vehicle) =>
    [vehicle.model, vehicle.modelNote ?? "", vehicle.platform].join(" ")
      .toLocaleLowerCase("de").includes(modelSearch.trim().toLocaleLowerCase("de"))
  );
  const vehicle = modelList.find((item) => item.model === selectedModel);

  // Die Liste kommt aus demselben Fahrzeug-/Codierkatalog wie der Hauptkonfigurator.
  // Ohne Baujahr und Steuergerätedaten ist dies ausdrücklich keine Machbarkeitsfreigabe.
  const codings = useMemo(() => vehicle ? availableModelCodings(vehicle) : [], [vehicle]);
  const categories = useMemo(
    () => ["Alle", ...Array.from(new Set(codings.map((coding) => String(coding.uiGroup ?? coding.category)))).sort((a, b) => a.localeCompare(b, "de"))],
    [codings]
  );
  const shownCodings = codings.filter((coding) => {
    const category = String(coding.uiGroup ?? coding.category);
    return (activeCategory === "Alle" || activeCategory === category) &&
      [coding.name, category].join(" ").toLocaleLowerCase("de").includes(codingSearch.trim().toLocaleLowerCase("de"));
  });

  function chooseManufacturer(next: Manufacturer) {
    setManufacturer(next);
    setSelectedModel("");
    setModelSearch("");
    setCodingSearch("");
    setActiveCategory("Alle");
  }

  function chooseVehicle(next: Vehicle) {
    setSelectedModel(next.model);
    setCodingSearch("");
    setActiveCategory("Alle");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ol className="mb-8 flex flex-wrap gap-2 text-sm font-semibold" aria-label="Schritte zur Anleitungswahl">
        <li className="rounded-full bg-blue-600 px-4 py-2 text-white">1. Hersteller &amp; Fahrzeug</li>
        <li className={vehicle ? "rounded-full bg-blue-100 px-4 py-2 text-blue-800" : "rounded-full bg-slate-200 px-4 py-2 text-slate-600"}>2. Codieranleitung &amp; Preis</li>
      </ol>

      <section aria-labelledby="guide-manufacturer-title">
        <h2 id="guide-manufacturer-title" className="text-2xl font-black">1. Hersteller auswählen</h2>
        <p className="mt-2 text-slate-600">Wähle deinen Hersteller. Anschließend werden alle hinterlegten Modelle als Liste angezeigt.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label="Fahrzeughersteller">
          {manufacturerNames.map((item) => {
            const count = vehicles.filter((v) => manufacturerOf(v) === item).length;
            return (
              <button key={item} type="button" aria-pressed={manufacturer === item} onClick={() => chooseManufacturer(item)}
                className={"flex min-h-20 flex-col items-center justify-center rounded-xl border px-3 py-3 text-center transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 " +
                  (manufacturer === item ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-100" : "border-slate-200 bg-white text-slate-900")}>
                <span className="text-base font-black">{item}</span>
                <span className="mt-1 text-xs text-slate-500">{count} Modelle</span>
              </button>
            );
          })}
        </div>
      </section>

      {manufacturer && (
        <section className="mt-9 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="guide-model-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="guide-model-title" className="text-xl font-black sm:text-2xl">{manufacturer}: Fahrzeug auswählen</h2>
              <p className="mt-2 text-sm text-slate-600">Alle {modelList.length} Modelle aus dem TD-Fahrzeugkatalog, alphabetisch geordnet.</p>
            </div>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Fahrzeugmodell suchen</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden="true" />
              <input type="search" value={modelSearch} onChange={(event) => setModelSearch(event.target.value)}
                placeholder="Modell suchen" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>
          <div className="mt-5 grid max-h-[560px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2" role="group" aria-label="Fahrzeugmodelle">
            {visibleModels.map((item) => {
              const chosen = selectedModel === item.model;
              return (
                <button key={item.model} type="button" aria-pressed={chosen} onClick={() => chooseVehicle(item)}
                  className={"flex min-h-20 items-center justify-between gap-3 rounded-xl border p-4 text-left transition hover:border-blue-400 hover:bg-blue-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 " +
                    (chosen ? "border-blue-600 bg-blue-50 ring-1 ring-blue-100" : "border-slate-200 bg-white")}>
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-950">{item.model}</span>
                    <span className="mt-1 block text-sm text-slate-500">{item.startYear}–{item.endYear >= 2026 ? "heute" : item.endYear}{item.modelNote ? " · " + item.modelNote : ""}</span>
                  </span>
                  {chosen && <Check className="shrink-0 text-blue-700" size={21} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          {!visibleModels.length && <p className="mt-5 text-sm text-slate-600">Kein Modell gefunden. Bitte den Suchbegriff ändern.</p>}
        </section>
      )}

      {vehicle && (
        <section className="mt-9" aria-labelledby="guide-codings-title" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="guide-codings-title" className="text-2xl font-black">2. Codieranleitungen für {vehicle.model}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {codings.length} Codiermöglichkeiten aus dem Fahrzeugkatalog · PDF-Einzelpreise 6,99 € bzw. 14,99 €
              </p>
            </div>
            {codings.length > 0 && (
              <label className="relative block w-full sm:w-72">
                <span className="sr-only">Codieranleitung suchen</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden="true" />
                <input type="search" value={codingSearch} onChange={(event) => setCodingSearch(event.target.value)}
                  placeholder="Codierung suchen" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </label>
            )}
          </div>

          <p className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
            Die Liste zeigt mögliche Anleitungs-Themen für diese Baureihe, nicht eine geprüfte Codierfreigabe.
            Baujahr, Kombiinstrument, Hardware, Softwarestand und ggf. SFD-Schutz entscheiden über die tatsächliche Machbarkeit.
            PDF-Kauf und Download sind noch nicht aktiviert.
          </p>

          {codings.length > 0 ? (
            <>
              <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Codierkategorien">
                {categories.map((category) => (
                  <button key={category} type="button" aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={"rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-blue-400 " +
                      (activeCategory === category ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700")}>
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                {shownCodings.map((coding) => {
                  const price = isComplexGuide(coding) ? 14.99 : 6.99;
                  return (
                    <div key={coding.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-950">{coding.name}</p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><FileText size={15} aria-hidden="true" />PDF-Anleitung in Vorbereitung</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-lg font-black text-blue-700">{formatPrice(price)}</p>
                        <p className="text-xs text-slate-500">PDF-Preis</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!shownCodings.length && <p className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">Keine passenden Codierungen gefunden.</p>}
            </>
          ) : (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600">
              <p>Für dieses Modell sind derzeit keine ausreichend zugeordneten PDF-Anleitungen hinterlegt.</p>
              {vehicle.startYear >= 2024 && <p className="mt-2">Bei neueren Fahrzeugen muss außerdem der tatsächliche SFD-/SFD2-Schutz überprüft werden.</p>}
            </div>
          )}
          <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-slate-500">
            <LockKeyhole size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            Die Dateien werden erst nach fertiggestellter Anleitung und serverseitig bestätigter PayPal-Zahlung zum Kauf angeboten.
          </p>
        </section>
      )}
    </div>
  );
}
