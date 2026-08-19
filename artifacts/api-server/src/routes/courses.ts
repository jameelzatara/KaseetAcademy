/**
 * courses.ts — public (no-auth) course pricing endpoint.
 * Masterclass pages call GET /api/courses/:slug to read live prices
 * from the DB so admin edits reflect immediately without redeploy.
 */
import { Router } from "express";
import { pool } from "@workspace/db";

const router = Router();

router.get("/courses/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const { rows } = await pool.query<{
      slug: string;
      onsite_enabled: boolean;
      onsite_price_jod: number | null;
      live_enabled: boolean;
      live_price_usd: number | null;
    }>(
      `SELECT slug, onsite_enabled, onsite_price_jod, live_enabled, live_price_usd
       FROM courses
       WHERE slug = $1 AND status != 'archived'`,
      [slug]
    );
    if (!rows[0]) {
      res.status(404).json({ error: "not found" });
      return;
    }
    const r = rows[0];
    res.json({
      slug: r.slug,
      onsiteEnabled: r.onsite_enabled,
      onsitePriceJOD: r.onsite_price_jod,
      liveEnabled: r.live_enabled,
      livePriceUSD: r.live_price_usd,
    });
  } catch (err) {
    console.error("[courses] DB error:", err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
