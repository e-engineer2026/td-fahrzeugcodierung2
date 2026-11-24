import type { Coding, Vehicle } from "../data/catalog";
import { catalogDocumentSlug } from "./guideCatalogLinks";
import { MLBEVO_VZE_PRODUCTS } from "./mlbevoVzeModels";
import { VZE_MODEL_PRICE_CENTS } from "./vzeVariantDrafts";

const topics = [
  {
    id: "active-lane-assist",
    name: "Active Lane Assist",
    hardware: "Kompatible Frontsensorik A5, HCA-fähige Lenkhilfe, passende Anzeige und freigegebene Bedienung erforderlich.",
    reviewModels: ["audi-a8-d5-4n", "audi-q8-4m", "audi-e-tron-ge"],
    activation: /lane assist|spurhalteassistent|spurverlassenswarnung/i,
  },
  {
    id: "fla",
    name: "Fernlichtassistent (FLA)",
    hardware: "Passende Frontsensorik, Scheinwerfer, Lichtsteuerung und Zentralelektrik erforderlich.",
    reviewModels: ["audi-q5-fy", "audi-a8-d5-4n", "audi-e-tron-ge", "vw-touareg-iii-cr"],
    activation: /fernlichtassistent|\bfla\b|high beam assist/i,
  },
];

export const MLBEVO_ASSISTANCE_PRODUCTS = MLBEVO_VZE_PRODUCTS.flatMap(vehicle => topics.map(topic => {
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
    interfaceInfo: "VCDS für unterstützte Kanäle",
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
    filename: vehicle.slug + "_" + topic.id + "_anleitung.pdf",
    coding,
    activation: topic.activation,
  };
}));

export function mlbevoAssistanceGuidesForVehicle(vehicle: Vehicle) {
  if (vehicle.platform !== "MLBevo") return [];
  return MLBEVO_ASSISTANCE_PRODUCTS.filter(product => product.model === vehicle.model);
}
