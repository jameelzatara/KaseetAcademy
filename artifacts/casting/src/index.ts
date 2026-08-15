import express from "express";
import multer from "multer";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import { submitHandler } from "./routes/submit.js";
import { adminRouter } from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || "3333", 10);

// ── Middleware ─────────────────────────────────────────────────────────────────
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "casting-fallback-secret-2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
  })
);

// ── File upload (memory — stored in DB) ────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 26 * 1024 * 1024 }, // buffer max 26MB; server enforces 25MB
});

// ── Routes ─────────────────────────────────────────────────────────────────────
// Casting form — serve exact HTML prototype
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "views", "page.html"));
});

// Form submission (POST to same URL — matches prototype's fetch("", ...))
app.post("/", upload.single("audio"), submitHandler);

// Admin panel
app.use("/admin", adminRouter);

// Health check
app.get("/healthz", (_req, res) => res.json({ ok: true, service: "casting" }));

// ── Boot ───────────────────────────────────────────────────────────────────────
initDb()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[casting] Server ready on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[casting] DB init failed:", err);
    process.exit(1);
  });
