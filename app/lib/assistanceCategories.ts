/**
 * Gemeinsame Klassifizierung für Codierkonfigurator, PDF-Anleitungen
 * und geschützte PDF-Verwaltung.
 *
 * "Assistenzsysteme" = neue System-/Funktionsfreischaltung.
 * "Anpassungen für Assistenzsysteme" = Bedienung, Speicher, Warn-,
 * Anzeige- und Verhaltensparameter eines bereits vorhandenen Systems.
 * Ein Aktivieren-Knopf im Fahrzeugmenü aktiviert nicht automatisch
 * ein neues Assistenzsystem.
 */
export const ASSISTANCE_CATEGORIES = [
  "Assistenzsysteme",
  "Anpassungen für Assistenzsysteme",
] as const;
export type AssistanceCategory = (typeof ASSISTANCE_CATEGORIES)[number];

const adjustmentTerms =
  /anpass|einstell|speicher|memory|merk|behalt|warnverzöger|warnstärk|warnintens|vorwarn|empfindlich|lenkeingriff|vibration|eingriffszeitpunkt|einschaltzeitpunkt|ausschaltzeitpunkt|bedienung|res[- ]?taste|fahrprofilauswahl|fahrprofilanbindung|grundeinstellung|abstandseinstellung|abstandsauswahl|rechtsüberhol|überholsperre|schritteinstellung|fahrerinaktiv|abschaltverhalten|abschaltgeschwindigkeit|bordsteinabstand|einschaltzustand|zustand nach neustart|letzte[nr]? (?:einstellung|zustand)|dual view|audioabsenkung|lautstärke|tonhöhe|parkhilfetöne|parkansicht|konfigurier|stadterkennung|reset|vorwarnung|einstellungsmenü|menüeintrag|darstellung|aktivierungston|haltezeit|anzeigeverhalten/i;
const existingSystemFunctions =
  /einparkhilfe.*automatisch aktivieren|einparkhilfe.*automatische aktivierung|parkhilfe.*automatisch aktivieren|rückfahrkamera über parktaste anzeigen|kamera über parktaste anzeigen|acc.*fahrprofilauswahl.*aktivieren|abstandseinstellung.*aktivieren|einparkhilfe.*hilfslinien aktivieren|einparkhilfe.*darstellung aktivieren/i;
const assistanceSystemTerms =
  /\bacc\b|adaptive cruise|lane assist|spurhalt|spurverlass|spurwechsel|side assist|totwinkel|front assist|travel assist|emergency assist|stauassistent|traffic jam assist|verkehrszeichen|\bvze\b|fernlichtassistent|light assist|dynamic light assist|\bdla\b|park assist|einparkassistent|einparkhilfe|parkhilfe|\bpdc\b|rückfahrkamera|rear view|area view|surround view|notbrems|tempomat|geschwindigkeitsbegrenzer|speed limiter|bergabfahrassistent|berganfahrassistent|auto[ -]?hold|gespannstabilisierung|manövrierassistent|anhängerrangierassistent|trailer assist|effizienzassistent|parklenk/i;

/** Nur Fahrzeugeinträge mit eindeutigem Assistenzbezug neu zuordnen. */
export function isAssistanceCoding(entry: {name: string; uiGroup?: string; category?: string}): boolean {
  return entry.uiGroup === "Assistenz" || entry.category === "Assistenzsysteme"
    || entry.category === "Anpassungen für Assistenzsysteme"
    || assistanceSystemTerms.test(entry.name);
}

/** Use only for entries already identified as assistance-related. */
export function assistanceCategoryForName(name: string): AssistanceCategory {
  return adjustmentTerms.test(name) || existingSystemFunctions.test(name)
    ? "Anpassungen für Assistenzsysteme"
    : "Assistenzsysteme";
}

/** Einheitliche Gruppierung für Fahrzeugsuche, PDF-Anleitungen und Buchung. */
export function assistanceCategoryForCoding(entry: {name: string; uiGroup?: string; category?: string}): AssistanceCategory | null {
  return isAssistanceCoding(entry) ? assistanceCategoryForName(entry.name) : null;
}
