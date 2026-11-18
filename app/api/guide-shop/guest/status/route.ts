import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { guestTokenHashFromCookie } from "../../../../lib/guideGuest";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  const hash = await guestTokenHashFromCookie();
  if (!hash) return NextResponse.json({ golf7Vze: { paid: false, documentAvailable: false } }, { headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [paid] = await sql`SELECT paid_at FROM td_guide_guest_orders
      WHERE guest_token_hash=${hash} AND product_id=${GOLF7_VZE.id}
      AND status='paid' AND paid_at > now() - interval '30 days' LIMIT 1`;
    if (!paid) return NextResponse.json({ golf7Vze: { paid: false, documentAvailable: false } }, { headers });
    const [document] = await sql`SELECT version FROM td_guide_documents WHERE
      product_id=${GOLF7_VZE.id} AND sha256=${GOLF7_VZE.expectedSha256}`;
    return NextResponse.json({ golf7Vze: {
      paid: true, documentAvailable: !!document,
      version: document?.version ?? null, purchasedAt: paid.paid_at ?? null,
    } }, { headers });
  } catch {
    return NextResponse.json({ error: "Gastkauf konnte nicht geprüft werden." },
      { status: 500, headers });
  }
}
