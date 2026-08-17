/**
 * CORS security regression tests for /api/admin/* endpoints.
 *
 * Verifies that credentialed cross-origin requests from untrusted origins
 * do NOT receive an Access-Control-Allow-Origin header, preventing browsers
 * from reading sensitive admin responses (email log, orders, KPI, etc.)
 * from a third-party page.
 */

import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// ── Mock all I/O so app.ts can be imported cleanly ────────────────────────

vi.mock("@workspace/db", () => ({
  db:                { select: vi.fn(), insert: vi.fn(), update: vi.fn() },
  pool:              { query: vi.fn().mockResolvedValue({ rows: [] }) },
  ordersTable:       {},
  holdsTable:        {},
  cohortSeatsTable:  {},
  installmentsTable: {},
}));

vi.mock("../../lib/stripeClient.js", () => ({
  getUncachableStripeClient: vi.fn().mockResolvedValue({}),
  getStripeSync:             vi.fn().mockResolvedValue({ processWebhook: vi.fn(), initSchema: vi.fn() }),
  verifyStripeWebhook:       vi.fn(),
}));

vi.mock("../../lib/orderUtils.js", () => ({
  createHold:            vi.fn(),
  setHoldSession:        vi.fn(),
  releaseHoldBySession:  vi.fn(),
  generateOrderId:       vi.fn(),
  orderExistsForSession: vi.fn(),
  getCohortSeats:        vi.fn(),
  createOrderWithSeat:   vi.fn(),
}));

vi.mock("../../lib/email.js",     () => ({ sendOrderConfirmation: vi.fn() }));
vi.mock("../../lib/whatsapp.js",  () => ({ notifyOrderCompleted: vi.fn() }));
vi.mock("../../lib/sheetsSync.js",() => ({ scheduleSheetsSync: vi.fn() }));

process.env.SESSION_SECRET = "test-secret-cors";
process.env.DATABASE_URL   = "postgresql://test:test@localhost/test";

import app from "../../app.js";

// ── Helpers ───────────────────────────────────────────────────────────────

/** Preflight OPTIONS for a credentialed cross-origin request */
function preflight(origin: string) {
  return request(app)
    .options("/api/admin/email-log")
    .set("Origin", origin)
    .set("Access-Control-Request-Method", "GET")
    .set("Access-Control-Request-Headers", "content-type");
}

/** Simple GET with an Origin header (simulates a browser cross-origin fetch) */
function crossOriginGet(origin: string) {
  return request(app)
    .get("/api/admin/email-log")
    .set("Origin", origin);
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("Admin CORS — untrusted origins are blocked", () => {

  it("does NOT echo an untrusted origin in ACAO header (simple request)", async () => {
    const res = await crossOriginGet("https://evil.example.com");
    expect(res.headers["access-control-allow-origin"]).not.toBe("https://evil.example.com");
    // header should be absent or 'false'
    expect(
      res.headers["access-control-allow-origin"] == null ||
      res.headers["access-control-allow-origin"] === "false"
    ).toBe(true);
  });

  it("does NOT echo an untrusted origin on preflight", async () => {
    const res = await preflight("https://attacker.io");
    expect(res.headers["access-control-allow-origin"]).not.toBe("https://attacker.io");
    expect(
      res.headers["access-control-allow-origin"] == null ||
      res.headers["access-control-allow-origin"] === "false"
    ).toBe(true);
  });

  it("does NOT allow a subdomain that merely contains 'replit.dev' in its path", async () => {
    // e.g. https://evil.com/replit.dev — the regex must not match path components
    const res = await crossOriginGet("https://evil.com/replit.dev");
    expect(res.headers["access-control-allow-origin"]).toBeFalsy();
  });
});

describe("Admin CORS — trusted Replit dev origins are allowed", () => {

  it("echoes a valid *.pike.replit.dev origin in ACAO header", async () => {
    const origin = "https://abc123-00-xyz.pike.replit.dev";
    const res = await crossOriginGet(origin);
    expect(res.headers["access-control-allow-origin"]).toBe(origin);
  });

  it("echoes a valid *.replit.dev origin in ACAO header", async () => {
    const origin = "https://my-repl.replit.dev";
    const res = await crossOriginGet(origin);
    expect(res.headers["access-control-allow-origin"]).toBe(origin);
  });

  it("echoes kaseet.com in ACAO header (production)", async () => {
    const origin = "https://kaseet.com";
    const res = await crossOriginGet(origin);
    expect(res.headers["access-control-allow-origin"]).toBe(origin);
  });

  it("echoes localhost:5173 in ACAO header (local dev)", async () => {
    const origin = "http://localhost:5173";
    const res = await crossOriginGet(origin);
    expect(res.headers["access-control-allow-origin"]).toBe(origin);
  });
});
