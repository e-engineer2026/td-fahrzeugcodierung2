import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { seoVehicles, vehiclePath } from "../lib/vehicleSeo";

export const metadata: Metadata = {
  title: "Fahrzeugcodierungen VW Audi Škoda SEAT CUPRA",
  description: "Fahrzeugbezogene Codiermöglichkeiten und Preise für Volkswagen, Audi, Škoda, SEAT und CUPRA. Modell auswählen und Codierungen ansehen.",
  alternates: { canonical: "https://td-fahrzeugcodierung.vercel.app/fahrzeuge" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Fahrzeugcodierungen VW Audi Škoda SEAT CUPRA | TD Fahrzeugcodierung",
    description: "Fahrzeugbezogene Codiermöglichkeiten und Preise für Volkswagen, Audi, Škoda, SEAT und CUPRA.",
    url: "https://td-fahrzeugcodierung.vercel.app/fahrzeuge",
    siteName: "TD Fahrzeugcodierung",
    locale: "de_DE",
    type: "website",
  },
};

const brandOrder = ["Volkswagen", "Audi", "Škoda", "SEAT / CUPRA"];

export default function FahrzeugePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-blue-100 bg-white">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center" aria-label="TD Fahrzeugcodierung – Startseite">
            <Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-10 w-auto" priority />
            <span className="ml-2 whitespace-nowrap text-xs font-black sm:text-sm">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
          </Link>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            <Link href="/fahrzeuge" className="font-bold text-blue-700">Fahrzeuge</Link>
            <Link href="/#buchen">Codierungen</Link>
            <Link href="/#kontakt">Kontakt</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-blue-50/50">
        <div className="container-x py-12 sm:py-16">
          <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Fahrzeugübersicht</div>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">Codierungen nach Fahrzeugmodell</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Wähle deine Baureihe und sieh dir die aktuell hinterlegten Codierungen, Preise und technischen Hinweise an. Die eigentliche Termin- und Preisberechnung erfolgt anschließend über die Fahrzeugauswahl auf der Hauptseite.</p>
          <Link href="/#buchen" className="mt-6 inline-flex text-sm font-bold text-blue-700 hover:text-blue-800">Zur Codierauswahl auf der Hauptseite →</Link>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16 lg:py-20">
        <div className="space-y-12">
          {brandOrder.map((brand) => {
            const list = seoVehicles.filter((vehicle) => vehicle.brand === brand);
            if (!list.length) return null;
            return (
              <section key={brand}>
                <h2 className="text-2xl font-black text-blue-700">{brand}</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((vehicle) => (
                    <Link key={`${vehicle.brand}-${vehicle.model}`} href={vehiclePath(vehicle)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
                      <div className="font-black">{vehicle.model}</div>
                      <div className="mt-2 text-sm text-slate-500">{vehicle.platform} · {vehicle.startYear}–{vehicle.endYear >= 2026 ? "heute" : vehicle.endYear}</div>
                      <div className="mt-4 text-sm font-semibold text-blue-700">Codierungen & Preise ansehen →</div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container-x flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TD Fahrzeugcodierung</span>
          <div className="flex flex-wrap gap-5"><Link href="/">Startseite</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
        </div>
      </footer>
    </main>
  );
}
