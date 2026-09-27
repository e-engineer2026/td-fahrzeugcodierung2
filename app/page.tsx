import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import BookingConfigurator from "./components/BookingConfigurator";
import ContactBox from "./components/ContactBox";
import HeaderBookingSummary from "./components/HeaderBookingSummary";

const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=TD-Fahrzeugcodierung&query_place_id=ChIJbx46otT5pkcRX9IqdbeMmdU";

export default function Home(){
 return <main>
  <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
    <div className="container-x flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
      <a href="#" className="flex min-w-0 items-center" aria-label="TD Fahrzeugcodierung – Startseite">
        <Image src="/td-logo-icon.png" alt="TD" width={225} height={80} className="h-8 w-auto sm:h-10" priority />
        <span className="ml-2 whitespace-nowrap text-xs font-black text-slate-950 sm:text-base"><span className="text-blue-600">Fahrzeugcodierung</span></span>
      </a>
      <nav className="hidden gap-6 text-sm text-slate-600 md:flex"><Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link><a href="#buchen">Codierungen</a><a href="#kontakt">Kontakt</a><a href="#faq">FAQ</a></nav>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <HeaderBookingSummary />
        <a href="#kontakt" className="hidden items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 lg:inline-flex">Direkt anfragen</a>
      </div>
    </div>
  </header>

  <section className="w-full border-y border-blue-950 bg-slate-950 text-white" aria-label="Automatischer Rabatt bei Konfiguration">
    <div className="container-x flex flex-col items-center justify-center gap-1 py-2.5 text-center sm:flex-row sm:flex-wrap sm:gap-x-3 sm:py-3">
      <strong className="text-sm font-black sm:text-base">Automatischer Rabatt bei Konfiguration</strong>
      <span className="text-sm font-bold text-sky-300 sm:text-base">5 % ab 50 € · 10 % ab 100 € · 15 % ab 150 € · 20 % ab 200 €</span>
    </div>
  </section>

  <section className="hero-grid overflow-hidden border-b border-blue-100">
    <div className="container-x py-8 sm:py-12 lg:py-14">
      <div className="grid items-center gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.25rem]">Fahrzeugcodierung &amp; Diagnose in Leipzig</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">Codierung und Diagnose für Volkswagen, Audi, Škoda, SEAT und CUPRA – mit transparenter Kalkulation und direkter Terminbuchung.</p>

          <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
            <a href="#buchen" className="btn-primary w-full sm:w-auto">Fahrzeug jetzt auswählen <span aria-hidden="true" className="ml-2">→</span></a>
            <Link href="/fahrzeuge" className="btn-secondary w-full sm:w-auto">Fahrzeuge &amp; Preise</Link>
          </div>
          <Link href="/steuergeraete-flash" className="mt-3 inline-flex rounded-md py-1 text-sm font-bold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">Steuergeräte-Flash &amp; Softwareupdate</Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_22px_55px_rgba(15,40,75,0.14)] sm:rounded-3xl">
          <Image src="/td-hero-performance.webp" alt="Roter Performancewagen in einer hellen Studio-Szene mit blauen Lichtakzenten" width={1400} height={934} sizes="(max-width: 1024px) 100vw, 56vw" className="aspect-[1.55/1] w-full object-cover" priority />
          <a href={googleMapsUrl} target="_blank" rel="noreferrer" aria-label="Standort in Leipzig-Süd in Google Maps öffnen" className="absolute bottom-[52px] left-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur transition hover:border-blue-400 hover:text-blue-700 sm:bottom-[60px] sm:left-4 sm:px-4 sm:py-2 sm:text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white"><MapPin className="h-4 w-4" /></span>
            <span>Standort Leipzig-Süd</span>
          </a>
          <div className="absolute bottom-3 left-3 rounded-lg border border-white/70 bg-white/90 px-3 py-2 text-xs font-bold text-slate-800 shadow-sm backdrop-blur sm:bottom-4 sm:left-4 sm:px-4 sm:py-2.5 sm:text-sm">
            Vor Ort in Leipzig <span className="px-1 text-blue-600">·</span> Remote deutschlandweit
          </div>
        </div>
      </div>

    </div>
  </section>

  <section id="buchen" className="container-x scroll-mt-20 py-8 sm:py-14 lg:py-16"><div className="max-w-3xl"><h2 className="text-2xl font-black leading-tight sm:text-4xl">Fahrzeug konfigurieren &amp; Termin prüfen</h2><p className="mt-2 leading-6 text-slate-600 sm:mt-3 sm:leading-7">Fahrzeug auswählen, gewünschte Codierungen zusammenstellen und den Termin direkt konfigurieren.</p></div><div className="mt-5 sm:mt-7"><BookingConfigurator/></div></section>

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

  <footer className="border-t border-blue-100 bg-white"><div className="container-x flex flex-col gap-5 py-8 text-sm text-slate-500 sm:py-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><Image src="/td-logo-icon.png" alt="TD Fahrzeugcodierung Logo" width={128} height={85} className="h-9 w-auto"/><span>© 2026 TD Fahrzeugcodierung</span></div><div className="flex flex-wrap gap-x-5 gap-y-3"><Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link><a href={googleMapsUrl} target="_blank" rel="noreferrer">Google-Profil</a><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/widerruf">Widerruf</Link><Link href="/agb">AGB</Link></div></div><nav aria-label="Leistungen und Marken" className="flex flex-wrap gap-x-5 gap-y-2 border-t border-blue-50 pt-4 text-xs sm:text-sm"><Link href="/fahrzeugcodierung-leipzig">Fahrzeugcodierung Leipzig</Link><Link href="/vw-codierung-leipzig">VW Codierung Leipzig</Link><Link href="/audi-codierung-leipzig">Audi Codierung Leipzig</Link><Link href="/skoda-codierung-leipzig">Škoda Codierung Leipzig</Link><Link href="/assistenzsysteme-codieren-leipzig">Assistenzsysteme</Link><Link href="/vcds-codierung-leipzig">VCDS Codierung</Link><Link href="/vcp-codierung-leipzig">VCP Codierung</Link><Link href="/remote-fahrzeugcodierung">Remote</Link></nav></div></footer>
 </main>
}
