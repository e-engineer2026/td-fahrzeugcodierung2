import {
  codingCatalog as baseCodingCatalog,
  codingGroups,
  vehicles as baseVehicles,
  brands,
  codingsForVehicle as baseCodingsForVehicle,
} from "./catalog7";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog7";

export type { Coding, CodingGroup, Platform, Vehicle };
export { codingGroups, brands };

const additionalVolkswagenVehicles: Vehicle[] = [
  {
    brand: "Volkswagen",
    model: "T-Cross C1",
    startYear: 2019,
    endYear: 2026,
    platform: "MQB",
    sourceUrl: "https://www.vag-coding.net/vw/t-cross-c1/",
  },
  {
    brand: "Volkswagen",
    model: "Taigo CS",
    startYear: 2021,
    endYear: 2026,
    platform: "MQB",
  },
];

export const vehicles: Vehicle[] = [
  ...baseVehicles.filter(
    (vehicle) =>
      !(
        vehicle.brand === "Volkswagen" &&
        (vehicle.model.startsWith("T-Cross") || vehicle.model.startsWith("Taigo"))
      )
  ),
  ...additionalVolkswagenVehicles,
];


const tCrossSource = "https://www.vag-coding.net/vw/t-cross-c1/";

const tCrossCodings: Coding[] = [
  { id:"tcross-thinkblue", name:"Think Blue Monitor im MIB2 aktivieren", price:20, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"MIB2 / Discover Media oder Discover Pro erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-acc-res", name:"ACC: RES-Taste zur Beschleunigung nutzen", price:25, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"ACC muss vorhanden sein.", sourceUrl:tCrossSource },
  { id:"tcross-tfl-auto", name:"Tagfahrlicht nur in Lichtschalter-Stellung AUTO", price:20, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", requirements:"Abhängig von Lichtschalter und Bordnetzsteuergerät.", sourceUrl:tCrossSource },
  { id:"tcross-fahrschule", name:"Fahrschulmodus im Infotainment aktivieren", price:25, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Kompatibles MIB2-Infotainment erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-hidden", name:"Hidden / Green Menu im Discover aktivieren", price:25, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Unterstütztes Discover-System erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-alarm-horn", name:"Innenraum-/Einbruchalarm über Hupe anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", requirements:"Abhängig von verbauter Alarm-/Komfortausstattung.", sourceUrl:tCrossSource },
  { id:"tcross-lane-memory", name:"Lane Assist – letzte Einstellung speichern", price:29, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"Lane Assist / Frontkamera muss vorhanden sein.", sourceUrl:tCrossSource },
  { id:"tcross-offroad", name:"Offroad-Anzeige im Discover aktivieren", price:25, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Discover Media/Pro mit Navigation erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-rvc", name:"Rückfahrkamera nach Nachrüstung aktivieren", price:49, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"Rückfahrkamera, Verkabelung und kompatibles Infotainment erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-window-ignoff", name:"Fensterbedienung bei ausgeschalteter Zündung freigeben", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-wiper-service", name:"Wischer-Serviceposition im Infotainment aktivieren", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-tfl-menu", name:"Tagfahrlicht im Infotainment aktivieren / deaktivieren", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-interior-fade", name:"Innenraumbeleuchtung weich ein-/ausblenden", price:20, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei kompatibler Innenraumbeleuchtung.", sourceUrl:tCrossSource },
  { id:"tcross-dsg-unlock-p", name:"Automatisches Entriegeln bei DSG-Wählhebel in P", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"DSG erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-kessy-autolock", name:"KESSY – automatisches Verriegeln beim Entfernen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"KESSY / Keyless Access erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-brakedry", name:"Bremsscheibentrocknung anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Fahrdynamik", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem ABS/ESC-Steuergerät.", sourceUrl:tCrossSource },
  { id:"tcross-vc-display", name:"Virtual Cockpit Darstellung anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Active Info Display / Virtual Cockpit erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-comfortblink", name:"Komfortblinken Anzahl Blinkzyklen anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-compass", name:"Kompassanzeige im Kombiinstrument aktivieren", price:20, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Navigation/GPS und kompatibles Kombiinstrument erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-consumption", name:"Verbrauchsanzeige im Bordcomputer korrigieren", price:20, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-rearwiper", name:"Heckwischer bei Rückwärtsfahrt deaktivieren / anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Heckwischer erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-pdc-beep", name:"Aktivierungston der Einparkhilfe anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"PDC / Parkhilfe erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-lock-confirm", name:"Akustische Quittierung beim Ver-/Entriegeln anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", requirements:"Abhängig von DWA/Hupe und Komfortsteuergerät.", sourceUrl:tCrossSource },
  { id:"tcross-startbutton", name:"Startknopf Puls-/Heartbeat-Effekt aktivieren", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Keyless-Start / Startknopf erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-clima-fan", name:"Climatronic Gebläsestufe im Auto-Modus anzeigen", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Climatronic erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-hillhold", name:"Berganfahrassistent anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Fahrdynamik", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem ABS/ESC-Steuergerät.", sourceUrl:tCrossSource },
  { id:"tcross-pedal", name:"Gaspedalkennlinie / Ansprechverhalten anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Fahrdynamik", interfaceInfo:"VCDS / OBD11", requirements:"Nur sofern die Anpassung im Motor-/Antriebssteuergerät unterstützt wird.", sourceUrl:tCrossSource },
  { id:"tcross-key-ign", name:"Verriegelung per Schlüssel bei eingeschalteter Zündung erlauben", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-lane-activate", name:"Lane Assist / Spurhalteassistent aktivieren", price:49, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"Geeignete 2Q0-/3Q0-Frontkamera und kompatible Assistenzhardware erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-lane-settings", name:"Lane Assist – Warnung, Lenkeingriff und Vibration anpassen", price:29, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"Lane Assist muss vorhanden sein.", sourceUrl:tCrossSource },
  { id:"tcross-laptimer", name:"Laptimer / Rundenzähler aktivieren", price:19, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Kompatibles Kombiinstrument / Virtual Cockpit erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-fla", name:"Fernlichtassistent / Light Assist aktivieren", price:59, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"Geeignete 2Q0-/3Q0-Frontkamera und kompatible Lichtsteuerung erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-fla-memory", name:"Light Assist – letzte Einstellung speichern", price:29, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"Light Assist muss vorhanden sein.", sourceUrl:tCrossSource },
  { id:"tcross-seatheat-memory", name:"Sitzheizung – letzte Stufe speichern", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Werkseitige Sitzheizung erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-mic", name:"Mikrofonempfindlichkeit der Freisprecheinrichtung anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Freisprecheinrichtung / Mikrofon erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-mirrorfold", name:"Spiegelanklappen per Fernbedienung anpassen", price:29, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Elektrisch anklappbare Außenspiegel erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-steering", name:"Lenkungskennlinie / Lenkunterstützung anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Fahrdynamik", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem Lenkungssteuergerät.", sourceUrl:tCrossSource },
  { id:"tcross-ice", name:"Eiswarnung Außentemperatur-Schwelle anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-staging", name:"Kombiinstrument Zeigertest aktivieren", price:15, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Unterstütztes Kombiinstrument / Virtual Cockpit erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-oiltemp", name:"Öltemperaturanzeige im Bordcomputer aktivieren", price:19, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Kompatibles Kombiinstrument erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-park-speed", name:"Abschaltgeschwindigkeit für PDC / Rückfahrkamera anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"PDC und/oder Rückfahrkamera erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-rearlights-drl", name:"Heckleuchten zusammen mit Tagfahrlicht aktivieren", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-refuel", name:"Nachtankmenge im Bordcomputer anzeigen", price:15, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", hardware:"Kompatibles Kombiinstrument erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-battery", name:"Neue Batterie anlernen / Batteriedaten anpassen", price:29, category:"Standard-Codierungen", uiGroup:"Diagnose", interfaceInfo:"VCDS / OBD11", hardware:"Batteriemanagement abhängig von Fahrzeugausstattung.", sourceUrl:tCrossSource },
  { id:"tcross-mirror-light", name:"Außenbeleuchtung bei angeklappten Spiegeln beibehalten", price:20, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Elektrisch anklappbare Spiegel und entsprechende Umfeld-/Spiegelleuchten erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-acc-1kmh", name:"ACC Bedienung in 1-km/h-Schritten anpassen", price:25, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"ACC erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-vze", name:"Verkehrszeichenerkennung / Sign Assist aktivieren", price:59, category:"Assistenzsysteme", uiGroup:"Assistenz", interfaceInfo:"VCDS / OBD11", hardware:"Geeignete Frontkamera sowie kompatibles Kombiinstrument/Infotainment erforderlich.", sourceUrl:tCrossSource },
  { id:"tcross-startstop", name:"Start-Stopp deaktivieren / Verhalten anpassen", price:29, category:"Standard-Codierungen", uiGroup:"Fahrdynamik", interfaceInfo:"VCDS / OBD11", requirements:"Nur soweit Steuergerät und Softwarestand die Anpassung unterstützen.", sourceUrl:tCrossSource },
  { id:"tcross-tearwipe", name:"Tränenwischen / Nachwischen anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", sourceUrl:tCrossSource },
  { id:"tcross-windows-lock", name:"Fenster beim Verriegeln automatisch schließen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", requirements:"Abhängig von Türsteuergeräten und Komfortfunktion.", sourceUrl:tCrossSource },
];

const caddyCodings: Coding[] = [
  // Caddy III / IV (2K / SA)
  { id:"caddy-autolock", name:"Auto-Lock / Auto-Unlock anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", requirements:"Abhängig vom verbauten Komfort-/Bordnetzsteuergerät." },
  { id:"caddy-gurt", name:"Gurtwarner anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11" },
  { id:"caddy-zeigertest", name:"Zeigertest", price:15, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem Kombiinstrument." },
  { id:"caddy-chlh", name:"Coming Home / Leaving Home anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Je nach Ausführung Regen-/Lichtsensor erforderlich." },
  { id:"caddy-komfortblinken", name:"Komfortblinken anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11" },
  { id:"caddy-abbiegelicht", name:"Abbiegelicht über Nebelscheinwerfer aktivieren", price:25, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Nebelscheinwerfer erforderlich." },
  { id:"caddy-tfl-nsw", name:"Tagfahrlicht über Nebelscheinwerfer anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Nebelscheinwerfer erforderlich." },
  { id:"caddy-tfl-menu", name:"Tagfahrlicht im Fahrzeugmenü aktivieren / anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem Kombiinstrument/Multifunktionsdisplay." },
  { id:"caddy-regenschliessen", name:"Regenschließen aktivieren", price:29, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Regen-/Lichtsensor und kompatibles Komfortsteuergerät erforderlich." },
  { id:"caddy-rueckfahrwischen", name:"Rückfahrwischen anpassen / deaktivieren", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Heckwischer erforderlich." },
  { id:"caddy-traenenwischen", name:"Tränenwischen Front / Heck anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11" },
  { id:"caddy-fussraum", name:"Fußraumbeleuchtung aktivieren / Dimmwert anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Vorhandene Fußraumbeleuchtung bzw. passende Verkabelung erforderlich." },
  { id:"caddy-sra", name:"Scheinwerferreinigungsanlage Intervall / Zeit anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Scheinwerferreinigungsanlage erforderlich." },
  { id:"caddy-akustik", name:"Akustische Quittierung beim Ver-/Entriegeln anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Abhängig von DWA/Hupe und Komfortsteuergerät." },
  { id:"caddy-xds", name:"XDS / elektronische Differenzialsperre anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Fahrdynamik", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem ABS/ESC-Steuergerät." },
  { id:"caddy-sitzheizung", name:"Sitzheizung Verhalten / Speicherfunktion anpassen", price:20, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Werkseitige Sitzheizung erforderlich." },

  // Caddy V (SB) / MQB-evo / SFD1
  { id:"caddysb-autolock", name:"Auto-Lock / Auto-Unlock anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung und unterstützte Anpassungskanäle erforderlich." },
  { id:"caddysb-gurt", name:"Gurtwarner anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung erforderlich." },
  { id:"caddysb-licht", name:"Tagfahrlicht / Dauerfahrlicht anpassen", price:29, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung und kompatibles Bordnetzsteuergerät erforderlich." },
  { id:"caddysb-chlh", name:"Coming Home / Leaving Home anpassen", price:29, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung; Funktionsumfang abhängig von Licht-/Sensor-Ausstattung." },
];

const reducedPriceByOriginal = new Map<number, number>([
  [15, 15],
  [19, 15],
  [25, 25],
  [29, 25],
  [35, 30],
  [39, 35],
  [49, 45],
  [59, 55],
  [69, 65],
  [79, 75],
  [89, 85],
]);

const lowerEffort25Terms = [
  "hidden menu",
  "green menu",
  "developer mode",
  "fußraumbeleuchtung",
  "fussraumbeleuchtung",
  "sitzheizung",
  "reifendruckkontrolle",
  "soundaktor",
  "xds",
  "esc sport",
  "lenkungskennlinie",
  "bremsscheibentrocknung",
  "scheinwerferreinigungsanlage",
  "ambientebeleuchtung",
  "easy entry",
  "offroad-anzeige",
  "fahrschulmodus",
  "einparkhilfe",
];

function adjustedPrice(coding: Coding): number {
  const reduced = reducedPriceByOriginal.get(coding.price) ?? coding.price;
  if (reduced !== 25) return reduced;
  const name = coding.name.toLocaleLowerCase("de");
  return lowerEffort25Terms.some((term) => name.includes(term)) ? 20 : 25;
}

function compactCodingName(name: string): string {
  const normalized = name.toLocaleLowerCase("de");
  if (normalized.includes("zeigertest") || normalized.includes("needle sweep") || normalized.includes("staging")) {
    return "Kombiinstrument Zeigertest aktivieren";
  }
  return name;
}

export const codingCatalog: Coding[] = [...baseCodingCatalog, ...tCrossCodings, ...caddyCodings].map((coding) => ({
  ...coding,
  name: compactCodingName(coding.name),
  price: adjustedPrice(coding),
}));

const tCrossIds = tCrossCodings.map((coding) => coding.id);
const caddy2kIds = caddyCodings.filter(c=>c.id.startsWith("caddy-")).map(c=>c.id);
const caddySbIds = caddyCodings.filter(c=>c.id.startsWith("caddysb-")).map(c=>c.id);

export function codingsForVehicle(vehicle: Vehicle): string[] {
  if (vehicle.brand === "Volkswagen" && vehicle.model === "T-Cross C1") {
    return ["diagnose", ...tCrossIds];
  }
  if (vehicle.brand === "Volkswagen" && vehicle.model === "Caddy III / IV (2K / SA)") {
    return ["diagnose", ...caddy2kIds];
  }
  if (vehicle.brand === "Volkswagen" && vehicle.model === "Caddy V (SB)") {
    return ["diagnose", ...caddySbIds];
  }
  return baseCodingsForVehicle(vehicle);
}
