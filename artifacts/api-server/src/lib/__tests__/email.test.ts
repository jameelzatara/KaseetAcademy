/**
 * Unit tests for lib/email.ts — sendEmail address validation and skip logic.
 * Resend is mocked so no real emails are sent.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock DB (email.ts runs pool.query at module init) ──────────────────────
vi.mock("@workspace/db", () => ({
  pool: { query: vi.fn().mockResolvedValue({ rows: [] }) },
}));

// ── Mock Resend via vi.hoisted so the factory can reference it ─────────────
// Must use a regular function (not arrow) so `new Resend(key)` works correctly.
const mockEmailsSend = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ data: { id: "re-unit-test-id" }, error: null }),
);
vi.mock("resend", () => ({
  // eslint-disable-next-line prefer-arrow-callback
  Resend: vi.fn(function MockResend(this: unknown) {
    return { emails: { send: mockEmailsSend } };
  }),
}));

import { sendEmail } from "../email.js";

describe("sendEmail — address validation", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_unit_dummy";
    mockEmailsSend.mockClear();
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    vi.clearAllMocks();
  });

  it("returns { ok: false, skipped: 'no_email' } and does NOT call Resend when address is null", async () => {
    const result = await sendEmail({ to: null, subject: "Test", html: "<p>Hi</p>", text: "Hi" });
    expect(result.ok).toBe(false);
    expect(result.skipped).toBe("no_email");
    expect(mockEmailsSend).not.toHaveBeenCalled();
  });

  it("returns { ok: false, skipped: 'no_email' } and does NOT call Resend when address is empty string", async () => {
    const result = await sendEmail({ to: "", subject: "Test", html: "<p>Hi</p>", text: "Hi" });
    expect(result.ok).toBe(false);
    expect(result.skipped).toBe("no_email");
    expect(mockEmailsSend).not.toHaveBeenCalled();
  });

  it("returns { ok: false, skipped: 'no_email' } and does NOT call Resend for a malformed address", async () => {
    const result = await sendEmail({ to: "not-an-email", subject: "Test", html: "<p>Hi</p>", text: "Hi" });
    expect(result.ok).toBe(false);
    expect(result.skipped).toBe("no_email");
    expect(mockEmailsSend).not.toHaveBeenCalled();
  });

  it("calls Resend and returns { ok: true, id } for a valid email address", async () => {
    const result = await sendEmail({
      to:      "buyer@example.com",
      subject: "تأكيد الطلب",
      html:    "<p>مرحبا</p>",
      text:    "مرحبا",
      tag:     "order_confirm",
    });
    expect(result.ok).toBe(true);
    expect(result.id).toBe("re-unit-test-id");
    expect(mockEmailsSend).toHaveBeenCalledTimes(1);
    const arg = mockEmailsSend.mock.calls[0][0] as Record<string, unknown>;
    expect(arg.to).toBe("buyer@example.com");
    expect(arg.subject).toBe("تأكيد الطلب");
  });

  it("returns { ok: false, error } and does NOT throw when Resend returns an error object", async () => {
    mockEmailsSend.mockResolvedValueOnce({ data: null, error: { message: "invalid_api_key" } });
    const result = await sendEmail({ to: "x@y.com", subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns { ok: false, error } and does NOT throw when Resend throws", async () => {
    mockEmailsSend.mockRejectedValueOnce(new Error("network timeout"));
    const result = await sendEmail({ to: "x@y.com", subject: "s", html: "<p>h</p>", text: "t" });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("network timeout");
  });
});
