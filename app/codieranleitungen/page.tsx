import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CreditCard, LockKeyhole, UserRound } from "lucide-react";
import GuideSelector from "../components/GuideSelector";
import GuideDifficultyBar from "../components/GuideDifficultyBar";
import { formatGuidePrice, guidePriceTiers } from "../lib/guidePricing";

export const metadata: Metadata = {
  title: "VCDS- und VCP-PDF-Anleitungen | TD Fahrzeugcodierung",
  description: "VCDS- und VCP-PDF-Anleitungen: Hersteller und Fahrzeug wählen, dann Codierungen, Assistenzsysteme, Nachrüstungen und Umbauten mit Preisen nach Schwierigkeit ansehen.",
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
        <div className="container-x py-6 sm:py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"><ArrowLeft size={16} aria-hidden="true" />Zur Startseite</Link>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700"><LockKeyhole size={15} aria-hidden="true" />PDF-Anleitungen</div>
          <h1 className="mt-3 max-w-3xl text-2xl font-black tracking-tight sm:text-3xl">VCDS- &amp; VCP-Codieranleitungen</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">Hersteller und Fahrzeug wählen, dann die Bereiche Codierungen, Assistenzsysteme, Nachrüstungen und Umbauten öffnen. PDF-Preise richten sich nach der Schwierigkeit der jeweiligen Anleitung.</p>
        </div>
      </section>

      <section className="container-x py-5 sm:py-7" aria-label="Anleitung und Fahrzeug auswählen">
        <GuideSelector />
      </section>

      <section className="container-x pb-8 sm:pb-12" aria-labelledby="anleitungen-preise">
        <div className="mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 id="anleitungen-preise" className="text-base font-black">PDF-Preise nach Schwierigkeit</h2>
          <p className="mt-1 text-xs text-slate-600">Acht Stufen in 2-Euro-Schritten, je nach Schwierigkeit der einzelnen Anleitung.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4 lg:grid-cols-8">
            {guidePriceTiers.map((price, index) => (
              <div key={price} className="rounded-lg bg-slate-50 px-2 py-2.5">
                <p className="text-xs font-semibold text-slate-600">Stufe {index + 1}</p>
                <p className="mt-1 text-base font-black text-blue-700">{formatGuidePrice(price)}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600" aria-label="Legende der Schwierigkeit">
            <span className="font-semibold">Schwierigkeit:</span>
            <GuideDifficultyBar level={1} />
            <GuideDifficultyBar level={2} />
            <GuideDifficultyBar level={3} />
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-slate-600">
            <CreditCard size={16} className="mt-1 shrink-0 text-blue-700" aria-hidden="true" />
            Geplante Einzelpreise für PDF-Anleitungen, nicht für die Durchführung am Fahrzeug. Der Kauf und geschützte Download werden erst nach erfolgreicher serverseitiger PayPal-Prüfung freigeschaltet.
          </p>
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
