"use client";

import { useEffect } from "react";

type VehiclePrefill = {
  brand: string;
  model: string;
};

const storageKey = "td_vehicle_prefill";

function setSelectValue(select: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
  if (setter) setter.call(select, value);
  else select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function vehicleFromPage(): VehiclePrefill | null {
  const rows = Array.from(document.querySelectorAll("aside dl > div"));
  const values = new Map<string, string>();

  for (const row of rows) {
    const key = row.querySelector("dt")?.textContent?.trim();
    const value = row.querySelector("dd")?.textContent?.trim();
    if (key && value) values.set(key, value);
  }

  const brand = values.get("Marke");
  const model = values.get("Baureihe");
  return brand && model ? { brand, model } : null;
}

export default function VehicleSelectionBridge() {
  useEffect(() => {
    const onVehiclePage = window.location.pathname.startsWith("/fahrzeuge/");

    if (onVehiclePage) {
      const rememberVehicle = (event: Event) => {
        const target = event.target as HTMLElement | null;
        const link = target?.closest<HTMLAnchorElement>('a[href="/#buchen"]');
        if (!link) return;

        const vehicle = vehicleFromPage();
        if (vehicle) window.sessionStorage.setItem(storageKey, JSON.stringify(vehicle));
      };

      document.addEventListener("click", rememberVehicle);
      return () => document.removeEventListener("click", rememberVehicle);
    }

    if (window.location.pathname !== "/") return;

    let prefill: VehiclePrefill | null = null;
    const brandParam = new URLSearchParams(window.location.search).get("brand");
    const modelParam = new URLSearchParams(window.location.search).get("model");

    if (brandParam && modelParam) {
      prefill = { brand: brandParam, model: modelParam };
    } else {
      try {
        const stored = window.sessionStorage.getItem(storageKey);
        if (stored) prefill = JSON.parse(stored) as VehiclePrefill;
      } catch {
        prefill = null;
      }
    }

    if (!prefill?.brand || !prefill.model) return;

    let attempts = 0;
    let brandApplied = false;
    const timer = window.setInterval(() => {
      attempts += 1;
      const root = document.getElementById("konfigurator");
      const selects = root?.querySelectorAll<HTMLSelectElement>("select");
      if (!selects || selects.length < 2) {
        if (attempts > 80) window.clearInterval(timer);
        return;
      }

      const brandSelect = selects[0];
      const modelSelect = selects[1];

      if (!brandApplied) {
        const hasBrand = Array.from(brandSelect.options).some((option) => option.value === prefill?.brand);
        if (!hasBrand) {
          window.clearInterval(timer);
          return;
        }
        setSelectValue(brandSelect, prefill.brand);
        brandApplied = true;
        return;
      }

      const hasModel = Array.from(modelSelect.options).some((option) => option.value === prefill?.model);
      if (!hasModel) {
        if (attempts > 80) window.clearInterval(timer);
        return;
      }

      setSelectValue(modelSelect, prefill.model);
      window.sessionStorage.removeItem(storageKey);
      window.clearInterval(timer);

      window.setTimeout(() => {
        document.getElementById("buchen")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 75);

    return () => window.clearInterval(timer);
  }, []);

  return null;
}
