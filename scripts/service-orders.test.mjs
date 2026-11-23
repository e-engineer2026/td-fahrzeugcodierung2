import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateServiceRequest, canTransitionServiceOrder } from "../app/lib/serviceOrderRules.ts";

const valid = { brand: "Audi", model: "A4 B9", year: 2019, mode: "remote",
  services: "MMI und Smartphone-Interface diagnostizieren" };

test("Service-Aufträge: serverseitige Dateneingaben prüfen und Preis nicht aus dem Browser übernehmen", () => {
  assert.deepEqual(validateServiceRequest({ ...valid, quoteCents: 0 }), valid);
  assert.equal(validateServiceRequest({ ...valid, brand: "Andere" }), null);
  assert.equal(validateServiceRequest({ ...valid, year: "2019" }), null);
  assert.equal(validateServiceRequest({ ...valid, year: 2035 }), null);
  assert.equal(validateServiceRequest({ ...valid, services: " " }), null);
  assert.equal(validateServiceRequest({ ...valid, mode: "paypal" }), null);
  assert.equal(validateServiceRequest(null), null);
});

test("Auftragsstatus: abgeschlossene oder stornierte Aufträge nicht rückwärts bewegen", () => {
  assert.equal(canTransitionServiceOrder("requested", "review"), true);
  assert.equal(canTransitionServiceOrder("review", "scheduled"), true);
  assert.equal(canTransitionServiceOrder("scheduled", "completed"), true);
  assert.equal(canTransitionServiceOrder("review", "cancelled"), true);
  assert.equal(canTransitionServiceOrder("completed", "review"), false);
  assert.equal(canTransitionServiceOrder("cancelled", "requested"), false);
  assert.equal(canTransitionServiceOrder("quoted", "requested"), false);
  assert.equal(canTransitionServiceOrder("requested", "requested"), false);
});

test("Kunden sehen nur eigene Aufträge, interne Notizen bleiben adminintern", () => {
  const buyer = fs.readFileSync("app/api/service-orders/route.ts", "utf8");
  const admin = fs.readFileSync("app/api/service-orders/admin/route.ts", "utf8");
  const account = fs.readFileSync("app/konto/page.tsx", "utf8");
  assert.match(buyer, /await auth\(\)/);
  assert.match(buyer, /WHERE clerk_user_id=\$\{userId\}/);
  assert.match(buyer, /verification\?\.status === "verified"/);
  assert.match(buyer, /request\.headers\.get\("origin"\)/);
  assert.match(buyer, /interval '1 day'/);
  assert.doesNotMatch(buyer, /admin_note AS/);
  assert.match(admin, /await isGuideAdmin\(\)/);
  assert.match(admin, /AND status=\$\{current.status\}/);
  assert.match(admin, /canTransitionServiceOrder/);
  assert.match(account, /ServiceOrdersPanel/);
  assert.match(account, /\/konto\/auftraege/);
});

test("Leistungsanfragen werden nicht automatisch als PDF-Zahlungen markiert", () => {
  const routes = [
    fs.readFileSync("app/api/service-orders/route.ts", "utf8"),
    fs.readFileSync("app/api/service-orders/admin/route.ts", "utf8"),
  ].join("\n");
  assert.doesNotMatch(routes, /td_guide_orders|paypal_capture_id|SET status='paid'/);
  assert.match(fs.readFileSync("app/lib/serviceOrdersDb.ts", "utf8"), /td_service_orders/);
});
