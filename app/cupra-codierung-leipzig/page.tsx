import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "CUPRA Codierung Leipzig",
  description: "CUPRA Codierung in Leipzig für Formentor, Leon, Ateca, Born und weitere Modelle. Preise, Machbarkeit und Termin direkt prüfen.",
  alternates: { canonical: "/cupra-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="CUPRA · Leipzig"
    title="CUPRA Codierung in Leipzig"
    intro="Codierungen und Diagnose für CUPRA-Modelle wie Formentor, Leon, Ateca und Born. Je nach Fahrzeugplattform und Ausstattung lassen sich Komfort-, Licht-, Infotainment- und Assistenzfunktionen anpassen."
    benefits={["CUPRA-Spezialisierung", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Aufgabe", "Machbarkeit vor Durchführung prüfen"]}
    models={["Formentor KM", "Leon KL", "Ateca KH7", "Born K11"]}
    detailsTitle="Typische CUPRA-Codierungen"
    details={[
      "Je nach Modell und Ausstattung sind unter anderem Komfort-, Licht-, Kombiinstrument-, Infotainment- und Assistenzanpassungen möglich.",
      "Neuere CUPRA-Modelle können SFD-geschützte Steuergeräte verwenden. Ob eine gewünschte Änderung technisch möglich ist, wird daher vor Durchführung geprüft.",
      "Für unterstützte CUPRA-Modelle sind verfügbare Codierungen und Preise direkt über die Fahrzeugübersicht und den Konfigurator einsehbar."
    ]}
    faq={[
      { question: "Welche CUPRA-Modelle werden unterstützt?", answer: "Unter anderem Formentor, Leon, Ateca und Born. Die aktuelle Modellliste und verfügbare Codierungen findest du unter Fahrzeuge & Preise." },
      { question: "Kann mein CUPRA remote codiert werden?", answer: "Das ist bei geeigneter Fahrzeugplattform, kompatiblem Diagnoseinterface und stabiler Verbindung für viele Aufgaben möglich. Die Machbarkeit wird vorab geprüft." },
      { question: "Was ist bei SFD-geschützten Fahrzeugen zu beachten?", answer: "SFD kann den Zugriff auf einzelne Anpassungen einschränken. Ob eine Freischaltung oder Codierung möglich ist, hängt vom konkreten Fahrzeug und Steuergerät ab." }
    ]}
  />;
}
