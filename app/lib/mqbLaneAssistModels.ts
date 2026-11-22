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
  "vw-polo-aw": "84e44d5c39ff768d365f2e74d4b7c400bdb5a5b54782eae4ef5f04e988b6e08f",
  "vw-golf-7-5g": "83c16c38adefa15fcd220935bc29a5294c157cdb5ea50e7777c22cb858696142",
  "vw-passat-b8-3g": "8ab0731ab7b075c8133e3890c95001de37795fb2e34c33e6ffdbc1075d0725d2",
  "vw-t-roc-a11": "5f46e6e42f0488c9bc7292a5794b57d12fa89801c44219e7df8629f15c98fadb",
  "vw-arteon-3h": "4b568a559426c3d3a7f4f4a9fab5b01781bd0417775e537cdb1e1dbf6e32fa60",
  "vw-tiguan-ii-ad1": "8141f5fe683bbc5caaac1010fb8677ff5f9827198990ff87a764a1b57675ef47",
  "vw-touran-ii-5t": "e21adc3bf3035a404ffe91e3c220c5fe034cd2e9ef71af63fe72df375ba8f5c9",
  "vw-golf-sportsvan-am1": "88d5438c6f05e8f4b6aee3cafd8f57c81b9e9d2c0b536f676fa79de6ac59f2e0",
  "vw-t-cross-c1": "8baf0163b037b119da3664f4eae87a5c9a9a9aae298f9eb99728dcb4c732cc60",
  "vw-taigo-cs": "68a34933f506e24115f23f1f2aa790431f682d81ded4d5fdd510e6b1de24cddf",
  "audi-a1-gb": "4ab1f9fc9fb9e296e1a557424639f1ba538f42236b06d49a3439a7f4850f1a99",
  "audi-a3-8v": "f56254084e7622d6d9ac6549c17d23da0d8797b8f9b96c4dbff864d669b8e600",
  "audi-tt-8s": "96110803e7e8d9aa730dd129d1c30bf76c6128941525cb84144700d1b76b3c55",
  "audi-q2-ga": "2dd8b280e5d8ac4b7972a1285acbfe0cb19b2f242afe186d62ce075330cc4e38",
  "audi-q3-f3": "3fd4ffdf2f75ad3c177273dbff7b52e092b1d3afa58890a023f5403bd7910ca0",
  "skoda-octavia-iii-5e": "8bad41400d63eb1d6d6b1ebdaabcb286a4948a07502fdb88b528d21830246d24",
  "skoda-octavia-iii-5e-facelift": "ade25c9b863cb4f5d8d902a0064c19274db18393e03d46209f7ba5ff12fdad41",
  "skoda-superb-iii-3v": "274494d924eb4312ad78a44d1d6fcfe1679df2f8711cbfcbe62abdb6a9e4b8fa",
  "skoda-kodiaq-i-ns": "dfcf5e657518d85dce2626c67bc363ecf8500d5c5e66526d83e6c6526d1a3643",
  "skoda-karoq-nu": "8ac712aea418a91ba1e1f398b3c637e7749b7041a7aea6a69bd40274f3dc4ac5",
  "skoda-scala-nw": "d093948fc68e87f48d9c6bc977886cccb74924854bdfeb890b97f4e07d0bf509",
  "skoda-kamiq-nw": "15026eec22bc960a3810803886dfc8b966f3fa43325f4f8c234871c6ab0b2d7b",
  "seat-leon-iii-5f": "5823673706bfb079058b5a169e632e187ad951c2a5e899f576c61dd5994f4971",
  "seat-ateca-kh": "1677d4e538bdd8bca59d2ee7ba74c29c9e414d3a86c0e4c8f2eb4a4875bd2588",
  "seat-ibiza-kj": "95bc1e97cdfcf476c5b598018f8b7b31929d98b1ee2a0303fcd6c988612c418c",
  "seat-arona-kj7": "dac1cc3239dd1be48dcd9d72e23429f8702d55c1dc8e4d2f8c56e75d8d90eb81",
  "seat-tarraco-kn2": "19a2d0124ae6eff7f64c07dd3ab47d10a91783f41701b881c4c123f66b9d90fc",
  "cupra-ateca-kh7": "d0c130f71332cdf7cd9803200899103b74e867d7b28be83313947646ff7845c1",
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
