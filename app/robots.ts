import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://td-fahrzeugcodierung.vercel.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/zahlung"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
