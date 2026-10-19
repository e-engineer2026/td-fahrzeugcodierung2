import type { UnifiedCodingEntry } from "../lib/codingDisplay";
import { serviceDetails } from "../lib/serviceDetails";

export default function CodingOptionCard({ entry, selected, onToggle, mode }: { entry: UnifiedCodingEntry; selected: boolean; onToggle: () => void; mode: "onsite" | "remote" }) {
  const detail = serviceDetails(entry.name, entry.uiGroup);
  return <article className={`td-coding-card${selected ? " is-selected" : ""}`}>
    <label className="td-coding-card-choice"><input type="checkbox" checked={selected} onChange={onToggle} /><span><strong>{entry.name}</strong><span className="td-coding-benefit">{detail.benefit}</span></span><b>{entry.price.toFixed(2).replace(".", ",")} €</b></label>
    <details className="td-coding-details"><summary>Details &amp; Voraussetzungen <span aria-hidden="true">+</span></summary>
      <dl><div><dt>Benötigte Ausstattung</dt><dd>{entry.hardware || detail.requirement}</dd></div>
      {entry.requirements && <div><dt>Fahrzeug- und Funktionshinweise</dt><dd>{entry.requirements}</dd></div>}
      {entry.interfaceInfo && <div><dt>Diagnosezugang</dt><dd>{entry.interfaceInfo}</dd></div>}
      <div><dt>Umsetzung</dt><dd>{mode === "remote" ? "Per Remote nur nach Prüfung von Interface, Software und Fahrzeug. Windows-Laptop und Anwesenheit am Fahrzeug erforderlich." : "Persönlich in Leipzig-Süd. Die genaue Ausstattung und Machbarkeit werden vor Durchführung geprüft."}</dd></div>
      <div><dt>Leistungsumfang &amp; Dauer</dt><dd>{/fehlerdiagnose|fehlerspeicher/i.test(entry.name) ? "Abstimmung, Auswertung der Fahrzeugfehler und vereinbarte technische Prüfung. Weitergehende Reparaturen werden gesondert abgestimmt." : "Abstimmung, Anpassung der gewählten Funktion und Funktionskontrolle. Zusätzliche Hardware oder Reparaturen sind nicht enthalten."} Die Dauer wird nach technischer Vorprüfung vereinbart.</dd></div>
      {entry.sfd && <div><dt>SFD-Zugang</dt><dd>{entry.sfd === "Ja" ? "SFD-Freischaltung erforderlich. Bei SFD1 fällt die Freischaltung einmal je Auftrag an und wird im Gesamtpreis berücksichtigt." : entry.sfd === "Nein" ? "Für diese Funktion ist im Katalog kein SFD-Zugang vorgesehen." : "Der erforderliche Zugang muss am konkreten Fahrzeug geprüft werden."}</dd></div>}</dl>
    </details>
  </article>;
}
