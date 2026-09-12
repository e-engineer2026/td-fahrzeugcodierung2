import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Steuergeräte Diagnose Leipzig",
  description: "Steuergeräte-Diagnose für VW, Audi, Škoda, SEAT und CUPRA in Leipzig: Fehlerspeicher, Messwerte, Grundeinstellungen und technische Vorprüfung.",
  alternates: { canonical: "/steuergeraete-diagnose-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="VAG Diagnose · Leipzig"
    title="Steuergeräte-Diagnose in Leipzig"
    intro="Strukturierte Diagnose an unterstützten VAG-Fahrzeugen mit VCDS, VCP oder ODIS. Je nach Fehlerbild werden Steuergeräte ausgelesen, Messwerte geprüft und geeignete Grundeinstellungen oder weitere Prüfschritte eingegrenzt."
    benefits={["Fehlerspeicher aller erreichbaren Steuergeräte", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS", "Technische Vorbewertung statt Teiletausch auf Verdacht"]}
    models={["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA", "Golf", "Passat", "Tiguan", "A3 / A4 / A5", "Octavia", "Leon", "Formentor"]}
    detailsTitle="Was gehört zur Steuergeräte-Diagnose?"
    details={[
      "Je nach Auftrag werden Fehlerspeicher, Steuergeräte-Identifikation, Messwerte, Anpassungen und relevante Grundeinstellungen geprüft.",
      "Die Diagnose grenzt die technische Ursache ein, ersetzt aber keine mechanische Prüfung, wenn der Fehler außerhalb der Fahrzeugelektronik liegt.",
      "Wenn für eine Reparatur anschließend Codierung, Parametrierung oder ein Softwareupdate erforderlich ist, wird der notwendige Folgeschritt transparent abgestimmt."
    ]}
    faq={[
      { question: "Kann der komplette Fehlerspeicher ausgelesen werden?", answer: "Bei unterstützten Fahrzeugen können die erreichbaren Steuergeräte ausgelesen werden. Umfang und Zugriff hängen von Plattform, Diagnosefähigkeit und gegebenenfalls vorhandenen Schutzmechanismen ab." },
      { question: "Werden Fehler direkt gelöscht?", answer: "Fehler werden nicht pauschal gelöscht. Zuerst wird das Fehlerbild bewertet; anschließend kann ein Löschen sinnvoll sein, um zu prüfen, welche Einträge erneut auftreten." },
      { question: "Ist auch eine Grundeinstellung möglich?", answer: "Ja, wenn das betreffende Steuergerät und die Funktion dies unterstützen. Beispiele sind bestimmte Sensor-, Stellglied- oder System-Grundeinstellungen." }
    ]}
  />;
}
