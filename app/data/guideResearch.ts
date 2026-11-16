// Kuratierte Recherche zu fahrzeugspezifischen Nachrüstungen und Umbauten.
// Es handelt sich um Verweise auf Fremdquellen, nicht um eigene TD-PDF-Anleitungen.
// Vollständige Anleitungen Dritter dürfen nicht als eigene Download-Produkte angeboten werden.
export type ResearchCategory = "Nachrüstungen" | "Umbauten";
export type InstructionAccess = "öffentlich" | "Vorschau / Kauf" | "beim Nachrüstsatz" | "Produktinformation" | "Anbieterleistung";

export type ResearchGuide = {
  id: string;
  title: string;
  category: ResearchCategory;
  models: readonly string[];
  sourceUrl: string;
  sourceName: string;
  access: InstructionAccess;
  note: string;
  /** Recherchegruppe für umfangreichere Umbauten. */
  topic?: "Scheinwerfer & Licht" | "ACC & pACC" | "Lenkrad & Bedienung" | "Cockpit & Infotainment";
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
  // Intensive, quellenbasierte Umbau-Recherche vom 16.11.2026. Keine frei nutzbaren Drittanbieter-PDFs.
  {
    "id": "golf7-bixenon-umbau",
    "title": "Golf 7: Halogen auf originale Bi-Xenon-Scheinwerfer umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-adapter-bi-xenonscheinwerfer-fuer-vw-golf-7-polo-6c/39892-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Adapter allein reicht nicht: BCM prüfen/ersetzen, aLWR und erforderliche Scheinwerferreinigung; zulässige Inbetriebnahme und Codierung"
  },
  {
    "id": "golf7-alwr-umruestung",
    "title": "Golf 7: automatische Leuchtweitenregulierung für Xenon/LED nachrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Golf 7 (5G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-alwr-komplettset-fuer-vw-golf-7-vii/39934-7",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "aLWR-Steuergerät, Achssensoren und Adapter je Fahrwerk; Bestandteil einer fachgerechten Scheinwerferumrüstung"
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
    "id": "passatb8-halogen-led",
    "title": "Passat B8: originale LED-Scheinwerfer statt Halogen nachrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-led-scheinwerfer-mit-led-tagfahrlicht-tfl-fuer-vw-passat-b8/41670",
    "sourceName": "KUFATEC",
    "access": "Produktinformation",
    "note": "Nur Produktinformationen: kein Herstellerleitfaden verfügbar; aLWR/SRA, Gateway/BCM und passende Scheinwerfervariante zusätzlich prüfen"
  },
  {
    "id": "passatb8-led-kurvenlicht",
    "title": "Passat B8: LED-Scheinwerfer auf Kurvenlicht/variable Lichtverteilung umbauen",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-adapter-led-auf-led-mit-kurvenlicht-fuer-vw-passat-b8/42225",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur bei vorhandenen LED-Scheinwerfern PR 8IT; LED Kurvenlicht PR 8IU erfordert anderes aLWR-Steuergerät"
  },
  {
    "id": "passatb8-led-matrix",
    "title": "Passat B8 Facelift: LED auf Matrix-LED umrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Passat B8 (3G)"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-codierdongle-led-scheinwerfer-fuer-vw-passat-b8/42205",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Produkt ist nur die abschließende Codierhilfe, kein Komplettumbau; Matrix erst ab MJ 2020 und nur mit kompatibler Frontkamera QK1"
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
    "id": "a4-8w-led-matrix",
    "title": "Audi A4 B9: LED-Scheinwerfer auf Matrix-LED umbauen",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "A4 / S4 B9"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-adapter-led-matrix-scheinwerfer-fuer-audi-a4-8w-a5-f5-q5-fy/47865",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur mit Frontkamera QK1; andere Varianten vor/ab MJ 2020; Steuerteilparametrierung, Codierdongle und Scheinwerferkalibrierung erforderlich"
  },
  {
    "id": "a5-q5-led-matrix",
    "title": "Audi A5 F5 / Q5 FY: LED auf Matrix-LED umbauen",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "A5 / S5 F5",
      "Q5 FY"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-adapter-led-matrix-scheinwerfer-fuer-audi-a4-8w-a5-f5-q5-fy/47865",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Adapter ist kein Komplettsatz; QK1, Scheinwerfersteuergeräte, Kalibrierung und abweichende Modelljahresgrenzen prüfen"
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
    "id": "octavia5e-alwr",
    "title": "Škoda Octavia 5E: Xenon/LED mit automatischer Leuchtweitenregulierung nachrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "Octavia 3 5E",
      "Octavia 3 5E Facelift"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-alwr-komplettset-fuer-skoda-octavia-5e/42280",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Ausführung nach Hinterachse/Antrieb/DCC; Gateway-/BCM-Kompatibilität, SRA und Diagnosecodierung beachten"
  },
  {
    "id": "leon5f-alwr",
    "title": "SEAT Leon 5F Facelift: aLWR für LED-Scheinwerfer nachrüsten",
    "category": "Umbauten",
    "topic": "Scheinwerfer & Licht",
    "models": [
      "SEAT Leon 5F"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-komplettset-automatische-leuchtweitenregulierung-alwr-fuer-seat-leon-5f/50210-1",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Nur Facelift ab MJ 2017 und nur LED; Hinterachse/DCC, Gateway und Codierdongle prüfen"
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
    "id": "mqb-pacc-aufwertung",
    "title": "MQB: vorhandenes ACC auf pACC erweitern (Herstellerangebot)",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Golf 7 (5G)",
      "Passat B8 (3G)",
      "Tiguan II (AD/BW)",
      "Arteon 3H",
      "Polo AW",
      "Touran 5T",
      "T-Roc A11",
      "Transporter / Multivan T6.1",
      "A1 GB",
      "A3 / S3 8V",
      "Q2 GA",
      "Q3 F3",
      "Octavia 3 5E",
      "Octavia 3 5E Facelift",
      "Superb 3V",
      "Karoq NU",
      "Kodiaq NS",
      "Kamiq NW",
      "Scala NW",
      "SEAT Leon 5F",
      "SEAT Ateca KH7",
      "SEAT Ibiza KJ",
      "SEAT Arona KJ7",
      "SEAT Tarraco KN2"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-acc-option-praediktive-regelung-fuer-mqb/44365-m",
    "sourceName": "KUFATEC",
    "access": "Anbieterleistung",
    "note": "Software-/Remote-Freigabe, keine freie Schrittanleitung; ACC, kompatible Navigation, Kamera, Radar/FEC und PR-Codes vor Bestellung per FIN prüfen"
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
    "id": "mqb-acc-komplett-kabel",
    "title": "MQB: fehlende Radarhardware und Steuergeräte für ACC nachrüsten",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Golf 7 (5G)",
      "A3 / S3 8V",
      "Octavia 3 5E",
      "Octavia 3 5E Facelift",
      "SEAT Leon 5F"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-kabelsatz-automatische-distanzregelung-acc-mqb/40720",
    "sourceName": "KUFATEC",
    "access": "Vorschau / Kauf",
    "note": "Dies ist nur ein ACC-Kabelsatz für Fahrzeuge ohne Front Assist PR 6K0; zusätzlich Radar, Bedienung, Halter, Online-Freigabe und Kalibrierung nötig"
  },
  {
    "id": "mqb-acc-210",
    "title": "MQB: vorhandenes ACC 160 km/h auf 210 km/h erweitern",
    "category": "Umbauten",
    "topic": "ACC & pACC",
    "models": [
      "Golf 7 (5G)",
      "Passat B8 (3G)",
      "Tiguan II (AD/BW)",
      "T-Roc A11",
      "Touran 5T",
      "A3 / S3 8V",
      "Octavia 3 5E",
      "Octavia 3 5E Facelift",
      "Superb 3V",
      "Karoq NU",
      "Kodiaq NS",
      "SEAT Leon 5F"
    ],
    "sourceUrl": "https://kufatec.com/de/kufatec-acc-option-210-km-h-fuer-mqb/44175",
    "sourceName": "KUFATEC",
    "access": "Anbieterleistung",
    "note": "Nur für Fahrzeuge mit bestehendem ACC bis 160 km/h (PR 6K3); Radargeneration, Herstellerfreigabe und ADAS-Prüfung nötig"
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
      "Octavia 3 5E",
      "Octavia 3 5E Facelift",
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
