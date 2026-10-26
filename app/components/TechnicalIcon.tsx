import { Activity, Car, Gauge, Lightbulb, Laptop, LayoutGrid, Monitor, Radar, Settings2, SlidersHorizontal, type LucideIcon } from "lucide-react";

// Shared visual language for service links and configurator categories.
const icons: Record<string, LucideIcon> = {
  Alle: LayoutGrid,
  Komfort: SlidersHorizontal,
  Licht: Lightbulb,
  Infotainment: Monitor,
  Assistenz: Radar,
  Fahrdynamik: Gauge,
  Diagnose: Activity,
  Luftfahrwerk: Settings2,
  Fahrzeug: Car,
  Remote: Laptop,
};

export default function TechnicalIcon({ name, className = "", badge = false }: { name: string; className?: string; badge?: boolean }) {
  const Icon = icons[name] ?? SlidersHorizontal;
  const symbol = <Icon aria-hidden="true" focusable="false" strokeWidth={1.75} className={badge ? "h-6 w-6" : `h-4 w-4 shrink-0 ${className}`} />;
  return badge ? <span aria-hidden="true" className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 ${className}`}>{symbol}</span> : symbol;
}
