/**
 * Konservative Anzeige des für den vollständigen Arbeitsschritt geeigneten
 * Diagnosewerkzeugs. Eine konkrete Freigabe ist ohne FIN, Steuergeräte-Teilenummer,
 * Softwarestand, PR-Codes und Lizenzstatus nicht nachweisbar.
 *
 * WICHTIG: Codieren mit VCDS ersetzt weder ZDC-/ODX-Parametrierung noch
 * SVM/FEC/SWaP, Komponentenschutz oder FAZIT/GeKo-Inbetriebnahme.
 */
export type GuideInterfaceResult = {
  label: string;
  qualification: string;
  requiresCheck: boolean;
  sfdNotice?: string;
};

type InterfaceInput = {
  title: string;
  note?: string;
  interfaceInfo?: string;
  activation?: string;
  platform?: string;
  vehicleBrand?: string;
  vehicleYear?: number;
  vehicleEndYear?: number;
  sfd1From?: number;
  id?: string;
  category?: string;
  /** Herkunft bestimmt, ob vorhandene Codierdaten oder ungeprüfte Recherche vorliegen. */
  source?: "catalog" | "research" | "reference";
};

const result = (label: string, qualification: string, requiresCheck = true): GuideInterfaceResult =>
  ({ label, qualification, requiresCheck });

export function guideInterface(input: InterfaceInput): GuideInterfaceResult {
  const title = input.title.toLocaleLowerCase("de");
  const note = [input.note ?? "", input.activation ?? ""].join(" ").toLocaleLowerCase("de");
  const hint = (input.interfaceInfo ?? "").toLocaleLowerCase("de");
  const combined = title + " " + note;
  // Gemischte Baureihen nicht allein wegen ihres Endjahres als SFD2 einstufen.
  const modern = (input.vehicleYear ?? 0) >= 2024;
  const sfd2 = /sfd2|unece|r155|r156|fod.shop|digital signier|kryptograf/i.test(combined);
  // Nur die im Modellkatalog dokumentierten Einstiegsjahre verwenden.
  // Das Vorhandensein von SFD1 heißt nicht, dass jedes Steuergerät gesperrt ist.
  const sfdStart = input.sfd1From;
  const sfdNotice = typeof sfdStart === "number" && sfdStart >= 2019
    ? `SFD1 nur bei geschützten Steuergeräten ab Baujahr ${sfdStart}${sfdStart === 2019 ? " (Golf 8: Modelljahr 2020)" : ""}; VCDS-Online-Freischaltung ab Version 26.9 mit registriertem HEX-V2/HEX-NET und Ross-Tech-SFD-Service. Ab Modelljahr 2024 ggf. zusätzlich SFD2.`
    : undefined;
  const withSfd = (label: string, qualification: string, requiresCheck = true): GuideInterfaceResult => {
    const entry = result(label, qualification, requiresCheck);
    return sfdNotice && label !== "Nicht erforderlich" && !sfd2
      ? { ...entry, sfdNotice }
      : entry;
  };

  // Ein codierfreier Umbau erfordert kein Diagnoseinterface.
  if (/(?:keine|ohne) (?:zusätzliche )?codierung(?: erforderlich)?\b|laut (?:quelle|anbieter) ohne codierung/.test(note) ||
      /subwoofergehäuse modifizieren|45.watt.usb.ladeanschlüsse/.test(title)) {
    return withSfd("Nicht erforderlich", "Für den beschriebenen Arbeitsschritt ist keine Codierung angegeben.", false);
  }

  // FAZIT/GeKo ist kein Ersatz für ein klassisches VCDS-Login.
  if (/wegfahrsperre|komponentenschutz|(^|[^a-z])immo[345]?\b|schlüssel.*anlernen|(?:aid|virtual cockpit|kombiinstrument|tacho).*tausch/.test(combined) &&
      !/nur.*(?:anpassung|einstellung).*komponentenschutz/.test(combined)) {
    return withSfd("ODIS Service (Online)", "Für Komponentenschutz/Wegfahrsperre ist die passende FAZIT-/GeKo-Berechtigung erforderlich. VCDS/VCP allein reichen nicht.");
  }
  if (/ge[kc]o|\bfazit\b/.test(combined)) {
    return /freischalten|freigeben|online anlernen|berechtigtem ge[kc]o|ge[kc]o.zugang nötig|ge[kc]o erforderlich/.test(note)
      ? result("ODIS Service (Online)", "Herstellerseitige Online-Berechtigung für die genannte Inbetriebnahme erforderlich.")
      : result("Herstellerfreigabe prüfen", "GeKo-/SFD-Status ist nur als Prüfthema genannt. Das tatsächlich benötigte Verfahren ist noch nicht bestätigt.");
  }

  if (sfd2) {
    return withSfd("Herstellerfreigabe prüfen", "SFD2/UNECE kann signierte Herstellermaßnahmen erfordern. VCDS/VCP allein sind für die vollständige Aktivierung nicht freigegeben.");
  }

  // Beim Audi auf MLB-/MLB-evo-Basis ist für eine erstmalige VZE-
  // Aktivierung häufig ein VCP-Kameradatensatz erforderlich. Eine
  // vorhandene Parametrierung kann reine VCDS-/VCP-Codierung erlauben.
  // SFD2 und ausdrücklich herstellergebundene Online-Freigaben bleiben separat.
  const audiVzeActivation = input.vehicleBrand === "Audi" &&
    /^(?:MLB|MLBevo)$/.test(input.platform ?? "") &&
    /verkehrszeichenerkennung|verkehrszeichen.*(?:aktivier|freischalt|erkenn|anzeig)|\bvze\b|sign.assist/.test(title) &&
    !/(?:nur|lediglich).*(?:einstell|anzeig|anpass)|(?:warn|anzeige).*anpassen/.test(title);
  if (audiVzeActivation && !/\bsvm\b|herstellerseitige.online.freigabe|online.inbetriebnahme/.test(note)) {
    return withSfd("VCP",
      "Bei der erstmaligen Aktivierung wird die Frontkamera häufig mit VCP und einem passenden Datensatz parametriert. VCDS allein kann diesen Schritt nicht ersetzen. Bereits passend parametrierte Kameras können eine reine VCDS-/VCP-Codierung zulassen. Kamera, Navigation, Softwarestand sowie gegebenenfalls FEC-/SWaP-Freigaben prüfen.");
  }

  // Recherchierte, funktionsspezifische Verfahren.
  // OEM SWaP/FoD: https://www.volkswagen-genuine-accessories.com/de/de/c/kommunikation/aktivierungsdokumente-swap/160988445/
  // App-Connect: https://www.volkswagen.de/de/besitzer-und-service/volkswagen-online-shop.html
  // AHK: https://wiki.ross-tech.com/wiki/index.php/Trailer_Hitch_Retrofitting_%281K%29
  // QQ2: https://www.audiworld.com/forums/a4-b9-platform-discussion-212/retrofitted-ambient-lightning-just-like-extended-led-interior-lighting-pack-2905608/page11/
  // Fahrwerk: https://wiki.ross-tech.com/wiki/index.php/Level_Control%2C_UDS_%28LUFE-DAEMPFER%29
  const firstActivation = /^(?:fahrprofilauswahl|fahrprofil(?:e)?.*auswahl)\s+aktivieren/.test(title);
  if (firstActivation && (input.platform === "MQB" || input.platform === "MQB-A0") &&
      input.vehicleBrand !== "Audi") {
    return withSfd("ODIS Service (SWaP) + VCDS / VCP",
      "Originale erstmalige Fahrprofilauswahl: gültige SWaP-Berechtigung und passende Hardware/Software erforderlich. ODIS für die offizielle Aktivierung; VCDS oder VCP nur für anschließende unterstützte Codierungen. Wenn die Lizenz bereits aktiv ist, kann eine reine Anpassung reichen.");
  }
  // Eine vorhandene Hardwarefunktion im MMI anzeigen ist nicht dasselbe
  // wie eine erstmals lizenzierte Smartphone-Freischaltung.
  if (/carplay|android.auto|app.?connect|full.link|smart.link|smartphone.interface.*(?:aktivier|freischalt)/.test(title)) {
    return withSfd(input.vehicleBrand === "Audi" && modern
        ? "Audi Functions on Demand / Herstellerfreigabe"
        : "ODIS Service (FEC/SWaP) + ggf. VCDS / VCP",
      "Erstfreischaltung nur mit geeigneter Infotainment-Hardware und gültiger OEM-FEC-/SWaP-Berechtigung bzw. Audi Functions on Demand. VCDS/VCP können vorhandene Funktionen codieren, ersetzen aber keine Lizenz. Wireless zusätzlich nur mit unterstützter WLAN-/Bluetooth-Hardware und Software.");
  }

  // Neue mehrfarbige QQ2-Konturbeleuchtung des Audi MLB/MLB-evo:
  // VCDS kann das Menü codieren, jedoch nicht das benötigte ZDC-Parameterpaket.
  const audiAmbient = input.vehicleBrand === "Audi" &&
    /^(?:MLB|MLBevo)$/.test(input.platform ?? "") &&
    /ambientebeleuchtung|ambientelicht|qq2|konturbeleuchtung/.test(title);
  const expandedAmbient = /qq2|mehrfarb|rgb|kontur|ambientebeleuchtung.*(?:nachrüst|freischalt)/.test(combined);
  if (audiAmbient && expandedAmbient) {
    return withSfd("VCP",
      "Bei erstmaliger mehrfarbiger QQ2-Ambientebeleuchtung ist ein passender BCM-ZDC-Datensatz mit VCP erforderlich. Anschließende Codierung von BCM/5F mit VCDS oder VCP möglich. Bereits korrekt parametrierte Fahrzeuge brauchen ggf. nur die Menücodierung; Steuergerät und Softwarestand abgleichen.");
  }

  if (!modern && /anhänger(?:kupplung|vorrichtung)|\bahk\b/.test(title) &&
      /codier|aktivier|nachrüst|integrier/.test(title)) {
    return withSfd("VCDS / VCP (AHK-Codierung)",
      "Die Anmeldung des Anhängersteuergeräts (je nach Plattform STG 69/Gateway) und Anpassung weiterer beteiligter Steuergeräte ist mit VCDS, bei passenden Kanälen auch VCP möglich. Das ersetzt keine eventuell erforderliche Parametrierung, Online-Inbetriebnahme oder SFD-Freigabe.");
  }
  if (!modern && /audi.drive.select/.test(title)) {
    return withSfd("VCDS / VCP (Codierung)",
      "Bei unterstützten Audi-Steuergeräten lassen sich Drive Select und das MMI-Menü codieren. Benötigte Fahrprofilschalter, Steuergeräte und eventuell bestehende Funktionsfreigaben müssen vorhanden sein.");
  }
  if (!modern && /^(?:ambientebeleuchtung (?:im mmi )?aktivieren|ambientebeleuchtung freischalten|ambientebeleuchtung.*(?:menü|mmi).*aktivieren)/.test(title)) {
    return withSfd("VCDS / VCP (Menü) · ggf. VCP (Datensatz)",
      "Vorhandene Ambientebeleuchtung: MMI-/5F- und BCM-Anpassungen mit VCDS oder VCP, sofern unterstützt. Für neue mehrfarbige Systeme kann zusätzlich eine VCP-Parametrierung erforderlich sein; fehlende Leuchten/Controller werden nicht durch Codierung ersetzt.");
  }

  // Audi B9/C8 ACC-Einstellungsmenüs: es wird kein Radar freigeschaltet.
  // https://www.vag-coding.net/audi/a4-b9/a4-b9-acc-driving-profile-selection-on-the-mmi/
  // https://www.vag-coding.fr/audi/a4-b9/a4-b9-reglage-de-distance-acc-dans-mmi/
  if (!modern && /\bacc\b.*(?:abstandseinstellung|fahrprofil|distanzeinstellung|grundeinstellung)/.test(title) &&
      /mmi|infotainment/.test(title)) {
    return withSfd("VCDS / VCP (ACC-Menü)",
      "Nur bei bereits vorhandenem, funktionsfähigem ACC. Unterstützte Menü- und Abstandsvorgaben lassen sich codieren; keine Erstfreischaltung von Radar, pACC oder Fahrassistent. Softwarestand und ggf. Funktionslizenz beachten.");
  }
  if (!modern && /dual.view|doppel.*(?:kamera|parkansicht)/.test(title)) {
    return withSfd("VCDS / VCP (Kamera-Menü)",
      "Aktiviert bei bereits vorhandenen geeigneten Umgebungskameras eine unterstützte Ansicht. Ersetzt weder Kameranachrüstung noch 6C-Parametrierung und Kalibrierung.");
  }
  if (!modern && /prädiktiven.effizienzassistenten.*aktivier/.test(title)) {
    return withSfd("Herstellerfreigabe / VCDS / VCP (Einstellungen)",
      "Prädiktive Funktionen benötigen geeignete Navigation/Kartendaten, Radar und Frontkamera sowie ggf. Funktionsfreigaben. Mit VCDS/VCP sind nur nachweislich vorhandene Einstellungen codierbar; keine pauschale Erstfreischaltung.");
  }

  // Beim vorhandenen Virtual Cockpit genügt für ein bereits unterstütztes
  // Layout mitunter Codierung; bei anderen Versionen ist ein VCP-/
  // herstellerseitiger Freischalt- bzw. Softwarestand-Schritt nötig.
  if (!modern && /(?:sportlayout|rs.ansicht|rs.layout|startlogo|tacho.darstellung|virtual.cockpit.startscreen|aid.fahrzeugansicht)/.test(title) &&
      !/nachrüst|umbau|tausch/.test(title)) {
    return withSfd("VCDS / VCP (vorhandenes Layout) · ggf. VCP",
      "Nur bei zum Kombiinstrument und Softwarestand passender Layoutvariante. Aktivierbare Layouts sind teils per Codierung wählbar; nicht vorhandene Sportlayouts benötigen je nach KI-Generation weitere Hersteller-/VCP-Verfahren. Kein pauschaler Anspruch auf RS-Layout.");
  }
  if (!modern && /easy.entry|komforteinstieg.*sitz/.test(title) &&
      !/nachrüst|tausch/.test(title)) {
    return withSfd("VCDS / VCP (Sitzeinstellung)",
      "Nur bei kompatiblem Sitzsteuergerät und vorhandener elektrischer Memory-/Komfortsitz-Hardware; über Codierung/Anpassung, keine nachträgliche Hardwarefreischaltung.");
  }
  if (!modern && /luftfahrwerk|niveauanzeige|lift.funktion|niveauregulierung/.test(title) &&
      !/nachrüst|umbau/.test(title)) {
    return withSfd("VCDS (Diagnose/Grundeinstellung) · ggf. ODIS",
      "Niveau-/Lift-Menü und Niveausensor-Kalibrierung sind getrennte Arbeiten. VCDS ist für dokumentierte Grundeinstellungen nutzbar; bei fehlender EOL-Parametrierung oder Steuergerätetausch kann ODIS erforderlich sein. Kalibrierung nur mit korrektem Messverfahren.");
  }

  // Ein ausdrücklich erforderlicher High-Kamera-Datensatz ist kein
  // optionaler Menüschritt. Seine Parametrierung benötigt VCP.
  if (!modern && /rückfahrkamera|rear.view/.test(title) &&
      /(?:datensatz|zdc|parameterdatei).{0,55}(?:parametrier|aufspiel|einspiel|laden)|(?:parametrier|aufspiel|einspiel).{0,55}(?:datensatz|zdc|parameterdatei)/.test(note)) {
    return withSfd("VCP",
      "Ein ausdrücklich benötigter Kamera-Datensatz wird mit VCP parametriert. Zusätzliche Codierung mit VCDS oder VCP; bei High-Systemen gegebenenfalls eine Kalibrierung.");
  }
  // Ab Werk installierte Rückfahrkamera Low oder FLA kann eine reine
  // Codierung sein. Kamera High mit fehlendem Datensatz nicht.
  if (!modern && /rückfahrkamera|rear.view/.test(title) &&
      /high|dynamische hilfslinien|dynamische linien|datensatz/.test(combined)) {
    return withSfd("VCDS / VCP (Codierung) · ggf. VCP (Datensatz)",
      "Für Kamera High kann ein passend parametriertes Steuergerät 6C nötig sein. Fehlende Datensätze mit VCP, die unterstützte Fahrzeug- und Infotainment-Codierung mit VCDS oder VCP; ggf. Kalibrierung erforderlich.");
  }
  if (!modern && /^(?:rückfahrkamera|rear.view)/.test(title) &&
      !/nachrüst/.test(title)) {
    return withSfd("VCDS / VCP (Kameracodierung)",
      "Bei bereits passend parametrierter und kompatibler Kamera ist eine Codierung der beteiligten Steuergeräte möglich. Kamera High und neue OEM-Systeme können zusätzlich VCP-Datensätze und Kalibrierung erfordern.");
  }
  if (!modern && /fernlichtassistent|light.assist|high.beam.assist/.test(title) &&
      /aktivier|freischalt/.test(title) && !/nachrüst|umbau|dynamic.light|matrix/.test(title)) {
    return withSfd("VCDS / VCP (Codierung)",
      "Nur mit geeigneter Frontkamera oder Fernlichtsensorik, Lichtsteuergeräten und Software. Bei FoD-, SWaP- oder SFD-geschützten Varianten zusätzlich die entsprechende Herstellerfreigabe; nach Kameratausch Kalibrierung.");
  }

  // Parametrierung ist in einigen Nachrüstbeschreibungen lediglich als
  // mögliche zusätzliche Arbeit genannt. Das macht sie nicht zwingend.
  const optionalParameters = !/parametrier|datensatz|zdc/.test(title) &&
    /(?:je nach|ggf\.?|gegebenenfalls|kann|können|eventuell|möglich|teilweise).{0,110}(?:parametrier|datensatz|zdc)/.test(note);
  if (!modern && optionalParameters &&
      /lane.assist|spurhalteassistent|einparkhilfe|parkassist|rückfahrkamera|rear.view|acc|fahrassistent/.test(title)) {
    return withSfd("VCDS / VCP (Codierung) · ggf. VCP (Datensatz)",
      "Die Codierung kann mit VCDS oder VCP erfolgen. Wird für diese Ausstattungs-/Kameraversion ein neuer Parameterdatensatz benötigt, ist zusätzlich VCP nötig. Kalibrierung und erforderliche Online-Freigaben sind eigene Schritte.");
  }

  // Nachrüst-Codierungen, soweit VCDS-Verfahren in Ross-Tech belegt sind:
  // https://wiki.ross-tech.com/wiki/index.php/Cruise_Control_Retrofitting_%281K%29
  // https://wiki.ross-tech.com/wiki/index.php/Cruise_Control_Retrofitting_%286R%29
  // https://wiki.ross-tech.com/wiki/index.php/Cruise_Control_Retrofitting_%285G%29
  // https://wiki.ross-tech.com/wiki/index.php/VW_TPMS_Systems_without_Wheel_Position_Recognition
  if (!modern && input.source === "research" &&
      /tempomat|geschwindigkeitsregelanlage|\bgra\b/.test(title) &&
      /nachrüst|umbau|aktivier/.test(title) && !/\bacc\b.*nachrüst/.test(title)) {
    return withSfd("VCDS / VCP (GRA-Codierung) · ggf. ODIS/SWaP",
      "Ross-Tech dokumentiert die Tempomat-Nachrüstung für mehrere VAG-Baureihen mit VCDS. Passender Lenkstockschalter/Lenkrad, Motor-/Lenkungssteuergerät und Verkabelung nötig. Bei einzelnen neueren Modellen ist zusätzlich eine originale Funktionsfreigabe erforderlich.");
  }
  if (!modern && input.source === "research" &&
      /reifendruckkontrolle|rdk.high|rdks|tpms/.test(title)) {
    return withSfd("VCDS / VCP (RDK-Codierung)",
      "Direktes RDK benötigt passende Sensoren und ggf. STG 65/Gateway, indirektes RDK ein unterstütztes ABS/ESC-Steuergerät. Bei neuen oder nicht parametrierten Steuergeräten sind zusätzliche Verfahren möglich.");
  }
  if (!modern && input.source === "research" &&
      /b&o|bang.olufsen|premium.soundsystem|soundsystem.*nachrüst/.test(title)) {
    return withSfd("ODIS Service (Komponentenschutz) · ggf. VCP",
      "Bei originalem gebrauchten/ersetzten Verstärker sind Komponentenschutz und ggf. Softwaredatensatz separat zu behandeln. ODIS Service Online für Herstellerfreigaben; bei passendem Steuergerät VCP zur notwendigen Parametrierung. Kein VCDS-Alleinverfahren.");
  }

  // Recherchierte Nachrüstungen: nur den belegbaren Arbeitsteil nennen.
  if (!modern && input.source === "research" &&
      /codierdongle|codierinterface|freischaltdongle/.test(note) &&
      !/vcp.*parametrier|zdc/.test(note)) {
    return withSfd("Codierdongle des Nachrüstsatzes",
      "Der beschriebene Kit nennt einen spezifischen Codierdongle. Dessen Umfang ersetzt nicht automatisch weitere SFD-Freigaben, Datensätze, Kalibrierungen oder die Freigabe fremder Hardware.");
  }
  // Bei sonstigen Komfort-Hardware-Nachrüstungen ist nur der
  // Codieranteil benennbar, nicht die komplette Inbetriebnahme.
  if (!modern && input.source === "research" &&
      /sitzheizung|lenkradheizung|beheizbares.lenkrad|standheizung|kessy|keyless|elektrische.heckklappe|heckklappe.*fußgeste|spiegel.*nachrüst|licht.regensensor|fußraumbeleuchtung|fussraumbeleuchtung|dwa|diebstahlwarnanlage/.test(title)) {
    return withSfd("VCDS / VCP (Codieranteil) · ggf. ODIS/VCP",
      "VCDS/VCP sind nur für unterstützte Steuergerätecodierungen vorgesehen. Steuergeräteaustausch, Komponentenschutz, SFD, Parameterdatensätze, Sensoranlernen und herstellerspezifische Inbetriebnahme müssen separat geprüft werden. Keine zugesagte Komplettnachrüstung mit einem einzigen Interface.");
  }
  if (!modern && input.source === "research" &&
      /rückfahrkamera|rear.view/.test(title) && !/datensatz|parametrier|high|dynamische/.test(combined)) {
    return withSfd("VCDS / VCP (Codieranteil)",
      "Passende Kamera, Verkabelung und Infotainment vorausgesetzt. VCDS/VCP können die unterstützte Codierung vornehmen; bei High-Kamera oder fehlendem Datensatz ist ein separater VCP-Schritt notwendig.");
  }
  if (!modern && input.source === "research" &&
      /matrix|led.scheinwerfer|bi.xenon|lichtweitenregulierung|scheinwerfer.*(?:nachrüst|umrüst)/.test(title)) {
    return withSfd("VCDS / VCP (Codierung) + Kalibrierung",
      "Umbau verlangt passende Steuergeräte, automatische Leuchtweitenregulierung und fachgerechte Licht-/ADAS-Kalibrierung. Gegebenenfalls VCP-Datensätze oder ODIS-Herstellerverfahren nötig. Keine Freigabe allein durch VCDS-Codierung.");
  }
  if (!modern && input.source === "research" &&
      /(?:\bacc\b|pacc|radar|travel.assist|stauassistent|side.assist|area.view|360.|night.vision)/.test(title) &&
      /nachrüst|umbau|erweitern|aufrüsten/.test(title)) {
    return withSfd("VCDS / VCP (Codierung) + Fachinbetriebnahme",
      "Komplette Assistenz-Nachrüstung benötigt abhängig vom System zusätzlich VCP-Datensätze, ODIS-/Komponentenschutz-/Lizenzfreigaben, passende Sensorik und ADAS-Kalibrierung. Keine reine VCDS/VCP-Komplettfreischaltung.");
  }

  if (/\b(svm|fec|swap)\b|fod.shop|lizenz.*freischalt|offizielle.*freigabe|freischaltdokument|sicherheitsfreigabe/.test(combined)) {
    return withSfd("Lizenz/Freigabe prüfen", "Eine erforderliche FEC-/SWaP-/SVM-Freigabe lässt sich nicht durch reine VCDS-Codierung ersetzen. Das autorisierte Verfahren muss feststehen.");
  }

  // Bei mehreren Prozessschritten wird nicht nur das fürs Codieren
  // geeignete Interface als vollständiges Werkzeug ausgegeben.
  if (/vcp[- /]parametrier|zdc.*\bvcp\b/.test(combined)) {
    return withSfd("VCP", "VCP-spezifischer Parameter-/ZDC-Schritt mit passendem Datensatz und unterstütztem Steuergerät; reine VCDS-Codierung genügt hierfür nicht. Zusätzliche Freigaben separat prüfen.");
  }
  // TD-Anleitungsbereich: Parameter-/ZDC-Dateien nur als VCP-Arbeit
  // ausweisen. Online-SVM und herstellergesteuerte Maßnahmen sind ein
  // anderes Verfahren und wurden bereits oben abgefangen.
  const parameterStep = /parametrier|\bzdc\b|parameterdatei|gateway.parametrier|softwaredatensatz|datensatz.*(?:einspiel|aufspiel|upload)/.test(combined);
  if (parameterStep && !/nur ausstattung|datensatz unterscheiden/.test(note)) {
    return withSfd("VCP",
      "Für das Einspielen eines kompatiblen Parameter-/ZDC-Datensatzes wird VCP benötigt; VCDS allein kann diese Parametrierung nicht durchführen. Teilenummer, Softwarestand, passende Datensatzdatei sowie VCP-Unterstützung und Freigaben sind Voraussetzung.");
  }
  if (/(?:steuergerät|firmware|flash).*flash|softwareupdate|mib1.*mib2|mmi.*upgrade|kalibrierung.*online/.test(title) ||
      /(?:datensatz|software).*(?:laden|spielen)|remote.erstinbetriebnahme/.test(note)) {
    return withSfd("Hersteller-/Flashverfahren prüfen",
      "Flash- oder Inbetriebnahmeverfahren sind nicht automatisch eine VCP-Parametrierung. Benötigter Softwarestand, Lizenz, Datensatz und gegebenenfalls ODIS/SVM müssen getrennt geprüft werden.");
  }

  // Bei umfassenden Assistenz-Nachrüstungen zusätzliche Schritte nicht
  // auf eine einzige Diagnose-Codierung reduzieren.
  if (/^(?:.*)(?:\bacc\b|pacc|travel assist|stauassistent|side assist|blind spot|parklenkassistent|night vision|area view|360.)/.test(title) &&
      /nachrüst|umbau|umrüst|vollständig|komplett|radar.*einb|front.*heckkamera/.test(title)) {
    return withSfd("Inbetriebnahme prüfen", "Codierung, mögliche Datensätze und Kalibrierung müssen anhand der realen Steuergeräte geprüft werden.");
  }
  if (/verkehrszeichenerkennung|verkehrszeichen.*aktivier|\bvze\b/.test(title)) {
    return withSfd(/\bvcds\b/.test(hint) && !modern ? "VCDS / VCP" : "Freigabe abhängig", "VCDS nur für den belegten Codierschritt; vorhandene FEC-/SWaP-Freigabe, kompatible Navigation, Kamera und Softwarestand sind Voraussetzung.");
  }

  // Eindeutig als VCDS-Einstellungsanleitung erfasste Funktionen, sofern
  // keine zusätzlichen Freischalt- oder Parametrierschritte erforderlich.
  const adjustment = /anpass|einstell|speicher|memory|warnintensität|start.stopp|zeigertest|gurtwarn|komfortblink|coming.home|leaving.home|auto.lock|auto.unlock|regenschließ|fenster|tfl|tagfahrlicht|heckleuchten|spiegelabsenk|spiegelanklapp/.test(title);
  const vcdsDocumented = (/\bvcds\b/.test(hint) && !/\bvcp\b|\bodis\b/.test(hint)) ||
    (/\bvcds\b/.test(note) && !/\bvcp\b|\bodis\b/.test(note));
  if (vcdsDocumented && adjustment && !modern) {
    return withSfd("VCDS / VCP", "Beide Werkzeuge sind für den Codier-/Anpassungsschritt grundsätzlich geeignet, sofern das jeweilige Steuergerät und der Kanal unterstützt werden. Für SFD1 ist eine passende Freischaltung erforderlich.", false);
  }

  // Eindeutig in vorhandenen Codierdaten als VCDS hinterlegte Aktivierung,
  // nur wenn keine weitere Inbetriebnahme in den Daten erkennbar ist.
  if (/\bvcds\b/.test(hint) && !/\bvcp\b|\bodis\b/.test(hint) && !modern &&
      !/nachrüst|umbau|umrüst|aktivieren \/ anpassen|freischalt|kalibrier|grundstellung|lizenz/.test(title) &&
      !/parametrier|kalibrier|grundeinstellung|online|ge[kc]o|sfd2/.test(note)) {
    return withSfd("VCDS / VCP", "Nur für den dokumentierten Codier-/Anpassungsschritt. Die tatsächliche VCP-Unterstützung hängt von Interface, Steuergerät und Softwarestand ab.", false);
  }

  if (modern) return withSfd("Herstellerverfahren prüfen", "Bei neueren Plattformen sind SFD2/UNECE und signierte Herstellermaßnahmen möglich; keine VCDS-/VCP-Zusage.");

  // Ausschließlich bei bekannten, einfachen Codier- oder Anpassungsarbeiten:
  // Der allgemeine Katalog-Hinweis "VCDS; ggf. VCP oder ODIS" alleine ist KEIN
  // Nachweis, dass VCDS auch eine mehrstufige Freischaltung vollständig erledigt.
  const ordinaryCoding = input.source === "catalog" &&
    (input.category === "Codierungen" || input.category === "Assistenzsysteme");
  const typicalVcdsCoding =
    /gurtwarn|zeigertest|needle.sweep|staging|komfortblink|coming.home|leaving.home|auto.lock|auto.unlock|spiegelabsenk|spiegelanklapp|regenschließ|regenschliess|fenster|tagfahrlicht|heckleuchten|rückleuchten|rueckleuchten|nebelscheinwerfer|abbiegelicht|heckwischer|tr[äa]nenwisch|wischer|nachtankmenge|öltemperatur|oeltemperatur|laptimer|rundenzähler|geschwindigkeitsanzeige|verbrauchsanzeige|sitzheizung.*(?:speicher|einstell)|climatronic.*anzeig|berg[a-zä]*anfahrassistent.*anpass|bremsscheibentrocknung.*anpass|lenkungskennlinie.*anpass|komfortöff|komfortschlie|akustische.quittier|einparkhilfe.*(?:anzeig|ton|einstell|aktivier)|reifendruckkontrolle.*(?:abs|infotainment)|xds.*(?:stärke|anpass)|ganganzeige|start.stopp.*(?:deaktivier|anpass)|ambientebeleuchtung.*(?:farbe|anpass)|fussraumbeleuchtung|fußraumbeleuchtung|hidden.menu|green.menu|developer.mode|fahrschulmodus|offroad.anzeige|soundaktor.*(?:lautstärke|anpass)|fahrprofil.*(?:anzeig|menü|lenkhilfe)|esc.sport.*menü|asr.off.*menü|warnsignal.*deaktivier|warnton.*deaktivier|wählhebel.*(?:anpass|entriegel)|ladeanzeige|batterieanzeige|ölstandanzeige|oelstandanzeige|mmi.startlogo|welcome.sound|skin.der.multifunktionsanzeige|standlicht|parklicht|umfeldbeleuchtung|schiebedach.*komfort|acc.*(?:abstandseinstellung|fahrprofilauswahl).*infotainment|(?:light|lane) assist.*(?:speicher|einstell|warn|anpass)|spurhalteassistent.*(?:einstell|warn|anpass)|elektrisch.anklappbare.spiegel|gebl[äa]sestufe.*auto|scheinwerferreinigungsanlage.*anpass|batterie.*(?:batteriewechsel|anlernen)|bordsteinautomatik|rückfahrwisch|rueckfahrwisch|fu(?:ss|ß)raumleuchten.*led|reifendruckkontrolle.*aktivier|abschaltgeschwindigkeit.*einparkhilfe|hornquittier|elektrische.heckklappe.*(?:fernbedienung|öffnungsverzögerung)|easy.entry.*mmi|fahrzeug.*eingeschalteter.zündung.verriegel|innenlichtverhalten|reichweitenbegrenzung.*funk|automatisches.entriegeln|umluft.memory|heckklappe.*(?:fernbedienung|innentaster)|virtual.cockpit.startscreen|lenkungskennlinie|audi.drive.select.*(?:menü|lenkhilfe)|acc.grundeinstellung.*mmi/i.test(title);
  const complexStep =
    /nachrüst|nachruest|retrofit|umbau|umrüst|umruest|tausch|flash|update|parametrier|kalibrier|grundstellung|komponentenschutz|wegfahrsperre|schl[üu]ssel.*anlern|carplay|android.auto|mirrorlink|app.connect|mib.*upgrade|mmi.*upgrade|\bacc\b.*aktivier|pacc|travel.assist.*aktivier|360.|area.view.*aktivier|virtual.cockpit.*nachrüst/i.test(title);
  if (ordinaryCoding && typicalVcdsCoding && !complexStep) {
    return withSfd("VCDS / VCP", "Beide für reine Codier-/Anpassungsarbeiten möglich, sofern der konkrete Kanal in VCDS und VCP unterstützt wird. Kein Nachweis für zusätzliche Parametrierung, Lizenzen oder Herstellerfreigaben.");
  }

  // Nur explizit dokumentierte, allein benötigte Werkzeuge ausweisen.
  // Bei einer ungeprüften Fremdreferenz keine vermeintliche Freigabe erfinden.
  if (/\bvcp\b/.test(hint) && !/\bvcds\b|\bodis\b/.test(hint) && !complexStep) {
    return withSfd("VCP", "Nur bei nachweislich passender Steuergeräte- und Softwareunterstützung.");
  }
  if (/\bodis\b/.test(hint) && !/\bvcds\b|\bvcp\b/.test(hint) && !complexStep) {
    return withSfd("ODIS", "Herstellerverfahren und erforderliche Online-Berechtigung prüfen.");
  }

  // Redaktionelle Referenzthemen sind Prüfkandidaten und keine getesteten PDFs.
  // Bei eindeutig benannten einfachen Anpassungen lässt sich der übliche
  // Diagnose-Codieranteil benennen, ohne die konkrete Machbarkeit zu versprechen.
  const referenceAdjustment = input.source === "reference" &&
    !/nachrüst|umbau|umrüst|fahrzeugansicht.*prüfen|aktivierungsberechtigung|traffic.jam.assist|garagentoröffner|anhänger.rangierassistent/.test(title) &&
    /einstell|anpass|konfigurier|anzeigen|einblend|veränder|beibehalt|speicher|aktivier|deaktivier|freigeb|start|ausw[äa]hl|belegen|verriegel|entriegel|ergänz|erhöh|änder|einschalten|freischalt|komfort|lichtautomatik|fernlichtassistent.*(?:merke|aktivierungsverhalten|stadterkennung)|lenkrad.*favoriten|instrumentenansicht|digital.cockpit|klimaanlage|sitzheizung|einparkhilfe|abblendlicht|fahrprofil|dsg.*(?:tür|gang)|acc.*(?:tempo|abstand)|adblue|front.assist.*(?:warn|vorwarn)/.test(title);
  if (!modern && referenceAdjustment) {
    return withSfd("VCDS / VCP (Anpassung, modellabhängig)",
      "Die Tätigkeit entspricht einer Codierung/Anpassung an bereits vorhandener Hardware. Werkzeugweg plausibel, aber als Recherchekandidat nicht am konkreten Fahrzeug geprüft. Unterstützten Anpassungskanal und eventuelle Freischaltungen vor einer PDF-Anleitung belegen.");
  }
  if (!modern && input.source === "reference" &&
      /^(?:originale )?anhänger(?:kupplung|vorrichtung)/.test(title)) {
    return withSfd("VCDS / VCP (Codieranteil)",
      "Die Einbindung kompatibler Anhängersteuergeräte ist grundsätzlich codierbar. Ob der konkrete Nachrüstsatz weitere Datensätze oder Herstellerfreigaben benötigt, bleibt anhand der Teilenummer zu klären.");
  }
  if (!modern && input.source === "reference" &&
      /rückfahrkamera.low|nebelscheinwerfer.*(?:nachrüst|umrüst)|reifendruckkontrolle.*abs.*nachrüst|licht.*regensensor.*nachrüst|fußraumbeleuchtung.*nachrüst|fussraumbeleuchtung.*nachrüst/.test(title)) {
    return withSfd("VCDS / VCP (Codieranteil)",
      "Nach Montage der notwendigen kompatiblen Hardware ist die Codierung mit VCDS oder VCP möglich, soweit das entsprechende Steuergerät den Kanal unterstützt. Bei anderen Ausstattungsständen sind weitere Schritte erforderlich.");
  }

  // Jede Tabellenzeile hat eine Aussage zum Interface. Wo die vorhandene
  // Datenlage nicht genügt, wird KEIN Werkzeug als freigegeben dargestellt.
  return withSfd("Interfaceprüfung erforderlich",
    ordinaryCoding
      ? "Aus der Funktionsbezeichnung allein ist nicht sicher feststellbar, ob VCDS, VCP oder ODIS den gesamten Vorgang abdeckt."
      : "Keine geprüfte vollständige Werkzeugzuordnung: Steuergerät, Softwarestand, Datensätze und Herstellerfreigaben fehlen.");
}
