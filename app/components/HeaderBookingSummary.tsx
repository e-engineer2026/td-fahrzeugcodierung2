"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

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

  return (
    <a
      href={count ? "#termin-zahlung" : "#fahrzeugauswahl"}
      className="td-header-icon td-cart-icon"
      aria-label={`${count} ${count === 1 ? "Codierung" : "Codierungen"} gewählt, ${count ? "Auswahl öffnen" : "Fahrzeug auswählen"}`}
    >
      <ShoppingCart aria-hidden="true" />
      <span className="td-cart-count" aria-hidden="true">{count}</span>
    </a>
  );
}
