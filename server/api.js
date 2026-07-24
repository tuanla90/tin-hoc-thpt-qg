/* ============================================================================
 *  REST API  /api/*
 *  Auth bằng session cookie (express-session). Mọi phản hồi là JSON tiếng Việt.
 *  Nguyên tắc đồng bộ: client là nguồn ghi (offline-first), server là kho lưu:
 *   - attempts  : append-only, chống trùng bằng UNIQUE(user_id, client_ts)
 *   - learned   : hợp (union) — chỉ thêm, không xoá
 *   - gamify    : lưu nguyên khối JSON (client tự quyết bên nào mới hơn)
 *   - profile   : ghi đè cả khối
 * ==========================================================================*/
const express = require("express");
const bcrypt = require("bcryptjs");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_USER_SQL = "id, email, name, role, profile, created_at";

/* pg thật parse JSONB thành object sẵn; pg-mem (chế độ dev) trả chuỗi — chuẩn hoá. */
function asObj(v, def) {
  if (v == null) return def;
  if (typeof v === "string") { try { return JSON.parse(v); } catch (e) { return def; } }
  return v;
}

function publicUser(row) {
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.name, role: row.role, profile: asObj(row.profile, {}) };
}

/* Giới hạn thử đăng nhập/đăng ký: 30 lượt / 10 phút / IP (bộ đếm trong RAM). */
function makeRateLimit(max, windowMs) {
  const hits = new Map();
  return function rateLimit(req, res, next) {
    const now = Date.now();
    const key = req.ip || "?";
    let h = hits.get(key);
    if (!h || now - h.t0 > windowMs) { h = { t0: now, n: 0 }; hits.set(key, h); }
    h.n++;
    if (hits.size > 5000) hits.clear(); // chống phình bộ nhớ
    if (h.n > max) return res.status(429).json({ error: "Thử quá nhiều lần, vui lòng đợi vài phút." });
    next();
  };
}

function createApi(pool) {
  const r = express.Router();

  /* ---- luôn có, kể cả khi chưa nối DB ---- */
  r.get("/health", (req, res) => res.json({ ok: true, db: !!pool, time: new Date().toISOString() }));

  /* Chưa cấu hình DB -> mọi API còn lại trả 503 rõ ràng. */
  r.use((req, res, next) => {
    if (!pool) return res.status(503).json({ error: "Máy chủ chưa nối cơ sở dữ liệu (thiếu DATABASE_URL)." });
    next();
  });

  const q = (text, params) => pool.query(text, params);

  function requireAuth(req, res, next) {
    if (!req.session || !req.session.uid) return res.status(401).json({ error: "Bạn chưa đăng nhập." });
    next();
  }

  /* ========================= ĐĂNG KÝ / ĐĂNG NHẬP ========================= */
  const authLimit = makeRateLimit(30, 10 * 60 * 1000);

  r.post("/auth/register", authLimit, async (req, res, next) => {
    try {
      const body = req.body || {};
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const name = String(body.name || "").trim().slice(0, 60);
      if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Email không hợp lệ." });
      if (password.length < 6) return res.status(400).json({ error: "Mật khẩu cần ít nhất 6 ký tự." });

      const dup = await q("SELECT id FROM users WHERE email = $1", [email]);
      if (dup.rows.length) return res.status(409).json({ error: "Email này đã có tài khoản — hãy đăng nhập." });

      const hash = await bcrypt.hash(password, 10);
      const ins = await q(
        `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING ${PUBLIC_USER_SQL}`,
        [email, hash, name]
      );
      req.session.uid = ins.rows[0].id;
      res.json({ user: publicUser(ins.rows[0]) });
    } catch (e) { next(e); }
  });

  r.post("/auth/login", authLimit, async (req, res, next) => {
    try {
      const body = req.body || {};
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const found = await q(`SELECT ${PUBLIC_USER_SQL}, password_hash FROM users WHERE email = $1`, [email]);
      const row = found.rows[0];
      const ok = row && (await bcrypt.compare(password, row.password_hash));
      if (!ok) return res.status(401).json({ error: "Email hoặc mật khẩu chưa đúng." });
      req.session.uid = row.id;
      await q("UPDATE users SET last_seen_at = now() WHERE id = $1", [row.id]);
      res.json({ user: publicUser(row) });
    } catch (e) { next(e); }
  });

  r.post("/auth/logout", (req, res) => {
    if (req.session) req.session.destroy(() => res.json({ ok: true }));
    else res.json({ ok: true });
  });

  r.get("/me", async (req, res, next) => {
    try {
      if (!req.session || !req.session.uid) return res.json({ user: null });
      const found = await q(`SELECT ${PUBLIC_USER_SQL} FROM users WHERE id = $1`, [req.session.uid]);
      if (!found.rows[0]) { req.session.destroy(() => {}); return res.json({ user: null }); }
      res.json({ user: publicUser(found.rows[0]) });
    } catch (e) { next(e); }
  });

  /* ============================ ĐỒNG BỘ ============================ */
  r.use(requireAuth);

  /* Toàn bộ dữ liệu của người dùng — client gọi khi đăng nhập / mở app. */
  r.get("/sync", async (req, res, next) => {
    try {
      const uid = req.session.uid;
      const [att, lea, gam, usr] = await Promise.all([
        q("SELECT detail FROM attempts WHERE user_id = $1 ORDER BY client_ts DESC LIMIT 500", [uid]),
        q("SELECT lesson_id FROM learned WHERE user_id = $1", [uid]),
        q("SELECT data FROM gamify WHERE user_id = $1", [uid]),
        q("SELECT profile, name FROM users WHERE id = $1", [uid]),
      ]);
      res.json({
        attempts: att.rows.map((x) => asObj(x.detail, {})),
        learned: lea.rows.map((x) => x.lesson_id),
        gamify: gam.rows[0] ? asObj(gam.rows[0].data, null) : null,
        profile: usr.rows[0] ? asObj(usr.rows[0].profile, {}) : {},
      });
    } catch (e) { next(e); }
  });

  /* Ghi 1 hoặc nhiều lượt làm bài. Trùng (cùng client_ts) thì bỏ qua êm. */
  async function insertAttempt(uid, rec) {
    if (!rec || typeof rec !== "object") return;
    const ts = Number(rec.at) || Date.now();
    await q(
      `INSERT INTO attempts (user_id, client_ts, mode, lesson_id, exam_code, score, correct_count, total, duration_sec, detail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (user_id, client_ts) DO NOTHING`,
      [uid, ts, rec.mode || null, rec.lessonId || null, rec.code != null ? String(rec.code) : null,
       Number(rec.score) || 0, Number(rec.correctCount) || 0, Number(rec.total) || 0,
       Number(rec.durationSec) || 0, JSON.stringify(rec)]
    );
  }

  r.post("/attempts", async (req, res, next) => {
    try {
      const b = req.body || {};
      const records = Array.isArray(b.records) ? b.records : [b.record];
      if (records.length > 500) return res.status(400).json({ error: "Quá nhiều bản ghi một lần." });
      for (const rec of records) await insertAttempt(req.session.uid, rec);
      res.json({ ok: true, saved: records.filter(Boolean).length });
    } catch (e) { next(e); }
  });

  /* Danh sách bài đã học — hợp với dữ liệu sẵn có trên server. */
  r.put("/learned", async (req, res, next) => {
    try {
      const ids = (Array.isArray(req.body && req.body.ids) ? req.body.ids : [])
        .map((x) => String(x).slice(0, 40)).slice(0, 2000);
      for (const id of ids) {
        await q("INSERT INTO learned (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [req.session.uid, id]);
      }
      const all = await q("SELECT lesson_id FROM learned WHERE user_id = $1", [req.session.uid]);
      res.json({ ok: true, learned: all.rows.map((x) => x.lesson_id) });
    } catch (e) { next(e); }
  });

  r.put("/gamify", async (req, res, next) => {
    try {
      const data = (req.body && typeof req.body.data === "object" && req.body.data) || {};
      await q(
        `INSERT INTO gamify (user_id, data) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET data = $2, updated_at = now()`,
        [req.session.uid, JSON.stringify(data)]
      );
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  r.put("/profile", async (req, res, next) => {
    try {
      const profile = (req.body && typeof req.body.profile === "object" && req.body.profile) || {};
      const name = String(profile.name || "").trim().slice(0, 60);
      await q(
        "UPDATE users SET profile = $1, name = CASE WHEN $2 <> '' THEN $2 ELSE name END WHERE id = $3",
        [JSON.stringify(profile), name, req.session.uid]
      );
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  return r;
}

module.exports = { createApi };
