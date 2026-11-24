import "server-only";
import { shopDatabase } from "./guideShopDb";

/** Independent service requests. PDF purchases keep their existing payment and access rules. */
export async function ensureServiceOrderSchema() {
  const sql = shopDatabase();
  await sql`CREATE TABLE IF NOT EXISTS td_service_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text NOT NULL,
    customer_email text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    vehicle_year smallint NOT NULL CHECK (vehicle_year BETWEEN 1980 AND 2027),
    service_mode text NOT NULL CHECK (service_mode IN ('onsite', 'remote')),
    requested_services text NOT NULL,
    status text NOT NULL DEFAULT 'requested'
      CHECK (status IN ('requested', 'review', 'quoted', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    quote_cents integer CHECK (quote_cents IS NULL OR quote_cents BETWEEN 0 AND 2000000),
    booking_reference text,
    admin_note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS td_service_orders_user_idx
    ON td_service_orders (clerk_user_id, created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS td_service_orders_admin_idx
    ON td_service_orders (status, created_at DESC)`;
  // Only authenticated Cal.com webhook deliveries are stored. Never store the raw payload.
  // Events are append-only so cancellations and reschedules remain visible to staff.
  await sql`CREATE TABLE IF NOT EXISTS td_service_cal_events (
    event_hash text PRIMARY KEY,
    booking_uid text NOT NULL,
    trigger text NOT NULL CHECK (trigger IN ('BOOKING_CREATED', 'BOOKING_RESCHEDULED', 'BOOKING_CANCELLED')),
    attendee_email text NOT NULL,
    proposed_order_id uuid,
    start_time timestamptz,
    event_time timestamptz NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS td_service_cal_events_uid_idx
    ON td_service_cal_events (booking_uid, event_time DESC)`;
  return sql;
}
