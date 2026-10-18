import Image from "next/image";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ArrowRight, ChevronDown, Lightbulb, MapPin, MessageCircle, MonitorPlay, Phone, Radar, Settings2, Tag, UserRound } from "lucide-react";
import BookingConfigurator from "./components/BookingConfigurator";
import ContactBox from "./components/ContactBox";
import HeaderBookingSummary from "./components/HeaderBookingSummary";
import HomeMenu from "./components/HomeMenu";
import HomeVehicleFinder from "./components/HomeVehicleFinder";
import "./redesign.css";

const whatsapp = "https://wa.me/4915563047044";
const maps = "https://www.google.com/maps/search/?api=1&query=TD-Fahrzeugcodierung&query_place_id=ChIJbx46otT5pkcRX9IqdbeMmdU";
const services = [
  { Icon: Lightbulb, title: "Komfort & Licht", copy: "Funktionen im Alltag anpassen.", href: "#fahrzeugauswahl" },
  { Icon: Radar, title: "Assistenzsysteme", copy: "Vorhandene Technik sinnvoll nutzen.", href: "/assistenzsysteme-codieren-leipzig" },
  { Icon: MonitorPlay, title: "Infotainment", copy: "Smartphone und Fahrzeug verbinden.", href: "#fahrzeugauswahl" },
  { Icon: Settings2, title: "Diagnose & Software", copy: "Fehler prüfen. Software aktualisieren.", href: "/steuergeraete-diagnose-leipzig" },
];

export default function Home() {
  return <main className="td-home">
    <a href="#fahrzeugauswahl" className="td-skip">Direkt zur Fahrzeugauswahl</a>
    <header className="td-header">
      <div className="td-container td-header-inner">
        <Link href="/" className="td-brand" aria-label="TD Fahrzeugcodierung – Startseite"><Image src="/td-logo-icon.png" alt="TD" width={225} height={80} priority /><span>Fahrzeugcodierung</span></Link>
        <nav className="td-desktop-nav" aria-label="Hauptnavigation"><a href="#leistungen">Leistungen</a><a href="#ablauf">So funktioniert’s</a><a href="#kontakt">Kontakt</a></nav>
        <div className="td-header-actions"><HeaderBookingSummary /><div className="td-account"><Show when="signed-in" fallback={<Link href="/sign-in?redirect_url=%2Fkonto"><UserRound aria-hidden="true" />Anmelden</Link>}><Link href="/konto">Mein Konto</Link><UserButton /></Show></div><a className="td-whatsapp-outline" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />WhatsApp</a><HomeMenu /></div>
      </div>
    </header>

    <aside className="td-offer" aria-label="Aktionsrabatt für alle ohne Anmeldung">
      <details className="td-container">
        <summary><span className="td-offer-title"><Tag aria-hidden="true" /><strong>Aktionsrabatt: bis zu 25 %<span> für alle</span></strong></span><span className="td-offer-condition">Ohne Anmeldung · bis einschließlich 30.11.2026</span><ChevronDown className="td-offer-chevron" aria-hidden="true" /></summary>
        <div className="td-offer-details"><div className="td-offer-tiers">{[[10, 50], [15, 100], [20, 150], [25, 200]].map(([rate, amount]) => <span key={rate}><b>{rate} %</b> ab {amount} €</span>)}</div><p>Für alle Kunden ohne Anmeldung vom 04.10.2026 bis einschließlich 30.11.2026 – auch bei weiteren Buchungen. Der Rabatt wird im Konfigurator automatisch berücksichtigt. Eine erforderliche SFD1-Freischaltung zählt zum Auftragswert und wird mitrabattiert.</p><a href="#fahrzeugauswahl">Jetzt Codierungen auswählen <ArrowRight aria-hidden="true" /></a></div>
      </details>
    </aside>

    <section className="td-hero" aria-labelledby="home-title">
      <div className="td-hero-picture"><Image src="/td-hero-natural.webp" alt="Graphitgrauer Volkswagen Golf in einer hellen, natürlichen Umgebung" fill priority sizes="100vw" /></div>
      <div className="td-container td-hero-inner"><div className="td-hero-copy">
        <p className="td-eyebrow">Leipzig-Süd · deutschlandweit per Remote</p>
        <h1 id="home-title">Dein Fahrzeug.<br />Mehr Möglichkeiten.</h1>
        <p className="td-hero-subtitle">Fahrzeugcodierung, Diagnose und Software für Volkswagen, Audi, Škoda, SEAT und CUPRA.</p>
        <div className="td-hero-actions"><a className="td-button" href="#fahrzeugauswahl">Fahrzeug auswählen<ArrowRight aria-hidden="true" /></a><a className="td-quiet-link" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />Frage per WhatsApp stellen</a></div>
      </div></div>
    </section>

    <section id="fahrzeugauswahl" className="td-container td-finder-wrap" aria-label="Zum Fahrzeugkonfigurator"><HomeVehicleFinder /></section>
    <div className="td-container td-brand-row" aria-label="Unterstützte Marken">{["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA"].map((brand) => <span key={brand}>{brand}</span>)}</div>

    <section id="buchen" className="td-container td-booking-area" aria-labelledby="booking-title">
      <div className="td-section-heading"><div><p className="td-eyebrow">Dein Fahrzeugkonfigurator</p><h2 id="booking-title" tabIndex={-1}>Deine Codierungen. Dein Preis.</h2><p>Funktionen auswählen, Preis berechnen und Termin vereinbaren.</p></div><a className="td-quiet-link" href="#fahrzeugauswahl">Fahrzeug oder Terminart ändern ↑</a></div>
      <BookingConfigurator integrated />
    </section>

    <section id="leistungen" className="td-container td-services" aria-labelledby="services-title">
      <div className="td-section-heading"><div><h2 id="services-title">Mehr aus deinem Fahrzeug machen.</h2><p>Passende Möglichkeiten für deine Ausstattung.</p></div><Link className="td-quiet-link" href="/fahrzeuge">Fahrzeuge &amp; Preise<ArrowRight aria-hidden="true" /></Link></div>
      <div className="td-service-grid">{services.map(({ Icon, title, copy, href }) => <Link key={title} className="td-service" href={href}><Icon className="td-service-icon" aria-hidden="true" /><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight className="td-service-arrow" aria-hidden="true" /></Link>)}</div>
      <Link className="td-software-link" href="/steuergeraete-flash">Steuergeräte-Flash &amp; Softwareupdate<ArrowRight aria-hidden="true" /></Link>
    </section>

    <section id="ablauf" className="td-process" aria-labelledby="process-title"><div className="td-container"><h2 id="process-title">So einfach geht’s.</h2><ol>{[
      ["Fahrzeug wählen", "Marke, Modell und Baujahr auswählen."],
      ["Codierungen zusammenstellen", "Passende Funktionen entdecken und den Preis direkt sehen."],
      ["Termin vereinbaren", "Vor Ort in Leipzig oder bequem per Remote."],
    ].map(([title, copy], index) => <li key={title}><span className="td-step-number">0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></section>

    <section className="td-contact-intro"><div className="td-container"><div><h2>Nicht sicher, was möglich ist?</h2><p>Ich helfe dir persönlich weiter und prüfe, was zu deinem Fahrzeug passt.</p></div><a href="#kontakt" className="td-button">Persönlich beraten lassen<ArrowRight aria-hidden="true" /></a><a href="tel:+4915563047044" className="td-contact-phone"><Phone aria-hidden="true" />01556 3047044</a></div></section>

    <section id="kontakt" className="td-contact td-container" aria-labelledby="contact-title"><div className="td-section-heading"><div><p className="td-eyebrow">Direkt und persönlich</p><h2 id="contact-title">Dein Weg zur passenden Codierung.</h2><p>Modell, Baujahr und Wunschfunktion reichen für die erste Anfrage.</p></div></div><ContactBox /></section>

    <section id="faq" className="td-faq td-container" aria-labelledby="faq-title"><div><p className="td-eyebrow">Gut zu wissen</p><h2 id="faq-title">Häufige Fragen.</h2></div><div className="td-faq-list">
      <details><summary>Was brauche ich für eine Remote-Codierung?<ChevronDown aria-hidden="true" /></summary><p>Ein eigenes kompatibles Diagnoseinterface (zum Beispiel VCDS, VCP oder OBD11), einen Windows-PC/Laptop am Fahrzeug, eine stabile Internetverbindung und die vereinbarte Remote-Software. Interface, Software und eine geeignete Spannungsversorgung stimmen wir vorher ab.</p></details>
      <details><summary>Sind alle Funktionen bei meinem Fahrzeug möglich?<ChevronDown aria-hidden="true" /></summary><p>Die Möglichkeiten hängen von Hardware, Steuergeräten, Softwarestand und Ausstattung ab. Die Machbarkeit wird vor der Durchführung geprüft. Für Fahrzeuge mit SFD2 / UNECE bieten wir keine Codierungen an.</p></details>
      <details><summary>Wie funktioniert der Aktionsrabatt?<ChevronDown aria-hidden="true" /></summary><p>Alle Kunden erhalten ohne Anmeldung 10 % ab 50 €, 15 % ab 100 €, 20 % ab 150 € und 25 % ab 200 € Auftragswert – auch bei weiteren Buchungen. Der Rabatt wird im Konfigurator automatisch berücksichtigt. Die Aktion gilt vom 04.10.2026 bis einschließlich 30.11.2026. Eine erforderliche SFD1-Freischaltung zählt zum Auftragswert und wird mitrabattiert.</p></details>
      <details><summary>Wie kann ich bezahlen?<ChevronDown aria-hidden="true" /></summary><p>Vor Ort im Voraus per PayPal oder direkt beim Termin bar, per PayPal oder per Sofortüberweisung. Bei Remote-Aufträgen per PayPal: 70 % vor Beginn und 30 % nach Durchführung der vereinbarten Arbeiten.</p></details>
    </div></section>

    <footer className="td-footer"><div className="td-container"><div className="td-footer-main"><Link href="/" className="td-brand" aria-label="TD Fahrzeugcodierung – Startseite"><Image src="/td-logo-icon.png" alt="TD" width={225} height={80} /><span>Fahrzeugcodierung</span></Link><a href={maps} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" />Schenkendorfstraße 33 · 04275 Leipzig</a><a href="mailto:info@td-fahrzeugcodierung.de">info@td-fahrzeugcodierung.de</a></div><nav className="td-footer-services" aria-label="Leistungen und Marken"><Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link><Link href="/fahrzeugcodierung-leipzig">Fahrzeugcodierung Leipzig</Link><Link href="/vw-codierung-leipzig">VW</Link><Link href="/audi-codierung-leipzig">Audi</Link><Link href="/skoda-codierung-leipzig">Škoda</Link><Link href="/seat-codierung-leipzig">SEAT</Link><Link href="/cupra-codierung-leipzig">CUPRA</Link><Link href="/vcds-codierung-leipzig">VCDS</Link><Link href="/vcp-codierung-leipzig">VCP</Link><Link href="/schluessel-anlernen-leipzig">Schlüssel anlernen</Link><Link href="/remote-fahrzeugcodierung">Remote</Link><a href={maps} target="_blank" rel="noreferrer">Google-Profil</a></nav><div className="td-footer-bottom"><span>© 2026 TD Fahrzeugcodierung</span><nav aria-label="Rechtliche Informationen"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/widerruf">Widerruf</Link><Link href="/agb">AGB</Link></nav></div></div></footer>
  </main>;
}
