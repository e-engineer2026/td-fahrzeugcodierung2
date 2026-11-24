import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ChevronDown, LockKeyhole, UserRound } from "lucide-react";
import { SFD1_CONTROL_UNITS, SFD1_ENGINE_EXCEPTION, SFD_VEHICLES } from "../lib/sfdProtection";

export default function GuideCatalogPage({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const sfdOverview = (
    <details className="group mt-3 max-w-4xl rounded-xl border border-slate-200 bg-white text-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        SFD-Fahrzeug- und Steuergeräteübersicht
        <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-slate-200 px-4 pb-4 pt-3">
        <h2 className="font-bold text-slate-900">Steuergeräte mit möglichem SFD (1)</h2>
        <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs leading-5 text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
          {SFD1_CONTROL_UNITS.map((unit) => (
            <li key={unit.address}><strong className="text-slate-900">{unit.address}</strong> – {unit.name}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs leading-5 text-slate-600">{SFD1_ENGINE_EXCEPTION}</p>
        <h2 className="mt-5 font-bold text-slate-900">Fahrzeugmodelle und Beginn des SFD-Schutzes</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {SFD_VEHICLES.map((entry) => (
            <div key={entry.catalogKey} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs leading-5">
              <p className="font-semibold text-slate-900">{entry.brand} {entry.name}</p>
              <p className="text-slate-600">
                {[
                  entry.sfd1 ? `SFD (1) ab Bj. ${entry.sfd1}` : null,
                  entry.sfd2 ? `SFD (2) ab Bj. ${entry.sfd2}` : null,
                ].filter(Boolean).join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </details>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-x flex min-h-16 items-center justify-between gap-3 py-2">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="TD Fahrzeugcodierung – Startseite">
            <Image src="/td-logo-status.webp" alt="" width={110} height={74} className="h-10 w-auto" priority />
            <span className="hidden text-sm font-black sm:inline">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Konto und Anleitungen">
            <Link href="/konto" className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700" title="Mein Konto" aria-label="Mein Konto"><UserRound size={23} aria-hidden="true" /></Link>
            <Link href={admin ? "/konto/pdf-verwaltung" : "/codieranleitungen"} aria-current="page" className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700" title="PDF-Codieranleitungen" aria-label="PDF-Codieranleitungen"><LockKeyhole size={23} aria-hidden="true" /></Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-white">
        <div className="container-x py-6 sm:py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"><ArrowLeft size={16} aria-hidden="true" />Zur Startseite</Link>
          <div className="mt-4 ml-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 sm:ml-4"><LockKeyhole size={15} aria-hidden="true" />PDF-Anleitungen</div>
          <h1 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-3xl">Download PDF-Anleitungen</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">Professionelle Codieranleitungen für qualifizierte Fachkräfte.</p>
          <details className="group mt-5 max-w-4xl overflow-hidden rounded-xl border-2 border-amber-400 bg-amber-50 text-sm leading-6 text-amber-950" role="note" aria-label="Sicherheitshinweise und Haftungsausschluss">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 font-bold marker:hidden hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-700 [&::-webkit-details-marker]:hidden">
              <AlertTriangle size={23} className="shrink-0 text-amber-700" aria-hidden="true" />
              <span className="flex-1">Sicherheitshinweise &amp; Haftungsausschluss</span>
              <ChevronDown size={20} className="shrink-0 text-amber-700 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="border-t border-amber-300 px-4 pb-4 pt-3">
              <p className="font-black">Ausschließlich für professionelle Anwender</p>
              <p className="mt-1">Diese technischen Informationen richten sich ausschließlich an qualifizierte Fachkräfte und Fachbetriebe mit Erfahrung in Fahrzeugdiagnose, Codierung und Steuergeräteprogrammierung. Vor jeder Änderung sind der Fahrzeugzustand, die Teilenummern, der Softwarestand, die Freigaben und eine Sicherung der Originaldaten zu prüfen. Sicherheits- und zulassungsrelevante Arbeiten dürfen nur berechtigt und nach Herstellervorgaben durchgeführt werden.</p>
              <p className="mt-3 font-bold">Haftungsausschluss und Sicherheitshinweis</p>
              <p className="mt-1">Die Angaben sind allgemeine technische Orientierung und keine Garantie für Funktion, Zulässigkeit oder Eignung im konkreten Fahrzeug. Umsetzung und Prüfung erfolgen in eigener fachlicher Verantwortung. Soweit gesetzlich zulässig, übernimmt TD Fahrzeugcodierung keine Haftung für Schäden aus unsachgemäßer, unberechtigter oder fehlerhafter Anwendung. Unberührt bleiben zwingende gesetzliche Haftungsansprüche, insbesondere bei Vorsatz, grober Fahrlässigkeit sowie Verletzung von Leben, Körper oder Gesundheit.</p>
            </div>
          </details>

          {admin && sfdOverview}
        </div>
      </section>

      {children}

      {!admin && (
        <div className="container-x pb-7">
          <div className="mx-auto max-w-5xl">{sfdOverview}</div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-7 text-sm text-slate-500">
          <span>© 2026 TD Fahrzeugcodierung</span>
          <nav className="flex flex-wrap gap-5" aria-label="Rechtliches"><Link href="/">Startseite</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/widerruf">Widerruf</Link></nav>
        </div>
      </footer>
    </main>
  );
}
