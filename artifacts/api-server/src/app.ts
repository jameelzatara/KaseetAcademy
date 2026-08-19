import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { verifyStripeWebhook, processWebhookEvent } from "./routes/checkout.js";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware.js";

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

// ── CORS ──────────────────────────────────────────────────
// ⛔ Never reflect arbitrary origins when credentials are allowed.
// Only Replit's own proxy domains (.replit.dev / .pike.replit.dev)
// and the production domain are permitted.  Unknown origins receive
// no Access-Control-Allow-Origin header → browser blocks the request.
const ALLOWED_ORIGIN_RE =
  /^https:\/\/(?:[\w-]+\.pike\.replit\.dev|[\w-]+\.replit\.dev|kaseet\.com)$/;

function isTrustedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  if (origin === "http://localhost:5173" || origin === "http://localhost:3000") return true;
  return ALLOWED_ORIGIN_RE.test(origin);
}

app.use(
  cors({
    origin(requestOrigin, callback) {
      if (isTrustedOrigin(requestOrigin)) {
        callback(null, requestOrigin);      // echo back the exact trusted origin
      } else {
        callback(null, false);              // deny — no ACAO header
      }
    },
    credentials: true,
  }),
);

// Clerk's browser API must be proxied before any body parser consumes its stream.
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// ── ⛔ Stripe webhook MUST come BEFORE express.json() ─────
// Needs raw Buffer body for signature verification
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }
    const signature = Array.isArray(sig) ? sig[0] : sig;
    try {
      // Verify signature (throws → 400); then respond 200 BEFORE processing
      const event = await verifyStripeWebhook(req.body as Buffer, signature);
      res.json({ received: true });
      // Fire-and-forget business logic (seat decrement, order creation, etc.)
      processWebhookEvent(event).catch((err) =>
        logger.error({ err }, "Async webhook processing failed"),
      );
    } catch (err: any) {
      logger.error({ err }, "Stripe webhook signature error");
      res.status(400).json({ error: err.message });
    }
  },
);

// ── Body / cookie parsers (AFTER webhook route) ───────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Session ───────────────────────────────────────────────
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET env var is required");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(app as any).use(
  session({
    name: "kaseet.sid",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// Student identity is owned by Clerk. Existing admin/session authentication
// remains separate and is still used exclusively by /api/admin routes.
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

// ── ⑧ ترويسات الأمان ─────────────────────────────────────
app.use((_req, res, next) => {
  // Content-Security-Policy
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.instagram.com https://cloud.umami.is",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.instagram.com",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://cloud.umami.is",
    ].join("; "),
  );
  res.setHeader("X-Frame-Options",          "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options",   "nosniff");
  res.setHeader("Referrer-Policy",          "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security","max-age=31536000; includeSubDomains");
  // ⛔ microphone=(self) إلزامي — صفحة «سمّعنا صوتك» تحتاجه
  res.setHeader("Permissions-Policy",       "microphone=(self), camera=(), geolocation=()");
  next();
});

// ── Routes ────────────────────────────────────────────────
// ── CSRF protection for admin mutations ───────────────────
// Session cookie is SameSite=None, so cross-site form posts would carry it.
// Browsers always send an Origin header on cross-site POST — reject untrusted
// origins on any state-changing /api/admin request. (Requests without an
// Origin header — curl, server-to-server — are not browser CSRF vectors.)
app.use("/api/admin", (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) { next(); return; }
  const origin = req.headers.origin;
  if (origin && !isTrustedOrigin(origin)) {
    res.status(403).json({ error: "مصدر الطلب غير موثوق" });
    return;
  }
  next();
});

app.use("/api", router);

export default app;
