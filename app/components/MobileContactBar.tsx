"use client";

import { CalendarDays, MessageCircle, Phone } from "lucide-react";

function track(channel: string) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "contact_clicked", { channel });
}

export default function MobileContactBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href="https://wa.me/4915563047044"
            target="_blank"
            rel="noreferrer"
            onClick={() => track("mobile_whatsapp")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 text-xs font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href="tel:+4915563047044"
            onClick={() => track("mobile_phone")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-2 text-xs font-bold text-white"
          >
            <Phone className="h-4 w-4" /> Anrufen
          </a>
          <a
            href="/#buchen"
            onClick={() => track("mobile_booking")}
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-2 text-xs font-bold text-white"
          >
            <CalendarDays className="h-4 w-4" /> Termin
          </a>
        </div>
      </div>
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
