import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Assistenzsysteme codieren Leipzig",
  description: "Assistenzsysteme bei VW, Audi, Škoda, SEAT und CUPRA in Leipzig codieren und anpassen: VZE, Lane Assist, Fernlichtassistent und weitere Funktionen nach technischer Prüfung.",
  alternates: { canonical: "/assistenzsysteme-codieren-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Fahrerassistenz · Leipzig"
    title="Assistenzsysteme in Leipzig codieren"
    intro="Codierung und Anpassung unterstützter Fahrerassistenzsysteme bei Fahrzeugen von Volkswagen, Audi, Škoda, SEAT und CUPRA. Vor jeder Durchführung wird geprüft, ob die erforderliche Kamera-, Radar-, Steuergeräte- und Softwareausstattung vorhanden ist."
    benefits={["Fahrzeugbezogene Machbarkeitsprüfung", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Plattform", "Klare Auswahl im Fahrzeug-Konfigurator"]}
    models={["VW Golf", "VW Passat", "VW Tiguan", "Audi A3 / A4 / A5", "Škoda Octavia", "Škoda Superb", "SEAT Leon", "CUPRA Formentor"]}
    detailsTitle="Welche Assistenzfunktionen sind möglich?"
    details={[
      "Typische Anfragen betreffen Verkehrszeichenerkennung, Lane Assist, Fernlichtassistent sowie weitere fahrzeugabhängige Assistenzfunktionen.",
      "Eine reine Codierung reicht nicht immer aus. Je nach Fahrzeug können passende Hardware, Parametrierung, Kalibrierung oder eine SFD-Freischaltung erforderlich sein.",
      "Vor dem Termin werden Fahrzeug, Baujahr und gewünschte Funktion geprüft, damit keine Funktion zugesagt wird, die mit der vorhandenen Ausstattung technisch nicht umsetzbar ist."
    ]}
    faq={[
      { question: "Kann Lane Assist nur per Codierung aktiviert werden?", answer: "Das hängt vom Fahrzeug ab. Eine kompatible Frontkamera und passende Steuergeräte müssen vorhanden sein; je nach Plattform können zusätzliche Anpassungen oder Kalibrierungen erforderlich sein." },
      { question: "Ist Verkehrszeichenerkennung nachrüstbar?", answer: "Bei geeigneter Hardware kann eine Aktivierung möglich sein. Entscheidend sind unter anderem Kamera, Infotainment, Kombiinstrument, Softwarestand und Fahrzeugkonfiguration." },
      { question: "Welche Werkzeuge werden verwendet?", answer: "Je nach Plattform und Aufgabe kommen VCDS, VCP oder ODIS zum Einsatz. Bei neueren Fahrzeugen kann zusätzlich eine SFD-Freischaltung erforderlich sein." }
    ]}
  />;
}
