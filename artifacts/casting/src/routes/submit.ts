import type { Request, Response } from "express";
import { pool, toAmmanTime } from "../db.js";
import { sendSubmissionEmail } from "../email.js";

const DEADLINE = new Date("2026-08-20T20:00:00+03:00");
const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED_EXTS = ["mp3", "wav"];
const ALLOWED_MIMES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/wave"];
const RATE_LIMIT = 3;

export async function submitHandler(req: Request, res: Response): Promise<void> {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    // 1. Server-side deadline check
    if (new Date() > DEADLINE) {
      res.status(403).json({ ok: false, error: "deadline" });
      return;
    }

    // 2. Honeypot
    if (req.body.website) {
      res.json({ ok: true }); // silent success for bots
      return;
    }

    // 3. Rate limiting
    const ip = (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown"
    );

    const rateSt = await pool.query(
      `SELECT COUNT(*) FROM casting.submissions WHERE ip = $1 AND submitted_at > NOW() - INTERVAL '1 hour'`,
      [ip]
    );
    if (parseInt(rateSt.rows[0].count, 10) >= RATE_LIMIT) {
      res.status(429).json({ ok: false, error: "rate_limit" });
      return;
    }

    // 4. Validate fields
    const b = req.body;
    const errors: string[] = [];

    const name      = (b.name      || "").trim();
    const gender    = (b.gender    || "").trim();
    const age       = parseInt(b.age || "0", 10);
    const country   = (b.country   || "").trim();
    const city      = (b.city      || "").trim();
    const whatsapp  = (b.whatsapp  || "").replace(/[\s()\-]/g, "");
    const email     = (b.email     || "").trim();
    const script    = (b.script    || "").trim();
    const homeStudio= (b.homeStudio|| "").trim();
    const studioRate= homeStudio === "نعم" ? Math.max(1, Math.min(10, parseInt(b.studioRate || "5", 10))) : null;
    const experience= (b.experience|| "").trim();
    const portfolio = (b.portfolio || "").trim();
    const source    = (b.source    || "").trim();
    const notes     = (b.notes     || "").trim();

    if (name.length < 3)                                               errors.push("name");
    if (!["ذكر","أنثى"].includes(gender))                              errors.push("gender");
    if (isNaN(age) || age < 16 || age > 70)                           errors.push("age");
    if (!country)                                                       errors.push("country");
    if (city.length < 2)                                               errors.push("city");
    if (!/^\+\d{8,15}$/.test(whatsapp))                               errors.push("whatsapp");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))                errors.push("email");
    if (!["عُمَر المُختار","المَلكة زَنوبيا"].includes(script))       errors.push("script");
    if (!["نعم","لا"].includes(homeStudio))                            errors.push("homeStudio");
    if (!["نعم","لا"].includes(experience))                            errors.push("experience");
    if (portfolio && !/^https?:\/\/.+\..+/.test(portfolio))           errors.push("portfolio");
    if (!source)                                                        errors.push("source");

    // 5. Validate file
    const file = req.file;
    if (!file) {
      errors.push("audio");
    } else {
      const ext  = file.originalname.split(".").pop()?.toLowerCase() || "";
      const mime = file.mimetype.toLowerCase();
      if (!ALLOWED_EXTS.includes(ext) || !ALLOWED_MIMES.includes(mime)) {
        errors.push("audio");
      } else if (file.size > MAX_BYTES || file.size === 0) {
        errors.push("audio");
      }
    }

    if (errors.length > 0) {
      res.status(422).json({ ok: false, errors });
      return;
    }

    // 6. Insert into database
    const now = new Date();
    const nowAmman = toAmmanTime(now);

    const result = await pool.query(
      `INSERT INTO casting.submissions
         (submitted_at, name, gender, age, country, city, whatsapp, email,
          script, home_studio, studio_rate, audio_filename, audio_mime, audio_data,
          experience, portfolio, source, notes, ip)
       VALUES
         (NOW(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING id`,
      [
        name, gender, age, country, city, whatsapp, email,
        script, homeStudio, studioRate,
        file!.originalname, file!.mimetype, file!.buffer,
        experience, portfolio || null, source, notes || null, ip,
      ]
    );

    const id: number = result.rows[0].id;
    const baseUrl = process.env.CASTING_BASE_URL || `http://localhost:${process.env.PORT || "3333"}`;
    const adminAudioUrl = `${baseUrl}/admin/audio/${id}`;

    // 7. Send email (non-blocking)
    sendSubmissionEmail({
      id, name, gender, age, country, city, whatsapp, email,
      script, homeStudio, studioRate,
      audioFilename: file!.originalname,
      experience, portfolio, source, notes,
      submittedAt: nowAmman,
      adminAudioUrl,
    }).catch(console.error);

    res.json({ ok: true, id });

  } catch (err) {
    console.error("[submit] Error:", err);
    res.status(500).json({ ok: false, error: "server_error" });
  }
}
