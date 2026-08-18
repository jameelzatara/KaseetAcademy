/**
 * Unit tests for ratesFetcher.ts
 *
 * Covers: missing rows, fresh rows, stale rows, and maybeRefreshRates gating.
 * All DB access and fetch() calls are mocked.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock DB pool ────────────────────────────────────────────────────────────
const mockQuery = vi.fn();
vi.mock("@workspace/db", () => ({
  pool: { query: mockQuery },
}));

// ── Mock logger ─────────────────────────────────────────────────────────────
vi.mock("../logger.js", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Build a date that is `days` days ago */
function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/** Sample rates that the mock API would return */
const MOCK_API_RATES: Record<string, number> = {
  JOD: 1, USD: 1.41, SAR: 5.29, AED: 5.18, KWD: 0.43,
  QAR: 5.13, BHD: 0.53, OMR: 0.54, EGP: 68.5, IQD: 1845,
  LBP: 126500, SYP: 18200, MAD: 13.9, TND: 4.35, DZD: 189,
  LYD: 6.75, YER: 353, SDG: 870, EUR: 1.28, GBP: 1.10,
};

/** Build a mock fetch response for the open.er-api.com shape */
function mockApiFetch(ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 429,
    json: async () => ({ result: "success", rates: MOCK_API_RATES }),
    text: async () => "Error",
  });
}

// ── Import under test (after mocks) ────────────────────────────────────────
// Dynamic import ensures mocks are registered before module initialisation.
let getLatestRates: typeof import("../ratesFetcher.js").getLatestRates;
let maybeRefreshRates: typeof import("../ratesFetcher.js").maybeRefreshRates;
let fetchAndStoreRates: typeof import("../ratesFetcher.js").fetchAndStoreRates;

beforeEach(async () => {
  vi.resetModules();
  mockQuery.mockReset();
  const mod = await import("../ratesFetcher.js");
  getLatestRates = mod.getLatestRates;
  maybeRefreshRates = mod.maybeRefreshRates;
  fetchAndStoreRates = mod.fetchAndStoreRates;
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── getLatestRates ──────────────────────────────────────────────────────────

describe("getLatestRates", () => {
  it("returns fallback rates with stale:true when the table is empty", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }); // SELECT → 0 rows

    const result = await getLatestRates(90);

    expect(result.stale).toBe(true);
    expect(result.fetchedAt).toBeNull();
    // Fallback must include USD
    expect(result.rates["USD"]).toBeGreaterThan(0);
  });

  it("returns stored rates with stale:false when row is fresh (<90 days)", async () => {
    const freshDate = daysAgo(5); // 5 days old — well within 90-day threshold
    mockQuery.mockResolvedValueOnce({
      rows: [{ rates: MOCK_API_RATES, fetched_at: freshDate }],
    });

    const result = await getLatestRates(90);

    expect(result.stale).toBe(false);
    expect(result.fetchedAt).toEqual(freshDate);
    expect(result.rates["USD"]).toBe(MOCK_API_RATES["USD"]);
  });

  it("returns stored rates with stale:true when row is old (>90 days)", async () => {
    const oldDate = daysAgo(95); // 95 days old — past 90-day threshold
    mockQuery.mockResolvedValueOnce({
      rows: [{ rates: MOCK_API_RATES, fetched_at: oldDate }],
    });

    const result = await getLatestRates(90);

    expect(result.stale).toBe(true);
    expect(result.fetchedAt).toEqual(oldDate);
    // Still returns the stored rates (caller decides whether to refresh)
    expect(result.rates["USD"]).toBe(MOCK_API_RATES["USD"]);
  });

  it("returns fallback with stale:true when DB query throws", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB connection lost"));

    const result = await getLatestRates(90);

    expect(result.stale).toBe(true);
    expect(result.fetchedAt).toBeNull();
    expect(result.rates["USD"]).toBeGreaterThan(0);
  });
});

// ── fetchAndStoreRates ──────────────────────────────────────────────────────

describe("fetchAndStoreRates", () => {
  it("inserts fresh rates into DB on success and returns them", async () => {
    global.fetch = mockApiFetch() as unknown as typeof global.fetch;
    // INSERT query, DELETE pruning query
    mockQuery.mockResolvedValue({ rows: [] });

    const rates = await fetchAndStoreRates();

    expect(rates["USD"]).toBeDefined();
    expect(rates["JOD"]).toBe(1);
    // DB INSERT should have been called
    const calls = mockQuery.mock.calls;
    const insertCall = calls.find((c) => (c[0] as string).includes("INSERT INTO exchange_rates"));
    expect(insertCall).toBeDefined();
  });

  it("returns fallback rates when the API fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error")) as unknown as typeof global.fetch;

    const rates = await fetchAndStoreRates();

    // Should not throw — graceful fallback
    expect(rates["USD"]).toBeGreaterThan(0);
    // DB INSERT should NOT have been called
    const insertCall = mockQuery.mock.calls.find(
      (c) => (c[0] as string).includes("INSERT INTO exchange_rates"),
    );
    expect(insertCall).toBeUndefined();
  });

  it("deduplicates concurrent calls via in-flight lock", async () => {
    let resolveApi!: () => void;
    const apiPromise = new Promise<void>((res) => { resolveApi = res; });

    global.fetch = vi.fn().mockReturnValue(
      apiPromise.then(() => ({
        ok: true,
        json: async () => ({ result: "success", rates: MOCK_API_RATES }),
      })),
    ) as unknown as typeof global.fetch;
    mockQuery.mockResolvedValue({ rows: [] });

    // Fire three concurrent calls
    const [r1, r2, r3] = await Promise.all([
      fetchAndStoreRates(),
      fetchAndStoreRates(),
      fetchAndStoreRates(),
      resolveApi(),
    ].slice(0, 3) as [Promise<Record<string, number>>, Promise<Record<string, number>>, Promise<Record<string, number>>]);

    resolveApi();
    // All three should resolve (may return fallback before lock clears)
    expect(r1).toBeDefined();
    expect(r2).toBeDefined();
    expect(r3).toBeDefined();
    // fetch should have been called exactly once
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(1);
  });
});

// ── maybeRefreshRates ───────────────────────────────────────────────────────

describe("maybeRefreshRates", () => {
  it("does NOT fetch when rates are fresh (<90 days)", async () => {
    const freshDate = daysAgo(5);
    mockQuery.mockResolvedValueOnce({
      rows: [{ rates: MOCK_API_RATES, fetched_at: freshDate }],
    });
    const mockFetch = mockApiFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await maybeRefreshRates(90);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fetches when rates are stale (>90 days)", async () => {
    const oldDate = daysAgo(95);
    mockQuery.mockResolvedValueOnce({
      rows: [{ rates: MOCK_API_RATES, fetched_at: oldDate }],
    });
    mockQuery.mockResolvedValue({ rows: [] }); // INSERT + DELETE
    const mockFetch = mockApiFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await maybeRefreshRates(90);

    expect(mockFetch).toHaveBeenCalled();
  });

  it("fetches when no rates exist in DB", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }); // SELECT → empty
    mockQuery.mockResolvedValue({ rows: [] });      // INSERT + DELETE
    const mockFetch = mockApiFetch();
    global.fetch = mockFetch as unknown as typeof global.fetch;

    await maybeRefreshRates(90);

    expect(mockFetch).toHaveBeenCalled();
  });
});
