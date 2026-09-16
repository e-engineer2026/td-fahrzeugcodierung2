export type PriorityVehicleSeo = {
  label: string;
  title: string;
  description: string;
  intro: string;
  focus: string[];
};

export const priorityVehicleSeoByPath: Record<string, PriorityVehicleSeo> = {
  "vw/golf-7-5g-codierung": {
    label: "VW Golf 7 (5G)",
    title: "VW Golf 7 (5G) Codierung Leipzig | VCDS & Diagnose | TD",
    description: "VW Golf 7 Codierung in Leipzig-Süd oder per Remote: Komfort, Licht, Assistenzsysteme und Diagnose. Funktionen und Preise fahrzeugbezogen prüfen.",
    intro: "Beim VW Golf 7 (5G) lassen sich abhängig von Baujahr, Ausstattung und Steuergeräten zahlreiche Komfort-, Licht- und Assistenzfunktionen anpassen. Vor der Durchführung prüfen wir die konkrete Fahrzeugkonfiguration und den Softwarestand.",
    focus: ["Coming Home / Leaving Home und Lichtfunktionen", "Spiegelanklappen, Spiegelabsenkung und Fensterkomfort", "Staging / Zeigertest und weitere Komfortfunktionen", "Assistenzfunktionen nur bei vorhandener kompatibler Hardware"],
  },
  "vw/golf-8-cd-codierung": {
    label: "VW Golf 8 (CD)",
    title: "VW Golf 8 (CD) Codierung Leipzig | SFD1, VAG Diagnose | TD",
    description: "VW Golf 8 Codierung in Leipzig-Süd: SFD1-relevante Anpassungen, Assistenzfunktionen, Komfort und Diagnose. Technische Machbarkeit vorab prüfen.",
    intro: "Der VW Golf 8 (CD) nutzt eine neuere VAG-Elektronikarchitektur. Deshalb werden Codierung, Anpassung, SFD-Relevanz und die verbaute Hardware vor jeder Änderung gezielt geprüft.",
    focus: ["SFD1-relevante Anpassungen, soweit technisch möglich", "Assistenzsysteme bei passender Serienhardware", "Komfort- und Anzeigeanpassungen", "Diagnose und Prüfung von Steuergeräte-Konfigurationen"],
  },
  "vw/tiguan-5n-codierung": {
    label: "VW Tiguan 5N",
    title: "VW Tiguan 5N Codierung Leipzig | VCDS Licht & Komfort | TD",
    description: "VW Tiguan 5N Codierung in Leipzig oder Remote: Lichtüberwachung, Komfortfunktionen, Diagnose und weitere Anpassungen. Voraussetzungen vorab prüfen.",
    intro: "Beim VW Tiguan 5N sind besonders Licht-, Komfort- und Diagnoseanpassungen gefragt. Welche Kanäle verfügbar sind, hängt unter anderem vom Bordnetzsteuergerät, Baujahr und der vorhandenen Ausstattung ab.",
    focus: ["LED-Umrüstungen und Lampenüberwachung technisch prüfen", "Coming Home / Leaving Home und weitere Lichtfunktionen", "Komfortfunktionen wie Spiegel und Verriegelung", "Fehlerspeicher, Diagnose und Steuergeräteprüfung"],
  },
  "vw/tiguan-ii-ad-bw-codierung": {
    label: "VW Tiguan II (AD/BW)",
    title: "VW Tiguan II Codierung Leipzig | VCDS, VCP & Diagnose | TD",
    description: "VW Tiguan II Codierung in Leipzig oder Remote: Komfort, Licht, Assistenzsysteme und Diagnose. Ausstattung und technische Voraussetzungen vorab prüfen.",
    intro: "Beim VW Tiguan II (AD/BW) hängen viele Codierungen von Modelljahr, Steuergerätegeneration und vorhandener Assistenzhardware ab. Vor Änderungen werden Ausstattung und Softwarestand deshalb gezielt geprüft.",
    focus: ["Komfort- und Verriegelungsfunktionen", "Licht- und Tagfahrlicht-Anpassungen", "Assistenzsysteme bei geeigneter Kamera- und Sensorhardware", "Diagnose und Anpassungen nach Nachrüstung"],
  },
  "vw/passat-b8-3g-codierung": {
    label: "VW Passat B8 (3G)",
    title: "VW Passat B8 (3G) Codierung Leipzig | VCDS, VCP & Diagnose | TD",
    description: "VW Passat B8 Codierung in Leipzig-Süd oder Remote: Komfort, Licht, Assistenzsysteme und Diagnose. Preise und technische Voraussetzungen direkt prüfen.",
    intro: "Der VW Passat B8 (3G) bietet je nach Ausstattung viele codierbare Komfort-, Licht- und Assistenzfunktionen. Vor Änderungen werden Steuergeräte, Softwarestand und vorhandene Sensorik geprüft.",
    focus: ["Komfort- und Verriegelungsfunktionen", "Licht- und Tagfahrlicht-Anpassungen", "Assistenzsysteme bei geeigneter Hardware", "Diagnose, Grundeinstellungen und Codierprüfung"],
  },
  "skoda/octavia-3-5e-codierung": {
    label: "Škoda Octavia 3 (5E)",
    title: "Škoda Octavia 3 (5E) Codierung Leipzig | VCDS & Diagnose | TD",
    description: "Škoda Octavia 3 Codierung in Leipzig oder Remote: Komfort, Licht, Assistenzsysteme, Diagnose und Anpassungen. Fahrzeugbezogene Prüfung vorab.",
    intro: "Beim Škoda Octavia 3 (5E) sind zahlreiche Komfort-, Licht- und Assistenzanpassungen möglich, sofern Steuergeräte und Hardware die gewünschte Funktion unterstützen. Die konkrete Ausstattung wird vorab geprüft.",
    focus: ["Spiegelabsenkung, Spiegelanklappen und Fensterkomfort", "Coming Home / Leaving Home und Lichtfunktionen", "Staging / Zeigertest und Komfortanzeigen", "VZE, Lane Assist oder FLA nur bei geeigneter Hardware"],
  },
  "skoda/octavia-3-5e-facelift-codierung": {
    label: "Škoda Octavia 3 Facelift (5E)",
    title: "Škoda Octavia 3 Facelift Codierung Leipzig | VCDS & Diagnose | TD",
    description: "Škoda Octavia 3 Facelift Codierung in Leipzig oder Remote: Komfort, Licht, Assistenzsysteme und Diagnose. Funktionen und Voraussetzungen prüfen.",
    intro: "Beim Škoda Octavia 3 Facelift (5E) unterscheiden sich je nach Modelljahr und Ausstattung einzelne Steuergeräte und Anpassungskanäle. Deshalb wird die konkrete Fahrzeugkonfiguration vor der Codierung geprüft.",
    focus: ["Komfortfunktionen und Spiegelanpassungen", "Coming Home / Leaving Home und Lichtoptionen", "Anzeige- und Staging-Anpassungen", "VZE, Lane Assist und FLA nur bei passender Hardware"],
  },
  "skoda/octavia-4-nx-codierung": {
    label: "Škoda Octavia 4 (NX)",
    title: "Škoda Octavia 4 (NX) Codierung Leipzig | SFD1 & Diagnose | TD",
    description: "Škoda Octavia 4 Codierung in Leipzig-Süd: SFD1-relevante Anpassungen, Assistenzfunktionen, Komfort und Diagnose. Machbarkeit vorab prüfen.",
    intro: "Beim Škoda Octavia 4 (NX) spielen SFD, Softwarestand und die Ausstattung der Assistenzsysteme eine wichtige Rolle. Deshalb erfolgt vor jeder Anpassung eine fahrzeugbezogene Prüfung.",
    focus: ["SFD1-relevante Anpassungen, soweit unterstützt", "Anzeige- und Komfortanpassungen", "Assistenzsysteme bei vorhandener Serienhardware", "Diagnose und Prüfung der Steuergeräte-Konfiguration"],
  },
  "skoda/karoq-nu-codierung": {
    label: "Škoda Karoq (NU)",
    title: "Škoda Karoq Codierung Leipzig | VCDS, Komfort & Diagnose | TD",
    description: "Škoda Karoq Codierung in Leipzig oder Remote: Komfort, Licht, Assistenzsysteme und Diagnose. Ausstattung und Machbarkeit fahrzeugbezogen prüfen.",
    intro: "Beim Škoda Karoq (NU) sind je nach Ausstattung zahlreiche Komfort-, Licht- und Assistenzanpassungen möglich. Kamera, Sensorik, Steuergeräte und Softwarestand werden vorab geprüft.",
    focus: ["Komfort- und Spiegelanpassungen", "Licht- und Tagfahrlicht-Funktionen", "Assistenzsysteme bei kompatibler Serienhardware", "Diagnose und Grundeinstellungen"],
  },
  "skoda/enyaq-5a-codierung": {
    label: "Škoda Enyaq (5A)",
    title: "Škoda Enyaq Codierung Leipzig | SFD, Diagnose & Anpassungen | TD",
    description: "Škoda Enyaq Codierung in Leipzig: moderne VAG-Elektronik, SFD-relevante Anpassungen, Assistenzfunktionen und Diagnose. Machbarkeit vorab prüfen.",
    intro: "Beim Škoda Enyaq (5A) sind Softwarestand, Steuergerätearchitektur und Schutzmechanismen besonders relevant. Anpassungen werden deshalb nur nach gezielter technischer Vorprüfung angeboten.",
    focus: ["SFD-relevante Anpassungen nur bei technischer Freigabe", "Anzeige- und Komfortfunktionen", "Assistenzfunktionen bei vorhandener kompatibler Hardware", "Diagnose und Steuergeräteprüfung"],
  },
  "audi/a4-s4-b9-codierung": {
    label: "Audi A4 / S4 B9",
    title: "Audi A4 B9 Codierung Leipzig | VCDS, VCP & Diagnose | TD",
    description: "Audi A4 B9 Codierung in Leipzig-Süd oder Remote: Komfort, Licht, Assistenzsysteme und Diagnose. Voraussetzungen und Preise vorab prüfen.",
    intro: "Beim Audi A4 B9 hängen viele Anpassungen von Ausstattung, MMI-Variante, Assistenzhardware und Softwarestand ab. Vor der Codierung wird deshalb die konkrete Fahrzeugkonfiguration geprüft.",
    focus: ["Komfort- und Zentralverriegelungsfunktionen", "Licht- und Anzeigeanpassungen", "Assistenzfunktionen bei kompatibler Hardware", "Diagnose und Prüfung nach Nachrüstung oder Steuergerätetausch"],
  },
  "audi/a5-s5-f5-codierung": {
    label: "Audi A5 / S5 F5",
    title: "Audi A5 F5 Codierung Leipzig | VCDS, VCP & Diagnose | TD",
    description: "Audi A5 F5 Codierung in Leipzig oder Remote: Komfort, Licht, Assistenzsysteme und Diagnose. Technische Voraussetzungen fahrzeugbezogen prüfen.",
    intro: "Beim Audi A5 F5 werden gewünschte Anpassungen anhand von Ausstattung, verbauten Steuergeräten und Softwarestand geprüft. Das gilt besonders für Assistenz-, Licht- und Infotainmentfunktionen.",
    focus: ["Komfort- und Verriegelungsanpassungen", "Licht- und Anzeigeoptionen", "Assistenzsysteme bei geeigneter Kamera- und Sensorhardware", "Diagnose und Codierprüfung nach Reparatur oder Nachrüstung"],
  },
  "audi/a3-s3-8v-codierung": {
    label: "Audi A3 / S3 8V",
    title: "Audi A3 8V Codierung Leipzig | VCDS Komfort & Diagnose | TD",
    description: "Audi A3 8V Codierung in Leipzig oder Remote: Komfort, Licht, Anzeige, Assistenzsysteme und Diagnose. Funktionen und Preise vorab prüfen.",
    intro: "Der Audi A3 8V bietet je nach Ausstattung zahlreiche Möglichkeiten für Komfort-, Licht- und Anzeigeanpassungen. Assistenzfunktionen werden nur bei passender Hardware und Steuergeräte-Konfiguration freigeschaltet.",
    focus: ["Komfortfunktionen und Zentralverriegelung", "Coming Home / Leaving Home und Lichtoptionen", "Staging / Anzeigeanpassungen", "Assistenzfunktionen nur mit kompatibler Hardware"],
  },
  "audi/a6-s6-c7-codierung": {
    label: "Audi A6 / S6 C7 (4G)",
    title: "Audi A6 C7 (4G) Codierung Leipzig | VCDS, VCP & Diagnose | TD",
    description: "Audi A6 C7 Codierung in Leipzig oder Remote: Komfort, Licht, MMI-nahe Anpassungen, Assistenzsysteme und Diagnose. Vorab technisch prüfen.",
    intro: "Beim Audi A6 C7 (4G) sind je nach Ausstattung viele Komfort-, Licht- und Assistenzanpassungen möglich. Bei MMI- und Steuergerätefunktionen werden Softwarestand und Varianten vorab besonders sorgfältig geprüft.",
    focus: ["Komfort- und Verriegelungsfunktionen", "Licht- und Anzeigeanpassungen", "Assistenzsysteme bei geeigneter Hardware", "Diagnose und Prüfung von Steuergeräte- oder MMI-Konfigurationen"],
  },
  "audi/q7-4l-codierung": {
    label: "Audi Q7 (4L)",
    title: "Audi Q7 4L Codierung Leipzig | VCDS, MMI & Diagnose | TD",
    description: "Audi Q7 4L Codierung in Leipzig oder Remote: Komfort, Licht, MMI-nahe Anpassungen und Diagnose. Steuergeräte und Ausstattung vorab prüfen.",
    intro: "Beim Audi Q7 4L unterscheiden sich Codiermöglichkeiten je nach Baujahr, MMI-Generation und verbauten Steuergeräten. Die konkrete Konfiguration wird deshalb vor jeder Anpassung geprüft.",
    focus: ["Komfort- und Zentralverriegelungsfunktionen", "Licht- und Anzeigeanpassungen", "MMI-nahe Einstellungen abhängig von der Gerätegeneration", "Diagnose und Prüfung nach Steuergerätetausch oder Reparatur"],
  },
  "audi/e-tron-ge-codierung": {
    label: "Audi e-tron (GE)",
    title: "Audi e-tron GE Codierung Leipzig | SFD, VAG Diagnose & Anpassungen | TD",
    description: "Audi e-tron GE Codierung in Leipzig: moderne Steuergeräte, SFD-relevante Anpassungen, Komfort, Assistenzsysteme und Diagnose. Vorab technisch prüfen.",
    intro: "Beim Audi e-tron (GE) sind Softwarestand, Steuergerätegeneration und Schutzmechanismen entscheidend. Deshalb werden Codierungen und Anpassungen vor der Durchführung fahrzeugbezogen geprüft.",
    focus: ["SFD- und softwarestandsabhängige Anpassungen prüfen", "Komfort- und Anzeigeoptionen", "Assistenzsysteme nur bei kompatibler Hardware", "Diagnose und Prüfung der Steuergeräte-Konfiguration"],
  },
};
