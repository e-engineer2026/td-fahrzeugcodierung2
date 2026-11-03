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
  const [summaryVehicle, setSummaryVehicle] = useState("");
  const [summaryPrice, setSummaryPrice] = useState("");
  const [progress, setProgress] = useState({ value: 0, target: 50, label: "" });
  const [calendarUrl, setCalendarUrl] = useState("/#kontakt");
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/4915563047044");

  useEffect(() => {
    const update = () => {
      const configurator = document.querySelector<HTMLElement>("#konfigurator");

      const count = Number(configurator?.dataset.selectionCount ?? 0);
      const calUrl = configurator?.dataset.calUrl;
      const selected = count > 0;

      setHasSelection(selected);
      setSummaryVehicle(selected ? `${configurator?.dataset.vehicle || "Fahrzeug"} · ${count} ${count === 1 ? "Codierung" : "Codierungen"}` : "");
      setSummaryPrice(selected ? `Rabatt: −${configurator?.dataset.discount || "0,00"} € · Gesamt: ${configurator?.dataset.total || "0,00"} €` : "");
      const subtotalValue = Number((configurator?.dataset.subtotal || "0").replace(/\./g, "").replace(",", ".")) || 0;
      const nextTier = Number(configurator?.dataset.nextTier || 200);
      const nextDifference = configurator?.dataset.nextDifference || "0,00";
      const nextRate = nextTier === 50 ? 10 : nextTier === 100 ? 15 : nextTier === 150 ? 20 : 25;
      setProgress({ value: Math.min(subtotalValue, nextTier), target: nextTier, label: configurator?.dataset.nextTier ? `Noch ${nextDifference} € bis ${nextRate} % Rabatt` : "25 % Maximalrabatt erreicht" });
      setCalendarUrl(selected && calUrl ? "#termin-zahlung" : "/#kontakt");

      if (selected && configurator) {
        const codings = JSON.parse(configurator.dataset.codings || "[]") as string[];
        const vehicle = configurator.dataset.vehicle || "Fahrzeug";
        const subtotal = configurator.dataset.subtotal ?? "0,00";
        const discount = configurator.dataset.discount ?? "0,00";
        const total = configurator.dataset.total ?? "0,00";
        const lines = [
          "Hallo, ich möchte folgende Codierungen anfragen:",
          "",
          `Terminart: ${configurator.dataset.bookingMode === "remote" ? "Remote-Codierung" : "Vor Ort in Leipzig-Süd"}`,
          `Fahrzeug: ${vehicle}`,
          "Codierungen:",
          ...codings.map((coding) => `• ${coding}`),
          "",
          `Normalpreis: ${subtotal} €`,
          `Rabatt: -${discount} €`,
          ...(Number((configurator.dataset.sfdFee || "0").replace(",", ".")) > 0 ? [`Im Normalpreis enthalten: SFD1-Freischaltung ${configurator.dataset.sfdFee} € (Aktionsrabatt berücksichtigt).`] : []),
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
        "data-codings",
        "data-cal-url",
        "data-vehicle",
        "data-subtotal",
        "data-discount",
        "data-total",
        "data-booking-mode",
        "data-sfd-fee",
        "data-next-tier",
        "data-next-difference",
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
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 px-2 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        {hasSelection && <div className="mx-auto mb-1 max-w-lg px-1 text-xs leading-4 text-slate-700" aria-live="polite"><div className="truncate font-semibold">{summaryVehicle}</div><div className="font-bold text-blue-700">{summaryPrice}</div></div>}
        {hasSelection && <div className="mx-auto mb-2 max-w-lg px-1">
          <div className="text-xs font-semibold leading-4 text-blue-700">{progress.label}</div>
          <div className="td-discount-track !mt-1" role="progressbar" aria-label="Fortschritt zur nächsten Rabattstufe" aria-valuemin={0} aria-valuemax={progress.target} aria-valuenow={progress.value} aria-valuetext={progress.label}><div style={{ width: `${progress.value / progress.target * 100}%` }} /></div>
        </div>}
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track(hasSelection ? "mobile_whatsapp_selection" : "mobile_whatsapp")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-2 text-xs font-bold text-white"
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
            onClick={() => track(hasSelection ? "mobile_appointment_inquiry" : "mobile_direct_inquiry")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-2 text-xs font-bold text-white"
          >
            {hasSelection ? "Termin anfragen" : "Direktanfrage"}
          </a>
        </div>
      </div>
      <div className={hasSelection ? "h-36 md:hidden" : "h-20 md:hidden"} aria-hidden="true" />
    </>
  );
}
