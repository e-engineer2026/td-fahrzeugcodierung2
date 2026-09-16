import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "VW Codierung Leipzig | Golf 7, Golf 8, Tiguan & Passat",
  description: "VW Codierung in Leipzig für Golf 5 bis 8, Passat, Tiguan, Polo, T-Roc, Touran, Caddy und Transporter. VCDS, VCP und ODIS je nach Fahrzeug und Aufgabe.",
  alternates: { canonical: "/vw-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Volkswagen · Leipzig"
    title="VW Codierung in Leipzig"
    intro="Codierungen und Diagnose für zahlreiche Volkswagen-Modelle in Leipzig – von Golf 5, Golf 6 und Tiguan 5N bis Golf 7, Golf 8, Passat B8/B9 und aktuelle MQB-evo-Fahrzeuge. Je nach Fahrzeug können Komfort-, Licht-, Infotainment- und Assistenzfunktionen mit VCDS, VCP oder ODIS angepasst werden."
    benefits={["VW-Spezialisierung", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Aufgabe", "Machbarkeit vor Durchführung prüfen"]}
    models={["Golf 5 / 6 / 7 / 8", "Passat B6 / B7 / B8 / B9", "Tiguan 5N / Tiguan II", "Polo 6R / AW", "T-Roc", "Touran", "Caddy", "Transporter T5 / T6 / T6.1", "Touareg"]}
    detailsTitle="Typische VW-Codierungen und Anpassungen"
    details={[
      "Bei Volkswagen werden besonders häufig Komfort- und Lichtfunktionen angefragt. Dazu zählen beispielsweise Coming Home und Leaving Home, Spiegelanklappen, Spiegelabsenkung, Fensterkomfort, Auto-Lock/Unlock, Komfortblinken sowie Anpassungen am Tagfahrlicht und an den Heckleuchten. Welche Kanäle verfügbar sind, hängt von Plattform und Steuergerät ab.",
      "Auch Kombiinstrument- und Assistenzfunktionen können je nach Fahrzeug angepasst werden. Dazu gehören unter anderem Zeigertest/Staging, Verkehrszeichenerkennung, Fernlichtassistent und weitere Funktionen, wenn die dafür erforderliche Hardware bereits vorhanden und kompatibel ist.",
      "Die technische Basis unterscheidet sich deutlich zwischen älteren PQ-Fahrzeugen wie Golf 5, Golf 6 oder Tiguan 5N und neueren MQB- bzw. MQB-evo-Fahrzeugen wie Golf 7, Golf 8, Passat B8/B9 oder aktuellen Tiguan-Baureihen. Deshalb werden Codierungen nicht pauschal übertragen, sondern immer passend zum konkreten Steuergerät durchgeführt.",
      "Bei neueren VW-Modellen kann SFD den Zugriff auf geschützte Anpassungen einschränken. SFD1 wird bei geeigneten Fahrzeugen berücksichtigt; SFD2-Funktionen werden nicht angeboten. So lässt sich vor dem Termin klären, ob eine gewünschte Änderung ohne unnötige Versuche realistisch möglich ist.",
      "Für viele unterstützte Modelle sind konkrete Codierungen und Preise bereits in der Fahrzeugübersicht hinterlegt. Dort kannst du dein Modell auswählen, mehrere Funktionen kombinieren und den Gesamtpreis inklusive der hinterlegten Rabattstaffel direkt sehen."
    ]}
    relatedLinks={[
      { href: "/fahrzeuge/vw/golf-7-5g-codierung", label: "Golf 7 Codierungen", description: "Verfügbare Funktionen und Preise für VW Golf 7 / 5G ansehen." },
      { href: "/fahrzeuge/vw/golf-8-cd-codierung", label: "Golf 8 Codierungen", description: "Codiermöglichkeiten für Golf 8 inklusive technischer Hinweise zu neueren Steuergeräten." },
      { href: "/fahrzeuge/vw/tiguan-5n-codierung", label: "Tiguan 5N Codierungen", description: "Typische Komfort-, Licht- und Diagnoseanpassungen für den Tiguan 5N." },
      { href: "/fahrzeuge/vw/passat-b8-3g-codierung", label: "Passat B8 Codierungen", description: "Codierungen und Anpassungen für den Passat B8 / 3G mit MQB-Technik." },
      { href: "/assistenzsysteme-codieren-leipzig", label: "VW Assistenzsysteme", description: "VZE, Lane Assist, Fernlichtassistent und weitere unterstützte Assistenzfunktionen prüfen." },
      { href: "/remote-fahrzeugcodierung", label: "VW Remote-Codierung", description: "Geeignete Volkswagen-Codierungen deutschlandweit per Remote durchführen lassen." }
    ]}
    faq={[
      { question: "Welche VW-Modelle werden unterstützt?", answer: "Unter anderem Golf, Passat, Tiguan, Polo, T-Roc, Touran, Caddy, Transporter und Touareg. Die aktuelle Modellliste mit Baureihen findest du unter Fahrzeuge & Preise." },
      { question: "Kann mein VW auch remote codiert werden?", answer: "Bei geeigneter Hardware, einem kompatiblen Diagnoseinterface und stabiler Verbindung ist für viele Aufgaben auch eine Remote-Durchführung möglich. Die Eignung wird vorab geprüft." },
      { question: "Sind alle aufgeführten VW-Funktionen garantiert möglich?", answer: "Nein. Entscheidend sind Baujahr, Plattform, Steuergeräte, Softwarestand und vorhandene Hardware. Die Machbarkeit wird deshalb vor der Durchführung geprüft." },
      { question: "Kann bei Golf 7 oder Passat B8 mit VCDS codiert werden?", answer: "Viele Anpassungen dieser MQB-Fahrzeuge lassen sich mit VCDS durchführen. Einzelne Funktionen erfordern je nach Steuergerät andere Werkzeuge oder zusätzliche Voraussetzungen." },
      { question: "Was ist bei Golf 8 oder Passat B9 zu beachten?", answer: "Neuere MQB-evo-Fahrzeuge verfügen häufiger über geschützte Anpassungen und neuere Sicherheitsmechanismen. SFD1 kann bei geeigneten Anpassungen berücksichtigt werden; SFD2 wird nicht angeboten." },
      { question: "Kann ich eine VW-Codierung anfragen, die nicht auf der Website steht?", answer: "Ja. Sende Modell, Baujahr und die gewünschte Funktion. Wenn möglich, hilft zusätzlich ein VCDS-Autoscan bei der technischen Vorprüfung." }
    ]}
  />;
}
