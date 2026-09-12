"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MessageCircle } from "lucide-react";

type Snapshot = {
  count: number;
  subtotal: string;
  discount: string;
  total: string;
  vehicle: string;
  codings: string[];
};

const onsiteCalendar = "https://cal.com/timo-drechsler-lej6jm/vag-codierung-vor-ort";
const remoteCalendar = "https://cal.com/timo-drechsler-lej6jm/remote-codierung";

function readSnapshot(): Snapshot | null {
  const section = document.querySelector<HTMLElement>("#konfigurator > section:nth-of-type(3)");
  if (!section) return null;

  const selectedBox = Array.from(section.querySelectorAll<HTMLElement>(".border-blue-200.bg-blue-50"))
    .find((element) => /Codierung\(en\) gewählt/.test(element.textContent ?? ""));
  const selectedText = selectedBox?.textContent ?? "";
  const count = Number(selectedText.match(/(\d+)\s+Codierung\(en\) gewählt/)?.[1] ?? 0);
  const subtotal = selectedText.match(/([\d.]+,\d{2})\s*€\s*Zwischensumme/)?.[1] ?? "0,00";
  const total = selectedText.match(/([\d.]+,\d{2})\s*€\s*gesamt/)?.[1] ?? "0,00";

  if (!count) return null;

  const priceBox = Array.from(section.querySelectorAll<HTMLElement>(".rounded-xl.bg-slate-50"))
    .find((element) => /Zwischensumme/.test(element.textContent ?? "") && /Gesamt/.test(element.textContent ?? ""));
  const priceText = priceBox?.textContent ?? "";
  const discount = priceText.match(/Rabatt\s*\([^)]*\)\s*-\s*([\d.]+,\d{2})\s*€/)?.[1] ?? "0,00";
  const vehicle = section.querySelector("h3")?.textContent?.trim() ?? "Fahrzeug";
  const codings = Array.from(section.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked'))
    .map((input) => input.nextElementSibling?.textContent?.trim() ?? "")
    .filter(Boolean);

  return { count, subtotal, discount, total, vehicle, codings };
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
    <div className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
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
              <div className="rounded-xl bg-white p-3"><div className="text-xs text-slate-500">Rabatt</div><div className="mt-1 font-black text-blue-700">−{snapshot.discount} €</div></div>
              <div className="rounded-xl bg-blue-600 p-3 text-white"><div className="text-xs text-blue-100">Dein Preis</div><div className="mt-1 font-black">{snapshot.total} €</div></div>
            </div>
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

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex items-center gap-2 font-black text-slate-950"><CalendarDays className="h-5 w-5 text-blue-600" /> Nächste freie Termine</div>
        <p className="mt-2 text-sm leading-6 text-slate-600">Die aktuell freien Zeiten werden live im Terminkalender angezeigt.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <a href={onsiteCalendar} target="_blank" rel="noreferrer" className="btn-primary text-center">Vor Ort ansehen</a>
          <a href={remoteCalendar} target="_blank" rel="noreferrer" className="btn-secondary text-center">Remote ansehen</a>
        </div>
      </div>
    </div>
  );
}
