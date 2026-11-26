import type { MetadataRoute } from "next";
import { seoVehicles, vehiclePath } from "./lib/vehicleSeo";
import {seoTopics,topicHref} from "./lib/seoTopics";
import {seoArticles,articleHref} from "./lib/seoArticles";
import {vehicleHeroImage} from "./lib/vehicleHero";
import { publishedGuideCatalog } from "./lib/publishedGuideCatalog";

// A publication or withdrawal must be reflected without a new deployment.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://td-fahrzeugcodierung.de";
  const vehiclePages: MetadataRoute.Sitemap = seoVehicles.map((vehicle) => {
    const photo=vehicleHeroImage({brand:vehicle.brand,model:vehicle.model,year:vehicle.startYear});
    return {
    ...(photo?{images:[base+photo.src]}:{}),
    url: `${base}${vehiclePath(vehicle)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  };});

  let guidePages: MetadataRoute.Sitemap = [];
  try {
    const { links } = await publishedGuideCatalog();
    guidePages = links.map(link => ({ url: base + link.href, ...(link.lastModified ? { lastModified: link.lastModified } : {}) }));
  } catch (error) {
    // Keep the existing public vehicle/service sitemap available during shop outages.
    console.error("Published PDF sitemap unavailable", error);
  }

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/fahrzeugcodierung-leipzig`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/vw-codierung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/audi-codierung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/skoda-codierung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/seat-codierung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/cupra-codierung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/remote-fahrzeugcodierung`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/assistenzsysteme-codieren-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/verkehrszeichenerkennung-codieren-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/lane-assist-codieren-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/fernlichtassistent-codieren-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/steuergeraete-diagnose-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/sfd-freischaltung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/carplay-freischalten-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/vcds-codierung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/vcp-codierung-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/schluessel-anlernen-leipzig`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/steuergeraete-flash`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/fahrzeuge`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/codieranleitungen`, changeFrequency: "weekly", priority: 0.8 },
    {url:base+"/ratgeber"},
    ...seoTopics.map(topic=>({url:base+topicHref(topic.slug)})),
    ...seoArticles.map(article=>({url:base+articleHref(article.slug)})),
    ...vehiclePages,
    ...guidePages,
    { url: `${base}/impressum`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/agb`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/widerruf`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
