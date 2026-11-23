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
  /anpass|einstell|speicher|memory|warnverzöger|warnstärk|warnintens|empfindlich|lenkeingriff|vibration|eingriffszeitpunkt|bedienung|res[- ]?taste|fahrprofilauswahl|grundeinstellung|abstandseinstellung|rechtsüberhol|überholsperre|schritteinstellung|fahrerinaktiv|abschaltverhalten|abschaltgeschwindigkeit|bordsteinabstand|einschaltzustand|letzte[nr]? (?:einstellung|zustand)|dual view|vorwarnung|einstellungsmenü|menüeintrag/i;
const existingSystemFunctions =
  /einparkhilfe automatisch aktivieren|rückfahrkamera über parktaste anzeigen|kamera über parktaste anzeigen|acc.*fahrprofilauswahl.*aktivieren|abstandseinstellung.*aktivieren/i;

/** Use only for entries already identified as assistance-related. */
export function assistanceCategoryForName(name: string): AssistanceCategory {
  return adjustmentTerms.test(name) || existingSystemFunctions.test(name)
    ? "Anpassungen für Assistenzsysteme"
    : "Assistenzsysteme";
}
