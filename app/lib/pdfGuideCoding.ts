/** PDF-Katalog: Eintraege ausblenden, ohne Fahrzeugcodierungen oder Kaeuferdateien zu loeschen. */
const excludedPdfGuideIds = new Set(["mqbevo-adaptive-lane", "vcds-dla"]);
const flaCodingIds = new Set(["vcds-fla", "tcross-fla"]);

export function isPdfGuideCoding(coding: { id: string }): boolean {
  return !excludedPdfGuideIds.has(coding.id);
}

/** FLA und DLA werden im PDF-Katalog als ein Anleitungsthema angezeigt.
 * Der kombinierte Text ist keine pauschale Zusage fuer DLA-Hardware.
 */
export function displayPdfGuideCoding<T extends { id: string; name: string; hardware?: string }>(coding: T): T {
  if (!flaCodingIds.has(coding.id)) return coding;
  return {
    ...coding,
    name: "Fernlichtassistent (FLA/DLA) aktivieren",
    hardware: [coding.hardware, "DLA setzt zusaetzlich kompatible DLA-/Matrix-Scheinwerfer, Frontkamera und Lichtsteuergeraete voraus."].filter(Boolean).join(" "),
  };
}
