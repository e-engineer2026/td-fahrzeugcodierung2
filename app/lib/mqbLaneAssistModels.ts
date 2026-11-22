import { VZE_VARIANT_DRAFTS } from "./vzeVariantDrafts";

/**
 * Separate model-specific Lane Assist draft products.
 * Not published automatically. The original generic MQB Lane Assist product
 * and any previous purchases remain unchanged.
 *
 * The SHA-256 digests correspond to the 28 draft PDFs supplied in chat.
 * File bytes are NOT stored in the public GitHub repository.
 */
export const MQB_LANE_ASSIST_CHECKSUMS: Readonly<Record<string, string>> = {
  "vw-polo-aw": "594f23019dd31ffee6e71ab48a8c07876f6d9839e1d0b629998010827e0ec0d9",
  "vw-golf-7-5g": "d47a5b8749fdcefb5cd8a563ce3f14bd94da533c7f54a0816904a2fcbdf845b6",
  "vw-passat-b8-3g": "8caf30c999514a9bdff93cc5629d0ac5e4aecf93c3fd8fea93b9b01f560158bc",
  "vw-t-roc-a11": "3e8bdfa969861e1dc6566a5d5e4dd45d4320f4055faaa4273dbf6321019b1256",
  "vw-arteon-3h": "786814f01e04b316ca5c1fe279360262f4b726ad65d8a76418a883e6c95f8b6d",
  "vw-tiguan-ii-ad1": "39dc563517a1402bd6017896d88c7baaa4cb4708e6b8dfdd09ca50b67013789c",
  "vw-touran-ii-5t": "f229fab92133a08883ed7cd3db62ba40f7c0862797e1b7a08990678983c2458a",
  "vw-golf-sportsvan-am1": "f7f638cb6610756fe55f5ca907a9e726a378d885ef14b7f5d423f1af3d22544a",
  "vw-t-cross-c1": "092237e967edb58de7164edf14bbd5d00fe4cedc2adb0be0dbceaf6731627866",
  "vw-taigo-cs": "5a1de48cbe1e82b78665ebceb9a1a9e0ab008cecceb9f8122c8f17d2d0b98334",
  "audi-a1-gb": "a529bbb286ff39db626df41c4f6c35b0731e7678b2584919773fd5ab5d23183d",
  "audi-a3-8v": "c232d815c9a7077d2507e1f3e7d6ec1319c9a617df37fce791dc16c10d4a4bda",
  "audi-tt-8s": "89a325d213d4af38388148f110cb8ac9289d7a39da9f57bda9b7caf3b3aca35a",
  "audi-q2-ga": "144eb11182dc0a71d4baa97d6803de352770dccb2958d467ad9446c1809b7bde",
  "audi-q3-f3": "3afae75a4f811fb0f87ec186af98d15e39d1af97b9a0a65f6ec775df80e51d43",
  "skoda-octavia-iii-5e": "d065c972a521d2a412d483dae1b46d48eded01e2f296ba28d521338794635ba2",
  "skoda-octavia-iii-5e-facelift": "372b1c3160d9dfc952ebccd90d850172034f00bbf025f0d5066874b76bfabae5",
  "skoda-superb-iii-3v": "810e7742057aec1e86f8ae2140574b0631edf61c2b0952606a91c5a25e64a625",
  "skoda-kodiaq-i-ns": "69fac045532417086d8f2237088d185f641649bda01b8cc2fda8b4c241d5a35a",
  "skoda-karoq-nu": "a73171af50a37d4ece17e6c67f9200524233b7c9966048093adfd5f13c72e0f7",
  "skoda-scala-nw": "0ed0998bb813ceb35f02f5709d2c6881609eedc33af4e65e9748102181d2c9c2",
  "skoda-kamiq-nw": "38a55e45c1fa9f1b80c4aef40960855fc2ef12a4464ba3c948acc94e1b49a2c7",
  "seat-leon-iii-5f": "c487f0dbb92f99e880dece033829c9e3791da37164116c22c493c42896914083",
  "seat-ateca-kh": "138e4b98539d426a88d800d2b3f2a48ba2a6caf6cfcd44bd257bdc1388dbd326",
  "seat-ibiza-kj": "1083e4b35e9337e12b3ef1cdcd75eca064f30c6dc35f8f59676f13a5751b916b",
  "seat-arona-kj7": "b1a8f173fe1cc7e2646ce709fc5aca409b4ae5eeba6602671b22df5e1e8a7a87",
  "seat-tarraco-kn2": "8110ca290370b7070ba3698987c913bffcd2aa6737100ae24a4c1a33402efaa8",
  "cupra-ateca-kh7": "a7334608d24b1458adba35a0cb2d6efb8402813b2f5ef7c5eb1980467a997144",
};

const MODEL_ENTRIES = [
  { slug: "vw-golf-7-5g", name: "VW Golf 7 / 7.5", code: "5G / AU" },
  ...VZE_VARIANT_DRAFTS.map(model => ({
    slug: model.slug,
    name: model.name,
    code: model.code,
  })),
];

export const MQB_LANE_ASSIST_MODEL_PRODUCTS = MODEL_ENTRIES.map((model, index) => ({
  id: "mqb-lane-" + model.slug,
  slug: "mqb-lane-" + model.slug,
  name: "Spurhalteassistent (Lane Assist) · " + model.name,
  model: model.name + " (" + model.code + ")",
  sku: "TD-MQB-LA-" + String(index + 1).padStart(2, "0"),
  revision: "1.0",
  priceCents: 1399,
  sha256: MQB_LANE_ASSIST_CHECKSUMS[model.slug],
  filename: model.slug + "_lane_assist_entwurf.pdf",
  codingIds: [] as string[],
  description: "Vierseitige technische Lane-Assist-Prüfanleitung mit Variantenwegen für 3Q0/3QD/2Q0. Abgleich von Kamera, Lenkhilfe und Software ist für jedes Fahrzeug erforderlich.",
}));

// This guards the repository metadata without exposing any PDF bytes.
if (MODEL_ENTRIES.length !== 28 || MODEL_ENTRIES.some(model => !MQB_LANE_ASSIST_CHECKSUMS[model.slug])) {
  throw new Error("Lane-Assist-Produktregister ist nicht vollständig.");
}
