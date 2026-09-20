import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { curateCodingEntries } from "../../../lib/codingDisplay";
import { codingCatalog, codingGroups, codingsForVehicle } from "../../../data/catalog";
import { priorityVehicleSeoByPath as prioritySeoByPath } from "../../../lib/priorityVehicleSeo";
import { findVehicleBySlugs, seoVehicles, vehicleBrandSlug, vehicleModelSlug } from "../../../lib/vehicleSeo";

const BASE = "https://td-fahrzeugcodierung.de";
type PageParams = { brand: string; model: string };

function shortBrand(brand: string): string {
  if (brand === "Volkswagen") return "VW";
  if (brand === "SEAT / CUPRA") return "SEAT / CUPRA";
  return brand;
}

function vehicleDisplayName(vehicle: (typeof seoVehicles)[number]): string {
  const brand = shortBrand(vehicle.brand);
  if (brand === "SEAT / CUPRA" && /^(SEAT|CUPRA)\s/i.test(vehicle.model)) return vehicle.model;
  return `${brand} ${vehicle.model}`;
}

function brandLanding(brand: string): { href: string; label: string } | null {
  if (brand === "Volkswagen") return { href: "/vw-codierung-leipzig", label: "VW Codierung Leipzig" };
  if (brand === "Audi") return { href: "/audi-codierung-leipzig", label: "Audi Codierung Leipzig" };
  if (brand === "Škoda") return { href: "/skoda-codierung-leipzig", label: "Škoda Codierung Leipzig" };
  if (brand === "SEAT / CUPRA") return { href: "/seat-codierung-leipzig", label: "SEAT / CUPRA Codierung Leipzig" };
  return null;
}

export function generateStaticParams(): PageParams[] {
  return seoVehicles.map((vehicle) => ({ brand: vehicleBrandSlug(vehicle), model: vehicleModelSlug(vehicle) }));
}

export async function generateMetadata(props: { params: Promise<PageParams> }): Promise<Metadata> {
  const params = await props.params;
  const vehicle = findVehicleBySlugs(params.brand, params.model);
  if (!vehicle) return {};

  const name = vehicleDisplayName(vehicle);
  const url = `${BASE}/fahrzeuge/${params.brand}/${params.model}`;
  const priority = prioritySeoByPath[`${params.brand}/${params.model}`];
  const fullTitle = priority?.title ?? `${name} Codierung Leipzig | TD`;
  const description = priority?.description ?? `Codierung und Diagnose für ${name} in Leipzig oder per Remote. Funktionen, Voraussetzungen und Preise prüfen und Termin direkt konfigurieren.`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title: fullTitle, description, url, siteName: "TD Fahrzeugcodierung", locale: "de_DE", type: "website" },
  };
}

export default async function VehicleSeoPage(props: { params: Promise<PageParams> }) {
  const params = await props.params;
  const vehicle = findVehicleBySlugs(params.brand, params.model);
  if (!vehicle) notFound();

  const seoKey = `${params.brand}/${params.model}`;
  const priority = prioritySeoByPath[seoKey];
  const name = vehicleDisplayName(vehicle);
  const years = vehicle.endYear >= 2026 ? `ab ${vehicle.startYear}` : `${vehicle.startYear}–${vehicle.endYear}`;
  const url = `${BASE}/fahrzeuge/${params.brand}/${params.model}`;
  const landing = brandLanding(vehicle.brand);
  const codingIds = new Set(codingsForVehicle(vehicle));
  const serviceCodings = curateCodingEntries(
    codingCatalog.filter((coding) => codingIds.has(coding.id) && coding.id !== "diagnose").map((coding) => ({ ...coding, source: "vehicle" as const }))
  );
  const relatedPriority = Object.entries(prioritySeoByPath)
    .filter(([key]) => key !== seoKey && key.startsWith(`${params.brand}/`))
    .slice(0, 5);
  const faq = priority
    ? [
        {
          question: `Welche Codierungen sind beim ${name} möglich?`,
          answer: `Das hängt von Baujahr, Ausstattung, Steuergeräten und Softwarestand ab. Besonders häufig werden ${priority.focus.slice(0, 3).join(", ")} geprüft. Die konkrete Machbarkeit wird vor der Durchführung bestätigt.`,
        },
        {
          question: `Kann der ${name} auch per Remote codiert werden?`,
          answer: "Für technisch geeignete Arbeiten ist Remote-Codierung möglich. Voraussetzung sind ein kompatibles Diagnoseinterface, ein Windows-PC, eine stabile Internetverbindung und eine Funktion, die sich sicher aus der Ferne umsetzen lässt.",
        },
        {
          question: `Was wird vor der Codierung beim ${name} geprüft?`,
          answer: "Geprüft werden die tatsächlich verbauten Steuergeräte, der Softwarestand, die vorhandene Hardware und – sofern relevant – Schutzmechanismen wie SFD. Dadurch werden ungeeignete oder nicht unterstützte Anpassungen vorab ausgeschlossen.",
        },
      ]
    : [];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${name} Codierung und Diagnose`,
        serviceType: ["Fahrzeugcodierung", "Fahrzeugdiagnose"],
        url,
        areaServed: { "@type": "City", name: "Leipzig" },
        provider: { "@type": "LocalBusiness", name: "TD Fahrzeugcodierung", url: BASE },
      },
      ...(faq.length
        ? [{ "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }]
        : []),
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="border-b border-blue-100 bg-white">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center" aria-label="TD Fahrzeugcodierung – Startseite">
            <Image src="/td-logo-icon.png" alt="TD Fahrzeugcodierung Logo" width={128} height={85} className="h-10 w-auto" priority />
            <span className="ml-2 whitespace-nowrap text-xs font-black sm:text-sm">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
          </Link>
          <Link href="/fahrzeuge" className="text-sm font-semibold text-slate-600 hover:text-blue-700">Alle Fahrzeuge</Link>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-blue-50/50">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-700">Startseite</Link><span className="mx-2">/</span>
            <Link href="/fahrzeuge" className="hover:text-blue-700">Fahrzeuge</Link><span className="mx-2">/</span><span>{name}</span>
          </nav>
          <div className="mt-6 max-w-4xl">
            <div className="inline-flex rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-blue-700">{vehicle.platform} · {years}</div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{name} Codierung in Leipzig</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{priority?.intro ?? `Codierungen und Fahrzeugdiagnose für den ${name} – persönlich in Leipzig-Süd oder, je nach Funktion, per Remote. Die verfügbaren Leistungen werden fahrzeugbezogen geprüft.`}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/#buchen" className="btn-primary w-full text-center sm:w-auto">Codierung auswählen & Preis berechnen</Link>
              <Link href="/#kontakt" className="btn-secondary w-full text-center sm:w-auto">Machbarkeit anfragen</Link>
              {landing ? <Link href={landing.href} className="btn-secondary w-full text-center sm:w-auto">{landing.label}</Link> : null}
            </div>
          </div>
        </div>
      </section>

      {priority ? (
        <section className="container-x py-10 sm:py-12">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Häufig geprüft</div>
            <h2 className="mt-2 text-2xl font-black">Typische Themen beim {priority.label}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {priority.focus.map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-semibold leading-6 text-slate-800">{item}</div>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">Die Auflistung beschreibt typische Prüf- und Codierthemen. Ob eine konkrete Funktion verfügbar ist, hängt immer von der tatsächlichen Fahrzeugausstattung ab.</p>
          </div>
        </section>
      ) : null}

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
                          <div className="flex items-start justify-between gap-4"><div className="font-semibold leading-6">{coding.name}</div><div className="shrink-0 font-black">{coding.price} €</div></div>
                          {coding.hardware && <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-600"><b>Hardware:</b> {coding.hardware}</p>}
                          {coding.requirements && <p className="mt-2 text-xs leading-5 text-slate-600"><b>Hinweis:</b> {coding.requirements}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-2xl font-black">Technische Vorprüfung beim {name}</h2>
              <p className="mt-3 leading-7 text-slate-600">Der {name} gehört zur Plattform {vehicle.platform} und wurde {years} angeboten. Vor einer Codierung prüfen wir die tatsächlich verbauten Steuergeräte, den Softwarestand und die vorhandene Hardware. So lassen sich nicht unterstützte Funktionen vorab ausschließen.</p>
              <p className="mt-3 leading-7 text-slate-600">Je nach gewünschter Funktion erfolgt die Umsetzung über Codierung, Anpassung oder Grundeinstellung. Für Remote-Termine wird zusätzlich geprüft, ob Diagnoseinterface und Verbindung für die jeweilige Arbeit geeignet sind.</p>
              {vehicle.sfd1From && <p className="mt-3 leading-7 text-slate-600">Ab Modelljahr {vehicle.sfd1From} kann bei dieser Baureihe SFD relevant sein. Ob eine SFD-Freischaltung benötigt wird, hängt vom konkreten Steuergerät und der gewünschten Anpassung ab.</p>}
            </section>

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
            {vehicle.sfd1From && <div className="mt-5 rounded-xl border border-blue-200 bg-white p-3 text-xs leading-5 text-slate-700">SFD ist bei dieser Baureihe ab Modelljahr {vehicle.sfd1From} relevant. Die konkrete Buchbarkeit wird nach Baujahr und Steuergerät geprüft.</div>}
            <Link href="/#buchen" className="btn-primary mt-5 w-full text-center">Jetzt konfigurieren</Link>
          </aside>
        </div>
      </section>

      {priority && faq.length ? (
        <section className="border-t border-blue-100 bg-white">
          <div className="container-x py-12 sm:py-16">
            <h2 className="text-2xl font-black sm:text-3xl">Häufige Fragen zum {priority.label}</h2>
            <div className="mt-6 space-y-3">
              {faq.map((item) => <details key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-7 text-slate-600">{item.answer}</p></details>)}
            </div>
          </div>
        </section>
      ) : null}

      {priority && (relatedPriority.length || landing) ? (
        <section className="border-t border-blue-100 bg-slate-50">
          <div className="container-x py-12 sm:py-16">
            <h2 className="text-2xl font-black">Weitere passende Fahrzeugseiten</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {landing ? <Link href={landing.href} className="rounded-xl border border-blue-200 bg-white px-4 py-3 font-bold text-blue-700 hover:border-blue-300">{landing.label}</Link> : null}
              {relatedPriority.map(([key, item]) => <Link key={key} href={`/fahrzeuge/${key}`} className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">{item.label}</Link>)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-blue-100 bg-slate-50">
        <div className="container-x py-12 sm:py-16">
          <h2 className="text-2xl font-black">{name} codieren lassen</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">Wähle auf der Hauptseite Vor Ort oder Remote, anschließend Marke, Modell und Baujahr. Danach erscheinen die für diese Baureihe hinterlegten Codierungen inklusive Preisberechnung.</p>
          <Link href="/#buchen" className="btn-primary mt-6 inline-flex">Zur Fahrzeugauswahl</Link>
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container-x flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TD Fahrzeugcodierung</span>
          <div className="flex flex-wrap gap-5"><Link href="/fahrzeuge">Fahrzeuge</Link><Link href="/fahrzeugcodierung-leipzig">Fahrzeugcodierung Leipzig</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
        </div>
      </footer>
    </main>
  );
}
