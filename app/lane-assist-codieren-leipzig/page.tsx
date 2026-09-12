import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Lane Assist codieren Leipzig",
  description: "Lane Assist / Spurhalteassistent bei unterstützten VW, Audi, Škoda, SEAT und CUPRA in Leipzig codieren oder anpassen. Voraussetzungen und Termin prüfen.",
  alternates: { canonical: "/lane-assist-codieren-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Assistenzsystem · Leipzig"
    title="Lane Assist / Spurhalteassistent codieren in Leipzig"
    intro="Lane Assist kann bei geeigneter Frontkamera und passender Steuergeräteausstattung bei vielen VAG-Fahrzeugen aktiviert oder angepasst werden. Vor jeder Durchführung wird geprüft, welche Funktionen das konkrete Fahrzeug unterstützt."
    benefits={["Lane Assist fahrzeugbezogen prüfen", "Vor Ort in Leipzig-Süd", "Frontkamera und Softwarestand berücksichtigen", "Direkte Preis- und Terminwahl"]}
    models={["VW Golf 7 / 8", "VW Passat B8", "VW Tiguan II", "Audi A3 8V / 8Y", "Škoda Octavia 3 / 4", "SEAT Leon 5F", "CUPRA Formentor"]}
    detailsTitle="Was für Lane Assist benötigt wird"
    details={[
      "In der Regel ist eine kompatible Frontkamera erforderlich. Zusätzlich müssen Gateway, Lenkung, Kombiinstrument und weitere beteiligte Steuergeräte die Funktion unterstützen.",
      "Je nach Fahrzeug kann neben Codierung auch eine korrekte Kalibrierung der Kamera notwendig sein. Eine vorhandene Hardware bedeutet deshalb nicht automatisch, dass jede Funktion ohne weitere Arbeiten verfügbar ist.",
      "Die konkrete Machbarkeit und der Umfang werden anhand von Modell, Baujahr und Ausstattung geprüft."
    ]}
    faq={[
      { question: "Reicht eine Frontkamera für Lane Assist aus?", answer: "Nicht immer. Auch Softwarestand, Steuergeräte und Fahrzeugkonfiguration müssen die Funktion unterstützen." },
      { question: "Muss die Kamera kalibriert werden?", answer: "Nach bestimmten Arbeiten oder bei abweichenden Kameradaten kann eine Kalibrierung erforderlich sein." },
      { question: "Kann Lane Assist remote codiert werden?", answer: "Einige Codierarbeiten sind remote möglich; notwendige Kalibrierungen oder Hardwarearbeiten erfolgen vor Ort." }
    ]}
  />;
}
