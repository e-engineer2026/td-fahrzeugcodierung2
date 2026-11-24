import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateGuideMaster, createGuideDraftPdf } from "../app/lib/masterPdfFactory.ts";

const master = {
  id: "td-test-master", title: "Verkehrszeichenerkennung für geprüfte Variante",
  revision: "1.0", overview: "Zulässigkeit abhängig von der verbauten Kamera und Software.",
  safety: "Vorher immer einen vollständigen Auto-Scan erstellen und Codierung sichern.",
  variants: [{
    slug: "catalog:Golf%207%20(5G):coding-test", model: "Golf 7 (5G)",
    variantNote: "Nur bei bestätigter Kamera/Infotainment- und Softwareausstattung des konkreten Fahrzeugs.",
    reviewed: false,
    steps: [{ ecu: "A5", path: "Anpassung Testkanal", original: "Original", target: "Prüfwert",
      note: "Testfall, kein produktiver Codierwert" }],
  }],
};

test("Master requires explicit, distinct vehicle variants and real coding step fields", () => {
  assert.deepEqual(validateGuideMaster(master), master);
  assert.equal(validateGuideMaster({ ...master, variants: [] }), null);
  assert.equal(validateGuideMaster({ ...master,
    variants: [master.variants[0], master.variants[0]] }), null);
  assert.equal(validateGuideMaster({ ...master,
    variants: [{ ...master.variants[0], steps: [] }] }), null);
  assert.equal(validateGuideMaster({ ...master,
    variants: [{ ...master.variants[0], steps: [{ ...master.variants[0].steps[0], target: "" }] }] }), null);
});

test("PDF writer produces valid xref offsets, EOF and private draft banner", () => {
  const checked = validateGuideMaster(master);
  assert.ok(checked);
  const pdf = createGuideDraftPdf(checked, checked.variants[0], "VW Golf 7 Verkehrszeichenerkennung");
  assert.equal(pdf.subarray(0, 8).toString("ascii"), "%PDF-1.4");
  assert.match(pdf.subarray(-60).toString("latin1"), /%%EOF\s*$/);
  assert.ok(pdf.length > 1000);
  const s = pdf.toString("latin1");
  const start = /startxref\s+(\d+)/.exec(s);
  assert.ok(start);
  assert.equal(s.slice(Number(start[1]), Number(start[1]) + 5), "xref\n");
  assert.match(s, /\/Type \/Pages/);
  assert.match(s, /\/WinAnsiEncoding/);
  assert.match(s, /\/Contents 6 0 R/);
  assert.ok(s.includes(Buffer.from("PRIVATER ENTWURF", "latin1").toString("hex")), "draft banner encoded in PDF stream");
});

test("Master factory writes to private drafts and cannot publish by itself", () => {
  const route = fs.readFileSync("app/api/guide-shop/admin/master-factory/route.ts", "utf8");
  const registry = fs.readFileSync("app/api/guide-shop/admin/catalog-registry/route.ts", "utf8");
  const code = fs.readFileSync("app/lib/canonicalCatalogRegistry.ts", "utf8");
  const workspace = fs.readFileSync("app/components/GuideAdminWorkspace.tsx", "utf8");
  assert.match(route, /await isGuideAdmin\(\)/);
  assert.match(route, /td_guide_document_drafts/);
  assert.match(route, /ON CONFLICT \(product_id\) DO NOTHING/);
  assert.doesNotMatch(route, /INSERT INTO td_guide_documents|SET status='paid'/);
  assert.match(route, /catalogGuideProduct\(slug\)/);
  assert.match(registry, /await isGuideAdmin\(\)/);
  assert.match(registry, /await sql\.transaction\(statements\)/);
  assert.match(registry, /publiclyPublished: false/);
  assert.match(code, /codingsForVehicle\(vehicle\)/);
  assert.match(code, /sourceHash/);
  assert.match(workspace, /AdminCatalogFactoryPanel/);
});

test("Published PDFs and existing orders remain untouched by schema migration", () => {
  const schema = fs.readFileSync("app/lib/guideShopDb.ts", "utf8");
  assert.match(schema, /td_coding_registry/);
  assert.match(schema, /td_guide_master_templates/);
  assert.doesNotMatch(schema, /DROP TABLE/);
});
