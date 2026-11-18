/**
 * Anzeige-Schlüssel fuer identische Codierfunktionen.
 * Unterschiedliche Taetigkeiten ("freischalten" vs. "anpassen") bleiben getrennt.
 * Nur Schreibweisen, Satzzeichen, Umlaute und mehrfache Leerzeichen werden angeglichen.
 */
export function codingNameKey(name: string): string {
  return name.toLocaleLowerCase("de")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function hasDisplayPrice(price: number): boolean {
  return Number.isFinite(price) && price > 0;
}

/** Behaelt von identischen Angeboten nur den zuerst priorisierten Datensatz. */
export function uniqueByCodingName<T extends { name: string }>(entries: T[]): T[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = codingNameKey(entry.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
