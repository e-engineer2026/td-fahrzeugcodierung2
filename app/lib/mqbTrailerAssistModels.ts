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
    "sha256": "0d8fdc6f8da03b35d7bd84669907159a12b3822b04d51aaa319c90ea09502c84"
  },
  {
    "slug": "vw-golf-7-facelift",
    "name": "VW Golf 7 Facelift",
    "code": "BQ1 / BV5 / AN1",
    "sha256": "3f01f6daacfa6f0577c87327ecac2c035dd3361ce3fcd55b62e271e88c33ba39"
  },
  {
    "slug": "vw-passat-b8-3g",
    "name": "VW Passat B8",
    "code": "3G / CB",
    "sha256": "712e373b4f255ff072944f9cfcff82cf7685df2a6b3692b82574702f7e084953"
  },
  {
    "slug": "vw-tiguan-ii-ad1",
    "name": "VW Tiguan II / Allspace",
    "code": "AD1 / BW2 / AX1 / BJ2",
    "sha256": "f72d9d03dd02515ed0d452bc9c6ba12dbcc5486c82d83d20d0923c9be000a4b5"
  },
  {
    "slug": "vw-touran-ii-5t",
    "name": "VW Touran II",
    "code": "5T",
    "sha256": "356b7e1d232de1c80a559ceddb502108b1b74269695d1e6a8474dea2089b439a"
  },
  {
    "slug": "seat-ateca-kh",
    "name": "SEAT Ateca",
    "code": "KH7 / KHP",
    "sha256": "fd59a81a3682d8bf5a6c47517c44ecf185518848ac4d80d4b52b89bcb4184328"
  },
  {
    "slug": "seat-tarraco-kn2",
    "name": "SEAT Tarraco",
    "code": "KN2",
    "sha256": "64091909932d432eceab20eedf9059ad530a1972cc805e2dfad6db944a9d5004"
  },
  {
    "slug": "skoda-karoq-nu",
    "name": "Škoda Karoq",
    "code": "NU7",
    "sha256": "84c475376730b8323e2fe6bcea6a7b2a3412920711c59ae9c28acdbd66b763fb"
  },
  {
    "slug": "skoda-kodiaq-i-ns",
    "name": "Škoda Kodiaq I",
    "code": "NS7",
    "sha256": "7d7567bbc8bde62dad9f3c513fc2178300ead6ebed7ecc9ee3b34ccbde4cca62"
  },
  {
    "slug": "skoda-octavia-iii-5e",
    "name": "Škoda Octavia III (ab MJ 2018)",
    "code": "5E",
    "sha256": "3d2dce8db97952de3c9b01618dfd761f1b31b5475d8f61b8970c972917feca09"
  },
  {
    "slug": "skoda-superb-iii-3v",
    "name": "Škoda Superb III",
    "code": "3V",
    "sha256": "12a42395c922412ac9043bb175906aea58c4ff3f197517809e57810979dad20d"
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
  revision: "1.1",
  priceCents: 1399,
  sha256: model.sha256,
  filename: model.slug + "_trailer_assist.pdf",
  codingIds: [] as string[],
  description: "Fünfseitige modellbezogene Trailer-Assist-Anleitung mit Hardwarepruefung, VCDS-Referenzpositionen, Funktionskontrolle und Protokoll.",
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
