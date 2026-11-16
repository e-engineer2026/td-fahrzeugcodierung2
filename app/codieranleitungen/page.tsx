import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CreditCard, FileText, LockKeyhole, UserRound } from "lucide-react";
import GuideSelector from "../components/GuideSelector";

export const metadata: Metadata = {
  title: "VCDS- und VCP-PDF-Anleitungen | TD Fahrzeugcodierung",
  description: "VCDS- und VCP-Codieranleitungen: Hersteller auswählen, alle hinterlegten Modelle als Liste anzeigen und nach Fahrzeugwahl Codieranleitungen mit PDF-Preisen sehen.",
  alternates: { canonical: "/codieranleitungen" },
  // Erst indexieren, wenn die ersten tatsächlich kaufbaren PDFs bereitstehen.
  robots: { index: false, follow: true },
};

export default function CodieranleitungenPage() {
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
            <Link href="/codieranleitungen" aria-current="page" className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700" title="PDF-Codieranleitungen" aria-label="PDF-Codieranleitungen"><LockKeyhole size={23} aria-hidden="true" /></Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-white">
        <div className="container-x py-10 sm:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"><ArrowLeft size={16} aria-hidden="true" />Zur Startseite</Link>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700"><LockKeyhole size={15} aria-hidden="true" />PDF-Anleitungen</div>
          <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">VCDS- &amp; VCP-Codieranleitungen</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">Wähle zunächst den Hersteller und dann dein Fahrzeug aus der vollständigen Modellliste. Anschließend werden die zugeordneten Codierungen mit PDF-Preisen angezeigt. Die Anleitungen sind in Vorbereitung.</p>
        </div>
      </section>

      <section className="container-x py-9 sm:py-12" aria-label="Anleitung und Fahrzeug auswählen">
        <GuideSelector />
      </section>

      <section className="container-x pb-14 sm:pb-20" aria-labelledby="anleitungen-preise">
        <div className="mx-auto max-w-4xl rounded-2xl border border-blue-100 bg-blue-50/60 p-6 sm:p-8">
          <h2 id="anleitungen-preise" className="text-2xl font-black">Geplante PDF-Preise</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-white p-5">
              <FileText className="text-blue-700" aria-hidden="true" />
              <h3 className="mt-3 font-bold">Einfache Codieranleitungen</h3>
              <p className="mt-1 text-3xl font-black">6,99 €</p>
              <p className="mt-2 text-sm text-slate-600">Einzelne Codierungen und überschaubare Anpassungen.</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white p-5">
              <FileText className="text-blue-700" aria-hidden="true" />
              <h3 className="mt-3 font-bold">Aufwändige Codieranleitungen</h3>
              <p className="mt-1 text-3xl font-black">14,99 €</p>
              <p className="mt-2 text-sm text-slate-600">Umfangreichere Abläufe und mehrere Steuergeräte.</p>
            </div>
          </div>
          <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-slate-600"><CreditCard className="mt-0.5 shrink-0 text-blue-700" size={18} aria-hidden="true" />PayPal-Zahlung und geschützter PDF-Download werden erst aktiviert, wenn die Zahlungsbestätigung serverseitig geprüft wird. Bis dahin ist kein Kauf möglich.</p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-7 text-sm text-slate-500">
          <span>© 2026 TD Fahrzeugcodierung</span>
          <nav className="flex flex-wrap gap-5" aria-label="Rechtliches"><Link href="/">Startseite</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/widerruf">Widerruf</Link></nav>
        </div>
      </footer>
    </main>
  );
}
