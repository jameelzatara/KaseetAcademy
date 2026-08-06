import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ── Trust Replit's TLS-terminating proxy ──────────────────
app.set("trust proxy", 1);

// ── Logging ───────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── CORS — allow browser credentials ─────────────────────
app.use(
  cors({
    origin: true,       // reflect any origin (Replit domain varies)
    credentials: true,  // allow cookies
  }),
);

// ── Body / cookie parsers ─────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Session ───────────────────────────────────────────────
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET env var is required");
}

app.use(
  session({
    name: "kaseet.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,        // always secure (Replit uses HTTPS)
      sameSite: "none",    // cross-path cookie on same domain via Replit proxy
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

// ── Routes ────────────────────────────────────────────────
app.use("/api", router);

export default app;
