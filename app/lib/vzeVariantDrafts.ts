/** Durch den Anbieter zur fachlichen Veröffentlichung freigegebene VZE-Fassungen.
 * Eine Lieferung setzt eine verifizierte PayPal-Zahlung UND ein privates PDF mit
 * exakt passender Dateiprüfsumme voraus. Keine pauschale Fahrzeugfreigabe. */
export const VZE_MODEL_PRICE_CENTS = 1399 as const;
export const VZE_MODEL_REVISION = "1.0" as const;

export type VzeVariantDraft = {
  slug: string;
  name: string;
  code: string;
  sku: string;
  sha256: string;
  filename: string;
  productId: string;
};
export const VZE_VARIANT_DRAFTS: readonly VzeVariantDraft[] = [
  { slug: "vw-golf-sportsvan-am1", name: "VW Golf Sportsvan", code: "AM1", sku: "TD-VZE-VW-01", sha256: "05753910f355d20f0ce7d27facf5d1a84b475dad50a211093032400a49d156a7", filename: "vw-golf-sportsvan-am1_vze_fachfassung_rev10.pdf", productId: "vze-vw-golf-sportsvan-am1" },
  { slug: "vw-touran-ii-5t", name: "VW Touran II", code: "5T", sku: "TD-VZE-VW-02", sha256: "d73ce0ca8d201c7ca9218a8b5e3967ab84b9761569a3b56a9352dbecfbd2e13e", filename: "vw-touran-ii-5t_vze_fachfassung_rev10.pdf", productId: "draft-vze-vw-touran-ii-5t" },
  { slug: "vw-passat-b8-3g", name: "VW Passat B8", code: "3G", sku: "TD-VZE-VW-03", sha256: "bfc5db71cb2cd2a441ea9e55cb7fcfb87ec85efbd5ae3d016e2e10c4012e58fc", filename: "vw-passat-b8-3g_vze_fachfassung_rev10.pdf", productId: "draft-vze-vw-passat-b8-3g" },
  { slug: "vw-tiguan-ii-ad1", name: "VW Tiguan II / Allspace", code: "AD1 / BW2", sku: "TD-VZE-VW-04", sha256: "0136d4ce2af88f4b0ceb152f52a07ac4271607841e3ee1527e5c7df0355d306f", filename: "vw-tiguan-ii-ad1_vze_fachfassung_rev10.pdf", productId: "draft-vze-vw-tiguan-ii-ad1" },
  { slug: "vw-arteon-3h", name: "VW Arteon", code: "3H", sku: "TD-VZE-VW-05", sha256: "d89c0ac266e5a549e90ea5637a236d89ff50423fe5876998ebe0f21e3ad300ac", filename: "vw-arteon-3h_vze_fachfassung_rev10.pdf", productId: "draft-vze-vw-arteon-3h" },
  { slug: "skoda-octavia-iii-5e", name: "Škoda Octavia III", code: "5E", sku: "TD-VZE-SK-01", sha256: "974dbea36290a0c78a8af1c46004993667f5b78e894e16da55794da5d56a354c", filename: "skoda-octavia-iii-5e_vze_fachfassung_rev10.pdf", productId: "draft-vze-skoda-octavia-iii-5e" },
  { slug: "skoda-superb-iii-3v", name: "Škoda Superb III", code: "3V", sku: "TD-VZE-SK-02", sha256: "37f5cf3a2f3e77925c7041b0e8437ff9565598789259c296fb4c4ce112474ff6", filename: "skoda-superb-iii-3v_vze_fachfassung_rev10.pdf", productId: "draft-vze-skoda-superb-iii-3v" },
  { slug: "skoda-kodiaq-i-ns", name: "Škoda Kodiaq I", code: "NS", sku: "TD-VZE-SK-03", sha256: "1bcbe0145937cd35458c9095c129f5862ea0f3c37218f9c8abe26bd9a74c2e00", filename: "skoda-kodiaq-i-ns_vze_fachfassung_rev10.pdf", productId: "draft-vze-skoda-kodiaq-i-ns" },
  { slug: "skoda-karoq-nu", name: "Škoda Karoq", code: "NU", sku: "TD-VZE-SK-04", sha256: "3acbb647d6d65d780547e56182b0915a1f4fc878f62a618d7f35a3355dd90efd", filename: "skoda-karoq-nu_vze_fachfassung_rev10.pdf", productId: "draft-vze-skoda-karoq-nu" },
  { slug: "seat-leon-iii-5f", name: "SEAT Leon III", code: "5F", sku: "TD-VZE-SE-01", sha256: "46bcb1201a933b83d1ed7a99fbf990d21794b4d3dd649ab0fad354783f946e7d", filename: "seat-leon-iii-5f_vze_fachfassung_rev10.pdf", productId: "draft-vze-seat-leon-iii-5f" },
  { slug: "seat-ateca-kh", name: "SEAT Ateca", code: "KH", sku: "TD-VZE-SE-02", sha256: "34459ae99c42dfce4e01f7a9988286a84d2a0e46d08bb018c92f796ef27f41c5", filename: "seat-ateca-kh_vze_fachfassung_rev10.pdf", productId: "draft-vze-seat-ateca-kh" },
  { slug: "audi-a3-8v", name: "Audi A3", code: "8V", sku: "TD-VZE-AU-01", sha256: "550bb2e5c6ae62984957a556cb097ff5c0e0aec81a8b50a4f296c6f23a85f84f", filename: "audi-a3-8v_vze_fachfassung_rev10.pdf", productId: "draft-vze-audi-a3-8v" },
] as const;

export function findVzeDraft(slug: string): VzeVariantDraft | undefined {
  return VZE_VARIANT_DRAFTS.find((entry) => entry.slug === slug);
}
