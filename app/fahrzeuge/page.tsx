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
            <Link href="/fahrzeuge" className="font-bold text-blue-700">Fahrzeuge &amp; Preise</Link>
            <Link href="/#buchen">Codierungen</Link>
            <Link href="/#kontakt">Kontakt</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-blue-50/50">
        <div className="container-x py-10 sm:py-14">
          <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Fahrzeuge &amp; Preise</div>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">Fahrzeug auswählen</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Marke aufklappen, Modell auswählen und die verfügbaren Codierungen, Preise und technischen Hinweise ansehen.</p>
        </div>
      </section>

      <section className="container-x py-8 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-4xl space-y-3">
          {brandOrder.map((brand) => {
            const list = seoVehicles.filter((vehicle) => vehicle.brand === brand);
            if (!list.length) return null;
            return (
              <details key={brand} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm open:border-blue-200 open:shadow-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-950 sm:text-2xl">{brand}</h2>
                    <p className="mt-1 text-sm text-slate-500">{list.length} Modelle verfügbar</p>
                  </div>
                  <span className="text-2xl font-light text-blue-600 transition-transform group-open:rotate-45">+</span>
                </summary>

                <div className="border-t border-slate-100 bg-slate-50/50 p-3 sm:p-4">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {list.map((vehicle) => (
                      <Link
                        key={`${vehicle.brand}-${vehicle.model}`}
                        href={vehiclePath(vehicle)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-4 transition hover:border-blue-300 hover:bg-blue-50/40"
                      >
                        <div className="font-black text-slate-950">{vehicle.model}</div>
                        <div className="mt-1 text-sm text-slate-500">{vehicle.platform} · {vehicle.startYear}–{vehicle.endYear >= 2026 ? "heute" : vehicle.endYear}</div>
                        <div className="mt-2 text-sm font-semibold text-blue-700">Codierungen &amp; Preise ansehen →</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6">
          <p className="text-sm leading-6 text-slate-600">Für die direkte Termin- und Preisberechnung kannst du anschließend den Konfigurator auf der Hauptseite verwenden.</p>
          <Link href="/#buchen" className="mt-3 inline-flex text-sm font-bold text-blue-700 hover:text-blue-800">Zum Konfigurator →</Link>
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
