import {
  codingCatalog as baseCodingCatalog,
  codingGroups,
  vehicles,
  brands,
  codingsForVehicle as baseCodingsForVehicle,
} from "./catalog7";
import type { Coding, CodingGroup, Platform, Vehicle } from "./catalog7";

export type { Coding, CodingGroup, Platform, Vehicle };
export { codingGroups, vehicles, brands };

const caddyCodings: Coding[] = [
  // Caddy III / IV (2K / SA)
  { id:"caddy-autolock", name:"Auto-Lock / Auto-Unlock anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", requirements:"Abhängig vom verbauten Komfort-/Bordnetzsteuergerät." },
  { id:"caddy-gurt", name:"Gurtwarner anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11" },
  { id:"caddy-zeigertest", name:"Zeigertest / Needle Sweep aktivieren", price:15, category:"Standard-Codierungen", uiGroup:"Infotainment", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem Kombiinstrument." },
  { id:"caddy-chlh", name:"Coming Home / Leaving Home anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Je nach Ausführung Regen-/Lichtsensor erforderlich." },
  { id:"caddy-komfortblinken", name:"Komfortblinken anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11" },
  { id:"caddy-abbiegelicht", name:"Abbiegelicht über Nebelscheinwerfer aktivieren", price:25, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Nebelscheinwerfer erforderlich." },
  { id:"caddy-tfl-nsw", name:"Tagfahrlicht über Nebelscheinwerfer anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Nebelscheinwerfer erforderlich." },
  { id:"caddy-tfl-menu", name:"Tagfahrlicht im Fahrzeugmenü aktivieren / anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem Kombiinstrument/Multifunktionsdisplay." },
  { id:"caddy-regenschliessen", name:"Regenschließen aktivieren", price:29, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Regen-/Lichtsensor und kompatibles Komfortsteuergerät erforderlich." },
  { id:"caddy-rueckfahrwischen", name:"Rückfahrwischen anpassen / deaktivieren", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Heckwischer erforderlich." },
  { id:"caddy-traenenwischen", name:"Tränenwischen Front / Heck anpassen", price:15, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11" },
  { id:"caddy-fussraum", name:"Fußraumbeleuchtung aktivieren / Dimmwert anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"VCDS / OBD11", hardware:"Vorhandene Fußraumbeleuchtung bzw. passende Verkabelung erforderlich." },
  { id:"caddy-sra", name:"Scheinwerferreinigungsanlage Intervall / Zeit anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Scheinwerferreinigungsanlage erforderlich." },
  { id:"caddy-akustik", name:"Akustische Quittierung beim Ver-/Entriegeln anpassen", price:19, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Abhängig von DWA/Hupe und Komfortsteuergerät." },
  { id:"caddy-xds", name:"XDS / elektronische Differenzialsperre anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Fahrdynamik", interfaceInfo:"VCDS / OBD11", requirements:"Nur bei unterstütztem ABS/ESC-Steuergerät." },
  { id:"caddy-sitzheizung", name:"Sitzheizung Verhalten / Speicherfunktion anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"VCDS / OBD11", hardware:"Werkseitige Sitzheizung erforderlich." },

  // Caddy V (SB) / MQB-evo / SFD1
  { id:"caddysb-autolock", name:"Auto-Lock / Auto-Unlock anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung und unterstützte Anpassungskanäle erforderlich." },
  { id:"caddysb-gurt", name:"Gurtwarner anpassen", price:25, category:"Standard-Codierungen", uiGroup:"Komfort", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung erforderlich." },
  { id:"caddysb-licht", name:"Tagfahrlicht / Dauerfahrlicht anpassen", price:29, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung und kompatibles Bordnetzsteuergerät erforderlich." },
  { id:"caddysb-chlh", name:"Coming Home / Leaving Home anpassen", price:29, category:"Standard-Codierungen", uiGroup:"Licht", interfaceInfo:"OBD11 oder VCDS nach SFD1-Freischaltung", requirements:"SFD1-Freischaltung; Funktionsumfang abhängig von Licht-/Sensor-Ausstattung." },
];

const reducedPriceByOriginal = new Map<number, number>([
  [15, 15],
  [19, 15],
  [25, 20],
  [29, 25],
  [35, 30],
  [39, 35],
  [49, 45],
  [59, 55],
  [69, 65],
  [79, 75],
  [89, 85],
]);

export const codingCatalog: Coding[] = [...baseCodingCatalog, ...caddyCodings].map((coding) => ({
  ...coding,
  price: reducedPriceByOriginal.get(coding.price) ?? coding.price,
}));

const caddy2kIds = caddyCodings.filter(c=>c.id.startsWith("caddy-")).map(c=>c.id);
const caddySbIds = caddyCodings.filter(c=>c.id.startsWith("caddysb-")).map(c=>c.id);

export function codingsForVehicle(vehicle: Vehicle): string[] {
  if (vehicle.brand === "Volkswagen" && vehicle.model === "Caddy III / IV (2K / SA)") {
    return ["diagnose", ...caddy2kIds];
  }
  if (vehicle.brand === "Volkswagen" && vehicle.model === "Caddy V (SB)") {
    return ["diagnose", ...caddySbIds];
  }
  return baseCodingsForVehicle(vehicle);
}
