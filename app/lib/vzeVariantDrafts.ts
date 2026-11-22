/** Registrierte VZE-Produkte, einschliesslich der nur zur Admin-Freigabe vorgesehenen neuen MQB-Entwuerfe.
 * Ein Kauf setzt eine explizite Veröffentlichung des jeweiligen privaten PDFs UND
 * eine verifizierte Zahlung voraus. Keine pauschale Fahrzeugfreigabe. */
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
  { slug: "vw-touran-ii-5t", name: "VW Touran II", code: "5T", sku: "TD-VZE-VW-02", sha256: "d73ce0ca8d201c7ca9218a8b5e3967ab84b9761569a3b56a9352dbecfbd2e13e", filename: "vw-touran-ii-5t_vze_fachfassung_rev10.pdf", productId: "vze-vw-touran-ii-5t" },
  { slug: "vw-passat-b8-3g", name: "VW Passat B8", code: "3G", sku: "TD-VZE-VW-03", sha256: "bfc5db71cb2cd2a441ea9e55cb7fcfb87ec85efbd5ae3d016e2e10c4012e58fc", filename: "vw-passat-b8-3g_vze_fachfassung_rev10.pdf", productId: "vze-vw-passat-b8-3g" },
  { slug: "vw-tiguan-ii-ad1", name: "VW Tiguan II / Allspace", code: "AD1 / BW2", sku: "TD-VZE-VW-04", sha256: "0136d4ce2af88f4b0ceb152f52a07ac4271607841e3ee1527e5c7df0355d306f", filename: "vw-tiguan-ii-ad1_vze_fachfassung_rev10.pdf", productId: "vze-vw-tiguan-ii-ad1" },
  { slug: "vw-arteon-3h", name: "VW Arteon", code: "3H", sku: "TD-VZE-VW-05", sha256: "d89c0ac266e5a549e90ea5637a236d89ff50423fe5876998ebe0f21e3ad300ac", filename: "vw-arteon-3h_vze_fachfassung_rev10.pdf", productId: "vze-vw-arteon-3h" },
  { slug: "skoda-octavia-iii-5e", name: "Škoda Octavia III", code: "5E", sku: "TD-VZE-SK-01", sha256: "974dbea36290a0c78a8af1c46004993667f5b78e894e16da55794da5d56a354c", filename: "skoda-octavia-iii-5e_vze_fachfassung_rev10.pdf", productId: "vze-skoda-octavia-iii-5e" },
  { slug: "skoda-superb-iii-3v", name: "Škoda Superb III", code: "3V", sku: "TD-VZE-SK-02", sha256: "37f5cf3a2f3e77925c7041b0e8437ff9565598789259c296fb4c4ce112474ff6", filename: "skoda-superb-iii-3v_vze_fachfassung_rev10.pdf", productId: "vze-skoda-superb-iii-3v" },
  { slug: "skoda-kodiaq-i-ns", name: "Škoda Kodiaq I", code: "NS", sku: "TD-VZE-SK-03", sha256: "1bcbe0145937cd35458c9095c129f5862ea0f3c37218f9c8abe26bd9a74c2e00", filename: "skoda-kodiaq-i-ns_vze_fachfassung_rev10.pdf", productId: "vze-skoda-kodiaq-i-ns" },
  { slug: "skoda-karoq-nu", name: "Škoda Karoq", code: "NU", sku: "TD-VZE-SK-04", sha256: "3acbb647d6d65d780547e56182b0915a1f4fc878f62a618d7f35a3355dd90efd", filename: "skoda-karoq-nu_vze_fachfassung_rev10.pdf", productId: "vze-skoda-karoq-nu" },
  { slug: "seat-leon-iii-5f", name: "SEAT Leon III", code: "5F", sku: "TD-VZE-SE-01", sha256: "46bcb1201a933b83d1ed7a99fbf990d21794b4d3dd649ab0fad354783f946e7d", filename: "seat-leon-iii-5f_vze_fachfassung_rev10.pdf", productId: "vze-seat-leon-iii-5f" },
  { slug: "seat-ateca-kh", name: "SEAT Ateca", code: "KH", sku: "TD-VZE-SE-02", sha256: "34459ae99c42dfce4e01f7a9988286a84d2a0e46d08bb018c92f796ef27f41c5", filename: "seat-ateca-kh_vze_fachfassung_rev10.pdf", productId: "vze-seat-ateca-kh" },
  { slug: "audi-a3-8v", name: "Audi A3", code: "8V", sku: "TD-VZE-AU-01", sha256: "550bb2e5c6ae62984957a556cb097ff5c0e0aec81a8b50a4f296c6f23a85f84f", filename: "audi-a3-8v_vze_fachfassung_rev10.pdf", productId: "vze-audi-a3-8v" },
  // Neue Modellvarianten: Upload ausschliesslich als Entwurf; Veröffentlichung durch den Admin.
  { slug: "vw-polo-aw", name: "VW Polo", code: "AW", sku: "TD-VZE-VW-06", sha256: "f9ecc6fc52cd7c4df8397aebecd142146475a2c1393fc893dad012d93f484062", filename: "vw-polo-aw_vze_fachfassung_rev10.pdf", productId: "vze-vw-polo-aw" },
  { slug: "vw-t-roc-a11", name: "VW T-Roc", code: "A11", sku: "TD-VZE-VW-07", sha256: "716eb91a019d381497d1b30d7bb249e76901f29e9c69a41eaa67d407f523cc8a", filename: "vw-t-roc-a11_vze_fachfassung_rev10.pdf", productId: "vze-vw-t-roc-a11" },
  { slug: "vw-t-cross-c1", name: "VW T-Cross", code: "C1", sku: "TD-VZE-VW-08", sha256: "cd91c63dd52ea2e0da28f4df6feff0fa1c0171069136586d5dffc943fec5f409", filename: "vw-t-cross-c1_vze_fachfassung_rev10.pdf", productId: "vze-vw-t-cross-c1" },
  { slug: "vw-taigo-cs", name: "VW Taigo", code: "CS", sku: "TD-VZE-VW-09", sha256: "11a6291c1fda15703f6175454dd827688b8429707ff5156eb1d49983534c7b02", filename: "vw-taigo-cs_vze_fachfassung_rev10.pdf", productId: "vze-vw-taigo-cs" },
  { slug: "audi-a1-gb", name: "Audi A1", code: "GB", sku: "TD-VZE-AU-02", sha256: "8a2efbeac25d2e0c0b3a25c6c4a4c24f2f9087ba750d0a9c2f9c770ae25f7eb1", filename: "audi-a1-gb_vze_fachfassung_rev10.pdf", productId: "vze-audi-a1-gb" },
  { slug: "audi-tt-8s", name: "Audi TT", code: "8S", sku: "TD-VZE-AU-03", sha256: "88d5e196acea0b0d7e9d7a65a99c492d0d80ccfefecc886993bfda3284420765", filename: "audi-tt-8s_vze_fachfassung_rev10.pdf", productId: "vze-audi-tt-8s" },
  { slug: "audi-q2-ga", name: "Audi Q2", code: "GA", sku: "TD-VZE-AU-04", sha256: "3f9e910975038a5d25ea1a5a5e23ef9baad4f72fc4c888e6116656875ac5015f", filename: "audi-q2-ga_vze_fachfassung_rev10.pdf", productId: "vze-audi-q2-ga" },
  { slug: "audi-q3-f3", name: "Audi Q3", code: "F3", sku: "TD-VZE-AU-05", sha256: "b501298ff7e123d8d00e0e9bccb20c038fba9df9e52399456db67524a63eb11f", filename: "audi-q3-f3_vze_fachfassung_rev10.pdf", productId: "vze-audi-q3-f3" },
  { slug: "skoda-octavia-iii-5e-facelift", name: "Škoda Octavia III Facelift", code: "5E FL", sku: "TD-VZE-SK-05", sha256: "9390b1efeea0b6a8fa005822b87a090a726c64d04c81408ff06c42b86084fa73", filename: "skoda-octavia-iii-5e-facelift_vze_fachfassung_rev10.pdf", productId: "vze-skoda-octavia-iii-5e-facelift" },
  { slug: "skoda-scala-nw", name: "Škoda Scala", code: "NW", sku: "TD-VZE-SK-06", sha256: "a1825a28c8466ee033fbe4cbd951a72a74368e287772cbea777f7006592064b2", filename: "skoda-scala-nw_vze_fachfassung_rev10.pdf", productId: "vze-skoda-scala-nw" },
  { slug: "skoda-kamiq-nw", name: "Škoda Kamiq", code: "NW", sku: "TD-VZE-SK-07", sha256: "cf218a113b954a780d53f659cfc0ba2f694a87134caa090bfc8aff5c346e8ca8", filename: "skoda-kamiq-nw_vze_fachfassung_rev10.pdf", productId: "vze-skoda-kamiq-nw" },
  { slug: "seat-ibiza-kj", name: "SEAT Ibiza", code: "KJ", sku: "TD-VZE-SE-03", sha256: "976ef52faea8e8563440639de862808f9aa0d15d3c7fa2d26fbada1b2cc80c92", filename: "seat-ibiza-kj_vze_fachfassung_rev10.pdf", productId: "vze-seat-ibiza-kj" },
  { slug: "seat-arona-kj7", name: "SEAT Arona", code: "KJ7", sku: "TD-VZE-SE-04", sha256: "4b895b05c7c1378776b7a5588611c26eff94c373a7a9f65d68575aad00f5a40d", filename: "seat-arona-kj7_vze_fachfassung_rev10.pdf", productId: "vze-seat-arona-kj7" },
  { slug: "seat-tarraco-kn2", name: "SEAT Tarraco", code: "KN2", sku: "TD-VZE-SE-05", sha256: "d7afb8807f3ba45dc491e4d1ece56fac8e1e465ed50fec7c58188abd3c2eb91a", filename: "seat-tarraco-kn2_vze_fachfassung_rev10.pdf", productId: "vze-seat-tarraco-kn2" },
  { slug: "cupra-ateca-kh7", name: "CUPRA Ateca", code: "KH7", sku: "TD-VZE-SE-06", sha256: "8d2329949222e761cad4a97adf6d57db642d7bf9289e8e217e900144e65452a5", filename: "cupra-ateca-kh7_vze_fachfassung_rev10.pdf", productId: "vze-cupra-ateca-kh7" },
] as const;

export function findVzeDraft(slug: string): VzeVariantDraft | undefined {
  return VZE_VARIANT_DRAFTS.find((entry) => entry.slug === slug);
}
