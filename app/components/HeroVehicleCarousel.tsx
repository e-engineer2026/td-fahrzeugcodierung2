"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { vehicles as catalog } from "../data/catalog";
import { homeVehiclePreviewEvent, homeVehicleUpdatedEvent, resolveHomeVehicleSelection, type HomeVehicleSelection } from "../lib/homeVehicleSelection";
import { vehicleHeroImage, type VehicleHeroImage } from "../lib/vehicleHero";

const vehicles = [
  { src: "/td-hero-golf-blue-refined.webp", alt: "Blauer Golf mit TD Fahrzeugcodierung Schriftzug auf der Seite" },
  { src: "/td-hero-gti-headlights.webp", alt: "Roter Golf GTI mit TD Fahrzeugcodierung Schriftzug auf der Seite" },
  { src: "/td-hero-r-headlights.webp", alt: "Blauer Golf R mit TD Fahrzeugcodierung Schriftzug auf der Seite" },
];

const sportVariants: Array<{ model: string; from: number; until: number; src: string; label: string }> = [
  { model: "A3 / S3 8V", from: 2017, until: 2020, src: "/vehicle-images/sport/audi-s3-8v-scene.webp", label: "Blauer Audi S3 8V" },
  { model: "A4 / S4 B9", from: 2016, until: 2019, src: "/vehicle-images/sport/audi-s4-b9-scene.webp", label: "Grauer Audi S4 B9 Avant" },
  { model: "A5 / S5 F5", from: 2020, until: 2023, src: "/vehicle-images/sport/audi-rs5-f5-scene.webp", label: "Grüner Audi RS5 F5 Sportback" },
  { model: "A6 / S6 C8", from: 2020, until: 2026, src: "/vehicle-images/sport/audi-rs6-c8-scene.webp", label: "Grauer Audi RS6 C8 Avant" },
  { model: "A7 / S7 4K", from: 2020, until: 2026, src: "/vehicle-images/sport/audi-rs7-4k-scene.webp", label: "Roter Audi RS7 4K Sportback" },
  { model: "A8 D4 (4H)", from: 2014, until: 2017, src: "/vehicle-images/sport/audi-s8-d4-scene.webp", label: "Schwarzer Audi S8 D4" },
];
function sportImage(choice: HomeVehicleSelection | null): VehicleHeroImage | null {
  if (!choice || choice.brand !== "Audi" || !choice.year) return null;
  const match = sportVariants.find((item) => item.model === choice.model && choice.year >= item.from && choice.year <= item.until);
  return match ? { src: match.src, label: match.label, alt: `${match.label} als beispielhafte Modellillustration` } : null;
}

export default function HeroVehicleCarousel() {
  const [active, setActive] = useState(0);
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [headlightsLoaded, setHeadlightsLoaded] = useState(false);
  const [selection, setSelection] = useState<HomeVehicleSelection | null>(null);
  const [photos, setPhotos] = useState<VehicleHeroImage[]>([]);
  const [shownSrc, setShownSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const wantedSrc = useRef<string | null>(null);
  const loadedSources = useRef(new Set<string>());
  const failedSources = useRef(new Set<string>());
  const requested = vehicleHeroImage(selection);
  const sport = sportImage(selection);
  // Keep the last loaded vehicle visible until the newly requested image is ready.
  const hasSelectedPhoto = Boolean(shownSrc && photos.some((photo) => photo.src === shownSrc));
  const showDefault = !hasSelectedPhoto && (!selection || Boolean(requested && failedSrc !== requested.src));

  useEffect(() => {
    const timer = window.setTimeout(() => setHeadlightsOn(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const synchronize = (event: Event) => {
      const choice = resolveHomeVehicleSelection((event as CustomEvent<unknown>).detail, catalog);
      const image = vehicleHeroImage(choice);
      const variant = image ? sportImage(choice) : null;
      wantedSrc.current = image?.src ?? null;
      setSelection(choice);
      setFailedSrc(image && failedSources.current.has(image.src) ? image.src : null);
      if (!image) { if (choice?.year) setShownSrc(null); return; }
      setPhotos((previous) => { const next = [...previous]; for (const photo of [image, variant]) if (photo && !next.some((item) => item.src === photo.src)) next.push(photo); return next; });
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
    if (selection || shownSrc) return;
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
  }, [active, selection, shownSrc]);

  useEffect(() => {
    if (!requested || !sport) return;
    const mainSrc = requested.src;
    const sportSrc = sport.src;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const schedule = () => {
      window.clearInterval(timer);
      if (!document.hidden && !preference.matches) timer = window.setInterval(() => {
        setShownSrc((current) => {
          if (current === mainSrc && loadedSources.current.has(sportSrc) && !failedSources.current.has(sportSrc)) return sportSrc;
          if (current === sportSrc && loadedSources.current.has(mainSrc)) return mainSrc;
          return current;
        });
      }, 5000);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", schedule);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", schedule); preference.removeEventListener("change", schedule); };
  }, [requested?.src, sport?.src]);

  return <div className="td-hero-picture" data-selected-model={selection?.model || ""} data-image-src={hasSelectedPhoto ? shownSrc : showDefault ? vehicles[active].src : ""}>
    {vehicles.map((vehicle, index) => <div key={vehicle.src} className={`td-hero-slide${showDefault && active === index ? " is-active" : ""}`} aria-hidden={!showDefault || active !== index}>
      <Image src={vehicle.src} alt={vehicle.alt} fill preload={index === 0} loading={index === 0 ? undefined : "eager"} sizes="100vw" />
      {index === 0 && <Image src="/td-hero-golf-blue-headlights.webp" alt="" aria-hidden="true" fill sizes="100vw" loading="eager" onLoad={() => setHeadlightsLoaded(true)} className={`td-headlights${headlightsOn && headlightsLoaded ? " is-on" : ""}`} />}
    </div>)}
    {photos.map((photo) => <div key={`selected-${photo.src}`} className={`td-hero-slide td-hero-model-photo${hasSelectedPhoto && shownSrc === photo.src ? " is-active" : ""}`} aria-hidden={!hasSelectedPhoto || shownSrc !== photo.src}>
      <Image src={photo.src} alt={photo.alt} fill sizes="100vw" loading="eager" onLoad={() => {
        loadedSources.current.add(photo.src);
        if (wantedSrc.current === photo.src) setShownSrc(photo.src);
      }} onError={() => { failedSources.current.add(photo.src); if (wantedSrc.current === photo.src) { setFailedSrc(photo.src); setShownSrc(null); } }} />
    </div>)}

  </div>;
}
