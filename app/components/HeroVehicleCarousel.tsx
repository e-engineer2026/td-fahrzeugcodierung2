"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const vehicles = [
  { src: "/td-hero-chrome.webp", alt: "Graphitgraues Fahrzeug mit verchromtem TD-Emblem in einer hellen, natürlichen Umgebung" },
  { src: "/td-hero-gti-red.webp", alt: "Rote GTI-Variante mit verchromtem TD-Emblem in derselben hellen Umgebung" },
  { src: "/td-hero-r-blue.webp", alt: "Blaue R-Variante mit verchromtem TD-Emblem in derselben hellen Umgebung" },
];

export default function HeroVehicleCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
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
  }, [active]);

  return <div className="td-hero-picture">
      {vehicles.map((vehicle, index) => <div key={vehicle.src} className={`td-hero-slide${active === index ? " is-active" : ""}`} aria-hidden={active !== index}>
        <Image src={vehicle.src} alt={vehicle.alt} fill preload={index === 0} loading={index === 0 ? undefined : "eager"} sizes="100vw" />
      </div>)}
    </div>;
}
