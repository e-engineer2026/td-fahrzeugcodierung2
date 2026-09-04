import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CodingExplorer from "./CodingExplorer";
import { vehicles } from "../data/catalog";

export const metadata: Metadata = {
  title: "Codierlisten nach Plattform | MQB, MQB evo, MLB evo",
  description:
    "Zusammengefasste Codiermöglichkeiten für MQB, MQB evo und MLB evo – den Fahrzeugen der jeweiligen Plattform zugeordnet.",
  alternates: { canonical: "https://td-fahrzeugcodierung.vercel.app/codierlisten" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Codierlisten nach Plattform | TD Fahrzeugcodierung",
    description:
      "MQB, MQB evo und MLB evo: Codierfunktionen nach Plattform und Fahrzeug zusammengefasst.",
    url: "https://td-fahrzeugcodierung.vercel.app/codierlisten",
    siteName: "TD Fahrzeugcodierung",
    locale: "de_DE",
    type: "website",
  },
};

const supportedPlatforms = ["MQB", "MQBevo", "MLBevo"] as const;

export default function CodierlistenPage() {
  const platformVehicles = Object.fromEntries(
    supportedPlatforms.map((platform) => [
      platform,
      vehicles
        .filter((vehicle) => vehicle.platform === platform)
        .map((vehicle) => ({
          key: `${vehicle.brand}|${vehicle.model}`,
          brand: vehicle.brand,
          model: vehicle.model,
          years: `${vehicle.startYear}–${vehicle.endYear >= 2026 ? "heute" : vehicle.endYear}`,
        })),
    ])
  );

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
        <div className="container-x flex h-14 items-center justify-between gap-3 sm:h-16">
          <Link href="/" className="flex min-w-0 items-center" aria-label="TD Fahrzeugcodierung – Startseite">
            <Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-9 w-auto sm:h-11" priority />
            <span className="ml-2 whitespace-nowrap text-xs font-black text-slate-950 sm:text-base">
              TD <span className="text-blue-600">Fahrzeugcodierung</span>
            </span>
          </Link>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            <Link href="/fahrzeuge">Fahrzeuge</Link>
            <Link href="/codierlisten" className="font-bold text-blue-700">Codierlisten</Link>
            <Link href="/#kontakt">Kontakt</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-blue-50/50">
        <div className="container-x py-12 sm:py-16">
          <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Codierübersicht</div>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Codierlisten nach Fahrzeugplattform
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            MQB, MQB evo und MLB evo kompakt zusammengefasst.
          </p>
          <div className="mt-6 max-w-3xl rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
            <strong className="text-slate-900">Wichtig:</strong> Die Plattformzuordnung ist eine
            technische Vorauswahl. Ob eine Funktion am konkreten Fahrzeug möglich ist, hängt unter
            anderem von Modelljahr, Ausstattung, Steuergerät, Softwarestand und SFD-Schutz ab und
            wird vor der Durchführung geprüft.
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16 lg:py-20">
        <CodingExplorer platformVehicles={platformVehicles} />
      </section>

      <section className="border-t border-blue-100 bg-blue-50/50">
        <div className="container-x py-12 text-center sm:py-16">
          <h2 className="text-2xl font-black sm:text-3xl">Gewünschte Funktion gefunden?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
            Fahrzeug, Baujahr und gewünschte Codierung senden. Die Machbarkeit wird vor dem Termin geprüft.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/#kontakt" className="btn-primary">Machbarkeit anfragen</Link>
            <Link href="/#buchen" className="btn-secondary">Termin konfigurieren</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container-x flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TD Fahrzeugcodierung</span>
          <div className="flex flex-wrap gap-5">
            <Link href="/">Startseite</Link>
            <Link href="/fahrzeuge">Fahrzeuge</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
