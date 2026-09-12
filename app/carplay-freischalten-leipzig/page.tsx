import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Apple CarPlay freischalten Leipzig",
  description: "Apple CarPlay / Android Auto bei unterstützten VW, Audi, Škoda, SEAT und CUPRA in Leipzig prüfen und freischalten. Hardware, Softwarestand und Termin klären.",
  alternates: { canonical: "/carplay-freischalten-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Infotainment · Leipzig"
    title="Apple CarPlay / Android Auto freischalten in Leipzig"
    intro="Smartphone-Integration wie Apple CarPlay und Android Auto kann bei kompatiblen Infotainmentsystemen je nach Hardware und Softwarestand freigeschaltet oder angepasst werden. Bei Wireless-Funktionen gelten zusätzliche Voraussetzungen."
    benefits={["Infotainmentsystem vorab prüfen", "Vor Ort in Leipzig-Süd", "Software- und Hardwarestand berücksichtigen", "Transparente Preisangabe"]}
    models={["VW Golf 7 / 8", "VW Passat B8 / B9", "VW Tiguan II", "Audi A3 / A4 / A5", "Škoda Octavia", "SEAT Leon", "CUPRA Formentor"]}
    detailsTitle="CarPlay-Freischaltung richtig prüfen"
    details={[
      "Entscheidend sind Teilenummer, Softwarestand, vorhandene USB-/Smartphone-Schnittstelle und die vom Infotainmentsystem unterstützten Funktionen.",
      "Wireless CarPlay bzw. Wireless Android Auto ist nicht bei jedem Gerät technisch vorgesehen. Im Konfigurator wird die entsprechende Leistung nur für geeignete neuere Fahrzeuge angeboten.",
      "Vor einer Freischaltung wird geprüft, ob eine reguläre Codierung bzw. unterstützte Funktionsfreigabe möglich ist."
    ]}
    faq={[
      { question: "Kann jedes MIB-System CarPlay?", answer: "Nein. Hardware, Softwarestand und die vorhandene Smartphone-Schnittstelle müssen kompatibel sein." },
      { question: "Ist Wireless CarPlay immer möglich?", answer: "Nein. Wireless-Funktionen benötigen dafür geeignete Infotainment-Hardware und Software." },
      { question: "Kann die Prüfung remote erfolgen?", answer: "Bei geeigneter Diagnose- und Remote-Verbindung können Daten vorab remote geprüft werden; die konkrete Durchführung hängt vom System ab." }
    ]}
  />;
}
