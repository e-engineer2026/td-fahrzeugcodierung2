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
  hardware?: string;
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
  if (includesAny(n, ["hidden menu", "green menu", "developer mode", "fußraumbeleuchtung", "fussraumbeleuchtung", "einparkhilfe"])) return 25;

  // Schnelle Standardanpassungen wie auf der Hauptseite.
  if (includesAny(n, ["zeigertest", "needle sweep", "staging", "gurtwarner", "nachtankmenge", "auto-lock", "auto-unlock", "komfortblinken", "tränenwischen", "traenenwischen", "heckwischer", "ganganzeige", "öltemperatur", "oeltemperatur", "laptimer", "rundenzähler", "rundenzaehler", "coming home", "leaving home", "tagfahrlicht", "tfl", "heckleuchten", "rückleuchten", "komfortöffnung", "komfortoeffnung", "komfortschließ", "komfortschliess", "fenster per", "akustische quittierung", "hornquittierung", "startlogo", "tacho-darstellung", "verbrauchsanzeige"])) return 15;

  // Solide Standard-Codierung als neutraler Ausgangswert.
  return 25;
}

export function hardwareForPlatformCoding(name: string): string | undefined {
  const n = name.toLocaleLowerCase("de");

  if (includesAny(n, ["pacc", "prädiktive acc", "predictive acc", "travel assist", "emergency assist", "stauassistent"])) {
    return "ACC-/Frontradar, geeignete Frontkamera, kompatibles Fahrerassistenz-Steuergerät; bei prädiktiven Funktionen zusätzlich kompatibles Navigations-/Infotainmentsystem.";
  }
  if (includesAny(n, ["acc", "adaptive cruise", "front assist", "notbrems"])) {
    return "Kompatibler Frontradar-/Abstandssensor sowie passende Brems-, Motor- und Gateway-/Assistenzsteuergeräte.";
  }
  if (includesAny(n, ["lane assist", "spurhalte", "spurwechsel", "side assist", "totwinkel"])) {
    return "Geeignete Fahrerassistenz-Sensorik; für Lane/Spurhaltefunktionen Frontkamera und kompatible Lenk-/Assistenzsteuergeräte, für Side Assist passende Radarsensorik.";
  }
  if (includesAny(n, ["verkehrszeichen", "vze"])) {
    return "Geeignete Frontkamera sowie kompatibles Kombiinstrument/Infotainment; je nach System zusätzlich Navigationsdaten erforderlich.";
  }
  if (includesAny(n, ["dynamic light assist", "dynamischer lichtassistent", "matrix led", "matrix-licht", "matrix licht"])) {
    return "Frontkamera sowie DLA-/Matrix-fähige Scheinwerfer und passende Lichtsteuergeräte.";
  }
  if (includesAny(n, ["fernlichtassistent", "light assist", "hba"])) {
    return "Geeignete Frontkamera bzw. Fernlichtassistenz-Sensorik und kompatibles Bordnetz/Lichtsteuergerät.";
  }
  if (includesAny(n, ["surround view", "umfeldkamera", "area view"])) {
    return "Vorhandene Umfeldkameras, zugehöriges Kamerasteuergerät, Verkabelung und kompatibles Infotainment.";
  }
  if (includesAny(n, ["rückfahrkamera", "rear view", "back-up camera"])) {
    return "Vorhandene Rückfahrkamera, passende Verkabelung und kompatibles Infotainment/Kamerasteuergerät.";
  }
  if (includesAny(n, ["park assist", "einparkassistent", "parklenkassistent"])) {
    return "Passende Ultraschallsensoren, PDC/PLA-Steuergerät und kompatible elektrische Lenkhilfe.";
  }
  if (includesAny(n, ["anhängerrangierassistent", "trailer assist"])) {
    return "Kompatible Anhängevorrichtung/-elektronik, Rückfahrkamera und unterstützte Park-/Lenkassistenz-Hardware.";
  }
  if (includesAny(n, ["anhängerkupplung", "anhaengerkupplung", "gespannstabilisierung"])) {
    return "Anhängerkupplung mit kompatiblem Anhängersteuergerät, Verkabelung und Einbindung in Gateway/ABS/PDC je nach Fahrzeug.";
  }
  if (includesAny(n, ["regenschließen", "regenschliessen", "regensensor", "lichtsensor" ])) {
    return "Regen-/Lichtsensor und kompatibles Bordnetz-/Komfortsteuergerät erforderlich.";
  }
  if (includesAny(n, ["spiegelanklappen", "spiegel anklappen", "elektrisch anklappbare spiegel"])) {
    return "Elektrisch anklappbare Außenspiegel mit passenden Türsteuergeräten erforderlich.";
  }
  if (includesAny(n, ["bordsteinautomatik", "spiegelabsenkung"])) {
    return "Kompatibles Tür-/Spiegelsteuergerät; je nach Modell Spiegel-/Sitz-Memory-Hardware erforderlich.";
  }
  if (includesAny(n, ["ambientebeleuchtung", "fußraumbeleuchtung", "fussraumbeleuchtung", "innenlicht"])) {
    return "Entsprechende Leuchten/LED-Module und Verkabelung sowie kompatibles BCM/Infotainment müssen vorhanden sein.";
  }
  if (includesAny(n, ["elektrische heckklappe", "heckklappe (elektrisch)", "heckklappe per"])) {
    return "Elektrische Heckklappe mit Antrieben, Steuergerät(en) und passender Verkabelung erforderlich.";
  }
  if (includesAny(n, ["kessy", "keyless", "easy close", "easy open"])) {
    return "KESSY/Keyless-Hardware mit kompatiblem Zugangs-/Startsteuergerät; je nach Funktion Antennen und Türgriff-/Hecksensorik erforderlich.";
  }
  if (includesAny(n, ["reifendruckkontrolle", "tpms"])) {
    return "Je nach System kompatibles ABS/ESP für indirekte RDK oder RDK-Sensoren und RDK-Steuergerät/Antenne für direkte Messung.";
  }
  if (includesAny(n, ["auto hold", "autohold"])) {
    return "Elektronische Parkbremse/kompatible Bremsenelektronik; je nach Modell Auto-Hold-Taster bzw. entsprechende Bedieneinheit erforderlich.";
  }
  if (includesAny(n, ["dcc", "adaptive fahrwerk", "adaptives fahrwerk"])) {
    return "DCC/adaptives Fahrwerk mit kompatiblen Dämpfern, Sensorik und Fahrwerkssteuergerät erforderlich.";
  }
  if (includesAny(n, ["soundaktor"])) {
    return "Soundaktor/Aktuator und kompatibles Steuergerät müssen vorhanden sein.";
  }
  if (includesAny(n, ["sitzheizung"])) {
    return "Werkseitige bzw. vollständig nachgerüstete Sitzheizung mit kompatibler Klima-/Sitzsteuerung erforderlich.";
  }
  if (includesAny(n, ["scheinwerferreinigungsanlage"])) {
    return "Scheinwerferreinigungsanlage mit Pumpe/Ventilen und kompatibler Bordnetz-Ansteuerung erforderlich.";
  }
  if (includesAny(n, ["carplay", "android auto", "mirrorlink"])) {
    return "Kompatibles Infotainmentsystem und passende USB-/Smartphone-Schnittstelle; Funktionsfreigabe muss vom System unterstützt werden.";
  }
  if (includesAny(n, ["hud", "head-up"])) {
    return "Head-up-Display und zugehörige Anzeige-/Steuergeräte müssen verbaut sein.";
  }
  if (includesAny(n, ["sitzmemory", "sitz-memory", "memorysitz", "easy entry"])) {
    return "Elektrische Sitzverstellung mit kompatiblem Sitz-/Memory-Steuergerät erforderlich.";
  }

  return undefined;
}

export function pricePlatformSource(source: PlatformCodingSource): PricedPlatformCodingEntry[] {
  return source.entries.map((entry, index) => ({
    ...entry,
    id: `${source.id}-${index}`,
    price: priceForPlatformCoding(entry.name),
    uiGroup: groupForPlatformCoding(entry.name),
    hardware: hardwareForPlatformCoding(entry.name),
  }));
}
