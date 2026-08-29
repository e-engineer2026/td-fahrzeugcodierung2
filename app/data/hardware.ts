// Konservative Hardware-Hinweise für den Buchungskatalog.
// Nur dann wird eine Voraussetzung ausgegeben, wenn die Funktion typischerweise
// von vorhandener Fahrzeughardware abhängt. Die endgültige Machbarkeit bleibt
// fahrzeug-, steuergeräte- und softwareabhängig.

export function hardwareForName(name:string):string|undefined {
  const n=name.toLowerCase();

  // Fahrerassistenz
  if(n.includes("verkehrszeichen")) return "Frontkamera/Fahrerassistenzkamera sowie kompatibles Kombiinstrument und Infotainment erforderlich.";
  if(n.includes("lane assist")) return "Frontkamera/Fahrerassistenzkamera und kompatible Lenkungs-/Assistenzsteuergeräte erforderlich.";
  if(n.includes("fernlichtassistent")) return "Geeignete Frontkamera bzw. Fernlichtassistenz-Sensorik und kompatible Lichtsteuerung erforderlich.";
  if(n.includes("acc ") || n.startsWith("acc")) return "ACC-Radarsensor und kompatible Fahrerassistenz-/Gateway-Hardware erforderlich.";
  if(n.includes("effizienzassistent")) return "Kompatible ACC-/Navigations-/Fahrerassistenz-Hardware erforderlich.";
  if(n.includes("surround-view") || n.includes("dual view")) return "Werksseitige 360°-/Surround-View-Kameras und kompatibles Kamerasteuergerät erforderlich.";

  // Parken / Kamera
  if(n.includes("rückfahrkamera")) return "Rückfahrkamera, Verkabelung und kompatibles Infotainment/Kamerasteuergerät erforderlich.";
  if(n.includes("optische anzeige der einparkhilfe") || n.includes("einparkhilfe")) return "Vorhandene PDC-Sensoren und kompatibles Einparkhilfe-Steuergerät erforderlich.";
  if(n.includes("anhängerkupplung")) return "Anhängerkupplung mit kompatiblem Anhängersteuergerät/Gateway-Anbindung erforderlich.";

  // Spiegel / Komfort
  if(n.includes("elektrisch anklappbare spiegel") || n.includes("spiegelanklappen")) return "Elektrisch anklappbare Außenspiegel und kompatible Türsteuergeräte erforderlich.";
  if(n.includes("spiegelabsenkung") || n.includes("bordsteinautomatik")) return "Kompatible Beifahrerspiegel-/Türsteuergeräte; je nach Fahrzeug Spiegelpositionsspeicher erforderlich.";
  if(n.includes("elektrische heckklappe") || n.includes("heckklappe per") || n.includes("innentaster")) return "Elektrische Heckklappenbetätigung und kompatibles Heckklappensteuergerät erforderlich.";
  if(n.includes("easy entry")) return "Elektrisch verstellbarer Sitz bzw. kompatibles Sitz-/Komfortsteuergerät erforderlich.";
  if(n.includes("sitzheizung")) return "Werksseitige Sitzheizung und kompatibles Klima-/Sitzsteuergerät erforderlich.";
  if(n.includes("regenschliessen")) return "Regen-/Lichtsensor und kompatibles Bordnetz-/Komfortsteuergerät erforderlich.";
  if(n.includes("akustische quittierung") || n.includes("hornquittierung")) return "DWA/Alarmhorn oder eine vom Fahrzeug unterstützte akustische Verriegelungsquittierung erforderlich.";

  // Licht
  if(n.includes("abbiegelicht über nebelscheinwerfer")) return "Nebelscheinwerfer und kompatibles Bordnetz-/Lichtsteuergerät erforderlich.";
  if(n.includes("led-rückleuchten")) return "Entsprechende LED-Rückleuchten und kompatibles Bordnetzsteuergerät erforderlich.";
  if(n.includes("fussraumleuchten auf led")) return "Vorhandene Fußraumleuchten; LED-Leuchtmittel bzw. LED-Umrüstung erforderlich.";
  if(n.includes("fussraumbeleuchtung")) return "Vorhandene Fußraumbeleuchtung und kompatibles Bordnetz-/Komfortsteuergerät erforderlich.";
  if(n.includes("ambientebeleuchtung")) return "Vorhandene Ambientebeleuchtungs-Hardware/LED-Module; Umfang abhängig von Ausstattung und Steuergeräten.";
  if(n.includes("scheinwerferreinigungsanlage")) return "Werksseitige Scheinwerferreinigungsanlage erforderlich.";
  if(n.includes("coming home") || n.includes("leaving home")) return "Kompatibles Bordnetz-/Lichtsteuergerät; für automatische Varianten meist Regen-/Lichtsensor erforderlich.";

  // Infotainment / Anzeige
  if(n.includes("wireless carplay") || n.includes("carplay / android auto")) return "Kompatible MIB/MMI-Hardware mit WLAN sowie unterstützte USB-/App-Connect-Schnittstelle erforderlich.";
  if(n.includes("hidden menu") || n.includes("developer mode") || n.includes("green menu")) return "Kompatibles MMI/MIB-Infotainmentsystem erforderlich.";
  if(n.includes("fahrschulmodus") || n.includes("offroad-anzeige") || n.includes("kompass im mmi")) return "Kompatibles Infotainment mit unterstützter Software-/Menüvariante erforderlich.";
  if(n.includes("startlogo") || n.includes("virtual cockpit") || n.includes("sportlayout") || n.includes("rs-ansicht") || n.includes("skin der multifunktionsanzeige")) return "Kompatibles Kombiinstrument/Virtual Cockpit mit unterstütztem Softwarestand erforderlich.";
  if(n.includes("batterieanzeige im mmi") || n.includes("ölstandanzeige im mmi")) return "Kompatibles MMI und entsprechende Fahrzeug-/Sensordaten müssen verfügbar sein.";

  // Fahrdynamik / Fahrwerk
  if(n.includes("drive select") || n.includes("fahrprofilauswahl")) return "Kompatible Motor-/Lenkungs-/Gateway-Steuergeräte; für Menüanzeige zusätzlich unterstütztes Infotainment erforderlich.";
  if(n.includes("soundaktor")) return "Werksseitiger Soundaktor und kompatibles Steuergerät erforderlich.";
  if(n.includes("xds")) return "Kompatibles ABS/ESC-Steuergerät mit XDS-Unterstützung erforderlich.";
  if(n.includes("berganfahrassistent")) return "Kompatibles ABS/ESC-Steuergerät erforderlich.";
  if(n.includes("bremsscheibentrocknung")) return "Kompatibles ABS/ESC-Steuergerät erforderlich.";
  if(n.includes("esc sport") || n.includes("asr off")) return "Kompatibles ABS/ESC-Steuergerät erforderlich.";
  if(n.includes("lenkungskennlinie")) return "Kompatible elektromechanische Lenkung/Lenkhilfe erforderlich.";
  if(n.includes("luftfahrwerk") || n.includes("niveauanzeige") || n.includes("lift-funktion")) return "Werksseitiges Luftfahrwerk mit Niveauregelung erforderlich.";

  // Reifendruck / Batterie / Start-Stopp
  if(n.includes("reifendruckkontrolle über abs")) return "Kompatibles ABS/ESC-Steuergerät für indirekte Reifendruckkontrolle erforderlich; keine Radsensoren nötig.";
  if(n.includes("reifendruckkontrolle im infotainment")) return "Kompatibles Reifendruck-/ABS-System und unterstütztes Infotainment erforderlich.";
  if(n.includes("reifendruckkontrolle aktivieren")) return "Kompatibles Reifendruck- bzw. ABS/ESC-System erforderlich; Systemart fahrzeugabhängig.";
  if(n.includes("batterie nach") || n.includes("batterie anlernen")) return "Fahrzeug mit Batteriemanagement/Energiemanagement und kompatiblem Gateway erforderlich.";
  if(n.includes("start-stopp")) return "Werksseitiges Start-Stopp-System und kompatibles Motor-/Energiemanagement erforderlich.";

  return undefined;
}
