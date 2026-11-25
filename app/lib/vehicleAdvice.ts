import type { SeoServicePageProps } from "../components/SeoServicePage";

type VehicleAdvice = SeoServicePageProps & {
  slug: string;
  vehicleKeys: string[];
};

export const vehicleAdvice: VehicleAdvice[] = [
  {
    slug: "passat-b8-2023-fernlichtassistent",
    vehicleKeys: ["vw/passat-b8-3g-codierung"],
    eyebrow: "Ratgeber · VW Passat B8",
    title: "Passat B8 (2023): Lässt sich der Fernlichtassistent freischalten?",
    intro: "Bei passender Ausstattung kann Light Assist möglich sein. Beim Passat B8 mit Erstzulassung 2023 prüfen wir zuerst die genaue Baureihe, die Kamera und die Scheinwerfer. So lässt sich klären, ob eine Freischaltung infrage kommt.",
    benefits: ["Kamera und Steuergeräte prüfen", "Scheinwerfervariante bestimmen", "Light Assist und Dynamic Light Assist unterscheiden"],
    detailsTitle: "Welche Ausstattung ist entscheidend?",
    details: [
      "Light Assist schaltet abhängig von der Verkehrssituation zwischen Fernlicht und Abblendlicht um. Dynamic Light Assist kann mit dafür ausgelegten Scheinwerfern einzelne Bereiche aus dem Fernlicht ausblenden.",
      "Ein Kameragehäuse hinter dem Innenspiegel ist ein erster Hinweis. Für eine belastbare Einschätzung brauchen wir die tatsächliche Kamera- und Lichtausstattung sowie den Steuergeräte- und Softwarestand.",
      "Ist die Funktion bereits im Lichtmenü vorhanden, prüfen wir zuerst die Bedienung laut Bordbuch und mögliche Fehlereinträge. Fehlt die passende Hardware, besprechen wir, ob eine Nachrüstung infrage kommt.",
    ],
    faq: [
      { question: "Reicht die Erstzulassung 2023 für eine Einschätzung?", answer: "Für die Vorprüfung helfen uns Baureihe, Modelljahr und Ausstattung. Wenn vorhanden, schick uns zusätzlich einen Auto-Scan oder ein Foto der Systeminformationen und des Lichtmenüs." },
      { question: "Bedeutet Lane Assist, dass auch Light Assist freischaltbar ist?", answer: "Lane Assist ist ein Hinweis auf eine Frontkamera. Welche Lichtfunktion unterstützt wird, hängt zusätzlich von Kamera, Scheinwerfern und Softwarestand ab." },
    ],
    relatedLinks: [
      { href: "/fahrzeuge/vw/passat-b8-3g-codierung", label: "VW Passat B8: Codierungen und Preise" },
      { href: "/fernlichtassistent-codieren-leipzig", label: "Fernlichtassistent in Leipzig prüfen lassen" },
    ],
    whatsappMessage: "Hallo, ich möchte beim Passat B8 den Fernlichtassistenten prüfen lassen. Erstzulassung/Modelljahr: …, Scheinwerfer und vorhandene Assistenten: …",
  },
  {
    slug: "golf-6-tempomat-nachruesten",
    vehicleKeys: ["vw/golf-6-1k-codierung"],
    eyebrow: "Ratgeber · VW Golf 6",
    title: "Golf 6: Tempomat nachgerüstet – was muss geprüft werden?",
    intro: "Wenn der Tempomat nach dem Einbau ohne Funktion bleibt, lässt sich die Ursache eingrenzen. Beim Golf 6 prüfen wir, ob Bedienhebel, Lenksäulenelektronik und Verkabelung zur Fahrzeugvariante passen und ob das Motorsteuergerät die Signale erkennt.",
    benefits: ["Teilenummern abgleichen", "Signale in den Messwerten prüfen", "Codierung und Fehlerspeicher kontrollieren"],
    detailsTitle: "So grenzen wir den Fehler ein",
    details: [
      "Zuerst gleichen wir die Teilenummern von Bedienhebel und Lenksäulensteuergerät mit der Fahrzeugausstattung ab. Die nötige Verkabelung ergibt sich aus dem passenden Stromlaufplan.",
      "Danach prüfen wir den Fehlerspeicher und die Messwerte. Wir schauen, ob die Tasten des Bedienhebels sowie die Signale von Bremse und bei einem Handschalter auch von der Kupplung plausibel erkannt werden.",
      "Anschließend prüfen wir die fahrzeugspezifische Freigabe in der Lenksäulenelektronik und im Motorsteuergerät. Zur Funktionsprüfung gehört auch, dass Bremse und gegebenenfalls Kupplung die Regelung zuverlässig beenden.",
    ],
    faq: [
      { question: "Kann man einen bereits eingebauten Tempomat nachträglich prüfen lassen?", answer: "Ja. Für die Vorprüfung helfen Baujahr, Motor, Getriebe, die Teilenummern der nachgerüsteten Teile und ein vorhandener Auto-Scan." },
      { question: "Warum kann der Tempomat trotz angenommener Codierung ohne Funktion bleiben?", answer: "Mögliche Ursachen sind eine inkompatible Baugruppe, eine fehlende Leitung oder ein unplausibles Schalter- oder Pedalsignal. Die Messwerte helfen bei der Eingrenzung." },
    ],
    relatedLinks: [
      { href: "/fahrzeuge/vw/golf-6-1k-codierung", label: "VW Golf 6: Codierungen und Preise" },
      { href: "/steuergeraete-diagnose-leipzig", label: "Steuergeräte-Diagnose in Leipzig" },
    ],
    whatsappMessage: "Hallo, ich möchte meinen nachgerüsteten Golf-6-Tempomat prüfen lassen. Baujahr: …, Motor/Getriebe: …, verbaute Teile und Fehlerbild: …",
  },
  {
    slug: "octavia-5e-rueckfahrkamera-mib",
    vehicleKeys: ["skoda/octavia-3-5e-codierung", "skoda/octavia-3-5e-facelift-codierung"],
    eyebrow: "Ratgeber · Škoda Octavia 5E",
    title: "Octavia 5E: Welche Rückfahrkamera passt zu meinem MIB?",
    intro: "Die passende Kamera hängt von der Karosserie, dem Infotainment und der gewünschten Darstellung ab. Ein Foto der Systeminformationen im Infotainment hilft bei der Auswahl, besonders wenn das Radio schon einmal getauscht wurde.",
    benefits: ["Combi oder Limousine berücksichtigen", "Infotainment und Softwarestand prüfen", "Kamerabild und Einparkhilfe abstimmen"],
    detailsTitle: "Was vor dem Teilekauf geklärt sein sollte",
    details: [
      "Für Griffleiste und Einbausatz sind Combi oder Limousine und der Produktionsstand wichtig. Beim Infotainment prüfen wir Gerätenummer und Softwarestand, damit Kamera und Videoeingang zusammenpassen.",
      "Kamera-Sets unterscheiden sich bei den Hilfslinien und der gemeinsamen Anzeige mit den Parksensoren. Wenn du lenkwinkelabhängige Linien möchtest, klären wir vorab, welches System sie unterstützt und ob eine Kalibrierung erforderlich ist.",
      "Ist bereits eine Kamera eingebaut und der Bildschirm bleibt schwarz, prüfen wir je nach System zuerst Versorgung, Videoverbindung und den Signalwechsel beim Einlegen des Rückwärtsgangs. Danach prüfen wir die Konfiguration des Infotainments und der Einparkhilfe.",
    ],
    faq: [
      { question: "Reicht die Bezeichnung Bolero, Amundsen oder Columbus?", answer: "Der Gerätename ist der erste Anhaltspunkt. Für die Teileauswahl sind zusätzlich Teilenummer, Softwarestand und die tatsächlich verbaute Gerätegeneration wichtig." },
      { question: "Was soll ich für die Vorprüfung schicken?", answer: "Modelljahr, Karosserieform, ein Foto der Systeminformationen, Angaben zu vorhandenen Parksensoren und, falls vorhanden, die Teilenummer der Kamera." },
    ],
    relatedLinks: [
      { href: "/fahrzeuge/skoda/octavia-3-5e-codierung", label: "Škoda Octavia 3: Codierungen und Preise" },
      { href: "/fahrzeuge/skoda/octavia-3-5e-facelift-codierung", label: "Škoda Octavia 3 Facelift: Codierungen und Preise" },
    ],
    whatsappMessage: "Hallo, ich möchte die passende Rückfahrkamera für meinen Octavia 5E prüfen lassen. Modelljahr: …, Combi/Limousine: …, Infotainment und Parksensoren: …",
  },
];
