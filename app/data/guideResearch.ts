// Kuratierte Recherche zu fahrzeugspezifischen Nachrüstungen und Umbauten.
// Es handelt sich um Verweise auf Fremdquellen, nicht um eigene TD-PDF-Anleitungen.
// Vollständige Anleitungen Dritter dürfen nicht als eigene Download-Produkte angeboten werden.
export type ResearchCategory = "Nachrüstungen" | "Umbauten";
export type InstructionAccess = "öffentlich" | "Vorschau / Kauf" | "beim Nachrüstsatz" | "Produktinfo / Service" | "Produktinformation" | "Anbieterleistung";

export type ResearchGuide = {
  id: string;
  title: string;
  category: ResearchCategory;
  models: readonly string[];
  sourceUrl: string;
  sourceName: string;
  access: InstructionAccess;
  note: string;
  topic?: "Scheinwerfer & Licht" | "ACC & pACC" | "Lenkrad & Bedienung" | "Cockpit & Infotainment";
};

const golf7 = ["Golf 7 (5G)"];
const octavia5e = ["Octavia 3 5E", "Octavia 3 5E Facelift"];
const leonKL = ["SEAT Leon KL", "CUPRA Leon KL"];

export const researchedGuides: readonly ResearchGuide[] = [
  // Nachrüstungen
  // Škoda: neuer Rechercheblock nach Audi; PR-/Anleitungshinweise je Modell.
  {
    "id": "skoda-fabia-nj-gra",
    "title": "Škoda Fabia 3 NJ: Tempomat GRA nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Fabia 3 NJ"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-skoda-fabia-nj/49940-2",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Verschiedene Setvarianten mit Lenkstockhebel, Freischaltung und Diagnose; vor/nach Modelljahrwechsel prüfen"
  },
  {
    "id": "skoda-scala-nw-gra",
    "title": "Škoda Scala NW: Tempomat GRA mit Freischaltung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Scala NW"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-skoda-scala-nw1/49975",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur ohne Kessy PR 4I2/4K3, mit/ohne MuFu-Lenkrad; SFD2-Ausstattung und Codierdongle prüfen"
  },
  {
    "id": "skoda-octavia5e-gra",
    "title": "Škoda Octavia 5E: Tempomat GRA mit Bedieneinheit nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-skoda-octavia-5e/49990",
    "sourceName": "KUFATEC",
    "access": "Produktinfo / Service",
    "note": "Komplettset mit Lenkstockhebel und Freischaltung; die ausgewählte Produktseite weist derzeit keine frei abrufbare Anleitung aus"
  },
  {
    "id": "skoda-kodiaqns-blindspot",
    "title": "Škoda Kodiaq NS: Blind Spot und Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Kodiaq NS"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-blind-spot-sensor-inkl.-ausparkassistent-fuer-skoda-kodiaq-ns7/41950-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Ausführungen bis 2021/ab 2022, PR KA0/KA2/KA6 und LHD/RHD; Radar, Spiegelwarnleuchten und Codierung"
  },
  {
    "id": "skoda-karoqnu-sideassist",
    "title": "Škoda Karoq NU: Blind Spot/Side Assist mit Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Karoq NU"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-skoda-karoq-nu7/43490-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Umfeldkamera PR KA6 oder KA0/KA1/KA2 und vorhandene PDC für Ausparkassistent; SFD2-Variante prüfen"
  },
  {
    "id": "skoda-karoq-kodiaq-ahk",
    "title": "Škoda Karoq/Kodiaq: schwenkbare AHK mit Original-Kabelsatz nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Karoq NU",
      "Kodiaq NS"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-anhaengerkupplung-zentralelektrik-fuer-skoda-karoq-nu-kodiaq-ns/44655",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur fahrzeugspezifischer Kabelsatz; AHK, Steuergerät, Taster und Stoßfängerkabel separat, Codierdongle nötig"
  },
  {
    "id": "skoda-superb3v-ahk",
    "title": "Škoda Superb 3V: schwenkbare Original-AHK mit Kabelsatz nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Superb 3V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-schwenkbare-anhaengerkupplung-ahk-zentralelektrik-fuer-skoda-superb-3v/45975",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Kabelsatz allein, passende AHK, Steuergerät und Taster sowie Diagnosecodierung erforderlich"
  },
  // Audi: Nachrüstungen separat nach VW recherchiert; Typen und PR-Nummern beachten.
  {
    "id": "audi-a1-8x-gra",
    "title": "Audi A1 8X: Geschwindigkeitsregelanlage GRA nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A1 8X"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-audi-a1-8x/40205-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Lenksäulenelektronik prüfen (5K0 953 569 F ungeeignet), für Fahrzeuge ohne Keyless; Diagnoseaktivierung nötig"
  },
  {
    "id": "audi-a1-gb-gra",
    "title": "Audi A1 GB: Tempomat GRA mit Lenkstockhebel nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A1 GB"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-audi-a1-gb/44575-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur für Fahrzeuge mit Speedlimiter PR 8T9; Versionen vor/nach 21.03.2024 und SFD-Einschränkungen prüfen"
  },
  {
    "id": "audi-a3-8v-gra",
    "title": "Audi A3 8V: Tempomat GRA mit Lenkstockschalter nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A3 / S3 8V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-audi-a3-8v/39710",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Lenkstockhebel, Abdeckung und Freischaltung; nicht geeignet für Motor DGEA"
  },
  {
    "id": "audi-a4-8k-gra",
    "title": "Audi A4 8K: Tempomat GRA nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 8K"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-audi-a4-8k/35720",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Kabel und Lenkstockhebel mit/ohne Multifunktionslenkrad; Lenksäulensteuergerät und Freischaltung vorab prüfen"
  },
  {
    "id": "audi-a5f5-sideassist",
    "title": "Audi A5 F5: Side Assist/Blind Spot mit Spiegelwarnanzeigen nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A5 / S5 F5"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-audi-side-assist-fuer-audi-a5-f5/41690",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Highline-Türsteuergeräte nach Teilenummer prüfen, ggf. Austausch; ab Modelljahr 2024 laut Anbieter nicht möglich"
  },
  {
    "id": "audi-q3f3-sideassist",
    "title": "Audi Q3 F3: Side Assist/Blind Spot nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Q3 F3"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-side-assist-fuer-audi-q3-f3/43255",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "SUV-/Sportback- und LHD-/RHD-Versionen; Spiegelkappen und Radarsensoren, ggf. SFD2-Freigabe"
  },
  {
    "id": "audi-q3f3-rvc",
    "title": "Audi Q3 F3: Original-Rückfahrkamera mit Hilfslinien nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Q3 F3"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-aps-advance-rueckfahrkamera-fuer-audi-q3-f3/43260",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Baujahr bis 2020 oder ab 2021 und PR-Codes I8W/7UF/7UG unterscheiden; SFD2-Fahrzeuge gesondert"
  },
  {
    "id": "audi-q5fy-ahk",
    "title": "Audi Q5 FY: schwenkbare Original-AHK nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Q5 FY"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-anhaengerkupplung-ahk-fuer-audi-q5-fy/43570-2",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Variante mit/ohne AHK-Vorbereitung PR 1D0/1D8, Luft-/Stahlfederung; über 750 kg ggf. Kühlerlüfter ändern; ab MJ 2024 Anbieter-Einschränkung"
  },
  {
    "id": "audi-q7-4m-ahk",
    "title": "Audi Q7 4M: schwenkbare Original-AHK nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Q7 4M"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-anhaengerkupplung-ahk-fuer-audi-q7-4m/46999",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nicht für US-Importe; Modelljahre vor/ab 2020; laut Anbieter nicht bei Produktion ab 14.08.2023; zulässige Anhängelast und Kühlerlüfter beachten"
  },
  // Volkswagen: Tempomat, Side Assist, AHK; Anleitungszugang erst beim Anbieter prüfen.
  {
    "id": "vw-polo6r-gra-ohne-mfa",
    "title": "VW Polo 6R: Tempomat GRA ohne Multifunktionsanzeige nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Polo 6R"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-anlage-fuer-vw-polo-6r-ohne-mfa/37922-2",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Lenkstockhebel und Verkabelung; Motorsteuergerät freischalten, lange Codierung gesondert prüfen"
  },
  {
    "id": "vw-polo6r-gra-mit-mfa",
    "title": "VW Polo 6R: Tempomat GRA mit Multifunktionsanzeige nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Polo 6R"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-anlage-fuer-vw-polo-6r-mit-mfa/37922-3",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Unterschiedliche Ausführung bis/ab Modelljahr 2013; Lenkstockhebel, Motorsteuergerät-Freischaltung und lange Codierung prüfen"
  },
  {
    "id": "vw-troc-gra-kit",
    "title": "VW T-Roc A11: Tempomat GRA inklusive Lenkradtasten nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "T-Roc A11"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-vw-t-roc-a11-d11-ac7-ac8/43825",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Modell- und PR-abhängige Varianten mit/ohne MuFu; Lenkstock, Bedieneinheit, SVM/Freischaltung und Modelljahr prüfen"
  },
  {
    "id": "vw-touran5t-gra-bis18",
    "title": "VW Touran 5T bis Modelljahr 2018: Tempomat GRA nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Touran 5T"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-vw-touran-5t-bis-2018/44240-2",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Varianten je MuFu, Speedlimiter und Lenkrad-PR; nicht mit Ausführung ab MJ 2019 verwechseln"
  },
  {
    "id": "vw-touran5t-gra-ab19",
    "title": "VW Touran 5T ab Modelljahr 2019: Tempomat GRA nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Touran 5T"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-gra-tempomat-komplettset-fuer-vw-touran-5t-ab-2019/44377-4",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Varianten nach PR für Multifunktionslenkrad, Speedlimiter und Kessy; mögliche Freischaltung beachten"
  },
  {
    "id": "vw-troc-sideassist-kit",
    "title": "VW T-Roc A11: Side Assist mit Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "T-Roc A11"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-vw-t-roc-a11-d11/42660-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Zwei Radarsensoren hinten, Spiegelwarnanzeigen und Kabelsatz; Varianten A11 bis 2021 und D11 ab 2022 sowie SFD prüfen"
  },
  {
    "id": "vw-touran5t-sideassist-kit",
    "title": "VW Touran 5T: Blind Spot/Side Assist mit Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Touran 5T"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-vw-touran-5t/41695",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Komplettset mit Radarsensoren und Spiegelwarnanzeigen; Links-/Rechtslenker und Modelljahre bis 2019/ab 2020 trennen"
  },
  {
    "id": "vw-arteon3h-sideassist-kit",
    "title": "VW Arteon 3H: Blind Spot/Side Assist und Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Arteon 3H"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-vw-arteon-3h/41722",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Unterschiedliche Ausführungen bis 2019/ab 2020; hintere Radarsensoren und Spiegelwarnanzeige, Codierung und Komponentenprüfung"
  },
  {
    "id": "vw-golf8-schwenk-ahk",
    "title": "VW Golf 8: originale schwenkbare Anhängerkupplung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Golf 8 (CD)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-anhaengerkupplung-ahk-fuer-vw-golf-8-cd/47110",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Komplettset für Limousine/Variant, nicht für Golf R Motor PR DR5; ggf. Kühlerlüftertausch und SFD2-Prüfung"
  },
  {
    "id": "vw-tiguan-touran-ahk-cable",
    "title": "VW Tiguan II/Touran 5T: schwenkbare AHK mit fahrzeugspezifischem Kabelsatz nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Tiguan II (AD/BW)",
      "Touran 5T"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-anhaengerkupplung-zentralelektrik-touran-5t-tiguan-ad1-bw2/41490",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur Kabelsatz der Zentralelektrik; Kupplung, Steuergerät, Taster und Stoßfängerkabel separat, abschließende Codierung erforderlich"
  },
  {
    "id": "vw-passat-arteon-troc-ahk-cable",
    "title": "VW Passat B8/Arteon/T-Roc: originale AHK mit Kabelsatz nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Passat B8 (3G)",
      "Arteon 3H",
      "T-Roc A11"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-schwenkbare-anhaengerkupplung-zentralelektrik-fuer-vw-passat-arteon-t-roc/40950",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Kabelsatz allein kein Komplettset; Passat/Arteon schwenkbar, T-Roc abnehmbar; AHK, Steuergerät, Taster und Codierung zusätzlich nötig"
  },
  // Neue, quellenbasierte Recherche vom 16.11.2026. Fremde Einbauunterlagen nicht als eigene PDFs anbieten.
  {
    "id": "passat8-sideassist",
    "title": "Side Assist mit Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-vw-passat-b8/41150-2",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Radarsensoren, Spiegelwarnanzeigen und Dongle; Varianten bis MJ 2019 bzw. ab 2020 und je Lenkradposition"
  },
  {
    "id": "passat8-kessy-komplett",
    "title": "Kessy/Keyless Access mit Türgriff-Sensoren nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komfortschluessel-kessy-fuer-vw-passat-b8/44528",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur Fahrzeuge mit PR 4I6 oder 4I7; Baujahr und mögliche Online-Inbetriebnahme anhand FIN prüfen"
  },
  {
    "id": "passat8-rdk-high",
    "title": "Direkte Reifendruckkontrolle (RDK High) mit vier Radsensoren nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-reifendruck-kontrollsystem-rdk-fuer-vw-passat-b8/48285",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Steuergerät, Kabelsatz und vier Ventilsensoren; Sensormontage beim Reifendienst, Codierdongle"
  },
  {
    "id": "passat8-easyopen",
    "title": "Fußgeste Easy Open für elektrische Heckklappe nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-sensorgesteuerte-heckklappenoeffnung-fuer-vw-passat-b8/42680",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur bei elektrischer Heckklappe PR 4E7 und Komfortschlüssel PR 4F2 oder 4I3"
  },
  {
    "id": "tiguan2-sideassist",
    "title": "Side Assist inklusive Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Tiguan II (AD/BW)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-vw-tiguan-ad1/41395",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Seitliche Radarsensoren und Warnanzeigen in Spiegeln; Varianten bis MJ 2019 und ab MJ 2020"
  },
  {
    "id": "tiguan2-elektroheckklappe",
    "title": "Elektrische Heckklappe mit Motorantrieben und Einklemmschutz nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Tiguan II (AD/BW)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-nachruest-set-elektrische-heckklappe-fuer-vw-tiguan-ad1-ax1/41319",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Komplettset mit Dämpfern/Motoren, Zuziehilfe, Schaltern und Steuergerät; bis MJ 2020 / ab MJ 2021 unterschiedlich"
  },
  {
    "id": "tiguan2-areaview",
    "title": "360°-Umgebungsansicht Area View nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Tiguan II (AD/BW)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-umgebungsansicht-area-view-fuer-vw-tiguan-ad1-ax1/41480",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Vier Kameras, Steuergerät und Infotainmentanbindung; verschiedene Stoßfänger-/PR-Versionen; ab MJ 2021 aktuell eingeschränkt"
  },
  {
    "id": "tiguan2-anklappspiegel",
    "title": "Elektrisch anklappbare Spiegel inklusive Umfeldbeleuchtung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Tiguan II (AD/BW)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-anklappbare-aussenspiegel-fuer-vw-tiguan-ad1-ax1/41770",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur LHD mit PR 6XN ohne Area View; Highline-Türsteuergeräte erforderlich, sonst Steuergerätewechsel"
  },
  {
    "id": "tiguan2-front-heckkamera",
    "title": "Original-Frontkamera und Rückfahrkamera gemeinsam nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Tiguan II (AD/BW)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-front-und-rueckfahrkamera-fuer-vw-tiguan-ad1/42095-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "2-Kamera-System mit Codierdongle; Navi-PR 7UF/7UG und Stoßfängerversion prüfen"
  },
  {
    "id": "a4-8w-sideassist",
    "title": "Audi Side Assist mit Querverkehrwarnung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-side-assist-fuer-audi-a4-8w/40779-m",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Highline-Türsteuergeräte erforderlich; Komponentenschutz der Radarsensorsteuergeräte muss autorisiert aufgehoben werden"
  },
  {
    "id": "a4-8w-phonebox",
    "title": "Audi Phone Box mit induktivem Laden (Qi) nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-phone-box-fuer-audi-a4-8w-a5-f5/42860-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur bei passender Handyvorbereitung PR 9ZX, verschiedene Ausführungen bis 2019 / Facelift ab 2020"
  },
  {
    "id": "a4-8w-memory-sitz",
    "title": "Memoryfunktion für elektrisch verstellbaren Fahrersitz nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-memory-fahrersitz-fuer-audi-a4-8w/43455",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Elektrischer Fahrersitz PR 3L5 oder 3PB erforderlich; Sitzmemory-Tasten und Steuergerät"
  },
  {
    "id": "a4-8w-parklenkassist",
    "title": "Parklenkassistent PLA / Park Assist nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-parklenkassistent-pla-fuer-audi-a4-8w/43220",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Sensorpaket je vorhandener Einparkhilfe; bei PR 7X0 BCM prüfen; laut Anbieter ab MJ 2024 derzeit nicht möglich"
  },
  {
    "id": "a4-8w-autohold",
    "title": "Auto Hold mit Originalschalter und Codierdongle nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9",
      "A5 / S5 F5"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-auto-hold-berganfahrassistent-fuer-audi-a4-8w-a5-f5/42105",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Schalt- oder Automatikgetriebe und Links-/Rechtslenker bei der Variantenwahl berücksichtigen"
  },
  {
    "id": "a4-8w-usb-fond",
    "title": "USB-Ladehub in der hinteren Mittelkonsole nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-usb-hub-fuer-audi-a4-8w/43399",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Originaler Ladehub und Leitungssatz; funktioniert bei eingeschalteter Zündung; keine Codierung erforderlich"
  },
  {
    "id": "a4-8w-homelink",
    "title": "HomeLink-Garagentoröffnung mit Bedienfeld nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-homelink-garagentoroeffnung-fuer-audi-a4-8w/43335-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Varianten bis MJ 2019 und ab MJ 2020; Kompatibilität zum Garagentor-Sender vorab klären"
  },
  {
    "id": "a4-8w-rdk-high",
    "title": "Direkte Reifendruckanzeige mit Druck und Temperatur im MMI nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9",
      "A5 / S5 F5"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-reifendruck-kontrollsystem-rdk-fuer-audi-a4-8w-a5-f5/43730",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Zusätzliche vier Radsensoren und Empfängersteuerteil; Sensoren müssen in die Felgen montiert werden"
  },
  {
    "id": "a4-8w-schwenk-ahk",
    "title": "Original schwenkbare Anhängerkupplung inklusive Steuergerät nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-anhaengerkupplung-ahk-fuer-audi-a4-8w/46990",
    "sourceName": "KUFATEC",
    "access": "Produktinfo / Service",
    "note": "Nur für zulässige Anhängelast laut Fahrzeugpapieren; laut Produkt nicht für US-Fahrzeuge/RS4; ggf. Kühlerlüfteranpassung, Angebot anfordern"
  },
  {
    "id": "a3-8v-sideassist",
    "title": "Audi Side Assist als Original-Radarsystem nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A3 / S3 8V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-audi-side-assist-fuer-audi-a3-8v/41120-9",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Radarsensoren hinten, Spiegelwarnanzeigen und Codierung; Ausführung nach Karosserie/Modelljahr"
  },
  {
    "id": "octavia5e-blindspot",
    "title": "Blind Spot und Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-skoda-octavia-5e/43055-m",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "ABS 3Q0 oder kompatible 5Q0-Ausführung ab MJ 2016 prüfen; Ausparkassistent braucht PDC"
  },
  {
    "id": "superb3v-heckkamera",
    "title": "Original-Rückfahrkamera in der Heckklappengriffleiste nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Superb 3V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-skoda-superb-3v/41559",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "MIB2/MIB3-Navi-PR notwendig, Kameraausführung vor/nach 02.04.2018 unterscheiden"
  },
  {
    "id": "superb3v-sideassist",
    "title": "Spurwechsel- und Ausparkassistent inklusive Warnanzeigen nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Superb 3V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-skoda-superb-3v/43065",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Limousine/Combi und Modelljahr bis 2019 / ab 2020 unterscheiden; Radar- und Türsteuergeräte prüfen"
  },
  {
    "id": "superb3v-standheizung",
    "title": "Standheizung mit Steuerung über Radio oder Fernbedienung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Superb 3V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-standheizung-fuer-skoda-superb-3v/50900",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nicht für Hybrid PR 0K3; Klimabedienteil separat erforderlich; Einbau nur fachgerecht"
  },
  {
    "id": "superb3v-rdk-high",
    "title": "Reifendruckkontrolle High mit vier Drucksensoren nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Superb 3V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-reifendruck-kontrollsystem-rdk-fuer-skoda-superb-3v/48565",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Feldruckanzeige je Rad; Highline-CAN-Gateway ggf. nötig, Sensoren vom Reifendienst montieren lassen"
  },
  {
    "id": "kodiaqns-heckkamera",
    "title": "Original-Rückfahrkamera mit dynamischen Hilfslinien nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Kodiaq NS"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-skoda-kodiaq-ns7/41940",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Kompatible Navigationsgeräte PR 7UF/7UG/7UT/7UH bzw. Radio I8F+QV3 notwendig"
  },
  {
    "id": "kodiaqns-front-heckkamera",
    "title": "Kodiaq NS: Front- und Heckkamera mit zwei Ansichten nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Kodiaq NS"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-front-und-rueckfahrkamera-fuer-skoda-kodiaq-ns7/47175",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Zwei Kameras mit Steuergerät und Codierdongle; Navi und Einparkhilfe-PR-Codes prüfen"
  },
  {
    "id": "octavianx-rfk-dynamisch",
    "title": "Original-Rückfahrkamera mit dynamischen Linien nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 4 NX"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-skoda-octavia-nx/45278",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Infotainment PR 8AR/8DG/I8U oder I8Q unterscheidet Kamera; SFD-Schutz und berechtigte Inbetriebnahme prüfen"
  },
  {
    "id": "octavianx-front-heckkamera",
    "title": "Front- und Heckkamera mit dynamischen Hilfslinien nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 4 NX"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-front-und-rueckfahrkamera-fuer-skoda-octavia-nx/47294",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Zwei Kameras und Steuergerät; SFD1/SFD2, Lizenz und PR-Codes vor Bestellung prüfen"
  },
  {
    "id": "octavianx-230v-steckdose",
    "title": "230-V-Steckdose im Fond samt Wechselrichter nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 4 NX"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-230-volt-steckdose-fuer-skoda-octavia-nx/48115",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "150-W-Wechselrichter, Anschlussset und Codierung; GeKo/SFD-Status klären, 230-V-Arbeiten nur fachgerecht"
  },
  {
    "id": "golf8-rueckfahrkamera",
    "title": "Original-Rückfahrkamera im VW Golf 8 nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Golf 8 (CD)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-vw-golf-8-cd-viii/45105",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Golf-8-Varianten I8Q/8AR, Limousine/Variant und SFD-Generation unterscheiden; dynamische Hilfslinien"
  },
  {
    "id": "tarraco-kn2-rfk",
    "title": "Original-Rückfahrkamera in Griffleiste nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "SEAT Tarraco KN2"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-seat-tarraco-kn2/43900",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Originalkamera mit dynamischen Hilfslinien; Wischwasseranschluss benötigt zusätzliche Teile; Codierdongle"
  },
  {
    "id": "ateca-kh-frontrear",
    "title": "Ateca KH: Original-Front- und Heckkamera nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "SEAT Ateca KH7"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-front-und-rueckfahrkamera-fuer-seat-ateca-kh/47180-3",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Stoßfänger-/Modelljahrvariante und Navi-PR 7UF/7UG beachten; PDC-Taster ggf. ersetzen"
  },
  {
    "id": "leonkl-blindspot",
    "title": "Blind Spot / Side Assist mit Ausparkassistent nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "SEAT Leon KL"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-spurwechselassistent-inkl.-ausparkassistent-fuer-seat-leon-kl/45285-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Lichtleiter in Türverkleidung nicht enthalten, GeKo/SFD-Freigabe und kompatibles Modelljahr vorab prüfen"
  },
  // Rechercheerweiterung vom 16.11.2026: nur Themen mit belegtem Anleitungsbezug.
  {
    "id": "golf7-rfk-high-kufatec",
    "title": "Original-Rückfahrkamera im VW-Emblem nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-vw-golf-7-vii/39634-4",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Einbauanleitungs-Vorschau, Vollversion nach Kauf; kompatibles Navigations-/Radiosystem und passende Kameraausführung erforderlich"
  },
  {
    "id": "golf7-led-fussraum-vorn",
    "title": "Originale LED-Fußraumbeleuchtung vorne nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/VOLKSWAGEN/Golf/Golf-7-5G/Design---Optik-Golf-7-VII/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Kabelsatz und Einbauanleitung gehören zum Nachrüstpaket; Lichtregelung und Codierung nach Ausstattung"
  },
  {
    "id": "golf7-led-fussraum-hinten",
    "title": "LED-Fußraumbeleuchtung im Fond nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/VOLKSWAGEN/Golf/Golf-7-5G/Komfort---Nuetzliches-Golf-7-VII/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Nur bei bereits vorhandener vorderer Fußraumbeleuchtung; laut Anbieter keine zusätzliche Codierung"
  },
  {
    "id": "golf7-licht-regensensor",
    "title": "Licht-/Regensensor mit AUTO-Licht nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/VOLKSWAGEN/Golf/Golf-7-5G/VW-Golf-7-5G-Licht--Regensensor-Coming-Home-Leaving-Home-auto--Licht.html?combi_id=8688",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Einbauanleitung im Satz; je nach Frontscheibe, Innenspiegel und Klimaanlage zusätzlicher Umbau erforderlich"
  },
  {
    "id": "passat-b8-rueckfahrkamera",
    "title": "VW-Emblem-Rückfahrkamera mit dynamischen Hilfslinien nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-vw-passat-b8/40775-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Einbauvorschau öffentlich, vollständige Anleitung nach Kauf; Limousine/Variant und Infotainment-PR-Code beachten"
  },
  {
    "id": "a4-8w-ambient-mittelkonsole",
    "title": "Weiße Ambientebeleuchtung in der Mittelkonsole nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/AUDI/A4/A4-8W-B9/AUDI-A4-B9-8W-Ambientebeleuchtung-LED-Mittelkonsole.html",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Vordere LED-Fußraumbeleuchtung vorausgesetzt; Anleitung enthält auch Freischaltung per VCDS oder ODIS"
  },
  {
    "id": "a4-8w-ambient-tueren",
    "title": "Weiße LED-Ambientebeleuchtung in den Türen nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/AUDI/A4/A4-8W-B9/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Türlichtleiter mit bebilderter Einbauanleitung; vorhandenes Lichtpaket und mögliche UNECE-/PR-Ausschlüsse prüfen"
  },
  {
    "id": "a4-8w-tuerwarnleuchten",
    "title": "Türwarn- und Türausstiegsbeleuchtung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/AUDI/A4/A4-8W-B9/AUDI-A4-B9-8W-Tuerbeleuchtung-Ausstiegsbeleuchtung.html",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Originalleuchten, Kabelsatz und Einbauanleitung; laut Anbieter keine Codierung erforderlich"
  },
  {
    "id": "a4-8w-qq2-ambient-rgb",
    "title": "Mehrfarbige Kontur-Ambientebeleuchtung (QQ2) nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://www.motor-talk.de/forum/ambientebeleuchtung-nachruesten-t6408850.html?page=11",
    "sourceName": "Motor-Talk / Praxisthread",
    "access": "öffentlich",
    "note": "Praxisbericht mit QQ2-Codierung und VCP-Parametrierung; keine geprüfte Komplettanleitung, Datensätze und Steuergeräte müssen zum Fahrzeug passen"
  },
  {
    "id": "a3-8v-rueckfahrkamera",
    "title": "Original-Rückfahrkamera nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "A3 / S3 8V"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/AUDI/A3/A3-8V/Einparkhilfe-Rueckfahrkamera-A3-8V/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Einbauanleitung beim Kit; Ausführung nach Baujahr, Karosserie und MMI auswählen"
  },
  {
    "id": "octavia5e-led-fussraum-vorn",
    "title": "LED-Fußraumbeleuchtung vorne nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/SKODA/Octavia/Octavia-5E/SKODA-Octavia-5E-LED-Fussraumbeleuchtung-vorne.html",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Originalleuchten, Kabelsatz und deutschsprachige Einbauanleitung im Set; Baujahre Vor-Facelift und Facelift"
  },
  {
    "id": "octavia5e-led-kennzeichen",
    "title": "Originale LED-Kennzeichenbeleuchtung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/SKODA/Octavia/Octavia-5E/Skoda-Octavia-5E-LED-Kennzeichenbeleuchtung.html",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Einbauanleitung inklusive anschließender Codierung mit VCDS; zugelassene Originalteile verwenden"
  },
  {
    "id": "octavia5e-licht-regensensor",
    "title": "Licht-/Regensensor und AUTO-Licht nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/SKODA/Octavia/Octavia-5E/Assistenzsysteme-Octavia-5E/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Einbau- und VCDS-/VCP-Codierhinweise im Satz; bei bestimmten Spiegel-/Klimavarianten ist ein Scheibentausch nötig"
  },
  {
    "id": "octavia5e-spiegel-anklappbar",
    "title": "Elektrisch anklappbare Außenspiegel nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/SKODA/Octavia/Octavia-5E/SKODA-Octavia-5E-elektrisch-anklappbare-Aussenspiegel.html",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Anleitungsvorschau am Produkt; Highline-Türsteuergeräte prüfen, Lowline-Varianten benötigen Austausch"
  },
  {
    "id": "octavia5e-parklenkassistent-pla",
    "title": "Parklenkassistent PLA mit OPS nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-parklenkassistent-pla-fuer-skoda-octavia-5e/43377-2",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Anleitungsvorschau öffentlich, Vollversion nur mit Produktkauf; Ausstattung und Baujahr beeinflussen Teile und Codierung"
  },
  {
    "id": "leon5f-rueckfahrkamera",
    "title": "Originale Rückfahrkamera mit MIB-Anzeige nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "SEAT Leon 5F"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/SEAT/Leon/Leon-5F/SEAT-Leon-5F-Rueckfahrkamera.html",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Deutschsprachige Einbauanleitung im Satz; PR 7X1/7X2 und kompatibles MIB vorausgesetzt, sonst PDC-Nachrüstung nötig"
  },
  {
    "id": "leon5f-pdc-front-heck",
    "title": "Einparkhilfe vorne und hinten mit OPS nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "SEAT Leon 5F"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/SEAT/Leon/Leon-5F/SEAT-Leon-5F-Rueckfahrkamera.html",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Einbauschritte im angebotenen Komplettset; Stoßfängerarbeiten und passende Sensorhalter berücksichtigen"
  },
  {
    "id": "formentor-km-rueckfahrkamera",
    "title": "Original-Rückfahrkamera mit dynamischen Hilfslinien und Reinigung nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "CUPRA Formentor KM"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/CUPRA/CUPRA-Formentor/CUPRA-Formentor-KM/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Einbauanleitung im Set; PR 7X1/7X2/7X5, Infotainmentversion und Baujahr-/UNECE-Ausschlüsse prüfen"
  },
  {
    "id": "formentor-km-kamera-reinigung",
    "title": "Reinigungsdüse für vorhandene Rückfahrkamera nachrüsten",
    "category": "Nachrüstungen",
    "models": [
      "CUPRA Formentor KM"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/CUPRA/CUPRA-Formentor/CUPRA-Formentor-KM/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Einbauanleitung inklusive; nur mit originaler Rück-/Umfeldkamera (PR KA2 oder KA6), laut Anbieter keine Codierung"
  },
  {
    id: "golf7-multifunktionstasten",
    title: "Multifunktionslenkrad (MuFu): Tasten, Verkabelung und Freischaltung umbauen",
    category: "Umbauten",
    models: golf7,
    sourceUrl: "https://www.k-electronic-shop.de/VOLKSWAGEN/Golf/Golf-7-5G/VW-Golf-7-5G-Multifunktionlenkrad--Lenkradtasten.html",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Originaltasten und Airbagleitungssatz; Airbag-Arbeiten nur fachgerecht durchführen",
  },
  {
    id: "golf7-tempomat",
    title: "Tempomat (GRA) nachrüsten",
    category: "Nachrüstungen",
    models: golf7,
    sourceUrl: "https://www.k-electronic-shop.de/VOLKSWAGEN/Golf/Golf-7-5G/VW-Golf-7-5G-FACELIFT--Tempomat-Geschwindigkeitsregelanlage.html",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Teileauswahl nach Lenkrad/Variante; SVM-Freigabe kann nötig sein",
  },
  {
    id: "golf7-ahk",
    title: "Anhängerkupplung (AHK) nachrüsten",
    category: "Nachrüstungen",
    models: golf7,
    sourceUrl: "https://www.k-electronic-shop.de/VOLKSWAGEN/Golf/Golf-7-5G/Anhaengerkupplung-nachruesten-einbauen-freischalten-codieren-Golf-7/",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Ausführung und Kabelsatz abhängig von Karosserie und Ausstattung; Codierung erforderlich",
  },
  {
    id: "a4-8w-rueckfahrkamera",
    title: "Original-Rückfahrkamera mit dynamischen Hilfslinien nachrüsten",
    category: "Nachrüstungen",
    models: ["A4 / S4 B9"],
    sourceUrl: "https://kufatec.com/de/kufatec-aps-advance-rueckfahrkamera-fuer-audi-a4-8w/41295",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Unterschiedliche Versionen bis Modelljahr 2019 und ab Modelljahr 2020; MMI-Voraussetzungen prüfen",
  },
  {
    id: "a5-q5-rueckfahrkamera",
    title: "Original-Rückfahrkamera samt Kabelsatz nachrüsten",
    category: "Nachrüstungen",
    models: ["A5 / S5 F5", "Q5 FY"],
    sourceUrl: "https://kufatec.com/de/kufatec-kabelsatz-aps-advance-rueckfahrkamera-fuer-audi-a4-8w-a5-f5-q5-fy/41279-1",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Kabelsatz allein genügt nicht: Kamera/Steuergerät und unterstütztes Navigationssystem erforderlich",
  },
  {
    id: "octavia5e-rueckfahrkamera",
    title: "Rückfahrkamera nachrüsten",
    category: "Nachrüstungen",
    models: octavia5e,
    sourceUrl: "https://kufatec.com/de/kufatec-komplettset-rueckfahrkamera-fuer-skoda-octavia-5e/39700",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Für Octavia 5E ab Modelljahr 2015 mit Navigation; Griffleistenmaß beachten",
  },
  {
    id: "octavia5e-elektrische-heckklappe",
    title: "Elektrische Heckklappe nachrüsten (Kombi)",
    category: "Nachrüstungen",
    models: octavia5e,
    sourceUrl: "https://kufatec.com/de/kufatec-nachruest-set-elektrische-heckklappe-fuer-skoda-octavia-5e-kombi/41706",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Nur Kombi; inklusive Antrieben, Verkabelung und Schaltern",
  },
  {
    id: "leonkl-rueckfahrkamera",
    title: "Original-Rückfahrkamera nachrüsten",
    category: "Nachrüstungen",
    models: leonKL,
    sourceUrl: "https://www.k-electronic-shop.de/CUPRA/CUPRA-Leon/CUPRA-Leon-KL/Einparkhilfe-Rueckfahrkamera-Cupra-Leon-KL/",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Infotainment und PR-Nummern prüfen; Einschränkungen für bestimmte Fahrzeuge ab Modelljahr 2024",
  },
  {
    id: "leonkl-pdc-vorne",
    title: "Einparkhilfe vorne (PDC) nachrüsten",
    category: "Nachrüstungen",
    models: leonKL,
    sourceUrl: "https://www.k-electronic-shop.de/CUPRA/CUPRA-Leon/CUPRA-Leon-KL/Einparkhilfe-Rueckfahrkamera-Cupra-Leon-KL/",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Pakete nach vorhandenem PDC-System, z. B. PR 7X1; nicht pauschal für PR 7X0",
  },
  {
    id: "leon5f-dab",
    title: "DAB+ mit Antenne und Anschlussleitungen nachrüsten",
    category: "Nachrüstungen",
    models: ["SEAT Leon 5F"],
    sourceUrl: "https://www.seat-leon.de/forum/threads/dab-nachruesten-bei-mediasystem-plus.122693/page-4",
    sourceName: "SEAT-Leon-Forum",
    access: "öffentlich",
    note: "Praxisbericht zu MIB2, Antennenverstärker und Leitungen; Infotainment-Version prüfen",
  },
  // Umbauten
  // Zusätzliche quellenbasierte Umbauten vom 16.11.2026, ohne vorhandene Themen zu duplizieren.
  {
    "id": "golf8-iq-light",
    "title": "VW Golf 8: auf IQ.LIGHT-Matrix-LED-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Golf 8 (CD)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-matrix-scheinwerfer-iq-light-mit-dynamischem-blinklicht-fuer-vw-golf-8-viii/49100",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Scheinwerfersatz mit Anschlussanleitungs-Vorschau; aLWR und GeKo-/SFD-Prüfung sowie fachgerechte Kalibrierung nötig"
  },
  {
    "id": "golf8-iq-light-alwr",
    "title": "VW Golf 8: automatische Leuchtweitenregulierung für IQ.LIGHT nachrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Golf 8 (CD)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-automatische-leuchtweitenregulierung-alwr-komplettset-fuer-vw-golf-8-viii-cd-cg/49660",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "aLWR-Komplettset; vor Dongle-Inbetriebnahme Steuergerät zeitweise per berechtigtem GeKo-Zugang freischalten, Remoteunterstützung erforderlich"
  },
  {
    "id": "t61-led-front",
    "title": "VW T6.1: Halogen auf originale LED-Scheinwerfer umbauen",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Transporter / Multivan T6.1"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-scheinwerfer-led-tfl-fuer-vw-t6.1-sh-sj/44405",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Scheinwerfer/Steuergeräte und Codierhilfe; automatische Leuchtweitenregulierung muss zusätzlich installiert werden, anschließend Grundeinstellung"
  },
  {
    "id": "t61-led-alwr",
    "title": "VW T6.1: automatische Leuchtweitenregulierung für LED-Scheinwerfer nachrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Transporter / Multivan T6.1"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-alwr-komplettset-fuer-vw-t6.1-sh/46280",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Gateway-Kompatibilität prüfen; separates Codierinterface und professionelle Grundeinstellung nötig"
  },
  {
    "id": "octavia-nx-matrix",
    "title": "Škoda Octavia 4 NX: auf Matrix-LED-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Octavia 4 NX"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-matrix-scheinwerfer-mit-led-tfl-fuer-skoda-octavia-nx/49270",
    "sourceName": "KUFATEC",
    "access": "Produktinformation",
    "note": "Hersteller sucht aktuell Probeverbau; keine allgemeine Komplettanleitung oder allgemeine Verfügbarkeit bestätigt; 8G1 und aLWR nötig"
  },
  {
    "id": "leonkl-matrix",
    "title": "SEAT/CUPRA Leon KL: auf Matrix-LED-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "SEAT Leon KL",
      "CUPRA Leon KL"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-matrix-scheinwerfer-mit-led-tfl-fuer-seat-leon-kl/49320",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur mit Fernlichtassistent PR 8G1 und separater aLWR; Freigabe ggf. FOD-Shop, SFD2 und MJ-/PR-Abgleich"
  },
  {
    "id": "formentor-matrix",
    "title": "CUPRA Formentor KM: auf originale Matrix-LED-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "CUPRA Formentor KM"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-matrix-scheinwerfer-mit-led-tfl-fuer-seat-formentor-km7/49330",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Originale Matrix-Scheinwerfer mit Steuerteilen; weitere aLWR-, Fernlichtassistent- und SFD-Voraussetzungen vor Kauf prüfen"
  },
  {
    "id": "golf8-acc-komplett",
    "title": "VW Golf 8: Radar-ACC vollständig nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Golf 8 (CD)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-automatische-distanzregelung-acc-fuer-vw-golf-8/50680",
    "sourceName": "KUFATEC",
    "access": "Anbieterleistung",
    "note": "Komplettumbau laut Anbieter mit FIN-bezogenem Umfang; SFD1/SFD2, Assistenzhardware und Kalibrierung vorab prüfen"
  },
  {
    "id": "octavia-nx-acc-komplett",
    "title": "Škoda Octavia 4 NX: Radar-ACC vollständig nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Octavia 4 NX"
    ],
    "sourceUrl": "https://kufatec.com/de/skoda/octavia/octavia-nx/",
    "sourceName": "KUFATEC",
    "access": "Produktinformation",
    "note": "Hersteller listet Komplettset Artikel 50665; Baureihe, Steuergeräte und SFD2 sowie Inbetriebnahme nur VIN-bezogen"
  },
  {
    "id": "leon-kl-acc-komplett",
    "title": "SEAT/CUPRA Leon KL: Radar-ACC vollständig nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "SEAT Leon KL",
      "CUPRA Leon KL"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-automatische-distanzregelung-acc-fuer-seat-leon-kl/50825",
    "sourceName": "KUFATEC",
    "access": "Anbieterleistung",
    "note": "Anbieter-Komplettset für Seat Leon KL, bei CUPRA Leon Einzelfallprüfung; VIN, Freigaben, Steuergeräte und Radar-Kalibrierung notwendig"
  },
  {
    "id": "golf7-xenon-osram-led",
    "title": "Golf 7 Vor-Facelift: Xenon auf zugelassene LED-Retrofit-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://carwiki.de/golf-7-led-scheinwerfer-dynamische-blinker/",
    "sourceName": "CarWiki-Ratgeber",
    "access": "öffentlich",
    "note": "Sonderfall Xenon mit LED-TFL: ggf. AFS-Steuerteil durch LWR und Zusatzleitungen ersetzen; Genehmigung für genaue Ausführung prüfen"
  },
  {
    "id": "poloaw-halogen-led",
    "title": "Polo AW: Halogen auf originale LED-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Polo AW"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-scheinwerfer-led-tfl-fuer-vw-polo-aw1/42270-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "GTI-/Standardvariante beachten; aLWR fehlt im Scheinwerfersatz und muss je nach Ausführung ergänzt werden"
  },
  {
    "id": "a3-8v-halogen-bixenon",
    "title": "Audi A3 8V: Halogen auf originale Bi-Xenon-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "A3 / S3 8V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-adapter-bi-xenonscheinwerfer-fuer-audi-a3-8v/41027",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Kabeladapter genügt nicht; BCM, aLWR und Scheinwerferreinigungsanlage sowie Codierung beachten"
  },
  {
    "id": "a3-8v-alwr",
    "title": "Audi A3 8V: automatische Leuchtweitenregulierung für Xenon nachrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "A3 / S3 8V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-alwr-komplettset-fuer-audi-a3-8v/39254",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Set-Variante nur bis MJ 2016; Antrieb, Dämpferregelung, Gateway/BCM und SRA beachten"
  },
  {
    "id": "q3-f3-led-matrix",
    "title": "Audi Q3 F3: LED- auf Matrix-LED-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Q3 F3"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-matrix-scheinwerfer-mit-led-tfl-und-dynamischen-blinker-fuer-audi-q3-f3/43800",
    "sourceName": "KUFATEC",
    "access": "Anbieterleistung",
    "note": "Einbau nur beim Anbieter vor Ort; Frontkamera QK1/QK2, Adapter, Schlechtwetter-Lichtschalter und Codierung erforderlich"
  },
  {
    "id": "golf7-pacc-praxis",
    "title": "Golf 7 Facelift: ACC auf prädiktives ACC (pACC) erweitern, Praxisbericht",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://www.motor-talk.de/blogs/louk/praediktives-acc-pacc-retrofitting-t7326706.html",
    "sourceName": "Motor-Talk-Praxisbericht",
    "access": "öffentlich",
    "note": "Erfahrungsbericht am Golf 7 Facelift; vorhanden sein müssen geeigneter ACC-Radar, High-Kamera und Navigation, Freigaben/Parameter fahrzeugspezifisch"
  },
  {
    "id": "golf7-dome-flat-acc",
    "title": "Golf 7: ACC-Domradar auf flachen Radar umbauen",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://www.vw-retrofit.co.uk/product/dome-to-flat-radar-upgrade/",
    "sourceName": "VW Retrofit",
    "access": "Anbieterleistung",
    "note": "Fachbetrieb übernimmt CP-Anpassung, Radarhalter, Codierung und ADAS-Kalibrierung; Fahrzeugkompatibilität nur nach FIN"
  },
  {
    "id": "octavia5e-acc-komplett",
    "title": "Škoda Octavia 5E: automatisches ACC-Abstandssystem komplett nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://kufatec.com/en/kufatec-automatic-distance-control-acc-for-skoda-octavia-5e/43565",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Umfang abhängig von FIN, Radar/Sensorik und Bremsenelektronik; Follow-to-Stop nur bei DSG mit passendem ABS"
  },
  {
    "id": "tiguan2-acc-komplett",
    "title": "VW Tiguan II: ACC mit Radar und Steuergeräteintegration nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Tiguan II (AD/BW)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-automatische-distanzregelung-acc-fuer-vw-tiguan-ad1-ax1-bw2-bj2/41400",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Komplettsystem mit fahrzeugspezifischen Varianten, ESP-/Bremsensteuerung und Radar-Kalibrierung"
  },
  {
    "id": "audiq3-f3-acc-komplett",
    "title": "Audi Q3 F3: automatisches ACC-Abstandssystem nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Q3 F3"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-automatische-distanzregelung-acc-fuer-audi-q3-f3/43650",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Komplettset und Anleitungsvorschau; VIN-Prüfung vor Kauf; bei Hybrid/neueren SFD-Varianten gesonderte Prüfung"
  },
  {
    "id": "ateca-kh-acc",
    "title": "SEAT Ateca KH: ACC-Radar und Abstandsregelung nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "SEAT Ateca KH7"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-automatische-distanzregelung-acc-fuer-seat-ateca-kh/43610",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Komplettset mit Anleitungsvorschau; fahrzeugspezifische Teile, ACC-Bedienung und Kalibrierung beachten"
  },
  {
    "id": "mqb-stauassistent",
    "title": "MQB: ACC und Lane Assist zum Stauassistenten erweitern",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Golf 7 (5G)",
      "Passat B8 (3G)",
      "Tiguan II (AD/BW)",
      "Arteon 3H",
      "Superb 3V",
      "SEAT Leon 5F"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-acc-option-stauassistent-fuer-mqb/43774",
    "sourceName": "KUFATEC",
    "access": "Anbieterleistung",
    "note": "Nur geeignete Frontkamera 3Q0/2Q0, ACC, Lane Assist, Automatikgetriebe und elektrische Parkbremse; kein universeller VCDS-Schalter"
  },
  {
    "id": "a4-b9-gra-acc",
    "title": "Audi A4 B9: Geschwindigkeitsregelanlage auf Radar-ACC umbauen",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/AUDI/A4/A4-8W-B9/Komfort---Nuetzliches-A4-8W-B9/",
    "sourceName": "k-electronic",
    "access": "Anbieterleistung",
    "note": "Anbieter nennt für ACC ausschließlich individuellen Vor-Ort-Umbau; Radar, Bremsenelektronik und weitere Steuergeräte nötig, keine öffentliche Anleitung"
  },
  {
    "id": "golf7-mufu-lenkrad",
    "title": "Golf 7: Lenkrad ohne MuFu auf Multifunktionslenkrad/ACC-Tasten umrüsten",
    "category": "Umbauten",
    "topic": "Lenkrad & Bedienung",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-multifunktionslenkrad-mfl-fuer-vw-golf-7/39958",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Kabelsatz allein reicht nicht: Lenkrad, Tasten, Lenkstockhebel, ggf. Gateway High und Leitung zum Motorsteuergerät; Airbagarbeiten nur durch Fachpersonal"
  },
  {
    "id": "a3-8v-mufu-lenkrad",
    "title": "Audi A3 8V: Basislenkrad auf Multifunktionslenkrad umrüsten",
    "category": "Umbauten",
    "topic": "Lenkrad & Bedienung",
    "models": [
      "A3 / S3 8V"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-multifunktionslenkrad-fuer-audi-a3-8v/40097",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Original-MuFu und ggf. Gateway High zusätzlich erforderlich; Fachbetrieb für Airbag-/Lenkradarbeiten"
  },
  {
    "id": "t6-mufu-lenkrad",
    "title": "VW T6: Multifunktionslenkrad mit GRA-/ACC-Bedienung nachrüsten",
    "category": "Umbauten",
    "topic": "Lenkrad & Bedienung",
    "models": [
      "Transporter T6"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-multifunktionslenkrad-fuer-vw-t6-sg/41427",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Kabelsatz mit Anleitungsvorschau; MFL, Lenkstockhebel und Highline-BCM zusätzlich; GRA/ACC abhängig von Motorkennbuchstabe"
  },
  {
    "id": "poloaw-gra-lenkrad",
    "title": "VW Polo AW: Speedlimiter auf Lenkradtempomat (GRA) umrüsten",
    "category": "Umbauten",
    "topic": "Lenkrad & Bedienung",
    "models": [
      "Polo AW"
    ],
    "sourceUrl": "https://www.k-electronic-shop.de/VOLKSWAGEN/Polo/Polo-AW/Assistenzsysteme---Tempomat-Polo-AW/",
    "sourceName": "k-electronic",
    "access": "beim Nachrüstsatz",
    "note": "Nachrüstpaket mit MuFu-Tasten und SVM-Dokument; Vor-Facelift MJ 2018–2021, Ausstattung PR 8T9 und PR GP0 prüfen"
  },
  {
    "id": "mqb2020-lenkradheizung",
    "title": "MQB evo: auf beheizbares Multifunktionslenkrad umrüsten",
    "category": "Umbauten",
    "topic": "Lenkrad & Bedienung",
    "models": [
      "Golf 8 (CD)",
      "Octavia 4 NX",
      "SEAT Leon KL",
      "CUPRA Leon KL"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-beheizbares-lenkrad-lenkradheizung-fuer-mqb2020-meb/46141-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Anleitungsvorschau und Kabelsatz; beheizbares Lenkrad, Schleifring/Lenksäulensteuerteil, Ausstattung und SFD1/SFD2 prüfen"
  },
  {
    "id": "golf7-aid-digitalcluster",
    "title": "Golf 7: Analogtacho auf Active Info Display (AID) umbauen",
    "category": "Umbauten",
    "topic": "Cockpit & Infotainment",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://retrofitinfo.com/blog/golf-7-digital-cluster-retrofit-physical-install-wiring-guide",
    "sourceName": "RetrofitInfo",
    "access": "öffentlich",
    "note": "Hardware-Ratgeber zu AID, Blende und MOST; Komponentenschutz, Wegfahrsperre und Schlüssel nur autorisiert online anlernen"
  },
  {
    "id": "golf7-mib1-mib2",
    "title": "Golf 7: MIB1 auf MIB2-Infotainment umbauen",
    "category": "Umbauten",
    "topic": "Cockpit & Infotainment",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://www.golf7freunde.de/index.php/Thread/12537-MIB1-auf-MIB2-codieren-kopieren-wie-auch-immer/",
    "sourceName": "Golf7Freunde-Forum",
    "access": "öffentlich",
    "note": "Erfahrungsbericht, keine freigegebene OEM-Anleitung; Komponentenschutz und FEC/SWaP rechtmäßig behandeln, USB-Buchse/Display ggf. tauschen"
  },
  // Intensivrecherche: Scheinwerfer, ACC/pACC, Lenkrad, Cockpit und Infotainment (16.11.2026)
  {
    id: "golf7-halogen-bixenon",
    title: "Halogen-Scheinwerfer auf originale Bi-Xenon-Scheinwerfer umrüsten",
    category: "Umbauten",
    models: ["Golf 7 (5G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-adapter-bi-xenonscheinwerfer-fuer-vw-golf-7-polo-6c/39892-1",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Adapter/Anschlussinformationen; zusätzlich BCM, aLWR und SRA gemäß Ausführung nötig. Scheinwerfer nach Herstellervorgabe einstellen",
  },
  {
    id: "golf7-bixenon-ledtfl",
    title: "Bi-Xenon auf Bi-Xenon mit LED-Tagfahrlicht und Kurvenlicht umrüsten",
    category: "Umbauten",
    models: ["Golf 7 (5G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-adapter-bi-xenon-auf-bi-xenon-mit-led-tfl-fuer-vw-golf-7/40208",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "aLWR-Steuergerät muss angepasst/ersetzt werden; Kurvenlicht nicht nur per Codierung freischaltbar",
  },
  {
    id: "golf7-alwr-lichtumbau",
    title: "Automatische Leuchtweitenregelung (aLWR) für Xenon-/LED-Scheinwerferumbau ergänzen",
    category: "Umbauten",
    models: ["Golf 7 (5G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-alwr-komplettset-fuer-vw-golf-7-vii/39934-7",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Komplettset mit Sensorik und Steuergerät; richtige Hinterachse und Fahrwerk wählen, Grundeinstellung/Kalibrierung nötig",
  },
  {
    id: "passat-b8-led-matrix",
    title: "Standard-/Kurvenlicht auf originale LED-/Matrix-Scheinwerfer umbauen",
    category: "Umbauten",
    models: ["Passat B8 (3G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-led-scheinwerfer-mit-led-tagfahrlicht-tfl-fuer-vw-passat-b8/41670",
    sourceName: "KUFATEC",
    access: "Produktinfo / Service",
    note: "Produkt ohne Montageanleitung; Matrix ab Mj. 2020, Frontkamera QK1, zusätzliche aLWR/SRA und geeignete Steuergeräte prüfen",
  },
  {
    id: "passat-b8-led-kurvenlicht",
    title: "LED-Scheinwerfer auf LED mit Kurvenlicht und variabler Lichtverteilung upgraden",
    category: "Umbauten",
    models: ["Passat B8 (3G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-adapter-led-auf-led-mit-kurvenlicht-fuer-vw-passat-b8/42225",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "PR 8IT → 8IU: Adapter und aLWR-Steuergerät, Frontkamera QK1 für variable Lichtverteilung, anschließend fachgerechte Codierung",
  },
  {
    id: "passat-b8-alwr-lichtumbau",
    title: "aLWR-Komplettumrüstung für LED-Scheinwerfer",
    category: "Umbauten",
    models: ["Passat B8 (3G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-alwr-komplettset-fuer-vw-passat-b8-cb/41660-6",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Fahrwerk, Baujahr und Scheinwerfer-PR-Code abgleichen; Steuergerät, Gestänge, Sensor und Codierung erforderlich",
  },
  {
    id: "audi-mlbevo-matrix-adapter",
    title: "LED auf Matrix-LED-Scheinwerfer umrüsten: Adapter, Steuergeräte und Kalibrierung",
    category: "Umbauten",
    models: ["A4 / S4 B9","A5 / S5 F5","Q5 FY"],
    sourceUrl: "https://kufatec.com/de/kufatec-adapter-led-matrix-scheinwerfer-fuer-audi-a4-8w-a5-f5-q5-fy/47865",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Frontkamera QK1 erforderlich, unterschiedliche Adapterversionen für Vor-Facelift/Facelift; Softwarekonfiguration und Scheinwerferkalibrierung nötig",
  },
  {
    id: "a4-8w-original-matrix",
    title: "Originale Matrix-LED-Scheinwerfer inkl. dynamischer Blinker nachrüsten",
    category: "Umbauten",
    models: ["A4 / S4 B9"],
    sourceUrl: "https://kufatec.com/de/led-matrix-scheinwerfer-led-tfl-und-dynamischen-blinker-fuer-audi-a4-8w/41565",
    sourceName: "KUFATEC",
    access: "Produktinfo / Service",
    note: "Hardwarepaket für A4 8W, Ausführung bis Mj. 2019 bzw. ab Mj. 2020 auswählen; Adapter/Steuergerätesoftware separat prüfen",
  },
  {
    id: "a3-8v-matrix-scheinwerfer",
    title: "Audi A3 8V Facelift: originale Matrix-LED-Scheinwerfer umrüsten",
    category: "Umbauten",
    models: ["A3 / S3 8V"],
    sourceUrl: "https://kufatec.com/de/led-matrix-scheinwerfer-mit-led-tfl-und-dynamischen-blinker-fuer-audi-a3-8v/43725",
    sourceName: "KUFATEC",
    access: "Produktinfo / Service",
    note: "Nur Facelift ab MJ 2017 mit Frontkamera QK1; Anbieter nennt Werkstatteinbau, keine frei verfügbare Komplettanleitung",
  },
  {
    id: "leon5f-voll-led",
    title: "SEAT Leon 5F Facelift: originale Voll-LED-Scheinwerfer umrüsten",
    category: "Umbauten",
    models: ["SEAT Leon 5F"],
    sourceUrl: "https://kufatec.com/de/led-scheinwerfer-led-tfl-fuer-seat-leon-5f/44435",
    sourceName: "KUFATEC",
    access: "öffentlich",
    note: "Anschlussanleitung beim Anbieter frei verfügbar; nur Facelift ab MJ 2017, aLWR gesondert nachrüsten",
  },
  {
    id: "leon5f-alwr",
    title: "SEAT Leon 5F: aLWR beim LED-Scheinwerferumbau nachrüsten",
    category: "Umbauten",
    models: ["SEAT Leon 5F"],
    sourceUrl: "https://kufatec.com/de/kufatec-komplettset-automatische-leuchtweitenregulierung-alwr-fuer-seat-leon-5f/50210-1",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Nur Facelift ab MJ 2017, passende Hinterachsversion wählen, CAN-Gateway prüfen und Diagnose-Grundeinstellung ausführen",
  },
  {
    id: "octavia5e-alwr",
    title: "Škoda Octavia 5E: aLWR für Xenon-/LED-Scheinwerferumbau nachrüsten",
    category: "Umbauten",
    models: ["Octavia 3 5E","Octavia 3 5E Facelift"],
    sourceUrl: "https://kufatec.com/de/kufatec-alwr-komplettset-fuer-skoda-octavia-5e/42280",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Varianten nach Hinterachse/Antrieb/DCC, Codierdongle bzw. Diagnose-Grundeinstellung erforderlich",
  },
  {
    id: "mqb-acc-pacc",
    title: "Vorhandenes ACC auf prädiktives ACC (pACC) erweitern",
    category: "Umbauten",
    models: ["A1 GB","A3 / S3 8V","Q2 GA","Q3 F3","Arteon 3H","Golf 7 (5G)","Tiguan II (AD/BW)","Passat B8 (3G)","Polo AW","Touran 5T","T-Roc A11","Transporter / Multivan T6.1","SEAT Arona KJ7","SEAT Ateca KH7","SEAT Ibiza KJ","SEAT Leon 5F","SEAT Tarraco KN2","Kamiq NW","Karoq NU","Kodiaq NS","Octavia 3 5E","Octavia 3 5E Facelift","Scala NW","Superb 3V"],
    sourceUrl: "https://kufatec.com/de/kufatec-acc-option-praediktive-regelung-fuer-mqb/44365",
    sourceName: "KUFATEC",
    access: "Produktinfo / Service",
    note: "Keine öffentliche Schritt-für-Schritt-Anleitung; ab Werk vorhandenes ACC bzw. spezielle Nachrüstvariante, Frontkamera, Navi-PR 7UF/7UG/7UT/7T7, Radarstand, Lizenzen und Kalibrierung vorab prüfen; Remote-Inbetriebnahme erforderlich",
  },
  {
    id: "passat-b8-acc-nachruesten",
    title: "GRA/Tempomat auf vollständiges ACC mit Radar und Stop-and-Go umbauen",
    category: "Umbauten",
    models: ["Passat B8 (3G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-automatische-distanzregelung-acc-fuer-vw-passat-b8-cb/41390",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Vollständige ACC-Nachrüstung inkl. Radar/Lenkradbedienung, je nach VIN; Anbieter verlangt vorherige Fachabstimmung, Kalibrierung notwendig",
  },
  {
    id: "mqb-acc-hardware-kabel",
    title: "ACC-Radar/Lenkradbedienung bei MQB-Modellen mit passendem Kabelsatz ergänzen",
    category: "Umbauten",
    models: ["Golf 7 (5G)","A3 / S3 8V","Octavia 3 5E","Octavia 3 5E Facelift","SEAT Leon 5F"],
    sourceUrl: "https://kufatec.com/de/kufatec-kabelsatz-automatische-distanzregelung-acc-mqb/40720",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Nur Verkabelung: Sensor, Halter, Bedienelemente, Freigaben, Radar-Abgleich und weitere Teile separat notwendig; verschiedene Radarvarianten",
  },
  {
    id: "mqb-acc-210",
    title: "ACC-Geschwindigkeitsbereich von 160 auf 210 km/h erweitern",
    category: "Umbauten",
    models: ["A3 / S3 8V","SEAT Leon 5F","Fabia 3 NJ","Karoq NU","Kodiaq NS","Octavia 3 5E","Octavia 3 5E Facelift","Superb 3V","Golf 7 (5G)","Passat B8 (3G)","Polo AW","Tiguan II (AD/BW)","Touran 5T","T-Roc A11"],
    sourceUrl: "https://kufatec.com/de/kufatec-acc-option-210-km-h-fuer-mqb/44175",
    sourceName: "KUFATEC",
    access: "Produktinfo / Service",
    note: "Nur bei bestehendem ACC 160 km/h mit passender Radarhardware/PR 6K3; keine allgemeine Codieranleitung, Einbau nur nach Kompatibilitätsprüfung",
  },
  {
    id: "t5-multifunktionslenkrad",
    title: "VW T5 7E: Multifunktionslenkrad inklusive Lenksäulen-/Kabelanpassung umbauen",
    category: "Umbauten",
    models: ["Transporter T5"],
    sourceUrl: "https://kufatec.com/de/kufatec-kabelsatz-multifunktionslenkrad-mfl-fuer-vw-t5-7e/46901",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Für T5 7E/GP und je nach vorhandener GRA; Lenkrad, Lenkstockschalter und Schleifring separat erforderlich; Airbag-Arbeiten nur fachgerecht",
  },
  {
    id: "passat-b8-schaltwippen",
    title: "VW Passat B8: Multifunktionslenkrad auf Schaltwippen/Tiptronic umbauen",
    category: "Umbauten",
    models: ["Passat B8 (3G)"],
    sourceUrl: "https://www.k-electronic-shop.de/VOLKSWAGEN/Passat/Passat-B8/VW-Passat-B8-Schaltwippen-Tiptronic-Lenkrad.html",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Deutschsprachige Einbauanleitung und Codierinterface im Set; nur Automatikgetriebe, vorhandenes MuFu und passende Airbagaufnahme",
  },
  {
    id: "audi-a4-b9-schaltwippen",
    title: "Audi A4 B9: Multifunktionslenkrad mit Schaltwippen/abgeflachtem Lenkrad umbauen",
    category: "Umbauten",
    models: ["A4 / S4 B9"],
    sourceUrl: "https://www.k-electronic-shop.de/AUDI/A4/A4-8W-B9/AUDI-A4-B9-8W-Schaltwippen-Tiptronic-Lenkrad-rund-abgeflacht.html",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Originales Lenkrad im Set mit Einbauanleitung; nur Automatik; Airbag-, Lenkradheizungs- und NI-/UNECE-Einschränkungen beachten",
  },
  {
    id: "octavia5e-lenkradheizung",
    title: "Škoda Octavia 5E: normales MuFu auf beheizbares Multifunktionslenkrad umrüsten",
    category: "Umbauten",
    models: ["Octavia 3 5E","Octavia 3 5E Facelift"],
    sourceUrl: "https://www.k-electronic-shop.de/SKODA/Octavia/Octavia-5E/SKODA-Octavia-5E-Lenkradheizung-beheizbares-Lenkrad-Kabelsatz.html",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Kabelsatz plus Einbauanleitung; Climatronic nötig, zusätzlich beheiztes Lenkrad und kompatible Lenksäulenelektronik; Airbag durch Fachbetrieb",
  },
  {
    id: "passat-b8-tempomat-mufu",
    title: "Passat B8: vorhandenes Multifunktionslenkrad um Tempomat/GRA-Bedienung erweitern",
    category: "Umbauten",
    models: ["Passat B8 (3G)"],
    sourceUrl: "https://www.k-electronic-shop.de/VOLKSWAGEN/Passat/Passat-B8/VW-Passat-B8-Geschwindigkeitsregelanlage-Tempomat.html",
    sourceName: "k-electronic",
    access: "beim Nachrüstsatz",
    note: "Mitgeliefertes originales SVM-Aktivierungsdokument; Freigabe beim Herstellerpartner, richtige Lenkrad-PR-Codes wählen",
  },
  {
    id: "a3-8v-virtual-cockpit",
    title: "Audi A3 8V: analoges Kombiinstrument auf Virtual Cockpit/FPK umbauen",
    category: "Umbauten",
    models: ["A3 / S3 8V"],
    sourceUrl: "https://kufatec.com/de/kufatec-adapter-kombiinstrument-fpk-virtual-cockpit-fuer-audi-a3-8v-q2-ga/41866",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Ab Modelljahr 2017; neue Schalttafel, weitere Tasten/Blenden nötig; Navigation plus 7UG für Karte, Komponentenschutz und Anpassung fachgerecht",
  },
  {
    id: "q2-ga-virtual-cockpit",
    title: "Audi Q2 GA: analoges Kombiinstrument auf Virtual Cockpit/FPK umbauen",
    category: "Umbauten",
    models: ["Q2 GA"],
    sourceUrl: "https://kufatec.com/de/kufatec-adapter-kombiinstrument-fpk-virtual-cockpit-fuer-audi-a3-8v-q2-ga/41866",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Kabelsatz reicht allein nicht; Schalttafel, Steuergeräte und Navi-PR-Code prüfen, Komponentenschutz-/Anlernarbeit beim Berechtigten",
  },
  {
    id: "a3-8v-mmi-upgrade",
    title: "Audi A3 8V: MMI Entry/MIB Entry auf MMI Navigation plus umrüsten",
    category: "Umbauten",
    models: ["A3 / S3 8V"],
    sourceUrl: "https://kufatec.com/de/kufatec-kabelsatz-mmi-umruestung-fuer-audi-a3-8v/41626",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Anschlussanleitung für Kabelsatz; Mainunit, Display, Bedienteil und Halter zusätzlich nötig; Freigaben und Komponentenschutz legal durchführen",
  },
  {
    id: "golf7-fahrprofil-umbau",
    title: "Golf 7: Fahrprofilauswahl-Taste und Fahrzeugfunktion nachrüsten",
    category: "Umbauten",
    models: ["Golf 7 (5G)"],
    sourceUrl: "https://kufatec.com/de/nachruest-set-fahrprofilauswahl-fuer-vw-golf-7-limousine-variant/47816",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Kabelsatz, Taster und Freischaltdokument; nur bei vorhandener GRA/ACC und zulässiger Motor-/Getriebekombination",
  },
  {
    id: "golf7-pla-parklenk",
    title: "Golf 7: Parklenkassistent (PLA) inklusive zusätzlicher Sensoren nachrüsten",
    category: "Umbauten",
    models: ["Golf 7 (5G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-komplettset-parklenkassistent-pla-fuer-vw-golf-7/43485-5",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Anleitungsvorschau vorhanden; Stoßfänger-Sensorik, Steuergerät und Codierung je nach Vorhandensein der Einparkhilfe",
  },
  {
    id: "passat-b8-facelift-led-heck",
    title: "Passat B8 Variant: Vor-Facelift-Heckleuchten auf Facelift-LED mit dynamischen Blinkern umrüsten",
    category: "Umbauten",
    models: ["Passat B8 (3G)"],
    sourceUrl: "https://kufatec.com/de/kufatec-komplettset-facelift-led-heckleuchten-fuer-vw-passat-b8/44220",
    sourceName: "KUFATEC",
    access: "Vorschau / Kauf",
    note: "Nur Variant 3G5; Heckleuchten, Kabelsatz und Codierdongle; geänderte Stoßfängerpassung beachten",
  },
  {
    id: "golf7-facelift-heckleuchten",
    title: "Vor-Facelift auf Facelift-LED-Rückleuchten mit dynamischen Blinkern umbauen",
    category: "Umbauten",
    models: golf7,
    sourceUrl: "https://www.golf7freunde.de/index.php/Thread/9684-Umbau-von-vFL-LED-R%C3%BCckleuchten-auf-Facelift-LED-R%C3%BCckleuchten-mit-dyn-Lauflicht-B/",
    sourceName: "Golf7Freunde",
    access: "öffentlich",
    note: "Schrittfolge mit Kabelsatz und Einbaubericht; Heckleuchtenvariante beachten",
  },
  {
    id: "golf75-halogen-voll-led",
    title: "Golf 7 Facelift: Halogenscheinwerfer auf originale Voll-LED umbauen",
    category: "Umbauten",
    models: golf7,
    sourceUrl: "https://www.golf7freunde.de/index.php/Thread/10926-Umbau-Golf-7-Facelift-Halogen-Scheinwerfer-auf-Voll-LED-Scheinwerfer-original-Te/?postID=227526",
    sourceName: "Golf7Freunde",
    access: "öffentlich",
    note: "Nur Facelift; Verkabelung, Leuchtweitenregelung und zulässige Komponenten fachlich prüfen",
  },
  {
    id: "octavia5e-facelift-heckleuchten",
    title: "Octavia 5E Kombi: Vor-Facelift auf Facelift-Rückleuchten umbauen",
    category: "Umbauten",
    models: ["Octavia 3 5E"],
    sourceUrl: "https://octavia-rs.com/thread/25546-anleitung-facelift-r%C3%BCckleuchten-im-vorfacelift/",
    sourceName: "Octavia-RS-Forum",
    access: "öffentlich",
    note: "Öffentlicher Umbaubericht mit Teilenummern und Steckerbelegung; nur passende Karosserievariante",
  },
  {
    id: "leon5f-facelift-heckleuchten",
    title: "Leon 5F: Facelift-LED-Rückleuchten nachrüsten",
    category: "Umbauten",
    models: ["SEAT Leon 5F"],
    sourceUrl: "https://www.youtube.com/watch?v=wtQQ-qZR06A",
    sourceName: "Marc Packeisen (Videoanleitung)",
    access: "öffentlich",
    note: "Schritt-für-Schritt-Video für Leon 5F; Bauteile und Verkabelung unterscheiden sich nach Karosserie",
  },
  {
    id: "leon5f-mib1-mib2",
    title: "Infotainment von MIB1 auf MIB2 mit DAB+ umbauen",
    category: "Umbauten",
    models: ["SEAT Leon 5F"],
    sourceUrl: "https://www.seat-leon.de/forum/threads/dab-nachruesten-bei-mediasystem-plus.122693/page-4",
    sourceName: "SEAT-Leon-Forum",
    access: "öffentlich",
    note: "Detaillierter Praxisbericht mit Einbauschritten; Komponentenschutz und rechtmäßige Funktionsfreigaben beachten",
  },
];

export function researchedGuidesForModel(model: string, category: ResearchCategory): ResearchGuide[] {
  return researchedGuides.filter((entry) => entry.category === category && entry.models.includes(model));
}
