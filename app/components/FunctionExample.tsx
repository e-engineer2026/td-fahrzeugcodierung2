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
};

// Platform catalogs and curated assistance entries use different IDs for the same function.
function exampleForFunction(name: string): string | undefined {
  const value = name.toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss");
  if (/deaktivier|abschalt|ausschalt|reset/.test(value)) return undefined;
  if (/spiegelabsenk|bordsteinautomatik/.test(value)) return "asc-29";
  if (/spiegel.*anklapp|anklapp.*spiegel/.test(value)) return "asc-30";
  if (/ambientebeleuchtung/.test(value)) return "asc-32";
  if (/(heckleuchten|ruckleuchten).*(tagfahr|tfl)|(tagfahr|tfl).*(heckleuchten|ruckleuchten)/.test(value)) return "asc-4";
  if (/coming[ -]?home|leaving[ -]?home/.test(value)) return "asc-111";
  if (/verkehrszeichenerkennung/.test(value)) return "vcds-vze";
  if (/ruckfahrkamera|rear[ -]?view/.test(value)) return "vcds-rear-view";
  if (/luftfahrwerk/.test(value) && /absenk|tiefer|hohe|niveau.*anpass/.test(value)) return "aas";
  return undefined;
}

export default function FunctionExample({ exampleKey, functionName }: { exampleKey?: string; functionName?: string }) {
  const [expanded, setExpanded] = useState(false);
  const key = functionName ? exampleForFunction(functionName) : exampleKey;
  const example = key ? examples[key] : undefined;
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
