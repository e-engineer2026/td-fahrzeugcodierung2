import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { codingCatalog, codingGroups, codingsForVehicle } from "../../../data/catalog";
import { findVehicleBySlugs, seoVehicles, vehicleBrandSlug, vehicleModelSlug } from "../../../lib/vehicleSeo";

const BASE = "https://td-fahrzeugcodierung.vercel.app";

type PageParams = { brand: string; model: string };

function shortBrand(brand: string): string {
  if (brand === "Volkswagen") return "VW";
  if (brand === "SEAT / CUPRA") return "SEAT / CUPRA";
  return brand;
}

export function generateStaticParams(): PageParams[] {
  return seoVehicles.map((vehicle) => ({
    brand: vehicleBrandSlug(vehicle),
    model: vehicleModelSlug(vehicle),
  }));
}

export function generateMetadata({ params }: { params: PageParams }): Metadata {
  const vehicle = findVehicleBySlugs(params.brand, params.model);
  if (!vehicle) return {};

  const name = `${shortBrand(vehicle.brand)} ${vehicle.model}`;
  const url = `${BASE}/fahrzeuge/${params.brand}/${params.model}`;
  const title = `${name} Codierung Leipzig | TD Fahrzeugcodierung`;
  const description = `Codierungen und Diagnose für ${name} in Leipzig-Süd oder per Remote. Fahrzeugbezogene Funktionen und Preise ansehen und Termin online konfigurieren.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "TD Fahrzeugcodierung",
      locale: "de_DE",
      type: "website",
    },
  };
}

export default function VehicleSeoPage({ params }: { params: PageParams }) {
  const vehicle = findVehicleBySlugs(params.brand, params.model);
  if (!vehicle) notFound();

  const codingIds = new Set(codingsForVehicle(vehicle));
  const codings = codingCatalog.filter((coding) => codingIds.has(coding.id));
  const serviceCodings = codings.filter((coding) => coding.id !== "diagnose");
  const years = vehicle.endYear >= 2026 ? `ab ${vehicle.startYear}` : `${vehicle.startYear}–${vehicle.endYear}`;
  const name = `${shortBrand(vehicle.brand)} ${vehicle.model}`;

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-blue-100 bg-white">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center" aria-label="TD Fahrzeugcodierung – Startseite">
            <img src="/td-logo-icon.png" alt="" className="h-10 w-auto" />
            <span className="ml-2 hidden text-sm font-black sm:inline">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/fahrzeuge" className="font-semibold text-slate-600 hover:text-blue-700">Alle Fahrzeuge</Link>
            <Link href="/#buchen" className="btn-primary px-4 py-2 text-sm">Termin buchen</Link>
          </div>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-blue-50/50">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-700">Startseite</Link>
            <span className="mx-2">/</span>
            <Link href="/fahrzeuge" className="hover:text-blue-700">Fahrzeuge</Link>
            <span className="mx-2">/</span>
            <span>{name}</span>
          </nav>

          <div className="mt-6 max-w-4xl">
            <div className="inline-flex rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-blue-700">{vehicle.platform} · {years}</div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{name} Codierung in Leipzig</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Codierungen und Fahrzeugdiagnose für den {name} – persönlich in Leipzig-Süd oder, je nach Funktion, per Remote. Die unten aufgeführten Leistungen stammen direkt aus unserem fahrzeugbezogenen Codierkatalog.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/#buchen" className="btn-primary w-full text-center sm:w-auto">Codierung auswählen & Preis berechnen</Link>
              <Link href="/#kontakt" className="btn-secondary w-full text-center sm:w-auto">Machbarkeit anfragen</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:gap-10">
          <div>
            <div className="max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Codiermöglichkeiten</div>
              <h2 className="mt-2 text-3xl font-black">Funktionen für {name}</h2>
              <p className="mt-3 leading-7 text-slate-600">Preise gelten je ausgewählter Funktion. Mehrere Codierungen werden auf der Hauptseite automatisch nach der aktuellen Rabattstaffel zusammengefasst.</p>
            </div>

            <div className="mt-8 space-y-9">
              {codingGroups.map((group) => {
                const list = serviceCodings.filter((coding) => coding.uiGroup === group);
                if (!list.length) return null;
                return (
                  <section key={group}>
                    <h3 className="text-xl font-black text-blue-700">{group}</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {list.map((coding) => (
                        <div key={coding.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div className="font-semibold leading-6">{coding.name}</div>
                            <div className="shrink-0 font-black">{coding.price} €</div>
                          </div>
                          {coding.hardware && <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-600"><b>Hardware:</b> {coding.hardware}</p>}
                          {coding.requirements && <p className="mt-2 text-xs leading-5 text-slate-600"><b>Hinweis:</b> {coding.requirements}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
              <h3 className="text-xl font-black">Fehlerdiagnose ebenfalls möglich</h3>
              <p className="mt-2 leading-7 text-slate-700">Steuergeräte auslesen, Fehlerspeicher prüfen und das Fehlerbild vorbewerten – aktuell für 39 €.</p>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-6">
            <h2 className="text-lg font-black">Fahrzeugdaten</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-slate-500">Marke</dt><dd className="font-semibold">{vehicle.brand}</dd></div>
              <div><dt className="text-slate-500">Baureihe</dt><dd className="font-semibold">{vehicle.model}</dd></div>
              <div><dt className="text-slate-500">Baujahre</dt><dd className="font-semibold">{years}</dd></div>
              <div><dt className="text-slate-500">Plattform</dt><dd className="font-semibold">{vehicle.platform}</dd></div>
            </dl>
            {vehicle.sfd1From && (
              <div className="mt-5 rounded-xl border border-blue-200 bg-white p-3 text-xs leading-5 text-slate-700">
                SFD ist bei dieser Baureihe ab Modelljahr {vehicle.sfd1From} relevant. Die konkrete Buchbarkeit wird in der Fahrzeugauswahl nach Baujahr gesteuert.
              </div>
            )}
            <Link href="/#buchen" className="btn-primary mt-5 w-full text-center">Jetzt konfigurieren</Link>
          </aside>
        </div>
      </section>

      <section className="border-t border-blue-100 bg-slate-50">
        <div className="container-x py-12 sm:py-16">
          <h2 className="text-2xl font-black">{name} codieren lassen</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">Wähle auf der Hauptseite zuerst Vor Ort oder Remote, anschließend Marke, Modell und Baujahr. Danach erscheinen ausschließlich die für diese Baureihe hinterlegten Codierungen inklusive Preisberechnung.</p>
          <Link href="/#buchen" className="btn-primary mt-6 inline-flex">Zur Fahrzeugauswahl</Link>
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container-x flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TD Fahrzeugcodierung</span>
          <div className="flex flex-wrap gap-5"><Link href="/fahrzeuge">Fahrzeuge</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
        </div>
      </footer>
    </main>
  );
}
