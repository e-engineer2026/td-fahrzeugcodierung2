import { NextResponse } from "next/server";
import { ensureServiceOrderSchema } from "../../../lib/serviceOrdersDb";
import { parseCalBookingEvent, validCalWebhookSignature } from "../../../lib/calBookingWebhook";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

/** Cal.com must be configured with a signing secret. Never rely on IP or attendee email alone. */
export async function POST(request: Request) {
  const secret = process.env.TD_CAL_WEBHOOK_SECRET;
  if (!secret || secret.length < 32)
    return NextResponse.json({ error: "Webhook nicht eingerichtet." }, { status: 503, headers });
  let raw: string;
  try {
    if (Number(request.headers.get("content-length") || 0) > 65536)
      return NextResponse.json({ error: "Nachricht zu groß." }, { status: 413, headers });
    raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 65536)
      return NextResponse.json({ error: "Nachricht zu groß." }, { status: 413, headers });
  } catch { return NextResponse.json({ error: "Ungültige Nachricht." }, { status: 400, headers }); }

  if (!validCalWebhookSignature(raw, request.headers.get("x-cal-signature-256"), secret))
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 403, headers });
  const event = parseCalBookingEvent(raw);
  if (!event) return NextResponse.json({ ignored: true }, { status: 202, headers });

  try {
    const sql = await ensureServiceOrderSchema();
    await sql`INSERT INTO td_service_cal_events
      (event_hash, booking_uid, trigger, attendee_email, proposed_order_id, start_time, event_time)
      VALUES (${event.eventHash}, ${event.bookingUid}, ${event.trigger},
        ${event.attendeeEmail}, ${event.proposedOrderId}::uuid,
        ${event.startTime}::timestamptz, ${event.eventTime}::timestamptz)
      ON CONFLICT (event_hash) DO NOTHING`;
    return NextResponse.json({ received: true }, { headers });
  } catch {
    return NextResponse.json({ error: "Buchungsereignis konnte nicht gespeichert werden." },
      { status: 500, headers });
  }
}
