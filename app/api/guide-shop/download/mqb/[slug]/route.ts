import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../../../lib/guideShopDb";
import { guidePdfResponse, readGuidePdf } from "../../../../../lib/guideDocuments";
import { readMqbGuideDocument } from "../../../../../lib/mqbGuideDocument";
import { findMqbGuideProduct } from "../../../../../lib/mqbGuideProducts";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const product = findMqbGuideProduct((await context.params).slug);
  if (!product) return NextResponse.json({ error: "Prüfunterlage unbekannt." }, { status: 404, headers });
  const url = new URL(request.url);
  const orderPage = new URL("/codieranleitungen/mqb-assistenten/" + product.slug, url);
  const redirectToOrder = () => NextResponse.redirect(orderPage, { headers });
  const fromCatalog = url.searchParams.get("liste") === "1";

  const { userId } = await auth();
  if (!userId) return fromCatalog ? redirectToOrder()
    : NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [paid] = await sql`SELECT id FROM td_guide_orders WHERE clerk_user_id=${userId}
      AND product_id=${product.id} AND status='paid'
      AND amount_cents=${product.priceCents} AND currency='EUR' LIMIT 1`;
    if (!paid) return fromCatalog ? redirectToOrder()
      : NextResponse.json({ error: "Keine bestätigte Zahlung für diese PDF." }, { status: 403, headers });
    const file = await readGuidePdf(sql, product.id, product.sha256, product.filename,
      () => readMqbGuideDocument(product));
    if (!file) return NextResponse.json({ error: "Die PDF ist derzeit nicht hinterlegt." }, { status: 503, headers });
    return guidePdfResponse(file.bytes, file.filename, headers);
  } catch {
    return NextResponse.json({ error: "Download vorübergehend nicht verfügbar." }, { status: 500, headers });
  }
}
