import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type CalBookingEvent = {
  eventHash: string;
  bookingUid: string;
  trigger: "BOOKING_CREATED" | "BOOKING_RESCHEDULED" | "BOOKING_CANCELLED";
  attendeeEmail: string;
  proposedOrderId: string | null;
  startTime: string | null;
  eventTime: string;
};

const supported = new Set(["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"]);
const uuid = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;

export function validCalWebhookSignature(raw: string, supplied: string | null, secret?: string): boolean {
  if (!secret || secret.length < 32 || !supplied || !/^[a-f0-9]{64}$/i.test(supplied)) return false;
  const digest = createHmac("sha256", secret).update(raw, "utf8").digest();
  const received = Buffer.from(supplied, "hex");
  return received.length === digest.length && timingSafeEqual(received, digest);
}

function isoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function responseValue(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const wrapped = value as Record<string, unknown>;
    return typeof wrapped.value === "string" ? wrapped.value : null;
  }
  return null;
}

/** Parse only the minimum details needed for the internal booking inbox.
 * A signed webhook is proof of delivery by Cal.com, NOT proof of payment. */
export function parseCalBookingEvent(raw: string): CalBookingEvent | null {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
    if (!data || Array.isArray(data) || typeof data !== "object") return null;
  } catch { return null; }
  const eventType = data.triggerEvent;
  if (typeof eventType !== "string" || !supported.has(eventType)) return null;
  const payload = data.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const p = payload as Record<string, unknown>;
  const uid = typeof p.uid === "string" ? p.uid.trim() : "";
  const attendees = p.attendees;
  const primary = Array.isArray(attendees) && attendees.length > 0 ? attendees[0] : null;
  const email = primary && typeof primary === "object" && typeof primary.email === "string"
    ? primary.email.trim().toLowerCase() : "";
  if (!/^[a-zA-Z0-9_-]{8,150}$/.test(uid) || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const responses = p.responses && typeof p.responses === "object" && !Array.isArray(p.responses)
    ? p.responses as Record<string, unknown> : {};
  const metadata = p.metadata && typeof p.metadata === "object" && !Array.isArray(p.metadata)
    ? p.metadata as Record<string, unknown> : {};
  const candidate = responseValue(responses.tdorderid) ?? responseValue(metadata.tdorderid);
  return {
    eventHash: createHash("sha256").update(raw, "utf8").digest("hex"),
    bookingUid: uid, trigger: eventType as CalBookingEvent["trigger"],
    attendeeEmail: email,
    proposedOrderId: candidate && uuid.test(candidate) ? candidate.toLowerCase() : null,
    startTime: isoDate(p.startTime),
    eventTime: isoDate(data.createdAt) ?? new Date().toISOString(),
  };
}
