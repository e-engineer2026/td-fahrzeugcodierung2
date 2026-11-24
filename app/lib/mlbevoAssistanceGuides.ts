import type { Coding, Vehicle } from "../data/catalog";
import { catalogDocumentSlug } from "./guideCatalogLinks";
import { MLBEVO_VZE_PRODUCTS } from "./mlbevoVzeModels";
import { VZE_MODEL_PRICE_CENTS } from "./vzeVariantDrafts";

type AssistanceTopic = {
  id: string; name: string; hardware: string; documentedModels: string[];
  reviewModels: string[]; activation: RegExp; filenameSuffix?: string;
};

const topics: AssistanceTopic[] = [
  {
    id: "active-lane-assist",
    name: "Active Lane Assist",
    hardware: "Kompatible Frontsensorik A5, HCA-fähige Lenkhilfe, passende Anzeige und freigegebene Bedienung erforderlich.",
    documentedModels: ["audi-a4-b9-8w", "audi-a5-f5", "audi-q7-4m", "audi-a6-c8-4a", "audi-a7-c8-4k", "vw-touareg-iii-cr"],
    reviewModels: ["audi-a8-d5-4n", "audi-q8-4m", "audi-e-tron-ge"],
    activation: /lane assist|spurhalteassistent|spurverlassenswarnung/i,
  },
  {
    id: "fla",
    name: "Fernlichtassistent (FLA)",
    hardware: "Passende Frontsensorik, Scheinwerfer, Lichtsteuerung und Zentralelektrik erforderlich.",
    documentedModels: ["audi-a4-b9-8w", "audi-a5-f5", "audi-q7-4m", "audi-a6-c8-4a", "audi-a7-c8-4k", "audi-q8-4m"],
    reviewModels: ["audi-q5-fy", "audi-a8-d5-4n", "audi-e-tron-ge", "vw-touareg-iii-cr"],
    activation: /fernlichtassistent|\bfla\b|high beam assist/i,
  },
  {
    id: "ipa",
    name: "Intelligenter Park Assist (IPA)",
    filenameSuffix: "intelligenter_park_assist_ipa",
    hardware: "Kompatible Parkassistenz, Umfeldkameras, Manövrierassistent und erforderliche Freigaben bzw. passender Codierdongle prüfen.",
    documentedModels: ["audi-a6-c8-4a","audi-a7-c8-4k","audi-a8-d5-4n","audi-e-tron-ge","audi-q7-4m","audi-q8-4m"],
    reviewModels: [],
    activation: /intelligenter park.?assist|parkpilot|\bipa\b/i,
  },
  {
    id: "manoeverassistent",
    name: "Manövrierassistent",
    filenameSuffix: "manoeverassistent",
    hardware: "Kompatible Umfeldsensorik, Lenkung, Bremsen und fahrzeugspezifische Parametrierung bzw. Codierdongle erforderlich.",
    documentedModels: ["audi-a6-c8-4a","audi-a7-c8-4k","audi-a8-d5-4n","audi-e-tron-ge","audi-q7-4m","audi-q8-4m"],
    reviewModels: [],
    activation: /manövrierassistent|manoeverassistent|maneuver assist/i,
  },
  {
    id: "pla",
    name: "Parklenkassistent (PLA)",
    filenameSuffix: "parklenkassistent_pla",
    hardware: "Kompatible Einparkhilfe, seitliche Sensoren, Bedienung und fahrzeugspezifische Parametrierung prüfen.",
    documentedModels: ["audi-a4-b9-8w","audi-a5-f5","audi-a6-c8-4a","audi-a7-c8-4k","audi-a8-d5-4n","audi-q5-fy","audi-q7-4m","audi-q8-4m","vw-touareg-iii-cr"],
    reviewModels: [],
    activation: /parklenkassistent|\bpla\b/i,
  },
  {
    id: "stauassistent",
    name: "Stauassistent",
    filenameSuffix: "stauassistent",
    hardware: "Geeignete Distanzregelung, Frontkamera, Lenkhilfe, Getriebe und freigegebene Steuergeräte-Datensätze prüfen.",
    documentedModels: ["audi-a4-b9-8w","audi-a5-f5","audi-a6-c8-4a","audi-a7-c8-4k","audi-a8-d5-4n","audi-q5-fy","audi-q7-4m","audi-q8-4m"],
    reviewModels: [],
    activation: /stauassistent|traffic jam assist|\btja\b/i,
  },
  {
    id: "trailer-assist",
    name: "Trailer Assist",
    filenameSuffix: "trailer_assist",
    hardware: "Kompatible Anhängevorrichtung, Anhängererkennung, Umfeldsensorik und erforderliche Parametrierung prüfen.",
    documentedModels: ["audi-a6-c8-4a","audi-a7-c8-4k","audi-a8-d5-4n","audi-e-tron-ge","audi-q7-4m","audi-q8-4m","vw-touareg-iii-cr"],
    reviewModels: [],
    activation: /trailer assist|anhängerrangierassistent/i,
  },
];

export const MLBEVO_ASSISTANCE_PRODUCTS = MLBEVO_VZE_PRODUCTS.flatMap(vehicle => topics
  // Neue ZIP-Produkte ausschließlich für die tatsächlich gelieferten Modell-PDFs registrieren.
  .filter(topic => !topic.filenameSuffix || topic.documentedModels.includes(vehicle.slug))
  .map(topic => {
  const reviewOnly = topic.reviewModels.includes(vehicle.slug);
  const slug = catalogDocumentSlug(vehicle.model, "coding-mlbevo-" + topic.id + "-pdf");
  const name = topic.name + (reviewOnly ? " · Prüffassung" : "");
  const coding: Coding = {
    id: "mlbevo-" + topic.id + "-pdf",
    name,
    price: VZE_MODEL_PRICE_CENTS / 100,
    category: "Assistenzsysteme",
    uiGroup: "Assistenz",
    hardware: topic.hardware,
    interfaceInfo: topic.filenameSuffix ? "Fahrzeugspezifischer Codierweg; ggf. passender Codierdongle erforderlich" : "VCDS für unterstützte Kanäle",
    requirements: reviewOnly ? "Für diese Baureihe ist kein vollständiger Codierpfad belegt." : undefined,
  };
  return {
    id: slug, slug, name,
    title: name + " · " + vehicle.name + " (" + vehicle.code + ")",
    model: vehicle.model,
    category: "Assistenzsysteme" as const,
    sku: ("TD-MLB-" + topic.id + "-" + vehicle.slug).toUpperCase(),
    revision: "1.0",
    priceCents: VZE_MODEL_PRICE_CENTS,
    sha256: "",
    filename: vehicle.slug + "_" + (topic.filenameSuffix ?? topic.id + "_anleitung") + ".pdf",
    coding,
    documented: topic.documentedModels.includes(vehicle.slug),
    activation: topic.activation,
  };
}));

// Keep previous product IDs resolvable for uploaded PDFs and existing purchases.
export const DOCUMENTED_MLBEVO_ASSISTANCE_PRODUCTS = MLBEVO_ASSISTANCE_PRODUCTS.filter(product => product.documented);

export function mlbevoAssistanceGuidesForVehicle(vehicle: Vehicle) {
  if (vehicle.platform !== "MLBevo") return [];
  return DOCUMENTED_MLBEVO_ASSISTANCE_PRODUCTS.filter(product => product.model === vehicle.model);
}
