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
    detailsTitle="Typische Škoda-Codierungen und Anpassungen"
    details={[
      "Bei Škoda werden häufig Komfort-, Licht-, Kombiinstrument- und Assistenzfunktionen angepasst. Je nach Fahrzeug sind beispielsweise Coming Home/Leaving Home, Spiegel- und Fensterfunktionen, Auto-Lock/Unlock, Komfortblinken, Tagfahrlicht-Anpassungen, Zeigertest sowie ausgewählte Assistenzfunktionen möglich.",
      "Die technische Umsetzung unterscheidet sich deutlich zwischen älteren PQ-Modellen, MQB-Fahrzeugen wie Octavia 3 oder Superb 3 und neueren MQB-evo-Modellen wie Octavia 4. Auch der Enyaq auf MEB-Basis nutzt eine andere Steuergeräte- und Sicherheitsarchitektur. Deshalb wird jede gewünschte Funktion anhand des konkreten Fahrzeugs geprüft.",
      "Für Assistenzsysteme ist entscheidend, welche Kamera-, Radar- und Steuergerätehardware bereits vorhanden ist. Eine reine Codierung kann fehlende Hardware nicht ersetzen. Ist die technische Voraussetzung vorhanden, können ausgewählte Funktionen je nach Fahrzeugkonfiguration aktiviert oder angepasst werden.",
      "Bei neueren Škoda-Modellen kann SFD den Zugriff auf geschützte Anpassungen beschränken. SFD1 wird bei geeigneten Fahrzeugen und unterstützten Anpassungen berücksichtigt; SFD2-Funktionen werden nicht angeboten. Dadurch lassen sich unnötige Termine für technisch nicht erreichbare Änderungen vermeiden.",
      "Für viele Octavia-, Superb-, Fabia- und SUV-Baureihen sind Leistungen und Preise direkt online auswählbar. Mehrere Codierungen können im Konfigurator kombiniert werden; die hinterlegte Rabattstaffel wird automatisch auf den Gesamtpreis angewendet."
    ]}
    relatedLinks={[
      { href: "/fahrzeuge/skoda/octavia-3-5e-codierung", label: "Octavia 3 Codierungen", description: "Verfügbare Codierungen und Preise für den Škoda Octavia 3 / 5E." },
      { href: "/fahrzeuge/skoda/octavia-4-nx-codierung", label: "Octavia 4 Codierungen", description: "Codiermöglichkeiten für den Octavia 4 / NX inklusive Hinweise zu neueren Schutzmechanismen." },
      { href: "/fahrzeuge/skoda/superb-3v-codierung", label: "Superb 3 Codierungen", description: "Komfort-, Licht-, Assistenz- und Diagnoseleistungen für den Škoda Superb 3V." },
      { href: "/assistenzsysteme-codieren-leipzig", label: "Škoda Assistenzsysteme", description: "VZE, Lane Assist, Fernlichtassistent und weitere unterstützte Assistenzfunktionen prüfen." },
      { href: "/sfd-freischaltung-leipzig", label: "SFD1 bei Škoda", description: "Informationen zu SFD1-geschützten Anpassungen bei neueren Škoda-Fahrzeugen." },
      { href: "/remote-fahrzeugcodierung", label: "Škoda Remote-Codierung", description: "Geeignete Škoda-Codierungen deutschlandweit per Remote anfragen." }
    ]}
    faq={[
      { question: "Kann ein Octavia 3 oder Octavia 4 codiert werden?", answer: "Viele Funktionen sind bei beiden Generationen möglich, unterscheiden sich aber technisch deutlich. Baujahr, Steuergerät, Softwarestand und vorhandene Hardware entscheiden über die konkrete Machbarkeit." },
      { question: "Werden auch Škoda-Assistenzsysteme angepasst?", answer: "Je nach vorhandener Hardware und Fahrzeugkonfiguration können ausgewählte Assistenzfunktionen codiert oder angepasst werden. Fehlende Kamera- oder Radarhardware kann durch Codierung allein nicht ersetzt werden." },
      { question: "Ist Remote-Codierung bei Škoda möglich?", answer: "Für geeignete Aufgaben und vorhandene Diagnosehardware ist eine Remote-Durchführung möglich. Die Voraussetzungen werden vorab anhand von Fahrzeug und gewünschter Funktion abgestimmt." },
      { question: "Kann beim Octavia 4 SFD1 freigeschaltet werden?", answer: "Bei unterstützten SFD1-Anpassungen kann die notwendige Freigabe berücksichtigt werden. Welche Funktionen konkret erreichbar sind, hängt vom Steuergerät und Softwarestand ab; SFD2 wird nicht angeboten." },
      { question: "Welche Škoda-Modelle sind auf der Website hinterlegt?", answer: "Unter anderem Octavia, Superb, Fabia, Kodiaq, Karoq, Kamiq, Yeti, Rapid, Citigo und Enyaq. Die genaue Baureihe kannst du unter Fahrzeuge & Preise auswählen." },
      { question: "Was soll ich für eine technische Vorprüfung schicken?", answer: "Am hilfreichsten sind Modell, Baujahr, gewünschte Funktion und – wenn vorhanden – ein aktueller VCDS-Autoscan. Damit lassen sich Steuergeräte und Softwarestände schneller zuordnen." }
    ]}
  />;
}
