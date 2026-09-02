import { Laptop, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookingConfigurator from "./components/BookingConfigurator";
import ContactBox from "./components/ContactBox";

export default function Home(){
 return <main className="pb-24 md:pb-0">
  <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
    <div className="container-x flex h-14 items-center justify-between gap-3 sm:h-16">
      <a href="#" className="flex min-w-0 items-center" aria-label="TD Fahrzeugcodierung – Startseite">
        <Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-9 w-auto sm:h-11" priority />
        <span className="ml-2 whitespace-nowrap text-xs font-black text-slate-950 sm:text-base">TD <span className="text-blue-600">Fahrzeugcodierung</span></span>
      </a>
      <nav className="hidden gap-6 text-sm text-slate-600 md:flex"><Link href="/fahrzeuge">Fahrzeuge</Link><a href="#faq">FAQ</a></nav>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <a href="#kontakt" className="hidden items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:inline-flex">
          Direkt anfragen
        </a>
      </div>
    </div>
  </header>

  <section className="hero-grid border-b border-blue-100 bg-white">
    <div className="container-x grid items-center gap-8 py-12 sm:gap-10 sm:py-16 lg:min-h-[650px] lg:grid-cols-[1.15fr_.85fr] lg:gap-12 lg:py-20">
      <div>
        <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[.12em] text-blue-700 sm:px-4 sm:text-xs sm:tracking-[.15em]">VAG Codierung & Diagnose</div>
        <h1 className="sr-only">TD Fahrzeugcodierung</h1>
        <div className="mt-5 max-w-[620px] sm:mt-6">
          <div className="min-w-0"><div className="text-4xl font-black leading-none tracking-tight sm:text-6xl"><span className="text-slate-950">TD</span> <span className="text-blue-600">Fahrzeugcodierung</span></div><div className="mt-3 h-1 w-full rounded-full bg-blue-600" /></div>
        </div>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Codierung und Diagnose für Volkswagen, Audi, SEAT und Škoda – mit Fahrzeugauswahl, transparenter Kalkulation und direkter Terminbuchung.</p>

        <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
          <a href="#buchen" className="btn-primary w-full sm:w-auto">Codierungen auswählen</a>
          <Link href="/flash-test" className="btn-primary w-full sm:w-auto">Steuergeräte-Flash &amp; Softwareupdate</Link>
          <a href="#kontakt" className="btn-secondary w-full sm:w-auto"><MessageCircle className="mr-2 h-4 w-4"/>Machbarkeit anfragen</a>
        </div>
      </div>

      <div className="card p-5 sm:p-8">
        <h2 className="text-2xl font-black sm:text-3xl">Persönlich oder per Remote</h2>
        <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
          <div className="min-h-[148px] rounded-2xl border border-blue-300 bg-blue-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md sm:min-h-[164px] sm:p-5"><MapPin className="h-6 w-6 text-blue-600"/><b className="mt-3 block">Leipzig-Süd</b><span className="mt-1 block text-sm leading-6 text-slate-600">Schenkendorfstraße 33, 04275 Leipzig</span></div>
          <div className="min-h-[148px] rounded-2xl border border-blue-300 bg-blue-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md sm:min-h-[164px] sm:p-5"><Laptop className="h-6 w-6 text-blue-600"/><b className="mt-3 block">Remote</b><span className="mt-1 block text-sm leading-6 text-slate-600">Mit eigenem Diagnoseinterface, PC/Laptop, stabiler Internetverbindung und vereinbarter Remote-Software.</span></div>
        </div>
      </div>
    </div>
  </section>

  <section className="border-y border-blue-100 bg-blue-600 text-white"><div className="container-x py-10 text-center sm:py-14"><h2 className="text-2xl font-black sm:text-3xl">Mehr auswählen. Mehr sparen.</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">5 % ab 50 €, 10 % ab 100 €, 15 % ab 150 € und 20 % ab 200 € Auftragswert.</p></div></section>

  <section id="buchen" className="container-x scroll-mt-20 py-14 sm:py-20 lg:py-24"><div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">Buchung</div><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Fahrzeug prüfen & Termin konfigurieren.</h2><p className="mt-4 leading-7 text-slate-600">Die Auswahl wird vor Durchführung auf technische Machbarkeit geprüft.</p></div><div className="mt-8 sm:mt-10"><BookingConfigurator/></div></section>

  <section id="kontakt" className="scroll-mt-20 border-y border-blue-100 bg-white">
    <div className="container-x py-14 sm:py-20">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm sm:tracking-[.18em]">Kontakt & Vorprüfung</div>
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

  <footer className="border-t border-blue-100 bg-white"><div className="container-x flex flex-col gap-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:py-10"><div className="flex items-center gap-3"><Image src="/td-logo-icon.png" alt="" width={128} height={85} className="h-9 w-auto"/><span>© 2026 TD Fahrzeugcodierung</span></div><div className="flex flex-wrap gap-x-5 gap-y-3"><Link href="/fahrzeuge">Fahrzeuge</Link><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/widerruf">Widerruf</Link><Link href="/agb">AGB</Link></div></div></footer>

 </main>
}
