/**
 * Route-level regression tests: cohort/course/mode validation
 * on BOTH public checkout endpoints.
 *
 * These tests fire real HTTP requests against the Express app to confirm
 * that mismatched, cross-course, and unknown cohort IDs are rejected at the
 * route layer — not just by the pure validateCohort() function.
 *
 * Cohort IDs used here must match COHORT_CATALOG in pricing.ts.
 * All external I/O (DB, Stripe) is mocked.
 */

import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import request from "supertest";

const mockGetStripeCredentials = vi.hoisted(() => vi.fn());

// ── Mock DB ────────────────────────────────────────────────────────────────
// Short courses (everything not in the static COHORT_CATALOG) are validated
// live against the `cohorts` table — simulate it holding exactly these
// known (id, courseSlug, mode) triples.
const KNOWN_DB_COHORTS = new Set([
  "137:voiceover:onsite", "138:voiceover:live",
  "202:presenter:onsite", "203:arabic-language:live",
]);
vi.mock("@workspace/db", () => ({
  db:               { select: vi.fn(), insert: vi.fn(), update: vi.fn() },
  pool:             {
    query: vi.fn().mockImplementation((query: string, params?: unknown[]) => {
      if (query.includes("FROM courses")) {
        return Promise.resolve({
          rows: [{
            onsite_price_jod: 550,
            live_price_usd: 750,
            onsite_enabled: true,
            live_enabled: true,
          }],
        });
      }
      if (query.includes("FROM cohorts") && params) {
        const [cohortId, courseSlug, mode] = params;
        return Promise.resolve(
          KNOWN_DB_COHORTS.has(`${cohortId}:${courseSlug}:${mode}`)
            ? { rows: [{ ok: 1 }] }
            : { rows: [] },
        );
      }
      return Promise.resolve({ rows: [] });
    }),
  },
  ordersTable:      {},
  holdsTable:       {},
  cohortSeatsTable: {},
  installmentsTable: {},
}));

// ── Mock Stripe client ─────────────────────────────────────────────────────
vi.mock("../../lib/stripeClient.js", () => ({
  getUncachableStripeClient: vi.fn().mockResolvedValue({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: "https://stripe.test/pay", id: "cs_test" }),
      },
    },
    paymentIntents: {
      create: vi.fn().mockResolvedValue({
        id: "pi_test", client_secret: "pi_test_secret",
      }),
    },
  }),
  getStripeCredentials:  mockGetStripeCredentials,
  getStripeSync:        vi.fn().mockResolvedValue({ processWebhook: vi.fn(), initSchema: vi.fn() }),
  verifyStripeWebhook:  vi.fn(),
}));

// ── Mock order utilities ───────────────────────────────────────────────────
vi.mock("../../lib/orderUtils.js", () => ({
  createHold:            vi.fn().mockResolvedValue("hold_test"),
  setHoldSession:        vi.fn(),
  releaseHoldBySession:  vi.fn(),
  generateOrderId:       vi.fn().mockResolvedValue("KS-SEC-TEST-001"),
  orderExistsForSession: vi.fn(async () => false),
  getCohortSeats:        vi.fn(async () => ({ capacity: 10, enrolled: 2, isOpen: true })),
  createOrderWithSeat:   vi.fn(async () => "created"),
}));

// ── Mock notifications ─────────────────────────────────────────────────────
vi.mock("../../lib/email.js",    () => ({ sendOrderConfirmation: vi.fn().mockResolvedValue({ ok: true }) }));
vi.mock("../../lib/whatsapp.js", () => ({ notifyOrderCompleted: vi.fn().mockResolvedValue([]) }));
vi.mock("../../lib/sheetsSync.js", () => ({ scheduleSheetsSync: vi.fn() }));

// ── Env vars required by app.ts before import ─────────────────────────────
process.env.SESSION_SECRET = "test-secret-for-route-tests";
process.env.DATABASE_URL   = "postgresql://test:test@localhost/test";

import app from "../../app.js";

beforeEach(() => {
  delete process.env.STRIPE_PUBLISHABLE_KEY;
  mockGetStripeCredentials.mockResolvedValue({
    secretKey: "sk_test_connector",
    publishableKey: "pk_test_connector",
  });
});

afterEach(() => {
  delete process.env.STRIPE_PUBLISHABLE_KEY;
});

// ── Shared base payloads ────────────────────────────────────────────────────

const VALID_CUSTOMER = { firstName: "علي", phone: "962799999999", country: "الأردن" };
const COHORT_META    = { cohortStartAr: "1 أيلول", cohortDays: "الأحد", cohortTimeAr: "6:00 مساءً", cohortTrainer: "اختبار", cohortPlatform: "اختبار" };

/** A valid masar-soti onsite body (cohortId=301, matches COHORT_CATALOG) */
function sessionBody(overrides: Record<string, unknown> = {}) {
  return { cohortId: 301, courseSlug: "masar-soti", mode: "onsite", plan: "deposit", ...COHORT_META, customer: VALID_CUSTOMER, ...overrides };
}

/** A valid masar-soti onsite body for the PaymentIntent endpoint */
function intentBody(overrides: Record<string, unknown> = {}) {
  return { cohortId: 301, courseSlug: "masar-soti", mode: "onsite", plan: "deposit", ...COHORT_META, customer: VALID_CUSTOMER, ...overrides };
}

// ══════════════════════════════════════════════════════════════════════════
// GET /api/checkout/config — Stripe publishable key
// ══════════════════════════════════════════════════════════════════════════

describe("GET /api/checkout/config — Stripe publishable key", () => {
  it("returns the publishable key from the active Stripe connection", async () => {
    const res = await request(app).get("/api/checkout/config");
    expect(res.status).toBe(200);
    expect(res.body.publishableKey).toBe("pk_test_connector");
    expect(mockGetStripeCredentials).toHaveBeenCalledTimes(1);
  });

  it("falls back to STRIPE_PUBLISHABLE_KEY when the connector only supplies a secret", async () => {
    mockGetStripeCredentials.mockResolvedValueOnce({ secretKey: "sk_test_connector" });
    process.env.STRIPE_PUBLISHABLE_KEY = "pk_test_environment";
    const res = await request(app).get("/api/checkout/config");
    expect(res.status).toBe(200);
    expect(res.body.publishableKey).toBe("pk_test_environment");
  });

  it("returns 503 when neither connector nor environment supplies a browser key", async () => {
    mockGetStripeCredentials.mockResolvedValueOnce({ secretKey: "sk_test_connector" });
    const res = await request(app).get("/api/checkout/config");
    expect(res.status).toBe(503);
    expect(res.body.error).toBe("Stripe not configured");
  });

  it("rejects an environment key from a different Stripe mode", async () => {
    mockGetStripeCredentials.mockResolvedValueOnce({ secretKey: "sk_test_connector" });
    process.env.STRIPE_PUBLISHABLE_KEY = "pk_live_environment";
    const res = await request(app).get("/api/checkout/config");
    expect(res.status).toBe(503);
    expect(res.body.error).toBe("Stripe not configured");
  });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /api/checkout/session — cohort validation
// ══════════════════════════════════════════════════════════════════════════

describe("POST /api/checkout/session — cohort validation", () => {

  it("accepts the valid masar-soti onsite cohort (301) and returns a Stripe URL", async () => {
    const res = await request(app).post("/api/checkout/session").send(sessionBody());
    expect(res.status).toBe(200);
    expect(res.body.url).toContain("stripe.test");
  });

  it("accepts a valid voiceover onsite cohort (137)", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "voiceover", cohortId: 137, mode: "onsite" }),
    );
    expect(res.status).toBe(200);
  });

  it("accepts a valid voiceover live cohort (138)", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "voiceover", cohortId: 138, mode: "live" }),
    );
    expect(res.status).toBe(200);
  });

  it("accepts the valid presenter onsite cohort (202)", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "presenter", cohortId: 202, mode: "onsite" }),
    );
    expect(res.status).toBe(200);
  });

  it("accepts the valid arabic-language live cohort (203)", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "arabic-language", cohortId: 203, mode: "live" }),
    );
    expect(res.status).toBe(200);
  });

  // ── Rejection cases ──────────────────────────────────────────────────────

  it("rejects an unknown courseSlug with 400", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "fake-course", cohortId: 999 }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects cross-course substitution: voiceover cohort (137) paired with masar-soti pricing", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "masar-soti", cohortId: 137 }),
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("COHORT_MISMATCH");
  });

  it("rejects cross-course substitution: masar-khataba cohort (303) paired with masar-elami pricing", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "masar-elami", cohortId: 303, mode: "onsite" }),
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("COHORT_MISMATCH");
  });

  it("rejects a completely unknown cohortId (999) for a valid course", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ cohortId: 999 }),
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("COHORT_MISMATCH");
  });

  it("rejects presenter cohort (202) used against voiceover (different course)", async () => {
    const res = await request(app).post("/api/checkout/session").send(
      sessionBody({ courseSlug: "voiceover", cohortId: 202, mode: "onsite" }),
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("COHORT_MISMATCH");
  });
});

// ══════════════════════════════════════════════════════════════════════════
// POST /api/checkout/payment-intent — cohort validation
// ══════════════════════════════════════════════════════════════════════════

describe("POST /api/checkout/payment-intent — cohort validation", () => {

  it("accepts the valid masar-soti onsite cohort (301) and returns clientSecret", async () => {
    const res = await request(app).post("/api/checkout/payment-intent").send(intentBody());
    expect(res.status).toBe(200);
    expect(res.body.clientSecret).toBe("pi_test_secret");
  });

  it("accepts the valid masar-elami live cohort (306)", async () => {
    const res = await request(app).post("/api/checkout/payment-intent").send(
      intentBody({ courseSlug: "masar-elami", cohortId: 306, mode: "live" }),
    );
    expect(res.status).toBe(200);
  });

  it("rejects an unknown courseSlug with 400", async () => {
    const res = await request(app).post("/api/checkout/payment-intent").send(
      intentBody({ courseSlug: "fake-course", cohortId: 999 }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects cross-course substitution: voiceover cohort (137) with masar-soti pricing", async () => {
    const res = await request(app).post("/api/checkout/payment-intent").send(
      intentBody({ courseSlug: "masar-soti", cohortId: 137 }),
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("COHORT_MISMATCH");
  });

  it("rejects a completely unknown cohortId (999) for a valid course", async () => {
    const res = await request(app).post("/api/checkout/payment-intent").send(
      intentBody({ cohortId: 999 }),
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("COHORT_MISMATCH");
  });

  it("rejects masar-khataba cohort (303) used against masar-soti pricing", async () => {
    const res = await request(app).post("/api/checkout/payment-intent").send(
      intentBody({ cohortId: 303 }),
    );
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("COHORT_MISMATCH");
  });
});
