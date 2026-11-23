/** PDF-Katalog: Einträge ausblenden, ohne Fahrzeugcodierungen oder Käuferdateien zu loeschen. */
const excludedPdfGuideIds = new Set(["mqbevo-adaptive-lane", "vcds-dla"]);
const flaCodingIds = new Set(["vcds-fla", "tcross-fla"]);

export function isPdfGuideCoding(coding: { id: string }): boolean {
  return !excludedPdfGuideIds.has(coding.id);
}

/** FLA und DLA werden im PDF-Katalog als ein Anleitungsthema angezeigt.
 * Der kombinierte Text ist keine pauschale Zusage für DLA-Hardware.
 */
export function displayPdfGuideCoding<T extends { id: string; name: string; hardware?: string }>(coding: T): T {
  if (!flaCodingIds.has(coding.id)) return coding;
  return {
    ...coding,
    name: "Fernlichtassistent (FLA/DLA) aktivieren",
    hardware: [coding.hardware, "DLA setzt zusätzlich kompatible DLA-/Matrix-Scheinwerfer, Frontkamera und Lichtsteuergeräte voraus."].filter(Boolean).join(" "),
  };
}


/** Nur fachlich identische PDF-Themen zusammenführen, nicht Einstellungen
 * vorhandener Assistenten mit einer erstmaligen Freischaltung verwechseln.
 * Der Schlüssel wird ausschließlich für die Anzeige verwendet: Shop-IDs,
 * gespeicherte PDFs und Käufe bleiben unverändert.
 */
export function pdfGuideFunctionKey(entry: { name: string; id?: string }): string {
  const name = entry.name.toLocaleLowerCase("de")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/ß/g, "ss").normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
  // Verschiedene Schreibweisen derselben *Aktivierung*, nicht Memory-/Warn-Anpassungen.
  if (
    ["vcds-lane-activate", "tcross-lane-activate", "mqb-lane-guide-enable"].includes(entry.id ?? "") ||
    /^(?:lane assist(?: spurhalteassistent)?|spurhalteassistent(?: lane assist)?) (?:aktivieren|freischalten)$/.test(name)
  ) return "assistenz:lane-assist:aktivieren";
  if (
    ["vcds-fla", "tcross-fla"].includes(entry.id ?? "") ||
    /^(?:fernlichtassistent(?: fla(?: dla)?| light assist)?|light assist) (?:aktivieren|freischalten)$/.test(name)
  ) return "assistenz:fernlichtassistent:aktivieren";
  if (/^(?:rueckfahrkamera(?: rear view| nach nachruestung)?|rear view) (?:aktivieren|freischalten)$/.test(name))
    return "codierung:rueckfahrkamera:aktivieren";
  return name;
}

/** Bevorzugt den ersten Eintrag (zuerst die modellbezogene PDF, danach generische Funktionen).
 * Freischaltung, Anpassung und Nachrüstung bleiben jeweils getrennt.
 */
export function uniquePdfGuideCodings<T extends { id?: string; name: string }>(entries: readonly T[]): T[] {
  const seen = new Set<string>();
  return entries.filter(entry => {
    const key = pdfGuideFunctionKey(entry);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
