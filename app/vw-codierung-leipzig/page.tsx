import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "VW Codierung Leipzig",
  description: "VW Codierung in Leipzig für Golf, Passat, Tiguan, Polo, T-Roc, Touran, Caddy, Transporter und weitere Modelle. Preise und Termin direkt prüfen.",
  alternates: { canonical: "/vw-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Volkswagen · Leipzig"
    title="VW Codierung in Leipzig"
    intro="Codierungen und Diagnose für zahlreiche Volkswagen-Modelle – von PQ-Plattformen bis MQB und MQB evo. Je nach Fahrzeug können Komfort-, Licht-, Infotainment- und Assistenzfunktionen angepasst werden."
    benefits={["VW-Spezialisierung", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Aufgabe", "Machbarkeit vor Durchführung prüfen"]}
    models={["Golf 5 / 6 / 7 / 8", "Passat B6 / B7 / B8 / B9", "Tiguan 5N / Tiguan II", "Polo 6R / AW", "T-Roc", "Touran", "Caddy", "Transporter T5 / T6 / T6.1", "Touareg"]}
    detailsTitle="Typische VW-Codierungen"
    details={[
      "Je nach Ausstattung sind beispielsweise Coming-/Leaving-Home, Spiegel- und Komfortfunktionen, Tagfahrlicht, Kombiinstrument-Anpassungen oder Assistenzfunktionen möglich.",
      "Bei neueren Fahrzeugen können Schutzmechanismen wie SFD die Durchführung beeinflussen. Ob und wie eine Änderung möglich ist, wird fahrzeugbezogen geprüft.",
      "Für viele unterstützte Modelle sind konkrete Codierungen und Preise bereits in der Fahrzeugübersicht hinterlegt."
    ]}
    faq={[
      { question: "Welche VW-Modelle werden unterstützt?", answer: "Unter anderem Golf, Passat, Tiguan, Polo, T-Roc, Touran, Caddy, Transporter und Touareg. Die aktuelle Modellliste findest du unter Fahrzeuge & Preise." },
      { question: "Kann mein VW auch remote codiert werden?", answer: "Bei geeigneter Hardware, Diagnoseinterface und stabiler Verbindung ist für viele Aufgaben auch eine Remote-Durchführung möglich." },
      { question: "Sind alle aufgeführten Funktionen garantiert möglich?", answer: "Nein. Entscheidend sind Baujahr, Steuergeräte, Softwarestand und Ausstattung. Die Machbarkeit wird deshalb vor der Durchführung geprüft." }
    ]}
  />;
}
