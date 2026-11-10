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
  const image = vehicleHeroImage(selection);
  const brand = selection.brand === "SEAT / CUPRA" ? "" : selection.brand + " ";
  return <a href="#fahrzeugauswahl" className="td-selected-vehicle" aria-label={`Gewähltes Fahrzeug: ${brand}${selection.model}${selection.year ? ` Baujahr ${selection.year}` : ""}. Fahrzeug ändern.`}>
    {image && <Image src={image.src} alt="" width={86} height={48} className="td-selected-vehicle-image" />}
    <span><small>{image?.label.endsWith("· Modellabbildung") ? "Modellabbildung · Ausführung kann abweichen" : "Dein Fahrzeug"}</small><strong>{brand}{selection.model}{selection.year ? ` · ${selection.year}` : ""}</strong></span>
  </a>;
}
