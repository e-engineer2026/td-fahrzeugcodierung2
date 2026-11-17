import type { ResearchGuide } from "../data/guideResearch";
import type { ReferenceIdea } from "../data/referenceIdeas";
import { codingEffortStep } from "./codingEffort";
import { guideDifficultyLevel, guidePriceTiers } from "./guidePricing";

/**
 * Der geplante TD-PDF-Preis hängt ausschließlich vom Codieraufwand ab,
 * nicht von Einbauzeit, Bauteilen oder dem Aufwand des mechanischen Umbaus.
 * null bedeutet nach Quelle ausdrücklich codierfrei (Anzeige 0,00 €).
 */
export type GuideEstimate = {
  step: number | null;
  level: 1 | 2 | 3 | null;
  price: number;
};

function estimate(title: string, note: string, id: string): GuideEstimate {
  const step = codingEffortStep(title, note, id);
  if (step === null) return { step: null, level: null, price: 0 };
  return {
    step,
    level: guideDifficultyLevel(step),
    price: guidePriceTiers[step]
  };
}

export function researchGuideEstimate(guide: ResearchGuide): GuideEstimate {
  return estimate(guide.title, guide.note, guide.id);
}

export function referenceIdeaEstimate(idea: ReferenceIdea): GuideEstimate {
  return estimate(idea.title, idea.note, idea.id);
}
