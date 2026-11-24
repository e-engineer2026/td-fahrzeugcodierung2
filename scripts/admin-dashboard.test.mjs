import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Admin dashboard restricts access and does not expose customer or payment details", () => {
  const api = fs.readFileSync("app/api/admin/dashboard/route.ts", "utf8");
  assert.match(api, /await isGuideAdmin\(\)/);
  assert.match(api, /Cache-Control.*private, no-store/);
  assert.match(api, /ensureGuideShopSchema\(\)/);
  assert.match(api, /ensureServiceOrderSchema\(\)/);
  assert.doesNotMatch(api, /SELECT.*buyer_email/);
  assert.doesNotMatch(api, /SELECT.*paypal_transaction_id/);
  assert.doesNotMatch(api, /file_data AS/);
  assert.doesNotMatch(api, /SET status='paid'/);
});

test("Dashboard includes document, payment, service and appointment queues", () => {
  const api = fs.readFileSync("app/api/admin/dashboard/route.ts", "utf8");
  const panel = fs.readFileSync("app/components/AdminDashboardOverview.tsx", "utf8");
  const page = fs.readFileSync("app/konto/auftraege/page.tsx", "utf8");
  for (const field of ["pdfDrafts", "pdfStoredPublished", "accountPending", "guestPending",
    "paymentExceptions", "serviceNew", "serviceReview", "serviceScheduled", "unlinkedBookings", "cancelledBookings"]) {
    assert.ok(api.includes(field), "missing metric: " + field);
  }
  assert.match(api, /DISTINCT ON \(booking_uid\)/);
  assert.match(api, /NOT EXISTS \(SELECT 1 FROM td_service_orders/);
  assert.match(panel, /\/api\/admin\/dashboard/);
  assert.match(panel, /Stand:/);
  assert.match(page, /await isGuideAdmin\(\)/);
  assert.match(page, /<AdminDashboardOverview/);
});
