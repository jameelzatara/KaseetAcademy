/**
 * GET /api/rates — returns latest exchange rates (base: JOD).
 * Public endpoint — no auth required.
 * Stale flag is included so the client knows whether to show a warning.
 */
import { Router } from "express";
import { getLatestRates } from "../lib/ratesFetcher.js";

const router = Router();

router.get("/rates", async (_req, res) => {
  try {
    const { rates, fetchedAt, stale } = await getLatestRates(90);
    res.json({
      base: "JOD",
      rates,
      fetchedAt: fetchedAt?.toISOString() ?? null,
      stale,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load exchange rates" });
  }
});

export default router;
