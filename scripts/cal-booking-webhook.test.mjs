import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHmac } from "node:crypto";
import { parseCalBookingEvent, validCalWebhookSignature } from "../app/lib/calBookingWebhook.ts";

const secret = "development-only-secret-32-characters-minimum";
const orderId = "d0ddc41b-89ab-4ec2-9859-2b3dacc08592";
const envelope = {
  triggerEvent: "BOOKING_CREATED",
  createdAt: "2026-11-24T10:50:00.000Z",
  payload: {
    uid: "bFJeNb2uX8ANpT3JL5EfXw",
    startTime: "2026-11-28T11:00:00.000Z",
    attendees: [{ name: "Test Customer", email: "Test@Example.com" }],
    responses: { tdorderid: { value: orderId } },
  },
};
const raw = JSON.stringify(envelope);
const signature = createHmac("sha256", secret).update(raw).digest("hex");

test("Cal.com: signed payload accepted, tampering or missing signature rejected", () => {
  assert.equal(validCalWebhookSignature(raw, signature, secret), true);
  assert.equal(validCalWebhookSignature(raw + " ", signature, secret), false);
  assert.equal(validCalWebhookSignature(raw, "0".repeat(64), secret), false);
  assert.equal(validCalWebhookSignature(raw, null, secret), false);
  assert.equal(validCalWebhookSignature(raw, signature, "short"), false);
});

test("Cal.com: parse only supported booking events, never payment events", () => {
  const data = parseCalBookingEvent(raw);
  assert.equal(data?.trigger, "BOOKING_CREATED");
  assert.equal(data?.attendeeEmail, "test@example.com");
  assert.equal(data?.bookingUid, envelope.payload.uid);
  assert.equal(data?.proposedOrderId, orderId);
  assert.equal(data?.startTime, "2026-11-28T11:00:00.000Z");
  assert.equal(data?.eventHash.length, 64);
  assert.equal(parseCalBookingEvent(JSON.stringify({ ...envelope, triggerEvent: "BOOKING_PAID" })), null);
  assert.equal(parseCalBookingEvent(JSON.stringify({ ...envelope, payload: { ...envelope.payload, attendees: [] } })), null);
  assert.equal(parseCalBookingEvent("not json"), null);
});

test("Cal.com: missing custom booking question does not auto-link an order", () => {
  const noRef = parseCalBookingEvent(JSON.stringify({ ...envelope,
    payload: { ...envelope.payload, responses: {} } }));
  assert.equal(noRef?.proposedOrderId, null);
  const cancelled = parseCalBookingEvent(JSON.stringify({ ...envelope, triggerEvent: "BOOKING_CANCELLED" }));
  assert.equal(cancelled?.trigger, "BOOKING_CANCELLED");
});

test("Webhook only records events; admin approves matching customer and UUID", () => {
  const webhook = fs.readFileSync("app/api/webhooks/calcom/route.ts", "utf8");
  const admin = fs.readFileSync("app/api/service-orders/admin/bookings/route.ts", "utf8");
  const db = fs.readFileSync("app/lib/serviceOrdersDb.ts", "utf8");
  const view = fs.readFileSync("app/components/AdminCalBookingsPanel.tsx", "utf8");
  assert.match(webhook, /validCalWebhookSignature\(raw,/);
  assert.match(webhook, /x-cal-signature-256/);
  assert.match(webhook, /ON CONFLICT \(event_hash\) DO NOTHING/);
  assert.doesNotMatch(webhook, /UPDATE td_service_orders|SET status='scheduled'/);
  assert.match(admin, /await isGuideAdmin\(\)/);
  assert.match(admin, /request.headers.get\("origin"\)/);
  assert.match(admin, /lower\(o.customer_email\)=e.attendee_email/);
  assert.match(admin, /AND \(o.booking_reference IS NULL OR o.booking_reference=e.booking_uid\)/);
  assert.match(admin, /trigger IN \('BOOKING_CREATED', 'BOOKING_RESCHEDULED'\)/);
  assert.match(view, /window.confirm/);
  assert.match(db, /td_service_cal_events/);
  assert.doesNotMatch(webhook + admin, /td_guide_orders|paypal_capture_id|SET status='paid'/);
});
