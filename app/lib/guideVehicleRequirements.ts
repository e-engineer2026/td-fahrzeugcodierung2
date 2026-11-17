/**
 * Typische Hardware-Voraussetzungen nur dort konkretisieren, wo sich
 * die Funktion aus dem Titel eindeutig zuordnen lässt. Das ersetzt keine
 * Prüfung von FIN, PR-Nummern, Kompatibilität und Softwarestand.
 */
type RequirementsInput = {
  title: string;
  original?: string | null;
  note?: string;
};

export function guideVehicleRequirements(input: RequirementsInput): string | null {
  const title = input.title.toLocaleLowerCase("de");
  const notes = (input.note ?? "").toLocaleLowerCase("de");

  if (/verkehrszeichenerkennung|verkehrszeichen.*(?:anzeig|aktivier)|\bvze\b/.test(title)) {
    return "VZE-fähige Front-/Umfeldkamera (A5), kompatibles Infotainment mit Navigationssystem und Navigationsdaten sowie unterstützte Kombiinstrument-/Displayanzeige; erforderliche FEC-/SWaP-Freigabe und Softwarestand prüfen.";
  }
  if (/anhänger|anhängerkupplung|\bahk\b/.test(title)) {
    const general = "Kompatible AHK mit passendem Anhängersteuergerät, Gateway-Anbindung, korrektem Kabelsatz und geeignetem Softwarestand; PR-Nummern und FIN prüfen.";
    return /sfd2|unece/.test(notes) ? general + " SFD2-/UNECE-Freigabe gegebenenfalls erforderlich." : general;
  }
  return input.original?.trim() || null;
}
