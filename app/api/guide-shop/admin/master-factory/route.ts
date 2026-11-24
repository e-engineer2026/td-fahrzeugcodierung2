import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { findGuideAdminDocument } from "../../../../lib/vzeAdminDocuments";
import { catalogGuideProduct } from "../../../../lib/guideCatalogDocuments";
import { createGuideDraftPdf, validateGuideMaster, type GuideMaster } from "../../../../lib/masterPdfFactory";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET() {
  if (!await isGuideAdmin())
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const rows = await sql`SELECT id,title,revision,procedure,updated_at AS "updatedAt"
      FROM td_guide_master_templates ORDER BY updated_at DESC LIMIT 100`;
    return NextResponse.json({ masters: rows.map(row => {
      const procedure = validateGuideMaster(row.procedure);
      return { id: row.id, title: row.title, revision: row.revision,
        variants: procedure?.variants.map(v => ({ slug: v.slug, model: v.model, reviewed: v.reviewed })) ?? [],
        updatedAt: row.updatedAt };
    }) }, { headers });
  } catch { return NextResponse.json({ error: "Mastervorlagen nicht verfügbar." }, { status: 503, headers }); }
}

export async function POST(request: Request) {
  if (!await isGuideAdmin())
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  if (Number(request.headers.get("content-length") || 0) > 100_000)
    return NextResponse.json({ error: "Vorlage zu groß." }, { status: 413, headers });

  let body: { action?: unknown; master?: unknown; masterId?: unknown; slugs?: unknown };
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 100_000) return NextResponse.json({
      error: "Vorlage zu groß."
    }, { status: 413, headers });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ error: "Ungültige Vorlagendaten." }, { status: 400, headers }); }

  if (body?.action === "save") {
    const master = validateGuideMaster(body.master);
    if (!master) return NextResponse.json({
      error: "Master, Modellvarianten oder echte Codierschritte fehlen."
    }, { status: 422, headers });
    for (const variant of master.variants) {
      const document = findGuideAdminDocument(variant.slug);
      const catalog = catalogGuideProduct(variant.slug);
      if (!document || (catalog && variant.model !== catalog.model))
        return NextResponse.json({
          error: "PDF-Zuordnung ist nicht im aktuellen Fahrzeugkatalog vorhanden: " + variant.slug
        }, { status: 422, headers });
    }
    try {
      const sql = await ensureGuideShopSchema();
      await sql`INSERT INTO td_guide_master_templates (id,title,revision,procedure)
        VALUES (${master.id},${master.title},${master.revision},${JSON.stringify(master)}::jsonb)
        ON CONFLICT (id) DO UPDATE SET
          title=EXCLUDED.title,revision=EXCLUDED.revision,procedure=EXCLUDED.procedure,updated_at=now()`;
      return NextResponse.json({ saved: true, masterId: master.id, publicUpdated: false }, { headers });
    } catch {
      return NextResponse.json({ error: "Vorlage konnte nicht privat gespeichert werden." },
        { status: 500, headers });
    }
  }

  if (body?.action === "generate") {
    const masterId = body.masterId;
    const slugs = body.slugs;
    if (typeof masterId !== "string" || !/^[a-z0-9-]{5,70}$/.test(masterId) ||
        !Array.isArray(slugs) || !slugs.length || slugs.length > 12 ||
        slugs.some(slug => typeof slug !== "string" || slug.length > 800) ||
        new Set(slugs).size !== slugs.length) {
      return NextResponse.json({ error: "Vorlage oder Modellzuordnungen ungültig." },
        { status: 400, headers });
    }
    try {
      const sql = await ensureGuideShopSchema();
      const [saved] = await sql`SELECT procedure FROM td_guide_master_templates WHERE id=${masterId}`;
      const master = validateGuideMaster(saved?.procedure) as GuideMaster | null;
      if (!master) return NextResponse.json({ error: "Gespeicherte Mastervorlage fehlt." },
        { status: 404, headers });
      const output = [];
      for (const slug of slugs as string[]) {
        const variant = master.variants.find(item => item.slug === slug);
        const document = findGuideAdminDocument(slug);
        const catalog = catalogGuideProduct(slug);
        if (!variant || !document || (catalog && catalog.model !== variant.model))
          return NextResponse.json({ error: "Variante nicht fachlich zugeordnet: " + slug },
            { status: 422, headers });
        const pdf = createGuideDraftPdf(master, variant, document.title);
        if (pdf.byteLength < 1000 || pdf.byteLength > 3_000_000)
          return NextResponse.json({ error: "PDF-Größe nicht zulässig." }, { status: 422, headers });
        const hash = createHash("sha256").update(pdf).digest("hex");
        output.push({
          productId: document.productId, filename: "TD_" +
            master.id + "_" + createHash("sha256").update(slug).digest("hex").slice(0, 8) + ".pdf",
          version: master.revision, digest: hash, encoded: pdf.toString("base64"),
        });
      }
      // Existing drafts must never be overwritten without explicit deletion/review.
      const results = await sql.transaction(output.map(file => sql`
        INSERT INTO td_guide_document_drafts (product_id,version,sha256,file_data,assigned_filename)
        VALUES (${file.productId},${file.version},${file.digest},
          decode(${file.encoded},'base64'),${file.filename})
        ON CONFLICT (product_id) DO NOTHING RETURNING product_id`));
      return NextResponse.json({
        generatedDrafts: results.filter(rows => rows.length > 0).length,
        skippedExistingDrafts: results.filter(rows => !rows.length).length,
        published: false,
      }, { status: 201, headers });
    } catch {
      return NextResponse.json({ error: "PDF-Entwürfe konnten nicht erzeugt werden." },
        { status: 500, headers });
    }
  }
  return NextResponse.json({ error: "Unbekannte Aktion." }, { status: 400, headers });
}
