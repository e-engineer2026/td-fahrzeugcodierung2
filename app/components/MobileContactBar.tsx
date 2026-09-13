"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";

function track(channel: string) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "contact_clicked", { channel });
}

export default function MobileContactBar() {
  const [hasSelection, setHasSelection] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState("/#kontakt");
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/4915563047044");

  useEffect(() => {
    const update = () => {
      const configurator = document.querySelector<HTMLElement>("#konfigurator");
      const section = configurator?.querySelector<HTMLElement>(":scope > section:nth-of-type(3)");
      const count = Number(configurator?.dataset.selectionCount ?? 0);
      const calUrl = configurator?.dataset.calUrl;
      const selected = count > 0;

      setHasSelection(selected);
      setCalendarUrl(selected && calUrl ? calUrl : "/#kontakt");

      if (selected && configurator && section) {
        const codings = Array.from(section.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'))
          .map((input) => input.nextElementSibling?.textContent?.trim() ?? "")
          .filter(Boolean);
        const vehicle = configurator.dataset.vehicle || "Fahrzeug";
        const subtotal = configurator.dataset.subtotal ?? "0,00";
        const discount = configurator.dataset.discount ?? "0,00";
        const total = configurator.dataset.total ?? "0,00";
        const lines = [
          "Hallo, ich möchte folgende Codierungen anfragen:",
          "",
          `Fahrzeug: ${vehicle}`,
          "Codierungen:",
          ...codings.map((coding) => `• ${coding}`),
          "",
          `Normalpreis: ${subtotal} €`,
          `Rabatt: -${discount} €`,
          `Mein Preis: ${total} €`,
          "",
          "Bitte kurz Machbarkeit und Termin bestätigen.",
        ];
        setWhatsappUrl(`https://wa.me/4915563047044?text=${encodeURIComponent(lines.join("\n"))}`);
      } else {
        setWhatsappUrl("https://wa.me/4915563047044");
      }
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "data-selection-count",
        "data-cal-url",
        "data-vehicle",
        "data-subtotal",
        "data-discount",
        "data-total",
      ],
    });
    document.addEventListener("change", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("change", update);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track(hasSelection ? "mobile_whatsapp_selection" : "mobile_whatsapp")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 text-xs font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" /> {hasSelection ? "Auswahl senden" : "WhatsApp"}
          </a>
          <a
            href="tel:+4915563047044"
            onClick={() => track("mobile_phone")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-2 text-xs font-bold text-white"
          >
            <Phone className="h-4 w-4" /> Anrufen
          </a>
          <a
            href={calendarUrl}
            target={hasSelection ? "_blank" : undefined}
            rel={hasSelection ? "noreferrer" : undefined}
            onClick={() => track(hasSelection ? "mobile_appointment_inquiry" : "mobile_direct_inquiry")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-2 text-xs font-bold text-white"
          >
            {hasSelection ? "Termin anfragen" : "Direktanfrage"}
          </a>
        </div>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
