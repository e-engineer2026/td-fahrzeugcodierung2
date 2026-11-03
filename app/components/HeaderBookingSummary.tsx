"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function HeaderBookingSummary() {
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(0);

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

  useEffect(() => {
    const animate = () => {
      setPulse((value) => value + 1);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const from = document.activeElement?.getBoundingClientRect();
      const target = document.querySelector(".td-cart-icon")?.getBoundingClientRect();
      if (!from || !target || !target.width || !target.height) return;
      const dot = document.createElement("span");
      dot.className = "td-cart-flight";
      dot.style.left = `${from.left + from.width / 2}px`; dot.style.top = `${from.top + from.height / 2}px`;
      document.body.appendChild(dot);
      const animation = dot.animate([{ transform: "translate(0, 0) scale(1)", opacity: 1 }, { transform: `translate(${target.left + target.width / 2 - from.left - from.width / 2}px, ${target.top + target.height / 2 - from.top - from.height / 2}px) scale(.3)`, opacity: 0 }], { duration: 650, easing: "ease-in-out" });
      animation.onfinish = () => dot.remove(); animation.oncancel = () => dot.remove();
    };
    window.addEventListener("td-coding-added", animate);
    return () => window.removeEventListener("td-coding-added", animate);
  }, []);

  return (
    <a
      href={count ? "#termin-zahlung" : "#konfigurator"}
      className="td-header-icon td-cart-icon"
      aria-label={`${count} Codierungen gewählt, Auswahl öffnen`}
    >
      <ShoppingCart aria-hidden="true" />
      <span key={`${count}-${pulse}`} className="td-cart-count td-cart-animate" aria-hidden="true">{count}</span>
    </a>
  );
}
