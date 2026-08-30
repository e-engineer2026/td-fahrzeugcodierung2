"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

function cleanLabel(value: string | null | undefined) {
  return (value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function safeTarget(url: URL) {
  const local = typeof window !== "undefined" && url.origin === window.location.origin;
  return `${local ? "" : url.hostname}${url.pathname}${url.hash}`.slice(0, 160);
}

export default function ConversionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const origin = event.target as Element | null;
      const element = origin?.closest("a,button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!element) return;

      const label = cleanLabel(element.textContent);

      if (element instanceof HTMLAnchorElement) {
        let url: URL;
        try {
          url = new URL(element.href, window.location.href);
        } catch {
          return;
        }

        const target = safeTarget(url);
        const protocol = url.protocol;
        const host = url.hostname.toLowerCase();
        const path = url.pathname;

        if (host === "cal.com") {
          track("BookingStart", {
            mode: path.includes("remote-codierung") ? "remote" : "onsite",
            target,
          });
          return;
        }

        if (host === "paypal.me") {
          track("PaymentClick", { provider: "paypal", target });
          return;
        }

        if (host === "wa.me" || host === "api.whatsapp.com") {
          track("WhatsAppClick", { target });
          return;
        }

        if (protocol === "tel:") {
          track("PhoneClick");
          return;
        }

        if (protocol === "mailto:") {
          track("EmailClick");
          return;
        }

        if (path === "/fahrzeuge") {
          track("VehicleOverviewClick", { target });
          return;
        }

        if (path.startsWith("/fahrzeuge/") && path.split("/").filter(Boolean).length >= 3) {
          track("VehiclePageClick", { target });
          return;
        }

        if (url.hash === "#buchen") {
          track("BookingSectionClick", { label: label || "Termin buchen" });
          return;
        }

        if (url.hash === "#kontakt") {
          track("ContactSectionClick", { label: label || "Kontakt" });
        }
        return;
      }

      const normalized = label.toLowerCase();
      if (normalized.includes("remote-codierung")) {
        track("BookingModeSelect", { mode: "remote" });
      } else if (normalized.includes("vor ort in leipzig")) {
        track("BookingModeSelect", { mode: "onsite" });
      }
    };

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      track("FormSubmit", {
        form: cleanLabel(form.getAttribute("aria-label") || form.id || "Kontaktformular") || "Kontaktformular",
      });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  return null;
}
