import { Download } from "lucide-react";
import GuideDifficultyBar from "./GuideDifficultyBar";
import { formatGuidePrice } from "../lib/guidePricing";
import type { GuideEstimate } from "../lib/researchGuidePricing";

/** PDF-Dokumentanzeige: Download bleibt bis zur Veröffentlichung und Zahlungsfreigabe deaktiviert. */
export default function GuidePriceIndicator({ estimate }: { estimate: GuideEstimate }) {
  const noCoding = estimate.step === null;
  return (
    <div className="shrink-0 text-right" aria-label={noCoding
      ? "Keine Codierung erforderlich, Codierpreis 0,00 Euro"
      : `Preis für das vorgesehene PDF-Dokument: ${formatGuidePrice(estimate.price)}`}>
      <p className="text-sm font-black tabular-nums text-blue-700">{formatGuidePrice(estimate.price)}</p>
      {noCoding
        ? <p className="text-[11px] font-medium text-slate-600">Keine Codierung</p>
        : <>
            <p className="text-[10px] leading-4 text-slate-500">PDF-Dokument</p>
            <GuideDifficultyBar level={estimate.level!} />
          </>
      }
      <button
        type="button"
        disabled
        title="PDF-Dokument noch nicht zum Download verfügbar"
        aria-label="Download noch nicht verfügbar"
        className="mt-1.5 inline-flex min-h-8 w-full cursor-not-allowed items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 opacity-75"
      >
        <Download size={13} aria-hidden="true" />
        Download
      </button>
    </div>
  );
}
