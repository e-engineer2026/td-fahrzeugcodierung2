// Redaktionelle, eigenständig formulierte Themenübersicht aus vom Betreiber bereitgestellten Referenz-PDFs.
// Die PDFs werden NICHT gehostet, kopiert, verkauft oder als eigene Codieranleitungen wiedergegeben.
// Besonders die Golf-8-Vorlage ist als "Not for commercial use" gekennzeichnet.
// Keine Codierwerte oder Anleitungen Dritter; alle Themen sind technische Prüfkandidaten.
import type { Vehicle } from "../data/catalog";

export type ReferenceCategory = "Codierungen" | "Assistenzsysteme" | "Nachrüstungen" | "Umbauten";
export type ReferenceScope = "golf8" | "mqb" | "mlbevo";
export type ReferenceStatus = "tested" | "historical" | "unverified";
export type ReferenceIdea = {
  id: string;
  title: string;
  category: ReferenceCategory;
  scope: ReferenceScope;
  sourceName: string;
  sourcePage: number;
  status: ReferenceStatus;
  note: string;
  modelScope?: "octavia5e" | "vw-mqb";
};

const mqbReferenceModels = new Set([
  "Golf 7 (5G)", "Passat B8 (3G)", "Tiguan II (AD/BW)", "Touran 5T",
  "T-Roc A11", "Arteon 3H", "A3 / S3 8V", "Q2 GA", "Q3 F3",
  "Octavia 3 5E", "Octavia 3 5E Facelift", "Superb 3V", "Kodiaq NS",
  "Karoq NU", "SEAT Leon 5F", "SEAT Ateca KH7", "SEAT Tarraco KN2",
  "CUPRA Ateca KH7"
]);

const mlbevoReferenceModels = new Set([
  "A4 / S4 B9", "A5 / S5 F5", "A6 / S6 C8",
  "A7 / S7 4K", "A8 D5 (4N)", "Q5 FY", "Q7 4M", "Q8 4M", "e-tron GE"
]);

export const referenceIdeas: readonly ReferenceIdea[] = [
  {
    "id": "ref-golf8-001",
    "title": "Air-Care-Einstellung nach Neustart beibehalten",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 5,
    "status": "tested",
    "note": "Klimasteuergerät mit Air Care erforderlich"
  },
  {
    "id": "ref-golf8-002",
    "title": "Umluftmodus beim Neustart wiederherstellen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 6,
    "status": "tested",
    "note": "Nur bei passender Klima-Bedieneinheit"
  },
  {
    "id": "ref-golf8-003",
    "title": "Klimatisierung: zusätzliche Lüfterprofile anbieten",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 6,
    "status": "tested",
    "note": "Climatronic und Softwarestand prüfen"
  },
  {
    "id": "ref-golf8-004",
    "title": "Sitzheizung nach Zeit automatisch herunterstufen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 6,
    "status": "tested",
    "note": "Nur mit entsprechender Sitzheizung und Klimaelektronik"
  },
  {
    "id": "ref-golf8-005",
    "title": "Temperaturniveaus der Sitzheizungsstufen verändern",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 6,
    "status": "tested",
    "note": "Ausführung des Klimasteuergeräts prüfen"
  },
  {
    "id": "ref-golf8-006",
    "title": "Letzte Sitzheizungsstufe speichern",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 7,
    "status": "tested",
    "note": "Bei geeigneter Sitzheizung und Software"
  },
  {
    "id": "ref-golf8-007",
    "title": "Lichtautomatik: Schaltschwelle des Sensors anpassen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 7,
    "status": "tested",
    "note": "Licht-/Regensensor und BCM-Software beachten"
  },
  {
    "id": "ref-golf8-008",
    "title": "Tagfahrlicht-Schalter im Fahrzeugmenü ergänzen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 7,
    "status": "tested",
    "note": "BCM mit unterstütztem Fahrzeugmenü"
  },
  {
    "id": "ref-golf8-009",
    "title": "Helligkeit vorhandener Ambientebeleuchtung erhöhen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 7,
    "status": "tested",
    "note": "Nur vorhandene Lichtbereiche; keine Hardware-Nachrüstung"
  },
  {
    "id": "ref-golf8-010",
    "title": "Automatische Türverriegelung im Fahrzeugmenü einstellbar machen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 8,
    "status": "tested",
    "note": "Zentralverriegelung mit passendem BCM"
  },
  {
    "id": "ref-golf8-011",
    "title": "DSG: Türen bei Wahlhebelstellung P automatisch entriegeln",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 8,
    "status": "tested",
    "note": "Nur DSG-Fahrzeuge mit geeignetem Zentralverriegelungssystem"
  },
  {
    "id": "ref-golf8-012",
    "title": "Fenster-Komfortöffnung über berührungsempfindliche Türgriffe",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 9,
    "status": "tested",
    "note": "Kessy-Türgriffe vorausgesetzt"
  },
  {
    "id": "ref-golf8-013",
    "title": "Ambientefarben bestimmten Fahrprofilen zuordnen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 10,
    "status": "tested",
    "note": "Mehrfarbige Ambientebeleuchtung und Fahrprofilauswahl vorausgesetzt"
  },
  {
    "id": "ref-golf8-014",
    "title": "Zentralverriegelung beim Entfernen vom Fahrzeug automatisch schließen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 10,
    "status": "tested",
    "note": "Kessy-Variante und Diebstahlschutz prüfen"
  },
  {
    "id": "ref-golf8-015",
    "title": "Beidseitiges Parklicht bei abgestelltem Fahrzeug konfigurieren",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 11,
    "status": "tested",
    "note": "Lichtsteuergerät und regionale Vorschriften prüfen"
  },
  {
    "id": "ref-golf8-016",
    "title": "Kofferraumöffnung mit zusätzlicher Innenraumbeleuchtung kombinieren",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 11,
    "status": "tested",
    "note": "Leuchtenhardware muss vorhanden sein"
  },
  {
    "id": "ref-golf8-017",
    "title": "Komfortschließung im Verabschiedungsbildschirm anzeigen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 11,
    "status": "tested",
    "note": "Infotainmentfunktion und Fensterheber abhängig vom Softwarestand"
  },
  {
    "id": "ref-golf8-018",
    "title": "Erweiterte Digital-Cockpit-Anzeigen einblenden",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 13,
    "status": "tested",
    "note": "AID/Virtual Cockpit mit kompatibler Software"
  },
  {
    "id": "ref-golf8-019",
    "title": "AID-Fahrzeugansicht im GTI-Stil prüfen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 13,
    "status": "tested",
    "note": "Nur passende AID-Software und Modellvariante"
  },
  {
    "id": "ref-golf8-020",
    "title": "AID-Fahrzeugansicht im R-Stil prüfen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 14,
    "status": "tested",
    "note": "R-spezifische Darstellung benötigt kompatiblen Datensatz"
  },
  {
    "id": "ref-golf8-021",
    "title": "Offroad-Darstellung im Digital Cockpit anzeigen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 14,
    "status": "tested",
    "note": "AID-Version und Freigaben prüfen"
  },
  {
    "id": "ref-golf8-022",
    "title": "Ladedruckanzeige im Digital Cockpit hinzufügen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 15,
    "status": "tested",
    "note": "Abhängig von Motorsteuergerät und AID"
  },
  {
    "id": "ref-golf8-023",
    "title": "G-Kräfte im digitalen Kombiinstrument einblenden",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 15,
    "status": "tested",
    "note": "AID-Ausführung prüfen"
  },
  {
    "id": "ref-golf8-024",
    "title": "Motorleistung und Drehmoment im Digital Cockpit darstellen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 15,
    "status": "tested",
    "note": "Sensor-/Anzeigedaten abhängig vom Steuergerät"
  },
  {
    "id": "ref-golf8-025",
    "title": "Getriebetemperatur im Digital Cockpit anzeigen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 15,
    "status": "tested",
    "note": "Getriebedaten und AID-Version erforderlich"
  },
  {
    "id": "ref-golf8-026",
    "title": "Beschleunigungsmessung im Kombiinstrument anzeigen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 18,
    "status": "tested",
    "note": "Passendes AID und Fahrzeugprofil vorausgesetzt"
  },
  {
    "id": "ref-golf8-027",
    "title": "Scheinwerfer-Startanimation bei IQ.LIGHT konfigurieren",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 18,
    "status": "tested",
    "note": "Nur IQ.LIGHT mit kompatiblen Steuergeräten"
  },
  {
    "id": "ref-golf8-028",
    "title": "Navigationskarte in AID und Infotainment gleichzeitig anzeigen",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 20,
    "status": "tested",
    "note": "Navigation und Digital Cockpit erforderlich"
  },
  {
    "id": "ref-golf8-029",
    "title": "Seitenspiegelheizung gemeinsam mit Heckscheibenheizung starten",
    "category": "Codierungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 18,
    "status": "tested",
    "note": "Spiegelheizung und Klima-/BCM-Steuerung erforderlich"
  },
  {
    "id": "ref-golf8-030",
    "title": "Fernlichtassistent: letzte Aktivierung nach Zündwechsel merken",
    "category": "Assistenzsysteme",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 11,
    "status": "tested",
    "note": "Nur bei werkseitigem Fernlichtassistent"
  },
  {
    "id": "ref-golf8-031",
    "title": "ACC-Tempo in 1-km/h-Schritten einstellen",
    "category": "Assistenzsysteme",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 12,
    "status": "tested",
    "note": "Nur mit vorhandenem ACC und passendem Radar"
  },
  {
    "id": "ref-golf8-032",
    "title": "Lane Assist: zuletzt gewählte Einstellung beim Start übernehmen",
    "category": "Assistenzsysteme",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 21,
    "status": "tested",
    "note": "Frontkamera mit unterstütztem Softwarestand"
  },
  {
    "id": "ref-golf8-033",
    "title": "45-Watt-USB-Ladeanschlüsse statt Standardmodulen einbauen",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 33,
    "status": "unverified",
    "note": "Anschlussbelegung vorne und hinten unterscheidet sich; elektrische Absicherung prüfen"
  },
  {
    "id": "ref-golf8-034",
    "title": "Rahmenlosen automatisch abblendenden Innenspiegel nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 36,
    "status": "unverified",
    "note": "Spiegelhalterung und Sensor-/Kabelausstattung prüfen"
  },
  {
    "id": "ref-golf8-035",
    "title": "Facelift-Projektorleuchten in den Türen nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 38,
    "status": "unverified",
    "note": "Türsteuergeräte und Stecker unterscheiden sich nach Baujahr"
  },
  {
    "id": "ref-golf8-036",
    "title": "Front-Lichtleiste zwischen den Scheinwerfern nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 39,
    "status": "unverified",
    "note": "BCM-Generation und Datensatz unterscheiden sich vor/nach Ende 2020"
  },
  {
    "id": "ref-golf8-037",
    "title": "Kessy-Türgriffe zusätzlich hinten nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 44,
    "status": "unverified",
    "note": "Keyless-Steuergerät, Antennen und SFD-Freigabe prüfen"
  },
  {
    "id": "ref-golf8-038",
    "title": "Beheizbare Rücksitze mit Klimabedienung nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 46,
    "status": "unverified",
    "note": "Heizmatten, hinteres Bedienteil und Leitungen erforderlich"
  },
  {
    "id": "ref-golf8-039",
    "title": "Zentralverriegelungstaster an der Beifahrertür nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 46,
    "status": "unverified",
    "note": "Passenden Tür-Kabelbaum und Schalter prüfen"
  },
  {
    "id": "ref-golf8-040",
    "title": "Automatisch abblendende Außenspiegel nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 46,
    "status": "unverified",
    "note": "Spiegelglas-/Türsteuergerätevariante erforderlich"
  },
  {
    "id": "ref-golf8-041",
    "title": "Elektrische Heckklappe beim Golf 8 Variant nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 45,
    "status": "unverified",
    "note": "Nur Variant; Motoren, Steuergerät, Schloss und geeignete Parametrierung"
  },
  {
    "id": "ref-golf8-042",
    "title": "Aktiven Spurwechselassistenten mit passender Hardware nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 37,
    "status": "unverified",
    "note": "Radar, Frontkamera, Freigaben, Kalibrierung und gesetzliche Anforderungen"
  },
  {
    "id": "ref-golf8-043",
    "title": "Travel Assist mit Lenkrad- und Kamerahardware nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 42,
    "status": "unverified",
    "note": "Keine reine Codierung; Radar-/Kamera-/Lenkradvariante und Freigaben prüfen"
  },
  {
    "id": "ref-golf8-044",
    "title": "Automatischen Parklenkassistenten nachrüsten",
    "category": "Nachrüstungen",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 47,
    "status": "unverified",
    "note": "Zusätzliche Sensoren, Lenksystem und Inbetriebnahme erforderlich"
  },
  {
    "id": "ref-golf8-045",
    "title": "Golf-8-Lenkrad auf R-Mode-Tasten umrüsten",
    "category": "Umbauten",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 34,
    "status": "unverified",
    "note": "Airbag-Arbeiten nur Fachpersonal; Gateway-Parametrierung und SFD erforderlich"
  },
  {
    "id": "ref-golf8-046",
    "title": "Harman/Kardon-Subwoofergehäuse modifizieren",
    "category": "Umbauten",
    "scope": "golf8",
    "sourceName": "Codierliste Golf 8 (n3oka, 2025)",
    "sourcePage": 54,
    "status": "unverified",
    "note": "Mechanischer Eingriff am serienmäßigen Subwoofer; Garantie und akustische Wirkung nicht bestätigt"
  },
  {
    "id": "ref-mqb-001",
    "title": "Ambientebeleuchtung: verfügbare Farbauswahl erweitern",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 15,
    "status": "historical",
    "note": "Mehrfarbige Ausstattung, passendes BCM und Infotainment erforderlich"
  },
  {
    "id": "ref-mqb-002",
    "title": "Ambientefarben je Fahrprofil individuell konfigurieren",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 15,
    "status": "historical",
    "note": "Nur bei vorhandener mehrfarbiger Ambientebeleuchtung"
  },
  {
    "id": "ref-mqb-003",
    "title": "Coming-Home-Lichtdauer über 30 Sekunden einstellen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 20,
    "status": "historical",
    "note": "Abhängig von BCM und Lichtpaket"
  },
  {
    "id": "ref-mqb-004",
    "title": "Coming Home ausschließlich mit Positions- oder Tagfahrlicht",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 20,
    "status": "historical",
    "note": "Leuchtenhardware und lokale Vorschriften beachten"
  },
  {
    "id": "ref-mqb-005",
    "title": "Navigationsradio: WLAN-Medienstreaming einschalten",
    "category": "Codierungen",
    "scope": "mqb",
    "modelScope": "vw-mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 22,
    "status": "historical",
    "note": "Nur mit geeigneter Discover-Media-/Pro-Generation"
  },
  {
    "id": "ref-mqb-006",
    "title": "Zweites Mobiltelefon per Bluetooth zulassen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 22,
    "status": "historical",
    "note": "Telefonmodul und MIB-Software prüfen"
  },
  {
    "id": "ref-mqb-007",
    "title": "Aktuellen Standort statt Fahrprofil im Displaykopf zeigen",
    "category": "Codierungen",
    "scope": "mqb",
    "modelScope": "vw-mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 21,
    "status": "historical",
    "note": "Nur bestimmte Discover-Media-/Pro-Systeme"
  },
  {
    "id": "ref-mqb-008",
    "title": "Einparkhilfe: Audioabsenkung während Parkmanöver ändern",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 26,
    "status": "historical",
    "note": "PDC-/Radio-Variante erforderlich"
  },
  {
    "id": "ref-mqb-009",
    "title": "Einparkhilfe: akustische Frequenz vorn und hinten einstellen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 27,
    "status": "historical",
    "note": "PDC-Steuergerät mit Anpassungskanälen"
  },
  {
    "id": "ref-mqb-010",
    "title": "Einparkhilfe: optischen Bordsteinabstand anpassen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 27,
    "status": "historical",
    "note": "Nur geeignete PDC-Software und Anzeige"
  },
  {
    "id": "ref-mqb-011",
    "title": "Frontscheibenwischer: Wischtempo der Stufen konfigurieren",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 31,
    "status": "historical",
    "note": "Regenwischer-/BCM-Ausstattung prüfen"
  },
  {
    "id": "ref-mqb-012",
    "title": "Fensterheber nach dem Öffnen der Tür weiter freigeben",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 31,
    "status": "historical",
    "note": "Steuergerätegeneration und Komfortsystem prüfen"
  },
  {
    "id": "ref-mqb-013",
    "title": "Kessy: automatisches Verriegeln beim Türschließen konfigurieren",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 36,
    "status": "historical",
    "note": "Unterschied zwischen 3Q0- und 5Q0-Kessy-Steuergeräten"
  },
  {
    "id": "ref-mqb-014",
    "title": "Kessy: Komfortöffnen über Türsensoren konfigurieren",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 37,
    "status": "historical",
    "note": "Keyless-Sensoren und Zugangssystem vorhanden"
  },
  {
    "id": "ref-mqb-015",
    "title": "Klimaanlage: Luftgütefunktion Air Care aktivieren",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 38,
    "status": "historical",
    "note": "Passende Climatronic sowie Sensorausstattung"
  },
  {
    "id": "ref-mqb-016",
    "title": "Klimaanlage: Innenraumfeuchtigkeitssensor einstellen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 38,
    "status": "historical",
    "note": "Nur bei verbautem Feuchtigkeitssensor"
  },
  {
    "id": "ref-mqb-017",
    "title": "Sitzheizung: Temperatur pro Stufe anpassen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 56,
    "status": "historical",
    "note": "Klima-/Sitzsteuergerät muss Funktion unterstützen"
  },
  {
    "id": "ref-mqb-018",
    "title": "Fensterheber: Nachlaufzeit nach Zündung aus anpassen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 31,
    "status": "historical",
    "note": "Komfortsteuergerät erforderlich"
  },
  {
    "id": "ref-mqb-019",
    "title": "Kombiinstrument: Skala und Instrumentenansicht verändern",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 40,
    "status": "historical",
    "note": "Nur unterstützte Digital-Cockpit-/AID-Software"
  },
  {
    "id": "ref-mqb-020",
    "title": "DWA: Blink- und akustische Rückmeldung anpassen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 25,
    "status": "historical",
    "note": "DWA und zulässige Rückmeldeart vorausgesetzt"
  },
  {
    "id": "ref-mqb-021",
    "title": "Komforteinstieg bei elektrischen Sitzen einblenden",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 55,
    "status": "historical",
    "note": "Memory-Sitze und Infotainment-Menüausstattung erforderlich"
  },
  {
    "id": "ref-mqb-022",
    "title": "Spiegel-Umfeldlicht bei angeklappten Spiegeln aktiv lassen",
    "category": "Codierungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 58,
    "status": "historical",
    "note": "Türsteuergeräte und Umfeldbeleuchtung erforderlich"
  },
  {
    "id": "ref-mqb-023",
    "title": "Front Assist: Vorwarnzeitpunkt im Menü anpassbar",
    "category": "Assistenzsysteme",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 30,
    "status": "historical",
    "note": "Vorhandene Frontkamera/Radar und zugelassener Funktionsumfang"
  },
  {
    "id": "ref-mqb-024",
    "title": "Front Assist: gewählte Vorwarnstufe beim Start behalten",
    "category": "Assistenzsysteme",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 30,
    "status": "historical",
    "note": "Passende Generation der Front-Assist-Steuerung"
  },
  {
    "id": "ref-mqb-025",
    "title": "Fernlichtassistent: Stadterkennung individuell konfigurieren",
    "category": "Assistenzsysteme",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 29,
    "status": "historical",
    "note": "Frontkamera und geeignete Assistenzsoftware"
  },
  {
    "id": "ref-mqb-026",
    "title": "Fernlichtassistent: Aktivierungsverhalten nach Neustart anpassen",
    "category": "Assistenzsysteme",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 29,
    "status": "historical",
    "note": "Nur vorhandener Light Assist, Softwarestand prüfen"
  },
  {
    "id": "ref-mqb-027",
    "title": "Diebstahlwarnanlage mit Originalsensoren nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 24,
    "status": "historical",
    "note": "Sirene, Innenraumüberwachung und BCM-Anbindung erforderlich"
  },
  {
    "id": "ref-mqb-028",
    "title": "Mehrfarbige Fußraum-LED-Beleuchtung nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 32,
    "status": "historical",
    "note": "LED-LIN-Module und geeignete BCM-Steuerung"
  },
  {
    "id": "ref-mqb-029",
    "title": "Originale Fußraumbeleuchtung vorn einbauen und freischalten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 31,
    "status": "historical",
    "note": "Passende Leuchte, Kabelsatz und Bordnetzvariante"
  },
  {
    "id": "ref-mqb-030",
    "title": "Nebelscheinwerfer samt Abbiegelicht nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 47,
    "status": "historical",
    "note": "Schalter, Kabelsatz, Leuchten und BCM-Anpassung nötig"
  },
  {
    "id": "ref-mqb-031",
    "title": "Indirekte Reifendruckkontrolle über ABS nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 52,
    "status": "historical",
    "note": "ABS-Variante und Anzeige-/Tasterhardware prüfen"
  },
  {
    "id": "ref-mqb-032",
    "title": "Rückfahrkamera Low mit Infotainment-Anbindung nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 53,
    "status": "historical",
    "note": "Kamera, passende Videoeingänge und Codierung"
  },
  {
    "id": "ref-mqb-033",
    "title": "Licht- und Regensensor mit AUTO-Licht nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 43,
    "status": "historical",
    "note": "Spiegel- und Frontscheibenaufnahme sowie BCM prüfen"
  },
  {
    "id": "ref-mqb-034",
    "title": "Fernlichtassistent mit kompatibler Frontkamera nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 28,
    "status": "historical",
    "note": "Kamera, Fernlichtsystem und Kalibrierung/ggf. Freigabe erforderlich"
  },
  {
    "id": "ref-mqb-035",
    "title": "Nebelscheinwerfer beim Octavia 5E auf LED-Ausführung umrüsten",
    "category": "Umbauten",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 48,
    "status": "historical",
    "note": "Nur Octavia 3 5E, Originalleuchten und vorgeschriebene Zulassung prüfen",
    "modelScope": "octavia5e"
  },
  {
    "id": "ref-mqb-036",
    "title": "Glühlampen-Fußraumleuchten auf LED umrüsten",
    "category": "Umbauten",
    "scope": "mqb",
    "sourceName": "MQB Codierungen (Daniel Fuchs, 2020)",
    "sourcePage": 32,
    "status": "historical",
    "note": "Leuchtentyp und BCM-Lampendiagnose auf LED prüfen"
  },
  {
    "id": "ref-mlbevo-001",
    "title": "Abblendlicht: Reisemodus im Infotainment anbieten",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 7,
    "status": "historical",
    "note": "Lichtsteuergerät und passende Scheinwerfer erforderlich"
  },
  {
    "id": "ref-mlbevo-002",
    "title": "ACC-Abstandsauswahl im Infotainment konfigurieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 7,
    "status": "historical",
    "note": "Nur mit vorhandenem ACC und Infotainment-Unterstützung"
  },
  {
    "id": "ref-mlbevo-003",
    "title": "ACC: Fahrprofilanbindung der Abstandregelung konfigurieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 7,
    "status": "historical",
    "note": "Werksseitiges ACC und Drive-Select-/MMI-Ausführung"
  },
  {
    "id": "ref-mlbevo-004",
    "title": "Einparkhilfe: doppelte Kamera-/Parkansicht im MMI aktivieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 11,
    "status": "historical",
    "note": "Area View muss vollständig vorhanden sein"
  },
  {
    "id": "ref-mlbevo-005",
    "title": "Parkhilfetöne und Audioabsenkung einstellen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 12,
    "status": "historical",
    "note": "PDC/Infotainment mit entsprechenden Anpassungskanälen"
  },
  {
    "id": "ref-mlbevo-006",
    "title": "Parkhilfe bei niedriger Vorwärtsgeschwindigkeit automatisch aktivieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 12,
    "status": "historical",
    "note": "Nur mit vorhandener Einparkhilfe"
  },
  {
    "id": "ref-mlbevo-007",
    "title": "Anzeige von AdBlue-Informationen im MMI ergänzen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 13,
    "status": "historical",
    "note": "Nur geeignete Diesel-Fahrzeuge und MMI-Software"
  },
  {
    "id": "ref-mlbevo-008",
    "title": "MMI-Begrüßungsakustik ändern",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 14,
    "status": "historical",
    "note": "Infotainment mit unterstütztem Audi-Soundschema"
  },
  {
    "id": "ref-mlbevo-009",
    "title": "Zwei Telefone gleichzeitig über Bluetooth betreiben",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 15,
    "status": "historical",
    "note": "Telefonmodul/Softwarelizenz prüfen"
  },
  {
    "id": "ref-mlbevo-010",
    "title": "Digital Cockpit: G-Meter hinzufügen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 17,
    "status": "historical",
    "note": "Virtual Cockpit mit kompatibler Anzeige"
  },
  {
    "id": "ref-mlbevo-011",
    "title": "Digital Cockpit: Beschleunigungswerte anzeigen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 17,
    "status": "historical",
    "note": "Unterstützte Instrumentensoftware erforderlich"
  },
  {
    "id": "ref-mlbevo-012",
    "title": "DSG: Ganginformationen im Digital Cockpit darstellen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 17,
    "status": "historical",
    "note": "Automatikgetriebe und digitales Kombiinstrument"
  },
  {
    "id": "ref-mlbevo-013",
    "title": "Digital Cockpit: Nachtankvolumen anzeigen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 18,
    "status": "historical",
    "note": "Unterstützte Anzeige-Software"
  },
  {
    "id": "ref-mlbevo-014",
    "title": "Digital Cockpit: Startdarstellung auswählen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 18,
    "status": "historical",
    "note": "Nur mit passendem Virtual Cockpit"
  },
  {
    "id": "ref-mlbevo-015",
    "title": "Automatisches Welcome-Light bei Annäherung konfigurieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 19,
    "status": "historical",
    "note": "Lichtpaket und Keyless-Ausstattung prüfen"
  },
  {
    "id": "ref-mlbevo-016",
    "title": "Multifunktionslenkrad-Favoritentaste belegen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 20,
    "status": "historical",
    "note": "Passende Lenkrad-/MMI-Ausführung"
  },
  {
    "id": "ref-mlbevo-017",
    "title": "Lichtinszenierung originaler LED-Rückleuchten konfigurieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 20,
    "status": "historical",
    "note": "LED-Scheinwerfer-/Rückleuchtenpaket und Zulassung beachten"
  },
  {
    "id": "ref-mlbevo-018",
    "title": "Sitzeinstellungen dem Funkschlüssel zuordnen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 22,
    "status": "historical",
    "note": "Elektrische Memory-Sitze und Komfortsteuergerät"
  },
  {
    "id": "ref-mlbevo-019",
    "title": "Komforteinstieg für elektrische Sitze aktivieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 22,
    "status": "historical",
    "note": "Nur bei passenden elektrisch verstellbaren Sitzen"
  },
  {
    "id": "ref-mlbevo-020",
    "title": "Sitzlüftung: Intensität der Lüftungsstufen justieren",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 23,
    "status": "historical",
    "note": "Werkseitige Sitzbelüftung vorausgesetzt"
  },
  {
    "id": "ref-mlbevo-021",
    "title": "Standheizung: Nachheizphase verändern",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 25,
    "status": "historical",
    "note": "Werkseitige Standheizung erforderlich"
  },
  {
    "id": "ref-mlbevo-022",
    "title": "Tagfahrlicht: Leuchtstärke beim Blinken anpassen",
    "category": "Codierungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 26,
    "status": "historical",
    "note": "Scheinwerfertyp und StVZO-konforme Umsetzung"
  },
  {
    "id": "ref-mlbevo-023",
    "title": "Fernlichtassistent: vorhandene Kamera freischalten",
    "category": "Assistenzsysteme",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 12,
    "status": "historical",
    "note": "Frontkamera und kompatible Scheinwerfer, ggf. Lizenzen"
  },
  {
    "id": "ref-mlbevo-024",
    "title": "Spurhalteassistent: Aktivierungsberechtigung prüfen",
    "category": "Assistenzsysteme",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 23,
    "status": "historical",
    "note": "Frontkamera/Lenkung und rechtmäßige Funktionslizenz"
  },
  {
    "id": "ref-mlbevo-025",
    "title": "Verkehrszeichenerkennung auf geeigneten Fahrzeugen aktivieren",
    "category": "Assistenzsysteme",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 26,
    "status": "historical",
    "note": "Frontkamera, Navigationsdaten, FEC/SWaP prüfen"
  },
  {
    "id": "ref-mlbevo-026",
    "title": "Traffic Jam Assist bei kompatibler ACC-Kamera-Kombination",
    "category": "Assistenzsysteme",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 25,
    "status": "historical",
    "note": "ACC, Kamerageneration, Automatik und Freigabe erforderlich"
  },
  {
    "id": "ref-mlbevo-027",
    "title": "Originale Anhängerkupplung in Fahrzeugsteuergeräte integrieren",
    "category": "Nachrüstungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 7,
    "status": "historical",
    "note": "Erst bei vollständig eingebautem Anhängersteuergerät, geprüfter Elektrik und passender AHK"
  },
  {
    "id": "ref-mlbevo-028",
    "title": "Anhänger-Rangierassistent mit Kamera und Sensorik nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 8,
    "status": "historical",
    "note": "Area View und 12 Parksensoren laut Dokument vorausgesetzt"
  },
  {
    "id": "ref-mlbevo-029",
    "title": "Garagentoröffner im Fahrzeug mit passender Hardware nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 12,
    "status": "historical",
    "note": "UGDO-/HomeLink-Hardware und Sendekompatibilität"
  },
  {
    "id": "ref-mlbevo-030",
    "title": "Intelligenten Parkassistenten mit Sensorik und Steuergeräten nachrüsten",
    "category": "Nachrüstungen",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 15,
    "status": "historical",
    "note": "Benötigt passende Parksteuerung, Rad-/Lenk-/Kamerasysteme und Freigaben"
  },
  {
    "id": "ref-mlbevo-031",
    "title": "Allwetterlicht zur statischen Abbiegelicht-Funktion umkonfigurieren",
    "category": "Umbauten",
    "scope": "mlbevo",
    "sourceName": "MLBevo Codierungen (Daniel Fuchs, 2021)",
    "sourcePage": 7,
    "status": "historical",
    "note": "Funktionsumwidmung: Allwettermodus danach nicht mehr separat verfügbar"
  }
];

export function referenceIdeasForVehicle(vehicle: Vehicle): ReferenceIdea[] {
  return referenceIdeas.filter((idea) => {
    if (idea.modelScope === "octavia5e" && !["Octavia 3 5E","Octavia 3 5E Facelift"].includes(vehicle.model)) return false;
    if (idea.modelScope === "vw-mqb" && vehicle.brand !== "Volkswagen") return false;
    if (idea.scope === "golf8") return vehicle.model === "Golf 8 (CD)";
    if (idea.scope === "mqb") return mqbReferenceModels.has(vehicle.model);
    return mlbevoReferenceModels.has(vehicle.model);
  });
}
