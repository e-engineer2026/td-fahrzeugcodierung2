import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { ensureServiceOrderSchema } from "../../../lib/serviceOrdersDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

/** Overview exposes COUNTS ONLY. No customer email, PDF bytes, payment IDs or secrets. */
export async function GET() {
  if (!await isGuideAdmin())
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    await ensureServiceOrderSchema();
    const [counts] = await sql`SELECT
      (SELECT count(*)::int FROM td_guide_document_drafts) AS "pdfDrafts",
      (SELECT count(*)::int FROM td_guide_documents
        WHERE NOT withdrawn AND octet_length(file_data) > 0) AS "pdfStoredPublished",
      (SELECT count(*)::int FROM td_guide_documents WHERE withdrawn) AS "pdfWithdrawn",
      (SELECT count(*)::int FROM td_guide_document_drafts
        WHERE uploaded_at < now() - interval '7 days') AS "pdfOldDrafts",
      (SELECT count(*)::int FROM td_guide_orders WHERE status='pending') AS "accountPending",
      (SELECT count(*)::int FROM td_guide_guest_orders WHERE status='pending') AS "guestPending",
      (SELECT count(*)::int FROM td_guide_orders
        WHERE status='paid' AND paid_at >= current_date) AS "accountPaidToday",
      (SELECT count(*)::int FROM td_guide_guest_orders
        WHERE status='paid' AND paid_at >= current_date) AS "guestPaidToday",
      (SELECT count(*)::int FROM td_guide_orders WHERE status IN ('refunded','disputed')) +
      (SELECT count(*)::int FROM td_guide_guest_orders WHERE status IN ('refunded','disputed')) AS "paymentExceptions",
      (SELECT count(*)::int FROM td_service_orders WHERE status='requested') AS "serviceNew",
      (SELECT count(*)::int FROM td_service_orders WHERE status='review') AS "serviceReview",
      (SELECT count(*)::int FROM td_service_orders WHERE status='quoted') AS "serviceQuoted",
      (SELECT count(*)::int FROM td_service_orders WHERE status='scheduled') AS "serviceScheduled",
      (SELECT count(*)::int FROM td_service_orders WHERE status='in_progress') AS "serviceActive",
      (SELECT count(*)::int FROM td_service_orders WHERE status='completed') AS "serviceCompleted",
      (SELECT count(*)::int FROM (
        SELECT DISTINCT ON (booking_uid) booking_uid, trigger
        FROM td_service_cal_events
        ORDER BY booking_uid, event_time DESC, received_at DESC
      ) latest WHERE latest.trigger <> 'BOOKING_CANCELLED'
        AND NOT EXISTS (SELECT 1 FROM td_service_orders
          WHERE booking_reference=latest.booking_uid)) AS "unlinkedBookings",
      (SELECT count(*)::int FROM (
        SELECT DISTINCT ON (booking_uid) booking_uid, trigger
        FROM td_service_cal_events
        ORDER BY booking_uid, event_time DESC, received_at DESC
      ) latest WHERE latest.trigger='BOOKING_CANCELLED') AS "cancelledBookings"`;
    const metrics = Object.fromEntries(Object.entries(counts ?? {}).map(([key, value]) => [key, Number(value || 0)]));
    const tasks = [
      { key: "payment-review", label: "Zahlungseingänge prüfen", href: "/konto/pdf-verwaltung", count: metrics.accountPending + metrics.guestPending },
      { key: "document-review", label: "PDF-Entwürfe fachlich prüfen", href: "/konto/pdf-verwaltung", count: metrics.pdfDrafts },
      { key: "new-requests", label: "Neue Codieranfragen bearbeiten", href: "/konto/auftraege", count: metrics.serviceNew },
      { key: "compatibility", label: "Technische Vorprüfungen bearbeiten", href: "/konto/auftraege", count: metrics.serviceReview },
      { key: "calendar", label: "Nicht zugeordnete Cal.com-Termine prüfen", href: "/konto/auftraege", count: metrics.unlinkedBookings },
      { key: "cancellations", label: "Cal.com-Stornierungen kontrollieren", href: "/konto/auftraege", count: metrics.cancelledBookings },
      { key: "payment-exceptions", label: "Rückzahlungen und Zahlungsstreitfälle prüfen", href: "/konto/pdf-verwaltung", count: metrics.paymentExceptions },
    ].filter(task => task.count > 0);
    return NextResponse.json({ metrics, tasks, generatedAt: new Date().toISOString() }, { headers });
  } catch {
    return NextResponse.json({
      error: "Kennzahlen nicht verfügbar. Datenbank und Berechtigungen der Vorschauumgebung prüfen."
    }, { status: 503, headers });
  }
}
