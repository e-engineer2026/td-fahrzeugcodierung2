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
const { VZE_VARIANT_DRAFTS } = loadTs("app/lib/vzeVariantDrafts");
const {
  GUIDE_ADMIN_DOCUMENTS, VZE_ADMIN_DOCUMENTS, GOLF7_ADMIN_DOCUMENT, findVzeAdminDocument,
  vzeAdminStorageVersion, vzeAdminDisplayRevision,
} = loadTs("app/lib/vzeAdminDocuments");

test("Alle 13 VZE-Admin-PDFs sind eindeutig, ohne Änderungen an Shop-Produkt-IDs", () => {
  assert.equal(VZE_VARIANT_DRAFTS.length, 12);
  assert.equal(VZE_ADMIN_DOCUMENTS.length, 13);
  assert.equal(new Set(VZE_ADMIN_DOCUMENTS.map(doc => doc.slug)).size, 13);
  assert.equal(new Set(VZE_ADMIN_DOCUMENTS.map(doc => doc.productId)).size, 13);
  assert.deepEqual(VZE_ADMIN_DOCUMENTS.slice(1), VZE_VARIANT_DRAFTS);
  assert.equal(GOLF7_ADMIN_DOCUMENT.productId, GOLF7_VZE.id);
  assert.equal(GOLF7_ADMIN_DOCUMENT.sha256, GOLF7_VZE.expectedSha256);
  assert.equal(GOLF7_ADMIN_DOCUMENT.sku, GOLF7_VZE.sku);
  assert.equal(findVzeAdminDocument("vw-golf-7-5g")?.productId, GOLF7_VZE.id);
  assert.equal(findVzeAdminDocument("does-not-exist"), undefined);
});

test("Golf 7 bleibt Rev. 1.3 und die anderen zwölf behalten ihre Rev. 1.0", () => {
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
  assert.match(list, /PDF-Downloads/);
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

test("Die Zuordnung verwendet alle 15 Shop-Produkte und speichert eine bearbeitete PDF", async () => {
  const { MQB_GUIDE_PRODUCTS } = loadTs("app/lib/mqbGuideProducts");
  assert.deepEqual(GUIDE_ADMIN_DOCUMENTS.map(doc => doc.productId), [
    ...VZE_ADMIN_DOCUMENTS.map(doc => doc.productId),
    ...MQB_GUIDE_PRODUCTS.map(doc => doc.id),
  ]);

  const documents = loadTs("app/lib/guideDocuments", { "server-only": {} });
  const { createHash } = require("node:crypto");
  let allowed = true;
  const writes = [];
  const sql = async (chunks, ...parameters) => {
    if (chunks[0].includes("SELECT")) return [
      { product_id: GOLF7_VZE.id, sha256: GOLF7_VZE.expectedSha256, assigned_filename: null },
    ];
    writes.push(parameters);
    return [];
  };
  const { GET, POST } = loadTs("app/api/guide-shop/admin/vze-variants/route", {
    "next/server": { NextResponse: Response },
    "../../../../lib/guideAdmin": { isGuideAdmin: async () => allowed },
    "../../../../lib/guideShopDb": { ensureGuideShopSchema: async () => sql },
    "../../../../lib/mqbGuideDocument": { readMqbGuideDocument: () => null },
    "../../../../lib/guideDocuments": documents,
  });

  const list = await (await GET()).json();
  assert.equal(list.documents.length, 15);
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

  const response = await POST(request(target.slug, pdf));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).slug, target.slug);
  const hash = createHash("sha256").update(pdf).digest("hex");
  assert.deepEqual(writes, [[target.id, target.revision, hash, pdf.toString("base64"), "Neue Fassung.pdf"]]);

  const row = { data: pdf.toString("base64"), sha256: hash, assigned_filename: "Neue Fassung.pdf" };
  const assigned = await documents.readGuidePdf(async () => [row], target.id, target.sha256, target.filename);
  assert.deepEqual(assigned, { bytes: pdf, filename: "Neue Fassung.pdf" });
  assert.equal(await documents.readGuidePdf(async () => [{ ...row, sha256: target.sha256 }],
    target.id, target.sha256, target.filename), null);
  assert.equal(await documents.readGuidePdf(async () => [{ ...row, assigned_filename: null }],
    target.id, target.sha256, target.filename), null);
});
