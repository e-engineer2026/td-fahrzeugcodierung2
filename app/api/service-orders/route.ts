import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureServiceOrderSchema } from "../../lib/serviceOrdersDb";
import { validateServiceRequest } from "../../lib/serviceOrderRules";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Bitte anmelden." }, { status: 401, headers });
  try {
    const sql = await ensureServiceOrderSchema();
    const orders = await sql`SELECT id, brand, model, vehicle_year AS year,
      service_mode AS mode, requested_services AS services, status,
      quote_cents AS "quoteCents", booking_reference AS "bookingReference",
      created_at AS "createdAt", updated_at AS "updatedAt"
      FROM td_service_orders WHERE clerk_user_id=${userId}
      ORDER BY created_at DESC LIMIT 50`;
    return NextResponse.json({ orders }, { headers });
  } catch {
    return NextResponse.json({ error: "Aufträge konnten nicht geladen werden." }, { status: 500, headers });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Bitte anmelden." }, { status: 401, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let input: unknown;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 8192) return NextResponse.json({ error: "Anfrage zu groß." }, { status: 413, headers });
    input = JSON.parse(raw);
  } catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const requestData = validateServiceRequest(input);
  if (!requestData) return NextResponse.json({ error: "Fahrzeug und Leistungswunsch prüfen." }, { status: 400, headers });

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(x => x.verification?.status === "verified")?.emailAddress;
    if (!email) return NextResponse.json({ error: "Verifizierte E-Mail-Adresse erforderlich." }, { status: 403, headers });
    const sql = await ensureServiceOrderSchema();
    const [count] = await sql`SELECT count(*)::int AS total FROM td_service_orders
      WHERE clerk_user_id=${userId} AND created_at > now() - interval '1 day'`;
    if (Number(count?.total ?? 0) >= 5) return NextResponse.json({ error: "Zu viele Anfragen innerhalb von 24 Stunden." }, { status: 429, headers });
    const [duplicate] = await sql`SELECT id FROM td_service_orders
      WHERE clerk_user_id=${userId} AND brand=${requestData.brand} AND model=${requestData.model}
        AND vehicle_year=${requestData.year} AND service_mode=${requestData.mode}
        AND requested_services=${requestData.services}
        AND created_at > now() - interval '30 minutes' LIMIT 1`;
    if (duplicate) return NextResponse.json({ error: "Diese Anfrage ist bereits eingegangen.", orderId: duplicate.id }, { status: 409, headers });
    const [order] = await sql`INSERT INTO td_service_orders
      (clerk_user_id, customer_email, brand, model, vehicle_year, service_mode, requested_services)
      VALUES (${userId}, ${email.toLowerCase()}, ${requestData.brand}, ${requestData.model},
        ${requestData.year}, ${requestData.mode}, ${requestData.services})
      RETURNING id`;
    return NextResponse.json({ created: true, orderId: order.id, status: "requested" }, { status: 201, headers });
  } catch {
    return NextResponse.json({ error: "Anfrage konnte nicht gespeichert werden." }, { status: 500, headers });
  }
}
