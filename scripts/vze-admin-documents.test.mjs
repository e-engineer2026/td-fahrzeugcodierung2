import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = fileURLToPath(new URL("../", import.meta.url));
const cache = new Map();
function loadTs(file, mocks = {}) {
  file = path.resolve(root, file);
  if (!path.extname(file)) file += ".ts";
  if (!Object.keys(mocks).length && cache.has(file)) return cache.get(file).exports;
  const record = { exports: {} };
  if (!Object.keys(mocks).length) cache.set(file, record);
  const transpiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const localRequire = specifier => mocks[specifier] ?? (specifier.startsWith(".")
    ? loadTs(path.resolve(path.dirname(file), specifier)) : require(specifier));
  vm.compileFunction(transpiled, ["require", "module", "exports"], { filename: file })
    (localRequire, record, record.exports);
  return record.exports;
}

const { GOLF7_VZE } = loadTs("app/lib/guideShopShared");
const { VZE_VARIANT_DRAFTS, VZE_MODEL_PRODUCTS } = loadTs("app/lib/vzeVariantDrafts");
const {
  GUIDE_ADMIN_DOCUMENTS, VZE_ADMIN_DOCUMENTS, GOLF7_ADMIN_DOCUMENT, findVzeAdminDocument,
  vzeAdminStorageVersion, vzeAdminDisplayRevision,
} = loadTs("app/lib/vzeAdminDocuments");

test("Alle VZE-Admin-PDFs sind eindeutig, ohne Änderungen an Shop-Produkt-IDs", () => {
  assert.equal(VZE_VARIANT_DRAFTS.length, 27);
  assert.equal(VZE_ADMIN_DOCUMENTS.length, 38);
  assert.equal(new Set(VZE_ADMIN_DOCUMENTS.map(doc => doc.slug)).size, 38);
  assert.equal(new Set(VZE_ADMIN_DOCUMENTS.map(doc => doc.productId)).size, 38);
  assert.deepEqual(VZE_ADMIN_DOCUMENTS.slice(1), VZE_MODEL_PRODUCTS);
  assert.equal(GOLF7_ADMIN_DOCUMENT.productId, GOLF7_VZE.id);
  assert.equal(GOLF7_ADMIN_DOCUMENT.sha256, GOLF7_VZE.expectedSha256);
  assert.equal(GOLF7_ADMIN_DOCUMENT.sku, GOLF7_VZE.sku);
  assert.equal(findVzeAdminDocument(GOLF7_ADMIN_DOCUMENT.slug)?.productId, GOLF7_VZE.id);
  assert.equal(findVzeAdminDocument("does-not-exist"), undefined);
});

test("Golf 7 bleibt Rev. 1.3 und die anderen Modelle behalten ihre Rev. 1.0", () => {
  assert.equal(vzeAdminStorageVersion(GOLF7_VZE.id), "1.3");
  assert.equal(vzeAdminDisplayRevision(GOLF7_VZE.id), "1.3");
  for (const doc of VZE_VARIANT_DRAFTS) {
    assert.equal(vzeAdminStorageVersion(doc.productId), "1.0-fachfassung");
    assert.equal(vzeAdminDisplayRevision(doc.productId), "1.0");
  }
});

test("Gemeinsamer Admin-Zugang bewahrt Auth, SHA-Prüfung und Käufertrennung", () => {
  const workspace = fs.readFileSync("app/components/GuideAdminWorkspace.tsx","utf8");
  const list = fs.readFileSync("app/components/GuideAdminVzeVariants.tsx","utf8");
  const api = fs.readFileSync("app/api/guide-shop/admin/vze-variants/route.ts","utf8");
  const bulk = fs.readFileSync("app/api/guide-shop/admin/vze-variants/bulk/route.ts","utf8");
  const download = fs.readFileSync("app/api/guide-shop/admin/vze-variants/download/route.ts","utf8");
  assert.doesNotMatch(workspace, /Golf 7 VZE · PDF Rev\. 1\.3 verwalten/);
  assert.match(workspace, /<GuideAdminVzeVariants\s*\/>/);
  assert.match(list, /<GuideSelector renderDocumentActions=\{renderDocumentActions\}/);
  for (const route of [api, bulk, download]) {
    assert.match(route, /await isGuideAdmin\(\)/);
    assert.match(route, /Cache-Control/);
  }
  assert.match(api, /GUIDE_ADMIN_DOCUMENTS/);
  assert.match(api, /assigned_filename=EXCLUDED\.assigned_filename/);
  assert.match(bulk, /digest !== draft\.sha256/);
  assert.match(download, /readGuidePdf\(sql, document\.productId, document\.sha256/);
  assert.match(download, /guidePdfResponse/);
  const buyer = fs.readFileSync("app/api/guide-shop/download/golf7-vze/route.ts","utf8");
  assert.match(buyer, /status='paid'/);
  assert.match(buyer, /GOLF7_VZE\.id/);
});

test("Die Zuordnung verwendet alle Shop-Produkte und speichert eine bearbeitete PDF", async () => {
  const { MQB_GUIDE_PRODUCTS } = loadTs("app/lib/mqbGuideProducts");
  assert.deepEqual(GUIDE_ADMIN_DOCUMENTS.map(doc => doc.productId), [
    ...VZE_ADMIN_DOCUMENTS.map(doc => doc.productId),
    ...MQB_GUIDE_PRODUCTS.map(doc => doc.id),
  ]);

  const documents = loadTs("app/lib/guideDocuments", { "server-only": {} });
  const { createHash } = require("node:crypto");
  let allowed = true;
  let publishRows = [];
  const writes = [];
  const statements = [];
  const sql = async (chunks, ...parameters) => {
    statements.push(chunks.join("?"));
    if (chunks[0].includes("SELECT")) return [
      { product_id: GOLF7_VZE.id, sha256: GOLF7_VZE.expectedSha256, assigned_filename: null },
    ];
    writes.push(parameters);
    if (chunks[0].includes("WITH chosen")) return publishRows;
    return [];
  };
  const { GET, POST, PATCH } = loadTs("app/api/guide-shop/admin/vze-variants/route", {
    "next/server": { NextResponse: Response },
    "../../../../lib/guideAdmin": { isGuideAdmin: async () => allowed },
    "../../../../lib/guideShopDb": { ensureGuideShopSchema: async () => sql },
    "../../../../lib/mqbGuideDocument": { readMqbGuideDocument: () => null },
    "../../../../lib/guideDocuments": documents,
  });

  const list = await (await GET()).json();
  assert.equal(list.documents.length, VZE_ADMIN_DOCUMENTS.length + MQB_GUIDE_PRODUCTS.length);
  assert.equal(list.documents.find(doc => doc.slug === GOLF7_ADMIN_DOCUMENT.slug).available, true);

  const origin = "https://td.example";
  const pdf = Buffer.from("%PDF-1.7\nNeue Fassung\n%%EOF\n");
  function request(slug, bytes, requestOrigin = origin) {
    const form = new FormData();
    form.set("slug", slug);
    form.set("pdf", new File([bytes], "Neue Fassung.pdf", { type: "application/pdf" }));
    return new Request(origin + "/upload", { method: "POST", headers: { origin: requestOrigin }, body: form });
  }
  const target = MQB_GUIDE_PRODUCTS[0];
  allowed = false;
  assert.equal((await POST(request(target.slug, pdf))).status, 403);
  allowed = true;
  assert.equal((await POST(request(target.slug, pdf, "https://other.example"))).status, 403);
  assert.equal((await POST(request("unknown", pdf))).status, 400);
  assert.equal((await POST(request(target.slug, Buffer.from("keine PDF")))).status, 400);
  assert.equal(writes.length, 0);

  const catalogSlug = loadTs("app/lib/guideCatalogLinks").catalogDocumentSlug("Polo AW", "coding-vcds-lane-memory");
  assert.equal((await POST(request(catalogSlug, pdf))).status, 201);
  assert.equal(writes.at(-1)[0], catalogSlug);
  assert.match(statements.at(-1), /INSERT INTO td_guide_document_drafts/);
  writes.length = 0;

  const response = await POST(request(target.slug, pdf));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).slug, target.slug);
  const hash = createHash("sha256").update(pdf).digest("hex");
  assert.deepEqual(writes, [[target.id, target.revision, hash, pdf.toString("base64"), "Neue Fassung.pdf"]]);
  assert.match(statements.at(-1), /INSERT INTO td_guide_document_drafts/);
  const publishRequest = (requestOrigin = origin, sha256 = hash) => new Request(origin + "/upload", {
    method: "PATCH", headers: { origin: requestOrigin, "content-type": "application/json" },
    body: JSON.stringify({ slug: target.slug, sha256 }),
  });
  allowed = false;
  assert.equal((await PATCH(publishRequest())).status, 403);
  allowed = true;
  assert.equal((await PATCH(publishRequest("https://other.example"))).status, 403);
  assert.equal((await PATCH(publishRequest(origin, "wrong"))).status, 400);
  assert.equal((await PATCH(publishRequest())).status, 409);
  assert.match(statements.at(-1), /DELETE FROM td_guide_document_drafts/);
  assert.match(statements.at(-1), /INSERT INTO td_guide_documents/);
  assert.match(statements.at(-1), /withdrawn=false/);
  publishRows = [{ product_id: target.id }];
  assert.equal((await PATCH(publishRequest())).status, 200);
  assert.equal((await (await PATCH(publishRequest())).json()).published, true);

  const row = { data: pdf.toString("base64"), sha256: hash, assigned_filename: "Neue Fassung.pdf" };
  const assigned = await documents.readGuidePdf(async () => [row], target.id, target.sha256, target.filename);
  assert.deepEqual(assigned, { bytes: pdf, filename: "Neue Fassung.pdf" });
  assert.equal(await documents.readGuidePdf(async () => [{ ...row, sha256: target.sha256 }],
    target.id, target.sha256, target.filename), null);
  assert.equal(await documents.readGuidePdf(async () => [{ ...row, assigned_filename: null }],
    target.id, target.sha256, target.filename), null);
});

test("Öffentliche und interne PDF-Anleitungen verwenden dieselbe Fahrzeugliste", () => {
  const load = file => fs.readFileSync(file, "utf8");
  const publicPage = load("app/codieranleitungen/page.tsx");
  const adminPage = load("app/konto/pdf-verwaltung/page.tsx");
  const selector = load("app/components/GuideSelector.tsx");
  const table = load("app/components/GuideTable.tsx");

  assert.match(publicPage, /<GuideCatalogPage>[\s\S]*<GuideSelector publishedCatalogSlugs=\{publishedCatalogSlugs\} \/>/);
  assert.match(adminPage, /if \(admin\) return <GuideCatalogPage admin>/);
  assert.match(selector, /catalogDocumentSlug\(vehicle\.model, row\.id\)/);
  assert.match(table, /showDownload=\{!renderDocumentActions \|\| !row.documentSlug\}/);
  assert.match(table, /renderDocumentActions\(row.documentSlug, row.title\)/);
});

test("Veröffentlichte PDFs benötigen zum Löschen Admin-Zugriff und die aktuelle Prüfsumme", async () => {
  const { MQB_GUIDE_PRODUCTS } = loadTs("app/lib/mqbGuideProducts");
  const product = MQB_GUIDE_PRODUCTS[0];
  const documents = loadTs("app/lib/guideDocuments", { "server-only": {} });
  const bundled = Buffer.from("%PDF-1.7\nMQB\n%%EOF");
  let allowed = true;
  let withdrawn = false;
  let deleteCount = 0;
  const sql = async (chunks, ...parameters) => {
    const statement = chunks.join("?");
    if (statement.includes("FROM td_guide_document_drafts")) {
      return [{ product_id: product.id, assigned_filename: "Entwurf.pdf", sha256: "draft" }];
    }
    if (statement.startsWith("SELECT")) {
      return withdrawn ? [{ product_id: product.id, withdrawn: true, sha256: "", assigned_filename: null }] : [];
    }
    assert.match(statement, /file_data=decode\('', 'base64'\)/);
    assert.match(statement, /WHERE NOT td_guide_documents.withdrawn/);
    assert.equal(parameters[0], product.id);
    deleteCount++;
    if (withdrawn || parameters[4] !== product.sha256) return [];
    withdrawn = true;
    return [{ product_id: product.id }];
  };

  const { GET, DELETE } = loadTs("app/api/guide-shop/admin/vze-variants/route", {
    "next/server": { NextResponse: Response },
    "../../../../lib/guideAdmin": { isGuideAdmin: async () => allowed },
    "../../../../lib/guideShopDb": { ensureGuideShopSchema: async () => sql },
    "../../../../lib/mqbGuideDocument": { readMqbGuideDocument: item => item.id === product.id ? bundled : null },
    "../../../../lib/guideDocuments": documents,
  });
  const status = async () => (await (await GET()).json()).documents.find(item => item.slug === product.slug);
  assert.equal((await status()).publishedSha256, product.sha256);

  const origin = "https://td.example";
  function remove({ slug = product.slug, sha256 = product.sha256, requestOrigin = origin } = {}) {
    return DELETE(new Request(origin + "/admin", { method: "DELETE",
      headers: { origin: requestOrigin, "content-type": "application/json" },
      body: JSON.stringify({ slug, sha256 }) }));
  }
  allowed = false;
  assert.equal((await remove()).status, 403);
  allowed = true;
  assert.equal((await remove({ requestOrigin: "https://other.example" })).status, 403);
  assert.equal((await remove({ slug: "unknown" })).status, 400);
  assert.equal(deleteCount, 0);
  assert.equal((await remove({ sha256: "a".repeat(64) })).status, 409);
  assert.equal((await (await remove()).json()).deleted, true);
  assert.equal((await remove()).status, 409);

  const removed = await status();
  assert.equal(removed.available, false);
  assert.equal(removed.publishedSha256, null);
  assert.equal(removed.filename, null);
  assert.equal(removed.draftFilename, "Entwurf.pdf");

  assert.equal(documents.isAvailableGuideDocument({ withdrawn: true }, product.sha256, () => bundled), false);
  assert.equal(await documents.readGuidePdf(async () => [{ withdrawn: true }],
    product.id, product.sha256, product.filename, () => bundled), null);
  assert.deepEqual(await documents.readGuidePdf(async () => [],
    product.id, product.sha256, product.filename, () => bundled), { bytes: bundled, filename: product.filename });
});

test("Fehlende Fahrzeug-PDF kann anhand der Katalogzeile zugeordnet werden", () => {
  const { catalogGuideProduct } = loadTs("app/lib/guideCatalogDocuments");
  const { catalogDocumentSlug } = loadTs("app/lib/guideCatalogLinks");
  const { findGuideAdminDocument } = loadTs("app/lib/vzeAdminDocuments");
  const { guideOrderProduct, guideOrderProductFromId, paypalMeUrl } = loadTs("app/lib/vzeShopProducts");
  const slug = catalogDocumentSlug("Polo AW", "coding-vcds-lane-memory");
  const product = catalogGuideProduct(slug);
  assert.ok(product);
  assert.equal(product.priceCents, 999);
  assert.match(product.title, /letzte Einstellung speichern/);
  assert.equal(findGuideAdminDocument(slug).productId, slug);
  assert.deepEqual(guideOrderProduct(slug), guideOrderProductFromId(slug));
  assert.equal(paypalMeUrl(product), "https://paypal.me/TiDrechsler/9.99EUR");
  assert.equal(catalogGuideProduct(catalogDocumentSlug("Fahrzeug unbekannt", "coding-vcds-lane-memory")), null);
  assert.equal(catalogGuideProduct(catalogDocumentSlug("Polo AW", "coding-tcross-lane-activate")), null);
  assert.equal(findGuideAdminDocument("mqb-lane-assist").productId, "mqb-lane-assist");
});


test("MLBevo Sammelupload: alle 36 neuen ZIP-Dateinamen sind genau einem Download zugeordnet", () => {
  const expected = [
    "audi-a4-b9-8w_parklenkassistent_pla.pdf",
    "audi-a4-b9-8w_stauassistent.pdf",
    "audi-a5-f5_parklenkassistent_pla.pdf",
    "audi-a5-f5_stauassistent.pdf",
    "audi-a6-c8-4a_intelligenter_park_assist_ipa.pdf",
    "audi-a6-c8-4a_manoeverassistent.pdf",
    "audi-a6-c8-4a_parklenkassistent_pla.pdf",
    "audi-a6-c8-4a_stauassistent.pdf",
    "audi-a6-c8-4a_trailer_assist.pdf",
    "audi-a7-c8-4k_intelligenter_park_assist_ipa.pdf",
    "audi-a7-c8-4k_manoeverassistent.pdf",
    "audi-a7-c8-4k_parklenkassistent_pla.pdf",
    "audi-a7-c8-4k_stauassistent.pdf",
    "audi-a7-c8-4k_trailer_assist.pdf",
    "audi-a8-d5-4n_intelligenter_park_assist_ipa.pdf",
    "audi-a8-d5-4n_manoeverassistent.pdf",
    "audi-a8-d5-4n_parklenkassistent_pla.pdf",
    "audi-a8-d5-4n_stauassistent.pdf",
    "audi-a8-d5-4n_trailer_assist.pdf",
    "audi-e-tron-ge_intelligenter_park_assist_ipa.pdf",
    "audi-e-tron-ge_manoeverassistent.pdf",
    "audi-e-tron-ge_trailer_assist.pdf",
    "audi-q5-fy_parklenkassistent_pla.pdf",
    "audi-q5-fy_stauassistent.pdf",
    "audi-q7-4m_intelligenter_park_assist_ipa.pdf",
    "audi-q7-4m_manoeverassistent.pdf",
    "audi-q7-4m_parklenkassistent_pla.pdf",
    "audi-q7-4m_stauassistent.pdf",
    "audi-q7-4m_trailer_assist.pdf",
    "audi-q8-4m_intelligenter_park_assist_ipa.pdf",
    "audi-q8-4m_manoeverassistent.pdf",
    "audi-q8-4m_parklenkassistent_pla.pdf",
    "audi-q8-4m_stauassistent.pdf",
    "audi-q8-4m_trailer_assist.pdf",
    "vw-touareg-iii-cr_parklenkassistent_pla.pdf",
    "vw-touareg-iii-cr_trailer_assist.pdf"
  ];
  const { DOCUMENTED_MLBEVO_ASSISTANCE_PRODUCTS, mlbevoAssistanceGuidesForVehicle } = loadTs("app/lib/mlbevoAssistanceGuides");
  const { catalogGuideProduct } = loadTs("app/lib/guideCatalogDocuments");
  const { findGuideAdminDocument } = loadTs("app/lib/vzeAdminDocuments");
  const { guideOrderProduct } = loadTs("app/lib/vzeShopProducts");
  const products = DOCUMENTED_MLBEVO_ASSISTANCE_PRODUCTS.filter(product => !product.filename.endsWith("_anleitung.pdf"));
  assert.deepEqual(products.map(product => product.filename).sort(), expected);
  assert.equal(new Set(products.map(product => product.slug)).size, 36);
  for (const product of products) {
    assert.equal(product.category, "Assistenzsysteme");
    assert.equal(GUIDE_ADMIN_DOCUMENTS.filter(doc => doc.filename.toLowerCase() === product.filename).length, 1);
    assert.equal(findGuideAdminDocument(product.slug)?.productId, product.id);
    assert.equal(catalogGuideProduct(product.slug)?.id, product.id);
    assert.equal(guideOrderProduct(product.slug)?.id, product.id);
    assert.ok(mlbevoAssistanceGuidesForVehicle({model: product.model, platform: "MLBevo"}).some(item => item.id === product.id));
  }
  assert.equal(mlbevoAssistanceGuidesForVehicle({model: "Golf 7 (5G)", platform: "MQB"}).length, 0);
});
