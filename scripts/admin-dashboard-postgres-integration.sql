-- Isolated PostgreSQL 16 test data, never Neon production/preview.
\set ON_ERROR_STOP on
BEGIN;

CREATE TABLE td_guide_document_drafts(
  product_id text PRIMARY KEY, uploaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE td_guide_documents(
  product_id text PRIMARY KEY, withdrawn boolean NOT NULL DEFAULT false, file_data bytea NOT NULL
);
CREATE TABLE td_guide_orders(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL, paid_at timestamptz
);
CREATE TABLE td_guide_guest_orders(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL, paid_at timestamptz
);
CREATE TABLE td_service_orders(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL, booking_reference text
);
CREATE TABLE td_service_cal_events(
  event_hash text PRIMARY KEY, booking_uid text NOT NULL, trigger text NOT NULL,
  event_time timestamptz NOT NULL, received_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO td_guide_document_drafts(product_id, uploaded_at)
  VALUES ('draft-1', now()-interval '10 days'), ('draft-2', now());
INSERT INTO td_guide_documents(product_id,withdrawn,file_data)
  VALUES ('active-pdf',false,decode('255044462d','hex')), ('withdrawn-pdf',true,decode('','hex'));
INSERT INTO td_guide_orders(status,paid_at)
  VALUES ('pending',null),('paid',now()),('disputed',now()-interval '2 days');
INSERT INTO td_guide_guest_orders(status,paid_at)
  VALUES ('pending',null),('paid',now()),('refunded',now()-interval '2 days');
INSERT INTO td_service_orders(status,booking_reference)
  VALUES ('requested',null),('review',null),('quoted',null),('scheduled','linked-booking'),('in_progress',null);

INSERT INTO td_service_cal_events(event_hash,booking_uid,trigger,event_time) VALUES
  ('h1','linked-booking','BOOKING_CREATED',now()-interval '2 hours'),
  ('h2','unlinked-booking','BOOKING_CREATED',now()-interval '4 hours'),
  ('h3','cancelled-booking','BOOKING_CREATED',now()-interval '6 hours'),
  ('h4','cancelled-booking','BOOKING_CANCELLED',now()-interval '3 hours');

DO $test$
DECLARE r record;
BEGIN
  -- Same SELECT expressions as app/api/admin/dashboard/route.ts.
  SELECT
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
    ) latest WHERE latest.trigger='BOOKING_CANCELLED') AS "cancelledBookings"
   INTO r;
   IF r."pdfDrafts" <> 2 OR r."pdfOldDrafts" <> 1 OR r."pdfStoredPublished" <> 1 OR r."pdfWithdrawn" <> 1
     OR r."accountPending" <> 1 OR r."guestPending" <> 1 OR r."accountPaidToday" <> 1 OR r."guestPaidToday" <> 1
     OR r."paymentExceptions" <> 2 OR r."serviceNew" <> 1 OR r."serviceReview" <> 1
     OR r."serviceQuoted" <> 1 OR r."serviceScheduled" <> 1 OR r."serviceActive" <> 1
     OR r."serviceCompleted" <> 0 OR r."unlinkedBookings" <> 1 OR r."cancelledBookings" <> 1
   THEN RAISE EXCEPTION 'Admin dashboard metrics wrong: %', row_to_json(r); END IF;
END $test$;

ROLLBACK;
SELECT 'PASS: isolated admin KPI queries, cancellations and unlinked bookings' AS result;
