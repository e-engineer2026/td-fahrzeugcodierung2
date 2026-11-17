/**
 * Zeigt nur hardwarebezogene Aussagen aus bereits vorhandenen technischen
 * Hinweisen. Keine zusätzliche Hardware erfinden oder die Quelle damit ersetzen.
 * Die ungekürzte Beschreibung bleibt getrennt aufklappbar erhalten.
 */
const HARDWARE_WORDS = /(?:\b(?:BCM|ABS|MIB|MMI|AID|ACC|PDC|SRA|aLWR|RDK|RFK|CAN[- ]?Gateway|Highline[- ]?Gateway|Climatronic|Keyless|Kessy)\b|steuergerät|steuerteil|steuerung|sensor|kamera|radar|lenkrad|lenkstock|heizmatte|sitzbezug|sitzheizung|klimabedienteil|klima.bedieneinheit|lichtpaket|leucht|scheinwerfer|rückleuchte|heckleuchte|spiegel|türgriff|kabel(?:satz|baum)|leitungen|antenne|lautsprecher|verstärker|schalter|taster|display|navi|infotainment|cockpit|heckklappe|anhängerkupplung|anhängersteuer|zugangssystem|schleifring|steckdose|wechselrichter|bedienteil|sensorik|motorsteuergerät|bremsenelektronik|airbag|reinigungsdüse|reifendrucksensor|frontscheibe|sto[ßs]fänger)/i;
const NOT_HARDWARE = /^(?:kein(?:e|er|en)?\s+(?:zusätzliche\s+)?(?:hardware|codierung)|(?:keine|ohne)\s+(?:weitere\s+)?codierung|(?:vollständige|öffentliche|deutsche|deutschsprachige)\s+(?:einbau|codier)?anleitung|(?:nur|laut)\s+(?:im|beim)\s+(?:hersteller|anbieter)|(?:einbau|anschluss)anleitung|anbieter|quelle|praxisbericht|probeverbau)/i;

/** null heißt nur: In den Daten ist keine gesonderte Hardwareanforderung genannt. */
export function guideHardware(note?: string, explicitHardware?: string): string | null {
  if (explicitHardware?.trim()) return explicitHardware.trim();
  if (!note?.trim()) return null;
  const clauses = note.split(/;\s*|\.\s+(?=[A-ZÄÖÜ])/u);
  const hardwareClauses: string[] = [];
  for (const clause of clauses) {
    let text = clause.trim();
    if (!text || NOT_HARDWARE.test(text) || /^(?:SFD\d?[- ]|GeKo\b|Codier|Freischalt|Parametrier|Software(?:stand|version)|Online[- ])|(?:keine|ohne) (?:zusätzliche )?(?:fahrzeug)?hardware/i.test(text)) continue;
    // Rein elektronische Anforderungen nicht irrtümlich als Bauteile markieren.
    text = text.split(/\s+(?:und|sowie)\s+(?=(?:SFD\d?|GeKo|SWaP|FEC|SVM|Softwarestand|Codierung|Freischaltung|Kalibrierung|Parametrierung)\b)/i)[0].trim();
    text = text.replace(/,\s*(?:SFD\d?|GeKo|SWaP|FEC|SVM|Softwarestand|Codierung|Freischaltung|Kalibrierung|Parametrierung)\b.*$/i, "").trim();
    if (!text || !HARDWARE_WORDS.test(text)) continue;
    if (!hardwareClauses.includes(text)) hardwareClauses.push(text);
  }
  return hardwareClauses.length ? hardwareClauses.slice(0, 3).join("; ") : null;
}
