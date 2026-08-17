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
vi.mock("@workspace/db", () => ({
  db:              { select: vi.fn(), insert: vi.fn(), update: vi.fn() },
  pool:            { query: vi.fn().mockResolvedValue({ rows: [] }) },
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
  it("accepts all valid (courseSlug, mode, cohortId) triples from the catalog", () => {
    expect(validateCohort("masar-soti",    "onsite", 301)).toBe(301);
    expect(validateCohort("masar-soti",    "live",   302)).toBe(302);
    expect(validateCohort("masar-khataba", "onsite", 303)).toBe(303);
    expect(validateCohort("masar-elami",   "onsite", 305)).toBe(305);
    expect(validateCohort("voiceover",     "onsite", 137)).toBe(137);
    expect(validateCohort("voiceover",     "onsite", 142)).toBe(142);
    expect(validateCohort("voiceover",     "live",   138)).toBe(138);
    expect(validateCohort("presenter",     "onsite", 202)).toBe(202);
    expect(validateCohort("public-speaking", "onsite", 201)).toBe(201);
    expect(validateCohort("arabic-language", "live",  203)).toBe(203);
  });

  it("rejects an unknown courseSlug", () => {
    expect(() => validateCohort("fake-course", "onsite", 999)).toThrow("INVALID_COURSE");
  });

  it("rejects a mode not available for the course (arabic-language has no onsite)", () => {
    expect(() => validateCohort("arabic-language", "onsite", 203)).toThrow("MODE_NOT_AVAILABLE");
  });

  it("rejects a valid course+mode with a cohortId not in the allowed array", () => {
    expect(() => validateCohort("masar-soti", "onsite", 999)).toThrow("COHORT_MISMATCH");
  });

  it("rejects cross-course substitution (voiceover cohort against masar-soti)", () => {
    expect(() => validateCohort("masar-soti", "onsite", 137)).toThrow("COHORT_MISMATCH");
  });

  it("rejects presenter cohort (202) used against voiceover", () => {
    expect(() => validateCohort("voiceover", "onsite", 202)).toThrow("COHORT_MISMATCH");
  });

  it("covers every catalog entry without throwing for its correct pairs", () => {
    for (const [slug, ids] of Object.entries(COHORT_CATALOG)) {
      if (ids.onsite) {
        for (const id of ids.onsite) {
          expect(() => validateCohort(slug, "onsite", id)).not.toThrow();
        }
      }
      if (ids.live) {
        for (const id of ids.live) {
          expect(() => validateCohort(slug, "live", id)).not.toThrow();
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
