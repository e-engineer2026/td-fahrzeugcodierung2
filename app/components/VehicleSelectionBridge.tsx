"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { vehicles } from "../data/catalog";
import { homeVehicleReadyEvent, homeVehicleSelectedEvent, resolveHomeVehicleSelection, vehiclePrefillStorageKey } from "../lib/homeVehicleSelection";

export default function VehicleSelectionBridge() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const params = new URLSearchParams(window.location.search);
    let candidate: unknown = null;

    if (params.has("brand") || params.has("model")) {
      candidate = { brand: params.get("brand"), model: params.get("model"), year: params.get("year"), mode: params.get("mode") };
    } else {
      try {
        const stored = window.sessionStorage.getItem(vehiclePrefillStorageKey);
        if (stored) candidate = JSON.parse(stored);
      } catch { /* URL preselection works even when browser storage is blocked. */ }
    }

    const selection = resolveHomeVehicleSelection(candidate, vehicles);
    if (!selection) return;
    let applied = false;

    const apply = () => {
      if (applied || document.getElementById("konfigurator")?.dataset.vehicleReady !== "true") return;
      applied = true;
      window.dispatchEvent(new CustomEvent(homeVehicleSelectedEvent, { detail: selection }));
      try { window.sessionStorage.removeItem(vehiclePrefillStorageKey); } catch { /* Optional storage. */ }
      const cleaned = new URL(window.location.href);
      for (const key of ["brand", "model", "year", "mode"]) cleaned.searchParams.delete(key);
      window.history.replaceState(window.history.state, "", `${cleaned.pathname}${cleaned.search}${selection.year ? "#buchen" : "#fahrzeugauswahl"}`);
      window.removeEventListener(homeVehicleReadyEvent, apply);
    };

    window.addEventListener(homeVehicleReadyEvent, apply);
    apply();
    return () => window.removeEventListener(homeVehicleReadyEvent, apply);
  }, [pathname]);

  return null;
}
