import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureServiceOrderSchema } from "../../../../lib/serviceOrdersDb";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };
const uuid = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;

export async function GET() {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  try {
    const sql = await ensureServiceOrderSchema();
    const bookings = await sql`SELECT e.event_hash AS "eventHash", e.booking_uid AS "bookingUid",
      e.trigger, e.attendee_email AS "attendeeEmail", e.start_time AS "startTime",
      e.event_time AS "eventTime", o.id AS "suggestedOrderId"
      FROM (
        SELECT DISTINCT ON (booking_uid) *
        FROM td_service_cal_events ORDER BY booking_uid, event_time DESC, received_at DESC
      ) e
      LEFT JOIN td_service_orders o ON o.id = e.proposed_order_id
        AND lower(o.customer_email) = e.attendee_email
      ORDER BY e.event_time DESC LIMIT 100`;
    return NextResponse.json({ bookings }, { headers });
  } catch {
    return NextResponse.json({ error: "Buchungsereignisse konnten nicht geladen werden." }, { status: 500, headers });
  }
}

/** Admin manually confirms the association; webhooks alone never change a service order or payment. */
export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let data: { eventHash?: unknown; orderId?: unknown };
  try { data = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige Daten." }, { status: 400, headers }); }
  const hash = typeof data?.eventHash === "string" && /^[a-f0-9]{64}$/.test(data.eventHash) ? data.eventHash : "";
  const id = typeof data?.orderId === "string" && uuid.test(data.orderId) ? data.orderId : "";
  if (!hash || !id) return NextResponse.json({ error: "Buchungsreferenz fehlt." }, { status: 400, headers });

  try {
    const sql = await ensureServiceOrderSchema();
    const [linked] = await sql`WITH latest AS (
      SELECT event_hash, booking_uid, attendee_email, trigger
      FROM td_service_cal_events
      WHERE booking_uid = (SELECT booking_uid FROM td_service_cal_events WHERE event_hash=${hash})
      ORDER BY event_time DESC, received_at DESC LIMIT 1
    ), eligible AS (
      SELECT * FROM latest WHERE event_hash=${hash}
        AND trigger IN ('BOOKING_CREATED', 'BOOKING_RESCHEDULED')
    )
    UPDATE td_service_orders o
    SET booking_reference=e.booking_uid, status='scheduled', updated_at=now()
    FROM eligible e
    WHERE o.id=${id}::uuid AND lower(o.customer_email)=e.attendee_email
      AND o.status IN ('requested', 'review', 'quoted', 'scheduled')
      AND (o.booking_reference IS NULL OR o.booking_reference=e.booking_uid)
    RETURNING o.id`;
    if (!linked) return NextResponse.json({
      error: "Kein eindeutiger, aktueller und passender Auftrag. Buchung manuell prüfen."
    }, { status: 409, headers });
    return NextResponse.json({ linked: true }, { headers });
  } catch {
    return NextResponse.json({ error: "Buchung konnte nicht zugeordnet werden." }, { status: 500, headers });
  }
}
