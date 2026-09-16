import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Audi Codierung Leipzig | A3, A4, A5, A6, Q5 & Q7",
  description: "Audi Codierung in Leipzig für A1, A3, A4, A5, A6, A7, Q3, Q5, Q7, Q8 und TT. Diagnose, VCDS/VCP/ODIS, Komfort-, Licht- und Assistenzfunktionen.",
  alternates: { canonical: "/audi-codierung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="Audi · Leipzig"
    title="Audi Codierung in Leipzig"
    intro="Codierungen, Diagnose und Anpassungen für zahlreiche Audi-Baureihen in Leipzig – vom A3 8V und A4/A5 B9 bis A6 C7/C8, Q5, Q7 und Q8. Je nach Plattform und Steuergerät kommen VCDS, VCP oder ODIS zum Einsatz; die gewünschte Funktion wird vorab fahrzeugbezogen geprüft."
    benefits={["Audi-Baureihen von A1 bis Q8", "Vor Ort in Leipzig-Süd", "VCDS · VCP · ODIS je nach Aufgabe", "Technische Vorprüfung vor Änderungen"]}
    models={["A1 8X / GB", "A3 8P / 8V / 8Y", "A4 8K / B9", "A5 8T / F5 / FU", "A6 C6 / C7 / C8", "A7 4G / 4K", "Q3", "Q5", "Q7", "Q8", "TT"]}
    detailsTitle="Typische Audi-Codierungen und Diagnose"
    details={[
      "Bei Audi reichen die möglichen Anpassungen von Komfort- und Lichtfunktionen über Kombiinstrument und Infotainment bis zu Assistenzsystemen. Häufig angefragt werden Spiegelanklappen und Spiegelabsenkung, Coming Home/Leaving Home, Tagfahrlicht- und Heckleuchten-Anpassungen, Zeigertest/Staging sowie die Aktivierung bereits hardwareseitig vorhandener Assistenzfunktionen wie Verkehrszeichenerkennung oder Fernlichtassistent.",
      "Audi nutzt je nach Baureihe sehr unterschiedliche Plattformen und Steuergerätegenerationen. Ein A3 8V auf MQB-Basis unterscheidet sich technisch deutlich von einem A6 C7 oder A7 4G auf MLB-Basis und nochmals von neueren MLBevo-Fahrzeugen wie A6 C8, A7 4K, Q7 4M oder Q8. Deshalb wird jede Codierung passend zur konkreten Baureihe und Software geprüft.",
      "Nachrüstungen oder Steuergerätetausch können zusätzliche Arbeiten erforderlich machen, zum Beispiel Codierung, Anpassungen, Grundeinstellungen oder Parametrierung. Ob diese Schritte mit VCDS, VCP oder ODIS sinnvoll und technisch umsetzbar sind, wird vor der Durchführung eingeordnet.",
      "Bei neueren Audi-Modellen können Schutzmechanismen wie SFD einzelne Anpassungen sperren oder zusätzliche Freigaben verlangen. SFD1 wird bei geeigneten Fahrzeugen berücksichtigt; SFD2-Funktionen werden nicht angeboten. Dadurch kann schon vor dem Termin abgeschätzt werden, ob die gewünschte Änderung technisch erreichbar ist.",
      "Für unterstützte Audi-Baureihen sind viele Leistungen bereits mit Einzelpreis und technischem Hinweis in der Fahrzeugübersicht hinterlegt. Nicht gelistete Funktionen können mit Modell, Baujahr und möglichst einem aktuellen Autoscan individuell zur Vorprüfung angefragt werden."
    ]}
    relatedLinks={[
      { href: "/fahrzeuge/audi/a3-s3-8v-codierung", label: "Audi A3 / S3 8V", description: "Codierungen und Preise für die MQB-Baureihe A3 / S3 8V." },
      { href: "/fahrzeuge/audi/a4-s4-b9-codierung", label: "Audi A4 / S4 B9", description: "Verfügbare Anpassungen und technische Hinweise für A4 / S4 der B9-Plattform." },
      { href: "/fahrzeuge/audi/a5-s5-f5-codierung", label: "Audi A5 / S5 F5", description: "Typische Codierungen und Diagnose für A5 / S5 F5 auf MLBevo-Basis." },
      { href: "/fahrzeuge/audi/a6-s6-c7-codierung", label: "Audi A6 / S6 C7", description: "Komfort-, Licht-, Infotainment- und Diagnoseleistungen für A6 / S6 C7." },
      { href: "/assistenzsysteme-codieren-leipzig", label: "Audi Assistenzsysteme", description: "Möglichkeiten für VZE, Fernlichtassistent, Lane Assist und weitere unterstützte Funktionen prüfen." },
      { href: "/remote-fahrzeugcodierung", label: "Audi Remote-Codierung", description: "Geeignete Audi-Codierungen deutschlandweit per Remote anfragen." }
    ]}
    faq={[
      { question: "Welche Audi-Modelle sind abgedeckt?", answer: "Unter anderem A1, A3, A4, A5, A6, A7, TT sowie Q3, Q5, Q7 und Q8. Die genaue Baureihe und das Baujahr kannst du in der Fahrzeugübersicht auswählen." },
      { question: "Sind Codierungen bei neueren Audi-Modellen möglich?", answer: "Teilweise ja. Schutzmechanismen und Softwarestände können einzelne Änderungen begrenzen. Die Machbarkeit wird vorab geprüft; SFD1 wird bei geeigneten Anpassungen berücksichtigt, SFD2 nicht." },
      { question: "Kann ich eine konkrete Audi-Funktion anfragen, die nicht gelistet ist?", answer: "Ja. Sende Fahrzeug, Baujahr und gewünschte Funktion per WhatsApp oder Kontaktformular. Ein aktueller VCDS-Scan erleichtert bei vielen Fällen die technische Vorprüfung." },
      { question: "Werden auch Audi-Steuergeräte nach einem Tausch codiert?", answer: "Je nach Steuergerät können Codierung, Anpassung oder Grundeinstellung möglich sein. Komponenten mit zusätzlichen Schutz- oder Anlernverfahren werden separat geprüft; eine pauschale Zusage ist nicht möglich." },
      { question: "Welche Werkzeuge werden bei Audi verwendet?", answer: "Je nach Plattform und Aufgabe kommen VCDS, VCP oder ODIS zum Einsatz. Entscheidend ist, welches Verfahren für das konkrete Steuergerät vorgesehen und technisch sinnvoll ist." },
      { question: "Ist Remote-Codierung für Audi möglich?", answer: "Für geeignete Funktionen ja. Voraussetzung sind passende Diagnosehardware, stabile Verbindung und eine Änderung, die ohne Arbeiten direkt am Fahrzeug sicher durchgeführt werden kann." }
    ]}
  />;
}
