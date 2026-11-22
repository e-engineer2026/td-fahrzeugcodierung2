import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "private, no-store" };

/**
 * Ein eigener, kontogebundener Admin-Upload, ohne Geheimschlüssel im Browser.
 * Nur das exakt bekannte TD-G7-AS-003-Prüf-PDF (Rev 1.2) darf hinterlegt werden.
 * Eine technische Freigabe oder ein Verkauf erfolgt dadurch ausdrücklich nicht.
 */
export async function POST(request: Request) {
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Nicht berechtigt." },
    { status: 403, headers: noStore });
  const size = Number(request.headers.get("content-length") ?? "0");
  if (size > 1_500_000) return NextResponse.json({ error: "Datei zu groß." },
    { status: 413, headers: noStore });
  let form: FormData;
  try { form = await request.formData(); } catch {
    return NextResponse.json({ error: "Upload-Daten ungültig." }, { status: 400, headers: noStore });
  }
  const file = form.get("pdf");
  if (!(file instanceof File) || file.size < 1_000 || file.size > 1_000_000 ||
      file.type !== "application/pdf") {
    return NextResponse.json({ error: "Bitte die Original-PDF-Datei auswählen." },
      { status: 400, headers: noStore });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-" ||
    !bytes.subarray(-2_048).toString("latin1").includes("%%EOF")) {
    return NextResponse.json({ error: "Ungültige PDF-Datei." }, { status: 400, headers: noStore });
  }
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== GOLF7_VZE.expectedSha256) {
    return NextResponse.json({ error: "Dateiversion stimmt nicht mit dem geprüften TD-G7-AS-003-Entwurf überein." },
      { status: 422, headers: noStore });
  }
  try {
    const sql = await ensureGuideShopSchema();
    const encoded = bytes.toString("base64");
    const [stored] = await sql`INSERT INTO td_guide_documents (product_id, version, sha256, file_data)
      VALUES (${GOLF7_VZE.id}, ${GOLF7_VZE.revision}, ${digest}, decode(${encoded}, 'base64'))
      ON CONFLICT(product_id) DO UPDATE
      SET version=EXCLUDED.version, sha256=EXCLUDED.sha256,
        file_data=EXCLUDED.file_data, uploaded_at=now()
      WHERE td_guide_documents.assigned_filename IS NULL RETURNING product_id`;
    if (!stored) return NextResponse.json({ error: "Für diesen Download ist bereits eine PDF manuell zugeordnet." },
      { status: 409, headers: noStore });
    return NextResponse.json({ stored: true, productId: GOLF7_VZE.id,
      revision: GOLF7_VZE.revision, bytes: bytes.length, sha256: digest,
      technicalApproved: false, checkoutActivated: false }, { status: 201, headers: noStore });
  } catch {
    return NextResponse.json({ error: "Privates Speichern in Neon fehlgeschlagen." },
      { status: 500, headers: noStore });
  }
}
