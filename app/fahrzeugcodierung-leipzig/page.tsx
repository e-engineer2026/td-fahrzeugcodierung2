import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Fahrzeugcodierung Leipzig",
  description: "Fahrzeugcodierung und Diagnose für VW, Audi, Škoda, SEAT und CUPRA in Leipzig-Süd. Funktionen prüfen, Preis konfigurieren und Termin buchen.",
  alternates: { canonical: "/fahrzeugcodierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Leipzig-Süd"
    title="Fahrzeugcodierung in Leipzig"
    intro="TD Fahrzeugcodierung bietet Codierungen, Anpassungen und Diagnose für Fahrzeuge des VAG-Konzerns direkt in Leipzig-Süd. Vor der Durchführung wird geprüft, ob die gewünschte Funktion mit Steuergeräten, Softwarestand und Ausstattung deines Fahrzeugs kompatibel ist."
    benefits={["Vor Ort in Leipzig-Süd", "VW · Audi · Škoda · SEAT · CUPRA", "VCDS · VCP · ODIS je nach Aufgabe", "Transparente Preise und technische Vorprüfung"]}
    models={["VW Golf", "VW Passat", "VW Tiguan", "Audi A3", "Audi A4", "Audi A6", "Škoda Octavia", "Škoda Superb", "SEAT Leon", "CUPRA Formentor"]}
    detailsTitle="Codierung, Diagnose und Anpassungen vor Ort"
    details={[
      "Typische Leistungen sind Komfort-, Licht-, Infotainment- und Assistenzfunktionen, Anpassungen nach Nachrüstungen sowie Diagnose und Grundeinstellungen.",
      "Nicht jede Funktion ist bei jedem Baujahr oder Steuergerät verfügbar. Deshalb wird die technische Machbarkeit vor der eigentlichen Änderung geprüft.",
      "Für geeignete Fahrzeuge und Aufgaben ist alternativ auch eine Remote-Codierung möglich."
    ]}
    faq={[
      { question: "Wo findet die Codierung in Leipzig statt?", answer: "Vor-Ort-Termine finden in Leipzig-Süd statt. Die genaue Terminart und alle relevanten Daten werden bei der Buchung angezeigt." },
      { question: "Kann ich vorher sehen, was die Codierung kostet?", answer: "Ja. Im Konfigurator kannst du Fahrzeug, Baujahr und gewünschte Funktionen auswählen und die hinterlegten Preise direkt sehen." },
      { question: "Sind auch Diagnose und Grundeinstellungen möglich?", answer: "Ja, je nach Fahrzeug und Steuergerät können Diagnose, Grundeinstellungen und weitere Anpassungen durchgeführt werden." }
    ]}
  />;
}
