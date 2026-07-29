/* ============================================================================
 *  REST API  /api/*
 *  Auth bằng session cookie (express-session). Mọi phản hồi là JSON tiếng Việt.
 *
 *  MÔ HÌNH: một TÀI KHOẢN (email + mật khẩu) có nhiều HỒ SƠ học tập.
 *  Toàn bộ tiến độ (lượt làm bài, bài đã học, XP/huy hiệu) gắn vào HỒ SƠ, nên
 *  hai anh em dùng chung một tài khoản vẫn có tiến độ riêng.
 *
 *  Nguyên tắc đồng bộ: client là nguồn ghi (làm bài ngay cả khi mạng chập
 *  chờn), server là kho lưu:
 *   - attempts : append-only, chống trùng bằng UNIQUE(user_id, client_ts)
 *   - learned  : hợp (union) — chỉ thêm, không xoá
 *   - gamify   : lưu nguyên khối JSON
 * ==========================================================================*/
const express = require("express");
const bcrypt = require("bcryptjs");
const { getPlan, maxProfiles, kichHoat } = require("./plan");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_USER_SQL = "id, email, name, role, created_at";

/* pg thật trả JSONB thành object; pg-mem (chế độ dev) trả chuỗi — chuẩn hoá. */
function asObj(v, def) {
  if (v == null) return def;
  if (typeof v === "string") { try { return JSON.parse(v); } catch (e) { return def; } }
  return v;
}
function publicUser(row) {
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}
function publicProfile(row) {
  if (!row) return null;
  return {
    id: row.id, name: row.name, gender: row.gender || "", grade: row.grade || "",
    track: row.track || "", mode: row.mode || "", days: asObj(row.days, []),
  };
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
    if (hits.size > 5000) hits.clear();
    if (h.n > max) return res.status(429).json({ error: "Thử quá nhiều lần, vui lòng đợi vài phút." });
    next();
  };
}

function createApi(pool) {
  const r = express.Router();

  r.get("/health", (req, res) => res.json({ ok: true, db: !!pool, time: new Date().toISOString() }));

  r.use((req, res, next) => {
    if (!pool) return res.status(503).json({ error: "Máy chủ chưa nối cơ sở dữ liệu (thiếu DATABASE_URL)." });
    next();
  });

  const q = (text, params) => pool.query(text, params);

  function requireAuth(req, res, next) {
    if (!req.session || !req.session.uid) return res.status(401).json({ error: "Bạn chưa đăng nhập." });
    next();
  }

  /* Hồ sơ phải thuộc đúng tài khoản đang đăng nhập — kiểm ở mọi lối vào dữ liệu */
  async function ownProfile(uid, profileId) {
    const id = Number(profileId);
    if (!id) return null;
    const f = await q("SELECT * FROM profiles WHERE id = $1 AND user_id = $2", [id, uid]);
    return f.rows[0] || null;
  }
  async function needProfile(req, res) {
    const p = await ownProfile(req.session.uid, req.body && req.body.profileId ? req.body.profileId : req.query.profileId);
    if (!p) { res.status(400).json({ error: "Thiếu hoặc sai hồ sơ học tập." }); return null; }
    return p;
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
      const user = ins.rows[0];
      // Tạo sẵn một hồ sơ để đăng ký xong là học được ngay
      const p = await q("INSERT INTO profiles (user_id, name) VALUES ($1, $2) RETURNING *",
        [user.id, name || "Hồ sơ 1"]);
      req.session.uid = user.id;
      const tk = req.app.locals.thongKe;
      if (tk) tk.ghi("tao-tai-khoan", "");   // mốc phễu, xem server/thongke.js
      res.json({ user: publicUser(user), profiles: [publicProfile(p.rows[0])] });
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
      const ps = await q("SELECT * FROM profiles WHERE user_id = $1 ORDER BY id", [row.id]);
      res.json({ user: publicUser(row), profiles: ps.rows.map(publicProfile) });
    } catch (e) { next(e); }
  });

  r.post("/auth/logout", (req, res) => {
    if (req.session) req.session.destroy(() => res.json({ ok: true }));
    else res.json({ ok: true });
  });

  r.get("/me", async (req, res, next) => {
    try {
      if (!req.session || !req.session.uid) return res.json({ user: null, profiles: [] });
      const found = await q(`SELECT ${PUBLIC_USER_SQL} FROM users WHERE id = $1`, [req.session.uid]);
      if (!found.rows[0]) { req.session.destroy(() => {}); return res.json({ user: null, profiles: [] }); }
      const ps = await q("SELECT * FROM profiles WHERE user_id = $1 ORDER BY id", [req.session.uid]);
      const plan = await getPlan(pool, req.session.uid, found.rows[0].role);
      res.json({
        user: publicUser(found.rows[0]), profiles: ps.rows.map(publicProfile),
        plan, maxProfiles: maxProfiles(plan.tier, found.rows[0].role),
      });
    } catch (e) { next(e); }
  });

  /* ============================ TỪ ĐÂY CẦN ĐĂNG NHẬP ============================ */
  r.use(requireAuth);

  /* Xoá hẳn tài khoản — quyền của người dùng, ghi trong trang Quyền riêng tư.
     Bắt nhập lại mật khẩu vì đây là việc KHÔNG lấy lại được. Mọi hồ sơ, tiến độ,
     nhật ký gia sư đều xoá theo nhờ ON DELETE CASCADE. */
  r.delete("/auth/account", async (req, res, next) => {
    try {
      const found = await q("SELECT password_hash FROM users WHERE id = $1", [req.session.uid]);
      const row = found.rows[0];
      const ok = row && (await bcrypt.compare(String((req.body || {}).password || ""), row.password_hash));
      if (!ok) return res.status(401).json({ error: "Mật khẩu chưa đúng — chưa xoá gì cả." });
      await q("DELETE FROM users WHERE id = $1", [req.session.uid]);
      if (req.session) req.session.destroy(() => res.json({ ok: true }));
      else res.json({ ok: true });
    } catch (e) { next(e); }
  });

  /* --------------------------- MÃ KÍCH HOẠT --------------------------- */
  /* Giới hạn chặt hơn auth: mã chỉ có 31^8 tổ hợp nhưng cũng không để dò tự do. */
  const activateLimit = makeRateLimit(15, 10 * 60 * 1000);

  r.post("/licenses/activate", activateLimit, async (req, res, next) => {
    try {
      const kq = await kichHoat(pool, req.session.uid, (req.body || {}).code);
      res.json({ ok: true, daTung: !!kq.daTung, plan: { tier: "paid", hetHan: kq.hetHan } });
    } catch (e) {
      if (e.status) return res.status(e.status).json({ error: e.message });
      next(e);
    }
  });

  /* ------------------------------ HỒ SƠ ------------------------------ */
  r.get("/profiles", async (req, res, next) => {
    try {
      const ps = await q("SELECT * FROM profiles WHERE user_id = $1 ORDER BY id", [req.session.uid]);
      res.json({ profiles: ps.rows.map(publicProfile) });
    } catch (e) { next(e); }
  });

  r.post("/profiles", async (req, res, next) => {
    try {
      const me = await q("SELECT role FROM users WHERE id = $1", [req.session.uid]);
      const plan = await getPlan(pool, req.session.uid, me.rows[0] && me.rows[0].role);
      const toiDa = maxProfiles(plan.tier, me.rows[0] && me.rows[0].role);
      const dem = await q("SELECT COUNT(*)::int AS n FROM profiles WHERE user_id = $1", [req.session.uid]);
      if (dem.rows[0].n >= toiDa) {
        return res.status(400).json({
          error: plan.tier === "free"
            ? "Gói Miễn phí dùng 1 hồ sơ học tập. Nâng cấp Premium để thêm hồ sơ cho anh chị em dùng chung tài khoản."
            : `Gói của bạn dùng tối đa ${toiDa} hồ sơ.`,
        });
      }
      const b = req.body || {};
      const name = String(b.name || "").trim().slice(0, 40);
      if (!name) return res.status(400).json({ error: "Hồ sơ cần có tên." });
      const days = Array.isArray(b.days) ? b.days.map(Number).filter((n) => n >= 0 && n <= 6) : [];
      const ins = await q(
        `INSERT INTO profiles (user_id, name, gender, grade, track, mode, days)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [req.session.uid, name, String(b.gender || ""), String(b.grade || ""),
         String(b.track || ""), String(b.mode || ""), JSON.stringify(days)]
      );
      res.json({ profile: publicProfile(ins.rows[0]) });
    } catch (e) { next(e); }
  });

  r.patch("/profiles/:id", async (req, res, next) => {
    try {
      const p = await ownProfile(req.session.uid, req.params.id);
      if (!p) return res.status(404).json({ error: "Không tìm thấy hồ sơ." });
      const b = req.body || {};
      const name = b.name != null ? String(b.name).trim().slice(0, 40) : p.name;
      if (!name) return res.status(400).json({ error: "Hồ sơ cần có tên." });
      const days = Array.isArray(b.days) ? b.days.map(Number).filter((n) => n >= 0 && n <= 6) : asObj(p.days, []);
      const upd = await q(
        `UPDATE profiles SET name=$1, gender=$2, grade=$3, track=$4, mode=$5, days=$6
         WHERE id=$7 RETURNING *`,
        [name, String(b.gender ?? p.gender ?? ""), String(b.grade ?? p.grade ?? ""),
         String(b.track ?? p.track ?? ""), String(b.mode ?? p.mode ?? ""),
         JSON.stringify(days), p.id]
      );
      res.json({ profile: publicProfile(upd.rows[0]) });
    } catch (e) { next(e); }
  });

  r.delete("/profiles/:id", async (req, res, next) => {
    try {
      const p = await ownProfile(req.session.uid, req.params.id);
      if (!p) return res.status(404).json({ error: "Không tìm thấy hồ sơ." });
      const dem = await q("SELECT COUNT(*)::int AS n FROM profiles WHERE user_id = $1", [req.session.uid]);
      if (dem.rows[0].n <= 1) return res.status(400).json({ error: "Phải còn ít nhất một hồ sơ." });
      await q("DELETE FROM profiles WHERE id = $1", [p.id]);   // tiến độ xoá theo (ON DELETE CASCADE)
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  /* ============================ ĐỒNG BỘ TIẾN ĐỘ ============================ */
  r.get("/sync", async (req, res, next) => {
    try {
      const p = await needProfile(req, res); if (!p) return;
      const [att, lea, gam] = await Promise.all([
        q("SELECT detail FROM attempts WHERE profile_id = $1 ORDER BY client_ts DESC LIMIT 500", [p.id]),
        q("SELECT lesson_id FROM learned WHERE profile_id = $1", [p.id]),
        q("SELECT data FROM gamify WHERE profile_id = $1", [p.id]),
      ]);
      res.json({
        attempts: att.rows.map((x) => asObj(x.detail, {})),
        learned: lea.rows.map((x) => x.lesson_id),
        gamify: gam.rows[0] ? asObj(gam.rows[0].data, null) : null,
        profile: publicProfile(p),
      });
    } catch (e) { next(e); }
  });

  async function insertAttempt(uid, profileId, rec) {
    if (!rec || typeof rec !== "object") return;
    const ts = Number(rec.at) || Date.now();
    await q(
      `INSERT INTO attempts (user_id, profile_id, client_ts, mode, lesson_id, exam_code, score, correct_count, total, duration_sec, detail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (user_id, client_ts) DO NOTHING`,
      [uid, profileId, ts, rec.mode || null, rec.lessonId || null, rec.code != null ? String(rec.code) : null,
       Number(rec.score) || 0, Number(rec.correctCount) || 0, Number(rec.total) || 0,
       Number(rec.durationSec) || 0, JSON.stringify(rec)]
    );
  }

  r.post("/attempts", async (req, res, next) => {
    try {
      const p = await needProfile(req, res); if (!p) return;
      const b = req.body || {};
      const records = Array.isArray(b.records) ? b.records : [b.record];
      if (records.length > 500) return res.status(400).json({ error: "Quá nhiều bản ghi một lần." });
      for (const rec of records) await insertAttempt(req.session.uid, p.id, rec);
      res.json({ ok: true, saved: records.filter(Boolean).length });
    } catch (e) { next(e); }
  });

  r.put("/learned", async (req, res, next) => {
    try {
      const p = await needProfile(req, res); if (!p) return;
      const ids = (Array.isArray(req.body && req.body.ids) ? req.body.ids : [])
        .map((x) => String(x).slice(0, 40)).slice(0, 2000);
      for (const id of ids) {
        await q("INSERT INTO learned (profile_id, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [p.id, id]);
      }
      const all = await q("SELECT lesson_id FROM learned WHERE profile_id = $1", [p.id]);
      res.json({ ok: true, learned: all.rows.map((x) => x.lesson_id) });
    } catch (e) { next(e); }
  });

  r.put("/gamify", async (req, res, next) => {
    try {
      const p = await needProfile(req, res); if (!p) return;
      const data = (req.body && typeof req.body.data === "object" && req.body.data) || {};
      await q(
        `INSERT INTO gamify (profile_id, data) VALUES ($1, $2)
         ON CONFLICT (profile_id) DO UPDATE SET data = $2, updated_at = now()`,
        [p.id, JSON.stringify(data)]
      );
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  return r;
}

module.exports = { createApi };
