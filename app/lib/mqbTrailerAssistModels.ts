import { vzePdfSlugForModel } from "./vzePdfVehicleLinks";
import type { Coding } from "../data/catalog";

/**
 * Modellbezogene Trailer-Assist-PDFs fuer geeignete MQB-Fahrzeuge.
 * Die dokumentierte Modellfamilie allein ist KEINE Freigabe einer konkreten FIN.
 * Original-PDFs bleiben privat: nur Metadaten und Pruefsummen gehoeren ins Repo.
 */
const TRAILER_MODELS = [
  {
    "slug": "vw-arteon-3h",
    "name": "VW Arteon",
    "code": "3H",
    "sha256": "a4ee94aabf75e76bb51cf88d1d74bc93bc6adcab6ac1204efd960ee855bfc72c"
  },
  {
    "slug": "vw-golf-7-facelift",
    "name": "VW Golf 7 Facelift",
    "code": "BQ1 / BV5 / AN1",
    "sha256": "0f1b88378e6cdd09c66e9ab14a9265621f609e3bfe3adc0fafc8b13494d2b5d3"
  },
  {
    "slug": "vw-passat-b8-3g",
    "name": "VW Passat B8",
    "code": "3G / CB",
    "sha256": "874196770bfa5fbf58be2d13b780601360eb3b6de8d4b01ac4f3b1bc16623809"
  },
  {
    "slug": "vw-tiguan-ii-ad1",
    "name": "VW Tiguan II / Allspace",
    "code": "AD1 / BW2 / AX1 / BJ2",
    "sha256": "0c69bae5b5eaeb6aecdc3cf2113229e01fe4dbbce2ba294221398263d5149499"
  },
  {
    "slug": "vw-touran-ii-5t",
    "name": "VW Touran II",
    "code": "5T",
    "sha256": "68dfbf9c4c3df71d3e1d1907fb5c20fc046dffc311730617f7799d2b92f46373"
  },
  {
    "slug": "seat-ateca-kh",
    "name": "SEAT Ateca",
    "code": "KH7 / KHP",
    "sha256": "e74f8d09ae013fc364b7cfa922a126d4fc9ff0214883832c20184f2517e9f88e"
  },
  {
    "slug": "seat-tarraco-kn2",
    "name": "SEAT Tarraco",
    "code": "KN2",
    "sha256": "89f3487ac6f3e2c14bfd3368a88ad69e30630756fba8b4e87b26ceaea91f9d57"
  },
  {
    "slug": "skoda-karoq-nu",
    "name": "Škoda Karoq",
    "code": "NU7",
    "sha256": "10d6c3f19c09a836a1a73834b3c45a41dede9917a45a7666b4c89b417a51a2f7"
  },
  {
    "slug": "skoda-kodiaq-i-ns",
    "name": "Škoda Kodiaq I",
    "code": "NS7",
    "sha256": "1dc92a45d4217887cc2521512f148232bd3b4b2f967df70bf729a3972cc61683"
  },
  {
    "slug": "skoda-octavia-iii-5e",
    "name": "Škoda Octavia III (ab MJ 2018)",
    "code": "5E",
    "sha256": "06f2033b05ec773c52d2b2ce6404d7aa3cbf1087a046b7f8d3e327365d92b960"
  },
  {
    "slug": "skoda-superb-iii-3v",
    "name": "Škoda Superb III",
    "code": "3V",
    "sha256": "03f215f58a56976cbdfb45ff295dd0f21f05cd2a719bb18da94cdfef3a6eb1ba"
  }
] as const;

export const MQB_TRAILER_CODING_ID = "mqb-trailer-assist-enable";

export const MQB_TRAILER_CODING: Coding = {
  id: MQB_TRAILER_CODING_ID,
  name: "Anhaengerrangierassistent (Trailer Assist) aktivieren",
  price: 59,
  category: "Assistenzsysteme",
  uiGroup: "Assistenz",
  interfaceInfo: "VCDS / VCP, abhaengig von Steuergeraet und Softwarestand",
  hardware: "Kompatibles PLA (in der Regel 7X5), RFK High / Area View (KA6), passende AHK (1M6 bzw. #D0/#D1) und Anhaengererkennung erforderlich.",
  requirements: "Golf 7 nur Facelift, Octavia III erst ab MJ 2018. KA6 bei Karoq und Superb III zwingend. PR-Codes, Steuergeraete und ggf. SFD/SFD2 vorab pruefen.",
  sourceUrl: "https://wiki-online.vcds.de/de/Codierungen/MQB/Assistenten/Trailer-Assist",
};

export const MQB_TRAILER_MODEL_PRODUCTS = TRAILER_MODELS.map((model,index) => ({
  id: "mqb-trailer-" + model.slug,
  slug: "mqb-trailer-" + model.slug,
  name: "Anhaengerrangierassistent (Trailer Assist) · " + model.name,
  model: model.name + " (" + model.code + ")",
  sku: "TD-MQB-TA-" + String(index+1).padStart(2,"0"),
  revision: "1.0",
  priceCents: 1399,
  sha256: model.sha256,
  filename: model.slug + "_trailer_assist.pdf",
  codingIds: [] as string[],
  description: "Vierseitige modellbezogene Trailer-Assist-Anleitung mit Hardwarepruefung, VCDS-Referenzpositionen, Funktionskontrolle und Protokoll.",
}));

export function mqbTrailerGuideForVehicle(vehicleModel: string) {
  // Im Website-Konfigurator umfassen Golf 7 und Octavia 5E auch andere Jahre.
  // Titel/Anleitung grenzen die Varianten explizit ein; kein Vor-Facelift-Freigabeversprechen.
  const modelSlug = vehicleModel === "Golf 7 (5G)" ? "vw-golf-7-facelift" :
    vehicleModel === "Octavia 3 5E" ? undefined :
    vehicleModel === "Octavia 3 5E Facelift" ? "skoda-octavia-iii-5e" :
    vzePdfSlugForModel(vehicleModel);
  return modelSlug ? MQB_TRAILER_MODEL_PRODUCTS.find(product => product.slug === "mqb-trailer-" + modelSlug) : undefined;
}

if (MQB_TRAILER_MODEL_PRODUCTS.length !== 11 ||
    new Set(MQB_TRAILER_MODEL_PRODUCTS.map(product => product.slug)).size !== 11 ||
    MQB_TRAILER_MODEL_PRODUCTS.some(product => !/^[a-f0-9]{64}$/.test(product.sha256))) {
  throw new Error("MQB Trailer-Assist-Modellregister ist unvollstaendig.");
}
