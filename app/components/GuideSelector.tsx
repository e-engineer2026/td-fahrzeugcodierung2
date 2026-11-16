"use client";

import { useMemo, useState } from "react";
import { Check, FileText, LockKeyhole, Search } from "lucide-react";
import { brands, vehicles } from "../data/catalog";
import { vehicleSpecificCodings, needsProtectionReview } from "../lib/vehicleCodings";

type Guide = { id: string; name: string; category: string; price: number; matcher: RegExp };
const guides: Guide[] = [
  { id: "zeigertest", name: "Zeigertest / Staging", category: "Kombiinstrument", price: 6.99, matcher: /zeigertest|needle\s*sweep|staging/i },
  { id: "oeltemperatur", name: "Öltemperaturanzeige", category: "Kombiinstrument", price: 6.99, matcher: /öltemperatur|oeltemperatur/i },
  { id: "laptimer", name: "Laptimer / Rundenzähler", category: "Kombiinstrument", price: 6.99, matcher: /laptimer|rundenzähler/i },
  { id: "komfortblinken", name: "Komfortblinken", category: "Komfort", price: 6.99, matcher: /komfortblinken/i },
  { id: "autolock", name: "Auto-Lock / Auto-Unlock", category: "Komfort", price: 6.99, matcher: /auto[- ]?lock|auto[- ]?unlock/i },
  { id: "spiegelabsenkung", name: "Spiegelabsenkung", category: "Komfort", price: 6.99, matcher: /spiegelabsenkung/i },
  { id: "regenschliessen", name: "Regenschließen", category: "Komfort", price: 6.99, matcher: /regenschließ|regenschliess/i },
  { id: "coming-home", name: "Coming / Leaving Home", category: "Licht", price: 6.99, matcher: /coming.home|leaving.home/i },
  { id: "tfl-heck", name: "Heckleuchten mit Tagfahrlicht", category: "Licht", price: 6.99, matcher: /heckleuchten.*tagfahrlicht|tagfahrlicht.*heckleuchten/i },
  { id: "fernlicht", name: "Fernlichtassistent", category: "Assistenzsysteme", price: 14.99, matcher: /fernlichtassistent|light assist/i },
  { id: "vze", name: "Verkehrszeichenerkennung", category: "Assistenzsysteme", price: 14.99, matcher: /verkehrszeichenerkennung|\bvze\b/i },
  { id: "ambiente", name: "Ambientebeleuchtung nachrüsten", category: "Nachrüstung", price: 14.99, matcher: /ambientebeleuchtung|ambientelicht/i },
];
const money = (amount: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);

export default function GuideSelector() {
  const [search, setSearch] = useState("");
  const [guideId, setGuideId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(0);
  const [a4Variant, setA4Variant] = useState("");

  const guide = guides.find((item) => item.id === guideId);
  const models = useMemo(() => vehicles.filter((item) => item.brand === brand).sort((a, b) => a.model.localeCompare(b.model, "de", { numeric: true })), [brand]);
  const vehicle = models.find((item) => item.model === model);
  const years = vehicle ? Array.from({ length: vehicle.endYear - vehicle.startYear + 1 }, (_, index) => vehicle.endYear - index) : [];
  const isA4B9 = brand === "Audi" && model === "A4 / S4 B9";
  const vehicleReady = Boolean(vehicle && years.includes(year) && (!isA4B9 || a4Variant));
  const complete = Boolean(vehicleReady && guide);

  // Gleiche fahrzeugspezifische Filterlogik wie der Hauptkonfigurator.
  const vehicleCodings = useMemo(() => {
    if (!vehicle || !vehicleReady) return [];
    const sfd1 = Boolean(vehicle.sfd1From && year >= vehicle.sfd1From && year < 2024);
    return vehicleSpecificCodings(vehicle, year, sfd1, needsProtectionReview(year))
      .filter((entry) => !entry.reviewOnly);
  }, [vehicle, vehicleReady, year]);
  const availableGuides = guides.filter((item) => vehicleCodings.some((entry) => item.matcher.test(entry.name)));
  const filteredGuides = availableGuides.filter((item) => (item.name + " " + item.category).toLocaleLowerCase("de").includes(search.toLocaleLowerCase("de").trim()));
  const codingMentioned = Boolean(guide && vehicleCodings.some((entry) => guide.matcher.test(entry.name)));

  return (
    <div className="mx-auto max-w-5xl">
      <ol className="mb-7 flex flex-wrap gap-2 text-sm font-semibold" aria-label="Schritte zur Anleitungswahl">
        <li className="rounded-full bg-blue-600 px-4 py-2 text-white">1. Fahrzeug wählen</li>
        <li className={vehicleReady ? "rounded-full bg-blue-100 px-4 py-2 text-blue-800" : "rounded-full bg-slate-200 px-4 py-2 text-slate-600"}>2. Codieranleitung wählen</li>
        <li className={complete ? "rounded-full bg-blue-100 px-4 py-2 text-blue-800" : "rounded-full bg-slate-200 px-4 py-2 text-slate-600"}>3. Anleitung prüfen</li>
      </ol>

      <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="vehicles-title">
          <h2 id="vehicles-title" className="text-2xl font-black">1. Für welches Fahrzeug benötigst du eine Anleitung?</h2>
          <p className="mt-2 text-sm text-slate-600">Wähle Marke, Modell und Baujahr. Danach erscheinen die passenden Codieranleitungen.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="text-sm font-bold text-slate-700">Marke
              <select value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); setYear(0); setA4Variant(""); setGuideId(""); setSearch(""); }}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base font-normal">
                <option value="">Marke wählen</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">Modell / Baureihe
              <select value={model} disabled={!brand} onChange={(e) => { setModel(e.target.value); setYear(0); setA4Variant(""); }}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base font-normal disabled:bg-slate-100">
                <option value="">Modell wählen</option>{models.map((item) => <option key={item.model} value={item.model}>{item.model}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">Baujahr
              <select value={year || ""} disabled={!vehicle} onChange={(e) => { setYear(Number(e.target.value)); setA4Variant(""); }}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base font-normal disabled:bg-slate-100">
                <option value="">Baujahr wählen</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          {isA4B9 && year > 0 && (
            <label className="mt-5 block max-w-sm text-sm font-bold text-slate-700">Audi A4 (8W) Ausführung
              <select value={a4Variant} onChange={(e) => setA4Variant(e.target.value); setGuideId(""); setSearch(""); }}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base font-normal">
                <option value="">Ausführung wählen</option>
                <option value="Vor-Facelift">Vor-Facelift (B9)</option>
                <option value="Facelift">Facelift (B9.5)</option>
              </select>
            </label>
          )}
          {!vehicleReady && <p role="status" className="mt-5 text-sm text-slate-500">Bitte die Fahrzeugangaben vollständig auswählen.</p>}
      </section>

      {vehicleReady && !availableGuides.length && (
        <p role="status" className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
          Für dieses Modell und Baujahr sind aktuell keine der vorbereiteten Anleitungsfunktionen im Fahrzeugkatalog bestätigt. Deshalb werden keine PDFs zum Kauf angeboten.
        </p>
      )}

      {vehicleReady && (
      <section className="mt-10" aria-labelledby="guides-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="guides-title" className="text-2xl font-black">2. Welche Codieranleitung suchst du?</h2>
            <p className="mt-2 text-slate-600">Die Auswahl zeigt nur Funktionen aus dem Fahrzeugkatalog. Steuergeräte, Ausstattung und Softwarestand können die Machbarkeit einschränken.</p>
          </div>
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Codierung suchen</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Codierung suchen"
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((item) => (
            <button key={item.id} type="button" aria-pressed={guideId === item.id}
              onClick={() => setGuideId(item.id)}
              className={"flex min-h-36 flex-col items-start rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 " + (guideId === item.id ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200")}>
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{item.category}</span>
                {guideId === item.id ? <Check size={20} aria-hidden="true" className="text-blue-700" /> : <FileText size={20} aria-hidden="true" className="text-slate-400" />}
              </span>
              <span className="mt-4 text-lg font-black text-slate-950">{item.name}</span>
              <span className="mt-auto pt-4 text-sm font-bold text-blue-700">Geplant: {money(item.price)}</span>
            </button>
          ))}
        </div>
        {!filteredGuides.length && <p className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-slate-600">Keine Anleitungen gefunden, die zu diesem Suchbegriff passen.</p>}
      </section>
      )}

      {complete && guide && vehicle && (
        <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-8" aria-labelledby="pdf-result-title" aria-live="polite">
          <div className="flex items-center gap-2 text-blue-700"><LockKeyhole size={20} aria-hidden="true" /><span className="text-xs font-bold uppercase tracking-wider">PDF noch nicht freigeschaltet</span></div>
          <h2 id="pdf-result-title" className="mt-4 text-2xl font-black">3. {guide.name}</h2>
          <p className="mt-2 text-slate-700">{brand} · {model} · {year}{isA4B9 ? " · " + a4Variant : ""}</p>
          <p className="mt-4 text-2xl font-black text-blue-700">{money(guide.price)} <span className="text-sm font-medium text-slate-600">geplanter PDF-Preis</span></p>
          {year >= 2024 ? (
            <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">Ab Baujahr 2024 sind Steuergeräte und SFD-/SFD2-Schutz individuell zu prüfen. Diese Auswahl bestätigt keine Codierbarkeit.</p>
          ) : codingMentioned ? (
            <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">Diese Funktion steht im vorhandenen Codierkatalog für die Baureihe. Die tatsächliche Machbarkeit hängt von Ausstattung, Steuergerät und Softwarestand ab.</p>
          ) : (
            <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">Für diese Kombination ist die Codierung noch nicht im fahrzeugspezifischen Katalog bestätigt.</p>
          )}
          <p className="mt-4 text-sm leading-7 text-slate-600">Die individuelle VCDS-/VCP-PDF-Anleitung wird vorbereitet. Ein Kauf oder Download ist noch nicht möglich. Die Freigabe erfolgt künftig erst nach serverseitig bestätigter PayPal-Zahlung.</p>
        </section>
      )}
    </div>
  );
}
