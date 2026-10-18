"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, MapPin, MessageCircle, Wifi } from "lucide-react";
import { brands, vehicles } from "../data/catalog";
import { homeVehicleSelectedEvent, homeVehicleUpdatedEvent, type HomeVehicleSelection } from "../lib/homeVehicleSelection";

export default function HomeVehicleFinder() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(0);
  const [mode, setMode] = useState<"onsite" | "remote">("onsite");
  const models = vehicles.filter((item) => item.brand === brand);
  const vehicle = models.find((item) => item.model === model);
  const years = vehicle ? Array.from({ length: vehicle.endYear - vehicle.startYear + 1 }, (_, i) => vehicle.endYear - i) : [];
  const ready = Boolean(vehicle && years.includes(year));

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
        <button type="button" aria-pressed={mode === "onsite"} onClick={() => setMode("onsite")}><MapPin aria-hidden="true" />Vor Ort in Leipzig</button>
        <button type="button" aria-pressed={mode === "remote"} onClick={() => setMode("remote")}><Wifi aria-hidden="true" />Per Remote</button>
      </div>
    </div>
    <div className="td-finder-fields">
      <label className="td-brand-field"><span>Marke</span><select required value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); setYear(0); }}><option value="">Marke wählen</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span>Modell / Generation</span><select required disabled={!brand} value={model} onChange={(e) => { setModel(e.target.value); setYear(0); }}><option value="">Modell wählen</option>{models.map((item) => <option key={item.model} value={item.model}>{item.model}</option>)}</select></label>
      <label><span>Baujahr</span><select required disabled={!vehicle} value={year || ""} onChange={(e) => setYear(Number(e.target.value))}><option value="">Baujahr wählen</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <button className="td-button td-finder-submit" type="submit" disabled={!ready}>Codierungen anzeigen<ArrowRight aria-hidden="true" /></button>
    </div>
    {mode === "remote" && <p className="td-remote-note">Mit eigenem Diagnoseinterface, Windows-PC/Laptop, stabiler Internetverbindung und vereinbarter Remote-Software. Interface und Spannungsversorgung stimmen wir vorher ab.</p>}
    <p className="td-finder-help"><MessageCircle aria-hidden="true" /><span>Du findest dein Fahrzeug nicht? <a href="https://wa.me/4915563047044" target="_blank" rel="noreferrer">Schreib mir per WhatsApp.</a></span></p>
  </form>;
}
