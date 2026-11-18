import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { resolveShopMode, guideShopReturnOrigin, validateCompletedCapture, GOLF7_VZE } from "../app/lib/guideShopShared.ts";
import { newGuestToken, hashGuestToken } from "../app/lib/guideGuestToken.ts";

test("Golf 7 VZE Fachfreigabe Rev 1.3 nur mit fester Prüfsumme", () => {
  assert.equal(GOLF7_VZE.revision, "1.3");
  assert.equal(GOLF7_VZE.expectedSha256, "12a210529950df7dd0b5bc5c89c231de39854b2850dc4515ac8db4cc2c950ac6");
  assert.match(GOLF7_VZE.expectedSha256, /^[a-f0-9]{64}$/);
  assert.equal(GOLF7_VZE.pages, 3);
});
const merchant = { PAYPAL_CLIENT_ID:"sandbox-demo", PAYPAL_CLIENT_SECRET:"test-only", PAYPAL_WEBHOOK_ID:"WH-SANDBOX" };
test("PDF-Shop ist ohne PayPal und explizite Freigabe geschlossen", () => {
  assert.equal(resolveShopMode({}),"off");
  assert.equal(resolveShopMode({PAYPAL_CLIENT_ID:"x",PAYPAL_CLIENT_SECRET:"y",
    TD_GUIDE_SHOP_MODE:"sandbox",PAYPAL_ENV:"sandbox"}),"off");
  assert.equal(resolveShopMode({ TD_GUIDE_SHOP_MODE:"live", PAYPAL_ENV:"live" }),"off");
  assert.equal(resolveShopMode({ ...merchant, TD_GUIDE_SHOP_MODE:"live", PAYPAL_ENV:"sandbox" }),"off");
  assert.equal(resolveShopMode({ ...merchant, TD_GUIDE_SHOP_MODE:"sandbox", PAYPAL_ENV:"sandbox" }),"sandbox");
});
test("Sandbox-Checkout kehrt ausschließlich zur konfigurierten HTTPS-Preview zurück", () => {
  const base = { ...merchant, TD_GUIDE_SHOP_MODE:"sandbox", PAYPAL_ENV:"sandbox" };
  const correct="https://td-fahrzeugcodierung-git-main-e-engineer2026s-projects.vercel.app";
  assert.equal(guideShopReturnOrigin({...base,TD_GUIDE_SHOP_RETURN_ORIGIN:correct}),correct);
  assert.throws(()=>guideShopReturnOrigin(base),/nicht konfiguriert/);
  assert.throws(()=>guideShopReturnOrigin({...base,TD_GUIDE_SHOP_RETURN_ORIGIN:"https://evil.example"}));
  assert.throws(()=>guideShopReturnOrigin({...base,TD_GUIDE_SHOP_RETURN_ORIGIN:"http://td-test.vercel.app"}));
  assert.equal(guideShopReturnOrigin({}),"https://td-fahrzeugcodierung.de");
});
test("Live-Shop erst mit PayPal-Webhook, Technikfreigabe und rechtlicher Freigabe", () => {
  const base={...merchant,TD_GUIDE_SHOP_MODE:"live",PAYPAL_ENV:"live",PAYPAL_WEBHOOK_ID:"WH-123"};
  assert.equal(resolveShopMode(base),"off");
  assert.equal(resolveShopMode({...base,TD_G7_VZE_TECH_APPROVED:"true"}),"off");
  assert.equal(resolveShopMode({...base,TD_GUIDE_LEGAL_APPROVED:"true"}),"off");
  assert.equal(resolveShopMode({...base,TD_G7_VZE_TECH_APPROVED:"true",TD_GUIDE_LEGAL_APPROVED:"true"}),"off");
  assert.equal(resolveShopMode({...base,TD_G7_VZE_TECH_APPROVED:"true",TD_GUIDE_LEGAL_APPROVED:"true",TD_GUIDE_CONFIRMATION_EMAIL_READY:"true"}),"live");
});
const local="d0ddc41b-89ab-4ec2-9859-2b3dacc08592";
const paypal="9S876543AB123456C";
const capture={
  id:paypal,status:"COMPLETED",purchase_units:[{
    reference_id:GOLF7_VZE.id, custom_id:local,
    payments:{captures:[{ id:"2L555ABCD00000001",status:"COMPLETED",amount:{
      currency_code:"EUR",value:"13.99"
    }}]}
  }]
};
test("Nur Betrag, Währung, bezahlte Capture-ID und Eigentumszuordnung eröffnen Zugriff",()=>{
  assert.deepEqual(validateCompletedCapture(capture,local,paypal),{captureId:"2L555ABCD00000001"});
  assert.equal(validateCompletedCapture(capture,local,"wrong"),null);
  assert.equal(validateCompletedCapture(capture,"other",paypal),null);
  assert.equal(validateCompletedCapture({...capture,status:"APPROVED"},local,paypal),null);
  assert.equal(validateCompletedCapture({...capture,purchase_units:[]},local,paypal),null);
  const cloned=structuredClone(capture);
  cloned.purchase_units[0].payments.captures[0].amount.value="1.00";
  assert.equal(validateCompletedCapture(cloned,local,paypal),null);
  cloned.purchase_units[0].payments.captures[0].amount.value="13.99";
  cloned.purchase_units[0].payments.captures[0].amount.currency_code="USD";
  assert.equal(validateCompletedCapture(cloned,local,paypal),null);
  cloned.purchase_units[0].payments.captures[0].amount.currency_code="EUR";
  cloned.purchase_units[0].payments.captures[0].status="PENDING";
  assert.equal(validateCompletedCapture(cloned,local,paypal),null);
});
test("Sperren im Quellcode: kein öffentlicher PDF-Link und keine Freigabe ohne Auth/Bezahlung",()=>{
  const download=fs.readFileSync("app/api/guide-shop/download/golf7-vze/route.ts","utf8");
  const order=fs.readFileSync("app/api/guide-shop/orders/route.ts","utf8");
  const admin=fs.readFileSync("app/api/guide-shop/admin/document/route.ts","utf8");
  assert.match(download,/await auth\(\)/);
  assert.match(download,/status='paid'/);
  assert.match(download,/Cache-Control/);
  assert.match(order,/configuredShopMode\(\) === "off"/);
  assert.match(order,/immediateDeliveryConsent/);
  assert.match(order,/withdrawalAcknowledged/);
  assert.match(admin,/timingSafeEqual/);
  assert.match(admin,/expectedSha256/);
  const upload = fs.readFileSync("app/api/guide-shop/admin/upload/route.ts","utf8");
  assert.match(upload,/await isGuideAdmin\(\)/);
  assert.match(upload,/expectedSha256/);
  assert.match(upload,/Cache-Control/);
  assert.equal(fs.existsSync("public/TD_Golf7_03_Verkehrszeichenerkennung.pdf"),false);
});

test("Adminbereich zeigt nur Status und Links, niemals PayPal-Zugangsdaten", () => {
  const page = fs.readFileSync("app/konto/pdf-verwaltung/page.tsx","utf8");
  assert.match(page,/await isGuideAdmin\(\)/);
  assert.match(page,/!!process\.env\.PAYPAL_CLIENT_SECRET/);
  assert.match(page,/preview/);
  assert.match(page,/Automation Bypass/);
  assert.ok(!page.includes("process.env.PAYPAL_CLIENT_SECRET}"));
});

test("Gastbestellungen verwenden zufällige, nur gehashte 256-Bit-Tokens", () => {
  const first = newGuestToken();
  const second = newGuestToken();
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.match(second, /^[0-9a-f]{64}$/);
  assert.notEqual(first, second);
  assert.match(hashGuestToken(first), /^[0-9a-f]{64}$/);
  assert.notEqual(hashGuestToken(first), first);
  assert.notEqual(hashGuestToken(first), hashGuestToken(second));
  assert.equal(hashGuestToken("not-a-token"), null);
  assert.equal(hashGuestToken(first.slice(0, -1)), null);
});

test("Gast-Checkout benötigt keinerlei Clerk-Konto, aber PayPal-Bestätigung und Browser-Token", () => {
  const order = fs.readFileSync("app/api/guide-shop/orders/route.ts", "utf8");
  const capture = fs.readFileSync("app/api/guide-shop/orders/capture/route.ts", "utf8");
  const guest = fs.readFileSync("app/lib/guideGuest.ts", "utf8");
  const schema = fs.readFileSync("app/lib/guideShopDb.ts", "utf8");
  assert.doesNotMatch(order, /await auth\(\)/);
  assert.doesNotMatch(capture, /await auth\(\)/);
  assert.match(order, /setGuestCookie\(response, guestToken\)/);
  assert.match(order, /GOLF7_VZE\.expectedSha256/);
  assert.match(order, /requestOrigin !== redirectOrigin/);
  assert.match(capture, /guestTokenHashFromCookie\(\)/);
  assert.match(capture, /validateCompletedCapture\(response, localId, paypalId\)/);
  assert.match(capture, /guest_token_hash=\$\{guestHash\}/);
  assert.match(guest, /httpOnly: true/);
  assert.match(guest, /sameSite: "lax"/);
  assert.match(guest, /maxAge/);
  assert.match(schema, /CREATE TABLE IF NOT EXISTS td_guide_guest_orders/);
  assert.match(schema, /guest_token_hash text NOT NULL UNIQUE/);
});

test("Gästedownload bleibt an eine bezahlte, nicht widerrufene Bestellung und den Browser gebunden", () => {
  const download = fs.readFileSync("app/api/guide-shop/download/golf7-vze/route.ts", "utf8");
  const status = fs.readFileSync("app/api/guide-shop/guest/status/route.ts", "utf8");
  const receipt = fs.readFileSync("app/api/guide-shop/guest/confirmation/route.ts", "utf8");
  const webhook = fs.readFileSync("app/api/webhooks/paypal/route.ts", "utf8");
  const page = fs.readFileSync("app/codieranleitungen/golf7-vze/page.tsx", "utf8");
  const checkout = fs.readFileSync("app/components/Golf7VzeCheckout.tsx", "utf8");
  assert.match(download, /guestTokenHashFromCookie\(\)/);
  assert.match(download, /status='paid' AND paid_at > now\(\) - interval '30 days'/);
  assert.match(download, /!permitted/);
  assert.match(download, /GOLF7_VZE\.expectedSha256/);
  assert.match(status, /guestTokenHashFromCookie\(\)/);
  assert.match(status, /status='paid'/);
  assert.match(receipt, /guestTokenHashFromCookie\(\)/);
  assert.match(webhook, /UPDATE td_guide_guest_orders SET status/);
  assert.doesNotMatch(page, /<Show when="signed-out">/);
  assert.match(page, /<Golf7VzeCheckout mode=\{mode\} \/>/);
  assert.match(checkout, /api\/guide-shop\/guest\/status/);
  assert.match(checkout, /api\/guide-shop\/guest\/confirmation/);
  assert.match(checkout, /ohne Kundenkonto/);
});


test("Sandbox-Diagnose prüft PayPal OAuth und PDF-Hash ohne geheime Schlüssel auszugeben", () => {
  const route = fs.readFileSync("app/api/guide-shop/sandbox/check/route.ts","utf8");
  assert.match(route,/process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(route,/testPaypalSandboxConnection\(\)/);
  assert.match(route,/GOLF7_VZE\.expectedSha256/);
  assert.match(route,/pdfStored/);
  assert.match(route,/realPaymentEnabled: false/);
  assert.doesNotMatch(route, /PAYPAL_CLIENT_SECRET|paypal_capture_id|clerk_user_id/);
});
