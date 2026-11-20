/** Interne VZE-Prüffassungen: keine Produkte und keine kundenseitige Downloadfreigabe. */
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
  { slug: "vw-golf-sportsvan-am1", name: "VW Golf Sportsvan", code: "AM1", sku: "TD-VZE-VW-01", sha256: "7f2a5e5d3da800922f6a53b63eaf28a23e1764221dbeffc5af2d21caa0bc6410", filename: "vw-golf-sportsvan-am1_vze_prueffassung.pdf", productId: "draft-vze-vw-golf-sportsvan-am1" },
  { slug: "vw-touran-ii-5t", name: "VW Touran II", code: "5T", sku: "TD-VZE-VW-02", sha256: "b24dc19e830f464be3652cd7387e2ab20a1dcc55a1770e858d4fad3148a9ef55", filename: "vw-touran-ii-5t_vze_prueffassung.pdf", productId: "draft-vze-vw-touran-ii-5t" },
  { slug: "vw-passat-b8-3g", name: "VW Passat B8", code: "3G", sku: "TD-VZE-VW-03", sha256: "d6a0d97aba5b8d416d4e9d968030575f7db2cfb6e14bc347f9cdf00fb025f370", filename: "vw-passat-b8-3g_vze_prueffassung.pdf", productId: "draft-vze-vw-passat-b8-3g" },
  { slug: "vw-tiguan-ii-ad1", name: "VW Tiguan II / Allspace", code: "AD1 / BW2", sku: "TD-VZE-VW-04", sha256: "a13727ab4d12f88a76c47ffcf9e1d9a8f77884b2bc1175f1e8e76b7eeb749781", filename: "vw-tiguan-ii-ad1_vze_prueffassung.pdf", productId: "draft-vze-vw-tiguan-ii-ad1" },
  { slug: "vw-arteon-3h", name: "VW Arteon", code: "3H", sku: "TD-VZE-VW-05", sha256: "f80a8a38813ffe47750b61e37001fb1889bc3ee79c005d22dee598f8f0543716", filename: "vw-arteon-3h_vze_prueffassung.pdf", productId: "draft-vze-vw-arteon-3h" },
  { slug: "skoda-octavia-iii-5e", name: "Škoda Octavia III", code: "5E", sku: "TD-VZE-SK-01", sha256: "611d8d33c6eaec9fd90e9be1da6fe46d31f74f254faf6de7c98bd0295c834d2b", filename: "skoda-octavia-iii-5e_vze_prueffassung.pdf", productId: "draft-vze-skoda-octavia-iii-5e" },
  { slug: "skoda-superb-iii-3v", name: "Škoda Superb III", code: "3V", sku: "TD-VZE-SK-02", sha256: "e26f7ea46ffea253231c347b097c93d952441dd59ec265641a9d5a6b29038b4f", filename: "skoda-superb-iii-3v_vze_prueffassung.pdf", productId: "draft-vze-skoda-superb-iii-3v" },
  { slug: "skoda-kodiaq-i-ns", name: "Škoda Kodiaq I", code: "NS", sku: "TD-VZE-SK-03", sha256: "1b98bfe790d641a7222765a1d59fcf597d6cf414fd3249c315639f9470806bfc", filename: "skoda-kodiaq-i-ns_vze_prueffassung.pdf", productId: "draft-vze-skoda-kodiaq-i-ns" },
  { slug: "skoda-karoq-nu", name: "Škoda Karoq", code: "NU", sku: "TD-VZE-SK-04", sha256: "0a7f5091d19e84aa91a09885c9ad91de8404b8626fdef314d6d6bc86db5475d2", filename: "skoda-karoq-nu_vze_prueffassung.pdf", productId: "draft-vze-skoda-karoq-nu" },
  { slug: "seat-leon-iii-5f", name: "SEAT Leon III", code: "5F", sku: "TD-VZE-SE-01", sha256: "dd2f7ca28dcb1da07628a83439802849dc670d68e2ab42544f31df4326369aa4", filename: "seat-leon-iii-5f_vze_prueffassung.pdf", productId: "draft-vze-seat-leon-iii-5f" },
  { slug: "seat-ateca-kh", name: "SEAT Ateca", code: "KH", sku: "TD-VZE-SE-02", sha256: "132ffb9cd3ffa492ba74da6967b647b55ee7581a01c455e2b16e709cf2ee35ef", filename: "seat-ateca-kh_vze_prueffassung.pdf", productId: "draft-vze-seat-ateca-kh" },
  { slug: "audi-a3-8v", name: "Audi A3", code: "8V", sku: "TD-VZE-AU-01", sha256: "6f650cfe81b07ce86950f703955fb7c1f7e48e6cc7ea7ffcdbdb911d3c383f72", filename: "audi-a3-8v_vze_prueffassung.pdf", productId: "draft-vze-audi-a3-8v" },
] as const;

export function findVzeDraft(slug: string): VzeVariantDraft | undefined {
  return VZE_VARIANT_DRAFTS.find((entry) => entry.slug === slug);
}
