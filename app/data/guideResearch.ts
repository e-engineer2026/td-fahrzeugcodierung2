// Kuratierte Recherche zu fahrzeugspezifischen Nachrüstungen und Umbauten.
// Es handelt sich um Verweise auf Fremdquellen, nicht um eigene TD-PDF-Anleitungen.
// Vollständige Anleitungen Dritter dürfen nicht als eigene Download-Produkte angeboten werden.
export type ResearchCategory = "Nachrüstungen" | "Umbauten";
export type InstructionAccess = "öffentlich" | "Vorschau / Kauf" | "beim Nachrüstsatz";

export type ResearchGuide = {
  id: string;
  title: string;
  category: ResearchCategory;
  models: readonly string[];
  sourceUrl: string;
  sourceName: string;
  access: InstructionAccess;
  note: string;
};

const golf7 = ["Golf 7 (5G)"];
const octavia5e = ["Octavia 3 5E", "Octavia 3 5E Facelift"];
const leonKL = ["SEAT Leon KL", "CUPRA Leon KL"];

export const researchedGuides: readonly ResearchGuide[] = [
  // Nachrüstungen
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
    title: "Multifunktionstasten am Lenkrad nachrüsten",
    category: "Nachrüstungen",
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
