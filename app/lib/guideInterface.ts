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
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleEndYear?: number;
  sfd1From?: number;
  id?: string;
  category?: string;
  /** Herkunft bestimmt, ob vorhandene Codierdaten oder ungeprüfte Recherche vorliegen. */
  source?: "catalog" | "research" | "reference";
};

// Nach Modell/Baureihe belegte früheste SFD2-Einführung; zusätzliche PR-
// Einschränkungen ohne eindeutige Jahreszuordnung werden nicht behauptet.
// Quellen: KUFATEC SFD2 Fahrzeugliste (ab MJ = angezeigtes Bj.).
const SFD2_START_BY_MODEL: Record<string, number> = {
  "Audi|A3 / S3 8Y": 2025,
  "Audi|A4 / S4 B9": 2024,
  "Audi|A5 / S5 F5": 2024,
  "Audi|A6 / S6 C8": 2024,
  "Audi|A7 / S7 4K": 2024,
  "Audi|A8 D5 (4N)": 2024,
  "Audi|Q3 F3": 2024,
  "Audi|Q4 e-tron (FZ)": 2023,
  "Audi|Q5 FY": 2024,
  "Audi|Q7 4M": 2023,
  "Audi|Q8 4M": 2023,
  "Volkswagen|Golf 8 (CD)": 2024,
  "Volkswagen|Arteon 3H": 2024,
  "Volkswagen|Touran 5T": 2024,
  "Volkswagen|Taigo CS": 2024,
  "Volkswagen|ID.4 (E21)": 2024,
  "Volkswagen|ID.5 (E39)": 2024,
  "Volkswagen|Caddy V (SB)": 2025,
  "Škoda|Karoq NU": 2024,
  "Škoda|Scala NW": 2024,
  "SEAT / CUPRA|SEAT Leon KL": 2025,
  "SEAT / CUPRA|CUPRA Leon KL": 2025,
  "SEAT / CUPRA|CUPRA Formentor KM": 2025,
  "SEAT / CUPRA|CUPRA Born K11": 2025,
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
  // Anzeige bewusst nur als kurze Bezeichnung mit Startjahr.
  // Nicht jedes Steuergerät einer Baureihe ist dadurch geschützt.
  const sfd1Start = input.sfd1From;
  const sfd2Start = input.vehicleBrand && input.vehicleModel
    ? SFD2_START_BY_MODEL[`${input.vehicleBrand}|${input.vehicleModel}`]
    : undefined;
  const sfdNotice = [
    typeof sfd1Start === "number" ? `SFD (1) ab Bj. ${sfd1Start}` : null,
    typeof sfd2Start === "number" ? `SFD (2) ab Bj. ${sfd2Start}` : null,
  ].filter(Boolean).join(" · ") || undefined;
  const withSfd = (label: string, qualification: string, requiresCheck = true): GuideInterfaceResult => {
    const entry = result(label, qualification, requiresCheck);
    return sfdNotice && label !== "Nicht erforderlich"
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

  // Jede Tabellenzeile hat eine Aussage zum Interface. Wo die vorhandene
  // Datenlage nicht genügt, wird KEIN Werkzeug als freigegeben dargestellt.
  return withSfd("Interfaceprüfung erforderlich",
    ordinaryCoding
      ? "Aus der Funktionsbezeichnung allein ist nicht sicher feststellbar, ob VCDS, VCP oder ODIS den gesamten Vorgang abdeckt."
      : "Keine geprüfte vollständige Werkzeugzuordnung: Steuergerät, Softwarestand, Datensätze und Herstellerfreigaben fehlen.");
}
