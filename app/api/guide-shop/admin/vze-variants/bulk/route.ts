import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../../lib/guideShopDb";
import { GOLF7_ADMIN_DOCUMENT, VZE_ADMIN_DOCUMENTS, vzeAdminStorageVersion } from "../../../../../lib/vzeAdminDocuments";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

/** Dateiweise SHA256-Prüfung; keine ZIP-Entpackung oder unkontrollierte Dateipfade. */
export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  if (Number(request.headers.get("content-length") || 0) > 4_000_000)
    return NextResponse.json({ error: "Daten zu groß." }, { status: 413, headers });
  let form: FormData;
  try { form = await request.formData(); }
  catch { return NextResponse.json({ error: "Ungültige Upload-Daten." }, { status: 400, headers }); }
  const files = form.getAll("pdfs");
  if (!files.length || files.length > VZE_ADMIN_DOCUMENTS.length)
    return NextResponse.json({ error: "Bitte maximal 13 PDF-Dateien auswählen." }, { status: 400, headers });
  const verified: { productId: string; sha256: string; encoded: string; name: string; version: string }[] = [];
  const used = new Set<string>();
  for (const file of files) {
    if (!(file instanceof File) || file.size < 2000 || file.size > 1_000_000)
      return NextResponse.json({ error: "Mindestens eine Datei ist ungültig oder zu groß." }, { status: 400, headers });
    const bytes = Buffer.from(await file.arrayBuffer());
    const digest = createHash("sha256").update(bytes).digest("hex");
    // Der ursprüngliche Golf-7-Dateiname ist nicht auf die ZIP-Benennung festgelegt.
    // Das exakt geprüfte SHA-256 identifiziert ihn unabhängig vom Dateinamen.
    const draft = VZE_ADMIN_DOCUMENTS.find(d => d.filename === file.name) ??
      (digest === GOLF7_ADMIN_DOCUMENT.sha256 ? GOLF7_ADMIN_DOCUMENT : undefined);
    if (!draft || used.has(draft.slug) ||
        file.size > (draft.productId === GOLF7_ADMIN_DOCUMENT.productId ? 1_000_000 : 300_000))
      return NextResponse.json({ error: "Falsche, doppelte oder zu große PDF-Datei: " + file.name }, { status: 422, headers });
    if (digest !== draft.sha256 ||
        bytes.subarray(0,5).toString("ascii") !== "%PDF-" ||
        !bytes.subarray(-2048).toString("latin1").includes("%%EOF")) {
      return NextResponse.json({ error: "Prüfsumme stimmt nicht: " + file.name }, { status: 422, headers });
    }
    used.add(draft.slug);
    verified.push({ productId: draft.productId, sha256: digest, encoded: bytes.toString("base64"), name: draft.name, version: vzeAdminStorageVersion(draft.productId) });
  }
  try {
    const sql = await ensureGuideShopSchema();
    for (const draft of verified) {
      await sql`INSERT INTO td_guide_documents (product_id, version, sha256, file_data)
        VALUES (${draft.productId}, ${draft.version}, ${draft.sha256}, decode(${draft.encoded},'base64'))
        ON CONFLICT (product_id) DO UPDATE SET
          version=EXCLUDED.version, sha256=EXCLUDED.sha256,
          file_data=EXCLUDED.file_data, uploaded_at=now()`;
    }
    return NextResponse.json({ stored: true, count: verified.length }, { status: 201, headers });
  } catch { return NextResponse.json({ error: "Privater Fachfassungs-Sammelupload fehlgeschlagen." }, { status: 500, headers }); }
}
