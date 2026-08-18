/**
 * Public voice-evaluation submission endpoint.
 * Called from voice-test.html when a visitor submits their audio sample.
 * Stores name + phone + audioRef (the KS-VC-XXXX code) into voice_evaluations
 * so the admin dashboard shows the entry immediately with status "pending".
 *
 * No authentication required — this is a public-facing form endpoint.
 * Basic in-memory IP rate limit: 3 submissions per IP per hour.
 */
import { Router } from "express";
import { db, voiceEvaluationsTable } from "@workspace/db";
import { logger } from "../lib/logger.js";

const router = Router();

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Lightweight in-memory store: ip → list of submission timestamps within the window.
// Uses req.ip (set by Express via `app.set("trust proxy", 1)`) — the value is
// determined by Replit's TLS-terminating proxy and cannot be spoofed by callers.
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  // Keep only timestamps inside the current window
  const hits = (rateLimitMap.get(ip) ?? []).filter((t) => t > cutoff);
  if (hits.length >= MAX_PER_WINDOW) {
    // Store the pruned list back (avoids unbounded growth for blocked IPs)
    rateLimitMap.set(ip, hits);
    return true;
  }
  hits.push(now);
  if (hits.length === 0) {
    rateLimitMap.delete(ip); // evict empty entries immediately
  } else {
    rateLimitMap.set(ip, hits);
  }
  // Periodic full eviction: remove IPs with no hits in the current window.
  // Bounded to run at most once per ~1 000 requests to keep overhead low.
  if (rateLimitMap.size > 500 && Math.random() < 0.002) {
    for (const [k, v] of rateLimitMap) {
      if (v.every((t) => t <= cutoff)) rateLimitMap.delete(k);
    }
  }
  return false;
}

// ── POST /voice-evaluation ────────────────────────────────────────────────────
router.post("/voice-evaluation", async (req, res) => {
  // req.ip is resolved by Express using app.set("trust proxy", 1) —
  // Replit's TLS proxy populates X-Forwarded-For and Express validates it;
  // callers cannot spoof this value.
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";

  if (isRateLimited(ip)) {
    res.status(429).json({ error: "حاول مرة أخرى بعد ساعة" });
    return;
  }

  const { name, phone, code, email, country, category } = req.body as {
    name?: string;
    phone?: string;
    code?: string;
    email?: string;
    country?: string;
    category?: string;
  };

  if (!name?.trim() || !phone?.trim()) {
    res.status(400).json({ error: "الاسم ورقم الواتساب مطلوبان" });
    return;
  }

  // audioRef stores the KS-VC-XXXX submission code so staff can cross-reference
  // the entry with the Google Sheet where the full audio is stored.
  const audioRef = code?.trim()
    ? code.trim() + (category ? ` · ${category}` : "") + (email ? ` · ${email}` : "")
    : null;

  const notes = [country, email].filter(Boolean).join(" · ") || null;

  try {
    const [created] = await db
      .insert(voiceEvaluationsTable)
      .values({
        name: name.trim(),
        phone: phone.trim(),
        audioRef,
        notes,
      })
      .returning({ id: voiceEvaluationsTable.id });

    logger.info({ id: created.id, name: name.trim() }, "voice-evaluation submitted");
    res.json({ ok: true, id: created.id });
  } catch (err) {
    logger.error({ err }, "voice-evaluation insert error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
