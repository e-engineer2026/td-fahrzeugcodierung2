import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { newGuestToken, hashGuestToken } from "../../../../lib/guideGuestToken";
import { setGuestCookie } from "../../../../lib/guideGuest";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };

/** Die URL allein gibt keine PDF aus: Einloesung erst durch bewusstes POST im Browser.
 * Eine E-Mail-Linkvorschau kann den Einmalschluessel somit nicht aufbrauchen. */
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungueltige Herkunft." }, { status: 403, headers });
  let data: { token?: unknown };
  try { data = await request.json(); } catch {
    return NextResponse.json({ error: "Ungueltige Eingaben." }, { status: 400, headers });
  }
  const claimHash = hashGuestToken(typeof data?.token === "string" ? data.token : "");
  if (!claimHash) return NextResponse.json({ error: "Freigabelink ungueltig." }, { status: 400, headers });

  try {
    const sql = await ensureGuideShopSchema();
    const [document] = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id} AND (sha256=${GOLF7_VZE.expectedSha256} OR assigned_filename IS NOT NULL)`;
    if (!document) return NextResponse.json({ error: "PDF steht derzeit nicht bereit." }, { status: 503, headers });

    const guestToken = newGuestToken();
    const guestHash = hashGuestToken(guestToken);
    if (!guestHash) throw new Error("Gastkennung nicht generierbar.");
    // Atomare Freigabe: Einmal-Token nur ein einziges Mal verwertbar.
    // Schlaegt die Anlage des Gastanspruchs fehl, wird das Token nicht verbrannt.
    const [claimed] = await sql`WITH available AS (
      SELECT id, product_id FROM td_guide_manual_grants
      WHERE claim_token_hash=${claimHash} AND product_id=${GOLF7_VZE.id}
        AND status='issued' AND expires_at > now()
      FOR UPDATE
    ), entitlement AS (
      INSERT INTO td_guide_guest_orders
        (guest_token_hash, product_id, amount_cents, currency, status, paid_at)
      SELECT ${guestHash}, product_id, ${GOLF7_VZE.priceCents}, ${GOLF7_VZE.currency}, 'paid', now()
      FROM available RETURNING id
    )
    UPDATE td_guide_manual_grants AS g
    SET guest_order_id=ent.id, status='redeemed', redeemed_at=now()
    FROM entitlement AS ent, available AS rec
    WHERE g.id=rec.id AND g.status='issued'
    RETURNING g.id`;

    if (!claimed) return NextResponse.json({
      error: "Dieser Freigabelink ist abgelaufen, bereits verwendet oder gesperrt. Falls bereits eingeloest, nutze den urspruenglichen Browser.",
    }, { status: 410, headers });
    const response = NextResponse.json({
      released: true,
      downloadUrl: "/api/guide-shop/download/golf7-vze",
      confirmationUrl: "/api/guide-shop/guest/confirmation",
      accessDays: 30,
    }, { headers });
    setGuestCookie(response, guestToken);
    return response;
  } catch {
    return NextResponse.json({ error: "Freigabe konnte nicht verarbeitet werden." }, { status: 500, headers });
  }
}
