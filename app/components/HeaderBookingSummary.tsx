"use client";

import { useEffect, useState } from "react";

export default function HeaderBookingSummary() {
  const [summary, setSummary] = useState<{ count: number; total: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>("#buchen .booking-flow > section:nth-of-type(3) .border-blue-200.bg-blue-50")
      );
      const source = candidates.find((element) => /Codierung\(en\) gewählt/.test(element.textContent ?? ""));
      const text = source?.textContent ?? "";
      const countMatch = text.match(/(\d+)\s+Codierung\(en\) gewählt/);
      const totalMatch = text.match(/([\d.]+,\d{2})\s*€\s*gesamt/);

      if (!countMatch || !totalMatch) {
        setSummary(null);
        return;
      }

      setSummary({ count: Number(countMatch[1]), total: totalMatch[1] });
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  if (!summary) return null;

  return (
    <a
      href="#konfigurator"
      className="flex min-w-[92px] flex-col items-end rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-right leading-tight text-blue-800 transition hover:border-blue-300 hover:bg-blue-100 sm:min-w-0 sm:flex-row sm:items-center sm:gap-2 sm:px-3 sm:py-2"
      aria-label={`${summary.count} Codierungen gewählt, Gesamtpreis ${summary.total} Euro`}
    >
      <span className="text-[11px] font-bold sm:text-sm">{summary.count} gewählt</span>
      <span className="text-sm font-black sm:text-base">{summary.total} €</span>
    </a>
  );
}
