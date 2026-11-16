import type { ResearchGuide } from "../data/guideResearch";

/**
 * Redaktionelle TD-Praxis-Auswahl für eine spätere Machbarkeitsprüfung.
 * Keine Angebotszusage, Preis- oder VCDS/VCP-Kompatibilitätsgarantie.
 * Bewusst nur konkrete IDs statt pauschaler Schlagwort-Heuristiken.
 */
export type RetrofitFocus = {
  topic: "Beleuchtung" | "Laden & Komfort" | "Reifendruck" | "Einparkhilfe & Bedienung";
  scope: "Kompakter Einbau" | "Zusätzliche Vorprüfung";
  activation: string;
};

const focusById: Record<string, RetrofitFocus> = {
  // Weniger aufwendige Nachrüstungen. Die Quelle entscheidet über die Codierbarkeit.
  "golf7-led-fussraum-vorn": { topic: "Beleuchtung", scope: "Kompakter Einbau", activation: "Codierung je nach Ausstattung prüfen" },
  "golf7-led-fussraum-hinten": { topic: "Beleuchtung", scope: "Kompakter Einbau", activation: "Laut Quelle ohne zusätzliche Codierung" },
  "octavia5e-led-fussraum-vorn": { topic: "Beleuchtung", scope: "Kompakter Einbau", activation: "VCDS/VCP-Machbarkeit prüfen" },
  "octavia5e-led-kennzeichen": { topic: "Beleuchtung", scope: "Kompakter Einbau", activation: "VCDS laut Quelle" },
  "a4-8w-ambient-mittelkonsole": { topic: "Beleuchtung", scope: "Kompakter Einbau", activation: "VCDS/ODIS laut Quelle" },
  "a4-8w-tuerwarnleuchten": { topic: "Beleuchtung", scope: "Kompakter Einbau", activation: "Laut Quelle ohne Codierung" },
  "a4-8w-usb-fond": { topic: "Laden & Komfort", scope: "Kompakter Einbau", activation: "Laut Quelle ohne Codierung" },
  "formentor-km-kamera-reinigung": { topic: "Einparkhilfe & Bedienung", scope: "Kompakter Einbau", activation: "Laut Quelle ohne Codierung, PR KA2/KA6 erforderlich" },

  // Interessante Dienstleistungen, aber mit stärkerem Hardware-, Codier- oder Freigabeaufwand.
  "a4-8w-ambient-tueren": { topic: "Beleuchtung", scope: "Zusätzliche Vorprüfung", activation: "Lichtpaket und Steuergeräte prüfen" },
  "a4-8w-phonebox": { topic: "Laden & Komfort", scope: "Zusätzliche Vorprüfung", activation: "PR 9ZX und Hersteller-Codierdongle nötig" },
  "vw-tiguan2-phonebox": { topic: "Laden & Komfort", scope: "Zusätzliche Vorprüfung", activation: "PR 9ZX; laut Anbieter keine Einbauanleitung" },
  "skoda-kodiaq-phonebox": { topic: "Laden & Komfort", scope: "Zusätzliche Vorprüfung", activation: "PR 9ZX; laut Anbieter keine Einbauanleitung" },
  "a4-8w-homelink": { topic: "Laden & Komfort", scope: "Zusätzliche Vorprüfung", activation: "Fahrzeug- und Sendervariante prüfen" },
  "a4-8w-autohold": { topic: "Einparkhilfe & Bedienung", scope: "Zusätzliche Vorprüfung", activation: "Hersteller-Codierdongle; ABS-/Bremsenvariante prüfen" },
  "leon5f-pdc-front-heck": { topic: "Einparkhilfe & Bedienung", scope: "Zusätzliche Vorprüfung", activation: "Sensoren, Stoßfänger und Codierung prüfen" },
  "tiguan2-anklappspiegel": { topic: "Laden & Komfort", scope: "Zusätzliche Vorprüfung", activation: "Highline-Türsteuergeräte prüfen" },
  "passat8-rdk-high": { topic: "Reifendruck", scope: "Zusätzliche Vorprüfung", activation: "Radsensoren/Reifendienst und Hersteller-Dongle" },
  "superb3v-rdk-high": { topic: "Reifendruck", scope: "Zusätzliche Vorprüfung", activation: "Radsensoren/Reifendienst und Gateway prüfen" },
  "skoda-kodiaq-rdk-high": { topic: "Reifendruck", scope: "Zusätzliche Vorprüfung", activation: "Radsensoren/Reifendienst und Gateway prüfen" },
  "a4-8w-rdk-high": { topic: "Reifendruck", scope: "Zusätzliche Vorprüfung", activation: "Radsensoren/Reifendienst und Steuergeräte prüfen" },
};

export function retrofitFocusFor(entry: ResearchGuide): RetrofitFocus | undefined {
  if (entry.category !== "Nachrüstungen") return undefined;
  return focusById[entry.id];
}
