import { ChevronDown } from "lucide-react";
import GuidePriceIndicator from "./GuidePriceIndicator";
import type { GuideEstimate } from "../lib/researchGuidePricing";

export type GuideTableRow = {
  id: string;
  title: string;
  hardware: string | null;
  description: string;
  estimate: GuideEstimate;
};

/** Eine responsive, neutrale Tabelle für alle vier Anleitungsbereiche. */
export default function GuideTable({ rows }: { rows: GuideTableRow[] }) {
  if (!rows.length) return null;
  return (
    <div role="table" aria-label="PDF-Anleitungen" className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div role="rowgroup">
        <div role="row" className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_128px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 sm:grid">
          <div role="columnheader">Funktion</div>
          <div role="columnheader">Hardware</div>
          <div role="columnheader" className="text-right">PDF-Preis</div>
        </div>
        {rows.map((row) => (
          <div key={row.id} role="row"
            className="grid grid-cols-[minmax(0,1fr)_112px] gap-x-3 gap-y-2 border-b border-slate-100 px-3 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_128px] sm:gap-4 sm:px-4">
            <div role="cell" className="min-w-0">
              <p className="text-sm font-bold leading-5 text-slate-900">{row.title}</p>
              <details className="group mt-1.5">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
                  Beschreibung
                  <ChevronDown size={14} aria-hidden="true" className="transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-xs leading-5 text-slate-600">{row.description}</p>
              </details>
            </div>
            <div role="cell" className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1">
              <p className="text-[11px] font-semibold text-slate-600 sm:sr-only">Hardware</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-700 sm:mt-0">{row.hardware ?? "Nicht gesondert angegeben"}</p>
            </div>
            <div role="cell" className="col-start-2 row-start-1 flex justify-end sm:col-start-3">
              <GuidePriceIndicator estimate={row.estimate} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
