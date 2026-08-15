-- ============================================================
-- casting.kaseet.com — إعداد قاعدة البيانات
-- شغّله مرة واحدة فقط من phpMyAdmin أو DreamHost DB panel
-- ============================================================

CREATE TABLE IF NOT EXISTS casting_submissions (
  id            INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
  submitted_at  DATETIME        NOT NULL COMMENT 'بتوقيت عمّان Asia/Amman',
  name          VARCHAR(255)    NOT NULL,
  gender        VARCHAR(10)     NOT NULL,
  age           TINYINT UNSIGNED NOT NULL,
  country       VARCHAR(100)    NOT NULL,
  city          VARCHAR(100)    NOT NULL,
  whatsapp      VARCHAR(25)     NOT NULL,
  email         VARCHAR(255)    NOT NULL,
  script        VARCHAR(60)     NOT NULL,
  home_studio   VARCHAR(5)      NOT NULL,
  studio_rate   TINYINT UNSIGNED,
  audio_url     VARCHAR(600)    NOT NULL,
  experience    VARCHAR(5)      NOT NULL,
  portfolio     VARCHAR(600),
  source        VARCHAR(50)     NOT NULL,
  notes         TEXT,
  ip            VARCHAR(45)     NOT NULL,
  INDEX idx_ip_time (ip, submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
