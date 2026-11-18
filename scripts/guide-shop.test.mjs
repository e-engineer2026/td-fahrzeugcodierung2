import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { resolveShopMode, guideShopReturnOrigin, validateCompletedCapture, GOLF7_VZE } from "../app/lib/guideShopShared.ts";

test("Golf 7 VZE Prüfdokument Rev 1.2 nur mit fester Prüfsumme", () => {
  assert.equal(GOLF7_VZE.revision, "1.2");
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
  assert.equal(fs.existsSync("public/TD_Golf7_03_Verkehrszeichenerkennung.pdf"),false);
});
