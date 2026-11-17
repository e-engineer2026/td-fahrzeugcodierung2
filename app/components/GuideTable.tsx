import { ChevronDown } from "lucide-react";
import GuidePriceIndicator from "./GuidePriceIndicator";
import type { GuideEstimate } from "../lib/researchGuidePricing";

export type GuideTableEntry = {
  id: string;
  title: string;
  hardware: string;
  description: string;
  estimate: GuideEstimate;
};

/** Einheitliche Tabelle für alle vier Anleitungsbereiche, auch auf Mobilgeräten. */
export default function GuideTable({ entries }: { entries: GuideTableEntry[] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
          <tr>
            <th scope="col" className="w-[65%] px-3 py-3 sm:w-[43%] sm:px-4">Funktion</th>
            <th scope="col" className="hidden px-3 py-3 sm:table-cell sm:w-[34%]">Hardware</th>
            <th scope="col" className="w-[35%] px-2 py-3 text-right sm:w-[23%] sm:px-4">PDF-Preis</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="min-w-0 px-3 py-3 align-top sm:px-4">
                <p className="break-words text-sm font-bold leading-5 text-slate-950">{entry.title}</p>
                <p className="mt-1.5 break-words text-xs leading-5 text-slate-600 sm:hidden">
                  <span className="font-semibold text-slate-800">Hardware:</span> {entry.hardware}
                </p>
                <details className="group mt-2">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-blue-700 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden">
                    Beschreibung
                    <ChevronDown size={14} className="transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-1 whitespace-pre-line break-words text-xs leading-5 text-slate-600">
                    {entry.description || "Keine zusätzliche Beschreibung hinterlegt."}
                  </p>
                </details>
              </td>
              <td className="hidden break-words px-3 py-3 align-top text-xs leading-5 text-slate-700 sm:table-cell">
                {entry.hardware}
              </td>
              <td className="px-2 py-3 align-top sm:px-4">
                <GuidePriceIndicator estimate={entry.estimate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
