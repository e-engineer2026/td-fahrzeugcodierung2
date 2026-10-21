"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, MapPin, MessageCircle, Wifi } from "lucide-react";
import { brands, vehicles } from "../data/catalog";
import { homeVehiclePreviewEvent, homeVehicleSelectedEvent, homeVehicleUpdatedEvent, type HomeVehicleSelection } from "../lib/homeVehicleSelection";

export default function HomeVehicleFinder() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(0);
  const [mode, setMode] = useState<"onsite" | "remote">("onsite");
  const models = vehicles.filter((item) => item.brand === brand);
  const vehicle = models.find((item) => item.model === model);
  const years = vehicle ? Array.from({ length: vehicle.endYear - vehicle.startYear + 1 }, (_, i) => vehicle.endYear - i) : [];
  const ready = Boolean(vehicle && years.includes(year));

  function preview(nextBrand: string, nextModel: string, nextYear = 0, nextMode = mode) {
    window.dispatchEvent(new CustomEvent(homeVehiclePreviewEvent, { detail: { brand: nextBrand, model: nextModel, year: nextYear, mode: nextMode } }));
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

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    const detail: HomeVehicleSelection = { brand, model, year, mode };
    window.dispatchEvent(new CustomEvent(homeVehicleSelectedEvent, { detail }));
  }

  return <form className="td-finder" onSubmit={submit} aria-labelledby="finder-title">
    <div className="td-finder-top">
      <div><h2 id="finder-title">Was fährst du?</h2><p>Fahrzeug auswählen und passende Codierungen entdecken.</p></div>
      <div className="td-mode" role="group" aria-label="Terminart">
        <button type="button" aria-pressed={mode === "onsite"} onClick={() => { setMode("onsite"); preview(brand, model, year, "onsite"); }}><MapPin aria-hidden="true" />Vor Ort in Leipzig</button>
        <button type="button" aria-pressed={mode === "remote"} onClick={() => { setMode("remote"); preview(brand, model, year, "remote"); }}><Wifi aria-hidden="true" />Per Remote</button>
      </div>
    </div>
    <div className="td-finder-fields">
      <label className="td-brand-field"><span>Marke</span><select id="finder-brand" required value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); setYear(0); preview(e.target.value, ""); }}><option value="">Marke wählen</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Modell / Generation</span><select id="finder-model" required disabled={!brand} value={model} onChange={(e) => { setModel(e.target.value); setYear(0); preview(brand, e.target.value); }}><option value="">Modell wählen</option>{models.map((item) => <option key={item.model} value={item.model}>{item.model}</option>)}</select></label>
      <label><span>Baujahr</span><select id="finder-year" required disabled={!vehicle} value={year || ""} onChange={(e) => { const nextYear = Number(e.target.value); setYear(nextYear); preview(brand, model, nextYear); }}><option value="">Baujahr wählen</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <button className="td-button td-finder-submit" type="submit" disabled={!ready}>Codierungen anzeigen<ArrowRight aria-hidden="true" /></button>
    </div>
    {ready && <p className="td-finder-current"><b>Deine Auswahl:</b> {brand} {model} · {year} <span>{mode === "remote" ? "Remote" : "Vor Ort in Leipzig"}</span></p>}
    {!ready && <p className="td-finder-validation" role="status">{!brand ? "Wähle zuerst deine Marke." : !model ? "Wähle jetzt Modell und Baujahr." : "Wähle noch das Baujahr, um passende Codierungen anzuzeigen."}</p>}
    <p className="td-finder-picture-note">Das Bild oben passt sich deiner Auswahl an, sofern eine passende Modellillustration verfügbar ist.</p>
    {mode === "remote" && <p className="td-remote-note">Mit eigenem Diagnoseinterface, Windows-PC/Laptop, stabiler Internetverbindung und vereinbarter Remote-Software. Interface und Spannungsversorgung stimmen wir vorher ab.</p>}
    <p className="td-finder-help"><MessageCircle aria-hidden="true" /><span>Du findest dein Fahrzeug nicht? <a href="https://wa.me/4915563047044" target="_blank" rel="noreferrer">Schreib mir per WhatsApp.</a></span></p>
  </form>;
}
