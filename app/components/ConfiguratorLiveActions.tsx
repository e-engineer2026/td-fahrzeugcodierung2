"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MessageCircle } from "lucide-react";

type Snapshot = {
  count: number;
  subtotal: string;
  discount: string;
  total: string;
  rate: number;
  nextTier: string;
  nextDifference: string;
  mode: "onsite" | "remote";
  calUrl: string;
  vehicle: string;
  codings: string[];
};

const onsiteCalendar = "https://cal.com/timo-drechsler-lej6jm/vag-codierung-vor-ort";

function readSnapshot(): Snapshot | null {
  const configurator = document.querySelector<HTMLElement>("#konfigurator");
  const section = configurator?.querySelector<HTMLElement>(":scope > section:nth-of-type(3)");
  if (!configurator || !section) return null;

  const count = Number(configurator.dataset.selectionCount ?? 0);

  if (!count) return null;

  const codings = Array.from(section.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'))
    .map((input) => input.nextElementSibling?.textContent?.trim() ?? "")
    .filter(Boolean);

  return {
    count,
    subtotal: configurator.dataset.subtotal ?? "0,00",
    discount: configurator.dataset.discount ?? "0,00",
    total: configurator.dataset.total ?? "0,00",
    rate: Number(configurator.dataset.discountRate ?? 0),
    nextTier: configurator.dataset.nextTier ?? "",
    nextDifference: configurator.dataset.nextDifference ?? "",
    mode: configurator.dataset.bookingMode === "remote" ? "remote" : "onsite",
    calUrl: configurator.dataset.calUrl ?? onsiteCalendar,
    vehicle: configurator.dataset.vehicle || "Fahrzeug",
    codings,
  };
}

export default function ConfiguratorLiveActions() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    const update = () => setSnapshot(readSnapshot());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
    document.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("change", update);
    };
  }, []);

  const whatsappUrl = useMemo(() => {
    if (!snapshot) return "https://wa.me/4915563047044";
    const lines = [
      "Hallo, ich möchte folgende Codierungen anfragen:",
      "",
      `Fahrzeug: ${snapshot.vehicle}`,
      "Codierungen:",
      ...snapshot.codings.map((coding) => `• ${coding}`),
      "",
      `Normalpreis: ${snapshot.subtotal} €`,
      `Rabatt: -${snapshot.discount} €`,
      `Mein Preis: ${snapshot.total} €`,
      "",
      "Bitte kurz Machbarkeit und Termin bestätigen.",
    ];
    return `https://wa.me/4915563047044?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [snapshot]);

  return (
    <div className="mt-4">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
        {snapshot ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-black uppercase tracking-[.14em] text-blue-700">Deine Auswahl</div>
                <div className="mt-1 font-black text-slate-950">{snapshot.count} Codierung(en) · {snapshot.vehicle}</div>
              </div>
              <a href="#konfigurator" className="text-sm font-bold text-blue-700 hover:underline">Auswahl ändern</a>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white p-3"><div className="text-xs text-slate-500">Normalpreis</div><div className="mt-1 font-black">{snapshot.subtotal} €</div></div>
              <div className="rounded-xl bg-white p-3"><div className="text-xs text-slate-500">Rabatt ({snapshot.rate} %)</div><div className="mt-1 font-black text-blue-700">−{snapshot.discount} €</div></div>
              <div className="rounded-xl bg-blue-600 p-3 text-white"><div className="text-xs text-blue-100">Dein Preis</div><div className="mt-1 font-black">{snapshot.total} €</div></div>
            </div>
            <div className="mt-3 rounded-xl border border-blue-100 bg-white px-3 py-3 text-sm leading-6 text-slate-600">
              <div><b className="text-slate-800">Rabattstufen:</b> 5 % ab 50 € · 10 % ab 100 € · 15 % ab 150 € · 20 % ab 200 €</div>
              <div className="mt-1 font-semibold text-blue-700">{snapshot.nextTier ? `Noch ${snapshot.nextDifference} € bis ${snapshot.nextTier} € (${snapshot.nextTier === "50" ? 5 : snapshot.nextTier === "100" ? 10 : snapshot.nextTier === "150" ? 15 : 20} % Rabatt).` : "20 % Maximalrabatt erreicht."}</div>
            </div>
            {snapshot.mode === "onsite" && <a href={snapshot.calUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
              <CalendarDays className="h-5 w-5" /> Termin online vereinbaren
            </a>}
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white transition hover:brightness-95 sm:w-auto">
              <MessageCircle className="h-5 w-5" /> Auswahl per WhatsApp senden
            </a>
          </>
        ) : (
          <>
            <div className="text-xs font-black uppercase tracking-[.14em] text-blue-700">Schnell anfragen</div>
            <div className="mt-1 font-black text-slate-950">Codierungen auswählen und komplette Auswahl direkt per WhatsApp senden.</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">Fahrzeug, Codierungen, Rabatt und Gesamtpreis werden automatisch in die Nachricht übernommen.</p>
          </>
        )}
      </div>

    </div>
  );
}
