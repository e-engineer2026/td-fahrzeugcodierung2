import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const schema = fs.readFileSync("app/lib/guideShopDb.ts", "utf8");
const account = fs.readFileSync("app/api/guide-shop/admin/account-orders/route.ts", "utf8");
const manual = fs.readFileSync("app/api/guide-shop/admin/manual-grants/route.ts", "utf8");
const capture = fs.readFileSync("app/api/guide-shop/orders/capture/route.ts", "utf8");

test("PayPal-Transaktionen sind kanalübergreifend eindeutig, auch bei Rückerstattung", () => {
  assert.match(schema, /CREATE TABLE IF NOT EXISTS td_guide_payment_claims/);
  assert.match(schema, /transaction_id text PRIMARY KEY/);
  assert.match(schema, /claim_kind IN \('account', 'guest', 'manual'\)/);
  assert.match(schema, /SELECT upper\(paypal_transaction_id\).*FROM td_guide_orders/);
  assert.match(schema, /SELECT upper\(paypal_capture_id\).*FROM td_guide_guest_orders/);
  assert.match(schema, /SELECT upper\(paypal_transaction_id\).*FROM td_guide_manual_grants/);
  assert.doesNotMatch([account, manual, capture].join("\n"), /DELETE FROM td_guide_payment_claims/);
});

test("Manuelle PayPal.Me-Freigaben verlangen weiterhin eine reale Admin-Prüfung", () => {
  for (const route of [account, manual]) {
    assert.match(route, /await isGuideAdmin\(\)/);
    assert.match(route, /paymentVerified !== true/);
    assert.match(route, /WITH (eligible|claimed) AS/);
    assert.match(route, /INSERT INTO td_guide_payment_claims/);
    assert.match(route, /ON CONFLICT \(transaction_id\) DO NOTHING/);
    assert.match(route, /RETURNING/);
  }
  assert.match(account, /EXISTS \(SELECT 1 FROM claimed\)/);
  assert.match(manual, /FROM claimed/);
});

test("Gast-Freigaben nur nach verifiziertem PayPal-Capture, niemals allein durch Rückleitung", () => {
  assert.match(capture, /validateCompletedCapture\(response, localId, paypalId\)/);
  assert.match(capture, /guestTokenHashFromCookie\(\)/);
  assert.match(capture, /INSERT INTO td_guide_payment_claims/);
  assert.match(capture, /ON CONFLICT \(transaction_id\) DO NOTHING/);
  assert.match(capture, /EXISTS \(SELECT 1 FROM claimed\)/);
  assert.match(capture, /AND status='pending'/);
});

test("Gmail-Zahlungshinweise geben keine PDF automatisch frei", () => {
  const importRoute = fs.readFileSync("app/api/guide-shop/gmail-receipts/route.ts", "utf8");
  assert.doesNotMatch(importRoute, /SET status='paid'/);
  assert.doesNotMatch(importRoute, /INSERT INTO td_guide_payment_claims/);
  assert.match(importRoute, /niemals ein verifizierter PayPal-Zahlungsnachweis/);
});
