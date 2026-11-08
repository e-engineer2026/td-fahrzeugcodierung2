import type { Coding, Vehicle } from "./catalog8Base";

// Model-specific references reviewed on 2026-11-08. A matching model alone does
// not establish hardware compatibility; each offer includes the required check.
const sourceBase = "https://www.vag-coding.net/vw/golf-7-5g/";

export const selectedGolf7Offers: Coding[] = [
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
  return undefined;
}
