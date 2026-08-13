/**
 * طبقة البريد الموحّدة — Gmail SMTP عبر Nodemailer
 * ⛔ كلّ إرسال يمرّ من هنا — لا استدعاء مباشر في أيّ مسار
 * ⛔ فشل البريد لا يُسقط طلباً مدفوعاً
 * ⛔ replyTo ثابت على info@kaseet.com
 *
 * متغيّرات البيئة المطلوبة:
 *   GMAIL_USER         — عنوان Gmail المُرسِل (مثل: info@kaseet.com أو kaseetacademy@gmail.com)
 *   GMAIL_APP_PASSWORD — كلمة مرور التطبيق المكوّنة من 16 حرفاً (Google App Password)
 */
import nodemailer from "nodemailer";
import { logger } from "./logger.js";
import { pool } from "@workspace/db";

// أنشئ جدول email_log تلقائيًا عند أول تشغيل
pool.query(`
  CREATE TABLE IF NOT EXISTS email_log (
    id          SERIAL PRIMARY KEY,
    to_address  TEXT NOT NULL,
    subject     TEXT NOT NULL,
    tag         TEXT,
    provider_id TEXT,
    status      TEXT NOT NULL,
    error       TEXT,
    sent_at     TIMESTAMPTZ DEFAULT NOW()
  )
`).catch(() => { /* non-fatal */ });

// ── Transporter (مُعاد استخدامه — لا ينشئ اتصالاً عند كل إرسال) ──
let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER أو GMAIL_APP_PASSWORD غير مضبوط في متغيّرات البيئة");
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return _transporter;
}

function fromAddress(): string {
  const user = process.env.GMAIL_USER ?? "";
  return `أكاديمية كاسيت <${user}>`;
}

// ── تسجيل داخلي (لا يُسقط الإرسال عند فشله) ──
async function logEmail(row: {
  to: string;
  subject: string;
  tag?: string;
  providerId?: string;
  status: "sent" | "failed" | "skipped";
  error?: string;
}) {
  try {
    await pool.query(
      `INSERT INTO email_log (to_address, subject, tag, provider_id, status, error, sent_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [row.to, row.subject, row.tag ?? null, row.providerId ?? null, row.status, row.error ?? null],
    );
  } catch {
    // سجلّ البريد غير حرج — لا نوقف الإرسال
  }
}

export interface SendEmailInput {
  to: string | undefined | null;
  subject: string;
  html: string;
  text: string;   // ⛔ إلزامي مع html — غيابه يرفع احتمال Spam
  tag?: string;   // نوع الرسالة: order_confirm | payment_received | …
  attachments?: Array<{ filename: string; content: string | Buffer; encoding?: string }>;
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<{ ok: boolean; id?: string; skipped?: string; error?: string }> {
  const { to, subject, html, text, tag } = input;

  // ① لا بريد = لا إرسال، بلا خطأ
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    logger.info({ to, subject }, "Email skipped: no valid address");
    await logEmail({ to: to ?? "(none)", subject, tag, status: "skipped" });
    return { ok: false, skipped: "no_email" };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from:        fromAddress(),
      to,
      subject,
      html,
      text,
      replyTo:     "info@kaseet.com",
      attachments: input.attachments?.map(a => ({
        filename: a.filename,
        content:  a.content,
        encoding: a.encoding ?? (typeof a.content === "string" ? "base64" : undefined),
      })),
    });

    const msgId = info.messageId ?? "";
    logger.info({ to, subject, tag, msgId }, "Email sent via Gmail SMTP");
    await logEmail({ to, subject, tag, providerId: msgId, status: "sent" });
    return { ok: true, id: msgId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ to, subject, tag, err }, "Email send failed");
    await logEmail({ to, subject, tag, status: "failed", error: msg });
    return { ok: false, error: msg };  // ⛔ لا يُسقط الطلب
  }
}

// ── قوالب الرسائل ────────────────────────────────────────────

export interface OrderEmailData {
  orderId: string;
  firstName: string;
  lastName: string;
  courseName: string;
  cohortDate: string;
  cohortDays: string;
  cohortTime: string;
  trainerName: string;
  mode: "onsite" | "live";
  platform: string;
  totalJOD: number;
  paidJOD: number;
  remainingJOD: number;
  plan: "full" | "deposit";
  chargedUSD: number;
  customerEmail?: string | null;
}

function modeLabel(mode: "onsite" | "live"): string {
  return mode === "onsite" ? "حضوري — استوديو كاسيت" : "مباشر تفاعلي (Online LIVE)";
}

// ① بريد تأكيد الطلب
export async function sendOrderConfirmation(data: OrderEmailData) {
  const subject = `تأكيد تسجيلك — ${data.courseName} (${data.orderId})`;
  const fxNotice = data.mode === "onsite"
    ? `<p style="font-size:13px;color:#555;margin:8px 0 0">
         سعر البرنامج: ${data.totalJOD} ديناراً أردنياً —
         يُحصَّل ما يعادل <strong>$${data.chargedUSD}</strong> بالدولار الأمريكي.
         قد يضيف بنكك عمولة تحويل عملة تتراوح بين 2% و3%.
       </p>`
    : "";

  const html = `
<!DOCTYPE html><html dir="rtl" lang="ar">
<head><meta charset="utf-8"><meta name="viewport" content="width=600">
<style>
  body{font-family:Tahoma,Arial,sans-serif;background:#f5f4f0;margin:0;padding:20px}
  .wrap{background:#fff;max-width:600px;margin:auto;border-radius:12px;overflow:hidden}
  .header{background:#0D0B14;padding:32px;text-align:center}
  .header h1{color:#FFC107;margin:0;font-size:22px}
  .body{padding:32px}
  .badge{background:#FFC107;color:#0D0B14;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:bold;display:inline-block;margin-bottom:20px}
  .remaining{background:#fff3cd;border:1px solid #FFC107;border-radius:8px;padding:14px;margin:20px 0;font-size:14px}
  .footer{background:#0D0B14;color:#aaa;text-align:center;padding:20px;font-size:12px}
  .footer a{color:#FFC107;text-decoration:none}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <h1>✅ تمّ تثبيت مقعدك</h1>
    <p style="color:#ccc;margin:8px 0 0;font-size:14px">${data.orderId}</p>
  </div>
  <div class="body">
    <p>مرحباً <strong>${data.firstName} ${data.lastName}</strong>،</p>
    <p>يسعدنا تأكيد تسجيلك في <strong>${data.courseName}</strong>.</p>

    <div class="badge">${modeLabel(data.mode)}</div>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">الدفعة</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.cohortDate}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">الأيام</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.cohortDays}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">الوقت</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.cohortTime}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">المدرّب/ة</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.trainerName}</td></tr>
      <tr><td style="padding:10px 0;color:#888;border-bottom:1px solid #eee">المكان/المنصة</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:left">${data.platform}</td></tr>
    </table>

    ${data.remainingJOD > 0 ? `
    <div class="remaining">
      💳 المدفوع: <strong>${data.paidJOD} ديناراً</strong> &nbsp;·&nbsp;
      المتبقّي: <strong>${data.remainingJOD} ديناراً</strong><br>
      <small style="color:#666">ستتواصل معك مستشارتك لترتيب الدفعات الباقية.</small>
    </div>
    ` : `<p style="color:#27ae60;font-weight:bold">✅ تمّ سداد المبلغ كاملاً — ${data.totalJOD} ديناراً</p>`}

    ${fxNotice}

    <p style="margin-top:24px">إن كان لديك أيّ استفسار، تواصل معنا على واتساب:
      <a href="https://wa.me/962790234483" style="color:#FFC107">+962 79 023 4483</a>
    </p>
    <p><a href="https://kaseet.com/refund-policy" style="color:#888;font-size:13px">سياسة الإلغاء والاسترداد</a></p>
  </div>
  <div class="footer">
    كاسيت أكاديمي · <a href="https://kaseet.com">kaseet.com</a><br>
    شارع باريس، مجمّع حجازي البيّر، عمّان
  </div>
</div>
</body></html>`;

  const text = `تأكيد التسجيل — ${data.courseName}
رقم الطلب: ${data.orderId}
الدفعة: ${data.cohortDate} · ${data.cohortDays} · ${data.cohortTime}
المدرّب/ة: ${data.trainerName}
المكان: ${data.platform}
المدفوع: ${data.paidJOD} ديناراً · المتبقّي: ${data.remainingJOD} ديناراً
سياسة الاسترداد: https://kaseet.com/refund-policy
`;

  return sendEmail({ to: data.customerEmail, subject, html, text, tag: "order_confirm" });
}
