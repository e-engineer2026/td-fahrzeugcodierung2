import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

/** Merkt den PayPal-Aufruf zur spaeteren, unverbindlichen Zeit-Zuordnung. */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { orderId?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400, headers }); }
  const id = typeof body.orderId === "string" && /^[0-9a-f-]{36}$/i.test(body.orderId) ? body.orderId : "";
  if (!id) return NextResponse.json({ error: "Bestellung fehlt." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [updated] = await sql`UPDATE td_guide_orders SET paypal_started_at=now()
      WHERE id=${id}::uuid AND clerk_user_id=${userId} AND product_id=${GOLF7_VZE.id}
      AND status='pending' RETURNING paypal_started_at`;
    if (!updated) return NextResponse.json({ error: "Offene Bestellung nicht gefunden." }, { status: 404, headers });
    return NextResponse.json({ recorded: true }, { headers });
  } catch { return NextResponse.json({ error: "Zeitpunkt konnte nicht gespeichert werden." }, { status: 500, headers }); }
}
