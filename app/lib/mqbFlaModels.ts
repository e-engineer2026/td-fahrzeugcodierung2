import { MQB_LANE_ASSIST_MODEL_PRODUCTS } from "./mqbLaneAssistModels";

/** Separate model-specific FLA/DLA technical drafts.
 * No PDF bytes or private downloads are committed to the repository.
 * The legacy, generic Fernlichtassistent product and previous purchases remain unchanged.
 * Review and owner publication are always required.
 */
export const MQB_FLA_SHA256: Readonly<Record<string, string>> = {
  "audi-a1-gb": "04af6cc3b7f5e8eb40fc01fe01487bc88ec8364326954aa191c6b08d541375f9",
  "audi-a3-8v": "affd4b5cfab62252e07b2a1e7e0de1cff4a53a6f34d912faa99a6dc495138de9",
  "audi-q2-ga": "2f6b04e09b3f47139614badfa946ed90ab0e5636e239047ec332cfaa47560384",
  "audi-q3-f3": "18f40c33e9d881b99f604d814faaa4c5b1edc34ca682980a90e32de749c5e6d3",
  "audi-tt-8s": "d50c97e31b511671b78c56e93d6d6c6f3d20a4f8cd2fa3a4d98fb78e3a81b042",
  "cupra-ateca-kh7": "8c4edd9493846f276aef60002a9e13fbd17e5b1bef702d8bf82be8a12fb53db3",
  "seat-arona-kj7": "3264e0ac080cc112546e79f4c0dc1bdc0ff73cd1e3e64661de91d0cb15d323c9",
  "seat-ateca-kh": "7876cc7bc3ce003d903d7c563e94aaddb41b114a19f7956f3f0d03b973d674cc",
  "seat-ibiza-kj": "3870fbf42443450b8f24aa9008b07eeb767b2122b09ada17015de2822c5e5b42",
  "seat-leon-iii-5f": "0716ca6cde57215be101d29245aee0f50717907b0a0b47ee82e9240b108741d4",
  "seat-tarraco-kn2": "c3c441824b53abadb09090c12697a5c8fbb08479c9ea559588bc23808752937a",
  "skoda-kamiq-nw": "1329708127001c0cf41a85c6dba6dce1cbb771892edb836cf07dc596958ab5f7",
  "skoda-karoq-nu": "7a533114b88ca1b2b4e47a88c40ca2d3c0fb62ba08f2a6ec482379c3dff4af1c",
  "skoda-kodiaq-i-ns": "a2e84f1220eb6c8c751818eef29b1b4cdd8a09e505c43936a25f58916d77864a",
  "skoda-octavia-iii-5e-facelift": "2e8ed3db5ab6dd8f6c55350a47e8678b797fd80daec1e44810d7347feeb15b9e",
  "skoda-octavia-iii-5e": "d15234c974195d7c835c7e4283e478414bd99b5005114e6c80c8afc0a9cd54bd",
  "skoda-scala-nw": "397e8c4fc8593b22423b15cd2b73b425fd144b3a06744833fc1c9d18789ac8c6",
  "skoda-superb-iii-3v": "fbf024e16ba44ac0c98cf7874d3249e57fda31f03e780973ff796369696d812e",
  "vw-arteon-3h": "048aaaba5545ea2dfa1d6d48661c03c85ec3e3172455e78bab77086971bd9639",
  "vw-golf-7-5g": "f046e3fd49b10ee82c699b5c835ed137760538e75975fd4a60e37d9d279d3525",
  "vw-golf-sportsvan-am1": "8915ce0fb01b56c37561cd9bcd9cd3cfeb857a0f9d9c1667b9c2b180e24ecff8",
  "vw-passat-b8-3g": "fcff9f3186369a5a6152b4e6610a5ef5bbc5d6233faf805919b5e4a42f1e427b",
  "vw-polo-aw": "d8d323eff6054181bdd49b9d5631bcdd636882290e8542b19526f82231a3d50a",
  "vw-t-cross-c1": "5e5de29a69e4a62e2c821607d5bc81983c2f2247f9f3769a2bfa6f3de0bed08a",
  "vw-t-roc-a11": "55efb2422448dbc9584ff64b13b827ca872f4bb298410807c5a2374d1d0924cc",
  "vw-taigo-cs": "892f63f0a137d182dcafd451d6e2431f8db32f1ddf37d6ddcfa45922e4b2893e",
  "vw-tiguan-ii-ad1": "0f2bab613e6c45bee3dd09c991c6c7cdabdf7ad7da5629200ccfb421b52c8331",
  "vw-touran-ii-5t": "622b8f5c912dd603f84fd474a023ab3f6b750db8c7385e8a6d6699b168797828",
};

export const MQB_FLA_MODEL_PRODUCTS = MQB_LANE_ASSIST_MODEL_PRODUCTS.map((model, index) => {
  const modelSlug = model.slug.slice("mqb-lane-".length);
  const sha256 = MQB_FLA_SHA256[modelSlug];
  if (!sha256) throw new Error("Unbekanntes FLA-Modell: " + modelSlug);
  return {
    id: "mqb-fla-" + modelSlug,
    slug: "mqb-fla-" + modelSlug,
    name: "Fernlichtassistent (FLA inkl. DLA) · " + model.model.split(" (")[0],
    model: model.model,
    sku: "TD-MQB-FLA-" + String(index + 1).padStart(2, "0"),
    revision: "1.0",
    priceCents: 1399,
    sha256,
    filename: modelSlug + "_fla_dla_entwurf.pdf",
    codingIds: [] as string[],
    description: "Vierseitige modellbezogene technische Prüfunterlage zu FLA, DLA und Matrix-/IQ.Light-Abgrenzung. Hardware, Kamera, Lichtsteuergeräte und Datensätze vor Codierung prüfen.",
  };
});

if (MQB_FLA_MODEL_PRODUCTS.length !== 28 || new Set(MQB_FLA_MODEL_PRODUCTS.map(p => p.slug)).size !== 28) {
  throw new Error("MQB FLA-Modellprodukte unvollständig.");
}
