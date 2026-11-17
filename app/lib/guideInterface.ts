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
};

type InterfaceInput = {
  title: string;
  note?: string;
  interfaceInfo?: string;
  activation?: string;
  platform?: string;
  vehicleYear?: number;
  id?: string;
  category?: string;
};

const result = (label: string, qualification: string, requiresCheck = true): GuideInterfaceResult =>
  ({ label, qualification, requiresCheck });

export function guideInterface(input: InterfaceInput): GuideInterfaceResult {
  const title = input.title.toLocaleLowerCase("de");
  const note = [input.note ?? "", input.activation ?? ""].join(" ").toLocaleLowerCase("de");
  const hint = (input.interfaceInfo ?? "").toLocaleLowerCase("de");
  const combined = title + " " + note;
  const modern = (input.vehicleYear ?? 0) >= 2024;
  const sfd2 = /sfd2|unece|r155|r156|fod.shop|digital signier|kryptograf/i.test(combined);

  // Ein codierfreier Umbau erfordert kein Diagnoseinterface.
  if (/(?:keine|ohne) (?:zusätzliche )?codierung(?: erforderlich)?\b|laut (?:quelle|anbieter) ohne codierung/.test(note) ||
      /subwoofergehäuse modifizieren|45.watt.usb.ladeanschlüsse/.test(title)) {
    return result("Nicht erforderlich", "Für den beschriebenen Arbeitsschritt ist keine Codierung angegeben.", false);
  }

  // FAZIT/GeKo ist kein Ersatz für ein klassisches VCDS-Login.
  if (/wegfahrsperre|komponentenschutz|\bfazit\b|\bgeko\b|(^|[^a-z])immo[345]?\b|schlüssel.*anlernen|(?:aid|virtual cockpit|kombiinstrument|tacho).*tausch/.test(combined) &&
      !/nur.*(?:anpassung|einstellung).*komponentenschutz/.test(combined)) {
    return result("ODIS Service (Online)", "Für Komponentenschutz/Wegfahrsperre ist die passende FAZIT-/GeKo-Berechtigung erforderlich. VCDS/VCP allein reichen nicht.");
  }

  if (sfd2) {
    return result("Herstellerfreigabe prüfen", "SFD2/UNECE kann signierte Herstellermaßnahmen erfordern. VCDS/VCP allein sind für die vollständige Aktivierung nicht freigegeben.");
  }

  if (/\b(svm|fec|swap)\b|fod.shop|lizenz.*freischalt|offizielle.*freigabe|freischaltdokument|sicherheitsfreigabe/.test(combined)) {
    return result("ODIS / Online-Freigabe prüfen", "Lizenz-/Funktionsfreigabe bzw. SVM ist kein gewöhnlicher VCDS-Codierschritt. Die autorisierte Methode ist fahrzeugspezifisch zu prüfen.");
  }

  // Bei mehreren Prozessschritten wird nicht nur das fürs Codieren
  // geeignete Interface als vollständiges Werkzeug ausgegeben.
  if (/zdc|vcp.parametrier|parameterdatei|datensatz.*(?:flash|einspiel|aufspiel|upload)|gateway.parametrier|softwaredatensatz/.test(combined)) {
    return result("VCP (Parametrierung)", "Nur bei nachgewiesener Unterstützung des Steuergeräts und passendem Datensatz; zusätzliche Online-Freigaben separat prüfen.");
  }
  if (/parametrier|(?:steuergerät|firmware|flash).*flash|softwareupdate|mib1.*mib2|mmi.*upgrade|kalibrierung.*online/.test(title)) {
    return result("Parametrierung prüfen", "Codierung allein genügt nicht. Datensatz, Flashverfahren und mögliche Herstellerfreigabe müssen konkret feststehen.");
  }
  if (/parametrier|(?:datensatz|software).*(?:laden|spielen)|remote.erstinbetriebnahme/.test(note) &&
      !/nur ausstattung|datensatz unterscheiden/.test(note)) {
    return result("Parametrierung prüfen", "Die Quelle nennt zusätzliche Parametrierung/Inbetriebnahme. Ein reines VCDS-Verfahren ist nicht als vollständig bestätigt.");
  }

  // Bei umfassenden Assistenz-Nachrüstungen zusätzliche Schritte nicht
  // auf eine einzige Diagnose-Codierung reduzieren.
  if (/^(?:.*)(?:\bacc\b|pacc|travel assist|stauassistent|side assist|blind spot|parklenkassistent|night vision|area view|360.)/.test(title) &&
      /nachrüst|umbau|umrüst|vollständig|komplett|radar.*einb|front.*heckkamera/.test(title)) {
    return result("Inbetriebnahme prüfen", "Codierung, mögliche Datensätze und Kalibrierung müssen anhand der realen Steuergeräte geprüft werden.");
  }
  if (/verkehrszeichenerkennung|verkehrszeichen.*aktivier|\bvze\b/.test(title)) {
    return result("Interface prüfen", "VCDS nur bei belegter reiner Codierbarkeit und vorhandener FEC/SWaP-Freigabe; Navigation, Kamera und Softwarestand prüfen.");
  }

  // Eindeutig als VCDS-Einstellungsanleitung erfasste Funktionen, sofern
  // keine zusätzlichen Freischalt- oder Parametrierschritte erforderlich.
  const adjustment = /anpass|einstell|speicher|memory|warnintensität|start.stopp|zeigertest|gurtwarn|komfortblink|coming.home|leaving.home|auto.lock|auto.unlock|regenschließ|fenster|tfl|tagfahrlicht|heckleuchten|spiegelabsenk|spiegelanklapp/.test(title);
  const vcdsDocumented = /\bvcds\b/.test(hint) || /\bvcds\b/.test(note) || input.category === "Codierungen";
  if (vcdsDocumented && adjustment && !modern) {
    return result("VCDS", "Für die reine Anpassung vorgesehen, sofern Steuergerät und Kanal die Funktion unterstützen; SFD1 erfordert gegebenenfalls Freigabe.", false);
  }

  // Eindeutig in vorhandenen Codierdaten als VCDS hinterlegte Aktivierung,
  // nur wenn keine weitere Inbetriebnahme in den Daten erkennbar ist.
  if (/\bvcds\b/.test(hint) && !modern &&
      !/nachrüst|umbau|umrüst|aktivieren \/ anpassen|freischalt|kalibrier|grundstellung|lizenz/.test(title) &&
      !/parametrier|kalibrier|grundeinstellung|online|ge[kc]o|sfd2/.test(note)) {
    return result("VCDS", "Nur für den dokumentierten Codier-/Anpassungsschritt, abhängig von Steuergerät und Softwarestand.", false);
  }

  if (modern) return result("Herstellerverfahren prüfen", "Bei neueren Plattformen sind SFD2/UNECE und signierte Herstellermaßnahmen möglich; keine VCDS-/VCP-Zusage.");

  return result("Interface prüfen", "Vollständige Bearbeitbarkeit erst nach Auto-Scan, Teilenummern, Softwarestand und Funktionsfreigaben bestimmbar.");
}
