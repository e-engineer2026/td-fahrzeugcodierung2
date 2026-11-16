import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, FileText, LockKeyhole, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "PDF-Codieranleitungen für VCDS & VCP | TD Fahrzeugcodierung" },
  description: "Der künftige PDF-Shop für VCDS- und VCP-Codieranleitungen von TD Fahrzeugcodierung. Dokumentierte Schritte, Voraussetzungen und Sicherheitshinweise.",
  alternates: { canonical: "/codieranleitungen" },
  // Do not index a shop that is not ready to accept purchases.
  robots: { index: false, follow: true },
};

const categories = [
  {
    title: "VCDS-Anleitungen",
    short: "VCDS",
    description: "Modellbezogene Schritt-für-Schritt-Anleitungen für Codierungen und Anpassungen mit VCDS.",
    features: [
      "Benötigte Steuergeräte und Hardwarevoraussetzungen",
      "Codier- oder Anpassungsschritte mit Hinweisen",
      "Datensicherung und Kontrolle nach der Änderung",
    ],
  },
  {
    title: "VCP-Anleitungen",
    short: "VCP",
    description: "Dokumentierte Abläufe für Codierungen, Anpassungen und unterstützte VCP-Funktionen.",
    features: [
      "Steuergeräte- und Softwarevoraussetzungen",
      "Schrittfolgen und erforderliche Sicherungen",
      "Hinweise zu Risiken und Kompatibilität",
    ],
  },
] as const;

export default function CodieranleitungenPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-900">
      <div className="container-x pt-8 sm:pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Zurück zur Startseite
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl bg-slate-900 px-6 py-9 text-white sm:px-10 sm:py-12" aria-labelledby="guides-title">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-200">
            <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            Geschützter PDF-Bereich
          </p>
          <h1 id="guides-title" className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            Codieranleitungen für VCDS und VCP
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Praxistaugliche Anleitungen als digitale PDF-Dateien. Künftig kannst du einzelne Anleitungen kaufen und nach bestätigter Zahlung in deinem Kundenkonto herunterladen.
          </p>
          <span className="mt-6 inline-flex items-center rounded-full border border-slate-500 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100">
            Verkauf und Downloads in Vorbereitung
          </span>
        </section>

        <section className="mt-10" aria-labelledby="guide-categories">
          <h2 id="guide-categories" className="text-2xl font-black tracking-tight sm:text-3xl">Anleitungen nach Diagnosewerkzeug</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Jede Anleitung wird einer konkreten Funktion und den unterstützten Fahrzeugen zugeordnet. Preise werden pro PDF ausgewiesen, sobald die ersten Anleitungen verfügbar sind.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {categories.map((category) => (
              <article key={category.short} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-800">
                    <FileText aria-hidden="true" className="h-5 w-5" />
                    {category.short}
                  </span>
                  <LockKeyhole aria-label="Noch nicht zum Kauf freigegeben" className="h-5 w-5 text-slate-500" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold">{category.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{category.description}</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                    Einzelpreise und Kaufoption folgen
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6" aria-label="Information zu sicheren Downloads">
          <ShieldCheck aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-blue-700" />
          <div>
            <h2 className="text-lg font-bold">Sicherer Kauf und geschützter Download</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Die späteren PDF-Dateien werden nicht frei auf der Website veröffentlicht. Erst nach verifizierter Bezahlung wird die gekaufte Anleitung dem angemeldeten Kundenkonto zugeordnet und zum Download freigegeben.
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Eine Anleitung ersetzt nicht die Prüfung von Hardware, Softwarestand, Steuergerät oder gesetzlichen Vorgaben. VCDS und VCP sind Bezeichnungen der jeweiligen Anbieter.
            </p>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sign-in?redirect_url=%2Fkonto" className="btn-primary">Zum Kundenkonto</Link>
          <Link href="/fahrzeuge" className="btn-secondary">Fahrzeuge und Codierungen ansehen</Link>
        </div>
      </div>
    </main>
  );
}
