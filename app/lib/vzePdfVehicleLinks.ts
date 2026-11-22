export const GOLF7_VZE_ADMIN_SLUG = "vw-golf-7-5g";

/** Only explicitly documented MQB generations are linked to TD's corresponding model PDF.
 * SFD2/MQB evo/other platforms are deliberately not inferred from name similarity. */
const VZE_MODEL_LINKS: Record<string,string> = {
  "Polo AW": "vw-polo-aw",
  "T-Roc A11": "vw-t-roc-a11",
  "T-Cross C1": "vw-t-cross-c1",
  "Taigo CS": "vw-taigo-cs",
  "A1 GB": "audi-a1-gb",
  "TT 8S": "audi-tt-8s",
  "Q2 GA": "audi-q2-ga",
  "Q3 F3": "audi-q3-f3",
  "Scala NW": "skoda-scala-nw",
  "Kamiq NW": "skoda-kamiq-nw",
  "SEAT Ibiza KJ": "seat-ibiza-kj",
  "SEAT Arona KJ7": "seat-arona-kj7",
  "SEAT Tarraco KN2": "seat-tarraco-kn2",
  "CUPRA Ateca KH7": "cupra-ateca-kh7",
  "Golf Sportsvan AM1": "vw-golf-sportsvan-am1",
  "Touran 5T": "vw-touran-ii-5t",
  "Passat B8 (3G)": "vw-passat-b8-3g",
  "Tiguan II (AD/BW)": "vw-tiguan-ii-ad1",
  "Arteon 3H": "vw-arteon-3h",
  "Octavia 3 5E": "skoda-octavia-iii-5e",
  "Octavia 3 5E Facelift": "skoda-octavia-iii-5e-facelift",
  "Superb 3V": "skoda-superb-iii-3v",
  "Kodiaq NS": "skoda-kodiaq-i-ns",
  "Karoq NU": "skoda-karoq-nu",
  "SEAT Leon 5F": "seat-leon-iii-5f",
  "SEAT Ateca KH7": "seat-ateca-kh",
  "A3 / S3 8V": "audi-a3-8v",
};
export function vzePdfSlugForModel(model: string): string | undefined {
  return VZE_MODEL_LINKS[model];
}
