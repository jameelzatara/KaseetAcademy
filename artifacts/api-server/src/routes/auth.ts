import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// Extend express-session
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const router = Router();

// ── Helpers ──────────────────────────────────────────────
function safeUser(u: typeof usersTable.$inferSelect) {
  return { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName };
}

// ── POST /auth/register ───────────────────────────────────
router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName = "", phone = "" } = req.body as {
      email: string; password: string; firstName: string;
      lastName?: string; phone?: string;
    };

    if (!email || !password || !firstName) {
      res.status(400).json({ error: "البريد الإلكتروني، كلمة المرور، والاسم مطلوبة" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "البريد الإلكتروني مسجّل مسبقاً" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      phone,
      provider: "email",
    }).returning();

    req.session.userId = user.id;
    res.status(201).json({ user: safeUser(user) });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ error: "خطأ في الخادم، حاول مجدداً" });
  }
});

// ── POST /auth/login ─────────────────────────────────────
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({ error: "البريد وكلمة المرور مطلوبان" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return;
    }

    req.session.userId = user.id;
    res.json({ user: safeUser(user) });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ error: "خطأ في الخادم، حاول مجدداً" });
  }
});

// ── POST /auth/logout ────────────────────────────────────
router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("kaseet.sid");
    res.json({ ok: true });
  });
});

// ── GET /auth/me ─────────────────────────────────────────
router.get("/auth/me", async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "غير مسجّل الدخول" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
    if (!user) {
      req.session.destroy(() => {});
      res.status(401).json({ error: "الجلسة منتهية" });
      return;
    }
    res.json({ user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
