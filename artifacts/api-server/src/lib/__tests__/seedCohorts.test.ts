/**
 * Integration coverage for the legacy roster migration.
 * Runs against the development database, deliberately without mocks, so the
 * public schedule and checkout validation share the same seeded records.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { pool } from "@workspace/db";
import { ensureAdminSchema } from "../ensureSchema.js";
import { validateCohort } from "../pricing.js";
import { seedCohortsIfEmpty } from "../seedCohorts.js";

const SHORT_COURSE_COHORTS = [
  { id: 201, courseSlug: "public-speaking", mode: "onsite" as const },
  { id: 202, courseSlug: "presenter", mode: "onsite" as const },
  { id: 203, courseSlug: "arabic-language", mode: "live" as const },
];

beforeAll(async () => {
  await ensureAdminSchema();
  await seedCohortsIfEmpty();
});

describe("legacy short-course cohort backfill", () => {
  it("adds every static short-course cohort to the real schedule and seats tables", async () => {
    const { rows } = await pool.query<{
      id: number;
      course_slug: string;
      mode: "onsite" | "live";
      capacity: number;
      enrolled: number;
    }>(
      `SELECT c.id, c.course_slug, c.mode, s.capacity, s.enrolled
       FROM cohorts c
       JOIN cohort_seats s ON s.cohort_id = c.id
       WHERE c.id = ANY($1::int[])
       ORDER BY c.id`,
      [SHORT_COURSE_COHORTS.map((cohort) => cohort.id)],
    );

    expect(rows.map(({ id, course_slug, mode }) => ({ id, course_slug, mode }))).toEqual(
      SHORT_COURSE_COHORTS.map((cohort) => ({
        id: cohort.id,
        course_slug: cohort.courseSlug,
        mode: cohort.mode,
      })),
    );
    expect(rows.every((row) => row.capacity >= row.enrolled && row.enrolled >= 0)).toBe(true);
  });

  it("remains idempotent and accepts each seeded course/mode/cohort checkout combination", async () => {
    const before = await pool.query(
      `SELECT c.id, c.course_slug, c.mode, s.capacity, s.enrolled
       FROM cohorts c
       JOIN cohort_seats s ON s.cohort_id = c.id
       WHERE c.id = ANY($1::int[])
       ORDER BY c.id`,
      [SHORT_COURSE_COHORTS.map((cohort) => cohort.id)],
    );
    await seedCohortsIfEmpty();
    const after = await pool.query(
      `SELECT c.id, c.course_slug, c.mode, s.capacity, s.enrolled
       FROM cohorts c
       JOIN cohort_seats s ON s.cohort_id = c.id
       WHERE c.id = ANY($1::int[])
       ORDER BY c.id`,
      [SHORT_COURSE_COHORTS.map((cohort) => cohort.id)],
    );

    expect(after.rows).toEqual(before.rows);
    await Promise.all(
      SHORT_COURSE_COHORTS.map((cohort) =>
        expect(validateCohort(cohort.courseSlug, cohort.mode, cohort.id)).resolves.toBe(cohort.id),
      ),
    );
    await expect(validateCohort("presenter", "onsite", 201)).rejects.toThrow("COHORT_MISMATCH");
  });
});