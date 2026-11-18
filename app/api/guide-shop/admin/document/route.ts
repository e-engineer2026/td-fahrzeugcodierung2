import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
export const runtime = "nodejs";
function authorized(token: string | null): boolean {
  const secret = process.env.TD_GUIDE_STORAGE_KEY;
  if (!token || !secret || secret.length < 24) return false;
  const left = Buffer.from(token), right = Buffer.from(secret);
  return left.length === right.length && timingSafeEqual(left, right);
}
/** Interne PDF-Übergabe. Niemals eine Kundendatei öffentlich in GitHub oder public/ ablegen. */
export async function PUT(request: Request) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!authorized(request.headers.get("x-td-guide-storage-key")))
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  if (Number(request.headers.get("content-length") || 0) > 2_000_000)
    return NextResponse.json({ error: "Datei zu groß." }, { status: 413, headers });
  const pdf = Buffer.from(await request.arrayBuffer());
  if (pdf.length < 1000 || pdf.length > 2_000_000 ||
      pdf.subarray(0, 5).toString("ascii") !== "%PDF-" ||
      !pdf.subarray(-2048).toString("latin1").includes("%%EOF")) {
    return NextResponse.json({ error: "Ungültiges PDF." }, { status: 400, headers });
  }
  try {
    const sql = await ensureGuideShopSchema();
    const encoded = pdf.toString("base64");
    const sha256 = createHash("sha256").update(pdf).digest("hex");
    if (sha256 !== GOLF7_VZE.expectedSha256) {
      return NextResponse.json({ error: "Es ist ausschließlich die geprüfte TD-G7-AS-003-Revision 1.2 zulässig." }, { status: 422, headers });
    }
    await sql`INSERT INTO td_guide_documents (product_id, version, sha256, file_data)
      VALUES (${GOLF7_VZE.id}, ${GOLF7_VZE.revision}, ${sha256}, decode(${encoded},'base64'))
      ON CONFLICT(product_id) DO UPDATE
      SET version=EXCLUDED.version, sha256=EXCLUDED.sha256,
          file_data=EXCLUDED.file_data, uploaded_at=now()`;
    return NextResponse.json({ stored: true, sha256, bytes: pdf.length }, { headers });
  } catch {
    return NextResponse.json({ error: "Dokument konnte nicht gespeichert werden." }, { status: 500, headers });
  }
}
