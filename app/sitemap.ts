import type { MetadataRoute } from "next";
import { seoVehicles, vehiclePath } from "./lib/vehicleSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://td-fahrzeugcodierung.de";
  const vehiclePages: MetadataRoute.Sitemap = seoVehicles.map((vehicle) => ({
    url: `${base}${vehiclePath(vehicle)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

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
    { url: `${base}/steuergeraete-flash`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/fahrzeuge`, changeFrequency: "weekly", priority: 0.8 },
    ...vehiclePages,
    { url: `${base}/impressum`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/agb`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/widerruf`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
