type PictureChoice = { brand: string; model: string; year?: number };
export type VehicleHeroImage = { src: string; alt: string; label: string };

// Do not reuse a model image for a different generation or facelift.
const pictures: Array<VehicleHeroImage & { brand: string; model: string; until: number }> = [
  { brand: "Volkswagen", model: "Golf 8 (CD)", until: 2023, src: "/td-hero-chrome.webp", label: "Volkswagen Golf 8", alt: "Graphitgrauer Golf 8 mit TD-Emblem als Modellillustration" },
  { brand: "Škoda", model: "Octavia 3 5E", until: 2017, src: "/td-vehicle-octavia-5e.webp", label: "Škoda Octavia 3 · Combi", alt: "Silberner Škoda Octavia 3 5E Combi vor dem Facelift mit TD-Emblem als Modellillustration" },
  { brand: "Audi", model: "A4 / S4 B9", until: 2019, src: "/td-vehicle-audi-a4-b9.webp", label: "Audi A4 B9 · Avant", alt: "Graphitgrauer Audi A4 B9 Avant vor dem Facelift mit TD-Emblem als Modellillustration" },
  { brand: "SEAT / CUPRA", model: "SEAT Leon 5F", until: 2016, src: "/td-vehicle-seat-leon-5f.webp", label: "SEAT Leon 5F", alt: "Roter SEAT Leon 5F Fünftürer vor dem Facelift mit TD-Emblem als Modellillustration" },
  { brand: "SEAT / CUPRA", model: "CUPRA Formentor KM", until: 2023, src: "/td-vehicle-cupra-formentor.webp", label: "CUPRA Formentor", alt: "Petrolblauer CUPRA Formentor vor dem Facelift mit TD-Emblem als Modellillustration" },
];

export function vehicleHeroImage(choice: PictureChoice | null): VehicleHeroImage | null {
  if (!choice) return null;
  return pictures.find((item) => item.brand === choice.brand && item.model === choice.model && (!choice.year || choice.year <= item.until)) ?? null;
}
