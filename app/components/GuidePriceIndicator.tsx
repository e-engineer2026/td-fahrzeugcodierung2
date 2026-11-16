import GuideDifficultyBar from "./GuideDifficultyBar";
import { formatGuidePrice } from "../lib/guidePricing";
import type { GuideEstimate } from "../lib/researchGuidePricing";

/** Kalkulation für künftige, eigenständig erstellte TD-Anleitungen. */
export default function GuidePriceIndicator({ estimate }: { estimate: GuideEstimate }) {
  return (
    <div className="shrink-0 text-right" aria-label={`Geplanter TD-PDF-Preis: ${formatGuidePrice(estimate.price)}`}>
      <p className="text-sm font-black tabular-nums text-blue-700">{formatGuidePrice(estimate.price)}</p>
      <p className="text-[10px] leading-4 text-slate-500">PDF-Preisidee</p>
      <GuideDifficultyBar level={estimate.level} />
    </div>
  );
}
