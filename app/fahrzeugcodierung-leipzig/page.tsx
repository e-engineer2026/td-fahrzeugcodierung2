import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Fahrzeugcodierung Leipzig | VW, Audi, Škoda & VAG Diagnose",
  description: "Fahrzeugcodierung in Leipzig-Süd für VW, Audi, Škoda, SEAT und CUPRA. VCDS, VCP und ODIS, Diagnose, Assistenzsysteme sowie Licht- und Komfortcodierungen.",
  alternates: { canonical: "/fahrzeugcodierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Leipzig-Süd"
    title="Fahrzeugcodierung in Leipzig"
    intro="TD Fahrzeugcodierung bietet VAG-Codierung, Diagnose und Anpassungen für Volkswagen, Audi, Škoda, SEAT und CUPRA direkt in Leipzig-Süd. Unterstützt werden zahlreiche Baureihen wie Golf 7 und 8, Tiguan, Passat, Audi A3 bis A6 sowie Škoda Octavia 3 und 4. Vor jeder Änderung werden Steuergeräte, Softwarestand und vorhandene Hardware geprüft."
    benefits={["Vor Ort in Leipzig-Süd", "VW · Audi · Škoda · SEAT · CUPRA", "VCDS · VCP · ODIS je nach Aufgabe", "Transparente Preise und technische Vorprüfung"]}
    models={["VW Golf 7 / Golf 8", "VW Passat", "VW Tiguan", "Audi A3", "Audi A4 / A5", "Audi A6", "Škoda Octavia 3 / 4", "Škoda Superb", "SEAT Leon", "CUPRA Formentor"]}
    detailsTitle="Codierung, Diagnose und Anpassungen vor Ort"
    details={[
      "Zum Leistungsspektrum gehören Komfort-, Licht-, Infotainment- und Assistenzfunktionen, Anpassungen nach Nachrüstungen sowie Diagnose und Grundeinstellungen. Häufig angefragt werden Coming Home und Leaving Home, Spiegelanklappen und Spiegelabsenkung, Fensterkomfort, Tagfahrlicht, Zeigertest/Staging sowie – bei vorhandener kompatibler Hardware – Verkehrszeichenerkennung, Lane Assist und Fernlichtassistent.",
      "Welche Codierung tatsächlich möglich ist, hängt nicht nur vom Modellnamen ab. Entscheidend sind unter anderem Baujahr, Plattform, verbaute Steuergeräte, Softwarestand und die vorhandene Hardware. Deshalb wird vor jeder Änderung geprüft, ob die gewünschte Funktion technisch unterstützt wird und ob zusätzliche Voraussetzungen bestehen.",
      "Bei neueren VAG-Fahrzeugen können Schutzmechanismen wie SFD den Zugriff auf Anpassungskanäle einschränken. SFD1 wird bei geeigneten Fahrzeugen berücksichtigt; SFD2-Funktionen werden nicht angeboten. Dadurch bleibt schon vor dem Termin klar, welche Arbeiten realistisch umsetzbar sind.",
      "Für viele Fahrzeuge sind die verfügbaren Leistungen direkt im Online-Konfigurator hinterlegt. Dort lassen sich Fahrzeug, Baujahr und gewünschte Codierungen auswählen. Der Preis wird transparent angezeigt; bei mehreren Codierungen wird die hinterlegte Rabattstaffel automatisch berücksichtigt.",
      "Neben Vor-Ort-Terminen in Leipzig-Süd ist für geeignete Fahrzeuge und Aufgaben auch Remote-Codierung möglich. Voraussetzung sind ein kompatibles Diagnoseinterface, eine stabile Verbindung und eine Funktion, die sich technisch sicher aus der Ferne durchführen lässt."
    ]}
    relatedLinks={[
      { href: "/vw-codierung-leipzig", label: "VW Codierung Leipzig", description: "Codierungen und Diagnose für Golf 5 bis 8, Passat, Tiguan, Polo, T-Roc und weitere VW-Modelle." },
      { href: "/audi-codierung-leipzig", label: "Audi Codierung Leipzig", description: "Audi-spezifische Codierungen, Anpassungen und Diagnose für A1, A3, A4, A5, A6, A7 und Q-Modelle." },
      { href: "/skoda-codierung-leipzig", label: "Škoda Codierung Leipzig", description: "Codierungen für Octavia 3 und 4, Superb, Fabia, Kodiaq, Karoq, Enyaq und weitere Baureihen." },
      { href: "/assistenzsysteme-codieren-leipzig", label: "Assistenzsysteme codieren", description: "Informationen zu VZE, Lane Assist, Fernlichtassistent und weiteren unterstützten Funktionen." },
      { href: "/vcds-codierung-leipzig", label: "VCDS Codierung Leipzig", description: "VCDS-basierte Anpassungen, Diagnose und technische Vorprüfung für viele VAG-Fahrzeuge." },
      { href: "/remote-fahrzeugcodierung", label: "Remote Fahrzeugcodierung", description: "Geeignete Codierungen deutschlandweit per Remote durchführen lassen." }
    ]}
    faq={[
      { question: "Wo findet die Fahrzeugcodierung in Leipzig statt?", answer: "Vor-Ort-Termine finden in Leipzig-Süd in der Schenkendorfstraße 33, 04275 Leipzig, nach Vereinbarung statt. Die Terminart und die benötigten Fahrzeugdaten werden bei der Buchung angezeigt." },
      { question: "Kann ich vorher sehen, was die Codierung kostet?", answer: "Ja. Im Konfigurator kannst du Fahrzeug, Baujahr und gewünschte Funktionen auswählen. Hinterlegte Einzelpreise und mögliche Rabatte bei mehreren Codierungen werden direkt berechnet." },
      { question: "Sind auch Diagnose und Grundeinstellungen möglich?", answer: "Ja. Je nach Fahrzeug und Steuergerät sind Diagnose, Fehlerspeicher-Auswertung, Grundeinstellungen und weitere Anpassungen möglich. Der konkrete Umfang wird fahrzeugbezogen geprüft." },
      { question: "Welche Marken werden unterstützt?", answer: "Der Schwerpunkt liegt auf Fahrzeugen des VAG-Konzerns: Volkswagen, Audi, Škoda, SEAT und CUPRA. Je nach Plattform kommen VCDS, VCP oder ODIS zum Einsatz." },
      { question: "Kann jede gewünschte Funktion einfach freigeschaltet werden?", answer: "Nein. Viele Funktionen setzen bestimmte Hardware, kompatible Steuergeräte oder passende Softwarestände voraus. Deshalb wird die Machbarkeit vor der Durchführung geprüft." },
      { question: "Ist auch eine Codierung ohne Termin vor Ort möglich?", answer: "Für technisch geeignete Aufgaben ist eine Remote-Codierung möglich. Ob dein Fahrzeug dafür geeignet ist, wird anhand von Modell, Baujahr, Diagnosehardware und gewünschter Funktion geprüft." }
    ]}
  />;
}
