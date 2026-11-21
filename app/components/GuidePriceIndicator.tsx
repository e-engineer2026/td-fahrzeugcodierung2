import { Download } from "lucide-react";
import GuideDifficultyBar from "./GuideDifficultyBar";
import { formatGuidePrice } from "../lib/guidePricing";
import type { GuideEstimate } from "../lib/researchGuidePricing";

/** Dokumentstatus und passende Aktion für Prüfunterlagen sowie PDF-Anleitungen. */
export default function GuidePriceIndicator({ estimate, productHref, isProofDocument }: {
  estimate: GuideEstimate;
  productHref?: string;
  isProofDocument?: boolean;
}) {
  const noCoding = estimate.step === null;
  return (
    <div className="shrink-0 text-right" aria-label={noCoding
      ? "Keine Codierung erforderlich, Codierpreis 0,00 Euro"
      : `Preis für das vorgesehene PDF-Dokument: ${formatGuidePrice(estimate.price)}`}>
      <p className="text-sm font-black tabular-nums text-blue-700">{formatGuidePrice(estimate.price)}</p>
      {noCoding
        ? <p className="text-[11px] font-medium text-slate-600">Keine Codierung</p>
        : <>
            <p className="text-[10px] leading-4 text-slate-500">{isProofDocument ? "PDF-Prüfunterlage" : "PDF-Dokument"}</p>
            <GuideDifficultyBar level={estimate.level!} />
          </>
      }
      {productHref
        ? <a href={productHref}
            className="mt-1.5 inline-flex min-h-8 w-full items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100">
            <Download size={13} aria-hidden="true" /> PDF-Download
          </a>
        : <button type="button" disabled title="Für diese Funktion ist noch keine kaufbare PDF hinterlegt."
            aria-label="PDF noch nicht verfügbar"
            className="mt-1.5 inline-flex min-h-8 w-full cursor-not-allowed items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 opacity-75">
            <Download size={13} aria-hidden="true" /> In Vorbereitung
          </button>}
    </div>
  );
}
