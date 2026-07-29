/* ============================================================================
 *  NHẮC HỌC BẰNG THÔNG BÁO ĐẨY (Web Push)
 *
 *  Vì sao có: chuỗi ngày học là thứ giữ chân người tự học, mà chuỗi thì rất dễ
 *  đứt chỉ vì quên. Không ai mở app để nhớ rằng mình cần mở app.
 *
 *  KHÔNG DÙNG THƯ VIỆN, và cũng không cần: bản tin đẩy ở đây KHÔNG KÈM NỘI
 *  DUNG (payload rỗng). Có payload thì phải mã hoá đầu-cuối theo RFC 8291
 *  (ECDH + HKDF + AES-GCM) — nhiều mã, nhiều chỗ sai. Payload rỗng chỉ cần ký
 *  một JWT ES256 theo VAPID (RFC 8292), node:crypto làm được.
 *
 *  Đổi lại, service worker phải tự hỏi máy chủ xem nên hiện chữ gì
 *  (POST /api/nhac/noidung). Việc này hoá ra lại HAY HƠN: chữ hiện ra tính tại
 *  thời điểm đọc, nên nếu học sinh đã kịp học trước khi mở thông báo thì không
 *  bị nhắc nhầm là "chưa học".
 *
 *  Cấu hình (Railway → Variables), sinh bằng `node scripts/vapid.js`:
 *    VAPID_PUBLIC   khoá công khai (base64url, 65 byte dạng 0x04||X||Y)
 *    VAPID_PRIVATE  khoá bí mật (base64url, 32 byte)
 *    VAPID_SUB      mailto:... — dịch vụ đẩy dùng để liên hệ khi có sự cố
 *  Thiếu khoá thì mọi thứ vẫn chạy, chỉ là tính năng tự tắt (nút không hiện).
 * ==========================================================================*/
const express = require("express");
const crypto = require("crypto");

/* Giờ Việt Nam cố định UTC+7, không có giờ mùa hè — nên chỉ cần cộng bù rồi đọc
   bằng các hàm getUTC*, khỏi phụ thuộc múi giờ của máy chủ (Railway chạy UTC). */
const LECH_VN = 7 * 3600 * 1000;
function gioVN(now) { return new Date((now ? now.getTime() : Date.now()) + LECH_VN); }
/* Chuỗi ngày phải TRÙNG ĐỊNH DẠNG với js/gamify.js (gamDayStr): "2026-7-29",
   không đệm số 0. Lệch định dạng là so sánh nào cũng sai. */
function ngayVN(d) { const v = gioVN(d); return v.getUTCFullYear() + "-" + (v.getUTCMonth() + 1) + "-" + v.getUTCDate(); }
function thuVN(d) { return gioVN(d).getUTCDay(); }        // 0 = Chủ nhật
function ngaySQL(d) { const v = gioVN(d); return v.toISOString().slice(0, 10); }

function b64url(buf) { return Buffer.from(buf).toString("base64url"); }

function cauHinh() {
  return {
    pub: process.env.VAPID_PUBLIC || "",
    priv: process.env.VAPID_PRIVATE || "",
    sub: process.env.VAPID_SUB || "mailto:tuanla.company@gmail.com",
  };
}
function bat() { const c = cauHinh(); return !!(c.pub && c.priv); }

/* ------------------------------ ký VAPID ------------------------------ */
/* Khoá bí mật chỉ là số d (32 byte); để dựng lại được khoá ký thì cần thêm toạ
   độ X, Y — vốn nằm sẵn trong khoá công khai (0x04 || X || Y). */
function khoaKy(pub, priv) {
  const p = Buffer.from(pub, "base64url");
  if (p.length !== 65 || p[0] !== 4) throw new Error("VAPID_PUBLIC phải là 65 byte dạng 0x04||X||Y");
  const d = Buffer.from(priv, "base64url");
  if (d.length !== 32) throw new Error("VAPID_PRIVATE phải là 32 byte");
  return crypto.createPrivateKey({
    format: "jwk",
    key: { kty: "EC", crv: "P-256", x: b64url(p.subarray(1, 33)), y: b64url(p.subarray(33, 65)), d: b64url(d) },
  });
}

/* Chữ ký ECDSA của node ra dạng DER; JWT ES256 đòi 64 byte R||S thô. */
function derSangRaw(der) {
  let i = 2;
  if (der[1] & 0x80) i += der[1] & 0x7f;          // độ dài dạng dài
  const doc = () => {
    if (der[i++] !== 0x02) throw new Error("Chữ ký DER không hợp lệ");
    const n = der[i++];
    let v = der.subarray(i, i + n);
    i += n;
    while (v.length && v[0] === 0) v = v.subarray(1);          // bỏ số 0 đệm dấu
    return Buffer.concat([Buffer.alloc(32 - v.length), v]);    // đệm về đúng 32 byte
  };
  return Buffer.concat([doc(), doc()]);
}

/* JWT có hạn 12 tiếng: chuẩn VAPID cấm quá 24 tiếng, và ký lại thì rẻ. */
function taoJwt(aud, cfg, now) {
  const head = b64url(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const than = b64url(JSON.stringify({
    aud, exp: Math.floor((now || Date.now()) / 1000) + 12 * 3600, sub: cfg.sub,
  }));
  const ky = crypto.createSign("SHA256");
  ky.update(head + "." + than);
  ky.end();
  return head + "." + than + "." + b64url(derSangRaw(ky.sign(khoaKy(cfg.pub, cfg.priv))));
}

/* Gửi một bản tin rỗng tới dịch vụ đẩy của trình duyệt.
   Trả {ok, status}: 404/410 nghĩa là người ta đã gỡ app / xoá dữ liệu trang —
   phải xoá đăng ký, không thì gửi mãi vào hư không. */
async function gui(endpoint, cfg, fetchFn) {
  const u = new URL(endpoint);
  const res = await (fetchFn || fetch)(endpoint, {
    method: "POST",
    headers: {
      Authorization: "vapid t=" + taoJwt(u.origin, cfg) + ", k=" + cfg.pub,
      TTL: "43200",              // để dành 12 tiếng nếu máy đang tắt
      Urgency: "normal",
      "Content-Length": "0",
    },
  });
  return { ok: res.status >= 200 && res.status < 300, status: res.status };
}

/* --------------------------- nội dung nhắc --------------------------- */
/* Viết như người thật nhắc nhau, không doạ nạt. Có chuỗi thì nói về chuỗi vì
   đó là thứ người ta sợ mất; chưa có chuỗi thì rủ nhẹ nhàng. */
function loiNhac(chuoi, coLich) {
  if (chuoi >= 2) {
    return {
      title: "Giữ chuỗi " + chuoi + " buổi nhé! 🔥",
      body: "Học 10 phút hôm nay là chuỗi của bạn còn nguyên.",
    };
  }
  if (coLich) {
    return { title: "Hôm nay có buổi học 📘", body: "Mở app làm vài câu cho quen tay nào." };
  }
  return { title: "Ôn Tin học chút nhé 📘", body: "Mười phút mỗi ngày ăn đứt học dồn cuối kỳ." };
}

function createNhac(pool) {
  const r = express.Router();

  /* Trạng thái tính năng: client hỏi trước khi hiện nút bật nhắc. Không cần
     đăng nhập, không cần CSDL — thiếu khoá thì trả bat:false là client tự ẩn. */
  r.get("/nhac/config", (req, res) => {
    res.json({ bat: bat() && !!pool, publicKey: bat() ? cauHinh().pub : "" });
  });

  /* Service worker gọi khi nhận được bản tin đẩy (bản tin không kèm nội dung).
     Nhận diện bằng chính endpoint của đăng ký — thứ chỉ trình duyệt đó có. */
  r.post("/nhac/noidung", async (req, res, next) => {
    try {
      const ep = String((req.body || {}).endpoint || "");
      if (!pool || !ep) return res.json(loiNhac(0, false));
      const f = await pool.query(
        `SELECT s.profile_id, p.days, g.data
           FROM push_subs s
           LEFT JOIN profiles p ON p.id = s.profile_id
           LEFT JOIN gamify   g ON g.profile_id = s.profile_id
          WHERE s.endpoint = $1`, [ep]);
      const row = f.rows[0];
      if (!row) return res.json(loiNhac(0, false));
      const gam = doiTuong(row.data, {});
      const days = doiTuong(row.days, []);
      /* Đã học hôm nay rồi thì tuyệt đối không nhắc "chưa học" — chỉ khen. */
      if (gam.lastSession === ngayVN()) {
        return res.json({ title: "Hôm nay học rồi, giỏi lắm! ✅", body: "Muốn chắc hơn thì làm thêm vài câu ôn.", url: "/hoc" });
      }
      const coLich = !Array.isArray(days) || !days.length || days.map(Number).indexOf(thuVN()) >= 0;
      res.json(Object.assign(loiNhac(Number(gam.streak) || 0, coLich), { url: "/hoc" }));
    } catch (e) { next(e); }
  });

  /* Gác theo TỪNG TUYẾN, tuyệt đối không dùng r.use(): router này gắn chung
     tiền tố /api với các router khác, nên một r.use() ở đây sẽ chặn luôn cả
     /api/auth/register, /api/sync… của những router đăng ký sau nó. */
  function canDangNhap(req, res, next) {
    if (!pool) return res.status(503).json({ error: "Máy chủ chưa nối cơ sở dữ liệu." });
    if (!req.session || !req.session.uid) return res.status(401).json({ error: "Bạn chưa đăng nhập." });
    next();
  }

  /* Bật nhắc / đổi giờ. Gọi lại nhiều lần vô hại (khoá theo endpoint). */
  r.post("/nhac/dangky", canDangNhap, async (req, res, next) => {
    try {
      if (!bat()) return res.status(503).json({ error: "Máy chủ chưa bật tính năng nhắc học." });
      const b = req.body || {};
      const ep = String(b.endpoint || "");
      if (!/^https:\/\//.test(ep) || ep.length > 1000) return res.status(400).json({ error: "Đăng ký không hợp lệ." });
      let gio = Number(b.gio);
      if (!Number.isInteger(gio) || gio < 0 || gio > 23) gio = 19;
      /* Hồ sơ phải là của chính tài khoản này — nhắc theo tiến độ hồ sơ người khác là lộ dữ liệu. */
      let pid = null;
      if (b.profileId) {
        const f = await pool.query("SELECT id FROM profiles WHERE id = $1 AND user_id = $2",
          [Number(b.profileId), req.session.uid]);
        pid = f.rows[0] ? f.rows[0].id : null;
      }
      /* COALESCE chứ không gán thẳng: lần bật sau mà client chưa kịp biết hồ sơ
         nào đang dùng (chưa chọn hồ sơ, vừa đổi máy) thì phải GIỮ hồ sơ cũ.
         Ghi đè bằng null là mất lịch học và chuỗi để đối chiếu — lời nhắc thành
         ra gửi cả vào ngày nghỉ lẫn ngày đã học xong. */
      await pool.query(
        `INSERT INTO push_subs (user_id, profile_id, endpoint, p256dh, auth, gio, bat)
         VALUES ($1,$2,$3,$4,$5,$6,true)
         ON CONFLICT (endpoint) DO UPDATE
           SET user_id = $1, profile_id = COALESCE($2, push_subs.profile_id),
               p256dh = $4, auth = $5, gio = $6, bat = true, loi = 0`,
        [req.session.uid, pid, ep, String(b.p256dh || "").slice(0, 200), String(b.auth || "").slice(0, 100), gio]
      );
      res.json({ ok: true, gio });
    } catch (e) { next(e); }
  });

  r.post("/nhac/tat", canDangNhap, async (req, res, next) => {
    try {
      await pool.query("DELETE FROM push_subs WHERE endpoint = $1 AND user_id = $2",
        [String((req.body || {}).endpoint || ""), req.session.uid]);
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  /* Bật xong bấm thử một cái là biết ngay có chạy không — đỡ phải đợi tới tối
     mới phát hiện quyền thông báo đang bị chặn ở tầng hệ điều hành. */
  r.post("/nhac/thu", canDangNhap, async (req, res, next) => {
    try {
      if (!bat()) return res.status(503).json({ error: "Máy chủ chưa bật tính năng nhắc học." });
      const f = await pool.query(
        "SELECT endpoint FROM push_subs WHERE user_id = $1 AND endpoint = $2",
        [req.session.uid, String((req.body || {}).endpoint || "")]);
      if (!f.rows[0]) return res.status(404).json({ error: "Thiết bị này chưa bật nhắc học." });
      const kq = await gui(f.rows[0].endpoint, cauHinh());
      if (!kq.ok) return res.status(502).json({ error: "Dịch vụ đẩy trả lỗi " + kq.status });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });

  return r;
}

/* pg thật trả JSONB thành object, pg-mem trả chuỗi — chuẩn hoá như server/api.js */
function doiTuong(v, def) {
  if (v == null) return def;
  if (typeof v === "string") { try { return JSON.parse(v); } catch (e) { return def; } }
  return v;
}

/* ======================= bộ đếm giờ gửi nhắc =======================
   Chạy 5 phút một lượt và chỉ xét những đăng ký ĐẶT ĐÚNG GIỜ NÀY, nên một
   người mỗi ngày chỉ vào diện xét trong khoảng một tiếng; cột lan_cuoi chốt
   lại để dù lượt quét chạy 12 lần trong tiếng đó cũng chỉ gửi một lần.

   Ba lớp lọc, thiếu lớp nào là nhắc sai:
     1. đúng giờ người ta chọn
     2. hôm nay có trong LỊCH HỌC của hồ sơ (nghỉ đúng lịch thì không quấy)
     3. hôm nay CHƯA học (đã học rồi mà còn nhắc là phiền, và sai)  */
async function quet(pool, now, fetchFn) {
  if (!pool || !bat()) return { xet: 0, gui: 0 };
  const cfg = cauHinh();
  const gio = gioVN(now).getUTCHours();
  const hnay = ngayVN(now);
  const thu = thuVN(now);

  const f = await pool.query(
    `SELECT s.id, s.endpoint, s.profile_id, p.days, g.data
       FROM push_subs s
       LEFT JOIN profiles p ON p.id = s.profile_id
       LEFT JOIN gamify   g ON g.profile_id = s.profile_id
      WHERE s.bat = true AND s.gio = $1
        AND (s.lan_cuoi IS NULL OR s.lan_cuoi < $2)`, [gio, ngaySQL(now)]);

  let daGui = 0;
  for (const row of f.rows) {
    const gam = doiTuong(row.data, {});
    if (gam.lastSession === hnay) continue;                    // hôm nay học rồi
    const days = doiTuong(row.days, []);
    const coLich = !Array.isArray(days) || !days.length || days.map(Number).indexOf(thu) >= 0;
    if (!coLich) continue;                                     // hôm nay không có lịch

    let kq;
    try { kq = await gui(row.endpoint, cfg, fetchFn); } catch (e) { kq = { ok: false, status: 0 }; }
    if (kq.ok) {
      daGui++;
      await pool.query("UPDATE push_subs SET lan_cuoi = $1, loi = 0 WHERE id = $2", [ngaySQL(now), row.id]);
    } else if (kq.status === 404 || kq.status === 410) {
      /* Trình duyệt báo đăng ký này chết hẳn (gỡ app, xoá dữ liệu trang). */
      await pool.query("DELETE FROM push_subs WHERE id = $1", [row.id]);
    } else {
      /* Lỗi tạm (mạng, 5xx, 429): thử lại lượt sau, hỏng 10 lượt liền thì thôi. */
      await pool.query("UPDATE push_subs SET loi = loi + 1 WHERE id = $1", [row.id]);
      await pool.query("DELETE FROM push_subs WHERE id = $1 AND loi >= 10", [row.id]);
    }
  }
  return { xet: f.rows.length, gui: daGui };
}

function batDauLich(pool) {
  if (!pool || !bat()) {
    console.log("[nhac] Chưa đặt VAPID_PUBLIC/VAPID_PRIVATE — tính năng nhắc học đang tắt.");
    return null;
  }
  const chay = () => quet(pool).then((k) => {
    if (k.gui) console.log("[nhac] Đã gửi " + k.gui + "/" + k.xet + " lời nhắc.");
  }).catch((e) => console.error("[nhac] Lỗi lượt quét:", e && e.message));
  const t = setInterval(chay, 5 * 60 * 1000);
  if (t.unref) t.unref();       // đừng giữ tiến trình sống chỉ vì bộ đếm giờ
  chay();
  console.log("[nhac] Bật nhắc học — quét 5 phút một lượt.");
  return t;
}

module.exports = { createNhac, batDauLich, quet, gui, taoJwt, derSangRaw, khoaKy, loiNhac, ngayVN, thuVN, gioVN, bat };
