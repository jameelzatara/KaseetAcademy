import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

export interface StripeCredentials {
  secretKey: string;
  webhookSecret?: string;
}

/**
 * Fetches Stripe credentials from Replit connection API.
 * Not cached — tokens can rotate.
 */
export async function getStripeCredentials(): Promise<StripeCredentials> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      "Missing Replit environment variables. Ensure the Stripe integration is connected.",
    );
  }

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: "application/json", X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch Stripe credentials: ${resp.status} ${resp.statusText}`,
    );
  }

  const data = await resp.json();
  const settings = data.items?.[0]?.settings;

  // Replit Stripe connector stores keys as `secret` and `publishable`
  const secretKey = settings?.secret_key ?? settings?.secret;
  if (!secretKey) {
    throw new Error(
      "Stripe integration not connected or missing secret key. Connect Stripe via Integrations.",
    );
  }

  const webhookSecret = settings?.webhook_secret ?? settings?.webhook_signing_secret;

  return { secretKey, webhookSecret };
}

/**
 * Returns a fresh authenticated Stripe client.
 */
export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });
}

/**
 * Returns a StripeSync instance for webhook management and data sync.
 */
export async function getStripeSync(): Promise<StripeSync> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  const { secretKey, webhookSecret } = await getStripeCredentials();
  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret ?? "",
  });
}
