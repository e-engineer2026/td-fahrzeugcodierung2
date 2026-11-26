import { SEO_ORIGIN } from "../lib/indexNowConfig";

type Props = { href: string; name: string; description: string; priceCents: number; sku?: string };

export default function GuideProductJsonLd({ href, name, description, priceCents, sku }: Props) {
  const url = SEO_ORIGIN + href;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url + "#product",
    name, description, url,
    ...(sku ? { sku } : {}),
    brand: { "@type": "Brand", name: "TD Fahrzeugcodierung" },
    category: "Digitale PDF-Codieranleitung",
    offers: { "@type": "Offer", url, priceCurrency: "EUR", price: (priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@id": SEO_ORIGIN + "/#business" } },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
