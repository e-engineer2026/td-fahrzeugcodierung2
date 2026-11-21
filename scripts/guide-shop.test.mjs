import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { resolveShopMode, guideShopReturnOrigin, validateCompletedCapture, GOLF7_VZE } from "../app/lib/guideShopShared.ts";
import { newGuestToken, hashGuestToken } from "../app/lib/guideGuestToken.ts";
import { codingNameKey, hasDisplayPrice, uniqueByCodingName } from "../app/lib/codingListCleanup.ts";
import { suggestPayPalOrderByTime } from "../app/lib/paypalTimeMatching.ts";

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


test("PayPal.Me-Freigaben nur nach manueller Adminpruefung und mit einmaligem PDF-Link", () => {
  const schema = fs.readFileSync("app/lib/guideShopDb.ts", "utf8");
  const adminRoute = fs.readFileSync("app/api/guide-shop/admin/manual-grants/route.ts", "utf8");
  const claimRoute = fs.readFileSync("app/api/guide-shop/manual/redeem/route.ts", "utf8");
  const buyerPage = fs.readFileSync("app/codieranleitungen/golf7-vze/freigabe/page.tsx", "utf8");
  const activation = fs.readFileSync("app/components/ManualPdfActivation.tsx", "utf8");
  const manualCheckout = fs.readFileSync("app/components/ManualPaypalGuideCheckout.tsx", "utf8");
  assert.match(schema, /CREATE TABLE IF NOT EXISTS td_guide_manual_grants/);
  assert.match(schema, /paypal_transaction_id text NOT NULL UNIQUE/);
  assert.match(schema, /claim_token_hash text NOT NULL UNIQUE/);
  assert.match(adminRoute, /await isGuideAdmin\(\)/);
  assert.match(adminRoute, /paymentVerified !== true/);
  assert.match(adminRoute, /claim_token_hash/);
  assert.match(adminRoute, /status='revoked'/);
  assert.match(claimRoute, /hashGuestToken/);
  assert.match(claimRoute, /FOR UPDATE/);
  assert.match(claimRoute, /status='issued'/);
  assert.match(claimRoute, /setGuestCookie\(response, guestToken\)/);
  assert.match(claimRoute, /now\(\) - interval '30 days'|accessDays: 30/);
  assert.match(buyerPage, /robots: \{ index: false/);
  assert.match(activation, /method: "POST"/);
  assert.match(activation, /window.location.hash/);
  assert.match(manualCheckout, /api\/guide-shop\/guest\/status/);
  assert.match(manualCheckout, /api\/guide-shop\/download\/golf7-vze/);
  assert.doesNotMatch(adminRoute, /process\.env\.PAYPAL_CLIENT_SECRET/);
  assert.doesNotMatch(claimRoute, /PAYPAL_CLIENT_SECRET/);
});

test("Doppelte Codierungen und 0-Euro-Angebote aus Fahrzeug- und PDF-Listen entfernen", () => {
  assert.equal(codingNameKey("Außenspiegel automatisch anklappen"), codingNameKey("aussenspiegel  automatisch  anklappen"));
  assert.equal(codingNameKey("Rückleuchten aktivieren"), codingNameKey("Rueckleuchten aktivieren"));
  assert.equal(codingNameKey("Auto-Lock / Auto-Unlock aktivieren"), codingNameKey("auto lock auto unlock aktivieren"));
  assert.notEqual(codingNameKey("Lane Assist freischalten"), codingNameKey("Lane Assist anpassen"));
  assert.equal(hasDisplayPrice(0), false);
  assert.equal(hasDisplayPrice(-1), false);
  assert.equal(hasDisplayPrice(Number.NaN), false);
  assert.equal(hasDisplayPrice(13.99), true);
  const entries = [
    { name:"Auto-Lock / Auto-Unlock aktivieren", price:25 },
    { name:"auto lock auto unlock aktivieren", price:25 },
    { name:"Auto-Lock / Auto-Unlock anpassen", price:20 },
    { name:"Spiegel absenken", price:0 },
  ].filter((entry) => hasDisplayPrice(entry.price));
  assert.deepEqual(uniqueByCodingName(entries).map((entry) => entry.name), [
    "Auto-Lock / Auto-Unlock aktivieren",
    "Auto-Lock / Auto-Unlock anpassen",
  ]);

  const display = fs.readFileSync("app/lib/codingDisplay.ts","utf8");
  const pdfCatalog = fs.readFileSync("app/components/GuideSelector.tsx","utf8");
  assert.match(display, /entries = entries.filter\(\(entry\) => hasDisplayPrice\(entry.price\)\)/);
  assert.match(display, /return dedupePricedDisplayEntries\(displayed\)/);
  assert.match(pdfCatalog, /uniqueByCodingName\(codingCatalog/);
  assert.match(pdfCatalog, /hasDisplayPrice\(researchGuideEstimate\(entry\).price\)/);
  assert.match(pdfCatalog, /hasDisplayPrice\(referenceIdeaEstimate\(idea\).price\)/);
});

test("Golf-7-VZE-Kaufhinweise und bestaetigte Freigabe korrekt anzeigen", () => {
  const component = fs.readFileSync("app/components/AccountPaypalGuideCheckout.tsx", "utf8");
  assert.doesNotMatch(component, /PayPal.Me überträgt sie nicht automatisch/);
  assert.doesNotMatch(component, /Vor der Zahlung Empfänger und Betrag bei PayPal prüfen/);
  assert.match(component, /Nach der Zahlung ist nichts Weiteres nötig\./);
  assert.match(component, /if \(paid\) return <section/);
  const releasedBlock = component.split("if (paid) return <section")[1].split("const email")[0];
  assert.match(releasedBlock, /Die PDF-Datei ist im Konto zum Download freigeschaltet\./);
  const paymentBlock = component.split("const email")[1];
  assert.doesNotMatch(paymentBlock, /Die PDF-Datei ist im Konto zum Download freigeschaltet\./);
});

test("PayPal.Me-Bestellung nach Neuladen wiederherstellen, ohne eine Zahlung vorzutäuschen", () => {
  const checkout = fs.readFileSync("app/components/AccountPaypalGuideCheckout.tsx", "utf8");
  const route = fs.readFileSync("app/api/guide-shop/account-orders/route.ts", "utf8");
  assert.match(route, /export async function GET\(request: Request\)/);
  assert.match(route, /const \{ userId \} = await auth\(\)/);
  assert.match(route, /clerk_user_id=\$\{userId\} AND product_id=\$\{product.id\} AND status='pending'/);
  assert.match(route, /Cache-Control/);
  assert.match(checkout, /fetch\("\/api\/guide-shop\/account-orders", \{ cache: "no-store", credentials: "same-origin" \}\)/);
  assert.match(checkout, /setOrder\(data.order\)/);
  assert.doesNotMatch(checkout, /Bestellnummer kopieren/);
  assert.match(checkout, /Du musst bei PayPal keine Bestellnummer angeben/);
  assert.match(checkout, /paypalOpenedForOrder\(data.order.orderId\)/);
  assert.match(checkout, /sessionStorage.setItem\("td-vze-paypal-opened:"/);
  assert.match(checkout, /Nach deiner Zahlung erfolgt die Freigabe nach Prüfung des tatsächlichen Zahlungseingangs/);
  assert.match(checkout, /if \(paid\) return <section/);
  assert.doesNotMatch(route, /UPDATE td_guide_orders SET status='paid'/);
});

test("PayPal-Zeitfenster findet nur einen eindeutigen Kandidaten und gibt nie selbst frei", () => {
  const time = Date.parse("2026-11-20T18:20:00.000Z");
  const orders = [
    { id: "a", createdAt: "2026-11-19T10:00:00.000Z", paypalStartedAt: "2026-11-20T18:15:00.000Z" },
    { id: "b", createdAt: "2026-11-20T18:17:00.000Z", paypalStartedAt: null },
  ];
  assert.deepEqual(suggestPayPalOrderByTime(orders, time), {
    status: "single", orderId: "a", minutesAfterStart: 5,
  });
  const close = [...orders, { id: "c", createdAt: "2026-11-20T18:10:00.000Z",
    paypalStartedAt: "2026-11-20T18:12:00.000Z" }];
  assert.deepEqual(suggestPayPalOrderByTime(close, time), {
    status: "ambiguous", orderIds: ["a", "c"],
  });
  assert.deepEqual(suggestPayPalOrderByTime(orders, time + 31 * 60000), { status: "none" });
  assert.deepEqual(suggestPayPalOrderByTime(orders, Number.NaN), { status: "none" });
  assert.deepEqual(suggestPayPalOrderByTime(orders, time - 8 * 60000), { status: "none" });
});

test("PayPal-Zeitstempel nur aus angemeldeter eigener Bestellung; Admin gibt nicht ungeprüft frei", () => {
  const start = fs.readFileSync("app/api/guide-shop/account-orders/payment-start/route.ts", "utf8");
  const db = fs.readFileSync("app/lib/guideShopDb.ts", "utf8");
  const adminRoute = fs.readFileSync("app/api/guide-shop/admin/account-orders/route.ts", "utf8");
  const admin = fs.readFileSync("app/components/GuideAdminAccountOrders.tsx", "utf8");
  const checkout = fs.readFileSync("app/components/AccountPaypalGuideCheckout.tsx", "utf8");
  assert.match(start, /await auth\(\)/);
  assert.match(start, /clerk_user_id=\$\{userId\}/);
  assert.match(start, /status='pending'/);
  assert.match(start, /request.headers.get\("origin"\)/);
  assert.match(db, /ADD COLUMN IF NOT EXISTS paypal_started_at/);
  assert.match(adminRoute, /await isGuideAdmin\(\)/);
  assert.match(adminRoute, /paypal_started_at/);
  assert.match(admin, /suggestPayPalOrderByTime/);
  assert.match(admin, /Mehrere Bestellungen passen/);
  assert.match(admin, /setChecked\(\(previous\) => \(\{ \.\.\.previous, \[suggestedOrder.id\]: false \}\)\)/);
  assert.match(checkout, /account-orders\/payment-start/);
  assert.doesNotMatch(start, /SET status='paid'/);
});

test("Gmail-Import: nur geschuetzte Zahlungshinweise, niemals automatische PDF-Freigabe", () => {
  const ingest = fs.readFileSync("app/api/guide-shop/gmail-receipts/route.ts", "utf8");
  const admin = fs.readFileSync("app/api/guide-shop/admin/gmail-connection/route.ts", "utf8");
  const schema = fs.readFileSync("app/lib/guideShopDb.ts", "utf8");
  const view = fs.readFileSync("app/components/GuideAdminGmailConnection.tsx", "utf8");
  const orderView = fs.readFileSync("app/components/GuideAdminAccountOrders.tsx", "utf8");
  const script = fs.readFileSync("public/td-paypal-gmail-import.gs.txt", "utf8");
  assert.ok(ingest.includes("timingSafeEqual"));
  assert.ok(ingest.includes("authorization"));
  assert.ok(ingest.includes("function isPayPalSender"));
  assert.ok(ingest.includes("ON CONFLICT (message_id) DO NOTHING"));
  assert.ok(!ingest.includes("SET status='paid'"));
  assert.ok(!ingest.includes("td_guide_orders"));
  assert.ok(ingest.includes("niemals der Mailtext"));
  assert.ok(admin.includes("await isGuideAdmin()"));
  assert.ok(admin.includes("randomBytes(32)"));
  assert.ok(admin.includes('createHash("sha256")'));
  assert.ok(schema.includes("td_guide_gmail_config"));
  assert.ok(schema.includes("td_guide_gmail_receipts"));
  assert.ok(view.includes("Ungeprüfte Gmail-Meldung, keine bestätigte PayPal-Zahlung"));
  assert.ok(orderView.includes("Gmail-Daten übernommen"));
  assert.ok(script.includes("PropertiesService.getScriptProperties"));
  assert.ok(script.includes("tdInstallTrigger"));
  assert.ok(script.includes("function tdTestConnection()"));
  assert.ok(script.includes("tdTestConnection();"));
  assert.ok(script.includes("everyMinutes(15)"));
  assert.ok(script.includes("TD_PDF_WEBHOOK_KEY"));
});

test("PDF-Administrator: eigener Vercel-Admin-Zugang ohne vorhandene Adminliste zu ersetzen", () => {
  const admin = fs.readFileSync("app/lib/guideAdmin.ts", "utf8");
  assert.ok(admin.includes("process.env.TD_GUIDE_ADMIN_EMAILS"));
  assert.ok(admin.includes("process.env.TD_GUIDE_OWNER_ADMIN_EMAIL"));
  assert.ok(admin.includes('verification?.status === "verified"'));
  assert.ok(admin.includes("await auth()"));
  assert.ok(admin.includes("allow.has("));
});

test("12 VZE-Modell-PDFs nur fuer verifizierte Admins, keine unbezahlte Kundenfreigabe", () => {
  const catalog = fs.readFileSync("app/lib/vzeVariantDrafts.ts", "utf8");
  const upload = fs.readFileSync("app/api/guide-shop/admin/vze-variants/route.ts", "utf8");
  const bulk = fs.readFileSync("app/api/guide-shop/admin/vze-variants/bulk/route.ts", "utf8");
  const download = fs.readFileSync("app/api/guide-shop/admin/vze-variants/download/route.ts", "utf8");
  const adminPage = fs.readFileSync("app/konto/pdf-verwaltung/page.tsx", "utf8");
  const catalogPage = fs.readFileSync("app/codieranleitungen/vze-modelle/page.tsx", "utf8");
  assert.equal((catalog.match(/productId: "vze-/g) ?? []).length, 12);
  assert.equal((catalog.match(/sha256: "[a-f0-9]{64}"/g) ?? []).length, 12);
  for (const handler of [upload, bulk, download]) {
    assert.ok(handler.includes("await isGuideAdmin()"));
    assert.ok(!handler.includes("SET status='paid'"));
  }
  assert.ok(upload.includes('createHash("sha256")'));
  assert.ok(bulk.includes('createHash("sha256")'));
  assert.ok(download.includes('encode(file_data,\'base64\')'));
  assert.ok(adminPage.includes("GuideAdminWorkspace"));
  const workspace = fs.readFileSync("app/components/GuideAdminWorkspace.tsx", "utf8");
  assert.ok(workspace.includes("GuideAdminVzeVariants"));
  assert.ok(catalogPage.includes("zur Veröffentlichung freigegeben"));
  assert.ok(catalogPage.includes("erst angeboten"));
  assert.ok(catalogPage.includes("Modellanleitung ansehen"));
});

test("12 VZE-Fachfassungen: Bestellung und Downloads sind nur produktgebunden nach Zahlung möglich", () => {
  const products = fs.readFileSync("app/lib/vzeShopProducts.ts","utf8");
  const orders = fs.readFileSync("app/api/guide-shop/account-orders/route.ts","utf8");
  const release = fs.readFileSync("app/api/guide-shop/admin/account-orders/route.ts","utf8");
  const download = fs.readFileSync("app/api/guide-shop/download/vze/[slug]/route.ts","utf8");
  const model = fs.readFileSync("app/codieranleitungen/vze-modelle/[slug]/page.tsx","utf8");
  const checkout = fs.readFileSync("app/components/ModelVzeCheckout.tsx","utf8");
  const purchases = fs.readFileSync("app/api/guide-shop/purchases/route.ts","utf8");
  assert.ok(products.includes("guideOrderProductFromId"));
  assert.ok(products.includes("VZE_MODEL_PRICE_CENTS"));
  assert.ok(orders.includes("productSlug"));
  assert.ok(orders.includes("termsAccepted !== true"));
  assert.ok(orders.includes("sha256="));
  assert.ok(release.includes("paymentVerified !== true"));
  assert.ok(release.includes("td_guide_manual_grants"));
  assert.ok(release.includes("sha256="));
  assert.ok(download.includes("await auth()"));
  assert.ok(download.includes("status='paid'"));
  assert.ok(download.includes("sha256="));
  assert.ok(!download.includes("isGuideAdmin()"));
  assert.ok(model.includes("ModelVzeCheckout"));
  assert.ok(checkout.includes("account-orders/payment-start"));
  assert.ok(purchases.includes("vzeModels"));
});

test("Neue VZE-Modellseiten aktivieren Clerk Middleware vor auth()", () => {
  const middleware = fs.readFileSync("proxy.ts", "utf8");
  const model = fs.readFileSync("app/codieranleitungen/vze-modelle/[slug]/page.tsx", "utf8");
  assert.ok(model.includes("await auth()"));
  assert.ok(middleware.includes('"/codieranleitungen/vze-modelle/:path*"'));
  assert.ok(middleware.includes('"/api/guide-shop/:path*"'));
});

test("Fahrzeugauswahl verlinkt VZE-Fachfassungen nur bei passenden MQB-Modellen", () => {
  const map = fs.readFileSync("app/lib/vzePdfVehicleLinks.ts","utf8");
  const chooser = fs.readFileSync("app/components/GuideSelector.tsx","utf8");
  const catalog = fs.readFileSync("app/data/catalog8Base.ts","utf8");
  assert.ok(map.includes('"Octavia 3 5E Facelift": "skoda-octavia-iii-5e"'));
  assert.ok(map.includes('"A3 / S3 8V": "audi-a3-8v"'));
  assert.ok(!map.includes('"A3 / S3 8Y"'));
  assert.ok(!map.includes('"Golf 8 (CD)"'));
  assert.ok(chooser.includes("vzePdfSlugForModel"));
  assert.ok(chooser.includes('"/codieranleitungen/vze-modelle/" + vzePdfSlug'));
  assert.ok(catalog.includes('"Golf Sportsvan AM1"'));
});

test("VZE-Tabelle: nur passende freigegebene Modell-PDF hat aktiven Produktlink", () => {
  const selector = fs.readFileSync("app/components/GuideSelector.tsx", "utf8");
  const indicator = fs.readFileSync("app/components/GuidePriceIndicator.tsx", "utf8");
  const mapping = fs.readFileSync("app/lib/vzePdfVehicleLinks.ts", "utf8");
  assert.ok(selector.includes("vzeProductHref(coding.name, vzePdfSlug)"));
  assert.ok(selector.includes("if (!slug || !/"));
  assert.ok(selector.includes('"/codieranleitungen/vze-modelle/" + slug'));
  assert.ok(mapping.includes('"Octavia 3 5E": "skoda-octavia-iii-5e"'));
  assert.ok(!mapping.includes('"Golf 8 (CD)"'));
  assert.ok(indicator.includes("In Vorbereitung"));
  assert.ok(indicator.includes("PDF ansehen"));
});

test("PDF-Admin ist mobil in drei Bereiche gegliedert, ohne sichere Aktionen zu verlieren", () => {
  const page = fs.readFileSync("app/konto/pdf-verwaltung/page.tsx", "utf8");
  const workspace = fs.readFileSync("app/components/GuideAdminWorkspace.tsx", "utf8");
  const gmail = fs.readFileSync("app/components/GuideAdminGmailConnection.tsx", "utf8");
  const orders = fs.readFileSync("app/components/GuideAdminAccountOrders.tsx", "utf8");
  const files = fs.readFileSync("app/components/GuideAdminVzeVariants.tsx", "utf8");
  assert.ok(page.includes("await isGuideAdmin()"));
  for (const tab of ['label: "Zahlungen"', 'label: "PDF-Dateien"', 'label: "Weitere"']) {
    assert.ok(workspace.includes(tab));
  }
  for (const component of ["GuideAdminAccountOrders", "GuideAdminVzeVariants",
    "GuideAdminManualRelease"]) {
    assert.ok(workspace.includes(component));
  }
  assert.ok(!workspace.includes("Golf 7 VZE · PDF Rev. 1.3 verwalten"));
  assert.ok(gmail.includes("Gmail-Verbindung einrichten oder ändern"));
  assert.ok(orders.includes("Zahlung anhand der Uhrzeit zuordnen"));
  assert.ok(orders.includes("paymentVerified"));
  assert.ok(files.includes("Alle 13 Dokumente und Downloads anzeigen"));
  assert.ok(files.includes('bulkUpload'));
});
