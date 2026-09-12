import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Audi Codierung Leipzig",
  description: "Audi Codierung in Leipzig für A1, A3, A4, A5, A6, A7, Q3, Q5, Q7, Q8, TT und weitere Modelle. Codierungen, Diagnose und Anpassungen prüfen.",
  alternates: { canonical: "/audi-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Audi · Leipzig"
    title="Audi Codierung in Leipzig"
    intro="Codierungen, Diagnose und Anpassungen für zahlreiche Audi-Baureihen – von PQ- und MLB-Fahrzeugen bis MQB und MLBevo. Funktionen werden fahrzeugbezogen geprüft und transparent angeboten."
    benefits={["Audi-Baureihen von A1 bis Q8", "Vor Ort in Leipzig-Süd", "Diagnose und Codierung mit VAG-Werkzeugen", "Technische Vorprüfung vor Änderungen"]}
    models={["A1 8X / GB", "A3 8P / 8V / 8Y", "A4 8K / B9", "A5 8T / F5 / FU", "A6 C6 / C7 / C8", "A7 4G / 4K", "Q3", "Q5", "Q7", "Q8", "TT"]}
    detailsTitle="Typische Audi-Anpassungen"
    details={[
      "Möglich sind je nach Ausstattung Komfort-, Licht-, Infotainment- und Assistenzfunktionen sowie Anpassungen nach Hardwareänderungen oder Nachrüstungen.",
      "Bei Audi unterscheiden sich Codiermöglichkeiten stark nach Plattform, Steuergerät und Softwarestand. Deshalb wird nicht pauschal, sondern anhand des konkreten Fahrzeugs geprüft.",
      "Für unterstützte Modelle sind viele Leistungen bereits mit Preis und technischem Hinweis in der Fahrzeugübersicht hinterlegt."
    ]}
    faq={[
      { question: "Welche Audi-Modelle sind abgedeckt?", answer: "Unter anderem A1, A3, A4, A5, A6, A7, TT sowie Q3, Q5, Q7 und Q8. Die genaue Baureihe und das Baujahr kannst du in der Fahrzeugübersicht auswählen." },
      { question: "Sind Codierungen bei neueren Audi-Modellen möglich?", answer: "Teilweise ja. Schutzmechanismen und Softwarestände können einzelne Änderungen begrenzen. Die Machbarkeit wird vorab geprüft." },
      { question: "Kann ich eine konkrete Funktion anfragen, die nicht gelistet ist?", answer: "Ja. Sende Fahrzeug, Baujahr und gewünschte Funktion per WhatsApp oder Kontaktformular zur Vorprüfung." }
    ]}
  />;
}
