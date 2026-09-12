import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Verkehrszeichenerkennung codieren Leipzig",
  description: "Verkehrszeichenerkennung (VZE) für unterstützte VW, Audi, Škoda, SEAT und CUPRA in Leipzig codieren oder freischalten. Voraussetzungen und Termin prüfen.",
  alternates: { canonical: "/verkehrszeichenerkennung-codieren-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Assistenzsystem · Leipzig"
    title="Verkehrszeichenerkennung (VZE) codieren in Leipzig"
    intro="Verkehrszeichenerkennung kann bei geeigneter Kamera-, Navigations- und Steuergeräteausstattung bei vielen VAG-Fahrzeugen angepasst oder freigeschaltet werden. Die Machbarkeit wird vorab fahrzeugbezogen geprüft."
    benefits={["VZE fahrzeugbezogen prüfen", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Plattform", "Klare Preise im Konfigurator"]}
    models={["VW Golf 7 / 8", "VW Passat B8", "VW Tiguan II", "Audi A3 8V / 8Y", "Škoda Octavia 3 / 4", "SEAT Leon 5F", "CUPRA Formentor"]}
    detailsTitle="Voraussetzungen für VZE"
    details={[
      "Entscheidend sind unter anderem Frontkamera, Infotainment-/Navigationssystem, Kombiinstrument und die im Fahrzeug vorhandenen Steuergeräte.",
      "Je nach Plattform kann eine reine Codierung ausreichen; bei anderen Fahrzeugen sind zusätzliche Parametrierungen oder Freischaltungen erforderlich.",
      "Vor der Durchführung wird geprüft, welche Variante für das konkrete Fahrzeug technisch sinnvoll und zulässig ist."
    ]}
    faq={[
      { question: "Kann VZE bei jedem Fahrzeug freigeschaltet werden?", answer: "Nein. Die notwendige Kamera- und Steuergeräteausstattung muss vorhanden und kompatibel sein." },
      { question: "Ist VZE auch per Remote möglich?", answer: "Bei geeigneter Plattform, Diagnoseinterface und Verbindung kann die Durchführung teilweise remote erfolgen." },
      { question: "Wie finde ich den Preis?", answer: "Fahrzeug und Baujahr im Konfigurator auswählen. Dort werden die für das Fahrzeug hinterlegten Funktionen und Preise angezeigt." }
    ]}
  />;
}
