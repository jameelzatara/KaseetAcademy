/**
 * Migration 08: Add cohort_seats, installments table,
 * and new columns to orders + holds.
 * Run once: pnpm tsx lib/db/scripts/migrate-08.ts
 */
import { Pool } from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // ── 1. cohort_seats (new table) ──────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS cohort_seats (
        cohort_id  INTEGER PRIMARY KEY,
        capacity   INTEGER NOT NULL DEFAULT 10,
        enrolled   INTEGER NOT NULL DEFAULT 0,
        is_open    BOOLEAN NOT NULL DEFAULT true,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ cohort_seats table ready");

    // ── 2. installments (new relational table) ───────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS installments (
        id          SERIAL PRIMARY KEY,
        order_id    TEXT REFERENCES orders(id),
        seq         INTEGER NOT NULL,
        amount_jod  NUMERIC NOT NULL,
        method      TEXT,
        paid_at     TIMESTAMP,
        due_at      DATE,
        reference   TEXT,
        recorded_by TEXT
      )
    `);
    console.log("✅ installments table ready");

    // ── 3. orders — add missing columns ─────────────────────
    const orderCols: [string, string][] = [
      ["stripe_session_id", "TEXT"],
      ["stripe_payment_id", "TEXT"],
      ["first_name",        "TEXT"],
      ["last_name",         "TEXT"],
      ["phone",             "TEXT"],
      ["email",             "TEXT"],
      ["country",           "TEXT"],
      ["city",              "TEXT"],
      ["charged_usd",       "NUMERIC"],
      ["notes",             "TEXT"],
    ];
    for (const [col, type] of orderCols) {
      await client.query(`
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS "${col}" ${type}
      `);
    }
    // UNIQUE on stripe_session_id (safe: NULLs allowed)
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'orders_stripe_session_id_unique'
        ) THEN
          ALTER TABLE orders
            ADD CONSTRAINT orders_stripe_session_id_unique
            UNIQUE (stripe_session_id);
        END IF;
      END $$
    `);
    console.log("✅ orders columns added");

    // ── 4. holds — add status column ────────────────────────
    await client.query(`
      ALTER TABLE holds ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
    `);
    console.log("✅ holds.status added");

    // ── 5. Seed cohort_seats from cohorts.json open cohorts ──
    // Only insert cohorts that don't already have a seat row
    const openCohorts = [
      { id: 137, capacity: 10, enrolled: 4 },
      { id: 138, capacity: 10, enrolled: 7 },
      { id: 139, capacity: 10, enrolled: 4 },
      { id: 140, capacity: 10, enrolled: 3 },
      { id: 141, capacity: 10, enrolled: 2 },
      { id: 142, capacity: 10, enrolled: 2 },
      { id: 143, capacity: 10, enrolled: 4 },
      { id: 201, capacity: 10, enrolled: 0 },
      { id: 202, capacity: 10, enrolled: 0 },
      { id: 203, capacity: 10, enrolled: 0 },
    ];
    for (const c of openCohorts) {
      await client.query(`
        INSERT INTO cohort_seats (cohort_id, capacity, enrolled, is_open)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (cohort_id) DO NOTHING
      `, [c.id, c.capacity, c.enrolled]);
    }
    console.log("✅ cohort_seats seeded from cohorts.json");

    // ── 6. Backfill flat columns from existing orders.customer ─
    await client.query(`
      UPDATE orders
      SET
        first_name = customer->>'firstName',
        last_name  = customer->>'lastName',
        phone      = customer->>'phone',
        email      = customer->>'email',
        country    = customer->>'country',
        city       = customer->>'city'
      WHERE first_name IS NULL
    `);
    console.log("✅ orders flat columns backfilled");

    // ── 7. Backfill stripe_session_id from session_id ────────
    await client.query(`
      UPDATE orders
      SET stripe_session_id = session_id
      WHERE stripe_session_id IS NULL AND session_id IS NOT NULL
    `);
    console.log("✅ orders.stripe_session_id backfilled");

    // ── 8. Backfill installments table from orders.installments JSONB ──
    await client.query(`
      INSERT INTO installments (order_id, seq, amount_jod, method, paid_at)
      SELECT
        o.id,
        (inst->>'seq')::INTEGER,
        (inst->>'amountJOD')::NUMERIC,
        inst->>'method',
        CASE WHEN inst->>'paidAt' IS NOT NULL AND inst->>'paidAt' != 'null'
          THEN (inst->>'paidAt')::TIMESTAMP
          ELSE NULL
        END
      FROM orders o,
           jsonb_array_elements(o.installments) AS inst
      WHERE NOT EXISTS (
        SELECT 1 FROM installments i WHERE i.order_id = o.id
      )
    `);
    console.log("✅ installments backfilled from JSONB");

    await client.query("COMMIT");
    console.log("\n🎉 Migration 08 complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
