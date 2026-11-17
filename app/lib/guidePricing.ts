import type { Coding } from "../data/catalog";
import { codingEffortStep } from "./codingEffort";

// Preisstufen für künftige TD-eigene Codier-PDFs. Keine Einbaupreise.
export const guidePriceTiers = [5.99, 7.99, 9.99, 11.99, 13.99, 15.99, 17.99, 19.99] as const;

type GuideCoding = Pick<Coding, "name" | "category" | "uiGroup">;

/**
 * Auch bestehende Standard-Codierungen werden rein nach dem elektronischen
 * Codieraufwand bewertet. Ausdrücke wie "Umbau" und "Nachrüstung" führen
 * nicht mehr pauschal zu einem höheren Preis.
 */
export function guideDifficultyStep(coding: GuideCoding): number {
  return codingEffortStep(coding.name) ?? 0;
}

/** Drei sichtbare Stufen aus den acht Einzelpreisen. */
export function guideDifficultyLevel(step: number): 1 | 2 | 3 {
  if (step <= 2) return 1;
  if (step <= 4) return 2;
  return 3;
}

export function guidePrice(coding: GuideCoding): number {
  return guidePriceTiers[guideDifficultyStep(coding)] ?? guidePriceTiers[0];
}

export function formatGuidePrice(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}
