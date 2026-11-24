-- This entire test runs against a disposable PostgreSQL 16 CI service.
-- It is intentionally not connected to Neon or Vercel.
\set ON_ERROR_STOP on
BEGIN;

CREATE TABLE td_coding_registry (
  id text PRIMARY KEY,
  brand text NOT NULL,
  model text NOT NULL,
  coding_id text NOT NULL,
  title text NOT NULL,
  year_from smallint NOT NULL,
  year_to smallint NOT NULL,
  platform text NOT NULL,
  category text NOT NULL,
  service_price_cents integer NOT NULL CHECK (service_price_cents >= 0),
  pdf_price_cents integer NOT NULL CHECK (pdf_price_cents >= 0),
  pdf_slug text NOT NULL,
  hardware text NOT NULL DEFAULT '',
  requirements text NOT NULL DEFAULT '',
  source_hash text NOT NULL,
  reviewed_source_hash text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brand, model, coding_id)
);
CREATE TABLE td_guide_master_templates (
  id text PRIMARY KEY,
  title text NOT NULL,
  revision text NOT NULL,
  procedure jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE td_guide_document_drafts (
  product_id text PRIMARY KEY,
  version text NOT NULL,
  sha256 text NOT NULL,
  file_data bytea NOT NULL,
  assigned_filename text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE td_guide_documents (
  product_id text PRIMARY KEY,
  version text NOT NULL,
  sha256 text NOT NULL,
  file_data bytea NOT NULL
);
INSERT INTO td_coding_registry
(id, brand, model, coding_id, title, year_from, year_to, platform, category,
 service_price_cents, pdf_price_cents, pdf_slug, hardware, requirements, source_hash)
VALUES ('row-id','Volkswagen','Golf 7 (5G)','vcds-vze','VZE freischalten',
        2012,2020,'MQB','Assistenzsysteme',5500,1399,
        'catalog:Golf%207%20(5G):coding-vcds-vze','','','hash-v1');
UPDATE td_coding_registry SET reviewed_source_hash=source_hash WHERE id='row-id';

-- Repeated unchanged imports preserve a review; source changes invalidate it.
INSERT INTO td_coding_registry
(id, brand, model, coding_id, title, year_from, year_to, platform, category,
 service_price_cents, pdf_price_cents, pdf_slug, hardware, requirements, source_hash)
VALUES ('row-id','Volkswagen','Golf 7 (5G)','vcds-vze','VZE freischalten',
        2012,2020,'MQB','Assistenzsysteme',5500,1399,
        'catalog:Golf%207%20(5G):coding-vcds-vze','','','hash-v1')
ON CONFLICT (id) DO UPDATE SET
  source_hash=EXCLUDED.source_hash,
  reviewed_source_hash=CASE WHEN td_coding_registry.source_hash=EXCLUDED.source_hash
    THEN td_coding_registry.reviewed_source_hash ELSE NULL END;
DO $check$
BEGIN
 IF (SELECT reviewed_source_hash FROM td_coding_registry WHERE id='row-id') <> 'hash-v1'
 THEN RAISE EXCEPTION 'Unchanged import unexpectedly revokes manual review'; END IF;
END $check$;

INSERT INTO td_coding_registry
(id, brand, model, coding_id, title, year_from, year_to, platform, category,
 service_price_cents, pdf_price_cents, pdf_slug, hardware, requirements, source_hash)
VALUES ('row-id','Volkswagen','Golf 7 (5G)','vcds-vze','VZE freischalten',
        2012,2020,'MQB','Assistenzsysteme',5500,1399,
        'catalog:Golf%207%20(5G):coding-vcds-vze','','','hash-v2')
ON CONFLICT (id) DO UPDATE SET
  source_hash=EXCLUDED.source_hash,
  reviewed_source_hash=CASE WHEN td_coding_registry.source_hash=EXCLUDED.source_hash
    THEN td_coding_registry.reviewed_source_hash ELSE NULL END;
DO $check$
BEGIN
 IF EXISTS (SELECT 1 FROM td_coding_registry
   WHERE id='row-id' AND reviewed_source_hash IS NOT NULL)
 THEN RAISE EXCEPTION 'Source changed but old manual review remains'; END IF;
END $check$;

-- Master variants stay versioned and stale edits cannot overwrite another user's review.
INSERT INTO td_guide_master_templates(id,title,revision,procedure)
VALUES ('master-01','Test','1.0','{"variants":[{"model":"Golf 7"}]}'::jsonb);
UPDATE td_guide_master_templates
SET procedure='{"variants":[{"model":"Golf 7"},{"model":"Touran 5T"}]}'::jsonb
WHERE id='master-01' AND procedure='{"variants":[{"model":"Golf 7"}]}'::jsonb;
DO $check$
BEGIN
 IF (SELECT jsonb_array_length(procedure->'variants') FROM td_guide_master_templates WHERE id='master-01')<>2
 THEN RAISE EXCEPTION 'Append-variant failed'; END IF;
END $check$;

-- A generated PDF draft never replaces an existing draft or a paid public document.
INSERT INTO td_guide_document_drafts(product_id,version,sha256,file_data,assigned_filename)
VALUES('pdf-golf','1.0','original-draft',decode('255044462d','hex'),'draft-golf.pdf');
INSERT INTO td_guide_document_drafts(product_id,version,sha256,file_data,assigned_filename)
VALUES('pdf-golf','2.0','attempted-replacement',decode('255044462d','hex'),'replacement.pdf')
ON CONFLICT (product_id) DO NOTHING;
INSERT INTO td_guide_documents(product_id,version,sha256,file_data)
VALUES('pdf-golf','1.0','published-original',decode('255044462d','hex'));
DO $check$
BEGIN
 IF (SELECT sha256 FROM td_guide_document_drafts WHERE product_id='pdf-golf') <> 'original-draft'
 THEN RAISE EXCEPTION 'Existing draft overwritten'; END IF;
 IF (SELECT sha256 FROM td_guide_documents WHERE product_id='pdf-golf') <> 'published-original'
 THEN RAISE EXCEPTION 'Existing paid document changed by draft generator'; END IF;
END $check$;

ROLLBACK;
SELECT 'PASS: isolated catalog, review-hash, master and private-PDF SQL checks' AS result;
