import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "SFD Freischaltung Leipzig",
  description: "SFD1-Freischaltung für unterstützte VAG-Fahrzeuge in Leipzig als Voraussetzung für bestimmte Codierungen und Anpassungen. SFD2/UNECE ist ausgeschlossen.",
  alternates: { canonical: "/sfd-freischaltung-leipzig" },
};

export default function Page() {
  return <SeoServicePage
    eyebrow="SFD1 · VAG · Leipzig"
    title="SFD-Freischaltung in Leipzig"
    intro="Bei neueren Fahrzeugen des Volkswagen-Konzerns können bestimmte Codierungen und Anpassungen durch SFD geschützt sein. Für unterstützte Fahrzeuge kann eine SFD1-Freischaltung im Zusammenhang mit der gewünschten Arbeit durchgeführt werden. SFD2/UNECE-Funktionen werden nicht angeboten."
    benefits={["SFD1 bei unterstützten Fahrzeugen", "Vor Ort in Leipzig-Süd", "Nur im Zusammenhang mit zulässigen Diagnose- und Codierarbeiten", "SFD2 / UNECE ausgeschlossen"]}
    models={["VW Golf 8", "VW Passat B9", "VW ID.-Modelle nach Prüfung", "Audi MQB evo nach Prüfung", "Škoda Octavia IV", "Škoda Superb IV", "SEAT / CUPRA MQB evo"]}
    detailsTitle="Wann ist eine SFD-Freischaltung notwendig?"
    details={[
      "SFD schützt bei neueren VAG-Fahrzeugen bestimmte Diagnose-, Anpassungs- und Codierzugriffe. Ob eine Freischaltung erforderlich ist, hängt vom Fahrzeug, Steuergerät und gewünschten Eingriff ab.",
      "Die SFD1-Freischaltung ist kein eigenständiges Tuning, sondern kann eine technische Voraussetzung für die eigentliche Diagnose- oder Codierarbeit sein.",
      "Vor dem Termin wird geprüft, ob das Fahrzeug unter SFD1 fällt und ob die gewünschte Funktion mit der vorhandenen Hardware und Software grundsätzlich umsetzbar ist."
    ]}
    faq={[
      { question: "Was ist SFD?", answer: "SFD ist ein Schutzmechanismus bei neueren Fahrzeugen des Volkswagen-Konzerns, der bestimmte Diagnose- und Änderungszugriffe absichert." },
      { question: "Wird SFD2 oder UNECE freigeschaltet?", answer: "Nein. Angeboten wird ausschließlich SFD1 bei unterstützten Fahrzeugen und im Rahmen der jeweiligen Diagnose- oder Codierarbeit." },
      { question: "Brauche ich SFD für jede Codierung?", answer: "Nein. Ob SFD benötigt wird, hängt von Fahrzeugplattform, Steuergerät und gewünschter Funktion ab." }
    ]}
  />;
}
