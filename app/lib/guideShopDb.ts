import "server-only";
import { neon } from "@neondatabase/serverless";

export function shopDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("Shop-Datenbank fehlt.");
  return neon(process.env.DATABASE_URL);
}

export async function ensureGuideShopSchema() {
  const sql = shopDatabase();
  // Bestandskäufe mit Clerk-Konto bleiben für bisherige Kunden abrufbar.
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
  await sql`ALTER TABLE td_guide_orders ADD COLUMN IF NOT EXISTS buyer_email text`;
  await sql`ALTER TABLE td_guide_orders ADD COLUMN IF NOT EXISTS paypal_transaction_id text`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS td_guide_orders_manual_transaction_idx
    ON td_guide_orders (paypal_transaction_id)`;

  // Gastbestellungen sind ausdrücklich OHNE Clerk-ID angelegt.
  // Ausschließlich der SHA256-Hash eines kryptografisch zufälligen Browser-Tokens
  // wird gespeichert, nie das Token im Klartext.
  await sql`CREATE TABLE IF NOT EXISTS td_guide_guest_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_token_hash text NOT NULL UNIQUE,
    visitor_hash text,
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
  await sql`CREATE INDEX IF NOT EXISTS td_guide_guest_orders_visitor_idx
    ON td_guide_guest_orders (visitor_hash, created_at)`;

  // Manuell verifizierte Zahlungen ueber PayPal.Me:
  // Die Freigabe wird erst nach Admin-Kontrolle des Zahlungseingangs erstellt.
  // Der einmalige Freigabeschluessel wird ausschliesslich als SHA256-Hash gespeichert.
  await sql`CREATE TABLE IF NOT EXISTS td_guide_manual_grants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id text NOT NULL,
    recipient_email text NOT NULL,
    paypal_transaction_id text NOT NULL UNIQUE,
    claim_token_hash text NOT NULL UNIQUE,
    status text NOT NULL CHECK (status IN ('issued', 'redeemed', 'revoked')),
    guest_order_id uuid UNIQUE REFERENCES td_guide_guest_orders(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    redeemed_at timestamptz
  )`;

  await sql`CREATE TABLE IF NOT EXISTS td_guide_documents (
    product_id text PRIMARY KEY,
    version text NOT NULL,
    sha256 text NOT NULL,
    file_data bytea NOT NULL,
    uploaded_at timestamptz NOT NULL DEFAULT now()
  )`;
  return sql;
}
