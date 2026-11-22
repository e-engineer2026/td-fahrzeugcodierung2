import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../../lib/guideShopDb";
import { GUIDE_ADMIN_DOCUMENTS } from "../../../../../lib/vzeAdminDocuments";
import { guidePdfResponse, readGuidePdf } from "../../../../../lib/guideDocuments";
import { findMqbGuideProduct } from "../../../../../lib/mqbGuideProducts";
import { readMqbGuideDocument } from "../../../../../lib/mqbGuideDocument";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  const slug = new URL(request.url).searchParams.get("slug");
  const document = GUIDE_ADMIN_DOCUMENTS.find(item => item.slug === slug);
  if (!document) return NextResponse.json({ error: "Download nicht gefunden." }, { status: 404, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const file = await readGuidePdf(sql, document.productId, document.sha256, document.filename);
    const mqb = findMqbGuideProduct(document.slug);
    const pdf = file?.bytes ?? (mqb ? readMqbGuideDocument(mqb) : null);
    if (!pdf) return NextResponse.json({ error: "Für diesen Download ist keine PDF verfügbar." }, { status: 404, headers });
    return guidePdfResponse(pdf, file?.filename ?? document.filename, headers);
  } catch { return NextResponse.json({ error: "PDF derzeit nicht abrufbar." }, { status: 500, headers }); }
}
