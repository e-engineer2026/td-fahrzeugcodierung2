import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Škoda Codierung Leipzig",
  description: "Škoda Codierung in Leipzig für Octavia, Superb, Fabia, Kodiaq, Karoq, Kamiq, Enyaq und weitere Modelle. Codierungen und Diagnose direkt prüfen.",
  alternates: { canonical: "/skoda-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Škoda · Leipzig"
    title="Škoda Codierung in Leipzig"
    intro="Codierungen und Diagnose für viele Škoda-Modelle – von PQ-Plattformen über MQB bis MQB evo und MEB. Ausstattung, Steuergeräte und Softwarestand werden vor der Änderung berücksichtigt."
    benefits={["Škoda-Modelle von Fabia bis Enyaq", "Vor Ort in Leipzig-Süd", "Codierung und Diagnose mit VAG-Werkzeugen", "Klare Preise und Vorprüfung"]}
    models={["Octavia 2 / 3 / 4", "Superb 2 / 3", "Fabia 2 / 3", "Kodiaq", "Karoq", "Kamiq", "Yeti", "Rapid", "Citigo", "Enyaq"]}
    detailsTitle="Typische Škoda-Codierungen"
    details={[
      "Je nach Fahrzeug lassen sich Komfort-, Licht-, Kombiinstrument-, Infotainment- und Assistenzfunktionen anpassen oder freischalten.",
      "Bei neueren Plattformen können SFD und andere Schutzmechanismen einzelne Anpassungen beeinflussen. Vor der Durchführung wird deshalb die konkrete Fahrzeugkonfiguration geprüft.",
      "Für viele Octavia-, Superb-, Fabia- und SUV-Baureihen sind Leistungen und Preise bereits direkt online auswählbar."
    ]}
    faq={[
      { question: "Kann ein Octavia 3 oder Octavia 4 codiert werden?", answer: "Viele Funktionen sind bei beiden Generationen möglich, unterscheiden sich aber technisch deutlich. Baujahr, Steuergerät und Softwarestand entscheiden über die konkrete Machbarkeit." },
      { question: "Werden auch Assistenzsysteme angepasst?", answer: "Je nach vorhandener Hardware und Fahrzeugkonfiguration können ausgewählte Assistenzfunktionen codiert oder angepasst werden." },
      { question: "Ist Remote-Codierung bei Škoda möglich?", answer: "Für geeignete Aufgaben und vorhandene Diagnosehardware ist eine Remote-Durchführung möglich. Die Voraussetzungen werden vorher abgestimmt." }
    ]}
  />;
}
