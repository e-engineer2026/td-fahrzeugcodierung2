import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { VZE_ADMIN_DOCUMENTS, findVzeAdminDocument, vzeAdminStorageVersion, vzeAdminDisplayRevision } from "../../../../lib/vzeAdminDocuments";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

/** Alle 13 Fachfassungen, einschließlich des bestehenden Golf-7-Artikels, nur für TD-Admins. */
export async function GET() {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const rows = await sql`SELECT product_id, sha256 FROM td_guide_documents
      WHERE product_id LIKE 'vze-%' OR product_id = ${GOLF7_VZE.id} LIMIT 100`;
    const matches = new Set(rows.map((row) => String(row.product_id) + ":" + String(row.sha256)));
    return NextResponse.json({ drafts: VZE_ADMIN_DOCUMENTS.map((draft) => ({
      ...draft, revision: vzeAdminDisplayRevision(draft.productId), stored: matches.has(draft.productId + ":" + draft.sha256),
    })) }, { headers });
  } catch { return NextResponse.json({ error: "PDF-Liste nicht verfügbar." }, { status: 500, headers }); }
}

export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  if (Number(request.headers.get("content-length") || "0") > 1_500_000)
    return NextResponse.json({ error: "Datei zu groß." }, { status: 413, headers });
  let data: FormData;
  try { data = await request.formData(); }
  catch { return NextResponse.json({ error: "Ungültiges Formular." }, { status: 400, headers }); }
  const slug = data.get("slug");
  const draft = typeof slug === "string" ? findVzeAdminDocument(slug) : undefined;
  const file = data.get("pdf");
  if (!draft || !(file instanceof File) || file.size < 2000 || file.size > 1_000_000 ||
      !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Bitte passende PDF-Prüffassung und Modell auswählen." }, { status: 400, headers });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-" ||
      !bytes.subarray(-2048).toString("latin1").includes("%%EOF")) {
    return NextResponse.json({ error: "Ungültiges PDF." }, { status: 400, headers });
  }
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== draft.sha256)
    return NextResponse.json({ error: "Falsche Dateiversion oder Modellzuordnung. Bitte die unveränderte TD-Fachfassung auswählen." }, { status: 422, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const encoded = bytes.toString("base64");
    const version = vzeAdminStorageVersion(draft.productId);
    await sql`INSERT INTO td_guide_documents (product_id, version, sha256, file_data)
      VALUES (${draft.productId}, ${version}, ${digest}, decode(${encoded}, 'base64'))
      ON CONFLICT (product_id) DO UPDATE
      SET version=EXCLUDED.version, sha256=EXCLUDED.sha256,
          file_data=EXCLUDED.file_data, uploaded_at=now()`;
    return NextResponse.json({ stored: true, model: draft.name, slug: draft.slug }, { status: 201, headers });
  } catch { return NextResponse.json({ error: "Privates Speichern der Fachfassung fehlgeschlagen." }, { status: 500, headers }); }
}
