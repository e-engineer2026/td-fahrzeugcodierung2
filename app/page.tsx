import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin, MessageCircle, Phone, Radar, Settings2, Sparkles, Tag } from "lucide-react";
import AccountMenu from "./components/AccountMenu";
import ArrivalGuide from "./components/ArrivalGuide";
import BookingConfigurator from "./components/BookingConfigurator";
import ContactBox from "./components/ContactBox";
import FunctionExample from "./components/FunctionExample";
import HeaderBookingSummary from "./components/HeaderBookingSummary";
import HomeMenu from "./components/HomeMenu";
import HomeVehicleFinder from "./components/HomeVehicleFinder";
import HeroVehicleCarousel from "./components/HeroVehicleCarousel";
import VehicleSelectionBridge from "./components/VehicleSelectionBridge";
import { codingCatalog } from "./data/catalog";
import "./redesign.css";

const whatsapp = "https://wa.me/4915563047044";
const maps = "https://www.google.com/maps/search/?api=1&query=51.323915%2C12.375662";
const googleBusiness = "https://www.google.com/maps/search/?api=1&query=TD-Fahrzeugcodierung&query_place_id=ChIJbx46otT5pkcRX9IqdbeMmdU";
// Use the configurator catalog as the single source for the displayed guide prices.
function serviceRows(ids: string[]) {
  return ids.map((id) => {
    const coding = codingCatalog.find((entry) => entry.id === id);
    if (!coding) throw new Error(`Missing service coding: ${id}`);
    return { name: coding.name, price: `ab ${coding.price} €`, exampleKey: id };
  });
}

const services = [
  {
    Icon: Sparkles, title: "Häufigste Funktionen", copy: "Beliebte Codierungen auf einen Blick.",
    rows: serviceRows(["asc-1", "asc-4", "asc-15", "asc-32", "asc-112", "asc-30", "asc-29", "asc-60", "asc-8", "asc-111"]),
    href: "#fahrzeugauswahl", action: "Passende Funktionen auswählen",
  },
  {
    Icon: Settings2, title: "Werkseitiges Luftfahrwerk (AAS)", copy: "Fahrzeughöhe nach Wunsch und Möglichkeit anpassen.",
    rows: [{ name: "Höhenanpassung des werksseitigen Luftfahrwerks", price: "59–79 €", exampleKey: "aas" }],
    models: ["Audi A6 / S6 / Allroad C6 (4F) und C7 (4G)", "Audi A7 / S7 C7 (4G)", "Audi A8 / S8 D4 (4H) und D5 (4N)", "Audi Q7 (4L)", "Volkswagen Touareg I (7L)", "Volkswagen Phaeton (3D)"],
    note: "Nur mit werksseitigem Luftfahrwerk. Preis nach Fahrzeug und Aufwand, verbindlich vor Beginn vereinbart. Weitere Baureihen auf Anfrage. Keine Reparaturen, Nachrüstteile oder Vermessungsarbeiten enthalten.",
    href: `${whatsapp}?text=${encodeURIComponent("Hallo, ich möchte das werksseitige Luftfahrwerk (AAS) anpassen lassen. Fahrzeug / Baujahr: ")}`, action: "Luftfahrwerk anfragen",
  },
  {
    Icon: Radar, title: "Assistenzsysteme", copy: "Vorhandene Kamera- und Sensortechnik nutzen.",
    rows: serviceRows(["vcds-vze", "vcds-fla", "vcds-dla", "vcds-lane-activate", "vcds-lane-memory", "vcds-lane-warning", "vcds-acc", "vcds-acc-mode", "vcds-pacc", "vcds-front-assist", "vcds-park-assist", "vcds-rear-view"]),
    note: "Kompatible Hardware und gegebenenfalls vorhandene Funktionslizenzen erforderlich. Nachrüstung, zusätzliche Parametrierung und Kalibrierung werden bei Bedarf separat angeboten. SFD1-Fahrzeuge: unterstützte Anpassungen vorhandener Systeme; keine SFD2-Codierungen.",
    href: "#fahrzeugauswahl", action: "Assistenzfunktionen für mein Fahrzeug prüfen",
  },
];

export default function Home() {
  return <main className="td-home">
    <VehicleSelectionBridge />
    <a href="#fahrzeugauswahl" className="td-skip">Direkt zur Fahrzeugauswahl</a>
    <header className="td-header">
      <div className="td-container td-header-inner">
        <Link href="/" className="td-brand" aria-label="TD Fahrzeugcodierung – Startseite"><span className="td-logo-shine"><Image src="/td-logo-status.webp" alt="TD" width={225} height={80} sizes="(max-width: 600px) 68px, 94px" priority /></span><span>Fahrzeugcodierung</span></Link>
        <nav className="td-desktop-nav" aria-label="Hauptnavigation"><a href="#leistungen">Leistungen</a><a href="#ablauf">So funktioniert’s</a><a href="#kontakt">Kontakt</a></nav>
        <div className="td-header-actions"><AccountMenu /><HeaderBookingSummary /><a className="td-whatsapp-outline" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />WhatsApp</a><HomeMenu /></div>
      </div>
    </header>

    <aside className="td-offer" aria-label="Aktionsrabatt für alle ohne Anmeldung">
      <details className="td-container">
        <summary><span className="td-offer-title"><Tag aria-hidden="true" /><strong>Aktionsrabatt für alle: 10–25 %</strong></span><span className="td-offer-condition">Ohne Anmeldung · bis 30.11.2026</span><ChevronDown className="td-offer-chevron" aria-hidden="true" /></summary>
        <div className="td-offer-details"><div className="td-offer-tiers">{[[10, 50], [15, 100], [20, 150], [25, 200]].map(([rate, amount]) => <span key={rate}><b>{rate} %</b> ab {amount} €</span>)}</div><p>Für alle Kunden ohne Anmeldung vom 04.10.2026 bis einschließlich 30.11.2026 – auch bei weiteren Buchungen. Der Rabatt wird im Konfigurator automatisch berücksichtigt. Eine erforderliche SFD1-Freischaltung zählt zum Auftragswert und wird mitrabattiert.</p><a href="#fahrzeugauswahl">Jetzt Codierungen auswählen <ArrowRight aria-hidden="true" /></a></div>
      </details>
    </aside>

    <section className="td-hero" aria-labelledby="home-title">
      <HeroVehicleCarousel />
      <div className="td-leipzig-skyline" aria-hidden="true"><Image src="/leipzig-skyline.webp" alt="" fill sizes="100vw" preload /></div>
      <div className="td-container td-hero-inner"><div className="td-hero-copy">
        <p className="td-eyebrow">Leipzig-Süd · deutschlandweit per Remote</p>
        <h1 id="home-title">Dein Fahrzeug.<br />Mehr Möglichkeiten.</h1>
        <p className="td-hero-subtitle">Fahrzeugcodierung, Diagnose und Software für Volkswagen, Audi, Škoda, SEAT und CUPRA.</p>
        <div className="td-hero-actions"><a className="td-button" href="#fahrzeugauswahl">Fahrzeug auswählen<ArrowRight aria-hidden="true" /></a><a className="td-quiet-link" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />Frage per WhatsApp stellen</a></div>
      </div></div>
    </section>

    <section id="fahrzeugauswahl" className="td-container td-finder-wrap" aria-label="Zum Fahrzeugkonfigurator"><HomeVehicleFinder /></section>

    <section id="buchen" className="td-container td-booking-area" aria-label="Fahrzeugcodierungen auswählen" tabIndex={-1}>
      <BookingConfigurator integrated />
    </section>

    <section className="td-container td-remote-flow" aria-label="Ablauf der Remote-Codierung"><h2>Remote-Codierung einfach erklärt</h2><p>Mit eigenem kompatiblem Interface und Laptop am Fahrzeug.</p><div className="td-remote-steps"><span>Fahrzeug</span><i aria-hidden="true"/><span>Diagnoseinterface</span><i aria-hidden="true"/><span>Laptop</span><i aria-hidden="true"/><span>TD Fahrzeugcodierung</span></div><p>Voraussetzungen und Machbarkeit prüfen wir vorab.</p></section>

    <section id="leistungen" className="td-container td-services" aria-labelledby="services-title">
      <div className="td-section-heading"><div><h2 id="services-title">Mehr aus deinem Fahrzeug machen.</h2><p>Passende Möglichkeiten für deine Ausstattung.</p></div></div>
      <nav className="td-service-main-links" aria-label="Fahrzeuge, Preise und Software"><Link href="/fahrzeuge">Fahrzeuge &amp; Preise<ArrowRight aria-hidden="true" /></Link><Link href="/remote-check">Remote-Check<ArrowRight aria-hidden="true" /></Link><Link href="/steuergeraete-flash">Steuergeräte-Flash &amp; Softwareupdate<ArrowRight aria-hidden="true" /></Link></nav>
      <div className="td-service-catalog">{services.map(({ Icon, title, copy, rows, models, note, href, action }) => <details key={title} className="td-service-panel">
        <summary><Icon className="td-service-icon" aria-hidden="true" /><span><h3>{title}</h3><span className="td-service-intro">{copy}</span><span className="td-service-expand">Funktionen &amp; Preise ansehen</span></span><ChevronDown className="td-service-chevron" aria-hidden="true" /></summary>
        <div className="td-service-body">
          <ul className="td-service-prices" aria-label={`${title}: Leistungen und Preise`}>{rows.map(({ name, price, exampleKey }) => <li key={name}><div className="td-service-price-row"><span>{name}</span><strong>{price}</strong></div><FunctionExample exampleKey={exampleKey} /></li>)}</ul>
          {models && <><h4>Baureihen nach Vorprüfung</h4><ul className="td-service-models">{models.map((model) => <li key={model}>{model}</li>)}</ul></>}
          {note && <p className="td-service-note">{note}</p>}
          <a className="td-service-action" href={href}>{action}<ArrowRight aria-hidden="true" /></a>
        </div>
      </details>)}</div>
    </section>

    <section id="ablauf" className="td-process" aria-labelledby="process-title"><div className="td-container"><h2 id="process-title">So einfach geht’s.</h2><ol>{[
      ["Fahrzeug wählen", "Marke, Modell und Baujahr auswählen."],
      ["Codierungen zusammenstellen", "Passende Funktionen entdecken und den Preis direkt sehen."],
      ["Termin vereinbaren", "Vor Ort in Leipzig oder bequem per Remote."],
    ].map(([title, copy], index) => <li key={title}><span className="td-step-number">0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div></section>

    <section className="td-contact-intro"><div className="td-container"><div><h2>Nicht sicher, was möglich ist?</h2><p>Ich helfe dir persönlich weiter und prüfe, was zu deinem Fahrzeug passt.</p></div><a href="#kontakt" className="td-button">Persönlich beraten lassen<ArrowRight aria-hidden="true" /></a><a href="tel:+4915563047044" className="td-contact-phone"><Phone aria-hidden="true" />01556 3047044</a></div></section>

    <section id="kontakt" className="td-contact td-container" aria-labelledby="contact-title"><div className="td-section-heading"><div><p className="td-eyebrow">Direkt und persönlich</p><h2 id="contact-title">Dein Weg zur passenden Codierung.</h2><p>Modell, Baujahr und Wunschfunktion reichen für die erste Anfrage.</p></div></div><ContactBox /></section>

    <section id="faq" className="td-faq td-container" aria-labelledby="faq-title"><div><p className="td-eyebrow">Gut zu wissen</p><h2 id="faq-title">Häufige Fragen.</h2></div><div className="td-faq-list">
      <details><summary>Wo parke ich bei einem Vor-Ort-Termin?<ChevronDown aria-hidden="true" /></summary><ArrivalGuide /></details>
      <details><summary>Was brauche ich für eine Remote-Codierung?<ChevronDown aria-hidden="true" /></summary><p>Ein eigenes kompatibles Diagnoseinterface (zum Beispiel VCDS, VCP oder OBD11), einen Windows-PC/Laptop am Fahrzeug, eine stabile Internetverbindung und die vereinbarte Remote-Software. Interface, Software und eine geeignete Spannungsversorgung stimmen wir vorher ab.</p></details>
      <details><summary>Sind alle Funktionen bei meinem Fahrzeug möglich?<ChevronDown aria-hidden="true" /></summary><p>Die Möglichkeiten hängen von Hardware, Steuergeräten, Softwarestand und Ausstattung ab. Die Machbarkeit wird vor der Durchführung geprüft. Für Fahrzeuge mit SFD2 / UNECE bieten wir keine Codierungen an.</p></details>
      <details><summary>Wie funktioniert der Aktionsrabatt?<ChevronDown aria-hidden="true" /></summary><p>Alle Kunden erhalten ohne Anmeldung 10 % ab 50 €, 15 % ab 100 €, 20 % ab 150 € und 25 % ab 200 € Auftragswert – auch bei weiteren Buchungen. Der Rabatt wird im Konfigurator automatisch berücksichtigt. Die Aktion gilt vom 04.10.2026 bis einschließlich 30.11.2026. Eine erforderliche SFD1-Freischaltung zählt zum Auftragswert und wird mitrabattiert.</p></details>
      <details><summary>Wie kann ich bezahlen?<ChevronDown aria-hidden="true" /></summary><p>Vor Ort im Voraus per PayPal oder direkt beim Termin bar, per PayPal oder per Sofortüberweisung. Bei Remote-Aufträgen per PayPal: 70 % vor Beginn und 30 % nach Durchführung der vereinbarten Arbeiten.</p></details>
    </div></section>

    <footer className="td-footer"><div className="td-container"><div className="td-footer-main"><Link href="/" className="td-brand" aria-label="TD Fahrzeugcodierung – Startseite"><Image src="/td-logo-status.webp" alt="TD" width={225} height={80} sizes="68px" /><span>Fahrzeugcodierung</span></Link><a href={maps} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" />Kundenparkplatz gegenüber · Schenkendorfstraße 33</a><a href="mailto:info@td-fahrzeugcodierung.de">info@td-fahrzeugcodierung.de</a></div><nav className="td-footer-services" aria-label="Leistungen und Marken"><Link href="/fahrzeuge">Fahrzeuge &amp; Preise</Link><Link href="/fahrzeugcodierung-leipzig">Fahrzeugcodierung Leipzig</Link><Link href="/vw-codierung-leipzig">VW</Link><Link href="/audi-codierung-leipzig">Audi</Link><Link href="/skoda-codierung-leipzig">Škoda</Link><Link href="/seat-codierung-leipzig">SEAT</Link><Link href="/cupra-codierung-leipzig">CUPRA</Link><Link href="/vcds-codierung-leipzig">VCDS</Link><Link href="/vcp-codierung-leipzig">VCP</Link><Link href="/schluessel-anlernen-leipzig">Schlüssel anlernen</Link><Link href="/remote-fahrzeugcodierung">Remote</Link><a href={googleBusiness} target="_blank" rel="noreferrer">Google-Profil</a></nav><div className="td-footer-bottom"><span>© 2026 TD Fahrzeugcodierung</span><nav aria-label="Rechtliche Informationen"><Link href="/impressum">Impressum</Link><Link href="/bildnachweise">Bildnachweise</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/widerruf">Widerruf</Link><Link href="/agb">AGB</Link></nav></div></div></footer>
  </main>;
}
