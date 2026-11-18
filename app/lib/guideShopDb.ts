import "server-only";
import { neon } from "@neondatabase/serverless";

export function shopDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("Shop-Datenbank fehlt.");
  return neon(process.env.DATABASE_URL);
}

export async function ensureGuideShopSchema() {
  const sql = shopDatabase();
  await sql`CREATE TABLE IF NOT EXISTS td_guide_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text NOT NULL,
    product_id text NOT NULL,
    amount_cents integer NOT NULL CHECK (amount_cents > 0),
    currency text NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'paid', 'refunded', 'disputed', 'failed')),
    paypal_order_id text UNIQUE,
    paypal_capture_id text UNIQUE,
    immediate_delivery_consent boolean NOT NULL DEFAULT false,
    withdrawal_acknowledged boolean NOT NULL DEFAULT false,
    terms_accepted boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    paid_at timestamptz
  )`;
  await sql`CREATE INDEX IF NOT EXISTS td_guide_orders_user_idx
    ON td_guide_orders (clerk_user_id, product_id, status)`;
  await sql`CREATE TABLE IF NOT EXISTS td_guide_documents (
    product_id text PRIMARY KEY,
    version text NOT NULL,
    sha256 text NOT NULL,
    file_data bytea NOT NULL,
    uploaded_at timestamptz NOT NULL DEFAULT now()
  )`;
  return sql;
}
