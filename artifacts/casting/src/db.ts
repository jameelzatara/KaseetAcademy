import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

/** All casting tables live in the "casting" schema — isolated from kaseet.com */
export async function initDb(): Promise<void> {
  await pool.query(`CREATE SCHEMA IF NOT EXISTS casting`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS casting.submissions (
      id            SERIAL PRIMARY KEY,
      submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name          TEXT NOT NULL,
      gender        TEXT NOT NULL,
      age           SMALLINT NOT NULL,
      country       TEXT NOT NULL,
      city          TEXT NOT NULL,
      whatsapp      TEXT NOT NULL,
      email         TEXT NOT NULL,
      script        TEXT NOT NULL,
      home_studio   TEXT NOT NULL,
      studio_rate   SMALLINT,
      audio_filename TEXT NOT NULL,
      audio_mime    TEXT NOT NULL,
      audio_data    BYTEA NOT NULL,
      experience    TEXT NOT NULL,
      portfolio     TEXT,
      source        TEXT NOT NULL,
      notes         TEXT,
      ip            TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_casting_ip_time
    ON casting.submissions (ip, submitted_at)
  `);

  console.log("[casting] DB schema ready");
}

/** Amman timezone offset string for display */
export function toAmmanTime(d: Date): string {
  return d.toLocaleString("en-GB", {
    timeZone: "Asia/Amman",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).replace(",", "");
}
