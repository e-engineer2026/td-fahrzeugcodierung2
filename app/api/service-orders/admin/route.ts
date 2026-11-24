import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../lib/guideAdmin";
import { ensureServiceOrderSchema } from "../../../lib/serviceOrdersDb";
import { canTransitionServiceOrder, SERVICE_STATES } from "../../../lib/serviceOrderRules";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  try {
    const sql = await ensureServiceOrderSchema();
    const orders = await sql`SELECT id, customer_email AS email, brand, model,
      vehicle_year AS year, service_mode AS mode, requested_services AS services,
      status, quote_cents AS "quoteCents", booking_reference AS "bookingReference",
      admin_note AS "adminNote", created_at AS "createdAt", updated_at AS "updatedAt"
      FROM td_service_orders ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ orders }, { headers });
  } catch {
    return NextResponse.json({ error: "Aufträge konnten nicht geladen werden." }, { status: 500, headers });
  }
}

export async function PATCH(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let data: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 8192) return NextResponse.json({ error: "Anfrage zu groß." }, { status: 413, headers });
    data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error();
  } catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const id = typeof data.id === "string" && /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(data.id) ? data.id : null;
  const target = typeof data.status === "string" && SERVICE_STATES.includes(data.status as typeof SERVICE_STATES[number]) ? data.status : null;
  const amount = data.quoteCents === null ? null : data.quoteCents;
  if (!id || !target || (amount !== undefined && amount !== null &&
      (typeof amount !== "number" || !Number.isInteger(amount) || amount < 0 || amount > 2000000)) ||
      (data.bookingReference !== undefined && (typeof data.bookingReference !== "string" || data.bookingReference.length > 150)) ||
      (data.adminNote !== undefined && (typeof data.adminNote !== "string" || data.adminNote.length > 4000))) {
    return NextResponse.json({ error: "Status oder Felder ungültig." }, { status: 400, headers });
  }
  try {
    const sql = await ensureServiceOrderSchema();
    const [current] = await sql`SELECT status, quote_cents, booking_reference, admin_note
      FROM td_service_orders WHERE id=${id}::uuid`;
    if (!current) return NextResponse.json({ error: "Auftrag nicht gefunden." }, { status: 404, headers });
    if (target !== current.status && !canTransitionServiceOrder(String(current.status), target))
      return NextResponse.json({ error: "Statuswechsel nicht zulässig." }, { status: 409, headers });
    const quote = amount === undefined ? current.quote_cents : amount;
    const booking = data.bookingReference === undefined ? current.booking_reference : String(data.bookingReference).trim() || null;
    const note = data.adminNote === undefined ? current.admin_note : String(data.adminNote).trim() || null;
    const [updated] = await sql`UPDATE td_service_orders SET status=${target}, quote_cents=${quote},
      booking_reference=${booking}, admin_note=${note}, updated_at=now()
      WHERE id=${id}::uuid AND status=${current.status}
      RETURNING id`;
    if (!updated) return NextResponse.json({ error: "Auftrag wurde gleichzeitig verändert. Bitte neu laden." }, { status: 409, headers });
    return NextResponse.json({ saved: true }, { headers });
  } catch {
    return NextResponse.json({ error: "Auftrag konnte nicht geändert werden." }, { status: 500, headers });
  }
}
