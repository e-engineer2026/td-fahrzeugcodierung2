import { curateCodingEntries, type UnifiedCodingEntry, mergePrerequisites } from "./codingDisplay";
import { isSmartphoneAidId, smartphoneAidForVehicle } from "../data/smartphoneAid";
import { cockpitDesignForVehicle, isCockpitDesignName } from "../data/cockpitDesigns";
import { codingCatalog, codingsForVehicle, type Vehicle } from "../data/catalog";
import { platformCodingSources, type PlatformCodingEntry, type PlatformCodingSource } from "../data/platformCodingLists";
import { mqbCodingEntries } from "../data/mqbCodingList";
import { pricePlatformSource, type PlatformCodingGroup, type PricedPlatformCodingEntry } from "../data/platformCodingPricing";

// A calendar year is a review trigger, never evidence that a particular ECU has SFD2.
export function needsProtectionReview(year: number): boolean { return year >= 2024; }
export const protectionReviewMessage = "Ab Baujahr 2024 prüfen wir zuerst den Auto-Scan, Modelljahr, Steuergeräte und den tatsächlichen SFD-/SFD2-Schutz. Codierungen sind bis zur Bestätigung nicht direkt buchbar. Für SFD2-geschützte Funktionen bieten wir keine Codierung an. Diagnose und Vorprüfung kannst du weiterhin anfragen.";

type PricedPlatformCodingSource = Omit<PlatformCodingSource, "entries"> & { entries: PricedPlatformCodingEntry[] };

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

function normalize(value: string) { return value.toLocaleLowerCase("de").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, " ").trim(); }
export function yearAllowed(name: string, year: number) { if (year > 2014 && /(video in motion|\bvim\b)/i.test(name)) return false; const until = name.match(/\bbis (?:mj\s*)?(\d{4})\b/i); if (until && year > Number(until[1])) return false; const from = name.match(/\bab (?:mj\s*)?(\d{4})\b/i); if (from && year < Number(from[1])) return false; return true; }
function modelHintAllowed(name: string, vehicle: Vehicle) { const combined = `${vehicle.brand} ${vehicle.model}`; for (const rule of modelHintRules) { if (rule.hint.test(name) && !rule.vehicle.test(combined)) return false; } return true; }
const exactMqbSource = platformCodingSources.find((source) => source.id === "mqb");
const mlbEvoSource = platformCodingSources.find((source) => source.platform === "MLBevo");
const mqbEvoSources = platformCodingSources.filter((source) => source.platform === "MQBevo");
const mergedMqbEvoEntries = Array.from(new Map<string, PlatformCodingEntry>(mqbEvoSources.flatMap((source) => source.entries).map((entry) => [entry.name, entry])).values());
const baseCodingSources: PlatformCodingSource[] = [
  ...(exactMqbSource ? [{ ...exactMqbSource, entries: mqbCodingEntries.map((name) => ({ name })) }] : []),
  ...(mqbEvoSources.length ? [{ id: "mqbevo", platform: "MQBevo" as const, title: "MQB evo Codierungen", scope: "Plattformweite Referenzliste", description: "Zusammengefasste Codiermöglichkeiten für Fahrzeuge auf MQB evo.", entries: mergedMqbEvoEntries }] : []),
  ...(mlbEvoSource ? [mlbEvoSource] : []),
];
const codingSources: PricedPlatformCodingSource[] = baseCodingSources.map((source) => ({ ...source, entries: pricePlatformSource(source) }));

export function vehicleSpecificCodings(
  vehicle: Vehicle,
  year: number,
  isSfd1: boolean,
  requiresProtectionReview: boolean
): UnifiedCodingEntry[] {
  // No self-service quote before the protection status of newer vehicles has been checked.
  if (requiresProtectionReview || needsProtectionReview(year) || !Number.isInteger(year) || year < vehicle.startYear || year > vehicle.endYear) return [];

  const ids = new Set(codingsForVehicle(vehicle));
  const vehicleCatalog = codingCatalog
    .filter((coding) => ids.has(coding.id))
    .filter((coding) => !coding.id.startsWith("mqbevo-") || vehicle.platform === "MQBevo")
    .filter((coding) => yearAllowed(coding.name, year))
    .filter((coding) => !isSmartphoneAidId(coding.id) || coding.id === smartphoneAidForVehicle(vehicle, year)?.id)
    .filter((coding) => !coding.id.startsWith("cockpit-design-") || coding.id === cockpitDesignForVehicle(vehicle, year)?.id)
    .filter((coding) => {
      if (!isSfd1 || coding.category !== "Assistenzsysteme") return true;
      if (coding.id === "mqbevo-lane-onstate" || coding.id === "mqbevo-adaptive-lane") return true;
      return !/(aktivier|freischalt|codier|parametrier)/i.test(coding.name);
    });

  const vehicleEntries: UnifiedCodingEntry[] = vehicleCatalog.map((coding) => ({
    id: `vehicle-${coding.id}`,
    name: coding.name,
    price: coding.price,
    uiGroup: coding.uiGroup as PlatformCodingGroup,
    hardware: coding.hardware,
    requirements: coding.requirements,
    interfaceInfo: coding.interfaceInfo,
    source: "vehicle" as const,
  }));
  const source = codingSources.find((item) => item.platform === vehicle.platform);
  if (!source) return curateCodingEntries(vehicleEntries.filter((entry) => yearAllowed(entry.name, year))).filter((entry) => yearAllowed(entry.name, year)).map((entry) => isSfd1 && !entry.sfd ? { ...entry, sfd: "Unklar" as const } : entry);
  // The Golf 8 source is not evidence that these newly added features work on
  // every MQB-evo vehicle. Only use that source for its reference model.
  const golf8Only = /aircare einstellung speichern|sitzheizung nach bestimmter zeit auf niedere stufe|umlufteinstellung speichern|lüfterstufen.*sanft|(?:ladedruckanzeige|drehmomentanzeige|motorleistung|getriebetemperaturanzeige).*aid/i;
  const platformEntries: UnifiedCodingEntry[] = source.entries
    .filter((entry) => entry.uiGroup !== "Assistenz" || !/(aktivier|freischalt|codier|parametrier)/i.test(entry.name))
    .filter((entry) => vehicle.platform !== "MQBevo" || !golf8Only.test(entry.name) || (vehicle.brand === "Volkswagen" && vehicle.model === "Golf 8 (CD)"))
    .filter((entry) => !cockpitDesignForVehicle(vehicle) || !isCockpitDesignName(entry.name))
    .filter((entry) => yearAllowed(entry.name, year))
    .filter((entry) => modelHintAllowed(entry.name, vehicle))
    // A platform reference may enrich an exact model offer, not invent new ones from broad keywords.
    .filter((entry) => vehicleCatalog.some((coding) => normalize(entry.name) === normalize(coding.name)) || (vehicle.brand === "Volkswagen" && vehicle.model === "Golf 8 (CD)" && golf8Only.test(entry.name)))
    .map((entry) => ({ id: entry.id, name: entry.name, price: entry.price, uiGroup: entry.uiGroup, hardware: entry.hardware, interfaceInfo: entry.interfaceInfo, sfd: entry.sfd, source: "platform" as const }));
  const byName = new Map<string, UnifiedCodingEntry>();
  for (const entry of [...vehicleEntries, ...platformEntries]) {
    const key = normalize(entry.name);
    const previous = byName.get(key);
    if (!previous) { byName.set(key, entry); continue; }
    const preferred = entry.source === "vehicle" ? entry : previous;
    const sfd = previous.sfd === "Ja" || entry.sfd === "Ja" ? "Ja" :
      previous.sfd === "Unklar" || entry.sfd === "Unklar" ? "Unklar" :
      previous.sfd === "Nein" || entry.sfd === "Nein" ? "Nein" : undefined;
    byName.set(key, { ...preferred, hardware: mergePrerequisites(previous.hardware, entry.hardware), requirements: mergePrerequisites(previous.requirements, entry.requirements), sfd });
  }
  return curateCodingEntries(Array.from(byName.values()).filter((entry) => yearAllowed(entry.name, year))).filter((entry) => yearAllowed(entry.name, year))
    .map((entry) => isSfd1 && !entry.sfd ? { ...entry, sfd: "Unklar" as const } : entry);
}

