import { Router, type Request, type Response } from "express";
import { pool } from "../db.js";
import { toAmmanTime } from "../db.js";

const router = Router();

// ── Auth middleware ────────────────────────────────────────────────────────────
function requireAuth(req: Request, res: Response, next: () => void): void {
  if ((req.session as any).castingAdmin) {
    next();
    return;
  }
  res.redirect("/admin");
}

// ── Login page ─────────────────────────────────────────────────────────────────
router.get("/", (req: Request, res: Response) => {
  if ((req.session as any).castingAdmin) {
    res.redirect("/admin/dashboard");
    return;
  }
  res.send(loginPage());
});

router.post("/", (req: Request, res: Response) => {
  const pw = req.body.password || "";
  if (pw === process.env.ADMIN_PASSWORD) {
    (req.session as any).castingAdmin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.send(loginPage(true));
  }
});

// ── Logout ─────────────────────────────────────────────────────────────────────
router.get("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect("/admin"));
});

// ── Dashboard ──────────────────────────────────────────────────────────────────
router.get("/dashboard", requireAuth, async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, submitted_at, name, gender, age, country, city,
              whatsapp, email, script, home_studio, studio_rate,
              audio_filename, experience, portfolio, source, notes
       FROM casting.submissions
       ORDER BY id DESC
       LIMIT 500`
    );

    const countRow = await pool.query(`SELECT COUNT(*) FROM casting.submissions`);
    const total = parseInt(countRow.rows[0].count, 10);

    res.send(dashboardPage(rows, total));
  } catch (err) {
    console.error("[admin] dashboard error:", err);
    res.status(500).send("Database error");
  }
});

// ── Audio streaming ────────────────────────────────────────────────────────────
router.get("/audio/:id", requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).send("Invalid ID"); return; }

  try {
    const { rows } = await pool.query(
      `SELECT audio_data, audio_filename, audio_mime FROM casting.submissions WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) { res.status(404).send("Not found"); return; }

    const { audio_data, audio_filename, audio_mime } = rows[0];
    res.setHeader("Content-Type", audio_mime);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(audio_filename)}"`);
    res.send(Buffer.from(audio_data));
  } catch (err) {
    console.error("[admin] audio error:", err);
    res.status(500).send("Error");
  }
});

// ── CSV Export ─────────────────────────────────────────────────────────────────
router.get("/export.csv", requireAuth, async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, submitted_at, name, gender, age, country, city,
              whatsapp, email, script, home_studio, studio_rate,
              audio_filename, experience, portfolio, source, notes
       FROM casting.submissions ORDER BY id ASC`
    );

    const BOM = "\uFEFF";
    const headers = [
      "التاريخ","الاسم","الجنس","العمر","البلد","المدينة",
      "الواتساب","الإيميل","النص المختار","استوديو منزلي",
      "تقييم الاستوديو","ملف التسجيل","الخبرة السابقة",
      "رابط الأعمال","المصدر","الملاحظات","التقييم","الحالة",
    ];

    const lines: string[] = [headers.map(csvCell).join(",")];

    for (const r of rows) {
      const submittedAmman = toAmmanTime(new Date(r.submitted_at));
      lines.push([
        submittedAmman, r.name, r.gender, r.age, r.country, r.city,
        r.whatsapp, r.email, r.script, r.home_studio,
        r.studio_rate ?? "", r.audio_filename,
        r.experience, r.portfolio ?? "", r.source, r.notes ?? "",
        "", "", // التقييم، الحالة — يُعبّآن يدوياً
      ].map(csvCell).join(","));
    }

    const csv = BOM + lines.join("\r\n");
    const date = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv; charset=UTF-8");
    res.setHeader("Content-Disposition", `attachment; filename="casting-${date}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error("[admin] CSV error:", err);
    res.status(500).send("Error");
  }
});

function csvCell(v: string | number | null | undefined): string {
  const s = v == null ? "" : String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// ── HTML templates ─────────────────────────────────────────────────────────────
function loginPage(error = false): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>الإدارة — تجارب الأداء</title>
<style>
html{background:#232C3D;color-scheme:dark;min-height:100%}
body{margin:0;font-family:Tahoma,'Tajawal',sans-serif;background:#232C3D;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center}
.box{background:#2C374B;border:1px solid #465369;border-radius:12px;padding:36px;width:340px;max-width:90vw}
h2{margin:0 0 22px;font-size:20px;text-align:center}
input[type=password]{width:100%;background:#232C3D;color:#fff;border:1px solid #465369;border-radius:8px;padding:12px 14px;font-size:16px;box-sizing:border-box;margin-bottom:12px;font-family:inherit;direction:ltr}
input:focus{outline:none;border-color:#fff}
button{width:100%;background:#FFC107;color:#232C3D;border:none;border-radius:8px;padding:13px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit}
.err{color:#FF6B6B;font-size:13px;margin-bottom:10px;text-align:center}
</style>
</head>
<body>
<div class="box">
  <h2>🔐 لوحة الإدارة</h2>
  ${error ? '<div class="err">كلمة المرور غير صحيحة.</div>' : ""}
  <form method="POST" action="/admin">
    <input type="password" name="password" placeholder="كلمة المرور" autofocus autocomplete="current-password">
    <button type="submit">دخول</button>
  </form>
</div>
</body></html>`;
}

function dashboardPage(rows: any[], total: number): string {
  const byScript: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  for (const r of rows) {
    byScript[r.script] = (byScript[r.script] || 0) + 1;
    byCountry[r.country] = (byCountry[r.country] || 0) + 1;
  }
  const topCountry = Object.entries(byCountry).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const tableRows = rows.map(r => {
    const dt = toAmmanTime(new Date(r.submitted_at)).slice(0, 16);
    const gBadge = r.gender === "ذكر"
      ? `<span style="background:rgba(70,130,200,.2);color:#6db0ff;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700">ذكر</span>`
      : `<span style="background:rgba(200,100,150,.2);color:#f4a0c0;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700">أنثى</span>`;
    return `<tr>
      <td style="color:#B9C2D0;font-size:12px">${r.id}</td>
      <td style="font-size:11px;color:#B9C2D0;white-space:nowrap">${dt}</td>
      <td>${h(r.name)}</td>
      <td>${gBadge}</td>
      <td>${r.age}</td>
      <td>${h(r.country)}</td>
      <td dir="ltr" style="font-size:12px;text-align:left">${h(r.whatsapp)}</td>
      <td style="font-size:12px">${h(r.script)}</td>
      <td>${h(r.home_studio)}${r.studio_rate ? ` (${r.studio_rate})` : ""}</td>
      <td>${h(r.experience)}</td>
      <td>${h(r.source)}</td>
      <td><a href="/admin/audio/${r.id}" style="color:#FFC107;text-decoration:none;font-size:13px">🎵 تشغيل</a></td>
      <td style="font-size:11px;color:#B9C2D0;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h((r.notes || "").slice(0, 50))}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>لوحة الإدارة — تجارب الأداء</title>
<style>
html{background:#232C3D;color-scheme:dark;min-height:100%}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Tahoma,'Tajawal',sans-serif;background:#232C3D;color:#fff;min-height:100vh;padding-bottom:60px}
.topbar{background:#2C374B;border-bottom:1px solid #465369;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
.topbar h1{font-size:17px;font-weight:700}
.topbar a{color:#B9C2D0;font-size:13px;text-decoration:none}
.topbar a:hover{color:#fff}
.wrap{max-width:1300px;margin:0 auto;padding:22px 16px}
.stats{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:20px}
.stat{background:#2C374B;border:1px solid #465369;border-radius:10px;padding:16px 22px;flex:1;min-width:150px}
.stat .n{font-size:30px;font-weight:700;color:#FFC107;font-family:'Poppins',sans-serif}
.stat .l{font-size:13px;color:#B9C2D0;margin-top:3px}
.tools{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap}
.tools a{background:#2C374B;border:1px solid #465369;color:#fff;text-decoration:none;padding:8px 16px;border-radius:8px;font-size:13px}
.tools a:hover{border-color:#fff}
.tools a.gold{background:#FFC107;color:#232C3D;border-color:#FFC107;font-weight:700}
.tbl-wrap{overflow-x:auto;background:#2C374B;border:1px solid #465369;border-radius:10px}
table{width:100%;border-collapse:collapse;font-size:13px;min-width:900px}
th{background:#232C3D;padding:10px 12px;text-align:right;color:#B9C2D0;font-weight:600;border-bottom:1px solid #465369;white-space:nowrap}
td{padding:9px 12px;border-bottom:1px solid #1e2733;vertical-align:top}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.03)}
</style>
</head>
<body>
<div class="topbar">
  <h1>🎙️ تجارب الأداء — كاسيت ميديا</h1>
  <div style="display:flex;gap:16px;align-items:center">
    <a href="/admin/export.csv" style="color:#FFC107;font-weight:700">⬇️ تصدير CSV</a>
    <a href="/admin/logout">خروج</a>
  </div>
</div>
<div class="wrap">
  <div class="stats">
    <div class="stat"><div class="n">${total}</div><div class="l">إجمالي التقديمات</div></div>
    <div class="stat"><div class="n">${byScript["عُمَر المُختار"] || 0}</div><div class="l">عُمَر المُختار</div></div>
    <div class="stat"><div class="n">${byScript["المَلكة زَنوبيا"] || 0}</div><div class="l">المَلكة زَنوبيا</div></div>
    <div class="stat"><div class="n" style="font-size:18px">${h(topCountry)}</div><div class="l">أكثر بلد</div></div>
  </div>
  ${rows.length === 0
    ? `<div style="text-align:center;padding:48px;color:#B9C2D0">لا توجد تقديمات حتى الآن.</div>`
    : `<div class="tbl-wrap"><table>
    <thead><tr>
      <th>#</th><th>التاريخ</th><th>الاسم</th><th>الجنس</th><th>العمر</th><th>البلد</th>
      <th>الواتساب</th><th>النص</th><th>استوديو</th><th>خبرة</th><th>المصدر</th><th>التسجيل</th><th>ملاحظات</th>
    </tr></thead>
    <tbody>${tableRows}</tbody>
  </table></div>`}
</div>
</body></html>`;
}

function h(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export { router as adminRouter };
