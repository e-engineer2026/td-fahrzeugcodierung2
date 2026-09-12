"use client";

import { useMemo, useState } from "react";
import { brands, vehicles } from "../data/catalog";

const storageKey = "td_vehicle_prefill";

export default function HeroVehicleQuickSelect() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(0);

  const models = useMemo(() => vehicles.filter((vehicle) => vehicle.brand === brand), [brand]);
  const vehicle = vehicles.find((item) => item.brand === brand && item.model === model);
  const years = vehicle
    ? Array.from({ length: vehicle.endYear - vehicle.startYear + 1 }, (_, index) => vehicle.endYear - index)
    : [];

  const changeBrand = (value: string) => {
    setBrand(value);
    setModel("");
    setYear(0);
  };

  const changeModel = (value: string) => {
    setModel(value);
    const selectedVehicle = vehicles.find((item) => item.brand === brand && item.model === value);
    setYear(selectedVehicle?.endYear ?? 0);
  };

  const openConfigurator = () => {
    if (!brand || !model || !year) return;
    const prefill = { brand, model, year };
    window.sessionStorage.setItem(storageKey, JSON.stringify(prefill));
    const params = new URLSearchParams({ brand, model, year: String(year) });
    window.location.assign(`/?${params.toString()}#buchen`);
  };

  return (
    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 shadow-sm sm:mt-8 sm:p-5">
      <div className="text-sm font-black text-slate-900">Fahrzeug direkt auswählen</div>
      <p className="mt-1 text-sm text-slate-600">Marke, Modell und Baujahr wählen – danach wird direkt die passende Codierungsliste geöffnet.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_.8fr_auto]">
        <select value={brand} onChange={(event) => changeBrand(event.target.value)} aria-label="Marke auswählen">
          <option value="">Marke</option>
          {brands.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={model} onChange={(event) => changeModel(event.target.value)} disabled={!brand} aria-label="Modell auswählen">
          <option value="">Modell / Generation</option>
          {models.map((item) => <option key={`${item.brand}-${item.model}`} value={item.model}>{item.model}</option>)}
        </select>
        <select value={year || ""} onChange={(event) => setYear(Number(event.target.value))} disabled={!vehicle} aria-label="Baujahr auswählen">
          <option value="">Baujahr</option>
          {years.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="button" onClick={openConfigurator} disabled={!brand || !model || !year} className="btn-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50">
          Codierungen anzeigen →
        </button>
      </div>
    </div>
  );
}
