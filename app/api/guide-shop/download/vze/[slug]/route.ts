import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../../../lib/guideShopDb";
import { guidePdfResponse, readGuidePdf } from "../../../../../lib/guideDocuments";
import { findVzeDraft } from "../../../../../lib/vzeVariantDrafts";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const draft = findVzeDraft(slug);
  if (!draft) return NextResponse.json({ error: "Modell unbekannt." }, { status: 404, headers });
  const url = new URL(request.url);
  const fromCatalog = url.searchParams.get("liste") === "1";
  const toOrder = () => NextResponse.redirect(new URL("/codieranleitungen/vze-modelle/" + draft.slug, url), { headers });
  const { userId } = await auth();
  if (!userId) return fromCatalog ? toOrder() : NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [paid] = await sql`SELECT id FROM td_guide_orders
      WHERE clerk_user_id=${userId} AND product_id=${draft.productId} AND status='paid' LIMIT 1`;
    if (!paid) return fromCatalog ? toOrder()
      : NextResponse.json({ error: "Keine bestätigte Zahlung für diese Modellanleitung." }, { status: 403, headers });
    const file = await readGuidePdf(sql, draft.productId, draft.sha256, draft.filename);
    if (!file) return NextResponse.json({ error: "Die PDF ist derzeit nicht hinterlegt." }, { status: 503, headers });
    return guidePdfResponse(file.bytes, file.filename, headers);
  } catch { return NextResponse.json({ error: "Download vorübergehend nicht verfügbar." }, { status: 500, headers }); }
}
