import app from "./app.js";
import { logger } from "./lib/logger.js";
import { syncToSheet } from "./lib/sheetsSync.js";

// ── Stripe init (non-blocking) ────────────────────────────
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

// ── Start server ──────────────────────────────────────────
app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
  await initStripe();
  startSheetsSync();
});
