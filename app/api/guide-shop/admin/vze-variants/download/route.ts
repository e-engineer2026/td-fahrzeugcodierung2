import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../../lib/guideShopDb";
import { findGuideAdminDocument } from "../../../../../lib/vzeAdminDocuments";
import { guidePdfResponse, isGuidePdf, readGuidePdf } from "../../../../../lib/guideDocuments";
import { findMqbGuideProduct } from "../../../../../lib/mqbGuideProducts";
import { readMqbGuideDocument } from "../../../../../lib/mqbGuideDocument";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  const slug = new URL(request.url).searchParams.get("slug");
  const document = slug ? findGuideAdminDocument(slug) : null;
  if (!document) return NextResponse.json({ error: "Download nicht gefunden." }, { status: 404, headers });
  try {
    const sql = await ensureGuideShopSchema();
    if (new URL(request.url).searchParams.get("draft") === "1") {
      const [draft] = await sql`SELECT encode(file_data,'base64') AS data, sha256 FROM td_guide_document_drafts WHERE product_id=${document.productId}`;
      if (!draft || typeof draft.data !== "string") return NextResponse.json({ error: "Kein Entwurf vorhanden." }, { status: 404, headers });
      const bytes = Buffer.from(draft.data, "base64");
      if (!isGuidePdf(bytes) || createHash("sha256").update(bytes).digest("hex") !== draft.sha256)
        return NextResponse.json({ error: "PDF-Entwurf ist beschädigt." }, { status: 422, headers });
      return new Response(new Uint8Array(bytes), { headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": "inline", "Content-Length": String(bytes.length) } });
    }
    const mqb = findMqbGuideProduct(document.slug);
    const file = await readGuidePdf(sql, document.productId, document.sha256, document.filename,
      mqb ? () => readMqbGuideDocument(mqb) : undefined);
    if (!file) return NextResponse.json({ error: "Für diesen Download ist keine PDF verfügbar." }, { status: 404, headers });
    if (new URL(request.url).searchParams.get("inline") === "1")
      return new Response(new Uint8Array(file.bytes), { headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": "inline", "Content-Length": String(file.bytes.length) } });
    return guidePdfResponse(file.bytes, file.filename, headers);
  } catch { return NextResponse.json({ error: "PDF derzeit nicht abrufbar." }, { status: 500, headers }); }
}
