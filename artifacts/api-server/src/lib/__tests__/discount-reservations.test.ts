/**
 * Integration tests for the discount reservation lifecycle — real dev DB.
 * Covers: concurrent claims at the cap, retry idempotency, duplicate-webhook
 * release/complete idempotency, expiry sweep, and late-payment recovery.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { pool } from "@workspace/db";
import {
  claimDiscountReservation,
  releaseDiscountReservation,
  completeDiscountReservation,
  sweepExpiredDiscountReservations,
} from "../discounts.js";

const CODE = "TESTRSV1";

async function usedCount(): Promise<number> {
  const { rows } = await pool.query(`SELECT used_count FROM discount_codes WHERE code = $1`, [CODE]);
  return rows[0].used_count;
}

async function resetCode(maxUses: number | null) {
  await pool.query(`DELETE FROM discount_reservations WHERE code = $1`, [CODE]);
  await pool.query(`DELETE FROM discount_codes WHERE code = $1`, [CODE]);
  await pool.query(
    `INSERT INTO discount_codes (code, type, value, applies_to, max_uses, used_count, is_active, created_by)
     VALUES ($1, 'percent', 10, 'all', $2, 0, TRUE, 'test')`,
    [CODE, maxUses],
  );
}

beforeAll(async () => { await resetCode(1); });
afterAll(async () => {
  await pool.query(`DELETE FROM discount_reservations WHERE code = $1`, [CODE]);
  await pool.query(`DELETE FROM discount_codes WHERE code = $1`, [CODE]);
});

describe("discount reservation lifecycle", () => {
  it("concurrent claims: only max_uses claims succeed", async () => {
    await resetCode(1);
    const [a, b] = await Promise.all([
      claimDiscountReservation(CODE, "RSV-ORD-A"),
      claimDiscountReservation(CODE, "RSV-ORD-B"),
    ]);
    expect([a, b].filter(Boolean).length).toBe(1);
    expect(await usedCount()).toBe(1);
  });

  it("retry with the same orderId is a no-op success (no double claim)", async () => {
    await resetCode(2);
    expect(await claimDiscountReservation(CODE, "RSV-ORD-R")).toBe(true);
    expect(await claimDiscountReservation(CODE, "RSV-ORD-R")).toBe(true);
    expect(await usedCount()).toBe(1);
  });

  it("duplicate release (webhook retry) decrements only once", async () => {
    await resetCode(1);
    await claimDiscountReservation(CODE, "RSV-ORD-D");
    expect(await usedCount()).toBe(1);
    await releaseDiscountReservation("RSV-ORD-D");
    await releaseDiscountReservation("RSV-ORD-D"); // duplicate delivery
    expect(await usedCount()).toBe(0);
  });

  it("complete is idempotent and keeps the use counted", async () => {
    await resetCode(1);
    await claimDiscountReservation(CODE, "RSV-ORD-C");
    expect(await completeDiscountReservation("RSV-ORD-C", CODE)).toBe("completed");
    expect(await completeDiscountReservation("RSV-ORD-C", CODE)).toBe("completed"); // retry
    expect(await usedCount()).toBe(1);
    // release after completion must not decrement
    await releaseDiscountReservation("RSV-ORD-C");
    expect(await usedCount()).toBe(1);
  });

  it("sweep releases only expired reservations", async () => {
    await resetCode(2);
    await claimDiscountReservation(CODE, "RSV-ORD-E1", 30);
    await claimDiscountReservation(CODE, "RSV-ORD-E2", 30);
    // Force one to be expired
    await pool.query(
      `UPDATE discount_reservations SET expires_at = NOW() - interval '1 minute' WHERE order_id = 'RSV-ORD-E1'`,
    );
    await sweepExpiredDiscountReservations();
    expect(await usedCount()).toBe(1);
    const { rows } = await pool.query(
      `SELECT order_id, status FROM discount_reservations WHERE code = $1 ORDER BY order_id`, [CODE]);
    expect(rows.find((r) => r.order_id === "RSV-ORD-E1")?.status).toBe("released");
    expect(rows.find((r) => r.order_id === "RSV-ORD-E2")?.status).toBe("reserved");
  });

  it("late payment after expiry release re-claims the use (recovered)", async () => {
    await resetCode(1);
    await claimDiscountReservation(CODE, "RSV-ORD-L");
    await releaseDiscountReservation("RSV-ORD-L"); // swept/expired
    expect(await usedCount()).toBe(0);
    expect(await completeDiscountReservation("RSV-ORD-L", CODE)).toBe("recovered");
    expect(await usedCount()).toBe(1);
  });

  it("late payment past the cap is flagged, order accounting stays bounded", async () => {
    await resetCode(1);
    await claimDiscountReservation(CODE, "RSV-ORD-X1");
    await releaseDiscountReservation("RSV-ORD-X1");
    // Someone else takes the last use and completes it
    await claimDiscountReservation(CODE, "RSV-ORD-X2");
    await completeDiscountReservation("RSV-ORD-X2", CODE);
    // The released attempt still pays late — cap now full
    expect(await completeDiscountReservation("RSV-ORD-X1", CODE)).toBe("cap_exceeded");
    expect(await usedCount()).toBe(1); // never exceeds max_uses
  });
});
