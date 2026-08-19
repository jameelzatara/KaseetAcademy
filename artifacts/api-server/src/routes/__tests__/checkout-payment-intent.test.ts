/**
 * Tests: POST /checkout/payment-intent (PaymentIntent flow)
 *
 * Covers:
 * 1. Cohort/course/mode validation — mismatched or unknown combinations must be rejected
 * 2. onPaymentIntentSucceeded — creates order, fires WhatsApp + email
 * 3. onPaymentIntentSucceeded — idempotent (skips if order already exists)
 * 4. onPaymentIntentSucceeded — does NOT fire notifications on overbooked result
 */

import { describe, it, expect, vi, afterEach } from "vitest";

// ── Mock DB ────────────────────────────────────────────────────────────────
// Short courses (everything not in the static COHORT_CATALOG) are validated
// live against the `cohorts` table — simulate it holding exactly these
// known (id, courseSlug, mode) triples.
const KNOWN_DB_COHORTS = new Set([
  "137:voiceover:onsite", "138:voiceover:live",
  "202:presenter:onsite", "201:public-speaking:onsite", "203:arabic-language:live",
]);
vi.mock("@workspace/db", () => ({
  db:   { select: vi.fn(), insert: vi.fn(), update: vi.fn() },
  pool: {
    query: vi.fn(async (sql: string, params?: unknown[]) => {
      if (typeof sql === "string" && sql.includes("FROM cohorts") && params) {
        const [cohortId, courseSlug, mode] = params;
        return KNOWN_DB_COHORTS.has(`${cohortId}:${courseSlug}:${mode}`)
          ? { rows: [{ ok: 1 }] }
          : { rows: [] };
      }
      return { rows: [] };
    }),
  },
  ordersTable:     {},
  holdsTable:      {},
  cohortSeatsTable: {},
  installmentsTable: {},
}));

// ── Mock Stripe client ─────────────────────────────────────────────────────
vi.mock("../../lib/stripeClient.js", () => ({
  getUncachableStripeClient: vi.fn(),
  getStripeSync: vi.fn(),
  verifyStripeWebhook: vi.fn(),
}));

// ── Mock order utilities ───────────────────────────────────────────────────
vi.mock("../../lib/orderUtils.js", () => ({
  createHold:            vi.fn().mockResolvedValue("hold_test"),
  setHoldSession:        vi.fn(),
  releaseHoldBySession:  vi.fn(),
  generateOrderId:       vi.fn().mockResolvedValue("KS-ORD-TEST-0001"),
  orderExistsForSession: vi.fn(async () => false),
  getCohortSeats:        vi.fn(async () => ({ capacity: 10, enrolled: 2, isOpen: true })),
  createOrderWithSeat:   vi.fn(async () => "created"),
}));

// ── Mock notifications ─────────────────────────────────────────────────────
const mockSendOrderConfirmation = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ ok: true, id: "email-test-id" }),
);
vi.mock("../../lib/email.js", () => ({
  sendOrderConfirmation: mockSendOrderConfirmation,
}));

const mockNotifyOrderCompleted = vi.hoisted(() =>
  vi.fn().mockResolvedValue([]),
);
vi.mock("../../lib/whatsapp.js", () => ({
  notifyOrderCompleted: mockNotifyOrderCompleted,
}));

// ── Import under test ──────────────────────────────────────────────────────
import { onPaymentIntentSucceeded } from "../checkout.js";
import { validateCohort, COHORT_CATALOG } from "../../lib/pricing.js";

// ── Helpers ────────────────────────────────────────────────────────────────

function makePaymentIntent(
  overrides: Partial<Record<string, string>> = {},
): import("stripe").Stripe.PaymentIntent {
  return {
    id:     "pi_test_abc123",
    object: "payment_intent",
    amount: 7075,
    currency: "usd",
    status:   "succeeded",
    metadata: {
      orderId:       "KS-ORD-TEST-0001",
      holdId:        "hold_test",
      cohortId:      "301",
      courseSlug:    "masar-soti",
      mode:          "onsite",
      plan:          "deposit",
      totalJOD:      "550",
      totalUSD:      "0",
      chargeUSD:     "70.75",
      firstName:     "علي",
      lastName:      "الأحمد",
      email:         "ali@test.com",
      phone:         "962799999999",
      country:       "الأردن",
      city:          "عمّان",
      cohortStartAr: "9 آب",
      cohortDays:    "الأحد والثلاثاء",
      cohortTimeAr:  "6:00 – 8:00 مساءً",
      cohortTrainer: "يسار عبده",
      cohortPlatform: "استوديو كاسيت",
      ...overrides,
    },
  } as unknown as import("stripe").Stripe.PaymentIntent;
}

// ══════════════════════════════════════════════════════════════
// 1. validateCohort — server-side catalog guard
// ══════════════════════════════════════════════════════════════

describe("validateCohort — server catalog guard", () => {
  it("accepts masterclass triples from the static catalog", async () => {
    await expect(validateCohort("masar-soti",    "onsite", 301)).resolves.toBe(301);
    await expect(validateCohort("masar-soti",    "live",   302)).resolves.toBe(302);
    await expect(validateCohort("masar-khataba", "onsite", 303)).resolves.toBe(303);
    await expect(validateCohort("masar-elami",   "onsite", 305)).resolves.toBe(305);
  });

  it("accepts short-course triples validated live against the cohorts table", async () => {
    await expect(validateCohort("voiceover",       "onsite", 137)).resolves.toBe(137);
    await expect(validateCohort("voiceover",       "live",   138)).resolves.toBe(138);
    await expect(validateCohort("presenter",       "onsite", 202)).resolves.toBe(202);
    await expect(validateCohort("public-speaking", "onsite", 201)).resolves.toBe(201);
    await expect(validateCohort("arabic-language", "live",   203)).resolves.toBe(203);
  });

  // Short courses aren't in the static catalog, so an unknown course/mode/id
  // for them all resolve to the same live DB lookup finding no row — there's
  // no way to distinguish "course doesn't exist" from "cohort doesn't match"
  // without a second query, so all three collapse to COHORT_MISMATCH.
  it("rejects an unknown courseSlug", async () => {
    await expect(validateCohort("fake-course", "onsite", 999)).rejects.toThrow("COHORT_MISMATCH");
  });

  it("rejects a mode not available for the course (arabic-language has no onsite)", async () => {
    await expect(validateCohort("arabic-language", "onsite", 203)).rejects.toThrow("COHORT_MISMATCH");
  });

  it("rejects a masterclass course+mode with a cohortId not in the allowed array", async () => {
    await expect(validateCohort("masar-soti", "onsite", 999)).rejects.toThrow("COHORT_MISMATCH");
  });

  it("rejects cross-course substitution (voiceover cohort against masar-soti)", async () => {
    await expect(validateCohort("masar-soti", "onsite", 137)).rejects.toThrow("COHORT_MISMATCH");
  });

  it("rejects presenter cohort (202) used against voiceover", async () => {
    await expect(validateCohort("voiceover", "onsite", 202)).rejects.toThrow("COHORT_MISMATCH");
  });

  it("covers every masterclass catalog entry without throwing for its correct pairs", async () => {
    for (const [slug, ids] of Object.entries(COHORT_CATALOG)) {
      if (ids.onsite) {
        for (const id of ids.onsite) {
          await expect(validateCohort(slug, "onsite", id)).resolves.not.toThrow();
        }
      }
      if (ids.live) {
        for (const id of ids.live) {
          await expect(validateCohort(slug, "live", id)).resolves.not.toThrow();
        }
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════
// 2. onPaymentIntentSucceeded — happy path
// ══════════════════════════════════════════════════════════════

describe("onPaymentIntentSucceeded — happy path (deposit, onsite)", () => {
  afterEach(() => { vi.clearAllMocks(); });

  it("fires both WhatsApp notification AND email on a succeeded PaymentIntent", async () => {
    const { db } = await import("@workspace/db");
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }),
      }),
    } as any);

    await onPaymentIntentSucceeded(makePaymentIntent());

    expect(mockNotifyOrderCompleted).toHaveBeenCalledTimes(1);
    expect(mockSendOrderConfirmation).toHaveBeenCalledTimes(1);
  });

  it("passes the same orderId to both WhatsApp and email", async () => {
    const { db } = await import("@workspace/db");
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }),
      }),
    } as any);

    await onPaymentIntentSucceeded(makePaymentIntent({ orderId: "KS-ORD-MATCH-001" }));

    const waArgs  = mockNotifyOrderCompleted.mock.calls[0][0] as Record<string, unknown>;
    const emlArgs = mockSendOrderConfirmation.mock.calls[0][0] as Record<string, unknown>;
    expect(waArgs.orderId).toBe("KS-ORD-MATCH-001");
    expect(emlArgs.orderId).toBe("KS-ORD-MATCH-001");
  });
});

// ══════════════════════════════════════════════════════════════
// 3. onPaymentIntentSucceeded — idempotency
// ══════════════════════════════════════════════════════════════

describe("onPaymentIntentSucceeded — idempotency guard", () => {
  afterEach(() => { vi.clearAllMocks(); });

  it("skips all processing when an order already exists for this PaymentIntent", async () => {
    const { db } = await import("@workspace/db");
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: "KS-EXISTING" }]),
        }),
      }),
    } as any);

    await onPaymentIntentSucceeded(makePaymentIntent());

    expect(mockNotifyOrderCompleted).not.toHaveBeenCalled();
    expect(mockSendOrderConfirmation).not.toHaveBeenCalled();
  });
});

// ══════════════════════════════════════════════════════════════
// 4. onPaymentIntentSucceeded — overbooked
// ══════════════════════════════════════════════════════════════

describe("onPaymentIntentSucceeded — overbooked cohort", () => {
  afterEach(() => { vi.clearAllMocks(); });

  it("does NOT send notifications when seat creation returns overbooked", async () => {
    const { db } = await import("@workspace/db");
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({ limit: vi.fn().mockResolvedValue([]) }),
      }),
    } as any);
    vi.mocked(db.insert).mockReturnValue({
      values: vi.fn().mockReturnValue({
        onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
      }),
    } as any);

    const { createOrderWithSeat } = await import("../../lib/orderUtils.js");
    vi.mocked(createOrderWithSeat).mockResolvedValueOnce("overbooked");

    await onPaymentIntentSucceeded(makePaymentIntent());

    expect(mockNotifyOrderCompleted).not.toHaveBeenCalled();
    expect(mockSendOrderConfirmation).not.toHaveBeenCalled();
  });
});
