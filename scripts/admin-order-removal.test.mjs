import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = fs.readFileSync("app/api/guide-shop/admin/account-orders/route.ts", "utf8");
const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;

test("only admin can remove an eligible pending order, atomically", async () => {
  let allowed = false, updates = 0, returnRows = [{ id: "ok" }];
  let statement = "";
  const sql = async (parts) => { updates++; statement = parts.join("?"); return returnRows; };
  const mocks = {
    "next/server": { NextResponse: Response },
    "../../../../lib/guideAdmin": { isGuideAdmin: async () => allowed },
    "../../../../lib/guideShopDb": { ensureGuideShopSchema: async () => sql },
    "../../../../lib/vzeShopProducts": {}, "../../../../lib/mqbGuideProducts": {},
    "../../../../lib/mqbGuideDocument": {},
  };
  const record = { exports: {} };
  vm.compileFunction(code, ["require", "module", "exports"])((name) => mocks[name], record, record.exports);
  const make = (id, origin = "https://td.example") => new Request("https://td.example/api", {
    method: "PATCH", headers: { origin, "content-type": "application/json" }, body: JSON.stringify({ orderId: id }),
  });
  const id = "12345678-1234-1234-1234-123456789abc";
  assert.equal((await record.exports.PATCH(make(id))).status, 403);
  allowed = true;
  assert.equal((await record.exports.PATCH(make(id, "https://other.example"))).status, 403);
  assert.equal((await record.exports.PATCH(make("invalid"))).status, 400);
  assert.equal(updates, 0);
  assert.equal((await record.exports.PATCH(make(id))).status, 200);
  assert.match(statement, /status='pending'/);
  assert.match(statement, /paypal_transaction_id IS NULL/);
  assert.match(statement, /paypal_capture_id IS NULL/);
  assert.match(statement, /paid_at IS NULL/);
  returnRows = [];
  assert.equal((await record.exports.PATCH(make(id))).status, 409);
});
