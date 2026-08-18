/**
 * Idempotent schema application for the admin-system tables.
 *
 * Runs at server startup (dev AND production) so a fresh deployment gets the
 * new tables/columns without a manual `drizzle-kit push`. Every statement is
 * IF NOT EXISTS — safe to run on every boot. Mirrors lib/db/src/schema.
 */
import { pool } from "@workspace/db";
import { logger } from "./logger.js";

const DDL = `
CREATE TABLE IF NOT EXISTS consultant_accounts (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'consultant',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discount_codes (
  id            SERIAL PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,
  type          TEXT NOT NULL,
  value         NUMERIC NOT NULL,
  applies_to    TEXT NOT NULL DEFAULT 'all',
  max_uses      INTEGER,
  used_count    INTEGER NOT NULL DEFAULT 0,
  expires_at    TIMESTAMP,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_id INTEGER,
  created_by    TEXT NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  name_ar          TEXT NOT NULL,
  level            TEXT NOT NULL DEFAULT 'beginner',
  status           TEXT NOT NULL DEFAULT 'draft',
  onsite_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
  onsite_price_jod INTEGER,
  onsite_hours     INTEGER,
  onsite_sessions  INTEGER,
  onsite_capacity  INTEGER,
  live_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  live_price_usd   INTEGER,
  live_hours       INTEGER,
  live_sessions    INTEGER,
  live_capacity    INTEGER,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voice_evaluations (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  audio_ref    TEXT,
  reviewer     TEXT,
  status       TEXT NOT NULL DEFAULT 'pending',
  notes        TEXT,
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instagram_leads (
  id               SERIAL PRIMARY KEY,
  campaign_name    TEXT NOT NULL,
  carousel_ref     TEXT,
  keywords         TEXT,
  lead_count       INTEGER NOT NULL DEFAULT 0,
  conversion_count INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  campaign_date    DATE,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS discount_reservations (
  id         SERIAL PRIMARY KEY,
  order_id   TEXT NOT NULL UNIQUE,
  code       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'reserved',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS consultant_id INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price_locked BOOLEAN NOT NULL DEFAULT false;
`;

export async function ensureAdminSchema(): Promise<void> {
  try {
    await pool.query(DDL);
    logger.info("admin schema ensured");
  } catch (err) {
    // Loud failure — admin endpoints and discounted checkout depend on this
    logger.error({ err }, "ensureAdminSchema FAILED — admin tables may be missing");
    throw err;
  }
}
