import app from "./app.js";
import { logger } from "./lib/logger.js";

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
    await runMigrations({ databaseUrl, schema: "stripe" });
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

// Start listening first, then init Stripe in the background
app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
  await initStripe();
});
