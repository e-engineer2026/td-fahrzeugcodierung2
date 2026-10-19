"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { codingCatalog } from "../data/catalog";
import { serviceFocusEvent, type IllustrationKind } from "../lib/serviceDetails";
import ServiceIllustration from "./ServiceIllustration";

const services = [
  { id: "mirror", group: "Komfort", kind: "mirror" as IllustrationKind, title: "Spiegel automatisch anklappen", copy: "Komfort beim Abschließen – mit passender Spiegelausstattung.", query: "Spiegel", match: /spiegel.*anklapp/i, requirements: "Elektrisch anklappbare Außenspiegel und kompatible Türsteuergeräte. Eine reine Codierung kann fehlende Stellmotoren nicht ersetzen.", benefit: "Je nach Fahrzeug lassen sich vorhandene elektrische Spiegel beim Verriegeln anklappen. Die gewünschte Bedienlogik stimmen wir vorher ab." },
  { id: "lights", group: "Licht", kind: "light" as IllustrationKind, title: "Coming Home & Leaving Home", copy: "Vorhandene Beleuchtung beim Ankommen und Losfahren nutzen.", query: "Coming Home", match: /coming.*home.*aktiv/i, requirements: "Unterstütztes Bordnetzsteuergerät und geeignete Leuchten; je nach gewünschter Funktion ist ein Licht- oder Regensensor erforderlich.", benefit: "Beleuchtungsfunktionen, Aktivierung und verfügbare Zeitwerte lassen sich bei geeigneter Ausstattung anpassen." },
  { id: "staging", group: "Komfort", kind: "instrument" as IllustrationKind, title: "Anzeigen im Kombiinstrument", copy: "Zeigertest und weitere unterstützte Anzeigen entdecken.", query: "Zeigertest", match: /staging|zeigertest/i, requirements: "Das verbaute Kombiinstrument und dessen Software müssen die jeweilige Anzeige oder den Zeigertest unterstützen.", benefit: "Unterstützte Komfort- und Anzeigeoptionen im Kombiinstrument auswählen. Die tatsächlich verfügbaren Funktionen hängen vom Fahrzeug ab." },
  { id: "infotainment", group: "Infotainment", kind: "infotainment" as IllustrationKind, title: "Infotainment passend einstellen", copy: "Gerätefunktionen, Anzeige und Integration gezielt prüfen.", query: "Infotainment", match: /infotainment|navigation|bluetooth/i, requirements: "Genaue Gerätebezeichnung, Softwarestand und vorhandene Ausstattung. Notwendige Funktionsfreigaben und Lizenzen müssen unterstützt und verfügbar sein.", benefit: "Statt pauschaler Freischaltversprechen wird zuerst das verbaute System geprüft. Danach lassen sich geeignete Einstellungen oder nächste Schritte abstimmen." },
  { id: "assist", group: "Assistenz", kind: "assist" as IllustrationKind, title: "Assistenzfunktionen anpassen", copy: "Vorhandene Technik und unterstützte Einstellungen nutzen.", query: "Spur", match: /spurhalte.*einschalt|lane.*onstate/i, requirements: "Kompatible Kamera beziehungsweise Sensorik und passende Steuergeräte. SFD2 / UNECE-Fahrzeuge sind von unseren Codierungsangeboten ausgeschlossen.", benefit: "Bei unterstützten Fahrzeugen lassen sich bestimmte Einstellungen vorhandener Assistenzsysteme anpassen. Welche Optionen möglich sind, entscheidet die konkrete Ausstattung." },
  { id: "diagnose", group: "Diagnose", kind: "diagnose" as IllustrationKind, title: "Fehler verstehen. Gezielt prüfen.", copy: "Diagnose, Grundeinstellung und Prüfung nach Nachrüstungen.", query: "Diagnose", match: /^diagnose|fehlerspeicher/i, requirements: "Fahrzeugmodell, Baujahr und eine möglichst genaue Fehlerbeschreibung. Ein vorhandener Diagnosescan kann die Vorbereitung erleichtern.", benefit: "Fehlerspeicher und relevante Messwerte einordnen, Ursachen eingrenzen und geeignete Prüfungen, Grundeinstellungen oder Codieranpassungen abstimmen." },
];
type Service = typeof services[number];
const prices = new Map(services.map((service) => {
  const amounts = codingCatalog.filter((coding) => service.match.test(coding.name) && coding.price > 0).map((coding) => coding.price);
  return [service.id, amounts.length ? Math.min(...amounts) : null];
}));
function priceLabel(service: Service) { const price = prices.get(service.id); return price ? `ab ${price.toFixed(2).replace(".", ",")} €` : "nach Vorprüfung"; }

export default function ServiceExplorer() {
  const [filter, setFilter] = useState("Alle");
  const [selected, setSelected] = useState<Service | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  function open(service: Service) { setSelected(service); dialog.current?.showModal(); }
  function find(service: Service) {
    dialog.current?.close();
    window.dispatchEvent(new CustomEvent(serviceFocusEvent, { detail: { query: service.query } }));
    const hasVehicle = Boolean(document.getElementById("konfigurator")?.dataset.contactYear);
    const target = document.getElementById(hasVehicle ? "buchen" : "fahrzeugauswahl");
    target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (hasVehicle) target?.focus({ preventScroll: true });
  }

  return <>
    <div className="td-explorer-filters" role="group" aria-label="Leistungen nach Themen filtern">{["Alle", "Komfort", "Licht", "Infotainment", "Assistenz", "Diagnose"].map((group) => <button key={group} type="button" aria-pressed={filter === group} onClick={() => setFilter(group)}>{group}</button>)}</div>
    <div className="td-explorer-grid">{services.filter((service) => filter === "Alle" || service.group === filter).map((service) => <article className="td-feature-card" key={service.id}>
      <button type="button" className="td-feature-art-button" onClick={() => open(service)} aria-label={`Details zu ${service.title}`}><ServiceIllustration kind={service.kind} label={`Funktionsskizze: ${service.title}`} /><span className="td-art-label">Funktionsskizze</span></button>
      <div className="td-feature-body"><div className="td-feature-category">{service.group}</div><h3>{service.title}</h3><p>{service.copy}</p><div className="td-feature-bottom"><span><b>{priceLabel(service)}</b><small>fahrzeugabhängig</small></span><button type="button" onClick={() => open(service)}>Details ansehen <ArrowRight aria-hidden="true" /></button></div></div>
    </article>)}</div>
    <p className="td-catalog-note">Beispiele aus dem Leistungskatalog. Passende Funktionen und genaue Preise erscheinen nach deiner Fahrzeugauswahl. Zusätzliche Hardware ist nicht enthalten; ein erforderlicher SFD1-Zugang wird im Konfigurator berücksichtigt.</p>
    <dialog ref={dialog} className="td-service-dialog" onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-labelledby="td-service-dialog-title">
      {selected && <div className="td-service-dialog-inner"><button type="button" className="td-dialog-close" onClick={() => dialog.current?.close()} aria-label="Leistungsdetails schließen"><X aria-hidden="true" /></button><div className="td-dialog-visual"><ServiceIllustration kind={selected.kind} label={`Funktionsskizze: ${selected.title}`} /><span>Funktion und Machbarkeit sind ausstattungsabhängig.</span></div><div className="td-dialog-copy"><p className="td-eyebrow">{selected.group} · {priceLabel(selected)}</p><h2 id="td-service-dialog-title">{selected.title}</h2><p>{selected.benefit}</p><dl><div><dt>Was braucht dein Fahrzeug?</dt><dd>{selected.requirements}</dd></div><div><dt>Was ist enthalten?</dt><dd>Technische Abstimmung, die vereinbarte Anpassung und Funktionskontrolle. Zusätzliche Hardware, Reparaturen oder weitere Arbeiten werden gesondert abgestimmt.</dd></div><div><dt>Wo und wie lange?</dt><dd>Vor Ort in Leipzig-Süd oder bei geeigneten Arbeiten per Remote. Zugang und Dauer werden nach Vorprüfung festgelegt.</dd></div></dl><p className="td-dialog-assurance"><Check aria-hidden="true" /> Keine Anmeldung für die Fahrzeug- und Preisauswahl nötig.</p><button className="td-button" type="button" onClick={() => find(selected)}>Für mein Fahrzeug ansehen <ArrowRight aria-hidden="true" /></button></div></div>}
    </dialog>
  </>;
}
