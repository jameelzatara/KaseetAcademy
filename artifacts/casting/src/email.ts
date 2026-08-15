interface SubmissionData {
  id: number;
  name: string;
  gender: string;
  age: number;
  country: string;
  city: string;
  whatsapp: string;
  email: string;
  script: string;
  homeStudio: string;
  studioRate: number | null;
  audioFilename: string;
  experience: string;
  portfolio: string;
  source: string;
  notes: string;
  submittedAt: string;
  adminAudioUrl: string;
}

export async function sendSubmissionEmail(d: SubmissionData): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "casting@kaseet.com";
  const senderEmail = process.env.SENDER_EMAIL || "notify@kaseet.com";

  if (!apiKey) {
    console.error("[email] BREVO_API_KEY not set — skipping email");
    return;
  }

  const subject = `تقديم جديد — ${d.name} — ${d.script}`;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8">
<style>
body{font-family:Tahoma,sans-serif;background:#f4f4f4;color:#222;direction:rtl;margin:0;padding:20px}
.wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12)}
.head{background:#232C3D;color:#FFC107;padding:20px 24px;font-size:20px;font-weight:bold}
.body{padding:24px}
table{width:100%;border-collapse:collapse}
td{padding:9px 12px;border-bottom:1px solid #eee;font-size:14px;vertical-align:top}
td:first-child{color:#666;width:38%;white-space:nowrap;font-weight:600}
.dl{margin-top:20px;background:#f9f9f9;border-radius:8px;padding:14px;border:1px solid #e0e0e0}
.dl a{color:#232C3D;font-weight:bold;word-break:break-all;font-size:13px}
.dl-label{font-weight:bold;margin-bottom:6px;color:#333}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">🎙️ تقديم جديد — كاسيت ميديا</div>
  <div class="body">
    <table>
      <tr><td>رقم التقديم</td><td><strong>#${d.id}</strong></td></tr>
      <tr><td>التاريخ (عمّان)</td><td>${d.submittedAt}</td></tr>
      <tr><td>الاسم</td><td>${esc(d.name)}</td></tr>
      <tr><td>الجنس</td><td>${esc(d.gender)}</td></tr>
      <tr><td>العمر</td><td>${d.age}</td></tr>
      <tr><td>البلد</td><td>${esc(d.country)}</td></tr>
      <tr><td>المدينة</td><td>${esc(d.city)}</td></tr>
      <tr><td>الواتساب</td><td dir="ltr" style="text-align:left">${esc(d.whatsapp)}</td></tr>
      <tr><td>البريد الإلكتروني</td><td dir="ltr" style="text-align:left">${esc(d.email)}</td></tr>
      <tr><td>النص المختار</td><td>${esc(d.script)}</td></tr>
      <tr><td>استوديو منزلي</td><td>${esc(d.homeStudio)}</td></tr>
      <tr><td>تقييم الاستوديو</td><td>${d.studioRate ?? "—"}</td></tr>
      <tr><td>خبرة سابقة</td><td>${esc(d.experience)}</td></tr>
      <tr><td>رابط أعمال</td><td dir="ltr" style="text-align:left">${d.portfolio ? `<a href="${esc(d.portfolio)}">${esc(d.portfolio)}</a>` : "—"}</td></tr>
      <tr><td>المصدر</td><td>${esc(d.source)}</td></tr>
      <tr><td>ملاحظات</td><td>${esc(d.notes) || "—"}</td></tr>
    </table>
    <div class="dl">
      <div class="dl-label">🎵 التسجيل الصوتي — ${esc(d.audioFilename)}</div>
      <a href="${d.adminAudioUrl}">اضغط هنا لتشغيل / تحميل التسجيل</a>
      <div style="font-size:11px;color:#999;margin-top:4px">يتطلب تسجيل الدخول للوحة الإدارة</div>
    </div>
  </div>
</div>
</body></html>`;

  const payload = JSON.stringify({
    sender: { name: "كاسيت ميديا", email: senderEmail },
    to: [{ email: adminEmail }],
    subject,
    htmlContent: html,
  });

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: payload,
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("[email] Brevo error:", res.status, txt);
    } else {
      console.log(`[email] Sent notification for submission #${d.id}`);
    }
  } catch (err) {
    console.error("[email] Network error:", err);
  }
}

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
