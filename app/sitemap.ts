import type { MetadataRoute } from "next";
import { seoVehicles, vehiclePath } from "./lib/vehicleSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://td-fahrzeugcodierung.vercel.app";
  const now = new Date();

  const vehiclePages: MetadataRoute.Sitemap = seoVehicles.map((vehicle) => ({
    url: `${base}${vehiclePath(vehicle)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/fahrzeugcodierung-leipzig`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/vw-codierung-leipzig`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/audi-codierung-leipzig`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/skoda-codierung-leipzig`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/seat-codierung-leipzig`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/cupra-codierung-leipzig`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/remote-fahrzeugcodierung`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/steuergeraete-flash`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/fahrzeuge`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...vehiclePages,
    { url: `${base}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/agb`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/widerruf`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
