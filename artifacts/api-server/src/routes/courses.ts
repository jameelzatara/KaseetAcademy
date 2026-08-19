/**
 * courses.ts — public (no-auth) course pricing endpoint.
 * Masterclass pages call GET /api/courses/:slug to read live prices
 * from the DB so admin edits reflect immediately without redeploy.
 */
import { Router } from "express";
import { pool } from "@workspace/db";

const router = Router();

// GET /api/courses — public list for the homepage course cards.
// Only 'active' courses are returned (drafts and archived courses stay hidden),
// ordered by display_order so admins control card sequence.
router.get("/courses", async (_req, res) => {
  try {
    const { rows } = await pool.query<{
      slug: string;
      name_ar: string;
      level: string;
      image_url: string | null;
      short_description: string | null;
      is_featured: boolean;
      display_order: number;
      onsite_enabled: boolean;
      onsite_price_jod: number | null;
      onsite_hours: number | null;
      onsite_sessions: number | null;
      live_enabled: boolean;
      live_price_usd: number | null;
      live_hours: number | null;
      live_sessions: number | null;
    }>(
      `SELECT slug, name_ar, level, image_url, short_description, is_featured, display_order,
              onsite_enabled, onsite_price_jod, onsite_hours, onsite_sessions,
              live_enabled, live_price_usd, live_hours, live_sessions
       FROM courses
       WHERE status = 'active'
       ORDER BY display_order ASC, id ASC`
    );
    res.json({
      courses: rows.map((r) => ({
        slug: r.slug,
        nameAr: r.name_ar,
        level: r.level,
        imageUrl: r.image_url,
        shortDescription: r.short_description,
        isFeatured: r.is_featured,
        displayOrder: r.display_order,
        onsiteEnabled: r.onsite_enabled,
        onsitePriceJOD: r.onsite_price_jod,
        onsiteHours: r.onsite_hours,
        onsiteSessions: r.onsite_sessions,
        liveEnabled: r.live_enabled,
        livePriceUSD: r.live_price_usd,
        liveHours: r.live_hours,
        liveSessions: r.live_sessions,
      })),
    });
  } catch (err) {
    console.error("[courses] DB error:", err);
    res.status(500).json({ error: "server error" });
  }
});

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
