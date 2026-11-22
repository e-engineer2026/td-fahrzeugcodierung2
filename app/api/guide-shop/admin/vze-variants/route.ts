import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { GUIDE_ADMIN_DOCUMENTS } from "../../../../lib/vzeAdminDocuments";
import { findMqbGuideProduct } from "../../../../lib/mqbGuideProducts";
import { readMqbGuideDocument } from "../../../../lib/mqbGuideDocument";
import { isAvailableGuideDocument, isGuidePdf } from "../../../../lib/guideDocuments";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET() {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const ids = GUIDE_ADMIN_DOCUMENTS.map(document => document.productId);
    const rows = await sql`SELECT product_id, sha256, assigned_filename FROM td_guide_documents
      WHERE product_id = ANY(${ids}::text[])`;
    const drafts = await sql`SELECT product_id, sha256, assigned_filename FROM td_guide_document_drafts
      WHERE product_id = ANY(${ids}::text[])`;
    const byId = new Map(rows.map(row => [row.product_id, row]));
    const draftsById = new Map(drafts.map(row => [row.product_id, row]));
    const documents = GUIDE_ADMIN_DOCUMENTS.map(document => {
      const row = byId.get(document.productId);
      const mqb = findMqbGuideProduct(document.slug);
      const available = isAvailableGuideDocument(row, document.sha256) || !!(mqb && readMqbGuideDocument(mqb));
      return {
        slug: document.slug, title: document.title, sku: document.sku, available,
        draftFilename: draftsById.get(document.productId)?.assigned_filename ?? null,
        draftSha256: draftsById.get(document.productId)?.sha256 ?? null,
        defaultFilename: document.filename,
        filename: typeof row?.assigned_filename === "string" ? row.assigned_filename
          : available ? document.filename : null,
      };
    });
    return NextResponse.json({ documents }, { headers });
  } catch { return NextResponse.json({ error: "PDF-Liste nicht verfügbar." }, { status: 500, headers }); }
}

export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  if (Number(request.headers.get("content-length") ?? "0") > 3_100_000)
    return NextResponse.json({ error: "Die PDF darf höchstens 3 MB groß sein." }, { status: 413, headers });
  let form: FormData;
  try { form = await request.formData(); }
  catch { return NextResponse.json({ error: "Ungültige Upload-Daten." }, { status: 400, headers }); }
  const slug = form.get("slug");
  const document = GUIDE_ADMIN_DOCUMENTS.find(item => item.slug === slug);
  const file = form.get("pdf");
  if (!document || !(file instanceof File) || !file.name.toLowerCase().endsWith(".pdf"))
    return NextResponse.json({ error: "Bitte einen Download und eine PDF-Datei auswählen." }, { status: 400, headers });
  if (file.size > 3_000_000)
    return NextResponse.json({ error: "Die PDF darf höchstens 3 MB groß sein." }, { status: 413, headers });
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!isGuidePdf(bytes))
    return NextResponse.json({ error: "Ungültige PDF-Datei." }, { status: 400, headers });
  const filename = file.name.slice(0, -4).normalize("NFC").replace(/[\x00-\x1f\x7f/\\]/g, "_").trim();
  const displayFilename = (Array.from(filename).slice(0, 120).join("") || "Dokument") + ".pdf";
  const digest = createHash("sha256").update(bytes).digest("hex");
  try {
    const sql = await ensureGuideShopSchema();
    const encoded = bytes.toString("base64");
    await sql`INSERT INTO td_guide_document_drafts (product_id, version, sha256, file_data, assigned_filename)
      VALUES (${document.productId}, ${document.revision}, ${digest}, decode(${encoded}, 'base64'), ${displayFilename})
      ON CONFLICT (product_id) DO UPDATE SET version=EXCLUDED.version, sha256=EXCLUDED.sha256,
        file_data=EXCLUDED.file_data, assigned_filename=EXCLUDED.assigned_filename, uploaded_at=now()`;
    return NextResponse.json({ stored: true, slug: document.slug, title: document.title, filename: displayFilename, sha256: digest }, { status: 201, headers });
  } catch { return NextResponse.json({ error: "PDF konnte nicht gespeichert werden." }, { status: 500, headers }); }
}

export async function PATCH(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { slug?: unknown; sha256?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  const document = GUIDE_ADMIN_DOCUMENTS.find(item => item.slug === body.slug);
  if (!document || typeof body.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(body.sha256))
    return NextResponse.json({ error: "Ungültiger PDF-Entwurf." }, { status: 400, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [published] = await sql`WITH chosen AS (
      DELETE FROM td_guide_document_drafts WHERE product_id=${document.productId} AND sha256=${body.sha256}
      RETURNING product_id, version, sha256, file_data, assigned_filename
    ) INSERT INTO td_guide_documents (product_id, version, sha256, file_data, assigned_filename)
      SELECT product_id, version, sha256, file_data, assigned_filename FROM chosen
      ON CONFLICT (product_id) DO UPDATE SET version=EXCLUDED.version, sha256=EXCLUDED.sha256,
        file_data=EXCLUDED.file_data, assigned_filename=EXCLUDED.assigned_filename, uploaded_at=now()
      RETURNING product_id`;
    return published ? NextResponse.json({ published: true }, { headers }) :
      NextResponse.json({ error: "Entwurf wurde geändert oder ist nicht mehr vorhanden. Bitte Liste aktualisieren." }, { status: 409, headers });
  } catch { return NextResponse.json({ error: "Veröffentlichung fehlgeschlagen." }, { status: 500, headers }); }
}
