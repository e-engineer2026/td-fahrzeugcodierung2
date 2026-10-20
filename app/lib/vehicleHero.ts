type PictureChoice = { brand: string; model: string; year?: number };
export type VehicleHeroImage = { src: string; alt: string; label: string };

// Do not reuse a model image for a different generation or facelift.
const pictures: Array<VehicleHeroImage & { brand: string; model: string; until: number }> = [
  { brand: "Volkswagen", model: "Golf 8 (CD)", until: 2023, src: "/td-hero-chrome.webp", label: "Volkswagen Golf 8", alt: "Graphitgrauer Golf 8 mit TD-Emblem als Modellillustration" },
  { brand: "Škoda", model: "Octavia 3 5E", until: 2017, src: "/td-vehicle-octavia-5e.webp", label: "Škoda Octavia 3 · Combi", alt: "Silberner Škoda Octavia 3 5E Combi vor dem Facelift mit TD-Emblem als Modellillustration" },
  { brand: "Audi", model: "A4 / S4 B9", until: 2019, src: "/td-vehicle-audi-a4-b9.webp", label: "Audi A4 B9 · Avant", alt: "Graphitgrauer Audi A4 B9 Avant vor dem Facelift mit TD-Emblem als Modellillustration" },
  { brand: "SEAT / CUPRA", model: "SEAT Leon 5F", until: 2016, src: "/td-vehicle-seat-leon-5f.webp", label: "SEAT Leon 5F", alt: "Roter SEAT Leon 5F Fünftürer vor dem Facelift mit TD-Emblem als Modellillustration" },
  { brand: "SEAT / CUPRA", model: "CUPRA Formentor KM", until: 2023, src: "/td-vehicle-cupra-formentor.webp", label: "CUPRA Formentor", alt: "Petrolblauer CUPRA Formentor vor dem Facelift mit TD-Emblem als Modellillustration" },
  { brand: "Volkswagen", model: "Golf 6 (1K)", until: 2012, src: "/vehicle-images/dunkelroter-golf-vi-auf-steinplatz.webp", label: "Volkswagen Golf 6", alt: "Dunkelroter Golf VI als Modellillustration" },
  { brand: "Volkswagen", model: "Arteon 3H", until: 2020, src: "/vehicle-images/blauer-arteon-auf-hellem-steinplatz.webp", label: "Volkswagen Arteon", alt: "Blauer Volkswagen Arteon als Modellillustration vor Facelift" },
  { brand: "Volkswagen", model: "ID.3 (E11)", until: 2022, src: "/vehicle-images/dunkelroter-id-3-auf-dem-steinplatz.webp", label: "Volkswagen ID.3", alt: "Dunkelroter Volkswagen ID.3 als Modellillustration vor Facelift" },
  { brand: "Volkswagen", model: "Transporter T5", until: 2015, src: "/vehicle-images/dunkelroter-volkswagen-transporter-t5-im-sonnenlicht.webp", label: "VW Transporter T5", alt: "Dunkelroter Volkswagen Transporter T5 als Modellillustration" },
  { brand: "Audi", model: "Q2 GA", until: 2020, src: "/vehicle-images/2018-audi-q2-in-graphitgrau.webp", label: "Audi Q2", alt: "Graphitgrauer Audi Q2 Modelljahr 2018 als Modellillustration" },
  { brand: "Audi", model: "Q4 e-tron (FZ)", until: 2026, src: "/vehicle-images/blauer-audi-q4-e-tron-auf-steinplatz.webp", label: "Audi Q4 e-tron", alt: "Blauer Audi Q4 e-tron als Modellillustration" },
  { brand: "Audi", model: "Q8 4M", until: 2023, src: "/vehicle-images/blauer-audi-q8-auf-hellem-steinplatz.webp", label: "Audi Q8", alt: "Blauer Audi Q8 als Modellillustration vor Facelift" },
  { brand: "Audi", model: "e-tron GE", until: 2023, src: "/vehicle-images/weier-audi-e-tron-auf-hellem-steinplatz.webp", label: "Audi e-tron", alt: "Weißer Audi e-tron GE als Modellillustration" },
  { brand: "Škoda", model: "Superb 2 3T", until: 2015, src: "/vehicle-images/skoda-superb-ii-combi-auf-dem-steinplatz.webp", label: "Škoda Superb II", alt: "Škoda Superb II Combi als Modellillustration" },
  { brand: "Škoda", model: "Yeti 5L", until: 2017, src: "/vehicle-images/dunkelroter-skoda-yeti-auf-hellem-steinplatz.webp", label: "Škoda Yeti", alt: "Dunkelroter Škoda Yeti als Modellillustration" },
  { brand: "Škoda", model: "Scala NW", until: 2023, src: "/vehicle-images/blaue-skoda-scala-auf-hellem-steinplatz.webp", label: "Škoda Scala", alt: "Blauer Škoda Scala als Modellillustration" },
  { brand: "SEAT / CUPRA", model: "SEAT Ateca KH7", until: 2020, src: "/vehicle-images/2018-seat-ateca-am-hellen-steinplatz.webp", label: "SEAT Ateca", alt: "SEAT Ateca Modelljahr 2018 als Modellillustration" },
];

export function vehicleHeroImage(choice: PictureChoice | null): VehicleHeroImage | null {
  if (!choice) return null;
  return pictures.find((item) => item.brand === choice.brand && item.model === choice.model && (!choice.year || choice.year <= item.until)) ?? null;
}
