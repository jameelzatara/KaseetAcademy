/**
 * Integration tests: processWebhookEvent → notifyOrderCompleted → CallMeBot
 *
 * All external I/O (DB, Stripe client, CallMeBot) is mocked so the tests run
 * without real credentials and without hitting any network.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock heavy dependencies before importing the module under test ──────────

// Mock @workspace/db so no real DB connection is needed
vi.mock("@workspace/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
  ordersTable: {},
  holdsTable: {},
}));

// Mock stripeClient — not needed for business-logic tests
vi.mock("../../lib/stripeClient.js", () => ({
  getUncachableStripeClient: vi.fn(),
  getStripeSync: vi.fn(),
}));

// Mock orderUtils to control what the DB "returns"
vi.mock("../../lib/orderUtils.js", () => ({
  createHold: vi.fn(),
  setHoldSession: vi.fn(),
  releaseHoldBySession: vi.fn(),
  generateOrderId: vi.fn(() => "KA-MOCK-0001"),
  orderExistsForSession: vi.fn(async () => false), // order does NOT exist yet → should create
  getCohortSeats: vi.fn(),
  createOrderWithSeat: vi.fn(async () => "created"), // simulate successful insert
}));

// ── Now import the module under test ───────────────────────────────────────

import { processWebhookEvent } from "../checkout.js";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeCompletedSession(
  overrides: Partial<Record<string, string>> = {},
): import("stripe").Stripe.Checkout.Session {
  return {
    id: "cs_test_abc",
    payment_intent: "pi_test_xyz",
    payment_status: "paid",
    amount_total: 5000,
    metadata: {
      orderId: "KA-2026-TEST",
      holdId: "hold-1",
      cohortId: "3",
      courseSlug: "voiceover",
      mode: "onsite",
      plan: "full",
      totalJOD: "218",
      totalUSD: "0",
      chargeUSD: "307",
      firstName: "سارة",
      lastName: "النجار",
      email: "sara@example.com",
      phone: "0791234567",
      country: "JO",
      city: "عمّان",
      ...overrides,
    },
  } as unknown as import("stripe").Stripe.Checkout.Session;
}

function makeWebhookEvent(
  session: import("stripe").Stripe.Checkout.Session,
): import("stripe").Stripe.Event {
  return {
    id: "evt_test_1",
    type: "checkout.session.completed",
    data: { object: session },
  } as unknown as import("stripe").Stripe.Event;
}

function makeFetch(ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    text: async () => (ok ? "OK" : "Bad Request"),
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("processWebhookEvent — WhatsApp integration", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.WHATSAPP_RECIPIENTS;
    vi.clearAllMocks();
  });

  it("calls CallMeBot after a successful checkout.session.completed event", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:testkey";
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));

    // fetch should have been called exactly once (one recipient, one notification)
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url] = mockFetch.mock.calls[0] as [string];
    expect(url).toContain("callmebot.com");
  });

  it("notification message contains order ID, trainee name, phone, and course", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:testkey";
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";

    expect(text).toContain("KA-2026-TEST");       // order ID
    expect(text).toContain("سارة");                // first name
    expect(text).toContain("النجار");              // last name
    expect(text).toContain("0791234567");          // phone
    expect(text).toContain("أساسيات التعليق");    // course name (Arabic, from COURSE_NAMES)
  });

  it("skips notification without error when WHATSAPP_RECIPIENTS is not set", async () => {
    delete process.env.WHATSAPP_RECIPIENTS;
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await expect(
      processWebhookEvent(makeWebhookEvent(makeCompletedSession())),
    ).resolves.toBeUndefined();

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not send a WhatsApp notification for checkout.session.expired events", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:testkey";
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    const expiredEvent = {
      id: "evt_test_2",
      type: "checkout.session.expired",
      data: { object: { id: "cs_test_expired" } },
    } as unknown as import("stripe").Stripe.Event;

    await processWebhookEvent(expiredEvent);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not re-notify when the order already exists (idempotency guard)", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:testkey";
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    // Override: orderExistsForSession returns true → onSessionCompleted should bail early
    const { orderExistsForSession } = await import("../../lib/orderUtils.js");
    vi.mocked(orderExistsForSession).mockResolvedValueOnce(true);

    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not send WhatsApp notification when seat creation returns overbooked", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:testkey";
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    const { createOrderWithSeat } = await import("../../lib/orderUtils.js");
    vi.mocked(createOrderWithSeat).mockResolvedValueOnce("overbooked");

    // db.insert must be chainable (overbooked path calls db.insert(...).onConflictDoNothing())
    const { db } = await import("@workspace/db");
    vi.mocked(db.insert).mockReturnValue({
      onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
    } as any);

    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
