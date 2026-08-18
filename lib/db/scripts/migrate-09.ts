/**
 * Migration 09: Add exchange_rates table for auto-refreshed FX rates.
 * Run once: pnpm tsx lib/db/scripts/migrate-09.ts
 */
import { Pool } from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS exchange_rates (
        id          SERIAL PRIMARY KEY,
        base        TEXT NOT NULL DEFAULT 'JOD',
        rates       JSONB NOT NULL,
        source      TEXT NOT NULL,
        fetched_at  TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log("✅ exchange_rates table ready");

    await client.query("COMMIT");
    console.log("✅ Migration 09 complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration 09 failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(() => process.exit(1));
