import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../../../lib/guideShopDb";
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
    const [file] = await sql`SELECT encode(file_data,'base64') AS data FROM td_guide_documents
      WHERE product_id=${draft.productId} AND sha256=${draft.sha256} LIMIT 1`;
    if (!file || typeof file.data !== "string")
      return NextResponse.json({ error: "Die PDF ist derzeit nicht hinterlegt." }, { status: 503, headers });
    const pdf = Buffer.from(file.data, "base64");
    if (pdf.length < 2000 || pdf.subarray(0, 5).toString("ascii") !== "%PDF-")
      return NextResponse.json({ error: "Ungültige PDF-Daten." }, { status: 503, headers });
    return new Response(new Uint8Array(pdf), {
      status: 200, headers: {
        ...headers, "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${draft.filename}"`,
        "Content-Length": String(pdf.length),
      },
    });
  } catch { return NextResponse.json({ error: "Download vorübergehend nicht verfügbar." }, { status: 500, headers }); }
}
