import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { GOLF7_VZE } from "../../../lib/guideShopShared";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

/**
 * Offene Bestellung fuer das angemeldete Kundenkonto wiederherstellen.
 * Keine PayPal-Zahlung oder PDF-Freigabe wird durch diesen Endpunkt behauptet.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Bitte zuerst anmelden." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [pending] = await sql`SELECT id FROM td_guide_orders
      WHERE clerk_user_id=${userId} AND product_id=${GOLF7_VZE.id} AND status='pending'
      ORDER BY created_at DESC LIMIT 1`;
    return NextResponse.json({ order: pending ? {
      orderId: pending.id,
      reference: `TDG7-${String(pending.id).slice(0, 8).toUpperCase()}`,
      paypalUrl: "https://paypal.me/TiDrechsler/13.99EUR"
    } : null }, { headers });
  } catch {
    return NextResponse.json({ error: "Offene Bestellung konnte nicht geladen werden." }, { status: 500, headers });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Bitte zuerst anmelden." }, { status: 401, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { termsAccepted?: boolean };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  if (body.termsAccepted !== true)
    return NextResponse.json({ error: "Bitte AGB und Widerrufsbelehrung bestätigen." }, { status: 400, headers });
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(address => address.verification?.status === "verified")?.emailAddress;
    if (!email) return NextResponse.json({ error: "Verifizierte E-Mail-Adresse erforderlich." }, { status: 403, headers });
    const sql = await ensureGuideShopSchema();
    const [paid] = await sql`SELECT id FROM td_guide_orders WHERE clerk_user_id=${userId}
      AND product_id=${GOLF7_VZE.id} AND status='paid' LIMIT 1`;
    if (paid) return NextResponse.json({ error: "Diese PDF ist bereits in deinem Konto freigeschaltet." }, { status: 409, headers });
    const [existing] = await sql`SELECT id FROM td_guide_orders WHERE clerk_user_id=${userId}
      AND product_id=${GOLF7_VZE.id} AND status='pending'
      ORDER BY created_at DESC LIMIT 1`;
    const [order] = existing ? [existing] : await sql`INSERT INTO td_guide_orders
      (clerk_user_id, buyer_email, product_id, amount_cents, currency, status,
       terms_accepted, immediate_delivery_consent, withdrawal_acknowledged)
      VALUES (${userId}, ${email.toLowerCase()}, ${GOLF7_VZE.id}, ${GOLF7_VZE.priceCents},
        ${GOLF7_VZE.currency}, 'pending', true, false, false) RETURNING id`;
    return NextResponse.json({ orderId: order.id, reference: `TDG7-${String(order.id).slice(0, 8).toUpperCase()}`,
      paypalUrl: "https://paypal.me/TiDrechsler/13.99EUR" }, { status: existing ? 200 : 201, headers });
  } catch {
    return NextResponse.json({ error: "Bestellung konnte nicht vorbereitet werden." }, { status: 500, headers });
  }
}
