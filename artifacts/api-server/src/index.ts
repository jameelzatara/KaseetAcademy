import app from "./app.js";
import { logger } from "./lib/logger.js";
import { syncToSheet } from "./lib/sheetsSync.js";
import { seedCoursesIfEmpty, backfillCourseMarketingDefaults } from "./lib/seedCourses.js";
import { ensureAdminSchema } from "./lib/ensureSchema.js";
import { sweepExpiredDiscountReservations } from "./lib/discounts.js";

// ── Stripe init (non-blocking) ────────────────────────────
import { maybeRefreshRates } from "./lib/ratesFetcher.js";
async function initStripe() {
  try {
    const { runMigrations } = await import("stripe-replit-sync");
    const { getStripeSync } = await import("./lib/stripeClient.js");

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      logger.warn("DATABASE_URL not set — skipping Stripe init");
      return;
    }

    logger.info("Initializing Stripe schema...");
    await runMigrations({ databaseUrl });
    logger.info("Stripe schema ready");

    const stripeSync = await getStripeSync();
    const domains = process.env.REPLIT_DOMAINS?.split(",")[0];
    if (domains) {
      const webhookUrl = `https://${domains}/api/stripe/webhook`;
      await stripeSync.findOrCreateManagedWebhook(webhookUrl);
      logger.info({ webhookUrl }, "Stripe webhook registered");
    }
  } catch (err) {
    // Non-fatal — app continues without Stripe if keys aren't set yet
    logger.warn({ err }, "Stripe init failed (non-fatal — set up integration keys)");
  }
}

// ── Start server ──────────────────────────────────────────
const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required");

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

// ── Google Sheets sync (non-blocking) ────────────────────
function startSheetsSync() {
  const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

  // First run after 20 s (let DB connections stabilise)
  setTimeout(() => {
    syncToSheet().catch((err) => logger.error({ err }, "Sheets sync failed (startup)"));
  }, 20_000);

  // Recurring every 15 min
  setInterval(() => {
    syncToSheet().catch((err) => logger.error({ err }, "Sheets sync failed"));
  }, INTERVAL_MS);

  logger.info({ intervalMs: INTERVAL_MS }, "Sheets sync scheduled");
}

function startRatesScheduler() {
  // At startup: refresh if rates are older than 90 days (quarterly cadence) or missing
  setTimeout(() => {
    maybeRefreshRates(90).catch((err) =>
      logger.error({ err }, "Startup exchange-rate check failed"),
    );
  }, 5_000); // 5s — enough for DB connections to settle

  // Poll every 7 days (safe for 32-bit setInterval — max is ~24.8 days).
  // maybeRefreshRates(90) only fetches when data is actually >90 days old.
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms
  setInterval(() => {
    maybeRefreshRates(90).catch((err) =>
      logger.error({ err }, "Scheduled exchange-rate check failed"),
    );
  }, SEVEN_DAYS_MS);

  logger.info({ pollIntervalDays: 7, refreshThresholdDays: 90 }, "Exchange rate scheduler started");
}

// ── Start server ──────────────────────────────────────────
app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
  await initStripe();
  startSheetsSync();
  startRatesScheduler();
  ensureAdminSchema()
    .then(() => seedCoursesIfEmpty())
    .then(() => backfillCourseMarketingDefaults())
    .catch((err) => logger.error({ err }, "admin schema/seed failed"));
  // Release discount reservations whose checkout was abandoned without a
  // Stripe cancel/expiry event (Payment Element intents never auto-cancel).
  setInterval(() => {
    sweepExpiredDiscountReservations()
      .then((n) => { if (n > 0) logger.info({ released: n }, "expired discount reservations released"); })
      .catch((err) => logger.warn({ err }, "discount reservation sweep failed"));
  }, 10 * 60 * 1000);
});
