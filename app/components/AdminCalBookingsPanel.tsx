"use client";

import { useEffect, useState } from "react";

type Booking = {
  eventHash: string;
  bookingUid: string;
  trigger: "BOOKING_CREATED" | "BOOKING_RESCHEDULED" | "BOOKING_CANCELLED";
  attendeeEmail: string;
  startTime: string | null;
  eventTime: string;
  suggestedOrderId: string | null;
};

export default function AdminCalBookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const response = await fetch("/api/service-orders/admin/bookings", {
        cache: "no-store", credentials: "same-origin",
      });
      const data = await response.json() as { bookings?: Booking[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Buchungen nicht verfügbar.");
      setBookings(data.bookings ?? []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Buchungen nicht verfügbar.");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/service-orders/admin/bookings", {
      cache: "no-store", credentials: "same-origin", signal: controller.signal,
    }).then(async response => {
      const data = await response.json() as { bookings?: Booking[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Buchungen nicht verfügbar.");
      if (!controller.signal.aborted) setBookings(data.bookings ?? []);
    }).catch(error => {
      if (!controller.signal.aborted) setNotice(error instanceof Error ? error.message : "Buchungen nicht verfügbar.");
    });
    return () => controller.abort();
  }, []);

  async function link(booking: Booking) {
    if (!booking.suggestedOrderId || booking.trigger === "BOOKING_CANCELLED") return;
    if (!window.confirm("Diese Cal.com-Buchung nach Prüfung der Kundendaten mit dem vorgeschlagenen Auftrag verbinden?")) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/service-orders/admin/bookings", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventHash: booking.eventHash, orderId: booking.suggestedOrderId }),
      });
      const data = await response.json() as { linked?: boolean; error?: string };
      if (!response.ok || !data.linked) throw new Error(data.error ?? "Zuordnung fehlgeschlagen.");
      setNotice("Buchung mit Auftrag verbunden. Bitte den Auftragsbereich aktualisieren.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Zuordnung fehlgeschlagen.");
    } finally { setBusy(false); }
  }

  return <section className="mt-6 rounded-xl border border-blue-200 bg-white p-4" aria-labelledby="cal-inbox-title">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 id="cal-inbox-title" className="text-lg font-bold">Cal.com-Buchungseingang</h2>
      <button type="button" onClick={() => void refresh()} className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-bold text-blue-800">Aktualisieren</button>
    </div>
    <p className="mt-2 text-xs text-slate-600">Nur signierte Webhook-Ereignisse erscheinen hier. Die Zuordnung zu einem Auftrag muss bestätigt werden. Terminbuchungen bestätigen keine Zahlung.</p>
    {!bookings.length && <p className="mt-3 text-sm text-slate-600">Noch keine Cal.com-Ereignisse empfangen oder Webhook nicht eingerichtet.</p>}
    <ul className="mt-3 space-y-3">{bookings.map(booking => <li key={booking.eventHash} className="rounded-lg border border-slate-200 p-3 text-sm">
      <p className="font-bold">{booking.trigger === "BOOKING_CANCELLED" ? "Termin storniert" :
        booking.trigger === "BOOKING_RESCHEDULED" ? "Termin verschoben" : "Termin gebucht"}</p>
      <p className="mt-1 break-all">{booking.attendeeEmail}</p>
      <p className="break-all text-slate-600">Buchungskennung: {booking.bookingUid}</p>
      {booking.startTime && <p className="text-slate-600">Beginn: {new Date(booking.startTime).toLocaleString("de-DE")}</p>}
      {booking.trigger === "BOOKING_CANCELLED" ?
        <p className="mt-2 font-semibold text-amber-800">Stornierung manuell im zugehörigen Auftrag prüfen.</p> :
        booking.suggestedOrderId ? <button type="button" onClick={() => void link(booking)} disabled={busy}
          className="mt-2 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">Vorgeschlagenen Auftrag zuordnen</button> :
        <p className="mt-2 text-amber-800">Keine sichere automatische Zuordnung. Auftrag anhand von E-Mail und Terminreferenz manuell prüfen.</p>}
    </li>)}</ul>
    {notice && <p role="status" className="mt-3 font-semibold text-blue-800">{notice}</p>}
  </section>;
}
