<?php
// ============================================================
// casting.kaseet.com — لوحة الإدارة
// الرابط: https://casting.kaseet.com/admin.php
// ============================================================
require_once __DIR__ . '/config.php';

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
session_start();

// ─────────────────────────────────────────────────────────────
// المصادقة
// ─────────────────────────────────────────────────────────────
$loggedIn = !empty($_SESSION['casting_admin']);

if (isset($_POST['password'])) {
    if ($_POST['password'] === ADMIN_PASSWORD) {
        session_regenerate_id(true);
        $_SESSION['casting_admin'] = true;
        $loggedIn = true;
    } else {
        $loginError = true;
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// ─────────────────────────────────────────────────────────────
// تصدير CSV
// ─────────────────────────────────────────────────────────────
if ($loggedIn && isset($_GET['export']) && $_GET['export'] === 'csv') {
    $pdo  = get_pdo();
    $rows = $pdo->query(
        "SELECT submitted_at, name, gender, age, country, city,
                whatsapp, email, script, home_studio, studio_rate,
                audio_url, experience, portfolio, source, notes
         FROM casting_submissions
         ORDER BY id ASC"
    )->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="casting-' . date('Y-m-d') . '.csv"');
    // BOM لفتح العربية بشكل صحيح في Excel
    echo "\xEF\xBB\xBF";

    $out = fopen('php://output', 'w');
    fputcsv($out, [
        'التاريخ','الاسم','الجنس','العمر','البلد','المدينة',
        'الواتساب','الإيميل','النص المختار','استوديو منزلي',
        'تقييم الاستوديو','رابط التسجيل','الخبرة السابقة',
        'رابط الأعمال','المصدر','الملاحظات','التقييم','الحالة'
    ]);

    foreach ($rows as $r) {
        fputcsv($out, [
            $r['submitted_at'],
            $r['name'],
            $r['gender'],
            $r['age'],
            $r['country'],
            $r['city'],
            $r['whatsapp'],
            $r['email'],
            $r['script'],
            $r['home_studio'],
            $r['studio_rate'] ?? '',
            $r['audio_url'],
            $r['experience'],
            $r['portfolio'] ?? '',
            $r['source'],
            $r['notes'] ?? '',
            '', // التقييم — يُعبَّأ يدوياً
            '', // الحالة  — تُعبَّأ يدوياً
        ]);
    }
    fclose($out);
    exit;
}

// ─────────────────────────────────────────────────────────────
// جلب البيانات للعرض
// ─────────────────────────────────────────────────────────────
$rows  = [];
$total = 0;
if ($loggedIn) {
    $pdo   = get_pdo();
    $total = (int)$pdo->query("SELECT COUNT(*) FROM casting_submissions")->fetchColumn();
    $rows  = $pdo->query(
        "SELECT * FROM casting_submissions ORDER BY id DESC LIMIT 200"
    )->fetchAll(PDO::FETCH_ASSOC);
}

function get_pdo(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
             PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    }
    return $pdo;
}

function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>لوحة الإدارة — تجارب الأداء</title>
<style>
:root{--navy:#232C3D;--card:#2C374B;--line:#465369;--gold:#FFC107;--white:#fff;--muted:#B9C2D0;--danger:#FF6B6B;--green:#4CAF50}
*{box-sizing:border-box;margin:0;padding:0}
html{color-scheme:dark;background:var(--navy);color:var(--white);font-family:Tahoma,'Tajawal',sans-serif}
body{min-height:100vh;padding:0 0 60px}
.topbar{background:var(--card);border-bottom:1px solid var(--line);padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
.topbar h1{font-size:18px;font-weight:700}
.topbar a{color:var(--muted);font-size:14px;text-decoration:none}
.topbar a:hover{color:var(--white)}
.wrap{max-width:1200px;margin:0 auto;padding:24px 20px}

/* تسجيل الدخول */
.login-box{max-width:360px;margin:80px auto;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:32px}
.login-box h2{margin-bottom:20px;font-size:20px}
.login-box input{width:100%;background:var(--navy);color:var(--white);border:1px solid var(--line);border-radius:8px;padding:12px 14px;font-size:16px;margin-bottom:12px;font-family:inherit}
.login-box input:focus{outline:none;border-color:var(--white)}
.login-box button{width:100%;background:var(--gold);color:var(--navy);border:none;border-radius:8px;padding:13px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit}
.err-msg{color:var(--danger);font-size:13px;margin-bottom:10px}

/* الإحصاءات */
.stats{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px 24px;flex:1;min-width:160px}
.stat .num{font-size:32px;font-weight:700;color:var(--gold);font-family:'Poppins',sans-serif}
.stat .lbl{font-size:14px;color:var(--muted);margin-top:4px}

/* أدوات */
.tools{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.tools a{background:var(--card);border:1px solid var(--line);color:var(--white);text-decoration:none;padding:9px 18px;border-radius:8px;font-size:14px;transition:border-color .15s}
.tools a:hover{border-color:var(--white)}
.tools a.gold{background:var(--gold);color:var(--navy);border-color:var(--gold);font-weight:700}

/* الجدول */
.tbl-wrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}
table{width:100%;border-collapse:collapse;font-size:13px;min-width:900px}
th{background:var(--navy);padding:11px 12px;text-align:right;color:var(--muted);font-weight:600;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:10px 12px;border-bottom:1px solid #1e2733;vertical-align:top;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.03)}
.id-col{color:var(--muted);font-family:'Poppins',sans-serif;font-size:12px}
.audio-link{color:var(--gold);text-decoration:none;font-size:12px}
.audio-link:hover{text-decoration:underline}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700}
.badge-m{background:rgba(70,130,200,.2);color:#6db0ff}
.badge-f{background:rgba(200,100,150,.2);color:#f4a0c0}

/* فارغ */
.empty{text-align:center;padding:48px 24px;color:var(--muted)}
</style>
</head>
<body>

<?php if (!$loggedIn): ?>
<!-- صفحة تسجيل الدخول -->
<div class="login-box">
  <h2>🔐 لوحة الإدارة</h2>
  <?php if (!empty($loginError)): ?>
    <div class="err-msg">كلمة المرور غير صحيحة.</div>
  <?php endif; ?>
  <form method="post">
    <input type="password" name="password" placeholder="كلمة المرور" autofocus>
    <button type="submit">دخول</button>
  </form>
</div>

<?php else: ?>
<!-- لوحة الإدارة -->
<div class="topbar">
  <h1>🎙️ تجارب الأداء الصوتية — لوحة الإدارة</h1>
  <a href="?logout=1">تسجيل الخروج</a>
</div>

<div class="wrap">

  <div class="stats">
    <div class="stat">
      <div class="num"><?= $total ?></div>
      <div class="lbl">إجمالي التقديمات</div>
    </div>
    <?php
      $byScript = [];
      $byCountry = [];
      foreach ($rows as $r) {
          $byScript[$r['script']] = ($byScript[$r['script']] ?? 0) + 1;
          $byCountry[$r['country']] = ($byCountry[$r['country']] ?? 0) + 1;
      }
      arsort($byCountry);
      $topCountry = key($byCountry);
    ?>
    <div class="stat">
      <div class="num"><?= $byScript['عُمَر المُختار'] ?? 0 ?></div>
      <div class="lbl">عُمَر المُختار</div>
    </div>
    <div class="stat">
      <div class="num"><?= $byScript['المَلكة زَنوبيا'] ?? 0 ?></div>
      <div class="lbl">المَلكة زَنوبيا</div>
    </div>
    <?php if ($topCountry): ?>
    <div class="stat">
      <div class="num" style="font-size:20px"><?= h($topCountry) ?></div>
      <div class="lbl">أكثر بلد</div>
    </div>
    <?php endif; ?>
  </div>

  <div class="tools">
    <a href="?export=csv" class="gold">⬇️ تصدير CSV</a>
    <a href="index.php" target="_blank">← الصفحة الرئيسية</a>
  </div>

  <?php if (empty($rows)): ?>
    <div class="empty">لا توجد تقديمات حتى الآن.</div>
  <?php else: ?>
  <div class="tbl-wrap">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>التاريخ</th>
          <th>الاسم</th>
          <th>الجنس</th>
          <th>العمر</th>
          <th>البلد</th>
          <th>الواتساب</th>
          <th>النص</th>
          <th>استوديو</th>
          <th>تقييم</th>
          <th>خبرة</th>
          <th>المصدر</th>
          <th>التسجيل</th>
          <th>ملاحظات</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $r): ?>
        <tr>
          <td class="id-col"><?= $r['id'] ?></td>
          <td style="font-size:11px;color:var(--muted)"><?= h(substr($r['submitted_at'], 0, 16)) ?></td>
          <td title="<?= h($r['email']) ?>"><?= h($r['name']) ?></td>
          <td>
            <span class="badge <?= $r['gender'] === 'ذكر' ? 'badge-m' : 'badge-f' ?>">
              <?= h($r['gender']) ?>
            </span>
          </td>
          <td><?= (int)$r['age'] ?></td>
          <td><?= h($r['country']) ?></td>
          <td dir="ltr" style="font-size:12px;text-align:left"><?= h($r['whatsapp']) ?></td>
          <td style="font-size:12px"><?= h($r['script']) ?></td>
          <td><?= h($r['home_studio']) ?><?= $r['studio_rate'] ? ' (' . $r['studio_rate'] . ')' : '' ?></td>
          <td><?= $r['studio_rate'] ?? '—' ?></td>
          <td><?= h($r['experience']) ?></td>
          <td><?= h($r['source']) ?></td>
          <td>
            <?php if ($r['audio_url']): ?>
              <a class="audio-link" href="<?= h($r['audio_url']) ?>" target="_blank">🎵 استمع</a>
            <?php endif; ?>
          </td>
          <td title="<?= h($r['notes'] ?? '') ?>" style="max-width:120px"><?= h(mb_substr($r['notes'] ?? '', 0, 40, 'UTF-8')) ?><?= mb_strlen($r['notes'] ?? '', 'UTF-8') > 40 ? '…' : '' ?></td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <?php endif; ?>

</div>
<?php endif; ?>

</body>
</html>
