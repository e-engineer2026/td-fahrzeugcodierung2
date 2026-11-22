import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import GuidePriceIndicator from "./GuidePriceIndicator";
import type { GuideEstimate } from "../lib/researchGuidePricing";
import type { GuideInterfaceResult } from "../lib/guideInterface";

export type GuideTableRow = {
  id: string;
  title: string;
  diagnosticInterface: GuideInterfaceResult;
  requirements: string | null;
  description: string | null;
  estimate: GuideEstimate;
  productHref?: string;
  documentSlug?: string;
  isProofDocument?: boolean;
};

export type RenderDocumentActions = (slug: string) => ReactNode;

/** Einheitliche Darstellung; Werkzeuge nur mit ausgewiesener Eignung nennen. */
export default function GuideTable({ rows, renderDocumentActions }: {
  rows: GuideTableRow[];
  renderDocumentActions?: RenderDocumentActions;
}) {
  if (!rows.length) return null;
  return (
    <div role="table" aria-label="Professionelle PDF-Codieranleitungen" className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div role="rowgroup">
        <div role="row" className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_128px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 sm:grid">
          <div role="columnheader">Funktion</div>
          <div role="columnheader">Interface</div>
          <div role="columnheader" className="text-right">PDF-Dokument</div>
        </div>
        {rows.map((row) => (
          <div key={row.id} role="row"
            className="grid grid-cols-[minmax(0,1fr)_112px] gap-x-3 gap-y-2 border-b border-slate-100 px-3 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_128px] sm:gap-4 sm:px-4">
            <div role="cell" className="min-w-0">
              <p className="text-sm font-bold leading-5 text-slate-900">{row.title}</p>
              {(row.description || row.requirements || row.diagnosticInterface.qualification) && (
                <details className="group mt-1.5">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
                    Beschreibung
                    <ChevronDown size={14} aria-hidden="true" className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 space-y-2 text-xs leading-5 text-slate-600">
                    {row.description && <p><strong className="text-slate-800">Funktion:</strong> {row.description}</p>}
                    {row.isProofDocument && <p><strong className="text-slate-800">PDF-Prüfunterlage:</strong> Golf 7/7.5 als Referenz. Die Eignung ist je Fahrzeug zu prüfen.</p>}
                    <p><strong className="text-slate-800">Hardware / Voraussetzungen:</strong> {row.requirements || "Fahrzeugspezifisch prüfen"}</p>
                    <p><strong className="text-slate-800">Interface-Hinweis:</strong> {row.diagnosticInterface.qualification}</p>
                  </div>
                </details>
              )}
            </div>
            <div role="cell" className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1">
              <p className="text-[11px] font-semibold text-slate-600 sm:sr-only">Interface</p>
              <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-700 sm:mt-0" title={row.diagnosticInterface.qualification}>{row.diagnosticInterface.label}</p>
              {row.diagnosticInterface.sfdNotice && <p className="mt-1 text-[11px] leading-4 text-amber-800">{row.diagnosticInterface.sfdNotice}</p>}
            </div>
            <div role="cell" className="col-start-2 row-start-1 flex justify-end sm:col-start-3">
              <GuidePriceIndicator estimate={row.estimate} productHref={row.productHref} isProofDocument={row.isProofDocument}
                showDownload={!renderDocumentActions || !row.documentSlug} />
            </div>
            {row.documentSlug && renderDocumentActions && <div role="cell" className="col-span-full">
              {renderDocumentActions(row.documentSlug)}
            </div>}
          </div>
        ))}
      </div>
    </div>
  );
}
