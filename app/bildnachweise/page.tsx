import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: { absolute: "Bildnachweise | TD Fahrzeugcodierung" },
  description: "Bildquellen, Urheber und Creative-Commons-Lizenzen für die Fahrzeugfotos.",
  alternates: { canonical: "/bildnachweise" },
};
const credits = [
  {
    "brand": "SEAT / CUPRA",
    "model": "SEAT Altea / Altea XL 5P",
    "until": 2015,
    "title": "Seat Altea XL Kombi 1.6 TDI Style (Facelift) – Frontansicht, 10. September 2011, Düsseldorf.jpg",
    "author": "M 93",
    "source": "https://commons.wikimedia.org/wiki/File:Seat_Altea_XL_Kombi_1.6_TDI_Style_(Facelift)_%E2%80%93_Frontansicht,_10._September_2011,_D%C3%BCsseldorf.jpg",
    "license": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en"
  },
  {
    "brand": "SEAT / CUPRA",
    "model": "SEAT Toledo 4 NH",
    "until": 2019,
    "title": "SEAT Toledo IV FR Line 3-4 Front.jpg",
    "author": "Carlosseat",
    "source": "https://commons.wikimedia.org/wiki/File:SEAT_Toledo_IV_FR_Line_3-4_Front.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "brand": "SEAT / CUPRA",
    "model": "SEAT Tarraco KN2",
    "until": 2024,
    "title": "Seat Tarraco Genf 2019 1Y7A5959.jpg",
    "author": "Alexander Migl",
    "source": "https://commons.wikimedia.org/wiki/File:Seat_Tarraco_Genf_2019_1Y7A5959.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "brand": "SEAT / CUPRA",
    "model": "SEAT Mii AA",
    "until": 2021,
    "title": "Seat Mii 1.0 Style – Frontansicht, 14. September 2015, Münster.jpg",
    "author": "M 93",
    "source": "https://commons.wikimedia.org/wiki/File:Seat_Mii_1.0_Style_%E2%80%93_Frontansicht,_14._September_2015,_M%C3%BCnster.jpg",
    "license": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en"
  },
  {
    "brand": "SEAT / CUPRA",
    "model": "CUPRA Ateca KH7",
    "until": 2024,
    "title": "Cupra Ateca IMG 2791.jpg",
    "author": "Alexander Migl",
    "source": "https://commons.wikimedia.org/wiki/File:Cupra_Ateca_IMG_2791.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "brand": "SEAT / CUPRA",
    "model": "CUPRA Leon KL",
    "until": 2026,
    "title": "Cupra Leon.jpg",
    "author": "Calreyn88",
    "source": "https://commons.wikimedia.org/wiki/File:Cupra_Leon.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "brand": "SEAT / CUPRA",
    "model": "CUPRA Born K11",
    "until": 2026,
    "title": "2022 Cupra Born 1.jpg",
    "author": "Calreyn88",
    "source": "https://commons.wikimedia.org/wiki/File:2022_Cupra_Born_1.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "brand": "SEAT / CUPRA",
    "model": "CUPRA Tavascan (KX)",
    "until": 2026,
    "title": "Cupra Tavascan.jpg",
    "author": "Alexander-93",
    "source": "https://commons.wikimedia.org/wiki/File:Cupra_Tavascan.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    "brand": "Volkswagen",
    "model": "Caddy III / IV (2K / SA)",
    "until": 2020,
    "title": "VW Caddy 2.0 TDI BlueMotion Technology Highline (2K, 2. Facelift) – Frontansicht, 21. April 2017, Düsseldorf.jpg",
    "author": "© M 93",
    "source": "https://commons.wikimedia.org/wiki/File:VW_Caddy_2.0_TDI_BlueMotion_Technology_Highline_(2K,_2._Facelift)_%E2%80%93_Frontansicht,_21._April_2017,_D%C3%BCsseldorf.jpg",
    "license": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en"
  },
  {
    "brand": "Volkswagen",
    "model": "Caddy V (SB)",
    "until": 2026,
    "title": "Volkswagen Caddy V IMG 3804.jpg",
    "author": "Alexander Migl",
    "source": "https://commons.wikimedia.org/wiki/File:Volkswagen_Caddy_V_IMG_3804.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  }
];
export default function Bildnachweise() {
  return <main className="min-h-screen bg-[#f7fbff] text-slate-900">
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/" className="font-semibold text-blue-700 hover:underline">← Zur Startseite</Link>
      <h1 className="mt-8 text-4xl font-black">Bildnachweise</h1>
      <p className="mt-5 text-slate-700 leading-7">Die hier aufgeführten Fahrzeugfotos stammen von Wikimedia Commons und werden nach den jeweiligen Creative-Commons-Lizenzbedingungen verwendet. Die Bilder werden auf der Website in der Darstellung skaliert oder beschnitten. Die Auswahl einer Baureihe zeigt ein Beispielbild; Fahrzeugfarbe, Ausstattung und Karosserievariante können abweichen.</p>
      <div className="mt-10 space-y-6">
      {credits.map(c => <section key={c.model} className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-bold text-lg">{c.model}</h2>
        <p className="mt-2 text-slate-700">Foto: {c.author}. Originaltitel: {c.title}.</p>
        <p className="mt-2 text-slate-700">Darstellung: verkleinert und je nach Bildschirmformat teilweise zugeschnitten. {c.model.startsWith("SEAT ") || c.model.startsWith("Caddy ") ? "Fahrzeugzeichen und sichtbare Radnabenlogos wurden digital entfernt." : "Keine inhaltliche Manipulation des Fahrzeugs."}</p>
        <p className="mt-2"><a className="text-blue-700 underline" href={c.source} target="_blank" rel="noopener noreferrer">Bildquelle (Wikimedia Commons)</a> · <a className="text-blue-700 underline" href={c.licenseUrl} target="_blank" rel="noopener noreferrer">Lizenz: {c.license}</a></p>
      </section>)}
      </div>
    </div>
  </main>;
}
