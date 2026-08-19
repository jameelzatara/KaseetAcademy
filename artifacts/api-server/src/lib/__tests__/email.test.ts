/**
 * Unit tests for lib/email.ts — sendEmail address validation, skip logic,
 * and Brevo API error handling.
 *
 * global fetch is mocked so no real HTTP requests are made.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock DB (email.ts runs pool.query at module init) ──────────────────────
vi.mock("@workspace/db", () => ({
  pool: { query: vi.fn().mockResolvedValue({ rows: [] }) },
}));

// ── Mock global fetch (Brevo REST API) ────────────────────────────────────
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const mockGetStripe = vi.hoisted(() => vi.fn());
vi.mock("../stripeClient.js", () => ({
  getUncachableStripeClient: mockGetStripe,
}));

function makeBrevoOk(messageId = "brevo-test-id") {
  return Promise.resolve(
    new Response(JSON.stringify({ messageId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

function makeBrevoError(status: number, body: string) {
  return Promise.resolve(
    new Response(body, {
      status,
      statusText: `Error ${status}`,
    }),
  );
}

import { buildOrderConfirmationMessage, preparePdfText, sendEmail, sendOrderConfirmationForStoredOrder } from "../email.js";

describe("sendEmail — address validation", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "xkeysib-unit-test-dummy";
    mockFetch.mockClear();
  });

  afterEach(() => {
    delete process.env.BREVO_API_KEY;
    vi.clearAllMocks();
  });

  it("returns { ok: false, skipped } when to is undefined", async () => {
    const result = await sendEmail({ to: undefined, subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.skipped).toBe("no_email");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns { ok: false, skipped } when to is an empty string", async () => {
    const result = await sendEmail({ to: "", subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.skipped).toBe("no_email");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns { ok: false, skipped } when to is not a valid email address", async () => {
    const result = await sendEmail({ to: "not-an-email", subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.skipped).toBe("no_email");
  });

  it("returns { ok: true, id } and calls Brevo when address is valid", async () => {
    mockFetch.mockReturnValueOnce(makeBrevoOk("brevo-sent-001"));
    const result = await sendEmail({ to: "buyer@example.com", subject: "تأكيد الطلب", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(true);
    expect(result.id).toBe("brevo-sent-001");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, opts] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("brevo.com");
    const body = JSON.parse(opts.body as string) as Record<string, unknown>;
    expect((body.to as Array<{ email: string }>)[0].email).toBe("buyer@example.com");
    expect(body.subject).toBe("تأكيد الطلب");
  });
});

describe("sendEmail — Brevo API error handling", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "xkeysib-unit-test-dummy";
    mockFetch.mockClear();
  });

  afterEach(() => {
    delete process.env.BREVO_API_KEY;
    vi.clearAllMocks();
  });

  it("returns { ok: false, error } and does NOT throw when Brevo returns a non-2xx status", async () => {
    mockFetch.mockReturnValueOnce(makeBrevoError(401, "invalid_api_key"));
    const result = await sendEmail({ to: "x@y.com", subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns { ok: false, error } and does NOT throw when fetch throws (network error)", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network timeout"));
    const result = await sendEmail({ to: "x@y.com", subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("network timeout");
  });

  it("returns { ok: false, error } when BREVO_API_KEY is not set", async () => {
    delete process.env.BREVO_API_KEY;
    const result = await sendEmail({ to: "x@y.com", subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe("buildOrderConfirmationMessage — Arabic registration receipt", () => {
  const baseOrder = {
    orderId: "KS-ORD-2026-0001",
    firstName: "سارة",
    lastName: "النجار",
    courseName: "ماستركلاس التعليق والأداء الصوتي",
    cohortDate: "15 أيلول 2026",
    cohortDays: "الأحد والثلاثاء والخميس",
    cohortTime: "6:00 – 8:00 مساءً",
    trainerName: "يسار عبده",
    mode: "onsite" as const,
    platform: "استوديو كاسيت",
    totalJOD: 550,
    totalUSD: 0,
    paidJOD: 50,
    remainingJOD: 500,
    plan: "deposit" as const,
    chargedUSD: 71,
    customerEmail: "sara@example.com",
  };

  it("creates an explicit RTL receipt with the academy logo and a PDF summary", async () => {
    const message = await buildOrderConfirmationMessage(baseOrder);

    expect(message.subject).toContain("كاسيت أكاديمي");
    expect(message.html).toContain('<html dir="rtl" lang="ar">');
    expect(message.html).toContain("direction:rtl");
    expect(message.html).toContain('alt="كاسيت أكاديمي"');
    expect(message.html).toContain("تفاصيل الدفعة");
    expect(message.html).toContain("يسار عبده");
    expect(message.html).toContain("500 دينار أردني");
    expect(message.attachments).toHaveLength(1);
    expect(message.attachments?.[0].filename).toContain("ملخص-التسجيل");
    expect(Buffer.isBuffer(message.attachments?.[0].content)).toBe(true);
    expect((message.attachments?.[0].content as Buffer).subarray(0, 4).toString()).toBe("%PDF");
  });

  it("escapes customer-controlled values and describes live installments in USD", async () => {
    const message = await buildOrderConfirmationMessage({
      ...baseOrder,
      courseName: 'برنامج <script>alert("x")</script>',
      mode: "live",
      platform: "Google Meet",
      totalJOD: 0,
      totalUSD: 750,
      paidJOD: 0,
      remainingJOD: 0,
      plan: "deposit",
      chargedUSD: 70,
    });

    expect(message.html).not.toContain("<script>alert");
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.html).toContain("$750 USD");
    expect(message.html).toContain("$680 USD");
    expect(message.text).toContain("ستتواصل معك مستشارتك");
  });

  it("marks Arabic and Latin PDF runs with explicit Unicode directions", () => {
    expect(preparePdfText("تأكيد تسجيل", "rtl")).toBe("\u202Bتأكيد تسجيل\u202C");
    expect(preparePdfText("$70 USD", "ltr")).toBe("\u202A$70 USD\u202C");
  });
});

describe("sendOrderConfirmationForStoredOrder — original checkout snapshot", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "xkeysib-unit-test-dummy";
    mockFetch.mockClear();
    mockGetStripe.mockReset();
  });

  afterEach(() => {
    delete process.env.BREVO_API_KEY;
    vi.clearAllMocks();
  });

  it("restores the original Stripe schedule, plan, and financial details for an admin resend", async () => {
    mockGetStripe.mockResolvedValue({
      checkout: {
        sessions: {
          retrieve: vi.fn().mockResolvedValue({
            metadata: {
              courseSlug: "masar-soti",
              courseName: "ماستركلاس التعليق والأداء الصوتي",
              mode: "onsite",
              plan: "deposit",
              firstName: "سارة",
              lastName: "النجار",
              email: "snapshot@example.com",
              totalJOD: "550",
              totalUSD: "0",
              chargeUSD: "71",
              paidJOD: "50",
              remainingJOD: "500",
              cohortStartAr: "15 أيلول 2026",
              cohortDays: "الأحد والثلاثاء والخميس",
              cohortTimeAr: "6:00 – 8:00 مساءً",
              cohortTrainer: "يسار عبده",
              cohortPlatform: "استوديو كاسيت",
            },
          }),
        },
      },
      paymentIntents: { retrieve: vi.fn() },
    });
    mockFetch.mockReturnValueOnce(makeBrevoOk());

    const result = await sendOrderConfirmationForStoredOrder({
      id: "KS-ORD-2026-0001",
      stripeSessionId: "cs_snapshot",
      courseSlug: "changed-course",
      firstName: "اسم لاحق",
      lastName: "اسم لاحق",
      email: "changed@example.com",
      mode: "live",
      plan: "full",
      totalJOD: 1,
      totalUSD: 1,
      paidJOD: 1,
      remainingJOD: 0,
      chargedUsd: "1",
    });

    expect(result.ok).toBe(true);
    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(options.body as string) as { to: Array<{ email: string }>; htmlContent: string };
    expect(body.to[0].email).toBe("snapshot@example.com");
    expect(body.htmlContent).toContain("15 أيلول 2026");
    expect(body.htmlContent).toContain("يسار عبده");
    expect(body.htmlContent).toContain("500 دينار أردني");
    expect(body.htmlContent).toContain("ماستركلاس التعليق والأداء الصوتي");
  });
});
