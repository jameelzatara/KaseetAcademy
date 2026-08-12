import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendWhatsAppNotification, notifyOrderCompleted } from "../whatsapp.js";

// ── helpers ────────────────────────────────────────────────────────────────

/** Build a mock fetch that records calls and returns `ok: true` */
function makeFetch(ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    text: async () => (ok ? "OK" : "Error"),
  });
}

// ── sendWhatsAppNotification ───────────────────────────────────────────────

describe("sendWhatsAppNotification", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.WHATSAPP_RECIPIENTS;
  });

  it("skips silently when WHATSAPP_RECIPIENTS is not set", async () => {
    delete process.env.WHATSAPP_RECIPIENTS;
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await expect(sendWhatsAppNotification("hello")).resolves.toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("skips silently when WHATSAPP_RECIPIENTS is an empty string", async () => {
    process.env.WHATSAPP_RECIPIENTS = "  ";
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await sendWhatsAppNotification("hello");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls CallMeBot once per recipient with phone, apikey, and text", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:abc123,962799876543:def456";
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await sendWhatsAppNotification("test message");

    expect(mockFetch).toHaveBeenCalledTimes(2);

    const [firstUrl] = mockFetch.mock.calls[0] as [string];
    const parsed = new URL(firstUrl);
    expect(parsed.searchParams.get("phone")).toBe("962791234567");
    expect(parsed.searchParams.get("apikey")).toBe("abc123");
    expect(parsed.searchParams.get("text")).toBe("test message");
  });

  it("does not throw when CallMeBot returns an error status", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:abc123";
    global.fetch = makeFetch(false) as unknown as typeof global.fetch;

    const results = await sendWhatsAppNotification("msg");
    expect(results).toHaveLength(1);
    expect(results[0].ok).toBe(false);
    expect(results[0].error).toBeDefined();
  });

  it("does not throw when fetch rejects (network error)", async () => {
    process.env.WHATSAPP_RECIPIENTS = "962791234567:abc123";
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as unknown as typeof global.fetch;

    const results = await sendWhatsAppNotification("msg");
    expect(results).toHaveLength(1);
    expect(results[0].ok).toBe(false);
    expect(results[0].error).toContain("network");
  });
});

// ── notifyOrderCompleted ───────────────────────────────────────────────────

describe("notifyOrderCompleted", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    process.env.WHATSAPP_RECIPIENTS = "962791234567:testkey";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.WHATSAPP_RECIPIENTS;
  });

  const baseParams = {
    orderId: "KA-2026-0001",
    courseName: "أساسيات التعليق والأداء الصوتي",
    firstName: "أحمد",
    lastName: "الخالد",
    phone: "0791234567",
    plan: "full" as const,
    mode: "onsite" as const,
  };

  it("includes the order ID in the WhatsApp message", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted(baseParams);

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("KA-2026-0001");
  });

  it("includes the trainee full name in the WhatsApp message", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted(baseParams);

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("أحمد");
    expect(text).toContain("الخالد");
  });

  it("includes the trainee phone number in the WhatsApp message", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted(baseParams);

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("0791234567");
  });

  it("includes the course name in the WhatsApp message", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted(baseParams);

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("أساسيات التعليق والأداء الصوتي");
  });

  it("labels mode=onsite correctly as حضوري", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted({ ...baseParams, mode: "onsite" });

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("حضوري");
  });

  it("labels mode=live correctly as أونلاين LIVE", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted({ ...baseParams, mode: "live" });

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("أونلاين LIVE");
  });

  it("labels plan=full correctly as دفع كامل", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted({ ...baseParams, plan: "full" });

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("دفع كامل");
  });

  it("labels plan=deposit correctly as عربون", async () => {
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await notifyOrderCompleted({ ...baseParams, plan: "deposit" });

    const [url] = mockFetch.mock.calls[0] as [string];
    const text = new URL(url).searchParams.get("text") ?? "";
    expect(text).toContain("عربون");
  });

  it("skips notification (no fetch call) when WHATSAPP_RECIPIENTS is not set", async () => {
    delete process.env.WHATSAPP_RECIPIENTS;
    const mockFetch = makeFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    const results = await notifyOrderCompleted(baseParams);
    expect(results).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
