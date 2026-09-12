import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Fernlichtassistent codieren Leipzig",
  description: "Fernlichtassistent / Light Assist bei unterstützten VW, Audi, Škoda, SEAT und CUPRA in Leipzig codieren oder anpassen. Voraussetzungen und Termin prüfen.",
  alternates: { canonical: "/fernlichtassistent-codieren-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Lichtassistenz · Leipzig"
    title="Fernlichtassistent / Light Assist codieren in Leipzig"
    intro="Fernlichtassistent, Light Assist und je nach Fahrzeug weitere Lichtassistenzfunktionen können bei passender Kamera-, Licht- und Steuergeräteausstattung angepasst oder freigeschaltet werden."
    benefits={["Light Assist gezielt prüfen", "Vor Ort in Leipzig-Süd", "Kamera- und Scheinwerferausstattung berücksichtigen", "Preis direkt konfigurieren"]}
    models={["VW Golf 7 / 8", "VW Passat B8", "VW Tiguan II", "Audi A3 / A4 / A5", "Škoda Octavia", "SEAT Leon", "CUPRA Formentor"]}
    detailsTitle="Fernlichtassistent und Lichtsystem"
    details={[
      "Die mögliche Funktion hängt von Frontkamera, Lichtschalter, Scheinwerfern, Bordnetzsteuergerät und Softwarestand ab.",
      "Light Assist und Dynamic Light Assist sind technisch unterschiedliche Funktionen. Welche Variante unterstützt wird, muss deshalb am konkreten Fahrzeug geprüft werden.",
      "Bei Matrix- oder adaptiven Lichtsystemen können zusätzliche Voraussetzungen und Grundeinstellungen relevant sein."
    ]}
    faq={[
      { question: "Ist Light Assist dasselbe wie Dynamic Light Assist?", answer: "Nein. Dynamic Light Assist bzw. Matrix-Funktionen benötigen eine entsprechend ausgelegte Licht- und Kameratechnik." },
      { question: "Kann der Fernlichtassistent ohne Kamera aktiviert werden?", answer: "In der Regel nein. Für die automatische Erkennung ist eine kompatible Kamera bzw. Sensortechnik erforderlich." },
      { question: "Wie wird die Machbarkeit geprüft?", answer: "Anhand von Modell, Baujahr, vorhandenen Steuergeräten und Licht-/Kameraausstattung." }
    ]}
  />;
}
