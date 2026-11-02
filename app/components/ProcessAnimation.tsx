"use client";

import { useEffect } from "react";

export default function ProcessAnimation() {
  useEffect(() => {
    const section = document.getElementById("ablauf");
    if (!section || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return null;
}
