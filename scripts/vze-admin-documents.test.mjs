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
function loadTs(file) {
  file = path.resolve(root, file);
  if (!path.extname(file)) file += ".ts";
  if (cache.has(file)) return cache.get(file).exports;
  const record = { exports: {} };
  cache.set(file, record);
  const transpiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const localRequire = specifier => specifier.startsWith(".")
    ? loadTs(path.resolve(path.dirname(file), specifier)) : require(specifier);
  vm.compileFunction(transpiled, ["require", "module", "exports"], { filename: file })
    (localRequire, record, record.exports);
  return record.exports;
}

const { GOLF7_VZE } = loadTs("app/lib/guideShopShared");
const { VZE_VARIANT_DRAFTS } = loadTs("app/lib/vzeVariantDrafts");
const {
  VZE_ADMIN_DOCUMENTS, GOLF7_ADMIN_DOCUMENT, findVzeAdminDocument,
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
  assert.match(list, /Alle 13 Dokumente und Downloads anzeigen/);
  for (const route of [api, bulk, download]) {
    assert.match(route, /await isGuideAdmin\(\)/);
    assert.match(route, /Cache-Control/);
  }
  assert.match(api, /GOLF7_VZE\.id/);
  assert.match(api, /digest !== draft\.sha256/);
  assert.match(bulk, /digest !== draft\.sha256/);
  assert.match(download, /sha256=\$\{draft\.sha256\}/);
  assert.match(download, /Content-Disposition/);
  const buyer = fs.readFileSync("app/api/guide-shop/download/golf7-vze/route.ts","utf8");
  assert.match(buyer, /status='paid'/);
  assert.match(buyer, /GOLF7_VZE\.id/);
});
