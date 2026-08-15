<?php
// ============================================================
// casting.kaseet.com — صفحة تجارب الأداء الصوتية
// ============================================================
require_once __DIR__ . '/config.php';

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

// ─────────────────────────────────────────────────────────────
// معالجة POST (إرسال النموذج)
// ─────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    try {
        handle_submission();
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'server_error']);
    }
    exit;
}

// ─────────────────────────────────────────────────────────────
// الدوال المساعدة
// ─────────────────────────────────────────────────────────────
function handle_submission() {
    // 1. التحقق من الديدلاين
    $deadline = new DateTime(DEADLINE_ISO);
    $now      = new DateTime('now', new DateTimeZone('Asia/Amman'));
    if ($now > $deadline) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'deadline']);
        return;
    }

    // 2. Honeypot — حقل مخفي لمنع البوتات
    if (!empty($_POST['website'])) {
        // بوت — نتظاهر بالنجاح
        echo json_encode(['ok' => true]);
        return;
    }

    // 3. Rate limiting
    $ip  = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR'];
    $ip  = explode(',', $ip)[0];
    $pdo = get_pdo();
    $st  = $pdo->prepare(
        "SELECT COUNT(*) FROM casting_submissions
         WHERE ip = ? AND submitted_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)"
    );
    $st->execute([$ip]);
    if ((int)$st->fetchColumn() >= RATE_LIMIT_PER_HOUR) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'rate_limit']);
        return;
    }

    // 4. التحقق من الحقول
    $name       = trim($_POST['name']       ?? '');
    $gender     = trim($_POST['gender']     ?? '');
    $age        = intval($_POST['age']       ?? 0);
    $country    = trim($_POST['country']    ?? '');
    $city       = trim($_POST['city']       ?? '');
    $whatsapp   = preg_replace('/[\s()\-]/', '', $_POST['whatsapp'] ?? '');
    $email      = trim($_POST['email']      ?? '');
    $script     = trim($_POST['script']     ?? '');
    $homeStudio = trim($_POST['homeStudio'] ?? '');
    $studioRate = ($homeStudio === 'نعم')
        ? max(1, min(10, intval($_POST['studioRate'] ?? 5)))
        : null;
    $experience = trim($_POST['experience'] ?? '');
    $portfolio  = trim($_POST['portfolio']  ?? '');
    $source     = trim($_POST['source']     ?? '');
    $notes      = trim($_POST['notes']      ?? '');

    $errors = [];
    if (mb_strlen($name, 'UTF-8') < 3)                                   $errors[] = 'name';
    if (!in_array($gender, ['ذكر', 'أنثى'], true))                       $errors[] = 'gender';
    if ($age < 16 || $age > 70)                                           $errors[] = 'age';
    if (empty($country))                                                   $errors[] = 'country';
    if (mb_strlen($city, 'UTF-8') < 2)                                    $errors[] = 'city';
    if (!preg_match('/^\+\d{8,15}$/', $whatsapp))                         $errors[] = 'whatsapp';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))                        $errors[] = 'email';
    if (!in_array($script, ['عُمَر المُختار', 'المَلكة زَنوبيا'], true)) $errors[] = 'script';
    if (!in_array($homeStudio, ['نعم', 'لا'], true))                      $errors[] = 'homeStudio';
    if (!in_array($experience, ['نعم', 'لا'], true))                      $errors[] = 'experience';
    if ($portfolio !== '' && !preg_match('#^https?://.+\..+#i', $portfolio)) $errors[] = 'portfolio';
    if (empty($source))                                                    $errors[] = 'source';

    // 5. التحقق من الملف الصوتي
    $audioUrl = '';
    if (!isset($_FILES['audio']) || $_FILES['audio']['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'audio';
    } else {
        $f    = $_FILES['audio'];
        $ext  = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        $mime = strtolower($f['type']);
        $allowedExts  = ['mp3', 'wav'];
        $allowedMimes = ['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/wave','audio/vnd.wave'];

        if (!in_array($ext, $allowedExts, true) || !in_array($mime, $allowedMimes, true)) {
            $errors[] = 'audio';
        } elseif ($f['size'] > MAX_FILE_BYTES || $f['size'] === 0) {
            $errors[] = 'audio';
        } else {
            // رفع الملف باسم عشوائي
            if (!is_dir(UPLOAD_DIR)) {
                mkdir(UPLOAD_DIR, 0750, true);
            }
            $newName = bin2hex(random_bytes(16)) . '.' . $ext;
            $dest    = UPLOAD_DIR . $newName;
            if (!move_uploaded_file($f['tmp_name'], $dest)) {
                http_response_code(500);
                echo json_encode(['ok' => false, 'error' => 'upload_failed']);
                return;
            }
            $audioUrl = UPLOAD_URL . $newName;
        }
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'errors' => array_values($errors)]);
        return;
    }

    // 6. الحفظ في قاعدة البيانات
    $submittedAt = $now->format('Y-m-d H:i:s');
    $ins = $pdo->prepare(
        "INSERT INTO casting_submissions
           (submitted_at, name, gender, age, country, city, whatsapp, email,
            script, home_studio, studio_rate, audio_url,
            experience, portfolio, source, notes, ip)
         VALUES
           (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $ins->execute([
        $submittedAt, $name, $gender, $age, $country, $city,
        $whatsapp, $email, $script, $homeStudio, $studioRate,
        $audioUrl, $experience, $portfolio, $source, $notes, $ip
    ]);
    $id = (int)$pdo->lastInsertId();

    // 7. إرسال إيميل للإدارة
    send_notification(
        $id, $submittedAt, $name, $gender, $age, $country, $city,
        $whatsapp, $email, $script, $homeStudio, $studioRate,
        $audioUrl, $experience, $portfolio, $source, $notes
    );

    echo json_encode(['ok' => true, 'id' => $id]);
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

function send_notification(
    int    $id,
    string $submittedAt,
    string $name,
    string $gender,
    int    $age,
    string $country,
    string $city,
    string $whatsapp,
    string $email,
    string $script,
    string $homeStudio,
    ?int   $studioRate,
    string $audioUrl,
    string $experience,
    string $portfolio,
    string $source,
    string $notes
): void {
    $subject = "تقديم جديد — {$name} — {$script}";

    $body = <<<HTML
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><style>
body{font-family:Tahoma,sans-serif;background:#f4f4f4;color:#222;direction:rtl}
.wrap{max-width:600px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden}
.head{background:#232C3D;color:#FFC107;padding:20px 24px;font-size:20px;font-weight:bold}
.body{padding:24px}
table{width:100%;border-collapse:collapse}
td{padding:9px 12px;border-bottom:1px solid #eee;font-size:14px}
td:first-child{color:#666;width:38%;white-space:nowrap}
.audio{margin-top:20px;background:#f9f9f9;border-radius:8px;padding:14px}
.audio a{color:#232C3D;font-weight:bold;word-break:break-all}
</style></head>
<body>
<div class="wrap">
  <div class="head">🎙️ تقديم جديد — كاسيت ميديا</div>
  <div class="body">
    <table>
      <tr><td>رقم التقديم</td><td><strong>#{$id}</strong></td></tr>
      <tr><td>التاريخ</td><td>{$submittedAt} (عمّان)</td></tr>
      <tr><td>الاسم</td><td>{$name}</td></tr>
      <tr><td>الجنس</td><td>{$gender}</td></tr>
      <tr><td>العمر</td><td>{$age}</td></tr>
      <tr><td>البلد</td><td>{$country}</td></tr>
      <tr><td>المدينة</td><td>{$city}</td></tr>
      <tr><td>الواتساب</td><td dir="ltr">{$whatsapp}</td></tr>
      <tr><td>الإيميل</td><td dir="ltr">{$email}</td></tr>
      <tr><td>النص المختار</td><td>{$script}</td></tr>
      <tr><td>استوديو منزلي</td><td>{$homeStudio}</td></tr>
      <tr><td>تقييم الاستوديو</td><td>{$studioRate}</td></tr>
      <tr><td>خبرة سابقة</td><td>{$experience}</td></tr>
      <tr><td>رابط أعمال</td><td dir="ltr">{$portfolio}</td></tr>
      <tr><td>المصدر</td><td>{$source}</td></tr>
      <tr><td>ملاحظات</td><td>{$notes}</td></tr>
    </table>
    <div class="audio">
      🎵 <strong>التسجيل الصوتي:</strong><br>
      <a href="{$audioUrl}">{$audioUrl}</a>
    </div>
  </div>
</div>
</body></html>
HTML;

    $payload = json_encode([
        'sender'     => ['name' => SENDER_NAME, 'email' => SENDER_EMAIL],
        'to'         => [['email' => ADMIN_EMAIL]],
        'subject'    => $subject,
        'htmlContent'=> $body,
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'api-key: ' . BREVO_API_KEY,
            'content-type: application/json',
        ],
    ]);
    curl_exec($ch);
    curl_close($ch);
}
// ─────────────────────────────────────────────────────────────
// هل انتهى الديدلاين؟ (لإخفاء النموذج من الخادم)
// ─────────────────────────────────────────────────────────────
$isClosed = (new DateTime('now', new DateTimeZone('Asia/Amman')))
          > (new DateTime(DEADLINE_ISO));
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>تجارب أداء صوتية | كاسيت ميديا</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --navy:#2C374B;
  --navy-deep:#232C3D;
  --navy-soft:#36435A;
  --navy-line:#465369;
  --gold:#FFC107;
  --white:#FFFFFF;
  --muted:#B9C2D0;
  --danger:#FF6B6B;
  --radius:10px;
  --ar:'GE SS Two','Tajawal',system-ui,sans-serif;
  --lat:'Poppins',system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{
  scroll-behavior:smooth;
  background:#232C3D !important;
  color-scheme:dark;
  min-height:100%;
}
body{
  background:#232C3D !important;
  color:#FFFFFF !important;
  font-family:var(--ar);
  line-height:1.75;
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
}
/* الخلفية تُرسم على الحاوية نفسها — لا تعتمد على body إطلاقاً */
.page{
  background:#232C3D;
  min-height:100vh;
  padding-bottom:1px;
}
label,h1,h2,.hero p,.field > label,legend{color:#FFFFFF}
.hint,.err{color:inherit}
.num,input[type=number],input[type=tel],input[type=email],input[type=url]{font-family:var(--lat)}

/* ===== الغلاف ===== */
.wrap{max-width:720px;margin:0 auto;padding:0 20px 80px}

/* ===== الترويسة ===== */
.topbar{
  display:flex;justify-content:space-between;align-items:center;
  max-width:720px;margin:0 auto;padding:22px 20px;
}
.brand{font-family:var(--lat);font-weight:500;letter-spacing:.18em;font-size:14px}
.brand span{color:var(--muted)}
.site{font-family:var(--lat);font-size:14px;color:var(--muted)}

.hero{
  background:var(--navy);
  border:1px solid var(--navy-line);
  border-radius:var(--radius);
  padding:36px 26px 30px;
  margin-top:8px;
}
.hero h1{font-size:30px;font-weight:900;line-height:1.4;margin-bottom:14px}
.hero p{color:var(--muted);font-size:17px;max-width:52ch}
.hero .paid{color:var(--white);font-weight:700}

/* ===== عدّاد الديدلاين ===== */
.deadline{
  margin-top:22px;padding-top:20px;border-top:1px solid var(--navy-line);
}
.deadline .label{font-size:14px;color:var(--muted);margin-bottom:10px}
.clock{display:flex;gap:10px;flex-wrap:wrap}
.unit{
  background:var(--navy-deep);border:1px solid var(--navy-line);
  border-radius:8px;padding:8px 14px;min-width:74px;text-align:center;
}
.unit b{display:block;font-family:var(--lat);font-size:24px;font-weight:600;color:var(--gold);line-height:1.2}
.unit span{font-size:12px;color:var(--muted)}
.deadline .exact{margin-top:12px;font-size:14px;color:var(--muted)}

/* ===== الأقسام ===== */
.section{margin-top:34px}
.section-head{
  display:flex;align-items:baseline;gap:12px;
  padding-bottom:12px;margin-bottom:20px;border-bottom:1px solid var(--navy-line);
}
.section-head .idx{font-family:var(--lat);font-size:13px;color:var(--muted)}
.section-head h2{font-size:19px;font-weight:700}

/* ===== الحقول ===== */
.field{margin-bottom:22px}
.field > label{display:block;font-size:16px;font-weight:500;margin-bottom:9px}
.req{color:var(--gold);font-size:13px}
.hint{display:block;font-size:13px;color:var(--muted);font-weight:400;margin-top:3px}

input[type=text],input[type=number],input[type=tel],input[type=email],input[type=url],select,textarea{
  width:100%;background:var(--navy);color:var(--white);
  border:1px solid var(--navy-line);border-radius:8px;
  padding:13px 14px;font-size:16px;font-family:var(--ar);
  transition:border-color .18s;
}
select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);background-position:18px 21px,24px 21px;background-size:6px 6px,6px 6px;background-repeat:no-repeat;padding-left:40px}
textarea{min-height:100px;resize:vertical}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--white);box-shadow:0 0 0 3px rgba(255,255,255,.09)}
input::placeholder,textarea::placeholder{color:#7C889B}

/* اختيارات على شكل أزرار */
.choices{display:flex;flex-wrap:wrap;gap:10px}
.choices.grid2{display:grid;grid-template-columns:1fr 1fr}
.choice{position:relative}
.choice input{position:absolute;opacity:0;width:0;height:0}
.choice span{
  display:block;background:var(--navy);border:1px solid var(--navy-line);
  border-radius:8px;padding:12px 18px;font-size:15px;cursor:pointer;
  text-align:center;transition:all .18s;
}
.choice input:checked + span{background:var(--navy-soft);border-color:var(--white);font-weight:700}
.choice input:focus-visible + span{outline:2px solid var(--white);outline-offset:2px}

/* بطاقات النصوص */
.script{padding:16px 18px;text-align:right}
.script b{display:block;font-size:17px;margin-bottom:4px}
.script em{font-style:normal;font-size:13px;color:var(--muted)}
.choice input:checked + .script em{color:var(--white)}

/* السلايدر */
#studioRateWrap{display:none;margin-top:20px;padding:18px;background:var(--navy);border:1px solid var(--navy-line);border-radius:8px}
#studioRateWrap.on{display:block}
.rate-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.rate-val{font-family:var(--lat);font-size:28px;font-weight:600;color:var(--gold)}
input[type=range]{width:100%;-webkit-appearance:none;background:transparent;padding:0}
input[type=range]::-webkit-slider-runnable-track{height:5px;background:var(--navy-line);border-radius:3px}
input[type=range]::-moz-range-track{height:5px;background:var(--navy-line);border-radius:3px}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--white);margin-top:-10px;cursor:pointer;border:none}
input[type=range]::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:var(--white);cursor:pointer;border:none}
.scale{display:flex;justify-content:space-between;font-family:var(--lat);font-size:12px;color:var(--muted);margin-top:8px}

/* رفع الملف */
.drop{
  border:1.5px dashed var(--navy-line);border-radius:var(--radius);
  background:var(--navy);padding:34px 20px;text-align:center;cursor:pointer;
  transition:border-color .18s,background .18s;
}
.drop:hover,.drop.over{border-color:var(--white);background:var(--navy-soft)}
.drop .ico{font-size:30px;margin-bottom:8px}
.drop .t{font-size:16px;font-weight:500;margin-bottom:5px}
.drop .s{font-size:13px;color:var(--muted)}
.drop input{display:none}
.picked{display:none;align-items:center;justify-content:space-between;gap:12px;background:var(--navy);border:1px solid var(--white);border-radius:var(--radius);padding:15px 18px}
.picked.on{display:flex}
.picked .meta{text-align:right;overflow:hidden}
.picked .fname{font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.picked .fsize{font-family:var(--lat);font-size:13px;color:var(--muted)}
.picked button{background:none;border:none;color:var(--muted);font-family:var(--ar);font-size:14px;cursor:pointer;text-decoration:underline;flex-shrink:0}
.picked button:hover{color:var(--white)}

/* الأخطاء */
.err{display:none;color:var(--danger);font-size:13.5px;margin-top:7px}
.err.on{display:block}
.field.bad input,.field.bad select,.field.bad textarea,.field.bad .drop{border-color:var(--danger)}

/* الإرسال */
.submit-zone{margin-top:38px;padding-top:26px;border-top:1px solid var(--navy-line)}
.btn{
  width:100%;background:var(--gold);color:var(--navy-deep);
  border:none;border-radius:8px;padding:17px;
  font-family:var(--ar);font-size:18px;font-weight:700;cursor:pointer;
  transition:filter .18s;
}
.btn:hover{filter:brightness(1.08)}
.btn:disabled{opacity:.55;cursor:not-allowed}
.btn:focus-visible{outline:3px solid var(--white);outline-offset:3px}
.consent{margin-top:14px;font-size:13px;color:var(--muted);text-align:center;line-height:1.7}

/* النجاح */
.done{display:none;text-align:center;padding:56px 24px;background:var(--navy);border:1px solid var(--navy-line);border-radius:var(--radius);margin-top:8px}
.done.on{display:block}
.done .mark{font-size:44px;margin-bottom:16px}
.done h2{font-size:24px;font-weight:900;margin-bottom:14px}
.done p{color:var(--muted);max-width:44ch;margin:0 auto 10px}

/* الإغلاق */
.closed{display:none;text-align:center;padding:56px 24px;background:var(--navy);border:1px solid var(--navy-line);border-radius:var(--radius);margin-top:8px}
.closed.on{display:block}
.closed h2{font-size:23px;font-weight:900;margin-bottom:12px}
.closed p{color:var(--muted)}

/* Honeypot — مخفي عن المستخدم */
.hp{position:absolute;left:-9999px;opacity:0;pointer-events:none;tab-index:-1}

footer{text-align:center;padding:34px 20px;color:var(--muted);font-size:13px;border-top:1px solid var(--navy-line);margin-top:20px}
footer .lat{font-family:var(--lat)}

@media(max-width:560px){
  .hero{padding:28px 20px}
  .hero h1{font-size:25px}
  .choices.grid2{grid-template-columns:1fr}
  .unit{min-width:66px;padding:7px 11px}
  .unit b{font-size:21px}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
</head>
<body>

<div class="page">

<div class="topbar">
  <div class="brand">KASEET <span>MEDIA</span></div>
  <div class="site">kaseet.com</div>
</div>

<div class="wrap">

  <!-- الغلاف -->
  <section class="hero" id="hero" <?= $isClosed ? 'style="display:none"' : '' ?>>
    <h1>تجارب أداء صوتية<br>مشروع تاريخي ملحمي</h1>
    <p>نبحث عن أصوات ذكورية وأنثوية استثنائية؛ لتجسيد أعظم شخصيات التاريخ. <span class="paid">الأدوار مدفوعة الأجر.</span></p>

    <div class="deadline">
      <div class="label">يغلق الاستلام بعد</div>
      <div class="clock" id="clock">
        <div class="unit"><b id="dd">—</b><span>يوم</span></div>
        <div class="unit"><b id="hh">—</b><span>ساعة</span></div>
        <div class="unit"><b id="mm">—</b><span>دقيقة</span></div>
        <div class="unit"><b id="ss">—</b><span>ثانية</span></div>
      </div>
      <div class="exact">الخميس <span class="num">20</span> آب <span class="num">2026</span> — <span class="num">8:00</span> مساءً بتوقيت عمّان</div>
    </div>
  </section>

  <!-- رسالة الإغلاق -->
  <section class="closed" id="closed" <?= $isClosed ? 'class="closed on"' : '' ?>>
    <h2>انتهت فترة استقبال التجارب</h2>
    <p>شكراً لكل من شارك. تابعونا على <span class="num">@kaseetmedia</span> لفرص قادمة.</p>
  </section>

  <!-- النموذج -->
  <form id="form" novalidate <?= $isClosed ? 'style="display:none"' : '' ?>>

    <!-- Honeypot مخفي لمنع البوتات -->
    <div class="hp" aria-hidden="true">
      <label for="website">اتركه فارغاً</label>
      <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
    </div>

    <!-- 1 -->
    <div class="section">
      <div class="section-head"><span class="idx">01</span><h2>بياناتك</h2></div>

      <div class="field" data-f="name">
        <label for="name">الاسم الكامل <span class="req">*</span></label>
        <input type="text" id="name" name="name" placeholder="الاسم كما تريده أن يظهر في التتر" autocomplete="name">
        <div class="err">اكتب اسمك الكامل.</div>
      </div>

      <div class="field" data-f="gender">
        <label>الجنس <span class="req">*</span></label>
        <div class="choices grid2">
          <label class="choice"><input type="radio" name="gender" value="ذكر"><span>ذكر</span></label>
          <label class="choice"><input type="radio" name="gender" value="أنثى"><span>أنثى</span></label>
        </div>
        <div class="err">اختر الجنس.</div>
      </div>

      <div class="field" data-f="age">
        <label for="age">العمر <span class="req">*</span></label>
        <input type="number" id="age" name="age" min="16" max="70" placeholder="18">
        <div class="err">أدخل عمراً بين 16 و 70.</div>
      </div>

      <div class="field" data-f="country">
        <label for="country">بلد الإقامة <span class="req">*</span></label>
        <select id="country" name="country">
          <option value="">— اختر البلد —</option>
          <option value="الأردن" selected>الأردن</option>
          <option value="الإمارات">الإمارات</option>
          <option value="السعودية">السعودية</option>
          <option value="فلسطين">فلسطين</option>
          <option value="مصر">مصر</option>
          <option value="لبنان">لبنان</option>
          <option value="سوريا">سوريا</option>
          <option value="العراق">العراق</option>
          <option value="الكويت">الكويت</option>
          <option value="قطر">قطر</option>
          <option value="البحرين">البحرين</option>
          <option value="عُمان">عُمان</option>
          <option value="اليمن">اليمن</option>
          <option value="ليبيا">ليبيا</option>
          <option value="تونس">تونس</option>
          <option value="الجزائر">الجزائر</option>
          <option value="المغرب">المغرب</option>
          <option value="السودان">السودان</option>
          <option value="موريتانيا">موريتانيا</option>
          <option value="الصومال">الصومال</option>
          <option value="جيبوتي">جيبوتي</option>
          <option value="جزر القمر">جزر القمر</option>
          <option value="تركيا">تركيا</option>
          <option value="ألمانيا">ألمانيا</option>
          <option value="بريطانيا">بريطانيا</option>
          <option value="فرنسا">فرنسا</option>
          <option value="السويد">السويد</option>
          <option value="كندا">كندا</option>
          <option value="الولايات المتحدة">الولايات المتحدة</option>
          <option value="أخرى">دولة أخرى</option>
        </select>
        <div class="err">اختر بلد الإقامة.</div>
      </div>

      <div class="field" data-f="city">
        <label for="city">المدينة <span class="req">*</span></label>
        <input type="text" id="city" name="city" placeholder="عمّان">
        <div class="err">اكتب اسم المدينة.</div>
      </div>

      <div class="field" data-f="whatsapp">
        <label for="whatsapp">رقم الواتساب <span class="req">*</span>
          <span class="hint">بالصيغة الدولية مع رمز الدولة — مثال: 962791234567+</span>
        </label>
        <input type="tel" id="whatsapp" name="whatsapp" placeholder="+962 7X XXX XXXX" dir="ltr" style="text-align:left">
        <div class="err">أدخل رقماً بالصيغة الدولية، يبدأ بـ + ويتبعه 8 أرقام على الأقل.</div>
      </div>

      <div class="field" data-f="email">
        <label for="email">البريد الإلكتروني <span class="req">*</span></label>
        <input type="email" id="email" name="email" placeholder="name@example.com" dir="ltr" style="text-align:left" autocomplete="email">
        <div class="err">أدخل بريداً إلكترونياً صحيحاً.</div>
      </div>
    </div>

    <!-- 2 -->
    <div class="section">
      <div class="section-head"><span class="idx">02</span><h2>النص الذي اخترته</h2></div>

      <div class="field" data-f="script">
        <label>اختر النص الأقرب لطبقة صوتك <span class="req">*</span></label>
        <div class="choices grid2">
          <label class="choice"><input type="radio" name="script" value="عُمَر المُختار"><span class="script"><b>عُمَر المُختار</b><em>صوت ذكوري — نبرة وقور وخطابية</em></span></label>
          <label class="choice"><input type="radio" name="script" value="المَلكة زَنوبيا"><span class="script"><b>المَلكة زَنوبيا</b><em>صوت أنثوي — نبرة آمرة وحماسية</em></span></label>
        </div>
        <div class="err">اختر أحد النصين.</div>
      </div>
    </div>

    <!-- 3 -->
    <div class="section">
      <div class="section-head"><span class="idx">03</span><h2>بيئة التسجيل لديك</h2></div>

      <div class="field" data-f="homeStudio">
        <label>هل تملك استوديو أو ركن تسجيل في المنزل؟ <span class="req">*</span></label>
        <div class="choices grid2">
          <label class="choice"><input type="radio" name="homeStudio" value="نعم"><span>نعم</span></label>
          <label class="choice"><input type="radio" name="homeStudio" value="لا"><span>لا</span></label>
        </div>
        <div class="err">اختر إجابة.</div>

        <div id="studioRateWrap">
          <div class="rate-top">
            <label for="studioRate" style="margin:0;font-size:15px">كم تقيّم استوديو المنزل لديك؟</label>
            <span class="rate-val num" id="rateVal">5</span>
          </div>
          <input type="range" id="studioRate" name="studioRate" min="1" max="10" step="1" value="5">
          <div class="scale"><span>1</span><span>10</span></div>
        </div>
      </div>
    </div>

    <!-- 4 -->
    <div class="section">
      <div class="section-head"><span class="idx">04</span><h2>تسجيلك</h2></div>

      <div class="field" data-f="audio">
        <label>ارفع تجربتك الصوتية <span class="req">*</span>
          <span class="hint">MP3 أو WAV — بحد أقصى 25 ميغابايت. صوت نظيف، بدون موسيقى أو مؤثرات.</span>
        </label>
        <label class="drop" id="drop">
          <div class="ico">🎙️</div>
          <div class="t">اضغط لاختيار الملف أو اسحبه إلى هنا</div>
          <div class="s num">MP3 / WAV · 25MB</div>
          <input type="file" id="audio" name="audio" accept=".mp3,.wav,audio/mpeg,audio/wav,audio/x-wav">
        </label>
        <div class="picked" id="picked">
          <div class="meta"><div class="fname" id="fname"></div><div class="fsize num" id="fsize"></div></div>
          <button type="button" id="clearFile">إزالة</button>
        </div>
        <div class="err">ارفع ملفاً بصيغة MP3 أو WAV لا يتجاوز 25 ميغابايت.</div>
      </div>

      <div class="field" data-f="experience">
        <label>هل لديك خبرة سابقة في التعليق الصوتي؟ <span class="req">*</span></label>
        <div class="choices grid2">
          <label class="choice"><input type="radio" name="experience" value="نعم"><span>نعم</span></label>
          <label class="choice"><input type="radio" name="experience" value="لا"><span>لا</span></label>
        </div>
        <div class="err">اختر إجابة.</div>
      </div>

      <div class="field" data-f="portfolio">
        <label for="portfolio">رابط أعمال سابقة <span class="hint">اختياري — ساوندكلاود، درايف، يوتيوب، أو أي رابط</span></label>
        <input type="url" id="portfolio" name="portfolio" placeholder="https://" dir="ltr" style="text-align:left">
        <div class="err">الرابط غير صحيح. ابدأه بـ https://</div>
      </div>
    </div>

    <!-- 5 -->
    <div class="section">
      <div class="section-head"><span class="idx">05</span><h2>أخيراً</h2></div>

      <div class="field" data-f="source">
        <label for="source">كيف عرفت عن الإعلان؟ <span class="req">*</span></label>
        <select id="source" name="source">
          <option value="">— اختر —</option>
          <option value="إنستغرام">إنستغرام</option>
          <option value="تيك توك">تيك توك</option>
          <option value="يوتيوب">يوتيوب</option>
          <option value="لينكدإن">لينكدإن</option>
          <option value="فيسبوك">فيسبوك</option>
          <option value="صديق">صديق أخبرني</option>
          <option value="أخرى">أخرى</option>
        </select>
        <div class="err">اختر مصدراً.</div>
      </div>

      <div class="field" data-f="notes">
        <label for="notes">ملاحظات <span class="hint">اختياري</span></label>
        <textarea id="notes" name="notes" placeholder="أي شيء تودّ أن نعرفه"></textarea>
      </div>
    </div>

    <div class="submit-zone">
      <button type="submit" class="btn" id="btn">أرسل تجربتي</button>
      <p class="consent">بإرسالك النموذج توافق على استخدام تسجيلك لأغراض التقييم فقط، ضمن سياسة الخصوصية المعتمدة لدى كاسيت.</p>
    </div>
  </form>

  <!-- النجاح -->
  <section class="done" id="done">
    <div class="mark">🎙️</div>
    <h2>وصلتنا تجربتك</h2>
    <p>سنستمع إلى جميع التسجيلات، ونتواصل مع المرشّحين لجلسة تسجيل داخل استوديوهاتنا في عمّان.</p>
    <p>تابعنا على <span class="num">@kaseetmedia</span></p>
  </section>

</div>

<footer>
  <div>كاسيت ميديا — <span class="lat">Kaseet Media</span></div>
  <div style="margin-top:6px">السبت – الخميس · <span class="num">10:00</span> ص – <span class="num">8:00</span> م · عمّان، الأردن</div>
</footer>

</div><!-- /.page -->

<script>
(function(){
  "use strict";

  var DEADLINE = new Date("2026-08-20T20:00:00+03:00").getTime();

  var form   = document.getElementById("form");
  var hero   = document.getElementById("hero");
  var closed = document.getElementById("closed");
  var done   = document.getElementById("done");
  var btn    = document.getElementById("btn");

  function pad(n){ return n < 10 ? "0" + n : "" + n; }

  function tick(){
    var gap = DEADLINE - Date.now();
    if (gap <= 0){
      if (hero)   hero.style.display   = "none";
      if (form)   form.style.display   = "none";
      if (closed) closed.classList.add("on");
      return false;
    }
    var s = Math.floor(gap / 1000);
    document.getElementById("dd").textContent = Math.floor(s / 86400);
    document.getElementById("hh").textContent = pad(Math.floor(s % 86400 / 3600));
    document.getElementById("mm").textContent = pad(Math.floor(s % 3600 / 60));
    document.getElementById("ss").textContent = pad(s % 60);
    return true;
  }
  if (tick()) setInterval(tick, 1000);

  /* ===== سلايدر الاستوديو المنزلي ===== */
  var rateWrap = document.getElementById("studioRateWrap");
  var rate     = document.getElementById("studioRate");
  var rateVal  = document.getElementById("rateVal");

  Array.prototype.forEach.call(document.querySelectorAll("input[name=homeStudio]"), function(r){
    r.addEventListener("change", function(){
      rateWrap.classList.toggle("on", r.value === "نعم" && r.checked);
    });
  });
  rate.addEventListener("input", function(){ rateVal.textContent = rate.value; });

  /* ===== رفع الملف ===== */
  var MAX  = 25 * 1024 * 1024;
  var OK   = ["mp3","wav"];
  var drop = document.getElementById("drop");
  var file = document.getElementById("audio");
  var picked = document.getElementById("picked");

  function showFile(){
    var f = file.files[0];
    if (!f) return;
    document.getElementById("fname").textContent = f.name;
    document.getElementById("fsize").textContent = (f.size / 1048576).toFixed(1) + " MB";
    drop.style.display = "none";
    picked.classList.add("on");
  }
  file.addEventListener("change", showFile);

  document.getElementById("clearFile").addEventListener("click", function(){
    file.value = "";
    picked.classList.remove("on");
    drop.style.display = "";
  });

  ["dragenter","dragover"].forEach(function(e){
    drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.add("over"); });
  });
  ["dragleave","drop"].forEach(function(e){
    drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.remove("over"); });
  });
  drop.addEventListener("drop", function(ev){
    if (ev.dataTransfer.files.length){ file.files = ev.dataTransfer.files; showFile(); }
  });

  /* ===== التحقق ===== */
  function mark(key, bad){
    var el = document.querySelector('[data-f="' + key + '"]');
    if (!el) return;
    el.classList.toggle("bad", bad);
    var e = el.querySelector(".err");
    if (e) e.classList.toggle("on", bad);
  }

  function checked(name){
    return document.querySelector('input[name="' + name + '"]:checked');
  }

  function validate(){
    var bad = [];
    if (document.getElementById("name").value.trim().length < 3) bad.push("name");
    if (!checked("gender")) bad.push("gender");

    var age = parseInt(document.getElementById("age").value, 10);
    if (isNaN(age) || age < 16 || age > 70) bad.push("age");

    if (!document.getElementById("country").value) bad.push("country");
    if (document.getElementById("city").value.trim().length < 2) bad.push("city");

    var wa = document.getElementById("whatsapp").value.replace(/[\s()\-]/g, "");
    if (!/^\+\d{8,15}$/.test(wa)) bad.push("whatsapp");

    var em = document.getElementById("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) bad.push("email");

    if (!checked("script"))     bad.push("script");
    if (!checked("homeStudio")) bad.push("homeStudio");

    var f = file.files[0];
    if (!f) bad.push("audio");
    else {
      var ext = f.name.split(".").pop().toLowerCase();
      if (OK.indexOf(ext) === -1 || f.size > MAX) bad.push("audio");
    }

    if (!checked("experience")) bad.push("experience");

    var pf = document.getElementById("portfolio").value.trim();
    if (pf && !/^https?:\/\/.+\..+/.test(pf)) bad.push("portfolio");

    if (!document.getElementById("source").value) bad.push("source");

    ["name","gender","age","country","city","whatsapp","email","script",
     "homeStudio","audio","experience","portfolio","source"].forEach(function(k){
      mark(k, bad.indexOf(k) !== -1);
    });

    return bad;
  }

  /* تنظيف الخطأ عند التعديل */
  form.addEventListener("input", function(ev){
    var f = ev.target.closest("[data-f]");
    if (f) mark(f.getAttribute("data-f"), false);
  });
  form.addEventListener("change", function(ev){
    var f = ev.target.closest("[data-f]");
    if (f) mark(f.getAttribute("data-f"), false);
  });

  /* ===== الإرسال الحقيقي ===== */
  form.addEventListener("submit", function(ev){
    ev.preventDefault();

    if (Date.now() > DEADLINE){ tick(); return; }

    var bad = validate();
    if (bad.length){
      var first = document.querySelector('[data-f="' + bad[0] + '"]');
      if (first) first.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    btn.disabled    = true;
    btn.textContent = "جارٍ الإرسال…";

    var fd = new FormData(form);

    fetch("", { method: "POST", body: fd })
      .then(function(r){ return r.json(); })
      .then(function(data){
        if (data.ok) {
          hero.style.display = "none";
          form.style.display = "none";
          done.classList.add("on");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (data.error === "deadline") {
          tick();
        } else if (data.error === "rate_limit") {
          btn.disabled    = false;
          btn.textContent = "أرسل تجربتي";
          alert("تجاوزت الحد المسموح من المحاولات. حاول مجدداً بعد ساعة.");
        } else if (data.errors && data.errors.length) {
          data.errors.forEach(function(k){ mark(k, true); });
          var el = document.querySelector('[data-f="' + data.errors[0] + '"]');
          if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
          btn.disabled    = false;
          btn.textContent = "أرسل تجربتي";
        } else {
          btn.disabled    = false;
          btn.textContent = "أرسل تجربتي";
          alert("حدث خطأ. يرجى المحاولة مرة أخرى.");
        }
      })
      .catch(function(){
        btn.disabled    = false;
        btn.textContent = "أرسل تجربتي";
        alert("تعذّر الاتصال بالخادم. تحقق من اتصالك وأعد المحاولة.");
      });
  });
})();
</script>
</body>
</html>
