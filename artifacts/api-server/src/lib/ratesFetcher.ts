/**
 * ratesFetcher — fetches live FX rates (base: JOD) from open.er-api.com.
 * Falls back gracefully to the hardcoded defaults when the fetch fails.
 *
 * The free tier of open.er-api.com (https://open.er-api.com/v6/latest/JOD)
 * requires no API key and is updated daily.
 */
import { pool } from "@workspace/db";
import { logger } from "./logger.js";

/** Hardcoded fallback rates — 1 JOD = X units of each currency */
const FALLBACK_RATES: Record<string, number> = {
  JOD: 1,
  USD: 1.41,
  SAR: 5.29,
  AED: 5.18,
  KWD: 0.43,
  QAR: 5.13,
  BHD: 0.53,
  OMR: 0.54,
  EGP: 68.50,
  IQD: 1845,
  LBP: 126500,
  SYP: 18200,
  MAD: 13.90,
  TND: 4.35,
  DZD: 189,
  LYD: 6.75,
  YER: 353,
  SDG: 870,
  EUR: 1.28,
  GBP: 1.10,
};

const SOURCE = "open.er-api.com";
const API_URL = "https://open.er-api.com/v6/latest/JOD";

// Singleton in-flight promise — prevents thundering herd when many requests
// arrive before the DB has any rates stored.
let _inFlight: Promise<Record<string, number>> | null = null;

/** Fetch live rates from the API and persist to DB. Returns the rates. */
export async function fetchAndStoreRates(): Promise<Record<string, number>> {
  if (_inFlight) return _inFlight;
  _inFlight = _doFetch().finally(() => { _inFlight = null; });
  return _inFlight;
}

async function _doFetch(): Promise<Record<string, number>> {
  try {
    logger.info("Fetching live exchange rates from " + SOURCE);
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as { result: string; rates: Record<string, number> };
    if (data.result !== "success" || !data.rates) {
      throw new Error("Unexpected API response shape");
    }

    // Subset to only the currencies we support, keep JOD=1 authoritative
    const rates: Record<string, number> = { JOD: 1 };
    for (const code of Object.keys(FALLBACK_RATES)) {
      if (code !== "JOD" && data.rates[code] != null) {
        rates[code] = data.rates[code];
      } else if (code !== "JOD") {
        // Currency missing from API — keep fallback
        rates[code] = FALLBACK_RATES[code];
      }
    }

    await pool.query(
      `INSERT INTO exchange_rates (base, rates, source, fetched_at)
       VALUES ($1, $2, $3, NOW())`,
      ["JOD", JSON.stringify(rates), SOURCE],
    );

    // Keep only the 5 most recent rows — prevents unbounded growth
    await pool.query(
      `DELETE FROM exchange_rates
       WHERE id NOT IN (
         SELECT id FROM exchange_rates ORDER BY fetched_at DESC LIMIT 5
       )`,
    );

    logger.info({ rateCount: Object.keys(rates).length }, "Exchange rates updated in DB");
    return rates;
  } catch (err) {
    logger.error({ err }, "Failed to fetch live exchange rates — using fallback");
    return FALLBACK_RATES;
  }
}

/**
 * Returns the most recently stored rates from DB.
 * Never triggers a fetch inline — returns fallback + stale:true when DB is empty.
 * The server-side scheduler (maybeRefreshRates) is responsible for populating the DB.
 */
export async function getLatestRates(maxAgeDays = 7): Promise<{
  rates: Record<string, number>;
  fetchedAt: Date | null;
  stale: boolean;
}> {
  try {
    const result = await pool.query<{ rates: Record<string, number>; fetched_at: Date }>(
      `SELECT rates, fetched_at
       FROM exchange_rates
       ORDER BY fetched_at DESC
       LIMIT 1`,
    );

    if (result.rows.length === 0) {
      // DB not yet seeded — return hardcoded fallback; scheduler will seed asap.
      return { rates: FALLBACK_RATES, fetchedAt: null, stale: true };
    }

    const row = result.rows[0];
    const ageMs = Date.now() - new Date(row.fetched_at).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const stale = ageDays > maxAgeDays;

    return {
      rates: row.rates as Record<string, number>,
      fetchedAt: new Date(row.fetched_at),
      stale,
    };
  } catch (err) {
    logger.error({ err }, "DB query for exchange_rates failed — returning fallback");
    return { rates: FALLBACK_RATES, fetchedAt: null, stale: true };
  }
}

/**
 * Called at server startup and on a quarterly schedule.
 * Refreshes rates if they are older than `maxAgeDays`.
 */
export async function maybeRefreshRates(maxAgeDays = 7): Promise<void> {
  const { stale, fetchedAt } = await getLatestRates(maxAgeDays);
  if (stale) {
    const age = fetchedAt ? `${Math.round((Date.now() - fetchedAt.getTime()) / 86400000)}d old` : "no data";
    logger.info({ age }, "Exchange rates stale — triggering refresh");
    await fetchAndStoreRates();
  } else {
    logger.info({ fetchedAt }, "Exchange rates are fresh — no refresh needed");
  }
}
