import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "CUPRA Codierung Leipzig",
  description: "CUPRA Codierung und Diagnose in Leipzig für Formentor, Leon, Ateca, Born und Tavascan. Preise, Machbarkeit und technische Voraussetzungen direkt prüfen.",
  alternates: { canonical: "/cupra-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="CUPRA · Leipzig"
    title="CUPRA Codierung in Leipzig"
    intro="Codierungen und Diagnose für CUPRA-Modelle wie Formentor, Leon, Ateca, Born und Tavascan. Je nach Fahrzeugplattform, Softwarestand und Ausstattung werden Komfort-, Licht-, Infotainment- und Assistenzfunktionen fahrzeugbezogen geprüft."
    benefits={["CUPRA-Spezialisierung", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Aufgabe", "Machbarkeit vor Durchführung prüfen"]}
    models={["Formentor KM", "Leon KL", "Ateca KH7", "Born K11", "Tavascan KX"]}
    detailsTitle="Typische CUPRA-Codierungen"
    details={[
      "Je nach Modell und Ausstattung sind unter anderem Komfort-, Licht-, Kombiinstrument-, Infotainment- und Assistenzanpassungen möglich.",
      "Neuere CUPRA-Modelle können SFD-geschützte Steuergeräte verwenden. Ob eine gewünschte Änderung technisch möglich ist, wird daher vor Durchführung geprüft.",
      "Für unterstützte CUPRA-Modelle sind verfügbare Codierungen und Preise direkt über die Fahrzeugübersicht und den Konfigurator einsehbar."
    ]}
    relatedLinks={[
      { href: "/fahrzeuge/seat-cupra/cupra-tavascan-kx-codierung", label: "CUPRA Tavascan (KX)", description: "MEB-Diagnose, Softwarestand und technische Vorprüfung für den CUPRA Tavascan." },
      { href: "/fahrzeuge/seat-cupra/cupra-formentor-km-codierung", label: "CUPRA Formentor (KM)", description: "Codierungen, SFD1-Hinweise und Diagnose für den CUPRA Formentor." },
      { href: "/fahrzeuge/seat-cupra/cupra-born-k11-codierung", label: "CUPRA Born (K11)", description: "MEB-Codierung und Diagnose für den CUPRA Born." },
      { href: "/assistenzsysteme-codieren-leipzig", label: "CUPRA Assistenzsysteme", description: "Assistenzfunktionen nur bei vorhandener kompatibler Hardware prüfen." },
      { href: "/sfd-freischaltung-leipzig", label: "SFD bei CUPRA", description: "Hinweise zu SFD1 und den Grenzen bei SFD2-geschützten Fahrzeugen." },
      { href: "/remote-fahrzeugcodierung", label: "CUPRA Remote-Codierung", description: "Geeignete CUPRA-Anpassungen deutschlandweit per Remote anfragen." }
    ]}
    faq={[
      { question: "Welche CUPRA-Modelle werden unterstützt?", answer: "Unter anderem Formentor, Leon, Ateca und Born. Die aktuelle Modellliste und verfügbare Codierungen findest du unter Fahrzeuge & Preise." },
      { question: "Kann mein CUPRA remote codiert werden?", answer: "Das ist bei geeigneter Fahrzeugplattform, kompatiblem Diagnoseinterface und stabiler Verbindung für viele Aufgaben möglich. Die Machbarkeit wird vorab geprüft." },
      { question: "Was ist bei SFD-geschützten Fahrzeugen zu beachten?", answer: "SFD kann den Zugriff auf einzelne Anpassungen einschränken. Ob eine Freischaltung oder Codierung möglich ist, hängt vom konkreten Fahrzeug und Steuergerät ab." }
    ]}
  />;
}
