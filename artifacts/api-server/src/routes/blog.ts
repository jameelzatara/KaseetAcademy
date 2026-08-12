/**
 * ⑩ نقطة نهاية lead magnet المدوّنة
 * POST /api/blog/lead-magnet
 * body: { name, phone, email, slug }
 *
 * يرسل الـPDF كمرفق بريدي → Resend
 * ⛔ فشل الإرسال لا يُرجع 5xx — يُسجَّل ويُعاد 200
 */
import { Router } from "express";
import path from "path";
import fs from "fs";
import { logger } from "../lib/logger.js";
import { sendEmail } from "../lib/email.js";
import { pool } from "@workspace/db";

const router = Router();

// خريطة slug ← اسم الملف في مجلد attached_assets
const PDF_MAP: Record<string, string> = {
  "khamat-sawt":    "دليل_سوق_التعليق_الصوتي_1786559999332.pdf",
  "makharij-huruf": "Kaseet_Makharij_Guide_1786559999332.pdf",
  "studio-manzili": "دليل_سوق_التعليق_الصوتي_1786559999332.pdf",   // نفس الملف كـfallback
  "khomul-nutq":    "دليل_كاسيت_علاج_خمول_النطق_1786559999333.pdf",
  "taswiq-sawti":   "KASEET_Marketing_Guide_1786559999332.pdf",
};

const BLOG_TITLES: Record<string, string> = {
  "khamat-sawt":    "دليل خامة الصوت وسوق التعليق",
  "makharij-huruf": "دليل مخارج الحروف العربية",
  "studio-manzili": "دليل بناء الاستوديو المنزلي",
  "khomul-nutq":    "دليل علاج خمول النطق",
  "taswiq-sawti":   "دليل التسويق الصوتي",
};

// مجلد الـPDFs (root/attached_assets)
const ASSETS_DIR = path.resolve(process.cwd(), "..", "..", "attached_assets");

// تأكّد من وجود جدول السجلّات
async function ensureLeadsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_leads (
      id          SERIAL PRIMARY KEY,
      slug        TEXT NOT NULL,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL,
      email       TEXT NOT NULL,
      sent        BOOLEAN DEFAULT false,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}
ensureLeadsTable().catch((e) => logger.warn({ e }, "blog_leads table init failed (non-fatal)"));

router.post("/blog/lead-magnet", async (req, res) => {
  const { name, phone, email, slug } = req.body ?? {};

  // ── التحقق الأساسي ──────────────────────────────────────
  if (!name || !phone || !email || !slug) {
    res.status(400).json({ error: "name, phone, email, slug مطلوبة" });
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({ error: "البريد الإلكتروني غير صحيح" });
    return;
  }
  if (!PDF_MAP[slug]) {
    res.status(400).json({ error: `slug غير معروف: ${slug}` });
    return;
  }

  // ── تسجيل العميل المحتمل ────────────────────────────────
  let leadId: number | null = null;
  try {
    const { rows } = await pool.query<{ id: number }>(
      `INSERT INTO blog_leads (slug, name, phone, email)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [slug, name, phone, email],
    );
    leadId = rows[0]?.id ?? null;
  } catch (err) {
    logger.warn({ err }, "Lead save failed (non-fatal)");
  }

  // ── إرسال البريد ────────────────────────────────────────
  const pdfFile  = PDF_MAP[slug];
  const pdfPath  = path.join(ASSETS_DIR, pdfFile);
  const blogTitle = BLOG_TITLES[slug] ?? slug;

  let attachment: { filename: string; content: string } | undefined;

  // ملفات PDF قد تكون كبيرة — نُرفق فقط إذا < 5MB
  try {
    const stat = fs.statSync(pdfPath);
    if (stat.size <= 5 * 1024 * 1024) {
      const buf = fs.readFileSync(pdfPath);
      attachment = {
        filename: `${blogTitle}.pdf`,
        content:  buf.toString("base64"),
      };
    }
  } catch {
    logger.warn({ pdfPath }, "PDF not found for attachment");
  }

  const subject = `دليلك المجاني: ${blogTitle} — كاسيت أكاديمي`;

  const html = `
<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"></head>
<body style="font-family:Tahoma,Arial,sans-serif;background:#f5f4f0;margin:0;padding:20px">
<div style="background:#fff;max-width:580px;margin:auto;border-radius:16px;overflow:hidden">
  <div style="background:#0D0B14;padding:28px;text-align:center">
    <h1 style="color:#FFC107;margin:0;font-size:20px">📥 دليلك وصل!</h1>
  </div>
  <div style="padding:28px">
    <p>مرحباً <strong>${name}</strong>،</p>
    <p>شكرًا لاهتمامك — ${attachment
      ? `ستجد الدليل <strong>${blogTitle}</strong> مرفقًا مع هذه الرسالة.`
      : `سيصلك دليل <strong>${blogTitle}</strong> بشكل منفصل خلال 24 ساعة.`}</p>
    <p>إذا كنت تريد الارتقاء بمهاراتك الصوتية خطوة أكبر، اكتشف برامجنا التدريبية:</p>
    <a href="https://kaseet.com/courses/voiceover"
       style="display:inline-block;background:#FFC107;color:#121927;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none;margin:12px 0">
      استكشف الدورات
    </a>
    <p style="margin-top:24px;font-size:13px;color:#9ca3af">
      أيّ استفسار؟ تواصل معنا على
      <a href="https://wa.me/962790234483" style="color:#FFC107">واتساب</a>
    </p>
  </div>
  <div style="background:#0D0B14;color:#aaa;text-align:center;padding:16px;font-size:12px">
    كاسيت أكاديمي · <a href="https://kaseet.com" style="color:#FFC107">kaseet.com</a>
  </div>
</div>
</body></html>`;

  const text = `مرحباً ${name}،\n\nدليل ${blogTitle} مرفق مع هذه الرسالة.\n\nاستكشف دوراتنا: https://kaseet.com/courses/voiceover\n`;

  const { Resend } = await import("resend");
  const key = process.env.RESEND_API_KEY;
  let sent = false;
  if (key) {
    const resend = new Resend(key);
    const verified = process.env.RESEND_DOMAIN_VERIFIED === "true";
    const from = verified
      ? "أكاديمية كاسيت <info@kaseet.com>"
      : "أكاديمية كاسيت <onboarding@resend.dev>";
    try {
      const payload: any = { from, to: email, subject, html, text, replyTo: "info@kaseet.com" };
      if (attachment) {
        payload.attachments = [{ filename: attachment.filename, content: attachment.content }];
      }
      const { error } = await resend.emails.send(payload);
      if (!error) {
        sent = true;
        if (leadId) {
          await pool.query("UPDATE blog_leads SET sent=true WHERE id=$1", [leadId]);
        }
      } else {
        logger.warn({ error }, "Lead magnet email failed");
      }
    } catch (err) {
      logger.warn({ err }, "Lead magnet send threw");
    }
  }

  res.json({ ok: true, sent });
});

export default router;
