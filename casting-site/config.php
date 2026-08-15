<?php
/**
 * casting.kaseet.com — إعدادات التطبيق
 * عبّئ هذه القيم قبل الرفع على DreamHost
 */

// ── قاعدة البيانات (MySQL على DreamHost) ──────────────────────────────────────
define('DB_HOST', 'mysql.kaseet.com');       // أو localhost حسب DreamHost
define('DB_NAME', 'kaseetcom_casting');
define('DB_USER', 'kaseetcom_casting');
define('DB_PASS', 'CHANGE_ME');

// ── الإدارة ──────────────────────────────────────────────────────────────────
define('ADMIN_PASSWORD', 'CHANGE_ME');
define('ADMIN_EMAIL',    'casting@kaseet.com'); // البريد الذي يستقبل الإشعارات

// ── Brevo API (لإرسال الإيميل) ───────────────────────────────────────────────
define('BREVO_API_KEY',  'CHANGE_ME');
define('SENDER_EMAIL',   'notify@kaseet.com');
define('SENDER_NAME',    'كاسيت ميديا');

// ── رفع الملفات ──────────────────────────────────────────────────────────────
// uploads/ مجلد بجانب index.php مرفوع على الخادم
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', 'https://casting.kaseet.com/uploads/');

// ── الديدلاين ─────────────────────────────────────────────────────────────────
define('DEADLINE_ISO', '2026-08-20T20:00:00+03:00');

// ── الحدود ───────────────────────────────────────────────────────────────────
define('MAX_FILE_BYTES', 25 * 1024 * 1024); // 25 MB
define('RATE_LIMIT_PER_HOUR', 3);           // محاولات إرسال لكل IP في الساعة
