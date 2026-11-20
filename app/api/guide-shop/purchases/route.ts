import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { VZE_VARIANT_DRAFTS } from "../../../lib/vzeVariantDrafts";

export const runtime = "nodejs";
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const orders = await sql`SELECT product_id, status, paid_at FROM td_guide_orders WHERE
      clerk_user_id=${userId} AND status IN ('paid','pending')
      ORDER BY paid_at DESC NULLS LAST LIMIT 100`;
    const documents = await sql`SELECT product_id, sha256, version FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id} OR product_id LIKE 'vze-%'`;
    const hasDoc = (id: string, hash: string) => documents.some(d => d.product_id === id && d.sha256 === hash);
    const paid = orders.find(o => o.product_id === GOLF7_VZE.id && o.status === "paid");
    const pending = orders.some(o => o.product_id === GOLF7_VZE.id && o.status === "pending");
    return NextResponse.json({
      golf7Vze: {
        paid: !!paid, pending: !paid && pending,
        documentAvailable: hasDoc(GOLF7_VZE.id, GOLF7_VZE.expectedSha256),
        purchasedAt: paid?.paid_at ?? null, version: GOLF7_VZE.revision,
      },
      vzeModels: VZE_VARIANT_DRAFTS.map(draft => {
        const purchase = orders.find(o => o.product_id === draft.productId && o.status === "paid");
        const isPending = orders.some(o => o.product_id === draft.productId && o.status === "pending");
        return {
          slug: draft.slug, name: draft.name, productId: draft.productId, sku: draft.sku,
          paid: !!purchase, pending: !purchase && isPending,
          documentAvailable: hasDoc(draft.productId, draft.sha256),
          purchasedAt: purchase?.paid_at ?? null, version: "1.0",
        };
      }),
    }, { headers });
  } catch { return NextResponse.json({ error: "Käufe konnten nicht geladen werden." }, { status: 500, headers }); }
}
