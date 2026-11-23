import { vzePdfSlugForModel } from "./vzePdfVehicleLinks";
import type { Coding } from "../data/catalog";

/**
 * Kandidatenliste für TJA-Prüfanleitungen auf MQB.
 * Diese Einträge sind KEINE pauschale Funktions- oder Fahrzeugfreigabe.
 * TJA setzt passend parametriertes ACC, A5-Frontkamera, geeignete Lenkung/ESC,
 * Automatikgetriebe und elektromechanische Feststellbremse voraus.
 * Die PDFs werden ausschließlich privat in der Admin-Datenbank gespeichert.
 */
const TJA_MODELS = [
  { slug: "vw-golf-7-5g", name: "VW Golf 7 / 7.5", code: "5G / AU" },
  { slug: "vw-golf-sportsvan-am1", name: "VW Golf Sportsvan", code: "AM1" },
  { slug: "vw-touran-ii-5t", name: "VW Touran II", code: "5T" },
  { slug: "vw-passat-b8-3g", name: "VW Passat B8", code: "3G" },
  { slug: "vw-tiguan-ii-ad1", name: "VW Tiguan II / Allspace", code: "AD1 / BW2" },
  { slug: "vw-arteon-3h", name: "VW Arteon", code: "3H" },
  { slug: "vw-t-roc-a11", name: "VW T-Roc I", code: "A11" },
  { slug: "audi-a3-8v", name: "Audi A3 / S3", code: "8V" },
  { slug: "audi-q2-ga", name: "Audi Q2", code: "GA" },
  { slug: "audi-q3-f3", name: "Audi Q3 / RS Q3", code: "F3" },
  { slug: "skoda-superb-iii-3v", name: "Škoda Superb III", code: "3V" },
  { slug: "skoda-kodiaq-i-ns", name: "Škoda Kodiaq I", code: "NS" },
  { slug: "skoda-karoq-nu", name: "Škoda Karoq", code: "NU" },
  { slug: "seat-ateca-kh", name: "SEAT Ateca", code: "KH" },
  { slug: "seat-tarraco-kn2", name: "SEAT Tarraco", code: "KN2" },
  { slug: "cupra-ateca-kh7", name: "CUPRA Ateca", code: "KH7" },
] as const;

export const MQB_TJA_CODING_ID = "mqb-tja-enable";

export const MQB_TJA_CODING: Coding = {
  id: MQB_TJA_CODING_ID,
  name: "Stauassistent (Traffic Jam Assist / TJA) aktivieren",
  price: 59,
  category: "Assistenzsysteme",
  uiGroup: "Assistenz",
  interfaceInfo: "VCDS (Codierung/Diagnose), ggf. VCP oder ODIS (Parametrierung)",
  hardware: "ACC, Lane Assist mit kompatibler A5-Frontkamera, DSG/S tronic, elektromechanische Feststellbremse, kompatible Lenkhilfe und ESC/ABS erforderlich.",
  requirements: "Nur mit passender Hardware, fahrzeugspezifischen Datensätzen und erforderlichen Freigaben. Auto-Scan, Softwarestände und Kalibrierung vorab prüfen.",
  sourceUrl: "https://wiki-online.vcds.de/de/Codierungen/MQB/Assistenten/TJA",
};

export const MQB_TJA_MODEL_PRODUCTS = TJA_MODELS.map((model, index) => ({
  id: "mqb-tja-" + model.slug,
  slug: "mqb-tja-" + model.slug,
  name: "Stauassistent (TJA) · " + model.name,
  model: model.name + " (" + model.code + ")",
  sku: "TD-MQB-TJA-" + String(index + 1).padStart(2, "0"),
  revision: "1.0",
  priceCents: 1399,
  // Kein fest eingebettetes PDF und keine öffentliche Datei:
  // Upload als Entwurf, Veröffentlichung nur über die autorisierte Admin-Oberfläche.
  sha256: "",
  filename: model.slug + "_tja_anleitung.pdf",
  codingIds: [] as string[],
  description: "Vierseitige modellbezogene TJA-Prüfanleitung zu ACC, A5-Kamera, Lenkhilfe, ESC, Getriebe und EPB. Funktionsfreigabe nur nach Nachweis der konkreten Variante.",
}));

export function mqbTjaGuideForVehicle(vehicleModel: string) {
  const modelSlug = vehicleModel === "Golf 7 (5G)" ? "vw-golf-7-5g" : vzePdfSlugForModel(vehicleModel);
  if (!modelSlug) return undefined;
  return MQB_TJA_MODEL_PRODUCTS.find(product => product.slug === "mqb-tja-" + modelSlug);
}

if (MQB_TJA_MODEL_PRODUCTS.length !== 16 || new Set(MQB_TJA_MODEL_PRODUCTS.map(p => p.slug)).size !== 16) {
  throw new Error("MQB-TJA-Modellliste ist unvollständig.");
}
