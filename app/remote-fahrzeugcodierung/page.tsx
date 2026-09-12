import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Remote Fahrzeugcodierung VAG",
  description: "Remote Fahrzeugcodierung für VW, Audi, Škoda, SEAT und CUPRA. Voraussetzungen prüfen, Codierungen auswählen und Termin online konfigurieren.",
  alternates: { canonical: "/remote-fahrzeugcodierung" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Deutschlandweit per Remote"
    title="Remote Fahrzeugcodierung für VW, Audi, Škoda, SEAT & CUPRA"
    intro="Viele Codierungen und Anpassungen können nach technischer Vorprüfung auch ohne Vor-Ort-Termin durchgeführt werden. Dafür brauchst du ein kompatibles Diagnoseinterface, einen Windows-PC oder Laptop, eine stabile Internetverbindung und die vereinbarte Remote-Software."
    benefits={["Deutschlandweit möglich", "Eigenes kompatibles Diagnoseinterface", "Windows-PC/Laptop und stabile Verbindung", "Vorabprüfung von Fahrzeug und Funktion"]}
    detailsTitle="Was du für die Remote-Codierung brauchst"
    details={[
      "Das Fahrzeug muss technisch für die gewünschte Änderung geeignet sein und ein kompatibles Diagnoseinterface muss vorhanden sein, zum Beispiel VCDS, VCP oder – je nach Aufgabe – eine andere abgestimmte Lösung.",
      "Vor dem Termin werden Fahrzeug, Baujahr, gewünschte Funktionen und die vorhandene Diagnosehardware abgestimmt. So lässt sich vermeiden, dass ein Termin für eine technisch nicht geeignete Kombination gebucht wird.",
      "Bei Remote-Aufträgen erfolgt die Zahlung gemäß Buchungsablauf zu 70 % vor Beginn und zu 30 % nach Durchführung der vereinbarten Codierung."
    ]}
    faq={[
      { question: "Brauche ich zwingend ein Diagnoseinterface?", answer: "Ja. Für die Remote-Durchführung muss ein passendes Interface am Fahrzeug vorhanden sein. Welches geeignet ist, hängt von Fahrzeug und Aufgabe ab." },
      { question: "Welche Software wird für den Fernzugriff verwendet?", answer: "Die Remote-Software wird vor dem Termin abgestimmt. Wichtig sind ein Windows-PC oder Laptop und eine stabile Internetverbindung." },
      { question: "Kann jede Codierung remote durchgeführt werden?", answer: "Nein. Einige Arbeiten erfordern zusätzliche Hardware, lokale Messungen, Kalibrierungen oder einen Vor-Ort-Zugriff. Deshalb wird jede Anfrage vorher technisch geprüft." }
    ]}
  />;
}
