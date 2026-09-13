import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import BookingConfigurator from "./components/BookingConfigurator";
import ConfiguratorLiveActions from "./components/ConfiguratorLiveActions";
import ContactBox from "./components/ContactBox";
import HeaderBookingSummary from "./components/HeaderBookingSummary";

const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=TD-Fahrzeugcodierung&query_place_id=ChIJbx46otT5pkcRX9IqdbeMmdU";

export default function Home(){
 return <main>
  <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
    <div className="container-x flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
      <a href="#" className="flex min-w-0 items-center" aria-label="TD Fahrzeugcodierung – Startseite">
        <Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-9 w-auto sm:h-11" priority />
        <span className="ml-2 whitespace-nowrap text-xs font-black text-slate-950 sm:text-base">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
      </a>
      <nav className="hidden gap-6 text-sm text-slate-600 md:flex"><Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link><a href="#buchen">Codierungen</a><a href="#kontakt">Kontakt</a><a href="#faq">FAQ</a></nav>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <HeaderBookingSummary />
        <a href="#kontakt" className="hidden items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 lg:inline-flex">Direkt anfragen</a>
      </div>
    </div>
  </header>

  <section className="w-full border-b border-red-700 bg-red-600 text-white" aria-label="Automatischer Rabatt bei Konfiguration">
    <div className="container-x flex flex-col items-center justify-center gap-1 py-2.5 text-center sm:flex-row sm:flex-wrap sm:gap-x-3 sm:py-3">
      <strong className="text-sm font-black sm:text-base">Automatischer Rabatt bei Konfiguration</strong>
      <span className="text-sm font-bold sm:text-base">10 % ab 50 € · 15 % ab 100 € · 20 % ab 200 €</span>
    </div>
  </section>

  <section className="hero-grid border-b border-blue-100 bg-white">
    <div className="container-x py-8 sm:py-12 lg:py-16">
      <div className="max-w-5xl">
        <div className="max-w-[620px]">
          <div className="min-w-0"><div className="text-4xl font-black leading-none tracking-tight sm:text-6xl"><span className="text-slate-950">TD</span> <span className="text-blue-600">Fahrzeugcodierung</span></div><div className="mt-2 h-1 w-full rounded-full bg-blue-600 sm:mt-3" /></div>
        </div>
        <h1 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:mt-4 sm:text-2xl">Fahrzeugcodierung &amp; Diagnose in Leipzig – auch per Remote</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">Codierung und Diagnose für Volkswagen, Audi, SEAT, CUPRA und Škoda – mit Fahrzeugauswahl, transparenter Kalkulation und direkter Terminbuchung.</p>

        <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
          <a href="#konfigurator" className="btn-primary w-full sm:w-auto">Konfigurator Codierung</a>
          <Link href="/fahrzeuge" className="btn-secondary w-full sm:w-auto">Fahrzeuge &amp; Preise</Link>
          <Link href="/steuergeraete-flash" className="btn-secondary w-full sm:w-auto">Steuergeräte-Flash &amp; Softwareupdate</Link>
        </div>
      </div>
    </div>
  </section>

  <section className="container-x py-8 sm:py-10" aria-labelledby="standort-heading">
    <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="card flex flex-col gap-4 p-5 transition hover:border-blue-300 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-4">
        <MapPin className="mt-0.5 h-7 w-7 shrink-0 text-blue-600" />
        <div>
          <h2 id="standort-heading" className="text-xl font-black sm:text-2xl">Standort in Leipzig-Süd</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">TD Fahrzeugcodierung · Schenkendorfstraße 33 · 04275 Leipzig</p>
        </div>
      </div>
      <span className="shrink-0 text-sm font-bold text-blue-700">Google-Unternehmensprofil öffnen →</span>
    </a>
  </section>

  <section id="buchen" className="container-x scroll-mt-20 py-8 sm:py-14 lg:py-16"><div className="max-w-3xl"><h2 className="text-2xl font-black leading-tight sm:text-4xl">Fahrzeug prüfen &amp; Termin konfigurieren.</h2><p className="mt-2 leading-6 text-slate-600 sm:mt-3 sm:leading-7">Fahrzeug auswählen, gewünschte Codierungen zusammenstellen und den Termin direkt konfigurieren.</p></div><div className="mt-5 sm:mt-7"><BookingConfigurator/><ConfiguratorLiveActions /></div></section>

  <section id="kontakt" className="scroll-mt-20 border-y border-blue-100 bg-white">
    <div className="container-x py-14 sm:py-20">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">Kontakt &amp; Vorprüfung</div>
        <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Unsicher, ob deine Codierung möglich ist?</h2>
        <p className="mt-4 leading-7 text-slate-600">Sende Fahrzeug, Baujahr und gewünschte Funktion zur Vorprüfung – direkt per WhatsApp oder über das Kontaktformular.</p>
      </div>
      <div className="mt-8 sm:mt-10"><ContactBox /></div>
    </div>
  </section>

  <section id="faq" className="scroll-mt-20 border-t border-blue-100 bg-white"><div className="container-x py-14 sm:py-20 lg:py-24"><h2 className="text-3xl font-black sm:text-4xl">FAQ</h2><div className="mt-6 space-y-3 sm:mt-8">
   <details className="card p-5 sm:p-6"><summary className="cursor-pointer font-bold">Was brauche ich für Remote?</summary><p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">Ein eigenes kompatibles Diagnoseinterface (z. B. VCDS, VCP oder OBD11), Windows-PC/Laptop, stabile Internetverbindung und eine vor dem Termin vereinbarte Remote-Software.</p></details>
   <details className="card p-5 sm:p-6"><summary className="cursor-pointer font-bold">Sind alle Funktionen garantiert möglich?</summary><p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">Nein. Die Machbarkeit hängt von Hardware, Steuergeräten, Softwarestand und Fahrzeugkonfiguration ab und wird vor Durchführung geprüft.</p></details>
   <details className="card p-5 sm:p-6"><summary className="cursor-pointer font-bold">Wie bezahle ich?</summary><p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">Vor Ort bar, per PayPal oder per Sofortüberweisung beim Termin. Remote per PayPal: 70 % vor Beginn und 30 % nach Durchführung der vereinbarten Codierung.</p></details>
  </div></div></section>

  <footer className="border-t border-blue-100 bg-white"><div className="container-x flex flex-col gap-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:py-10"><div className="flex items-center gap-3"><Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-9 w-auto"/><span>© 2026 TD Fahrzeugcodierung</span></div><div className="flex flex-wrap gap-x-5 gap-y-3"><Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link><a href={googleMapsUrl} target="_blank" rel="noreferrer">Google-Profil</a><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/widerruf">Widerruf</Link><Link href="/agb">AGB</Link></div></div></footer>
 </main>
}
