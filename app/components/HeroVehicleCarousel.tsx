"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

const vehicles = [
  { src: "/td-hero-chrome.webp", label: "Graphitgraues Fahrzeug", color: "#596271", alt: "Graphitgraues Fahrzeug mit verchromtem TD-Emblem in einer hellen, natürlichen Umgebung" },
  { src: "/td-hero-gti-red.webp", label: "Rote GTI-Variante", color: "#c82032", alt: "Rote GTI-Variante mit verchromtem TD-Emblem in derselben hellen Umgebung" },
  { src: "/td-hero-r-blue.webp", label: "Blaue R-Variante", color: "#164ab7", alt: "Blaue R-Variante mit verchromtem TD-Emblem in derselben hellen Umgebung" },
];

export default function HeroVehicleCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const respectPreference = () => { if (preference.matches) setPaused(true); };
    respectPreference();
    preference.addEventListener("change", respectPreference);
    return () => preference.removeEventListener("change", respectPreference);
  }, []);

  useEffect(() => {
    if (paused) return;
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      if (!document.hidden) timer = window.setTimeout(() => setActive((index) => (index + 1) % vehicles.length), 5000);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [active, paused]);

  return <>
    <div className="td-hero-picture">
      {vehicles.map((vehicle, index) => <div key={vehicle.src} className={`td-hero-slide${active === index ? " is-active" : ""}`} aria-hidden={active !== index}>
        <Image src={vehicle.src} alt={vehicle.alt} fill preload={index === 0} loading={index === 0 ? undefined : "eager"} sizes="100vw" />
      </div>)}
    </div>
    <div className="td-hero-carousel-controls" role="group" aria-label="Fahrzeugbilder">
      {vehicles.map((vehicle, index) => <button key={vehicle.src} type="button" className="td-hero-dot" aria-label={`${vehicle.label} anzeigen`} aria-pressed={active === index} title={vehicle.label} onFocus={() => setPaused(true)} onClick={() => { setActive(index); setPaused(true); }}>
        <span style={{ backgroundColor: vehicle.color }} />
      </button>)}
      <button type="button" className="td-hero-play" aria-label={paused ? "Automatischen Bildwechsel starten" : "Automatischen Bildwechsel pausieren"} title={paused ? "Bildwechsel starten" : "Bildwechsel pausieren"} onClick={() => setPaused((value) => !value)}>
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
      </button>
    </div>
  </>;
}
