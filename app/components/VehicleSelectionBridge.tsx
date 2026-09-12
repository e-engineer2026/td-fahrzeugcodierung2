"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type VehiclePrefill = {
  brand: string;
  model: string;
  year?: number;
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
  const pathname = usePathname();

  useEffect(() => {
    const onVehiclePage = pathname.startsWith("/fahrzeuge/");

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

    if (pathname !== "/") return;

    let prefill: VehiclePrefill | null = null;
    const params = new URLSearchParams(window.location.search);
    const brandParam = params.get("brand");
    const modelParam = params.get("model");
    const yearParam = Number(params.get("year") || 0);

    if (brandParam && modelParam) {
      prefill = { brand: brandParam, model: modelParam, year: yearParam || undefined };
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
    let modelApplied = false;

    const finish = (timer: number) => {
      window.sessionStorage.removeItem(storageKey);
      window.clearInterval(timer);
      const cleaned = new URL(window.location.href);
      cleaned.searchParams.delete("brand");
      cleaned.searchParams.delete("model");
      cleaned.searchParams.delete("year");
      window.history.replaceState({}, "", `${cleaned.pathname}${cleaned.search}${cleaned.hash || "#buchen"}`);
      window.setTimeout(() => {
        document.getElementById("buchen")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    };

    const timer = window.setInterval(() => {
      attempts += 1;
      const root = document.getElementById("konfigurator");
      const selects = root?.querySelectorAll<HTMLSelectElement>("select");
      if (!selects || selects.length < 2) {
        if (attempts > 100) window.clearInterval(timer);
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

      if (!modelApplied) {
        const hasModel = Array.from(modelSelect.options).some((option) => option.value === prefill?.model);
        if (!hasModel) {
          if (attempts > 100) window.clearInterval(timer);
          return;
        }
        setSelectValue(modelSelect, prefill.model);
        modelApplied = true;
        if (!prefill.year) finish(timer);
        return;
      }

      if (!prefill.year || selects.length < 3) return;
      const yearSelect = selects[2];
      const yearValue = String(prefill.year);
      const hasYear = Array.from(yearSelect.options).some((option) => option.value === yearValue);
      if (!hasYear) {
        if (attempts > 100) finish(timer);
        return;
      }

      setSelectValue(yearSelect, yearValue);
      finish(timer);
    }, 75);

    return () => window.clearInterval(timer);
  }, [pathname]);

  return null;
}
