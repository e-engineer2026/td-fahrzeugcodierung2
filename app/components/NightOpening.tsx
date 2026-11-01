"use client";

import { useEffect } from "react";

export default function NightOpening() {
  useEffect(() => {
    const home = document.querySelector(".td-home");
    const timer = window.setTimeout(() => home?.classList.remove("td-intro-night"), 2000);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
