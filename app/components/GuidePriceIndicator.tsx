import GuideDifficultyBar from "./GuideDifficultyBar";
import { formatGuidePrice } from "../lib/guidePricing";
import type { GuideEstimate } from "../lib/researchGuidePricing";

/** Preisidee für den Codieranteil einer künftigen, TD-eigenen PDF-Anleitung. */
export default function GuidePriceIndicator({ estimate }: { estimate: GuideEstimate }) {
  const noCoding = estimate.step === null;
  return (
    <div className="shrink-0 text-right" aria-label={noCoding
      ? "Keine Codierung erforderlich, Codierpreis 0,00 Euro"
      : `Geplanter TD-PDF-Preis nach Codieraufwand: ${formatGuidePrice(estimate.price)}`}>
      <p className="text-sm font-black tabular-nums text-blue-700">{formatGuidePrice(estimate.price)}</p>
      {noCoding
        ? <p className="text-[11px] font-medium text-slate-600">Keine Codierung</p>
        : <>
            <p className="text-[10px] leading-4 text-slate-500">PDF-Preisidee</p>
            <GuideDifficultyBar level={estimate.level!} />
          </>
      }
    </div>
  );
}
