/**
 * Discount code validation + application.
 * Codes live in the discount_codes table (managed from the admin panel).
 * - type 'percent': value = 0-100, applied to the course total
 * - type 'fixed':   value = amount in the course's pricing currency
 *                   (JOD for onsite courses, USD for live courses)
 */
import { pool } from "@workspace/db";

export interface ValidDiscount {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
  appliesTo: string; // 'all' | courseSlug
}

export type DiscountError =
  | "CODE_NOT_FOUND"
  | "CODE_INACTIVE"
  | "CODE_EXPIRED"
  | "CODE_EXHAUSTED"
  | "CODE_WRONG_COURSE";

/**
 * Validates a discount code for a given course.
 * Returns the discount row, or throws an Error whose message is a DiscountError.
 */
export async function validateDiscountCode(
  rawCode: string,
  courseSlug: string,
): Promise<ValidDiscount> {
  const code = rawCode.trim().toUpperCase();
  const { rows } = await pool.query(
    `SELECT id, code, type, value, applies_to, max_uses, used_count, expires_at, is_active
     FROM discount_codes WHERE code = $1`,
    [code],
  );
  if (!rows.length) throw new Error("CODE_NOT_FOUND");
  const d = rows[0];
  if (!d.is_active) throw new Error("CODE_INACTIVE");
  if (d.expires_at && new Date(d.expires_at) < new Date()) throw new Error("CODE_EXPIRED");
  if (d.max_uses != null && d.used_count >= d.max_uses) throw new Error("CODE_EXHAUSTED");
  if (d.applies_to !== "all" && d.applies_to !== courseSlug) throw new Error("CODE_WRONG_COURSE");
  return {
    id: d.id,
    code: d.code,
    type: d.type,
    value: parseFloat(d.value),
    appliesTo: d.applies_to,
  };
}

/** Applies a discount to a total; never returns less than 0. */
export function applyDiscount(total: number, d: ValidDiscount): number {
  const discounted =
    d.type === "percent" ? total * (1 - d.value / 100) : total - d.value;
  return Math.max(0, Math.round(discounted * 100) / 100);
}

/* ── Per-object discount reservations ───────────────────────
 * A checkout attempt CLAIMS one use before the discounted payment is issued.
 * Each claim is a row in discount_reservations keyed by orderId (carried in
 * Stripe metadata for both payment flows), with a state machine:
 *   reserved → completed  (payment succeeded)
 *   reserved → released   (expired / canceled / failed / swept)
 * All transitions are idempotent per orderId, so duplicate Stripe webhook
 * deliveries can never double-decrement the aggregate counter.
 */

/**
 * Atomically claim one use of a code for a specific checkout attempt.
 * The conditional UPDATE enforces the max-uses cap under concurrency;
 * the reservation row is written in the same transaction.
 * Returns true if claimed; false = cap reached (caller must reject).
 * Calling again with the same orderId while a live reservation exists
 * is a no-op success (client retry safety) — no double claim.
 */
export async function claimDiscountReservation(
  code: string,
  orderId: string,
  ttlMinutes = 45,
): Promise<boolean> {
  const normalized = code.trim().toUpperCase();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Retry with the same orderId: keep the existing live claim.
    const dup = await client.query(
      `SELECT status FROM discount_reservations WHERE order_id = $1`,
      [orderId],
    );
    if (dup.rows.length) {
      await client.query("ROLLBACK");
      return dup.rows[0].status === "reserved" || dup.rows[0].status === "completed";
    }

    const { rowCount } = await client.query(
      `UPDATE discount_codes
       SET used_count = used_count + 1, updated_at = NOW()
       WHERE code = $1 AND is_active = TRUE
         AND (max_uses IS NULL OR used_count < max_uses)`,
      [normalized],
    );
    if (!rowCount) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query(
      `INSERT INTO discount_reservations (order_id, code, status, expires_at)
       VALUES ($1, $2, 'reserved', NOW() + ($3 || ' minutes')::interval)`,
      [orderId, normalized, String(ttlMinutes)],
    );
    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Release a reservation (expired session, canceled/abandoned payment, or a
 * failure after the claim). Idempotent per orderId: only a row still in
 * 'reserved' transitions, and only that single transition decrements the
 * aggregate counter — duplicate webhook deliveries are safe.
 */
export async function releaseDiscountReservation(orderId: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `UPDATE discount_reservations
       SET status = 'released', updated_at = NOW()
       WHERE order_id = $1 AND status = 'reserved'
       RETURNING code`,
      [orderId],
    );
    if (rows.length) {
      await client.query(
        `UPDATE discount_codes
         SET used_count = GREATEST(used_count - 1, 0), updated_at = NOW()
         WHERE code = $1`,
        [rows[0].code],
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Mark a reservation as consumed after the order is confirmed paid.
 * Idempotent per orderId. If the reservation was already released (e.g. the
 * sweep expired it but the customer still completed payment), the use is
 * re-claimed conditionally; if the cap is now full, we keep the paid order
 * and just log — accounting stays bounded either way.
 */
export async function completeDiscountReservation(
  orderId: string,
  code: string,
): Promise<"completed" | "recovered" | "cap_exceeded"> {
  const normalized = code.trim().toUpperCase();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rowCount } = await client.query(
      `UPDATE discount_reservations
       SET status = 'completed', updated_at = NOW()
       WHERE order_id = $1 AND status = 'reserved'`,
      [orderId],
    );
    if (rowCount) { await client.query("COMMIT"); return "completed"; }

    // Already completed? (duplicate webhook) — nothing to do.
    const existing = await client.query(
      `SELECT status FROM discount_reservations WHERE order_id = $1`,
      [orderId],
    );
    if (existing.rows[0]?.status === "completed") {
      await client.query("COMMIT");
      return "completed";
    }

    // Released (or missing) but payment succeeded → try to re-claim the use.
    const reclaim = await client.query(
      `UPDATE discount_codes
       SET used_count = used_count + 1, updated_at = NOW()
       WHERE code = $1 AND (max_uses IS NULL OR used_count < max_uses)`,
      [normalized],
    );
    await client.query(
      `INSERT INTO discount_reservations (order_id, code, status, expires_at)
       VALUES ($1, $2, 'completed', NOW())
       ON CONFLICT (order_id) DO UPDATE SET status = 'completed', updated_at = NOW()`,
      [orderId, normalized],
    );
    await client.query("COMMIT");
    return reclaim.rowCount ? "recovered" : "cap_exceeded";
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Sweep: release reservations whose expiry passed without completion.
 * Covers abandoned Payment Element intents that never emit a cancel event.
 * Returns the number of reservations released.
 */
export async function sweepExpiredDiscountReservations(): Promise<number> {
  const { rows } = await pool.query(
    `SELECT order_id FROM discount_reservations
     WHERE status = 'reserved' AND expires_at < NOW()`,
  );
  for (const r of rows) {
    await releaseDiscountReservation(r.order_id);
  }
  return rows.length;
}

export const DISCOUNT_ERROR_AR: Record<DiscountError, string> = {
  CODE_NOT_FOUND:    "كود الخصم غير موجود",
  CODE_INACTIVE:     "كود الخصم غير مفعّل",
  CODE_EXPIRED:      "انتهت صلاحية كود الخصم",
  CODE_EXHAUSTED:    "استُنفدت مرات استخدام هذا الكود",
  CODE_WRONG_COURSE: "هذا الكود لا ينطبق على هذه الدورة",
};
