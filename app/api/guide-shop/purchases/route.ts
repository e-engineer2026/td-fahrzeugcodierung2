import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { VZE_VARIANT_DRAFTS } from "../../../lib/vzeVariantDrafts";
import { MQB_GUIDE_PRODUCTS } from "../../../lib/mqbGuideProducts";
import { isAvailableGuideDocument } from "../../../lib/guideDocuments";
import { readMqbGuideDocument } from "../../../lib/mqbGuideDocument";

export const runtime = "nodejs";
export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const orders = await sql`SELECT product_id, status, paid_at, amount_cents, currency FROM td_guide_orders WHERE
      clerk_user_id=${userId} AND status IN ('paid','pending')
      ORDER BY paid_at DESC NULLS LAST LIMIT 100`;
    const productIds = [GOLF7_VZE.id, ...VZE_VARIANT_DRAFTS.map(draft => draft.productId),
      ...MQB_GUIDE_PRODUCTS.map(product => product.id)];
    const documents = await sql`SELECT product_id, sha256, assigned_filename, withdrawn FROM td_guide_documents
      WHERE product_id = ANY(${productIds}::text[])`;
    const hasDoc = (id: string, hash: string, fallback?: () => Buffer | null) =>
      isAvailableGuideDocument(documents.find(d => d.product_id === id), hash, fallback);
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
      mqbGuides: MQB_GUIDE_PRODUCTS.map(product => {
        const matching = orders.filter(order => order.product_id === product.id &&
          Number(order.amount_cents) === product.priceCents && order.currency === "EUR");
        const paid = matching.some(order => order.status === "paid");
        return {
          slug: product.slug, name: product.name, sku: product.sku, paid,
          pending: !paid && matching.some(order => order.status === "pending"),
          documentAvailable: paid && hasDoc(product.id, product.sha256, () => readMqbGuideDocument(product)),
          downloadHref: "/api/guide-shop/download/mqb/" + product.slug,
          label: "MQB-Prüfunterlage · Rev. " + product.revision,
        };
      }),
    }, { headers });
  } catch { return NextResponse.json({ error: "Käufe konnten nicht geladen werden." }, { status: 500, headers }); }
}
