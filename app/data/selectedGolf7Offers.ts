import type { Coding, Vehicle } from "./catalog8Base";

// Model-specific references reviewed on 2026-11-08. A matching model alone does
// not establish hardware compatibility; each offer includes the required check.
const sourceBase = "https://www.vag-coding.net/vw/golf-7-5g/";

// Manufacturer references establish model equipment, not coding compatibility.
// Each offer lists the hardware needed for the selected function.
const assistanceSource = "https://www.volkswagen-newsroom.com/en/golf-7-20122019-20035";
const camera = "Kompatible, korrekt eingebundene und kalibrierte Frontkamera sowie passende Lenkungs-/Assistenzsteuergeräte erforderlich.";
const radar = "Kompatibler, korrekt eingebundener und kalibrierter ACC-Radarsensor sowie passende Brems-, Motor- und Gateway-Steuergeräte erforderlich.";
const park = "Passende Parksensoren, kompatibles Parksteuergerät und Infotainment erforderlich; Park Assist benötigt zusätzliche seitliche Sensoren und eine unterstützte Lenkung.";

type AssistanceOffer = { key: string; match: RegExp; name: string; price: number; hardware: string };
const assistanceOffers: AssistanceOffer[] = [
  { key: "lane-activation", match: /(?:lane assist|spurhalteassistent).*(?:freischalt|aktivier)/i, name: "Lane Assist – Freischaltung", price: 65, hardware: camera },
  { key: "lane-settings", match: /(?:lane assist|spurhalteassistent).*(?:einstell|eingriff|warn|vibration|empfindlichkeit|speicher)/i, name: "Lane Assist – Einstellungen und letzte Einstellung anpassen", price: 20, hardware: `${camera} Lane Assist muss bereits funktionsfähig sein; Speicherfunktion und Eingriffsparameter nur bei unterstütztem Softwarestand.` },
  { key: "vze", match: /verkehrszeichen/i, name: "Verkehrszeichenerkennung freischalten", price: 55, hardware: "VZE-fähige Frontkamera, werksseitige Navigation mit Navigationsdaten und kompatible Anzeige erforderlich. Unterstützter Kamera-/Softwarestand und erforderliche SWaP/FEC-Freigaben notwendig; fehlende Lizenzen werden nicht durch Codierung ersetzt." },
  { key: "dla", match: /dynamic light assist|dynamisches fernlicht|dynamischer lichtassistent|\bdla\b/i, name: "Dynamisches Fernlicht / Dynamic Light Assist freischalten", price: 75, hardware: `${camera} DLA-fähige Scheinwerfer und Lichtsteuergeräte erforderlich. Einfache Light-Assist-Hardware genügt nicht.` },
  { key: "fla-memory", match: /(?:fernlichtassistent|light assist|hba).*(?:letzte|speicher|reset|memory)/i, name: "Fernlichtassistent – letzte Einstellung speichern", price: 20, hardware: "Bereits funktionsfähiger Light Assist und unterstützter Kamera-/Lichtsteuerungs-Softwarestand erforderlich." },
  { key: "fla", match: /fernlichtassistent|light assist|\bhba\b/i, name: "Fernlichtassistent freischalten", price: 55, hardware: "Geeignete Frontkamera oder Fernlichtsensorik, kompatible Lichtsteuerung und Lichtschalterkonfiguration erforderlich." },
  { key: "acc-settings", match: /acc.*(?:abstand|fahrprofil|schritt)/i, name: "ACC – Abstand und verfügbare Einstellungen anpassen", price: 20, hardware: `${radar} ACC muss bereits funktionsfähig sein; ausschließlich vom Steuergerät unterstützte Einstellungen.` },
  { key: "acc-activation", match: /^acc.*(?:freischalt|aktivier|nachrüst)/i, name: "ACC freischalten", price: 59, hardware: `${radar} Passende Bedienung und erforderliche Funktionsfreigabe notwendig. Hardware, Lizenzierung und Kalibrierung sind nicht im Codierpreis enthalten.` },
  { key: "front-assist", match: /front assist|city.notbrems/i, name: "Front Assist – Vorwarnung anpassen", price: 20, hardware: `${radar} Front Assist einschließlich City-Notbremsfunktion muss bereits funktionsfähig sein; keine pauschale Nachrüstung von Fußgängererkennung.` },
  { key: "side-assist", match: /side assist|blind.?spot|totwinkel/i, name: "Side Assist / Blind Spot – Aktivierung nach Nachrüstung", price: 55, hardware: "Kompatible Heckradarsensoren, Spiegel-Warnanzeigen, Verkabelung und passende Steuergeräte erforderlich. Korrekte Einbindung und gegebenenfalls Kalibrierung erforderlich." },
  { key: "rear-traffic", match: /ausparkassistent|rear traffic/i, name: "Ausparkassistent / Rear Traffic Alert aktivieren", price: 55, hardware: "Unterstützte Heckradarsensoren, kompatibles Brems-/Parksteuergerät und Infotainment erforderlich; Side-Assist-Hardware allein bestätigt die Funktion nicht." },
  { key: "park-assist", match: /park assist|parklenkassistent|einparkassistent/i, name: "Park Assist / Parklenkassistent freischalten", price: 55, hardware: park },
  { key: "pdc", match: /einparkhilfe/i, name: "Einparkhilfe – Anzeige und Aktivierung anpassen", price: 20, hardware: "Vorhandene funktionsfähige Parksensoren, kompatibles Parksteuergerät und Infotainment erforderlich; automatische Aktivierung abhängig vom Steuergerät." },
  { key: "rear-camera", match: /rückfahrkamera.*(?:freischalt|aktivier|nachrüst)/i, name: "Rückfahrkamera nach Nachrüstung freischalten", price: 45, hardware: "Installierte kompatible Rückfahrkamera mit Verkabelung und geeignetem Infotainment erforderlich; bei Highline-Systemen zusätzlich passendes Kamerasteuergerät und Kalibrierung." },
  { key: "tja", match: /traffic jam assist|stauassistent/i, name: "Traffic Jam Assist / Stauassistent freischalten (ab 2017)", price: 85, hardware: `${camera} ${radar} DSG, funktionsfähiger Lane Assist und ACC sowie ausdrücklich TJA-fähige Kamera-/Softwarekombination erforderlich.` },
  { key: "emergency", match: /emergency assist/i, name: "Emergency Assist freischalten (ab 2017)", price: 85, hardware: `${camera} ${radar} DSG und vollständige, Emergency-Assist-fähige Assistenzkonfiguration erforderlich; keine garantierte reine Codierfreischaltung.` },
  { key: "trailer", match: /trailer assist|anhängerrangierassistent/i, name: "Trailer Assist / Anhängerrangierassistent freischalten (ab 2017)", price: 55, hardware: `${park} Unterstützte Highline-Rückfahrkamera, Anhängerkupplung mit Anhängersteuergerät und passende Bedienung erforderlich; Unterstützte Software, passende Parametrierung und Kalibrierung erforderlich.` },
  { key: "manoeuvre-braking", match: /rangierbrems|manövrierbrems/i, name: "Rangierbremsfunktion aktivieren (ab 2017)", price: 55, hardware: "Ausdrücklich für Rangierbremsung geeignetes Parksteuergerät mit passenden Sensoren und kompatibler Bremssteuerung erforderlich; normale Einparkhilfe allein genügt nicht." },
  { key: "fatigue", match: /müdigkeit|driver alert/i, name: "Müdigkeitserkennung / Driver Alert aktivieren", price: 25, hardware: "Kompatibles Gateway, Kombiinstrument und unterstützte Auswertesoftware erforderlich; Unterstützung abhängig von Teilenummer und Softwarestand." },
  { key: "hill-start", match: /berganfahrassistent/i, name: "Berganfahrassistent anpassen", price: 25, hardware: "Bereits funktionsfähiger Berganfahrassistent und unterstützte ABS/ESC-Anpassung erforderlich." },
  { key: "auto-hold", match: /auto[ -]?hold/i, name: "Auto Hold anpassen", price: 20, hardware: "Elektronische Parkbremse, Auto-Hold-Taste und kompatible Bremssteuerung erforderlich; verfügbare Anpassungen softwareabhängig." },
];

export const selectedGolf7Offers: Coding[] = [
  ...assistanceOffers.map((offer): Coding => ({
    id: `golf7-selected-assist-${offer.key}`,
    name: offer.name, price: offer.price, hardware: offer.hardware,
    category: "Assistenzsysteme", uiGroup: "Assistenz",
    interfaceInfo: "VCDS / VCP",
    requirements: "Preis für die Codierung bei vorhandener kompatibler Hardware und unterstützter Software. Hardware, Funktionslizenzen sowie erforderliche Parametrierung und Kalibrierung sind nicht enthalten.",
    sourceUrl: assistanceSource,
  })),
  {
    id: "golf7-selected-second-phone",
    name: "Zweites Telefon per Bluetooth aktivieren",
    price: 25,
    category: "Standard-Codierungen",
    uiGroup: "Infotainment",
    hardware: "Kompatibles Discover-Infotainment mit Unterstützung für ein zweites Bluetooth-Telefon und passendes Kombiinstrument erforderlich. Teilenummer, Softwarestand und verfügbare Telefon-Anpassungen werden vor Auftrag geprüft.",
    interfaceInfo: "VCDS – nach Prüfung der Infotainment- und Kombiinstrument-Unterstützung",
    sourceUrl: `${sourceBase}golf-7-5g-activate-a-second-phone-via-bluetooth/`,
  },
  {
    id: "golf7-selected-camera-park-button",
    name: "Rückfahrkamera über Parktaste anzeigen",
    price: 25,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    hardware: "Bereits eingebaute und funktionsfähige Highline-Rückfahrkamera mit eigenem Steuergerät 6C, Parktaste und kompatiblem Infotainment erforderlich. Nicht für Lowline-Kameras; Teilenummer und Softwarestand werden vor Auftrag geprüft.",
    interfaceInfo: "VCDS – Anpassung einer vorhandenen Highline-Rückfahrkamera",
    sourceUrl: `${sourceBase}golf-7-5g-camera-display-with-parktronic-button/`,
  },
  {
    id: "golf7-selected-climate-fan-profiles",
    name: "Climatronic – Gebläseprofile freischalten",
    price: 19,
    category: "Standard-Codierungen",
    uiGroup: "Komfort",
    hardware: "Climatronic mit Unterstützung für Gebläseprofile und kompatibles Discover-Infotainment erforderlich. Funktionsumfang und verfügbare Klimamodi werden anhand von Steuergerät und Softwarestand vor Auftrag geprüft; keine Umrüstung einer manuellen Klimaanlage enthalten.",
    interfaceInfo: "VCDS – nach Prüfung von Climatronic und Infotainment",
    sourceUrl: `${sourceBase}golf-7-5g-activate-air-conditioning-fan-speed-profiles/`,
  },
  {
    id: "golf7-selected-driver-personalization",
    name: "Fahrer-Personalisierung aktivieren",
    price: 35,
    category: "Standard-Codierungen",
    uiGroup: "Komfort",
    hardware: "MIB2 sowie kompatible Bordnetz-, Kombiinstrument- und Klimasteuergeräte erforderlich. Unterstützte Benutzerprofile und speicherbare Einstellungen werden vor Auftrag geprüft; Vorgehen abhängig von Vor-Facelift/Facelift und Softwarestand. Sitzmemory nur bei bereits vorhandener kompatibler Hardware.",
    interfaceInfo: "VCDS – fahrzeugspezifische Einbindung mehrerer Steuergeräte",
    sourceUrl: `${sourceBase}golf-7-5g-activate-driver-profile-customization/`,
  },
];

export function selectedGolf7OffersForVehicle(vehicle: Pick<Vehicle, "brand" | "model" | "platform">): Coding[] {
  return vehicle.brand === "Volkswagen" && vehicle.model === "Golf 7 (5G)" && vehicle.platform === "MQB"
    ? selectedGolf7Offers
    : [];
}

export function isSelectedGolf7OfferId(id: string): boolean {
  return selectedGolf7Offers.some((offer) => id === offer.id || id === `vehicle-${offer.id}`);
}

// Identify overlapping platform references so the specific, hardware-checked
// offer appears once, with the same price on the model page and configurator.
export function selectedGolf7OfferKey(name: string): string | undefined {
  if (/zweites telefon/i.test(name)) return "second-phone";
  if (/rückfahrkamera.*parktaste/i.test(name)) return "camera-park-button";
  if (/gebläseprofile|lüfterstufen.*sanft.*mittel.*intensiv/i.test(name)) return "climate-fan-profiles";
  if (/personalisierung|fahrerprofile/i.test(name)) return "driver-personalization";
  const assist = assistanceOffers.find((offer) => offer.match.test(name));
  return assist ? `assist-${assist.key}` : undefined;
}
