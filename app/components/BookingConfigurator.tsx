"use client";

import { useMemo, useState } from "react";
import { curateCodingEntries, type UnifiedCodingEntry } from "../lib/codingDisplay";
import { ChevronDown, Laptop, MapPin, Search, Sparkles } from "lucide-react";
import ConfiguratorLiveActions from "./ConfiguratorLiveActions";
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


const modelHintRules: Array<{ hint: RegExp; vehicle: RegExp }> = [
  { hint: /audi a3 8v/i, vehicle: /A3 \/ S3 8V/i },
  { hint: /audi a3 8y/i, vehicle: /A3 \/ S3 8Y/i },
  { hint: /leon (iii )?5f/i, vehicle: /Leon 5F/i },
  { hint: /octavia (iii )?5e/i, vehicle: /Octavia 3 5E/i },
  { hint: /golf (vii|7)/i, vehicle: /Golf 7/i },
  { hint: /passat b8/i, vehicle: /Passat B8/i },
  { hint: /tiguan/i, vehicle: /Tiguan II/i },
  { hint: /formentor/i, vehicle: /Formentor/i },
  { hint: /golf 8/i, vehicle: /Golf 8/i },
];

const capabilityTerms: Array<[string, string[]]> = [
  ["acc", ["adaptive cruise", "acc ", "acc-", "front assist", "notbrems"]],
  ["lane", ["lane assist", "spurhalte", "spurwechsel", "side assist", "totwinkel"]],
  ["dla", ["dynamic light assist", "dynamisches fernlicht", "matrix"]],
  ["fla", ["fernlichtassistent", "light assist", "hba"]],
  ["vze", ["verkehrszeichen", "vze"]],
  ["park", ["einpark", "park assist", "parklenk", "pdc"]],
  ["rear-view", ["rückfahrkamera", "rear view", "back-up camera"]],
  ["trailer", ["anhänger", "anhaenger", "trailer assist", "gespann"]],
  ["kessy", ["kessy", "keyless", "easy open", "easy close"]],
  ["tfl", ["tagfahrlicht", "tfl", "dauerfahrlicht"]],
  ["chlh", ["coming home", "leaving home"]],
  ["mirror", ["spiegel", "bordsteinautomatik"]],
  ["rain", ["regenschließ", "regenschliess", "regensensor"]],
  ["lock", ["auto-lock", "auto-unlock", "zentralverriegel", "verriegel"]],
  ["belt", ["gurtwarner", "gurterkennung"]],
  ["staging", ["zeigertest", "needle sweep", "staging"]],
  ["indicator", ["komfortblinken", "blinker"]],
  ["wiper", ["wischer", "tränenwisch", "traenenwisch"]],
  ["windows", ["fenster", "komfortöffnung", "komfortoeffnung", "komfortschließ", "komfortschliess"]],
  ["ambient", ["ambientebeleuchtung", "ambiente-farben"]],
  ["footwell", ["fußraumbeleuchtung", "fussraumbeleuchtung"]],
  ["tailgate", ["heckklappe"]],
  ["tpms", ["reifendruck", "tpms", "rdk"]],
  ["startstop", ["start-stopp", "start/stop"]],
  ["xds", ["xds", "differenzialsperre"]],
  ["esc", ["esc sport", "esp ", "asr "]],
  ["steering", ["lenkung", "lenkunterstützung", "lenkunterstuetzung", "lenkkennlinie"]],
  ["sound", ["soundaktor", "motorsound"]],
  ["seat", ["sitzheizung", "sitzmemory", "sitz-memory", "easy entry"]],
  ["climate", ["klimaanlage", "air care", "gebläse", "geblaese"]],
  ["infotainment", ["infotainment", "discover", "mmi", "carplay", "android auto", "mirrorlink", "bluetooth", "radio", "navigation", "green menu", "hidden menu", "developer mode"]],
  ["instrument", ["kombiinstrument", "tacho", "virtual cockpit", "öltemperatur", "oeltemperatur", "laptimer", "nachtankmenge"]],
  ["lighting", ["abbiegelicht", "standlicht", "parklicht", "kennzeichenbeleuchtung", "scheinwerferreinigungsanlage", "lichtfunktion", "leuchte"]],
  ["hold", ["auto hold", "berganfahr", "hill hold"]],
  ["diagnose", ["diagnose", "kalibrier", "grundeinstellung", "batterie anlernen", "serviceintervall"]],
];

const popularTerms = [
  "zeigertest",
  "rückleuchten zusätzlich aktiv",
  "auto-lock",
  "coming home",
  "spiegel",
  "tagfahrlicht",
  "start-stopp",
  "regenschließ",
];


function normalize(value: string) {
  return value
    .toLocaleLowerCase("de")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function capabilityForName(name: string): string | undefined {
  const n = name.toLocaleLowerCase("de");
  return capabilityTerms.find(([, terms]) => terms.some((term) => n.includes(term)))?.[0];
}

function popularLabel(name: string) {
  if (/tagfahrlicht.*rückleuchten zusätzlich aktiv/i.test(name)) return "TFL mit Heckleuchten";
  if (/zeigertest|needle sweep|staging/i.test(name)) return "Zeigertest";
  return name;
}

function meaningfulTokens(name: string): string[] {
  const stop = new Set([
    "aktivieren", "deaktivieren", "anpassen", "andern", "aendern", "freischaltung",
    "freischalten", "einstellen", "funktion", "funktionen", "variante", "moglich",
    "moeglich", "uber", "ueber", "oder", "und", "bei", "mit", "ohne", "des", "der",
    "die", "das", "fur", "fuer", "von", "auf", "im", "menu", "anzeige",
  ]);
  return normalize(name)
    .split(" ")
    .filter((token) => token.length >= 4 && !stop.has(token));
}

function tokenRelated(a: string, b: string) {
  const left = new Set(meaningfulTokens(a));
  const right = meaningfulTokens(b);
  return right.some((token) => left.has(token));
}

function discountRate(value: number) {
  return value >= 200 ? 0.2 : value >= 100 ? 0.15 : value >= 50 ? 0.1 : 0;
}

function euro(value: number) {
  return value.toFixed(2).replace(".", ",");
}

function nextTier(value: number) {
  return value < 50 ? 50 : value < 100 ? 100 : value < 200 ? 200 : null;
}

function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event, params);
}

function yearAllowed(name: string, year: number) {
  if (year > 2014 && /(video in motion|\bvim\b)/i.test(name)) return false;
  if (year < 2021 && /(wireless carplay|apple.*carplay|carplay.*android auto)/i.test(name)) return false;
  const until = name.match(/\bbis (?:mj\s*)?(\d{4})\b/i);
  if (until && year > Number(until[1])) return false;
  const from = name.match(/\bab (?:mj\s*)?(\d{4})\b/i);
  if (from && year < Number(from[1])) return false;
  return true;
}

function modelHintAllowed(name: string, vehicle: Vehicle) {
  const combined = `${vehicle.brand} ${vehicle.model}`;
  for (const rule of modelHintRules) {
    if (rule.hint.test(name) && !rule.vehicle.test(combined)) return false;
  }
  return true;
}

function SfdBadge({ value }: { value?: "Ja" | "Nein" | "Unklar" }) {
  if (!value) return null;
  if (value === "Ja") return <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">SFD</span>;
  if (value === "Nein") return <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">kein SFD</span>;
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">SFD unklar</span>;
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

function vehicleSpecificCodings(
  vehicle: Vehicle,
  year: number,
  isSfd1: boolean,
  isSfd2: boolean
): UnifiedCodingEntry[] {
  const ids = new Set(codingsForVehicle(vehicle));

  // SFD2: keine dieser klassischen Fahrzeug-Codieroptionen anzeigen.
  // Die beiden MQB-evo-Spurhalteassistent-Optionen gelten ausdrücklich nur bis einschließlich MJ 2023.
  if (isSfd2) return [];

  const vehicleCatalog = codingCatalog
    .filter((coding) => ids.has(coding.id))
    .filter((coding) => {
      if (!isSfd1 || coding.category !== "Assistenzsysteme") return true;
      if (coding.id === "mqbevo-lane-onstate" || coding.id === "mqbevo-adaptive-lane") return true;
      return !/(aktivieren|freischalten|codieren|parametrieren)/i.test(coding.name);
    });

  const vehicleEntries: UnifiedCodingEntry[] = vehicleCatalog.map((coding) => ({
    id: `vehicle-${coding.id}`,
    name: coding.name,
    price: coding.price,
    uiGroup: coding.uiGroup as PlatformCodingGroup,
    hardware: coding.hardware ?? coding.requirements,
    source: "vehicle",
  }));

  const source = codingSources.find((item) => item.platform === vehicle.platform);
  if (!source) return curateCodingEntries(vehicleEntries.filter((entry) => yearAllowed(entry.name, year)));

  const allowedCapabilities = new Set(
    vehicleCatalog.map((coding) => capabilityForName(coding.name)).filter((value): value is string => Boolean(value))
  );

  const platformEntries: UnifiedCodingEntry[] = source.entries
    .filter((entry) => yearAllowed(entry.name, year))
    .filter((entry) => modelHintAllowed(entry.name, vehicle))
    .filter((entry) => {
      const capability = capabilityForName(entry.name);
      if (capability && allowedCapabilities.has(capability)) return true;
      return vehicleCatalog.some((coding) => tokenRelated(entry.name, coding.name));
    })
    .map((entry) => {
      return {
        id: entry.id,
        name: entry.name,
        price: entry.price,
        uiGroup: entry.uiGroup as PlatformCodingGroup,
        hardware: entry.hardware,
        source: "platform" as const,
      };
    });

  return curateCodingEntries([...vehicleEntries, ...platformEntries].filter((entry) => yearAllowed(entry.name, year)));
}
