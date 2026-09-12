import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin, MessageCircle, ShieldCheck, Wrench } from "lucide-react";

export type SeoFaq = { question: string; answer: string };

export type SeoServicePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  benefits: string[];
  models?: string[];
  modelsTitle?: string;
  detailsTitle: string;
  details: string[];
  faq: SeoFaq[];
};

const whatsapp = "https://wa.me/4915563047044";

export default function SeoServicePage({
  eyebrow,
  title,
  intro,
  benefits,
  models,
  modelsTitle = "Häufig angefragte Modelle",
  detailsTitle,
  details,
  faq,
}: SeoServicePageProps) {
  return (
    <main className="bg-[#f7fbff] text-slate-900">
      <header className="border-b border-blue-100 bg-white">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center" aria-label="TD Fahrzeugcodierung – Startseite">
            <Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-10 w-auto" />
            <span className="ml-2 text-sm font-black sm:text-base">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
          </Link>
          <Link href="/fahrzeuge" className="text-sm font-bold text-blue-700 hover:underline">Fahrzeuge &amp; Preise</Link>
        </div>
      </header>

      <section className="border-b border-blue-100 bg-white">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[.16em] text-blue-600">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{intro}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/#buchen" className="btn-primary">Preis &amp; Termin konfigurieren</Link>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center justify-center gap-2"><MessageCircle className="h-4 w-4" /> Per WhatsApp anfragen</a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => {
            const Icon = [CheckCircle2, MapPin, Wrench, ShieldCheck][index % 4];
            return <div key={item} className="card p-5"><Icon className="h-6 w-6 text-blue-600" /><p className="mt-3 font-bold leading-6">{item}</p></div>;
          })}
        </div>
      </section>

      <section className="border-y border-blue-100 bg-white">
        <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">{detailsTitle}</h2>
            <div className="mt-5 space-y-4 text-slate-600">
              {details.map(item => <p key={item} className="leading-7">{item}</p>)}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">So läuft es ab</h2>
            <ol className="mt-5 space-y-4 text-slate-600">
              <li className="card p-4"><strong className="text-slate-900">1. Fahrzeug auswählen:</strong> Marke, Modell, Baujahr und gewünschte Funktion angeben.</li>
              <li className="card p-4"><strong className="text-slate-900">2. Machbarkeit prüfen:</strong> Steuergeräte, Softwarestand und vorhandene Hardware werden vor Durchführung berücksichtigt.</li>
              <li className="card p-4"><strong className="text-slate-900">3. Termin durchführen:</strong> Vor Ort in Leipzig-Süd oder – wenn technisch geeignet – per Remote.</li>
            </ol>
          </div>
        </div>
      </section>

      {models?.length ? (
        <section className="container-x py-12 sm:py-16">
          <h2 className="text-2xl font-black sm:text-3xl">{modelsTitle}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {models.map(model => <span key={model} className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{model}</span>)}
          </div>
          <Link href="/fahrzeuge" className="mt-6 inline-flex font-bold text-blue-700 hover:underline">Alle unterstützten Fahrzeuge und Preise ansehen →</Link>
        </section>
      ) : null}

      <section className="border-t border-blue-100 bg-white">
        <div className="container-x py-12 sm:py-16">
          <h2 className="text-2xl font-black sm:text-3xl">Häufige Fragen</h2>
          <div className="mt-6 space-y-3">
            {faq.map(item => (
              <details key={item.question} className="card p-5">
                <summary className="cursor-pointer font-bold">{item.question}</summary>
                <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-blue-100 bg-white">
        <div className="container-x flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TD Fahrzeugcodierung · Leipzig &amp; Remote</span>
          <div className="flex flex-wrap gap-4"><Link href="/">Startseite</Link><Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
        </div>
      </footer>
    </main>
  );
}
