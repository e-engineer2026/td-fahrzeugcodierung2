import type { Coding, Vehicle } from "./catalog8Base";

// Model-specific practitioner procedures reviewed on 2026-10-26.
// These are conditional coding offers, not a hardware/firmware compatibility guarantee.
const rules = [
  { brand: "Škoda", model: "Octavia 3 5E Facelift", from: 2018, id: "cockpit-design-19", name: "Virtual Cockpit – Tacho-Design anpassen", sourceUrl: "https://www.cargrade.at/codierungsliste-skoda-octavia-iii-5e/", note: "Facelift mit kompatiblem Virtual Cockpit; vorhandene Skins nach Prüfung, keine Garantie einer bestimmten RS-Ansicht." },
  { brand: "Volkswagen", model: "Golf 7 (5G)", from: 2017, id: "cockpit-design-1", name: "GTI-/R-Tacho-Design", sourceUrl: "https://www.vag-coding.net/vw/golf-7-5g/golf-7-5-5g-facelift-meter-display-on-virtual-cockpit/", note: "Golf 7 Facelift mit Active Info Display." },
  { brand: "Volkswagen", model: "Golf 8 (CD)", from: 2019, id: "cockpit-design-2", name: "GTI-/R-Tacho-Ansichten", sourceUrl: "https://www.vag-coding.net/vw/golf-8-5h/golf-8-5h-changing-the-virtual-cockpit-display/", note: "Digital Cockpit Pro mit unterstützten zusätzlichen Ansichten; bis 2023." },
  { brand: "Volkswagen", model: "Polo AW", from: 2017, id: "cockpit-design-3", name: "GTI-/R-Tacho-Design", sourceUrl: "https://www.vag-coding.net/vw/polo-6-aw1/polo-6-aw1-changing-the-virtual-cockpit-display/", note: "Active Info Display / Digital Cockpit Pro (AID v2)." },
  { brand: "Volkswagen", model: "Tiguan II (AD/BW)", from: 2016, id: "cockpit-design-4", name: "R-Tacho-Design", sourceUrl: "https://www.vag-coding.net/vw/tiguan-2-ad1/tiguan-2-ad1-changing-the-virtual-cockpit-display/", note: "Unterstütztes Active Info Display; Design abhängig von AID-Generation." },
  { brand: "Volkswagen", model: "T-Roc A11", from: 2017, id: "cockpit-design-5", name: "Digital-Cockpit-Design anpassen", sourceUrl: "https://www.vag-coding.net/vw/t-roc-a1/t-roc-a1-changing-the-virtual-cockpit-display/", note: "Active Info Display v2; verfügbare Zifferblattvarianten nach Vorprüfung." },
  { brand: "Volkswagen", model: "Arteon 3H", from: 2017, id: "cockpit-design-6", name: "Digital-Cockpit-Design anpassen", sourceUrl: "https://www.vag-coding.net/vw/arteon-3h/arteon-3h-changing-the-virtual-cockpit-display/", note: "Active Info Display v2; verfügbare Zifferblattvarianten nach Vorprüfung." },
  { brand: "Volkswagen", model: "Passat B8 (3G)", from: 2019, id: "cockpit-design-7", name: "Digital-Cockpit-Design anpassen", sourceUrl: "https://www.vag-coding.net/vw/passat-b8/passat-b8-facelift-changing-the-virtual-cockpit-display/", note: "Nur Facelift mit Active Info Display v2." },
  { brand: "Volkswagen", model: "T-Cross C1", from: 2019, id: "cockpit-design-8", name: "Digital-Cockpit-Design anpassen", sourceUrl: "https://www.vag-coding.net/vw/t-cross-c1/t-cross-c1-changing-the-virtual-cockpit-display/", note: "Active Info Display v2 / Digital Cockpit Pro; verfügbare Zifferblattvarianten nach Vorprüfung." },
  { brand: "Audi", model: "A3 / S3 8Y", from: 2020, id: "cockpit-design-9", name: "Virtual Cockpit – zusätzliche Sportansichten", sourceUrl: "https://www.vag-coding.net/audi/a3-8y/a3-8y-change-virtual-cockpit-display/", note: "Kompatibles Virtual Cockpit mit zusätzlichen Ansichten; kein pauschales RS-Layout-Versprechen; bis 2023." },
  { brand: "Audi", model: "A4 / S4 B9", from: 2015, id: "cockpit-design-10", name: "Virtual Cockpit – S-/RS-Skalenoptik", sourceUrl: "https://www.vag-coding.net/audi/a4-b9/a4-b9-meter-display-on-virtual-cockpit/", note: "Virtual Cockpit; passende Fahrzeugvariante nach Prüfung. Keine Freischaltung eines gesperrten zentralen Sportlayouts enthalten." },
  { brand: "Audi", model: "A5 / S5 F5", from: 2016, id: "cockpit-design-11", name: "Virtual Cockpit – S-/RS-Skalenoptik", sourceUrl: "https://www.vag-coding.net/audi/a5-f5/a5-f5-meter-display-on-virtual-cockpit/", note: "Virtual Cockpit; passende Fahrzeugvariante nach Prüfung. Keine Freischaltung eines gesperrten zentralen Sportlayouts enthalten." },
  { brand: "Audi", model: "Q5 FY", from: 2017, id: "cockpit-design-12", name: "Virtual Cockpit – SQ5-Skalenoptik", sourceUrl: "https://www.vag-coding.net/audi/q5-fy/q5-fy-meter-display-on-virtual-cockpit/", note: "Virtual Cockpit; SQ5-Variante nach Prüfung. Keine Freischaltung eines gesperrten zentralen Sportlayouts enthalten." },
  { brand: "SEAT / CUPRA", model: "SEAT Leon 5F", from: 2018, id: "cockpit-design-13", name: "Digital Cockpit – CUPRA-Design", sourceUrl: "https://www.vag-coding.net/seat-cupra/leon-5f/leon-5f-facelift-changing-the-virtual-cockpit-display/", note: "Digital Cockpit im Facelift; CUPRA-Bronze je Software. Zusätzliche Sportansicht nur bei unterstützten Instrumenten ab Ende 2018." },
  { brand: "SEAT / CUPRA", model: "SEAT Ateca KH7", from: 2018, id: "cockpit-design-14", name: "Digital Cockpit – CUPRA-Design", sourceUrl: "https://www.vag-coding.net/seat-cupra/ateca-5f/ateca-5f-changing-the-virtual-cockpit-display/", note: "Digital Cockpit; CUPRA-Bronze je Software. Zusätzliche Sportansicht nur bei unterstützten Instrumenten ab Ende 2018." },
  { brand: "SEAT / CUPRA", model: "CUPRA Ateca KH7", from: 2018, id: "cockpit-design-15", name: "Digital Cockpit – CUPRA-Design anpassen", sourceUrl: "https://www.vag-coding.net/seat-cupra/ateca-5f/ateca-5f-changing-the-virtual-cockpit-display/", note: "Digital Cockpit; nur abweichende, noch nicht vorhandene Wunschansichten nach Vorprüfung." },
  { brand: "Škoda", model: "Octavia 4 NX", from: 2020, id: "cockpit-design-16", name: "Virtual Cockpit – vRS-Ansichten", sourceUrl: "https://www.vag-coding.net/skoda/octavia-4-nx/octavia-4-nx-modifying-the-vrs-display-in-the-virtual-cockpit/", note: "Kompatibles Virtual Cockpit mit freischaltbaren Ansichten; bis 2023." },
  { brand: "Škoda", model: "Superb 3V", from: 2019, id: "cockpit-design-17", name: "Virtual Cockpit – vRS-Design", sourceUrl: "https://www.vag-coding.net/skoda/superb-3v/superb-3v-facelift-virtual-cockpit-vrs-display/", note: "Facelift mit kompatiblem Virtual Cockpit." },
  { brand: "Škoda", model: "Kodiaq NS", from: 2018, id: "cockpit-design-18", name: "Virtual Cockpit – vRS-Design", sourceUrl: "https://www.vag-coding.net/skoda/kodiaq-ns/kodiaq-ns-virtual-cockpit-vrs-display/", note: "Kompatibles Virtual Cockpit erforderlich." },
];

export const cockpitDesignCodings: Coding[] = rules.map((rule) => ({
  id: rule.id, name: rule.name, price: 35, category: "Standard-Codierungen", uiGroup: "Infotainment",
  interfaceInfo: "VCDS – nach Prüfung des Kombiinstruments", sourceUrl: rule.sourceUrl,
  hardware: rule.note + " Originales digitales Kombiinstrument erforderlich. Verfügbare Designs hängen von Teilenummer und Softwarestand ab; Prüfung vor Auftrag. Keine Nachrüstung, Firmware-Updates oder Lizenzfreischaltung enthalten. SFD2 ausgeschlossen.",
}));

export function cockpitDesignForVehicle(vehicle: Pick<Vehicle, "brand" | "model">, year?: number) {
  const rule = rules.find((r) => r.brand === vehicle.brand && r.model === vehicle.model);
  if (!rule || (year !== undefined && (year < rule.from || year > 2023))) return undefined;
  return cockpitDesignCodings.find((coding) => coding.id === rule.id);
}

export function isCockpitDesignName(name: string) {
  return /(?:tacho.*(?:design|darstellung)|skin der multifunktionsanzeige|(?:virtual|digital) cockpit.*(?:darstellung|design|layout|sportansicht|skalenoptik)|(?:gti|vrs|rs|cupra).*(?:tacho|layout))/i.test(name);
}
