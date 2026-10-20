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
  { brand: "Volkswagen", model: "Golf Plus 5M", until: 2014, src: "/vehicle-images/blauer-golf-plus-auf-hellem-steinplatz.webp", label: "Volkswagen Golf Plus", alt: "Volkswagen Golf Plus als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Golf 5 (1K)", until: 2008, src: "/vehicle-images/perlweier-golf-v-auf-steinplatz.webp", label: "Volkswagen Golf 5", alt: "Volkswagen Golf 5 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Golf 7 (5G)", until: 2016, src: "/vehicle-images/graphitgrauer-golf-vii-auf-hellem-steinplatz.webp", label: "Volkswagen Golf 7 vor Facelift", alt: "Volkswagen Golf 7 vor Facelift als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Polo 6R", until: 2017, src: "/vehicle-images/graphitgrauer-polo-v-auf-steinplatz.webp", label: "Volkswagen Polo V", alt: "Volkswagen Polo V als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Polo AW", until: 2022, src: "/vehicle-images/silberner-polo-auf-hellem-steinplatz.webp", label: "Volkswagen Polo AW", alt: "Volkswagen Polo AW als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Passat B9", until: 2026, src: "/vehicle-images/graphitgrauer-passat-b9-auf-steinplatz.webp", label: "Volkswagen Passat B9", alt: "Volkswagen Passat B9 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Tiguan 5N", until: 2016, src: "/vehicle-images/perlweier-vw-tiguan-der-ersten-generation.webp", label: "Volkswagen Tiguan 5N", alt: "Volkswagen Tiguan 5N als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Tiguan II (AD/BW)", until: 2020, src: "/vehicle-images/dunkelroter-tiguan-auf-hellem-steinplatz.webp", label: "Volkswagen Tiguan II", alt: "Volkswagen Tiguan II als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Tayron II (R4)", until: 2026, src: "/vehicle-images/neuer-volkswagen-tayron-in-tiefem-metallicblau.webp", label: "Volkswagen Tayron II", alt: "Volkswagen Tayron II als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "ID.4 (E21)", until: 2026, src: "/vehicle-images/graphitgrauer-id-4-auf-hellem-steinplatz.webp", label: "Volkswagen ID.4", alt: "Volkswagen ID.4 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "ID.5 (E39)", until: 2026, src: "/vehicle-images/silberner-id-5-am-hellen-steinplatz.webp", label: "Volkswagen ID.5", alt: "Volkswagen ID.5 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "up! (1S)", until: 2023, src: "/vehicle-images/perlweier-volkswagen-up-auf-hellem-steinplatz.webp", label: "Volkswagen up!", alt: "Volkswagen up! als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Transporter T6", until: 2019, src: "/vehicle-images/graphitgrauer-t6-multivan-auf-steinplatz.webp", label: "Volkswagen Multivan T6", alt: "Volkswagen Multivan T6 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Transporter / Multivan T6.1", until: 2024, src: "/vehicle-images/silberner-multivan-vor-heller-steinwand.webp", label: "Volkswagen Multivan T6.1", alt: "Volkswagen Multivan T6.1 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Touran 1T", until: 2015, src: "/vehicle-images/silberner-touran-vor-heller-steinmauer.webp", label: "Volkswagen Touran 1T", alt: "Volkswagen Touran 1T als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Volkswagen", model: "Touran 5T", until: 2026, src: "/vehicle-images/graphitgrauer-volkswagen-touran-auf-steinplatz.webp", label: "Volkswagen Touran 5T", alt: "Volkswagen Touran 5T als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "Q6 e-tron (GF)", until: 2026, src: "/vehicle-images/perlweier-audi-q6-e-tron-auf-hellem-steinplatz.webp", label: "Audi Q6 e-tron", alt: "Audi Q6 e-tron als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "A5 / S5 FU", until: 2026, src: "/vehicle-images/silberner-audi-a5-avant-am-steinplatz.webp", label: "Audi A5 Avant FU", alt: "Audi A5 Avant FU als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "A5 / S5 8T", until: 2016, src: "/vehicle-images/dunkelrotes-audi-a5-coupe-auf-steinplatz.webp", label: "Audi A5 Coupé 8T", alt: "Audi A5 Coupé 8T als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "A5 / S5 F5", until: 2023, src: "/vehicle-images/graphitgrauer-audi-a5-sportback.webp", label: "Audi A5 Sportback F5", alt: "Audi A5 Sportback F5 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "A8 D4 (4H)", until: 2017, src: "/vehicle-images/graphitgrauer-audi-a8-d4-vor-steinmauer.webp", label: "Audi A8 D4", alt: "Audi A8 D4 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "Q7 4L", until: 2015, src: "/vehicle-images/silberner-audi-q7-vor-heller-steinwand.webp", label: "Audi Q7 4L", alt: "Audi Q7 4L als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "Q7 4M", until: 2023, src: "/vehicle-images/graphitgrauer-audi-q7-auf-steinplatz.webp", label: "Audi Q7 4M", alt: "Audi Q7 4M als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "Q3 8U", until: 2018, src: "/vehicle-images/silberner-audi-q3-vor-heller-steinmauer.webp", label: "Audi Q3 8U", alt: "Audi Q3 8U als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Audi", model: "Q3 F3", until: 2023, src: "/vehicle-images/dunkelroter-audi-q3-auf-hellem-steinplatz.webp", label: "Audi Q3 F3", alt: "Audi Q3 F3 als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Škoda", model: "Octavia 2 1Z", until: 2013, src: "/vehicle-images/dunkelrote-skoda-octavia-ii-combi.webp", label: "Škoda Octavia II Combi", alt: "Škoda Octavia II Combi als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Škoda", model: "Karoq NU", until: 2026, src: "/vehicle-images/silberner-skoda-karoq-auf-hellem-steinplatz.webp", label: "Škoda Karoq", alt: "Škoda Karoq als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Škoda", model: "Kodiaq NS", until: 2023, src: "/vehicle-images/graphitgrauer-skoda-kodiaq-auf-hellem-steinplatz.webp", label: "Škoda Kodiaq NS", alt: "Škoda Kodiaq NS als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Škoda", model: "Superb 3V", until: 2023, src: "/vehicle-images/roter-skoda-superb-kombi-im-sonnenlicht.webp", label: "Škoda Superb 3V Combi", alt: "Škoda Superb 3V Combi als fotorealistische Modellillustration mit TD-Emblem" },
  { brand: "Škoda", model: "Fabia 3 NJ", until: 2021, src: "/vehicle-images/graphitgraue-skoda-fabia-auf-hellem-steinplatz.webp", label: "Škoda Fabia 3", alt: "Škoda Fabia 3 als fotorealistische Modellillustration mit TD-Emblem" },
];

export function vehicleHeroImage(choice: PictureChoice | null): VehicleHeroImage | null {
  if (!choice) return null;
  return pictures.find((item) => item.brand === choice.brand && item.model === choice.model && (!choice.year || choice.year <= item.until)) ?? null;
}
