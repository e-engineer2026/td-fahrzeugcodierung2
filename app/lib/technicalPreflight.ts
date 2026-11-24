/** Conservative, customer-facing technical precheck.
 * Self-reported equipment is NOT an ECU scan, proof of SWaP/FEC, or authorization.
 */
export type EquipmentAnswer = "yes" | "no" | "unknown";
export type SfdAnswer = "unknown" | "none" | "sfd1" | "sfd2";
export type EquipmentKey = "camera" | "radar" | "navigation" | "acc" | "trailer" | "lights";
export type TechnicalEvidence = Record<EquipmentKey, EquipmentAnswer> & { sfd: SfdAnswer };
export type PreflightResult = {
  status: "bookable" | "review" | "blocked";
  required: EquipmentKey[];
  reasons: string[];
};

export const EMPTY_TECHNICAL_EVIDENCE: TechnicalEvidence = {
  camera: "unknown", radar: "unknown", navigation: "unknown",
  acc: "unknown", trailer: "unknown", lights: "unknown", sfd: "unknown",
};

export const EQUIPMENT_LABELS: Record<EquipmentKey, string> = {
  camera: "Frontkamera (Steuergerät A5)",
  radar: "Abstandsradar",
  navigation: "Navigationssystem mit gültigen Daten",
  acc: "Vorhandene ACC-Abstandsregelung",
  trailer: "Anhängersteuergerät / AHK-Steuergerät",
  lights: "Kompatible Fernlicht-/DLA-Scheinwerfersteuerung",
};

const rules: ReadonlyArray<{ pattern: RegExp; required: EquipmentKey[]; extra?: string }> = [
  { pattern: /verkehrszeichenerkennung|\bvze\b|sign assist/i, required: ["camera", "navigation"],
    extra: "VZE benötigt zusätzlich einen kompatiblen Software-/FEC-/SWaP-Stand und geeignete Anzeigen." },
  { pattern: /traffic jam|stauassistent|\btja\b|emergency assist/i, required: ["camera", "radar", "acc"],
    extra: "TJA/Emergency Assist benötigen kompatible Assistenz-, Lenkungs- und Sicherheitssysteme." },
  { pattern: /lane assist|spurhalteassistent|adaptive spurführung/i, required: ["camera"],
    extra: "Kamerasoftware, Lenksystem und Funktionsfreigaben müssen zum Fahrzeug passen." },
  { pattern: /trailer assist|anhängerrangierassistent/i, required: ["trailer"],
    extra: "Trailer Assist benötigt darüber hinaus passende Park-/Lenksteuerung und Kalibrierung." },
  { pattern: /fernlichtassistent|dynamic light assist|\bfla\b|\bdla\b/i, required: ["camera", "lights"],
    extra: "FLA/DLA benötigen passende Frontkamera und die jeweilige Scheinwerfer- sowie Lichtsteuerung." },
  { pattern: /\bacc\b|abstandsregelanlage/i, required: ["radar"],
    extra: "ACC benötigt eine passende Radarsensorik und Softwarefreigabe." },
];

/** Never infer installed equipment or SFD2 from a model year alone. */
export function evaluateTechnicalPreflight(
  selected: ReadonlyArray<{ name: string }>,
  year: number,
  evidence: TechnicalEvidence,
): PreflightResult {
  if (!selected.length) return { status: "bookable", required: [], reasons: [] };
  const matched = selected.flatMap(item => {
    // Retrofitting missing hardware needs a professional review rather than a false "impossible" verdict.
    if (/nachrüst|nachruest|umbau|umrüst|umruest/i.test(item.name)) return [];
    return rules.filter(rule => rule.pattern.test(item.name));
  });
  const required = Array.from(new Set(matched.flatMap(x => x.required)));
  const reasons: string[] = [];
  let status: PreflightResult["status"] = "bookable";

  if (evidence.sfd === "sfd2") {
    return { status: "blocked", required,
      reasons: ["SFD2-geschützte Codierungen werden nicht angeboten. Diagnose und eine technische Prüfung bleiben möglich."] };
  }
  if (year >= 2024) {
    status = "review";
    reasons.push("Ab Baujahr 2024 sind Auto-Scan, Steuergeräte-Software und tatsächlicher SFD-/SFD2-Status vor der Buchung zu prüfen.");
  }
  for (const field of required) {
    if (evidence[field] === "no") {
      status = "blocked";
      reasons.push(EQUIPMENT_LABELS[field] + " laut Angabe nicht vorhanden. Diese Freischaltung kann so nicht direkt gebucht werden.");
    } else if (evidence[field] === "unknown") {
      if (status !== "blocked") status = "review";
      reasons.push(EQUIPMENT_LABELS[field] + " noch ungeklärt.");
    }
  }
  if (matched.length) {
    if (status !== "blocked") status = "review";
    reasons.push("Die Eigenangaben ersetzen keinen Auto-Scan, keine Prüfung der Steuergeräte/Softwarestände und keine technische Freigabe.");
    for (const extra of new Set(matched.map(rule => rule.extra).filter((s): s is string => !!s)))
      reasons.push(extra);
  }
  return { status, required, reasons };
}
