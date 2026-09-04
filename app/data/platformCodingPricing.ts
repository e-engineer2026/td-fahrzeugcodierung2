import type { PlatformCodingEntry, PlatformCodingSource } from "./platformCodingLists";

export type PlatformCodingGroup =
  | "Komfort"
  | "Licht"
  | "Infotainment"
  | "Assistenz"
  | "Fahrdynamik"
  | "Diagnose";

export type PricedPlatformCodingEntry = PlatformCodingEntry & {
  id: string;
  price: number;
  uiGroup: PlatformCodingGroup;
};

export const platformCodingGroups: PlatformCodingGroup[] = [
  "Komfort",
  "Licht",
  "Infotainment",
  "Assistenz",
  "Fahrdynamik",
  "Diagnose",
];

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function groupForPlatformCoding(name: string): PlatformCodingGroup {
  const n = name.toLocaleLowerCase("de");

  if (
    includesAny(n, [
      "acc",
      "adaptive cruise",
      "lane assist",
      "spurhalte",
      "spurwechsel",
      "side assist",
      "totwinkel",
      "front assist",
      "travel assist",
      "emergency assist",
      "stauassistent",
      "verkehrszeichen",
      "vze",
      "fernlichtassistent",
      "light assist",
      "dynamic light assist",
      "dynamischer lichtassistent",
      "park assist",
      "einparkassistent",
      "rückfahrkamera",
      "rear view",
      "umfeldkamera",
      "surround view",
      "notbrems",
      "prädiktiv",
      "predictive",
      "pacc",
    ])
  ) {
    return "Assistenz";
  }

  if (
    includesAny(n, [
      "tagfahrlicht",
      "tfl",
      "rückleucht",
      "heckleucht",
      "scheinwerfer",
      "coming home",
      "leaving home",
      "nebelscheinwerfer",
      "abbiegelicht",
      "parklicht",
      "standlicht",
      "ambient",
      "fußraum",
      "fussraum",
      "innenlicht",
      "lichtfunktion",
      "leuchte",
    ]) || /\blicht\b/.test(n)
  ) {
    return "Licht";
  }

  if (
    includesAny(n, [
      "mmi",
      "infotainment",
      "carplay",
      "android auto",
      "mirrorlink",
      "virtual cockpit",
      "kombiinstrument",
      "display",
      "tacho",
      "startlogo",
      "welcome sound",
      "developer mode",
      "green menu",
      "hidden menu",
      "radio",
      "navigation",
      "bluetooth",
      "sprachbedienung",
      "telefon",
      "media",
      "audio",
    ])
  ) {
    return "Infotainment";
  }

  if (
    includesAny(n, [
      "xds",
      "esc",
      "esp",
      "asr",
      "differential",
      "lenkung",
      "drive select",
      "fahrprofil",
      "fahrdynamik",
      "start-stopp",
      "start/stop",
      "soundaktor",
      "gaspedal",
      "pedalkennlinie",
      "launch control",
      "berganfahr",
      "auto hold",
      "hill hold",
      "bremsscheibentrocknung",
    ])
  ) {
    return "Fahrdynamik";
  }

  if (
    includesAny(n, [
      "diagnose",
      "fehlerspeicher",
      "grundeinstellung",
      "kalibrier",
      "batterie anlernen",
      "batterie nach",
      "serviceintervall",
      "service reset",
    ])
  ) {
    return "Diagnose";
  }

  return "Komfort";
}

export function priceForPlatformCoding(name: string): number {
  const n = name.toLocaleLowerCase("de");

  // Sehr hoher Aufwand / mehrere Steuergeräte oder aufwendige Assistenzfunktion.
  if (includesAny(n, ["pacc", "prädiktive acc", "predictive acc", "travel assist", "emergency assist", "stauassistent"])) return 85;
  if (includesAny(n, ["dynamic light assist", "dynamischer lichtassistent", "matrix led", "matrix-licht", "matrix licht"])) return 75;

  // Hoher Aufwand / Assistenz-Freischaltungen.
  if ((n.includes("acc") && includesAny(n, ["aktivieren", "freischalten", "nachrüstung"])) ||
      (n.includes("lane assist") && includesAny(n, ["aktivieren", "freischalten", "nachrüstung"])) ||
      n.includes("spurhalteassistent aktivieren")) return 65;
  if (includesAny(n, ["verkehrszeichenerkennung", "fernlichtassistent", "light assist", "park assist", "einparkassistent", "surround view", "umfeldkamera"])) return 55;

  // Parametrierung, Kalibrierung oder Nachrüst-Codierung sind aufwendiger als reine Anpassungen.
  if (includesAny(n, ["parametrier", "kalibrier", "datensatz", "nachrüstung", "nachruestung"])) return 55;
  if (includesAny(n, ["rückfahrkamera", "rear view", "anhängerkupplung", "anhaengerkupplung"])) return 45;
  if (includesAny(n, ["wireless carplay", "carplay", "android auto", "mirrorlink"]) && includesAny(n, ["aktivieren", "freischalten"])) return 45;

  // Mittlerer Aufwand / mehrere Anpassungen oder spezielle Funktionsfreischaltung.
  if (includesAny(n, ["drive select", "fahrprofilauswahl", "effizienzassistent", "optische anzeige der einparkhilfe"])) return 35;
  if (includesAny(n, ["elektrische heckklappe", "heckklappe per", "ambientebeleuchtung plus"])) return 30;
  if (includesAny(n, ["start-stopp", "start/stop", "regenschließen", "regenschliessen", "sitzheizung", "reifendruckkontrolle", "soundaktor", "xds", "esc sport", "lenkungskennlinie", "berganfahrassistent", "bremsscheibentrocknung", "spiegelanklappen", "spiegel anklappen", "bordsteinautomatik", "spiegelabsenkung", "scheinwerferreinigungsanlage"])) return 25;
  if (includesAny(n, ["hidden menu", "green menu", "developer mode", "fußraumbeleuchtung", "fussraumbeleuchtung", "einparkhilfe"])) return 20;

  // Schnelle Standardanpassungen wie auf der Hauptseite.
  if (includesAny(n, ["zeigertest", "needle sweep", "staging", "gurtwarner", "nachtankmenge", "auto-lock", "auto-unlock", "komfortblinken", "tränenwischen", "traenenwischen", "heckwischer", "ganganzeige", "öltemperatur", "oeltemperatur", "laptimer", "rundenzähler", "rundenzaehler", "coming home", "leaving home", "tagfahrlicht", "tfl", "heckleuchten", "rückleuchten", "komfortöffnung", "komfortoeffnung", "komfortschließ", "komfortschliess", "fenster per", "akustische quittierung", "hornquittierung", "startlogo", "tacho-darstellung", "verbrauchsanzeige"])) return 15;

  // Solide Standard-Codierung als neutraler Ausgangswert.
  return 20;
}

export function pricePlatformSource(source: PlatformCodingSource): PricedPlatformCodingEntry[] {
  return source.entries.map((entry, index) => ({
    ...entry,
    id: `${source.id}-${index}`,
    price: priceForPlatformCoding(entry.name),
    uiGroup: groupForPlatformCoding(entry.name),
  }));
}
