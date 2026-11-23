import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { catalogGuideProduct } from "../../../../lib/guideCatalogDocuments";
import { guidePdfResponse, readGuidePdf } from "../../../../lib/guideDocuments";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  const product = catalogGuideProduct(new URL(request.url).searchParams.get("produkt") ?? "");
  if (!product) return NextResponse.json({ error: "PDF unbekannt." }, { status: 404, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [paid] = await sql`SELECT id FROM td_guide_orders WHERE clerk_user_id=${userId}
      AND product_id=${product.id} AND status='paid' AND currency='EUR' LIMIT 1`;
    if (!paid) return NextResponse.json({ error: "Keine bestätigte Zahlung für diese PDF." }, { status: 403, headers });
    const file = await readGuidePdf(sql, product.id, product.sha256, product.filename);
    return file ? guidePdfResponse(file.bytes, file.filename, headers)
      : NextResponse.json({ error: "Die PDF ist derzeit nicht verfügbar." }, { status: 404, headers });
  } catch { return NextResponse.json({ error: "Download vorübergehend nicht verfügbar." }, { status: 500, headers }); }
}
