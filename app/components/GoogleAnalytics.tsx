"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CONSENT_KEY = "td_ga_consent";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getGtag() {
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function (...args: unknown[]) {
    w.dataLayer?.push(args);
  };
  return w.gtag;
}

function gtagEvent(name: string, params?: Record<string, string | number | boolean>) {
  getGtag()("event", name, params || {});
}

function updateConsent(value: "granted" | "denied") {
  getGtag()("consent", "update", {
    analytics_storage: value,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<"granted" | "denied" | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") {
      setChoice(stored);
      updateConsent(stored);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    if (choice !== "granted" || !pathname) return;
    gtagEvent("page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
      page_title: document.title,
    });
  }, [choice, pathname]);

  useEffect(() => {
    if (choice !== "granted") return;

    const onClick = (event: MouseEvent) => {
      const source = event.target as Element | null;
      const element = source?.closest("a,button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!element) return;

      const label = (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);

      if (element instanceof HTMLAnchorElement) {
        const href = element.getAttribute("href") || "";

        if (href.startsWith("tel:")) {
          gtagEvent("phone_click");
          return;
        }
        if (href.startsWith("mailto:")) {
          gtagEvent("email_click");
          return;
        }

        let url: URL;
        try {
          url = new URL(element.href, window.location.href);
        } catch {
          return;
        }

        const host = url.hostname.toLowerCase();
        const path = url.pathname;

        if (host === "cal.com") {
          gtagEvent("booking_start", {
            booking_mode: path.includes("remote-codierung") ? "remote" : "onsite",
          });
          return;
        }
        if (host === "wa.me" || host === "api.whatsapp.com") {
          gtagEvent("whatsapp_click");
          return;
        }
        if (host === "paypal.me") {
          gtagEvent("payment_click", { provider: "paypal" });
          return;
        }
        if (path.startsWith("/fahrzeuge/") && path.split("/").filter(Boolean).length >= 3) {
          gtagEvent("vehicle_page_click", { vehicle_path: path.slice(0, 120) });
          return;
        }
        if (url.hash === "#buchen") {
          gtagEvent("booking_section_click");
          return;
        }
        if (url.hash === "#kontakt") {
          gtagEvent("contact_section_click");
        }
        return;
      }

      const normalized = label.toLowerCase();
      if (normalized.includes("remote-codierung")) {
        gtagEvent("booking_mode_select", { booking_mode: "remote" });
      } else if (normalized.includes("vor ort in leipzig")) {
        gtagEvent("booking_mode_select", { booking_mode: "onsite" });
      }
    };

    const onSubmit = () => gtagEvent("contact_form_submit");

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [choice]);

  const saveChoice = (value: "granted" | "denied") => {
    window.localStorage.setItem(CONSENT_KEY, value);
    updateConsent(value);
    setChoice(value);
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <div className="fixed inset-x-3 bottom-20 z-[100] mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl md:bottom-4 sm:p-5">
          <div className="text-base font-black text-slate-900">Analyse-Einstellungen</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Google Consent Mode startet mit verweigerter Analyse- und Werbespeicherung. Mit deiner Zustimmung erlaubst du Google Analytics, Seitenaufrufe und wichtige Aktionen wie Termin-, WhatsApp- und Kontaktklicks auszuwerten.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => saveChoice("granted")} className="btn-primary w-full sm:w-auto">
              Analyse erlauben
            </button>
            <button type="button" onClick={() => saveChoice("denied")} className="btn-secondary w-full sm:w-auto">
              Nur notwendige
            </button>
            <a href="/datenschutz" className="inline-flex items-center justify-center px-3 py-2 text-sm font-semibold text-blue-700 hover:underline">
              Datenschutz
            </a>
          </div>
        </div>
      )}

      {!showBanner && (
        <button
          type="button"
          onClick={() => setShowBanner(true)}
          className="fixed bottom-20 left-3 z-40 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur md:bottom-3"
        >
          Analyse-Einstellungen
        </button>
      )}
    </>
  );
}
