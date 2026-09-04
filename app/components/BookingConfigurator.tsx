"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, Laptop, MapPin, Search } from "lucide-react";
import { brands, codingCatalog, codingsForVehicle, vehicles, type Vehicle } from "../data/catalog";
import { platformCodingSources } from "../data/platformCodingLists";
import type { PlatformCodingEntry, PlatformCodingSource } from "../data/platformCodingLists";
import { mqbCodingEntries } from "../data/mqbCodingList";
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

function euro(value: number) {
  return value.toFixed(2).replace(".", ",");
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
    ? [{ ...exactMqbSource, entries: mqbCodingEntries.map((name) => ({ name })) }]
    : []),
  ...(mqbEvoSources.length
    ? [{
        id: "mqbevo",
        platform: "MQBevo" as const,
        title: "MQB evo Codierungen",
        scope: "Plattformweite Referenzliste",
        description: "Zusammengefasste Codiermöglichkeiten für Fahrzeuge auf MQB evo.",
        entries: mergedMqbEvoEntries,
      }]
    : []),
  ...(mlbEvoSource ? [mlbEvoSource] : []),
];

const codingSources: PricedPlatformCodingSource[] = baseCodingSources.map((source) => ({
  ...source,
  entries: pricePlatformSource(source),
}));

function codingsFromCodierlisten(
  vehicle: Vehicle,
  isSfd1: boolean,
  isSfd2: boolean
): UnifiedCodingEntry[] {
  if (isSfd2) return [];

  const source = codingSources.find((item) => item.platform === vehicle.platform);
  if (source) {
    return source.entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      price: entry.price,
      uiGroup: entry.uiGroup,
      sfd: entry.sfd,
      status: entry.status,
    }));
  }

  const ids = new Set(codingsForVehicle(vehicle));
  return codingCatalog
    .filter((coding) => ids.has(coding.id))
    .filter((coding) => {
      if (!isSfd1 || coding.category !== "Assistenzsysteme") return true;
      return !/(aktivieren|freischalten|codieren|parametrieren)/i.test(coding.name);
    })
    .map((coding): UnifiedCodingEntry => ({
      id: `vehicle-${coding.id}`,
      name: coding.name,
      price: coding.price,
      uiGroup: coding.uiGroup as PlatformCodingGroup,
    }));
}

function SfdBadge({ value }: { value?: "Ja" | "Nein" | "Unklar" }) {
  if (!value) return null;
  if (value === "Ja") return <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700">SFD</span>;
  if (value === "Nein") return <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">kein SFD</span>;
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">SFD unklar</span>;
}

export default function BookingConfigurator() {
  const [mode, setMode] = useState<"remote" | "onsite">("onsite");
  const [brand, setBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [year, setYear] = useState(0);
  const [vin, setVin] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<"Alle" | PlatformCodingGroup>("Alle");
  const [expandedGroups, setExpandedGroups] = useState<PlatformCodingGroup[]>([]);

  const models = brand ? vehicles.filter((vehicle) => vehicle.brand === brand) : [];
  const selectedVehicle = vehicles.find((vehicle) => vehicle.brand === brand && vehicle.model === vehicleModel);
  const years = selectedVehicle
    ? Array.from({ length: selectedVehicle.endYear - selectedVehicle.startYear + 1 }, (_, index) => selectedVehicle.endYear - index)
    : [];
  const hasVehicle = Boolean(selectedVehicle);
  const isSfd1 = Boolean(selectedVehicle?.sfd1From && year >= selectedVehicle.sfd1From && year < 2024);
  const isSfd2 = Boolean(selectedVehicle?.sfd1From && year >= 2024);
  const platformSource = selectedVehicle ? codingSources.find((source) => source.platform === selectedVehicle.platform) : undefined;

  const available = useMemo<UnifiedCodingEntry[]>(() => {
    if (!selectedVehicle || !year) return [];
    return codingsFromCodierlisten(selectedVehicle, isSfd1, isSfd2);
  }, [isSfd1, isSfd2, selectedVehicle, year]);

  const normalizedSearch = search.trim().toLocaleLowerCase("de");
  const shown = available
    .filter((entry) => activeGroup === "Alle" || entry.uiGroup === activeGroup)
    .filter((entry) => !normalizedSearch || entry.name.toLocaleLowerCase("de").includes(normalizedSearch));
  const selectedEntries = available.filter((entry) => selected.includes(entry.id));
  const subtotal = selectedEntries.reduce((sum, entry) => sum + entry.price, 0);
  const sfdFee = isSfd1 && selected.length > 0 ? 10 : 0;
  const rate = discountRate(subtotal);
  const discount = subtotal * rate;
  const total = subtotal - discount + sfdFee;
  const next = nextTier(subtotal);
  const chosen = selectedEntries.map((entry) => entry.name).join(", ");
  const prepay = total * 0.7;
  const finalpay = total * 0.3;
  const bookingDisabled = !hasVehicle || !year || isSfd2 || selected.length === 0;
  const paypalUrl = `https://paypal.me/TiDrechsler/${prepay.toFixed(2)}`;

  const calBase = mode === "remote"
    ? "https://cal.com/timo-drechsler-lej6jm/remote-codierung"
    : "https://cal.com/timo-drechsler-lej6jm/vag-codierung-vor-ort";
  const calParams = new URLSearchParams();
  if (selectedVehicle) {
    calParams.set("fahrzeug", `${brand} ${selectedVehicle.model}`);
    calParams.set("baujahr", String(year));
  }
  if (vin) calParams.set("fin", vin);
  if (chosen) calParams.set("codierungen", chosen);
  calParams.set("gesamtpreis", `${total.toFixed(2)} EUR${sfdFee ? " inkl. 10 EUR SFD1" : ""}`);
  calParams.set(
    "zahlung",
    mode === "remote"
      ? `PayPal 70% vorab (${prepay.toFixed(2)} EUR) / 30% danach (${finalpay.toFixed(2)} EUR)`
      : "Bar, PayPal oder Sofortüberweisung (beim Termin)"
  );
  const calUrl = `${calBase}?${calParams.toString()}`;

  const resetSelection = () => {
    setSelected([]);
    setSearch("");
    setActiveGroup("Alle");
    setExpandedGroups([]);
  };

  const changeBrand = (value: string) => {
    setBrand(value);
    setVehicleModel("");
    setYear(0);
    setVin("");
    resetSelection();
  };

  const changeModel = (value: string) => {
    setVehicleModel(value);
    setVin("");
    resetSelection();
    const vehicle = vehicles.find((item) => item.brand === brand && item.model === value);
    setYear(vehicle?.endYear ?? 0);
  };

  const changeYear = (value: number) => {
    setYear(value);
    resetSelection();
  };

  const toggle = (id: string) => setSelected((current) =>
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  );

  const toggleGroup = (group: PlatformCodingGroup) => setExpandedGroups((current) =>
    current.includes(group) ? current.filter((item) => item !== group) : [...current, group]
  );

  const savePendingBooking = () => {
    if (typeof window === "undefined" || mode !== "remote" || !selectedVehicle || selected.length === 0) return;
    window.localStorage.setItem("td_pending_booking", JSON.stringify({
      vehicle: `${brand} ${selectedVehicle.model}`,
      year,
      vin,
      codings: chosen,
      total: Number(total.toFixed(2)),
      prepay: Number(prepay.toFixed(2)),
      finalpay: Number(finalpay.toFixed(2)),
      paypalUrl,
      savedAt: Date.now(),
    }));
  };

  const calButton = (className: string, save = false) => bookingDisabled ? (
    <button type="button" disabled className={`inline-flex cursor-not-allowed flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-200 px-5 py-3 font-semibold text-slate-500 ${className}`}>
      <CalendarDays className="h-5 w-5" />
      <span>Termin mit Daten an Cal.com übergeben</span>
      {mode === "onsite" && <span className="rounded-lg bg-slate-300 px-2 py-1 text-slate-700">Gesamtsumme: {euro(total)} €</span>}
    </button>
  ) : (
    <a href={calUrl} onClick={save ? savePendingBooking : undefined} target="_blank" rel="noreferrer" className={`btn-primary flex-wrap gap-2 ${className}`}>
      <CalendarDays className="h-5 w-5" />
      <span>Termin mit Daten an Cal.com übergeben</span>
      {mode === "onsite" && <span className="rounded-lg bg-white/15 px-2 py-1">Gesamtsumme: {euro(total)} €</span>}
    </a>
  );

  return <div className="space-y-5 sm:space-y-8">
    <section className="card p-4 sm:p-8">
      <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">1 · Terminart</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button type="button" onClick={() => setMode("onsite")} className={`min-h-[132px] rounded-2xl border p-4 text-left transition ${mode === "onsite" ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}>
          <MapPin className="h-7 w-7 text-blue-600" /><b className="mt-3 block">Vor Ort in Leipzig-Süd</b><span className="text-sm text-slate-600">Schenkendorfstraße 33, 04275 Leipzig</span>
        </button>
        <button type="button" onClick={() => setMode("remote")} className={`min-h-[132px] rounded-2xl border p-4 text-left transition ${mode === "remote" ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}>
          <Laptop className="h-7 w-7 text-blue-600" /><b className="mt-3 block">Remote-Codierung</b><span className="mt-1 block text-sm leading-6 text-slate-600">Mit eigenem Diagnoseinterface, PC/Laptop, stabiler Internetverbindung und vereinbarter Remote-Software.</span>
        </button>
      </div>
      {mode === "remote" && <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700"><b>Voraussetzungen für Remote:</b> Eigenes kompatibles Diagnoseinterface (z. B. VCP, VCDS oder OBD11), stabile Internetverbindung, Windows-PC/Laptop am Fahrzeug und vereinbarte Remote-Software.</div>}
    </section>

    <section className="card p-4 sm:p-8">
      <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">2 · Fahrzeug</div>
      <h3 className="mt-2 text-xl font-black sm:text-2xl">Marke, Modell und Baujahr</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label><span className="mb-2 block text-sm font-semibold">Marke</span><select value={brand} onChange={(e) => changeBrand(e.target.value)}><option value="">Marke auswählen</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span className="mb-2 block text-sm font-semibold">Modell / Generation</span><select value={vehicleModel} onChange={(e) => changeModel(e.target.value)} disabled={!brand}><option value="">Modell auswählen</option>{models.map((vehicle) => <option key={`${vehicle.brand}-${vehicle.model}`} value={vehicle.model}>{vehicle.model}</option>)}</select></label>
        <label><span className="mb-2 block text-sm font-semibold">Baujahr</span><select value={year || ""} onChange={(e) => changeYear(Number(e.target.value))} disabled={!selectedVehicle}><option value="">Baujahr auswählen</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr]">
        <div>
          <input value={vin} onChange={(e) => setVin(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17))} maxLength={17} placeholder="FIN optional" disabled={!hasVehicle} />
          {vin.length > 0 && vin.length !== 17 && <p className="mt-2 text-xs font-semibold text-amber-600">FIN muss 17 Zeichen enthalten · {vin.length}/17</p>}
          {vin.length === 17 && <p className="mt-2 text-xs font-semibold text-emerald-600">FIN vollständig · 17/17</p>}
        </div>
        {selectedVehicle ? <div className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">Erkannt: <strong>{platformLabels[selectedVehicle.platform] ?? selectedVehicle.platform}</strong>. {platformSource ? "Die umfangreiche Codierliste der Codierübersicht wird verwendet." : "Die fahrzeugbezogene Bestandsliste der Codierübersicht wird verwendet."}</div> : <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">Bitte zuerst Marke und Modell auswählen.</div>}
      </div>
      {isSfd1 && <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-900"><b>SFD1:</b> Für die Freischaltung geschützter Steuergeräte werden bei einer Auswahl einmalig <strong>10,00 €</strong> ergänzt.</div>}
      {isSfd2 && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-900"><b>SFD2 / UNECE:</b> Für dieses Baujahr werden aktuell keine regulären Codierungsaufträge angeboten.</div>}
    </section>

    <section className="card p-4 sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">3 · Codierungen</div><h3 className="mt-2 text-xl font-black sm:text-2xl">{selectedVehicle && year ? `${brand} ${selectedVehicle.model} · ${year}` : "Fahrzeug auswählen"}</h3></div>
        <label className="relative block w-full md:max-w-xs"><span className="sr-only">Codierung suchen</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="w-full pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Codierung suchen …" disabled={!hasVehicle || !year || isSfd2} /></label>
      </div>

      {hasVehicle && year && !isSfd2 && <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">{["Alle", ...platformCodingGroups].map((group) => <button type="button" key={group} onClick={() => setActiveGroup(group as "Alle" | PlatformCodingGroup)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${activeGroup === group ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>{group}</button>)}</div>}

      {!hasVehicle || !year ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Bitte zuerst Marke, Modell und Baujahr auswählen.</div>
      : isSfd2 ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">Für dieses Fahrzeug und Baujahr wird die Codierauswahl aktuell nicht freigegeben.</div>
      : shown.length === 0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Für diesen Filter sind aktuell keine Funktionen hinterlegt.</div>
      : <div className="mt-5 space-y-2">{platformCodingGroups.map((group) => {
          const list = shown.filter((entry) => entry.uiGroup === group);
          if (!list.length) return null;
          const selectedInGroup = list.filter((entry) => selected.includes(entry.id)).length;
          const isExpanded = activeGroup !== "Alle" || Boolean(normalizedSearch) || expandedGroups.includes(group);
          return <div key={group} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button type="button" onClick={() => toggleGroup(group)} className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-slate-50"><span className="font-black text-blue-700">{group} <span className="font-semibold text-slate-400">({list.length})</span></span><span className="flex items-center gap-2">{selectedInGroup > 0 && <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-bold text-blue-700">{selectedInGroup} gewählt</span>}<ChevronDown className={`h-4 w-4 text-slate-500 ${isExpanded ? "rotate-180" : ""}`} /></span></button>
            {isExpanded && <div className="border-t border-slate-200 bg-slate-50/60 p-2 sm:p-3"><div className="grid gap-2 lg:grid-cols-2">{list.map((entry) => {
              const checked = selected.includes(entry.id);
              return <div key={entry.id} className={`rounded-lg border px-3 py-2.5 ${checked ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}><label className="flex cursor-pointer items-start justify-between gap-2.5"><span className="flex min-w-0 flex-1 items-start text-sm leading-5"><input className="mr-2.5 mt-0.5 h-4 w-4" type="checkbox" checked={checked} onChange={() => toggle(entry.id)} /><span>{entry.name}</span></span><b className="shrink-0 text-sm">{entry.price} €</b></label>{entry.sfd || entry.status ? <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2"><SfdBadge value={entry.sfd} />{entry.status === "Ungetestet" ? <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">ungetestet</span> : entry.status === "Getestet" ? <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">getestet</span> : null}</div> : null}</div>;
            })}</div></div>}
          </div>;
        })}</div>}

      {hasVehicle && <div className="mt-5 rounded-xl bg-slate-50 p-4"><div className="flex justify-between text-sm"><span>Zwischensumme</span><b>{euro(subtotal)} €</b></div><div className="mt-1.5 flex justify-between text-sm text-blue-700"><span>Rabatt ({Math.round(rate * 100)} %)</span><b>-{euro(discount)} €</b></div>{sfdFee > 0 && <div className="mt-2 flex justify-between border-t pt-2 text-sm text-blue-700"><span>SFD1-Freischaltung</span><b>+10,00 €</b></div>}<div className="mt-3 flex justify-between border-t pt-3 text-lg"><b>Gesamt</b><b>{euro(total)} €</b></div>{next ? <p className="mt-2 text-xs text-slate-600">Noch {euro(Math.max(0, next - subtotal))} € bis zur nächsten Rabattstufe ({next === 50 ? 5 : next === 100 ? 10 : next === 150 ? 15 : 20} %).</p> : <p className="mt-2 text-xs font-semibold text-blue-700">20 % Maximalrabatt erreicht.</p>}</div>}
    </section>

    {mode === "remote" ? <section className="card p-4 sm:p-8">
      <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">4 · Termin und Zahlung</div>
      {selectedVehicle && <div className="mt-4 rounded-2xl border border-blue-100 p-4 text-sm leading-6"><b>Remote</b> · {brand} {selectedVehicle.model} · Baujahr {year}<br />{selected.length} Codierung(en) · {Math.round(rate * 100)} % Rabatt · <b>{euro(total)} €</b><br />70 % vorab: {euro(prepay)} € · 30 % danach: {euro(finalpay)} €</div>}
      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><b>Ablauf:</b> Termin auswählen, anschließend 70 % vorauszahlen. <strong>Der Termin wird nach Eingang der Vorauszahlung verbindlich bestätigt.</strong></div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Zahlungsmöglichkeit: <b>PayPal</b></div>
      <div className={`mt-5 grid gap-3 ${bookingDisabled ? "" : "sm:grid-cols-2"}`}>{calButton("w-full text-center", true)}{!bookingDisabled && <a href="/zahlung" onClick={savePendingBooking} className="btn-secondary flex w-full flex-col text-center"><span>Termin gebucht? Jetzt 70 % vorauszahlen</span><span className="mt-1 text-sm font-black">Betrag: {euro(prepay)} €</span></a>}</div>
    </section> : <>
      <section className="card p-4 sm:p-8"><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">4 · Zahlungsmöglichkeiten</div><p className="mt-3 text-sm text-slate-600">Die Zahlung erfolgt beim Termin.</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><b>Bar</b></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><b>PayPal</b></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><b>Sofortüberweisung</b></div></div></section>
      <section className="card p-4 sm:p-8"><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">5 · Termin</div>{selectedVehicle && <div className="mt-4 rounded-2xl border border-blue-100 p-4 text-sm leading-6"><b>Vor Ort</b> · {brand} {selectedVehicle.model} · Baujahr {year}<br />{selected.length} Codierung(en) · {Math.round(rate * 100)} % Rabatt · <b>{euro(total)} €</b></div>}<div className="mt-5">{calButton("w-full text-center sm:w-auto")}</div></section>
    </>}

    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-blue-100 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur md:hidden"><div className="mx-auto grid max-w-md grid-cols-[2fr_1fr] gap-2">{bookingDisabled ? <button type="button" disabled className="inline-flex min-h-16 w-full items-center justify-center rounded-xl border border-slate-300 bg-slate-200 px-3 py-2 text-center text-[11px] font-semibold text-slate-500">Termin mit Daten an Cal.com übergeben</button> : <a href={calUrl} onClick={mode === "remote" ? savePendingBooking : undefined} target="_blank" rel="noreferrer" className="inline-flex min-h-16 w-full items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-center text-[11px] font-semibold text-white">Termin mit Daten an Cal.com übergeben</a>}<a href="#kontakt" className="inline-flex min-h-16 items-center justify-center rounded-xl border border-blue-200 bg-white px-3 py-2 text-center text-sm font-bold text-blue-700">Direktkontakt</a></div></div>
  </div>;
}
