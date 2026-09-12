import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "SEAT Codierung Leipzig",
  description: "SEAT Codierung in Leipzig für Leon, Ibiza, Arona, Tarraco, Toledo, Altea, Mii und weitere Modelle. Preise und Termin direkt prüfen.",
  alternates: { canonical: "/seat-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="SEAT · Leipzig"
    title="SEAT Codierung in Leipzig"
    intro="Codierungen und Diagnose für zahlreiche SEAT-Modelle – je nach Plattform und Ausstattung von Komfort- und Lichtfunktionen bis zu Infotainment- und Assistenzanpassungen."
    benefits={["SEAT-Spezialisierung", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Aufgabe", "Machbarkeit vor Durchführung prüfen"]}
    models={["Leon 5F", "Ibiza KJ", "Arona KJ7", "Tarraco KN2", "Toledo 4 NH", "Altea / Altea XL 5P", "Mii AA"]}
    detailsTitle="Typische SEAT-Codierungen"
    details={[
      "Je nach Fahrzeug und Ausstattung sind beispielsweise Coming-/Leaving-Home, Spiegel- und Komfortfunktionen, Tagfahrlicht, Kombiinstrument-Anpassungen und Assistenzfunktionen möglich.",
      "Bei neueren Modellen können Schutzmechanismen wie SFD die Durchführung beeinflussen. Die technische Machbarkeit wird deshalb vor dem Termin fahrzeugbezogen geprüft.",
      "Für unterstützte Modelle sind viele Codierungen und Preise bereits direkt in der Fahrzeugübersicht hinterlegt."
    ]}
    faq={[
      { question: "Welche SEAT-Modelle werden unterstützt?", answer: "Unter anderem Leon, Ibiza, Arona, Tarraco, Toledo, Altea und Mii. Die aktuelle Modellliste findest du unter Fahrzeuge & Preise." },
      { question: "Kann mein SEAT auch remote codiert werden?", answer: "Bei geeigneter Hardware, kompatiblem Diagnoseinterface und stabiler Verbindung ist für viele Aufgaben auch eine Remote-Durchführung möglich." },
      { question: "Sind alle Codierungen bei jedem SEAT möglich?", answer: "Nein. Entscheidend sind Baujahr, Steuergeräte, Softwarestand und vorhandene Ausstattung. Deshalb wird die Machbarkeit vor der Durchführung geprüft." }
    ]}
  />;
}
