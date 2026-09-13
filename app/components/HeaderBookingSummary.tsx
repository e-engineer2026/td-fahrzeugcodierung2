"use client";

import { useEffect, useState } from "react";

export default function HeaderBookingSummary() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const source = document.getElementById("konfigurator");
      setCount(Number(source?.dataset.selectionCount ?? 0));
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-selection-count"] });
    return () => observer.disconnect();
  }, []);

  if (!count) return null;

  return (
    <a
      href="#konfigurator"
      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
      aria-label={`${count} Codierungen gewählt, Auswahl öffnen`}
    >
      {count} {count === 1 ? "Codierung" : "Codierungen"}
    </a>
  );
}
