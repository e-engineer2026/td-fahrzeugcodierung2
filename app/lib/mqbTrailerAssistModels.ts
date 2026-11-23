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
    "sha256": "a5a197d74cb9634caa96a7c60c0aa93ac3f425991f8ac5c5fd08bf5f4d05d1d4"
  },
  {
    "slug": "vw-golf-7-facelift",
    "name": "VW Golf 7 Facelift",
    "code": "BQ1 / BV5 / AN1",
    "sha256": "ace730f9597d26425397c73b55495983c5ccd2701422076a080c14fdd6c21086"
  },
  {
    "slug": "vw-passat-b8-3g",
    "name": "VW Passat B8",
    "code": "3G / CB",
    "sha256": "0c77d0727e511b3a9882cca517769402c561f196a3cfb29292546dcc6a6bbc5b"
  },
  {
    "slug": "vw-tiguan-ii-ad1",
    "name": "VW Tiguan II / Allspace",
    "code": "AD1 / BW2 / AX1 / BJ2",
    "sha256": "fad571aff3685c0e46467b1550d52efdf587302ea828adc83e2dc4f1779c1100"
  },
  {
    "slug": "vw-touran-ii-5t",
    "name": "VW Touran II",
    "code": "5T",
    "sha256": "f7632426dd12cd2806b366425429761d3caca3caee7c717f3aab76fb625d372b"
  },
  {
    "slug": "seat-ateca-kh",
    "name": "SEAT Ateca",
    "code": "KH7 / KHP",
    "sha256": "cf20d099f7b427c7fbd479656d4c022d7c8b8dcb882cfcaa66603ebd903fa69b"
  },
  {
    "slug": "seat-tarraco-kn2",
    "name": "SEAT Tarraco",
    "code": "KN2",
    "sha256": "8572fdb006c9ecec07ad53d79b87f966afd3d3b57432b696430765af89d78031"
  },
  {
    "slug": "skoda-karoq-nu",
    "name": "Škoda Karoq",
    "code": "NU7",
    "sha256": "1dc7bb15a0ecb29d40ab3c2befd38d285eb7cdb3077b8f44a6fed5f953e916f3"
  },
  {
    "slug": "skoda-kodiaq-i-ns",
    "name": "Škoda Kodiaq I",
    "code": "NS7",
    "sha256": "2d8b63718d91231e267786127d7c70be7d0a724bdea811d659a958bbc16d2670"
  },
  {
    "slug": "skoda-octavia-iii-5e",
    "name": "Škoda Octavia III (ab MJ 2018)",
    "code": "5E",
    "sha256": "aa410567ad2b673f242360d388b796e38a6fc7aba0d31b90f5fd3d739c402848"
  },
  {
    "slug": "skoda-superb-iii-3v",
    "name": "Škoda Superb III",
    "code": "3V",
    "sha256": "a6765256b7dc8b3f4612819cad2862926bc25b1954d5c953c7c9fa43ed826bc2"
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
