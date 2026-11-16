"use client";

import { useEffect, useState } from "react";
import { MapPin, Wifi } from "lucide-react";
import { brands, vehicles } from "../data/catalog";
import { homeVehiclePreviewEvent, homeVehicleSelectedEvent, homeVehicleUpdatedEvent, type HomeVehicleSelection } from "../lib/homeVehicleSelection";

type FinderProps = {
  guides?: boolean;
  initial?: HomeVehicleSelection | null;
  onFilter?: (selection: HomeVehicleSelection) => void;
};

export default function HomeVehicleFinder({ initial, onFilter, guides = false }: FinderProps = {}) {
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [year, setYear] = useState(initial?.year ?? 0);
  const [mode, setMode] = useState<"onsite" | "remote">(initial?.mode ?? "onsite");
  const models = vehicles.filter((item) => item.brand === brand).sort((a, b) => a.model.localeCompare(b.model, "de", { numeric: true, sensitivity: "base" }));
  const vehicle = models.find((item) => item.model === model);
  const years = vehicle ? Array.from({ length: vehicle.endYear - vehicle.startYear + 1 }, (_, i) => vehicle.endYear - i) : [];
  const ready = Boolean(vehicle && years.includes(year));

  function preview(nextBrand: string, nextModel: string, nextYear = 0) {
    onFilter?.({ brand: nextBrand, model: nextModel, year: nextYear, mode });
    window.dispatchEvent(new CustomEvent(homeVehiclePreviewEvent, { detail: { brand: nextBrand, model: nextModel, year: nextYear, mode } }));
  }

  useEffect(() => {
    const synchronize = (event: Event) => {
      const selection = (event as CustomEvent<HomeVehicleSelection>).detail;
      setBrand(selection.brand);
      setModel(selection.model);
      setYear(selection.year);
      setMode(selection.mode);
    };
    window.addEventListener(homeVehicleUpdatedEvent, synchronize);
    try {
      if (window.location.hash === "#buchen" && !window.location.search && !window.sessionStorage.getItem("td_vehicle_prefill")) {
        document.getElementById("fahrzeugauswahl")?.scrollIntoView({ block: "start" });
      }
    } catch { /* The form remains usable when browser storage is disabled. */ }
    return () => window.removeEventListener(homeVehicleUpdatedEvent, synchronize);
  }, []);

  function selectYear(nextYear: number) {
    setYear(nextYear);
    preview(brand, model, nextYear);
    if (!vehicle || !years.includes(nextYear)) return;
    const detail: HomeVehicleSelection = { brand, model, year: nextYear, mode };
    window.dispatchEvent(new CustomEvent(homeVehicleSelectedEvent, { detail }));
  }

  function selectMode(nextMode: "onsite" | "remote") {
    setMode(nextMode);
    onFilter?.({ brand, model, year, mode: nextMode });
    if (!ready) return;
    const detail: HomeVehicleSelection = { brand, model, year, mode: nextMode };
    window.dispatchEvent(new CustomEvent(homeVehicleSelectedEvent, { detail }));
  }

  return <div className="td-finder" role="group" aria-labelledby="finder-title">
    {!onFilter && <ol className="td-config-steps" aria-label="Schritte zur Terminbuchung"><li aria-current="step"><span>1</span> Fahrzeug</li><li><span>2</span> Codierungen</li><li><span>3</span> Preis &amp; Termin</li></ol>}
    <div className="td-finder-top">
      <div><h2 id="finder-title">Was fährst du?</h2><p>{guides ? "Marke, Modell und Baujahr für die PDF-Auswahl angeben." : "Fahrzeug wählen und Codierungen entdecken."}</p></div>
      {!guides && <div className="td-mode" role="group" aria-label="Terminart">
        <button type="button" aria-pressed={mode === "onsite"} onClick={() => selectMode("onsite")}><MapPin aria-hidden="true" />Vor Ort in Leipzig</button>
        <button type="button" aria-pressed={mode === "remote"} onClick={() => selectMode("remote")}><Wifi aria-hidden="true" />Per Remote</button>
      </div>}
    </div>
    <div className="td-finder-fields">
      <label className="td-brand-field" data-current-step={!brand}><span>Marke</span><select required value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); setYear(0); preview(e.target.value, ""); }}><option value="">Marke wählen</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label data-current-step={Boolean(brand && !model)}><span>Modell / Generation</span><select required disabled={!brand} value={model} onChange={(e) => { setModel(e.target.value); setYear(0); preview(brand, e.target.value); }}><option value="">Modell wählen</option>{models.map((item) => <option key={item.model} value={item.model}>{item.model}</option>)}</select></label>
      <label data-current-step={Boolean(model && !year)}><span>Baujahr</span><select id="finder-year" required disabled={!vehicle} value={year || ""} onChange={(e) => selectYear(Number(e.target.value))}><option value="">Baujahr wählen</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    </div>
    {ready && !onFilter && <a href={`/anleitungen?${new URLSearchParams({ brand, model, year: String(year), mode })}`}>PDF-Anleitungen zum Fahrzeug →</a>}
    {!ready && <p className="td-finder-next" aria-live="polite">{!brand ? "1. Wähle deine Fahrzeugmarke." : !model ? "2. Wähle Modell und Generation." : "3. Wähle das Baujahr."}</p>}
    {!guides && mode === "remote" && <p className="td-remote-note">Mit eigenem Diagnoseinterface, Windows-PC/Laptop, stabiler Internetverbindung und vereinbarter Remote-Software. Interface und Spannungsversorgung stimmen wir vorher ab.</p>}
  </div>;
}
