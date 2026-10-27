"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { vehicles as catalog } from "../data/catalog";
import { homeVehiclePreviewEvent, homeVehicleUpdatedEvent, resolveHomeVehicleSelection, type HomeVehicleSelection } from "../lib/homeVehicleSelection";
import { vehicleHeroImage, type VehicleHeroImage } from "../lib/vehicleHero";

const vehicles = [
  { src: "/td-hero-side-grey-match.webp", alt: "Graphitgrauer Golf mit TD Fahrzeugcodierung Schriftzug auf der Seite" },
  { src: "/td-hero-side-gti-large.webp", alt: "Roter Golf GTI mit TD Fahrzeugcodierung Schriftzug auf der Seite" },
  { src: "/td-hero-side-r-match.webp", alt: "Blauer Golf R mit TD Fahrzeugcodierung Schriftzug auf der Seite" },
];

export default function HeroVehicleCarousel() {
  const [active, setActive] = useState(0);
  const [selection, setSelection] = useState<HomeVehicleSelection | null>(null);
  const [photos, setPhotos] = useState<VehicleHeroImage[]>([]);
  const [shownSrc, setShownSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const wantedSrc = useRef<string | null>(null);
  const loadedSources = useRef(new Set<string>());
  const failedSources = useRef(new Set<string>());
  const requested = vehicleHeroImage(selection);
  const hasSelectedPhoto = Boolean(requested && failedSrc !== requested.src && shownSrc === requested.src);

  useEffect(() => {
    const synchronize = (event: Event) => {
      const choice = resolveHomeVehicleSelection((event as CustomEvent<unknown>).detail, catalog);
      const image = vehicleHeroImage(choice);
      wantedSrc.current = image?.src ?? null;
      setSelection(choice);
      setFailedSrc(image && failedSources.current.has(image.src) ? image.src : null);
      if (!image) { setShownSrc(null); setActive(0); return; }
      setPhotos((previous) => previous.some((item) => item.src === image.src) ? previous : [...previous, image]);
      if (loadedSources.current.has(image.src)) setShownSrc(image.src);
    };
    window.addEventListener(homeVehiclePreviewEvent, synchronize);
    window.addEventListener(homeVehicleUpdatedEvent, synchronize);
    return () => {
      window.removeEventListener(homeVehiclePreviewEvent, synchronize);
      window.removeEventListener(homeVehicleUpdatedEvent, synchronize);
    };
  }, []);

  useEffect(() => {
    if (selection) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!document.hidden && !preference.matches) timer = window.setTimeout(() => setActive((index) => (index + 1) % vehicles.length), 5000);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, [active, selection]);

  return <div className="td-hero-picture" data-selected-model={selection?.model || ""} data-image-src={hasSelectedPhoto ? shownSrc : vehicles[active].src}>
    {vehicles.map((vehicle, index) => <div key={vehicle.src} className={`td-hero-slide${!hasSelectedPhoto && active === index ? " is-active" : ""}`} aria-hidden={hasSelectedPhoto || active !== index}>
      <Image src={vehicle.src} alt={vehicle.alt} fill preload={index === 0} loading={index === 0 ? undefined : "eager"} sizes="100vw" />
    </div>)}
    {photos.map((photo) => <div key={`selected-${photo.src}`} className={`td-hero-slide td-hero-model-photo${hasSelectedPhoto && shownSrc === photo.src ? " is-active" : ""}`} aria-hidden={!hasSelectedPhoto || shownSrc !== photo.src}>
      <Image src={photo.src} alt={photo.alt} fill sizes="100vw" loading="eager" onLoad={() => {
        loadedSources.current.add(photo.src);
        if (wantedSrc.current === photo.src) setShownSrc(photo.src);
      }} onError={() => { failedSources.current.add(photo.src); if (wantedSrc.current === photo.src) { setFailedSrc(photo.src); setShownSrc(null); } }} />
    </div>)}

  </div>;
}
