import { MQB_LANE_ASSIST_MODEL_PRODUCTS } from "./mqbLaneAssistModels";
import { MQB_FLA_MODEL_PRODUCTS } from "./mqbFlaModels";

export const MQB_GUIDE_PRODUCTS = [
  {
    id: "mqb-lane-assist",
    slug: "mqb-lane-assist",
    name: "Lane Assist",
    model: "MQB · Lane Assist",
    sku: "TD-MQB-AS-01",
    revision: "0.1",
    priceCents: 1399,
    sha256: "0c36eceaf9b5a914ff5501fa7a4ecb0e03e22054e13392d8d883b0c13714af5b",
    filename: "TD_MQB_Lane-Assist_Prueffassung.pdf",
    codingIds: ["vcds-lane-activate", "tcross-lane-activate"],
    description: "Prüfablauf für Frontkamera, Lenkhilfe und Kalibrierstatus mit Protokoll für den Funktionstest.",
  },
  {
    id: "mqb-fernlichtassistent",
    slug: "mqb-fernlichtassistent",
    name: "Fernlichtassistent (Light Assist)",
    model: "MQB · Fernlichtassistent",
    sku: "TD-MQB-AS-02",
    revision: "0.1",
    priceCents: 1399,
    sha256: "04e6a6bb9a58053939a4fc7580d1c4b4c18fb6e7d6e4d35f222c6eff8e08d8d8",
    filename: "TD_MQB_Fernlichtassistent_Prueffassung.pdf",
    codingIds: ["vcds-fla", "tcross-fla"],
    description: "Prüfablauf für Kamera und Lichtanlage mit Protokoll für den Funktionstest der Fernlichtumschaltung.",
  },
  // Separate private model drafts. Only an administrator can upload and publish.
  ...MQB_LANE_ASSIST_MODEL_PRODUCTS,
  ...MQB_FLA_MODEL_PRODUCTS,
] as const;

export function findMqbGuideProduct(slug: string) {
  return MQB_GUIDE_PRODUCTS.find(product => product.slug === slug);
}
