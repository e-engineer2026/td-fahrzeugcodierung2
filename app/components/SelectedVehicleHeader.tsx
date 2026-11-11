"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { vehicles } from "../data/catalog";
import { homeVehiclePreviewEvent, homeVehicleSelectedEvent, homeVehicleUpdatedEvent, resolveHomeVehicleSelection, type HomeVehicleSelection } from "../lib/homeVehicleSelection";
import { vehicleHeroImage } from "../lib/vehicleHero";

export default function SelectedVehicleHeader() {
  const [selection, setSelection] = useState<HomeVehicleSelection | null>(null);
  useEffect(() => {
    const update = (event: Event) => setSelection(resolveHomeVehicleSelection((event as CustomEvent<unknown>).detail, vehicles));
    window.addEventListener(homeVehiclePreviewEvent, update);
    window.addEventListener(homeVehicleSelectedEvent, update);
    window.addEventListener(homeVehicleUpdatedEvent, update);
    return () => {
      window.removeEventListener(homeVehiclePreviewEvent, update);
      window.removeEventListener(homeVehicleSelectedEvent, update);
      window.removeEventListener(homeVehicleUpdatedEvent, update);
    };
  }, []);
  if (!selection) return null;
  const sideProfiles: Record<string, string> = {
    "Q3 8U": "/vehicle-images/side/audi-q3-8u.webp",
    "Passat B7 (3C)": "/vehicle-images/side/vw-passat-b7.webp",
    "Superb 3V": "/vehicle-images/side/skoda-superb-3v.webp",
    "Transporter / Multivan T6.1": "/vehicle-images/side/vw-transporter-t61.webp",
    "Q5 FY": "/vehicle-images/side/audi-q5-fy.webp",
    "Transporter T6": "/vehicle-images/side/vw-transporter-t6.webp",
    "Superb 2 3T": "/vehicle-images/side/skoda-superb-2.webp",
    "SEAT Ibiza KJ": "/vehicle-images/side/seat-ibiza-kj.webp",
    "Polo 6R": "/vehicle-images/side/vw-polo-6r.webp",
    "Q5 8R": "/vehicle-images/side/audi-q5-8r.webp",
    "Touran 5T": "/vehicle-images/side/vw-touran-5t.webp",
    "A6 / S6 C6": "/vehicle-images/side/audi-a6-c6.webp",
    "A6 / S6 C7": "/vehicle-images/side/audi-a6-c7.webp",
    "Octavia 4 NX": "/vehicle-images/side/skoda-octavia-4.webp",
    "Transporter T5": "/vehicle-images/side/vw-transporter-t5.webp",
    "SEAT Leon 1P": "/vehicle-images/side/seat-leon-1p.webp",
    "T-Roc A11": "/vehicle-images/side/vw-troc.webp",
    "Passat B8 (3G)": "/vehicle-images/side/vw-passat-b8.webp",
    "Tiguan II (AD/BW)": "/vehicle-images/side/vw-tiguan-ii.webp",
    "Caddy III / IV (2K / SA)": "/vehicle-images/side/vw-caddy-2k.webp",
    "Octavia 3 5E": "/vehicle-images/side/skoda-octavia-3.webp",
    "Octavia 3 5E Facelift": "/vehicle-images/side/skoda-octavia-3.webp",
    "SEAT Leon 5F": "/vehicle-images/side/seat-leon-5f.webp",
    "CUPRA Formentor KM": "/vehicle-images/side/cupra-formentor.webp",
    "Golf 5 (1K)": "/vehicle-images/side/vw-golf-5.webp",
    "Golf 6 (1K)": "/vehicle-images/side/vw-golf-6.webp",
    "Golf 7 (5G)": "/vehicle-images/side/vw-golf-7.webp",
    "Golf 8 (CD)": "/vehicle-images/side/vw-golf-8.webp",
    "Polo AW": "/vehicle-images/side/vw-polo-aw.webp",
    "A4 / S4 B9": "/vehicle-images/side/audi-a4-b9.webp",
    "A3 / S3 8P": "/vehicle-images/side/audi-a3-8p.webp",
    "A3 / S3 8V": "/vehicle-images/side/audi-a3-8v.webp",
    "A3 / S3 8Y": "/vehicle-images/side/audi-a3-8y.webp",
    "A6 / S6 C8": "/vehicle-images/side/audi-a6-c8.webp",
  };
  const originalImage = vehicleHeroImage(selection);
  const side = ["Audi", "Volkswagen", "Škoda", "SEAT / CUPRA"].includes(selection.brand) ? sideProfiles[selection.model] : undefined;
  const image = side ? { src: side, label: selection.model, alt: `${selection.brand} ${selection.model} als Modellillustration im Seitenprofil` } : originalImage;
  const brand = selection.brand === "SEAT / CUPRA" ? "" : selection.brand + " ";
  return <a href="#fahrzeugauswahl" className="td-selected-vehicle" aria-label={`Gewähltes Fahrzeug: ${brand}${selection.model}${selection.year ? ` Baujahr ${selection.year}` : ""}. Fahrzeug ändern.`}>
    {image && <Image src={image.src} alt="" width={86} height={48} className="td-selected-vehicle-image" />}
    <span><small>{image?.label.endsWith("· Modellabbildung") ? "Modellabbildung · Ausführung kann abweichen" : "Dein Fahrzeug"}</small><strong>{brand}{selection.model}{selection.year ? ` · ${selection.year}` : ""}</strong></span>
  </a>;
}
