import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { catalogModels, canonicalRowsForModel, registryAudit } from "../../../../lib/canonicalCatalogRegistry";
import { findGuideAdminDocument } from "../../../../lib/vzeAdminDocuments";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  if (!await isGuideAdmin())
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  const model = new URL(request.url).searchParams.get("model");
  if (!model) return NextResponse.json({ models: catalogModels() }, { headers });
  if (!catalogModels().includes(model)) return NextResponse.json({ error: "Unbekanntes Fahrzeugmodell." }, { status: 404, headers });
  const source = canonicalRowsForModel(model);
  try {
    const sql = await ensureGuideShopSchema();
    const rows = await sql`SELECT id, coding_id AS "codingId", title, category,
      service_price_cents AS "servicePriceCents", pdf_price_cents AS "pdfPriceCents",
      pdf_slug AS "pdfSlug", hardware, requirements, source_hash AS "sourceHash",
      reviewed_source_hash AS "reviewedSourceHash"
      FROM td_coding_registry WHERE model=${model} ORDER BY title LIMIT 700`;
    const missingPdfMappingCandidates = source
      .filter(item => !findGuideAdminDocument(item.pdfSlug))
      .map(item => item.codingId);
    return NextResponse.json({
      model, audit: { ...registryAudit(source), missingPdfMappingCandidates },
      sourceCount: source.length, storedCount: rows.length,
      rows: source.map(item => {
        const stored = rows.find(row => row.id === item.id);
        return {
          ...item,
          imported: !!stored,
          draftStatus: !stored ? "not_imported" :
            stored.sourceHash !== item.sourceHash ? "outdated" :
            stored.reviewedSourceHash === stored.sourceHash ? "reviewed" : "draft",
          servicePriceCents: stored?.servicePriceCents ?? item.servicePriceCents,
          pdfPriceCents: stored?.pdfPriceCents ?? item.pdfPriceCents,
          category: stored?.category ?? item.category,
          hardware: stored?.hardware ?? item.hardware,
          requirements: stored?.requirements ?? item.requirements,
        };
      }),
    }, { headers });
  } catch {
    return NextResponse.json({ error: "Katalogdatenbank nicht verfügbar." }, { status: 503, headers });
  }
}

/** Bulk import is server-derived: no browser-supplied prices or product IDs. */
export async function POST(request: Request) {
  if (!await isGuideAdmin())
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let data: { model?: unknown };
  try { data = await request.json(); } catch {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400, headers });
  }
  if (typeof data?.model !== "string" || !catalogModels().includes(data.model))
    return NextResponse.json({ error: "Fahrzeugmodell nicht gefunden." }, { status: 404, headers });
  const rows = canonicalRowsForModel(data.model);
  const audit = registryAudit(rows);
  if (!rows.length || rows.length > 700 || audit.duplicates.length || audit.invalidPrices.length)
    return NextResponse.json({ error: "Katalogprüfung fehlgeschlagen.", audit }, { status: 422, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const statements = rows.map(entry => sql`INSERT INTO td_coding_registry (
      id,brand,model,coding_id,title,year_from,year_to,platform,category,
      service_price_cents,pdf_price_cents,pdf_slug,hardware,requirements,source_hash)
      VALUES (${entry.id},${entry.brand},${entry.model},${entry.codingId},
        ${entry.title},${entry.yearFrom},${entry.yearTo},${entry.platform},
        ${entry.category},${entry.servicePriceCents},${entry.pdfPriceCents},
        ${entry.pdfSlug},${entry.hardware},${entry.requirements},${entry.sourceHash})
      ON CONFLICT (id) DO UPDATE SET
        source_hash=EXCLUDED.source_hash,
        reviewed_source_hash=CASE WHEN td_coding_registry.source_hash=EXCLUDED.source_hash
          THEN td_coding_registry.reviewed_source_hash ELSE NULL END,
        updated_at=now()
      RETURNING id`);
    await sql.transaction(statements);
    return NextResponse.json({ imported: rows.length, audit, publicUpdated: false }, { headers });
  } catch {
    return NextResponse.json({ error: "Katalog konnte nicht als Entwurf importiert werden." }, { status: 500, headers });
  }
}

export async function PATCH(request: Request) {
  if (!await isGuideAdmin())
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let data: { id?: unknown; servicePriceCents?: unknown; pdfPriceCents?: unknown; requirements?: unknown; reviewed?: unknown };
  try { data = await request.json(); } catch {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400, headers });
  }
  if (typeof data?.id !== "string" || !/^[a-f0-9]{64}$/.test(data.id) ||
      !Number.isInteger(data.servicePriceCents) || typeof data.servicePriceCents !== "number" ||
      data.servicePriceCents < 0 || data.servicePriceCents > 2_000_000 ||
      !Number.isInteger(data.pdfPriceCents) || typeof data.pdfPriceCents !== "number" ||
      data.pdfPriceCents < 0 || data.pdfPriceCents > 200_000 ||
      typeof data.requirements !== "string" || data.requirements.length > 2500 ||
      data.reviewed !== true) {
    return NextResponse.json({ error: "Preis, Voraussetzungen und Fachprüfung erforderlich." }, { status: 400, headers });
  }
  try {
    const sql = await ensureGuideShopSchema();
    const [row] = await sql`UPDATE td_coding_registry
      SET service_price_cents=${data.servicePriceCents},
        pdf_price_cents=${data.pdfPriceCents},
        requirements=${data.requirements},
        reviewed_source_hash=source_hash, updated_at=now()
      WHERE id=${data.id} RETURNING id`;
    return row ? NextResponse.json({ saved: true, publiclyPublished: false }, { headers }) :
      NextResponse.json({ error: "Katalogzeile vorher importieren." }, { status: 404, headers });
  } catch {
    return NextResponse.json({ error: "Änderungen konnten nicht gespeichert werden." }, { status: 500, headers });
  }
}
