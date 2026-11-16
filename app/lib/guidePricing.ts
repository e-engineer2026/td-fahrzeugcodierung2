import type { Coding } from "../data/catalog";

// PDF-Einzelpreise, nicht die Preise für eine Fahrzeugcodierung vor Ort.
// Die Einstufung ist eine Vorschau nach typischem Dokumentationsaufwand;
// vor Veröffentlichung kann jede fahrzeugspezifische Anleitung geprüft werden.
export const guidePriceTiers = [5.99, 7.99, 9.99, 11.99, 13.99, 15.99, 17.99, 19.99] as const;

type GuideCoding = Pick<Coding, "name" | "category" | "uiGroup">;

function isAssistance(coding: GuideCoding) {
  return coding.category === "Assistenzsysteme" || coding.uiGroup === "Assistenz";
}

export function guideEffortStep(coding: GuideCoding): number {
  const name = coding.name;

  // Umfangreiche Umbauten, Softwarearbeiten oder Anlernen mehrerer Komponenten.
  if (/umbau|umrüst|steuergeräte?tausch|steuergeraetetausch|kombiinstrument.*tausch|tacho.*tausch|wegfahrsperre|(^|\W)immo\d*|flash|firmware|softwareupdate|kalibrier|parametrier|SWaP|FEC/i.test(name)) return 7;

  // Nachrüstung einschließlich Einbindung vorhandener Systeme.
  if (/nachrüst|nachruest|retrofit/i.test(name)) return 6;

  // Neue Assistenzfunktionen: typischerweise mehrere Bedingungen und Steuergeräte.
  if (isAssistance(coding)) {
    if (/anpass|einstell|speicher|memory|warnung|vibration|toleranz|geschwindigkeit|abstand/i.test(name)) return 4;
    return 5;
  }

  // Komplexere Infotainment- und Anzeigeaktivierungen.
  if (/carplay|android auto|ambientebeleuchtung|multicolor|rückfahrkamera|kamera.*aktivier|mib|infotainment.*freischalt|navigation.*(display|cockpit)|active info display|digital cockpit|virtual cockpit/i.test(name)) return 4;

  // Kombinationen mehrerer Funktionen bzw. erweiterte Lichtsteuerung.
  if (/lichtanimation|lichtinszenierung|matrix|dynamisch|heckleuchten.*tagfahrlicht|tagfahrlicht.*heckleuchten|zusammen mit|coming.*leaving/i.test(name)) return 3;

  // Komfortfunktionen mit mehreren Voraussetzungen oder Anpassungen.
  if (/spiegelabsenkung|spiegelanklappen|regenschließ|regenschliess|coming.home|leaving.home|komfortöffn|komfortschließ|komfortschliess|start.stopp/i.test(name)) return 2;

  // Einzelne Anpassungen und Anzeigeoptionen.
  if (/auto.lock|auto.unlock|gurtwarner|tagfahrlicht|heckleuchten|tfl|reifendruck|xds|berg-anfahr|blinken/i.test(name)) return 1;

  // Direkte, typische Anpassung im Kombiinstrument.
  if (/zeigertest|needle.sweep|staging|öltemperatur|oeltemperatur|laptimer|rundenzähler|nachtankmenge|komfortblinken/i.test(name)) return 0;

  return 1;
}

export function guidePrice(coding: GuideCoding): number {
  return guidePriceTiers[guideEffortStep(coding)];
}

export function formatGuidePrice(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}
