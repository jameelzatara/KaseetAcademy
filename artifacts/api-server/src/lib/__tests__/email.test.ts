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

import { sendEmail } from "../email.js";

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
