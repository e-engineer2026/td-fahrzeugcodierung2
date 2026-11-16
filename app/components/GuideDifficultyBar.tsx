type DifficultyLevel = 1 | 2 | 3;

const difficultyLabels: Record<DifficultyLevel, string> = {
  1: "Leicht",
  2: "Mittel",
  3: "Schwer",
};

/** Kompakter dreigeteilter Schwierigkeitsbalken: Grün / Gelb / Rot. */
export default function GuideDifficultyBar({ level }: { level: DifficultyLevel }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={`Schwierigkeit: ${difficultyLabels[level]}`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        <span className="h-1.5 w-3.5 rounded-sm bg-emerald-500" />
        <span className={`h-1.5 w-3.5 rounded-sm ${level >= 2 ? "bg-amber-400" : "bg-amber-100"}`} />
        <span className={`h-1.5 w-3.5 rounded-sm ${level >= 3 ? "bg-red-500" : "bg-red-100"}`} />
      </span>
      <span className="text-xs font-medium text-slate-600">{difficultyLabels[level]}</span>
    </span>
  );
}
