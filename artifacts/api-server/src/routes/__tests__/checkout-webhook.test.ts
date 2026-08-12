/**
 * Integration tests: processWebhookEvent + onSessionCompleted (polling path)
 *   → notifyOrderCompleted (WhatsApp) + sendOrderConfirmation (email)
 *
 * All external I/O (DB, Stripe, CallMeBot, Resend) is mocked so tests run
 * without real credentials and without hitting any network.
 */

import { describe, it, expect, vi, afterEach } from "vitest";

// ── Mock DB ────────────────────────────────────────────────────────────────
vi.mock("@workspace/db", () => ({
  db:          { select: vi.fn(), insert: vi.fn(), update: vi.fn() },
  pool:        { query: vi.fn().mockResolvedValue({ rows: [] }) },
  ordersTable:  {},
  holdsTable:   {},
}));

// ── Mock Stripe client ─────────────────────────────────────────────────────
vi.mock("../../lib/stripeClient.js", () => ({
  getUncachableStripeClient: vi.fn(),
  getStripeSync: vi.fn(),
}));

// ── Mock order utilities ───────────────────────────────────────────────────
vi.mock("../../lib/orderUtils.js", () => ({
  createHold:            vi.fn(),
  setHoldSession:        vi.fn(),
  releaseHoldBySession:  vi.fn(),
  generateOrderId:       vi.fn(() => "KA-MOCK-0001"),
  orderExistsForSession: vi.fn(async () => false),
  getCohortSeats:        vi.fn(),
  createOrderWithSeat:   vi.fn(async () => "created"),
}));

// ── Spy on lib/email and lib/whatsapp ─────────────────────────────────────
const mockSendOrderConfirmation = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ ok: true, id: "email-test-id" }),
);
vi.mock("../../lib/email.js", () => ({
  sendOrderConfirmation: mockSendOrderConfirmation,
}));

const mockNotifyOrderCompleted = vi.hoisted(() =>
  vi.fn().mockResolvedValue([]), // notifyOrderCompleted now returns WhatsAppRecipientResult[]
);
vi.mock("../../lib/whatsapp.js", () => ({
  notifyOrderCompleted: mockNotifyOrderCompleted,
}));

// ── Import modules under test AFTER all mocks are registered ──────────────
import { processWebhookEvent, onSessionCompleted } from "../checkout.js";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeCompletedSession(
  overrides: Partial<Record<string, string>> = {},
): import("stripe").Stripe.Checkout.Session {
  return {
    id:             "cs_test_abc",
    payment_intent: "pi_test_xyz",
    payment_status: "paid",
    amount_total:   5000,
    metadata: {
      orderId:    "KA-2026-TEST",
      holdId:     "hold-1",
      cohortId:   "3",
      courseSlug: "voiceover",
      mode:       "onsite",
      plan:       "full",
      totalJOD:   "218",
      totalUSD:   "0",
      chargeUSD:  "307",
      firstName:  "سارة",
      lastName:   "النجار",
      email:      "sara@example.com",
      phone:      "0791234567",
      country:    "JO",
      city:       "عمّان",
      ...overrides,
    },
  } as unknown as import("stripe").Stripe.Checkout.Session;
}

function makeWebhookEvent(
  session: import("stripe").Stripe.Checkout.Session,
): import("stripe").Stripe.Event {
  return {
    id:   "evt_test_1",
    type: "checkout.session.completed",
    data: { object: session },
  } as unknown as import("stripe").Stripe.Event;
}

// ── WhatsApp Tests ─────────────────────────────────────────────────────────

describe("processWebhookEvent — WhatsApp notification", () => {
  afterEach(() => { vi.clearAllMocks(); });

  it("calls notifyOrderCompleted after checkout.session.completed", async () => {
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockNotifyOrderCompleted).toHaveBeenCalledTimes(1);
  });

  it("notification payload contains order ID, name, phone, course, plan, and mode", async () => {
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    const args = mockNotifyOrderCompleted.mock.calls[0][0] as Record<string, unknown>;
    expect(args.orderId).toBe("KA-2026-TEST");
    expect(args.firstName).toBe("سارة");
    expect(args.lastName).toBe("النجار");
    expect(args.phone).toBe("0791234567");
    expect(typeof args.courseName).toBe("string");
    expect((args.courseName as string).length).toBeGreaterThan(0);
    expect(args.plan).toBe("full");
    expect(args.mode).toBe("onsite");
  });

  it("does not notify on checkout.session.expired", async () => {
    const expiredEvent = {
      id: "evt_test_2", type: "checkout.session.expired",
      data: { object: { id: "cs_test_expired" } },
    } as unknown as import("stripe").Stripe.Event;
    await processWebhookEvent(expiredEvent);
    expect(mockNotifyOrderCompleted).not.toHaveBeenCalled();
  });

  it("does not notify when order already exists (idempotency guard)", async () => {
    const { orderExistsForSession } = await import("../../lib/orderUtils.js");
    vi.mocked(orderExistsForSession).mockResolvedValueOnce(true);
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockNotifyOrderCompleted).not.toHaveBeenCalled();
  });

  it("does not notify when seat creation returns overbooked", async () => {
    const { createOrderWithSeat } = await import("../../lib/orderUtils.js");
    vi.mocked(createOrderWithSeat).mockResolvedValueOnce("overbooked");
    const { db } = await import("@workspace/db");
    vi.mocked(db.insert).mockReturnValue({
      onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
    } as any);
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockNotifyOrderCompleted).not.toHaveBeenCalled();
  });
});

// ── Email Tests ────────────────────────────────────────────────────────────

describe("processWebhookEvent — email confirmation", () => {
  afterEach(() => { vi.clearAllMocks(); });

  it("calls sendOrderConfirmation after checkout.session.completed", async () => {
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockSendOrderConfirmation).toHaveBeenCalledTimes(1);
  });

  it("email payload contains order ID, customer details, course, plan, and mode", async () => {
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    const args = mockSendOrderConfirmation.mock.calls[0][0] as Record<string, unknown>;
    expect(args.orderId).toBe("KA-2026-TEST");
    expect(args.firstName).toBe("سارة");
    expect(args.lastName).toBe("النجار");
    expect(args.customerEmail).toBe("sara@example.com");
    expect(typeof args.courseName).toBe("string");
    expect((args.courseName as string).length).toBeGreaterThan(0);
    expect(args.plan).toBe("full");
    expect(args.mode).toBe("onsite");
  });

  it("still calls sendOrderConfirmation when no customer email (skipping is email.ts's responsibility)", async () => {
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession({ email: "" })));
    expect(mockSendOrderConfirmation).toHaveBeenCalledTimes(1);
    const args = mockSendOrderConfirmation.mock.calls[0][0] as Record<string, unknown>;
    expect(args.customerEmail).toBeFalsy();
  });

  it("does not send email when order already exists (idempotency guard)", async () => {
    const { orderExistsForSession } = await import("../../lib/orderUtils.js");
    vi.mocked(orderExistsForSession).mockResolvedValueOnce(true);
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockSendOrderConfirmation).not.toHaveBeenCalled();
  });

  it("does not send email when seat creation returns overbooked", async () => {
    const { createOrderWithSeat } = await import("../../lib/orderUtils.js");
    vi.mocked(createOrderWithSeat).mockResolvedValueOnce("overbooked");
    const { db } = await import("@workspace/db");
    vi.mocked(db.insert).mockReturnValue({
      onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
    } as any);
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockSendOrderConfirmation).not.toHaveBeenCalled();
  });
});

// ── Combined: both fire together ───────────────────────────────────────────

describe("processWebhookEvent — WhatsApp + email fire together", () => {
  afterEach(() => { vi.clearAllMocks(); });

  it("fires both WhatsApp notification AND email on a completed payment", async () => {
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockNotifyOrderCompleted).toHaveBeenCalledTimes(1);
    expect(mockSendOrderConfirmation).toHaveBeenCalledTimes(1);
    const waArgs  = mockNotifyOrderCompleted.mock.calls[0][0] as Record<string, unknown>;
    const emlArgs = mockSendOrderConfirmation.mock.calls[0][0] as Record<string, unknown>;
    expect(waArgs.orderId).toBe(emlArgs.orderId);
    expect(waArgs.orderId).toBe("KA-2026-TEST");
  });

  it("neither fires when order already exists (idempotency prevents double-notify)", async () => {
    const { orderExistsForSession } = await import("../../lib/orderUtils.js");
    vi.mocked(orderExistsForSession).mockResolvedValueOnce(true);
    await processWebhookEvent(makeWebhookEvent(makeCompletedSession()));
    expect(mockNotifyOrderCompleted).not.toHaveBeenCalled();
    expect(mockSendOrderConfirmation).not.toHaveBeenCalled();
  });
});

// ── Polling-path coverage ─────────────────────────────────────────────────
// The /checkout/status route calls onSessionCompleted() directly when Stripe
// confirms payment but the webhook has not arrived yet.  Both notification
// paths share that function, so we test it here to confirm neither is skipped.

describe("onSessionCompleted — polling path (webhook arrives late)", () => {
  afterEach(() => { vi.clearAllMocks(); });

  it("fires both WhatsApp and email when called from the polling path (order not yet in DB)", async () => {
    // Precondition: webhook has NOT arrived — orderExistsForSession returns false (default mock).
    // /checkout/status retrieves the session from Stripe, sees payment_status=paid,
    // then calls onSessionCompleted directly.  We replicate that call here.
    await onSessionCompleted(makeCompletedSession());

    expect(mockNotifyOrderCompleted).toHaveBeenCalledTimes(1);
    expect(mockSendOrderConfirmation).toHaveBeenCalledTimes(1);
  });

  it("fires neither when webhook already created the order (idempotency guard prevents double-notify)", async () => {
    // Precondition: webhook arrived first — orderExistsForSession returns true.
    const { orderExistsForSession } = await import("../../lib/orderUtils.js");
    vi.mocked(orderExistsForSession).mockResolvedValueOnce(true);

    await onSessionCompleted(makeCompletedSession());

    expect(mockNotifyOrderCompleted).not.toHaveBeenCalled();
    expect(mockSendOrderConfirmation).not.toHaveBeenCalled();
  });

  it("WhatsApp and email both reference the same order ID from session metadata", async () => {
    await onSessionCompleted(makeCompletedSession({ orderId: "KA-POLL-9999" }));

    const waArgs  = mockNotifyOrderCompleted.mock.calls[0][0] as Record<string, unknown>;
    const emlArgs = mockSendOrderConfirmation.mock.calls[0][0] as Record<string, unknown>;
    expect(waArgs.orderId).toBe("KA-POLL-9999");
    expect(emlArgs.orderId).toBe("KA-POLL-9999");
  });
});
