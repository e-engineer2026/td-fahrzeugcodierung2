import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, CircleAlert, Cpu, FileSearch, Laptop, MapPin, Wrench } from "lucide-react";
import FlashInquiryForm from "./FlashInquiryForm";

export const metadata: Metadata = {
  title: "Testseite Steuergeräte-Flash",
  description: "Testseite zur Vorprüfung von Steuergeräte-Flash und Softwareupdates.",
  robots: { index: false, follow: false },
};

const services = [
  "Softwarestand und Flashbarkeit prüfen",
  "Herstellerkonforme Softwareupdates",
  "Fehlerhafte Flashvorgänge prüfen",
  "Codierung und Grundeinstellung danach",
];

export default function FlashTestPage() {
  return (
    <main className="min-h-screen bg-[#f4f8ff]">
      <header className="border-b border-blue-100 bg-white">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center" aria-label="Zurück zur Startseite">
            <Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-10 w-auto" priority />
            <span className="ml-2 whitespace-nowrap text-sm font-black text-slate-950 sm:text-base">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
          </Link>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-800">Testseite</span>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-white">
        <div className="container-x py-6 sm:py-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Startseite
          </Link>
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-12">
            <div className="lg:sticky lg:top-8">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[.15em] text-blue-700">
                <Cpu className="mr-2 h-4 w-4" /> Neuer Service
              </div>
              <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
                Steuergeräte-Flash <span className="text-blue-600">&amp; Softwareupdates</span>
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Prüfung, Aktualisierung und Wiederherstellung von Steuergerätesoftware für Volkswagen, Audi, Škoda, SEAT und CUPRA.
              </p>

              <div className="mt-7 rounded-3xl border border-blue-100 bg-[#f8fbff] p-5 sm:p-6">
                <h2 className="text-xl font-black text-slate-950">Leistungen</h2>
                <ul className="mt-4 space-y-3">
                  {services.map(service => (
                    <li key={service} className="flex gap-3 text-sm leading-6 text-slate-700 sm:text-base">
                      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700"><Check className="h-3.5 w-3.5" /></span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-white p-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <b className="mt-2 block">Vor Ort in Leipzig</b>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">Mit geeigneter Stromversorgung und Diagnosehardware.</span>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-white p-4">
                  <Laptop className="h-5 w-5 text-blue-600" />
                  <b className="mt-2 block">Remote nach Prüfung</b>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">Nur wenn Fahrzeug, Hardware und Verbindung geeignet sind.</span>
                </div>
              </div>
            </div>

            <FlashInquiryForm />
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="card p-5 sm:p-8">
            <div className="flex items-center gap-3"><FileSearch className="h-6 w-6 text-blue-600" /><h2 className="text-2xl font-black">So läuft die Vorprüfung ab</h2></div>
            <ol className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ["1", "Daten senden", "Fahrzeug, Steuergerät und Softwarestand übermitteln."],
                ["2", "Machbarkeit prüfen", "Passenden Datenstand und benötigtes Verfahren bestimmen."],
                ["3", "Angebot erhalten", "Einschätzung, Terminoption und Preis abstimmen."],
              ].map(([number, title, text]) => (
                <li key={number} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 font-black text-white">{number}</span>
                  <b className="mt-4 block">{title}</b>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </li>
              ))}
            </ol>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-8">
            <div className="flex items-center gap-3 text-amber-900"><CircleAlert className="h-6 w-6" /><h2 className="text-2xl font-black">Wichtiger Hinweis</h2></div>
            <p className="mt-4 leading-7 text-amber-950/80">Der Preis wird erst nach technischer Prüfung festgelegt. Entscheidend sind Steuergerät, vorhandener Softwarestand, Datenverfügbarkeit und Arbeitsaufwand.</p>
          </aside>
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container-x flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><Wrench className="h-4 w-4 text-blue-600" /> VCP · ODIS · technische Vorprüfung</div>
          <div className="flex gap-5"><Link href="/datenschutz">Datenschutz</Link><Link href="/impressum">Impressum</Link></div>
        </div>
      </footer>
    </main>
  );
}
