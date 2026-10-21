"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const examples: Record<string, { image: string; alt: string; benefit: string; hardware: string }> = {
  "asc-111": { image: "coming-home", alt: "Beispiel eines geparkten Fahrzeugs mit beleuchtetem Umfeld bei Dämmerung", benefit: "Coming/Leaving Home beleuchtet das Umfeld nach dem Abstellen oder beim Entriegeln. Leuchtdauer und Verhalten hängen vom Fahrzeug ab.", hardware: "Kompatibles Bordnetz und geeignete Leuchten; für automatische Funktionen gegebenenfalls Licht-/Regensensor." },
  "asc-29": { image: "mirror-dip", alt: "Abgesenkter Außenspiegel mit Sicht auf Hinterrad und Bordstein", benefit: "Der Beifahrerspiegel senkt sich beim Rückwärtsfahren und erleichtert den Blick auf den Bordstein.", hardware: "Unterstütztes Türsteuergerät und geeignete Spiegelverstellung; je nach Fahrzeug ist eine Memory-Funktion erforderlich." },
  "asc-30": { image: "mirror-fold", alt: "Außenspiegel ausgeklappt oben und angeklappt unten", benefit: "Die Außenspiegel klappen beim Verriegeln oder per Fernbedienung ein, sofern das Fahrzeug diese Bedienung unterstützt.", hardware: "Elektrisch anklappbare Spiegel und kompatible Türsteuergeräte müssen vorhanden sein." },
  "asc-32": { image: "ambient", alt: "Fahrzeuginnenraum mit dezenter blauer Ambientebeleuchtung", benefit: "Vorhandene Ambientebeleuchtung über das Infotainment bedienen oder unterstützte Einstellungen freischalten.", hardware: "Passende Leuchten, Steuergeräte und Infotainment-Unterstützung erforderlich. Zusätzliche Lichtleisten entstehen nicht durch Codierung." },
  "asc-4": { image: "rear-drl", alt: "Rote Schlussleuchten eines Fahrzeugs bei Tageslicht", benefit: "Die Schlussleuchten leuchten zusammen mit dem Tagfahrlicht und machen das Fahrzeug auch von hinten besser sichtbar.", hardware: "Unterstützte Lichtsteuerung und passende Rückleuchten. Die Darstellung zeigt beispielhaft die Schlusslichtfunktion." },
  "vcds-vze": { image: "traffic-signs", alt: "Beispiel einer Geschwindigkeitsbegrenzung auf 50 im Kombiinstrument", benefit: "Erkannte Verkehrszeichen können im Kombiinstrument angezeigt werden. Die Darstellung unterscheidet sich je nach Fahrzeug.", hardware: "Geeignete Frontkamera und kompatibles Kombiinstrument/Infotainment; je nach System Navigationsdaten und Funktionsfreigabe." },
  "vcds-rear-view": { image: "rear-camera", alt: "Rückfahrkamera-Anzeige mit farbigen Orientierungslinien", benefit: "Eine vorhandene oder nachgerüstete Rückfahrkamera im unterstützten Infotainment aktivieren. Hilfslinien sind systemabhängig.", hardware: "Kamera, Verkabelung und kompatibles Infotainment erforderlich. Je nach System zusätzliche Parametrierung oder Kalibrierung." },
  "aas": { image: "air-suspension", alt: "Illustrativer Höhenvergleich einer Limousine: oben Normalhöhe, unten abgesenkt", benefit: "Die Fahrzeughöhe des werksseitigen Luftfahrwerks kann bei unterstützten Fahrzeugen angepasst werden. Oben Normalhöhe, unten beispielhaft abgesenkt; keine verbindliche Absenkung in Millimetern.", hardware: "Funktionsfähiges werksseitiges Luftfahrwerk mit kompatibler Niveauregelung. Machbarkeit und gewünschte Höhe stimmen wir vorab ab." },
  "vcds-fla": { image: "high-beam", alt: "Ausgeleuchtete Landstraße bei Nacht als Beispiel für die Nutzung des Fernlichts", benefit: "Der Fernlichtassistent kann zwischen Abblend- und Fernlicht wechseln, wenn die Verkehrs- und Lichtverhältnisse es erlauben. Die Abbildung zeigt beispielhaft Fernlicht, keine Matrix-Ausblendung.", hardware: "Geeignete Kamera oder Fernlichtsensorik, kompatible Lichtsteuerung und unterstützte Scheinwerfer. Die Funktion ersetzt keine Aufmerksamkeit des Fahrers." },
  "lane-assist": { image: "lane-assist", alt: "Fahrer mit beiden Händen am Lenkrad und beispielhafter Spurhalteanzeige", benefit: "Lane Assist kann bei erkannten Fahrbahnmarkierungen das Halten der Spur unterstützen. Welche Aktivierung oder Einstellung verfügbar ist, hängt vom Fahrzeug ab. Hände bleiben am Lenkrad.", hardware: "Kompatible Frontkamera, Lenkung und Assistenzsteuergeräte; je nach Ausgangszustand Funktionsfreigabe, Parametrierung oder Kalibrierung erforderlich." },
  "adaptive-cruise": { image: "adaptive-cruise", alt: "Beispiel einer ACC-Abstandsanzeige mit vorausfahrendem Fahrzeug", benefit: "ACC kann die Geschwindigkeit an ein vorausfahrendes Fahrzeug anpassen und den eingestellten Abstand regeln. Bestehende Einstellungen lassen sich bei unterstützten Systemen anpassen. Funktionsgrenzen bleiben bestehen.", hardware: "Passender Radarsensor sowie kompatible Brems-, Motor- und Assistenzsteuergeräte. Je nach Fahrzeug Freigaben, Bedienelemente und Kalibrierung erforderlich; Codierung ersetzt keine fehlende Hardware." },
  "asc-60": { image: "remote-windows", alt: "Geparktes Fahrzeug mit teilweise geöffneten Fenstern und Fernbedienung im Vordergrund", benefit: "Unterstützte Fenster lassen sich durch Gedrückthalten der entsprechenden Taste am Funkschlüssel öffnen oder schließen. Umfang und Bedienung unterscheiden sich je nach Fahrzeug.", hardware: "Kompatible Tür- und Komfortsteuergeräte, elektrische Fensterheber und unterstützter Funkschlüssel. Voraussetzung ist eine funktionsfähige Fensterheber-Grundeinstellung." },
  "ops": { image: "ops", alt: "Beispiel einer optischen Einparkhilfe mit farbigen Abstandsfeldern hinter dem Fahrzeug", benefit: "Die optische Einparkhilfe ergänzt die vorhandenen Parksensoren um eine Abstandsgrafik im Infotainment. Anzeigeumfang und Sensorbereiche hängen vom Fahrzeug ab; das Beispiel zeigt keine Rückfahrkamera.", hardware: "OPS-fähiges Einparkhilfe-Steuergerät, vorhandene Sensoren und kompatibles Infotainment. Eine rein akustische Anlage ist nicht bei jedem Fahrzeug durch Codierung erweiterbar." },
  "oil-temperature": { image: "oil-temperature", alt: "Beispiel einer Motoröltemperaturanzeige mit 95 Grad Celsius im Kombiinstrument", benefit: "Die Motoröltemperatur lässt sich bei unterstützten Fahrzeugen in der Multifunktionsanzeige einblenden. Der Wert von 95 °C ist nur ein Darstellungsbeispiel und keine allgemeine Vorgabe für die Betriebstemperatur.", hardware: "Ein vom Fahrzeug bereitgestellter Öltemperaturwert sowie ein kompatibles Kombiinstrument und unterstützte Anzeigesoftware erforderlich." },
  "staging": { image: "staging", alt: "Illustrativer Zeigertest: oben Zeiger in Ruhestellung, unten kurzer Zeigerausschlag beim Einschalten", benefit: "Beim Einschalten der Zündung schlagen die unterstützten Instrumentenzeiger kurz aus und kehren zurück. Der Vergleich zeigt den Startvorgang bei stehendem Fahrzeug, keine tatsächliche Geschwindigkeit oder Motordrehzahl.", hardware: "Ein Kombiinstrument mit unterstützter Zeigertest-Funktion. Nicht jedes analoge oder digitale Kombiinstrument kann diese Animation darstellen." },
};

// Platform catalogs and curated assistance entries use different IDs for the same function.
function exampleForFunction(name: string): string | undefined {
  const value = name.toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss");
  if (/deaktivier|abschalt|ausschalt|reset/.test(value)) return undefined;
  if (/zeigertest|staging|needle sweep|gauge test/.test(value)) return "staging";
  if (/oltemperatur|oil.*temperature/.test(value)) return "oil-temperature";
  if (/optische.*einparkhilfe|optisches.*parksystem|optical parking|\bops\b|einparkhilfe.*(anzeige|darstellung)|optische.*anzeige.*einparkhilfe/.test(value)) return "ops";
  if (/spiegelabsenk|bordsteinautomatik/.test(value)) return "asc-29";
  if (/spiegel.*anklapp|anklapp.*spiegel/.test(value)) return "asc-30";
  if (/ambientebeleuchtung/.test(value)) return "asc-32";
  if (/(heckleuchten|ruckleuchten).*(tagfahr|tfl)|(tagfahr|tfl).*(heckleuchten|ruckleuchten)/.test(value)) return "asc-4";
  if (/coming[ -]?home|leaving[ -]?home/.test(value)) return "asc-111";
  if (/verkehrszeichenerkennung/.test(value)) return "vcds-vze";
  if (/ruckfahrkamera|rear[ -]?view/.test(value)) return "vcds-rear-view";
  if (/(fernlichtassistent|light assist|hba)/.test(value) && !/dynamic|dynamisch|matrix|\bdla\b/.test(value)) return "vcds-fla";
  if (/lane assist|spurhalteassistent|spurverlassenwarnung/.test(value)) return "lane-assist";
  if (/(\bacc\b|adaptive cruise|adaptive.*abstandsregel)/.test(value) && !/pacc|pradikt|moduswechsel|limiter|gra/.test(value)) return "adaptive-cruise";
  if (/fenster.*(fernbedien|funk|schlussel|komfort)|komfort[- ]?fensterbedienung|komfortbedienung.*fenster|komfort.*(offnung|schliessung)/.test(value)) return "asc-60";
  if (/luftfahrwerk/.test(value) && /absenk|tiefer|hohe|niveau.*anpass/.test(value)) return "aas";
  return undefined;
}

export default function FunctionExample({ exampleKey, functionName }: { exampleKey?: string; functionName?: string }) {
  const [expanded, setExpanded] = useState(false);
  const key = functionName ? exampleForFunction(functionName) : exampleKey;
  const aliases: Record<string, string> = { "asc-1": "staging", "vcds-lane-activate": "lane-assist", "vcds-lane-memory": "lane-assist", "vcds-lane-warning": "lane-assist", "vcds-acc": "adaptive-cruise" };
  const example = key ? examples[aliases[key] ?? key] : undefined;
  if (!example) return null;

  return <details className="td-function-example" onToggle={(event) => setExpanded(event.currentTarget.open)}>
    <summary>Details &amp; Beispielbild<ChevronDown aria-hidden="true" /></summary>
    {expanded && <div className="td-function-example-body">
      <p>{example.benefit}</p>
      <figure>
        <Image src={`/function-examples/${example.image}.webp`} alt={example.alt} width={1200} height={800} sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 580px" loading="lazy" unoptimized />
        <figcaption>KI-generiertes Beispiel · Darstellung und Funktionsumfang können je nach Fahrzeug abweichen.</figcaption>
      </figure>
      <p><strong>Voraussetzungen:</strong> {example.hardware}</p>
    </div>}
  </details>;
}
