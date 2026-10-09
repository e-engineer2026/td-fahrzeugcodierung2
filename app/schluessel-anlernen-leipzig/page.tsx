import type { Metadata } from "next";
import SeoServicePage from "../components/SeoServicePage";

export const metadata: Metadata = {
  title: "Schlüssel anlernen & Wegfahrsperre Leipzig | VAG",
  description:
    "VAG-Schlüssel in Leipzig anlernen lassen: PIN/Login bei geeigneten älteren Fahrzeugen auslesen und Schlüssel anpassen. Machbarkeit und Preis vorab klären.",
  alternates: { canonical: "/schluessel-anlernen-leipzig" },
};

export default function Page() {
  return (
    <SeoServicePage
      eyebrow="Wegfahrsperre · Leipzig-Süd"
      title="VAG-Schlüssel anlernen in Leipzig"
      intro="Du hast einen Ersatzschlüssel oder einen neuen Transponderschlüssel und möchtest ihn an die Wegfahrsperre anlernen lassen? Bei geeigneten älteren VW-, Audi-, Škoda- und SEAT-Fahrzeugen prüfen wir die Wegfahrsperren-Generation und die nötigen Voraussetzungen vor dem Termin."
      benefits={[
        "Vor-Ort-Termine in Leipzig-Süd",
        "PIN/Login-Auslesen bei geeigneten Fahrzeugen",
        "Schlüssel an die Wegfahrsperre anpassen",
        "Preis und Machbarkeit vorab abstimmen",
      ]}
      models={["VW Polo 9N", "VW Golf", "VW Passat", "Audi A2 / A3", "Škoda Fabia / Octavia", "SEAT Ibiza / Leon"]}
      modelsTitle="Beispiele – Eignung hängt vom konkreten Fahrzeug ab"
      detailsTitle="PIN auslesen und Schlüssel anlernen"
      details={[
        "Bei geeigneten älteren VAG-Fahrzeugen kann zunächst der PIN/Login der Wegfahrsperre ausgelesen und anschließend ein kompatibler Transponderschlüssel angelernt werden. Die Möglichkeiten hängen von Modell, Baujahr und Wegfahrsperren-Generation ab; bei späteren oder geschützten Systemen ist das Auslesen nicht immer möglich.",
        "Als Preisbeispiel für einen VW Polo 9N: PIN/Login auslesen 20 €, Schlüssel anlernen 30 €. Wenn beides erforderlich ist, beträgt der Gesamtpreis 50 €. Für andere Fahrzeuge klären wir den Aufwand vorab anhand der Fahrzeugdaten.",
        "Bitte bring alle vorhandenen Fahrzeugschlüssel und den anzulernenden, zum Fahrzeug passenden Schlüssel mit. Je nach Wegfahrsperren-System müssen vorhandene Schlüssel beim Anlernvorgang erneut berücksichtigt werden. Die Funkfernbedienung für die Zentralverriegelung ist eine separate Funktion und nicht automatisch im Wegfahrsperren-Anlernen enthalten.",
        "Für eine Vorprüfung benötigen wir Marke, Modell, Baujahr und – wenn bekannt – die Wegfahrsperren-Generation. Eine FIN kannst du zur genaueren Zuordnung ebenfalls mitsenden. Der Termin findet nach Vereinbarung in Leipzig-Süd statt."
      ]}
      relatedLinks={[
        { href: "/steuergeraete-diagnose-leipzig", label: "Steuergeräte-Diagnose Leipzig", description: "Fehlerspeicher und elektronische Fehlerbilder an VAG-Fahrzeugen prüfen lassen." },
        { href: "/fahrzeugcodierung-leipzig", label: "Fahrzeugcodierung Leipzig", description: "Weitere Codierungen und Diagnose für VW, Audi, Škoda, SEAT und CUPRA." },
        { href: "/fahrzeuge", label: "Fahrzeuge & Preise", description: "Unterstützte Modelle und verfügbare Leistungen im Konfigurator ansehen." },
      ]}
      faq={[
        {
          question: "Kann bei jedem VAG-Fahrzeug der PIN ausgelesen werden?",
          answer: "Nein. Das hängt von Modell, Baujahr und Wegfahrsperren-Generation ab. Bei späteren oder geschützten Systemen ist das Auslesen nicht immer möglich. Die Machbarkeit wird vor dem Termin geprüft.",
        },
        {
          question: "Was kostet das Anlernen eines Schlüssels?",
          answer: "Beim VW Polo 9N kostet das PIN/Login-Auslesen 20 € und das Anlernen des Schlüssels 30 €. Für andere Fahrzeuge stimmen wir den Preis nach Prüfung der Fahrzeugdaten ab.",
        },
        {
          question: "Muss ich alle Schlüssel mitbringen?",
          answer: "Bitte bring alle vorhandenen Schlüssel mit. Abhängig vom Wegfahrsperren-System müssen sie beim Anlernvorgang erneut berücksichtigt werden.",
        },
        {
          question: "Wird dabei auch die Funkfernbedienung angelernt?",
          answer: "Das Anlernen des Transponders an die Wegfahrsperre und das Anlernen der Funkfernbedienung sind unterschiedliche Vorgänge. Bitte nenne bei der Anfrage, was genau benötigt wird.",
        },
        {
          question: "Welche Angaben braucht ihr für die Vorprüfung?",
          answer: "Marke, Modell und Baujahr helfen bei der ersten Einschätzung. Wenn bekannt, nenne außerdem die Wegfahrsperren-Generation und ob ein passender Schlüssel vorhanden ist.",
        },
      ]}
    />
  );
}
