import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
export const runtime = "nodejs";
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [paid] = await sql`SELECT paid_at FROM td_guide_orders WHERE
      clerk_user_id=${userId} AND product_id=${GOLF7_VZE.id} AND status='paid'
      ORDER BY paid_at DESC LIMIT 1`;
    const [file] = await sql`SELECT version FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id}`;
    return NextResponse.json({ golf7Vze: {
      paid: !!paid, documentAvailable: !!file, purchasedAt: paid?.paid_at ?? null,
      version: file?.version ?? null,
    } }, { headers });
  } catch {
    return NextResponse.json({ error: "Käufe konnten nicht geladen werden." }, { status: 500, headers });
  }
}
