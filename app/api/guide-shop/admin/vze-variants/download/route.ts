import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../../lib/guideShopDb";
import { findVzeDraft } from "../../../../../lib/vzeVariantDrafts";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

/** Interne Prüffassungen sind keine gekauften Produkte: Downloads nur für verifizierte Admins. */
export async function GET(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  const draft = findVzeDraft(new URL(request.url).searchParams.get("slug") ?? "");
  if (!draft) return NextResponse.json({ error: "Modell nicht gefunden." }, { status: 404, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [row] = await sql`SELECT encode(file_data,'base64') AS data FROM td_guide_documents
      WHERE product_id=${draft.productId} AND sha256=${draft.sha256}`;
    if (!row || typeof row.data !== "string")
      return NextResponse.json({ error: "Diese Prüffassung wurde noch nicht privat hochgeladen." }, { status: 404, headers });
    const pdf = Buffer.from(row.data, "base64");
    if (pdf.length < 1000 || pdf.subarray(0, 5).toString("ascii") !== "%PDF-")
      return NextResponse.json({ error: "Ungültiges PDF." }, { status: 503, headers });
    return new Response(new Uint8Array(pdf), {
      headers: { ...headers, "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${draft.filename}"`,
        "Content-Length": String(pdf.length),
      },
    });
  } catch { return NextResponse.json({ error: "PDF derzeit nicht abrufbar." }, { status: 500, headers }); }
}
