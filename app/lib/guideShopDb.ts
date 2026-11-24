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
  await sql`ALTER TABLE td_guide_orders ADD COLUMN IF NOT EXISTS paypal_started_at timestamptz`;
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

  // Gmail-Abgleich: Nur gehashter Verbindungsschluessel, niemals OAuth-Tokens oder Mail-Inhalte speichern.
  await sql`CREATE TABLE IF NOT EXISTS td_guide_gmail_config (
    id text PRIMARY KEY CHECK (id = 'primary'),
    secret_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    last_received_at timestamptz
  )`;
  await sql`CREATE TABLE IF NOT EXISTS td_guide_gmail_receipts (
    message_id text PRIMARY KEY,
    sender text NOT NULL,
    subject text NOT NULL,
    message_at timestamptz NOT NULL,
    transaction_id text,
    amount_cents integer,
    currency text,
    imported_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS td_guide_gmail_receipts_time_idx
    ON td_guide_gmail_receipts (message_at DESC)`;

  await sql`CREATE TABLE IF NOT EXISTS td_guide_documents (
    product_id text PRIMARY KEY,
    version text NOT NULL,
    sha256 text NOT NULL,
    file_data bytea NOT NULL,
    uploaded_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`ALTER TABLE td_guide_documents ADD COLUMN IF NOT EXISTS assigned_filename text,
    ADD COLUMN IF NOT EXISTS withdrawn boolean NOT NULL DEFAULT false`;
  // Entwürfe sind getrennt von produktiven PDFs; Käufer sehen sie erst nach Freigabe.
  await sql`CREATE TABLE IF NOT EXISTS td_guide_document_drafts (
    product_id text PRIMARY KEY,
    version text NOT NULL,
    sha256 text NOT NULL,
    file_data bytea NOT NULL,
    assigned_filename text NOT NULL,
    uploaded_at timestamptz NOT NULL DEFAULT now()
  )`;

  // A PayPal transaction may unlock exactly one PDF, regardless of whether the
  // customer uses a Clerk account, the guest checkout, or a manual release.
  // Claims are never deleted after a refund, preventing replay/re-use.
  await sql`CREATE TABLE IF NOT EXISTS td_guide_payment_claims (
    transaction_id text PRIMARY KEY,
    claim_kind text NOT NULL CHECK (claim_kind IN ('account', 'guest', 'manual')),
    owner_reference text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  // Backfill existing verified/manual records before accepting further claims.
  // Repeated migrations are idempotent; conflicting legacy records are NOT
  // granted any additional rights.
  await sql`INSERT INTO td_guide_payment_claims (transaction_id, claim_kind, owner_reference)
    SELECT upper(paypal_transaction_id), 'account', id::text FROM td_guide_orders
    WHERE paypal_transaction_id IS NOT NULL ON CONFLICT (transaction_id) DO NOTHING`;
  await sql`INSERT INTO td_guide_payment_claims (transaction_id, claim_kind, owner_reference)
    SELECT upper(paypal_capture_id), 'account', id::text FROM td_guide_orders
    WHERE paypal_capture_id IS NOT NULL ON CONFLICT (transaction_id) DO NOTHING`;
  await sql`INSERT INTO td_guide_payment_claims (transaction_id, claim_kind, owner_reference)
    SELECT upper(paypal_capture_id), 'guest', id::text FROM td_guide_guest_orders
    WHERE paypal_capture_id IS NOT NULL ON CONFLICT (transaction_id) DO NOTHING`;
  await sql`INSERT INTO td_guide_payment_claims (transaction_id, claim_kind, owner_reference)
    SELECT upper(paypal_transaction_id), 'manual', id::text FROM td_guide_manual_grants
    ON CONFLICT (transaction_id) DO NOTHING`;
  return sql;
}
