import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "VCDS Codierung Leipzig",
  description: "VCDS Codierung und Diagnose für VW, Audi, Škoda, SEAT und CUPRA in Leipzig. Fahrzeug prüfen, Funktionen und Preise auswählen und Termin direkt buchen.",
  alternates: { canonical: "/vcds-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="VAG Diagnose · Leipzig"
    title="VCDS Codierung in Leipzig"
    intro="Codierungen, Anpassungen und Diagnosearbeiten an unterstützten VAG-Fahrzeugen mit VCDS – je nach Plattform ergänzt durch VCP oder ODIS. Vor der Durchführung wird geprüft, welches Werkzeug für die konkrete Aufgabe geeignet ist."
    benefits={["VCDS für viele VAG-Plattformen", "Vor Ort in Leipzig-Süd", "VCP / ODIS bei Bedarf", "Fahrzeugbezogene Preisübersicht"]}
    models={["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA", "Golf", "Passat", "Tiguan", "A3 / A4 / A5", "Octavia", "Leon", "Formentor"]}
    detailsTitle="Codierung und Diagnose mit VCDS"
    details={[
      "Typische Arbeiten sind Anpassungskanäle, lange Codierung, Grundeinstellungen, Diagnose und das Auslesen von Steuergeräten.",
      "Nicht jede Aufgabe lässt sich ausschließlich mit VCDS lösen. Bei Parametrierung, Flash oder bestimmten neueren Plattformen können VCP, ODIS oder zusätzliche Freischaltungen erforderlich sein.",
      "Der Konfigurator zeigt für viele Fahrzeuge bereits hinterlegte Codierungen und Preise."
    ]}
    faq={[
      { question: "Welche Marken werden mit VCDS unterstützt?", answer: "Der Schwerpunkt liegt auf Fahrzeugen des Volkswagen-Konzerns, insbesondere VW, Audi, Škoda, SEAT und CUPRA." },
      { question: "Kann jede Codierung mit VCDS durchgeführt werden?", answer: "Nein. Je nach Fahrzeug und Aufgabe können VCP, ODIS, SFD-Freischaltungen oder andere Verfahren erforderlich sein." },
      { question: "Ist auch Fehlerdiagnose möglich?", answer: "Ja. Steuergeräte können ausgelesen und Fehlerbilder vorbewertet werden; der konkrete Umfang hängt vom Fahrzeug ab." }
    ]}
  />;
}
