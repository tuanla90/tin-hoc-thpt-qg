/* ============================================================================
 *  GIA SƯ AI — POST /api/tutor
 *
 *  NGUYÊN TẮC KHÔNG ĐƯỢC PHÁ:
 *  1. Khoá API chỉ nằm ở máy chủ. Trình duyệt KHÔNG BAO GIỜ gọi thẳng nhà cung
 *     cấp AI.
 *  2. Ngữ cảnh (nội dung bài, đề bài, đáp án) do MÁY CHỦ tự dựng từ `lessonId`
 *     / `questionId`. Không nhận nội dung bài do trình duyệt gửi lên — nếu nhận
 *     thì ai cũng nhét văn bản tuỳ ý và biến app thành chatbot chung miễn phí.
 *  3. Không nhận `system` từ trình duyệt.
 *
 *  Trả lời theo kiểu chảy dần (mỗi dòng một JSON — NDJSON) để chữ hiện ra ngay
 *  thay vì đợi cả đoạn:
 *     {"t":"…"}            một mẩu chữ
 *     {"loi":"…"}          lỗi giữa chừng
 *     {"xong":true,"conLai":n}
 * ==========================================================================*/
const express = require("express");
const { aiConfig, aiChat } = require("./ai");
const { layBai, layCau, layBaiTap, noiDungBai, noiDungCau, noiDungBaiTap, danhMucBai } = require("./lessons");

const TOI_DA_HOI = 500;      // ký tự một câu hỏi
const TOI_DA_LICH_SU = 6;    // lượt hội thoại gửi kèm
const TOI_DA_LUU = 4000;     // ký tự câu trả lời lưu vào nhật ký
const TOI_DA_CODE = 3000;    // ký tự bài làm gửi kèm
const TOI_DA_KETQUA = 800;   // ký tự kết quả chạy / thông báo lỗi
const LOAI_BT = ["python", "sql", "web"];

/* Quy tắc 1 đổi theo chế độ: đang mở bài thì bám nội dung bài; hỏi chung (từ
   robot trợ lý, không mở bài nào) thì rào theo phạm vi MÔN HỌC và danh mục bài. */
function luat(coBai) {
  return `Quy tắc:
1. ${coBai
    ? "CHỈ trả lời dựa trên nội dung bài ở trên. Hỏi ngoài phạm vi thì nói thẳng là bài này không bàn tới, chỉ tên chủ đề/bài có nội dung đó rồi mời họ mở bài ấy."
    : "CHỈ trả lời câu hỏi thuộc chương trình Tin học THPT. Chuyện ngoài môn học thì từ chối nhẹ nhàng rồi kéo về việc ôn thi. Nếu chủ đề nằm trong một bài ở danh mục trên, trả lời ngắn gọn rồi mời họ mở bài đó để hỏi sâu hơn."}
2. KHÔNG làm hộ bài tập. Gợi ý từng bước, hỏi ngược lại để họ tự nghĩ.
3. Giải thích dễ hiểu, xưng "mình" và gọi người học là "bạn", KHÔNG trẻ con hoá. Thuật ngữ tiếng Anh kèm nghĩa tiếng Việt.
4. Trả lời ngắn (dưới 200 chữ) trừ khi được yêu cầu nói kỹ.
5. Nếu bài có ví dụ code, ưu tiên giải thích bằng chính ví dụ đó.
6. Viết bằng tiếng Việt, dùng markdown đơn giản (in đậm, gạch đầu dòng, khối code).`;
}

/* Ghép prompt hệ thống từ những mảnh MÁY CHỦ tự tra được.
   `cau` chỉ có ở chế độ "vì sao tôi sai"; `bt` chỉ có ở chế độ gợi ý bài code. */
function dungSystem(bai, cau, daChon, bt) {
  const p = ["Bạn là gia sư môn Tin học THPT, đang kèm một người TỰ HỌC ôn thi tốt nghiệp.", ""];
  if (bai) {
    p.push(noiDungBai(bai, bt ? 3500 : 7000)); // có bài tập thì để dành chỗ cho code
  } else {
    p.push("BÀI ĐANG HỌC: (không mở bài nào — người học hỏi nhanh trong lúc ôn)");
    p.push("", "DANH MỤC BÀI HỌC TRONG ỨNG DỤNG (để chỉ người học mở đúng bài khi cần):", danhMucBai());
  }
  if (cau) {
    p.push("", "─────────", "Người học vừa làm câu hỏi sau và muốn hiểu vì sao mình sai:", noiDungCau(cau, daChon),
      "", "Hãy chỉ ra chỗ hiểu nhầm dẫn tới lựa chọn sai đó, rồi giảng lại ý đúng. Đừng chỉ nhắc lại đáp án.");
  }
  if (bt) {
    p.push("", "─────────", noiDungBaiTap(bt.loai, bt.de, bt.code, bt.ketQua, bt.loi));
  }
  p.push("", "─────────", luat(!!bai));
  if (bt) p.push("7. Đây là bài thực hành: TUYỆT ĐỐI không đưa đáp án hoàn chỉnh. Mỗi lượt chỉ gỡ MỘT nút thắt rồi mời học sinh chạy lại.");
  return p.join("\n");
}

/* Bỏ lượt rỗng/spam; chỉ giữ role hợp lệ và cắt độ dài. */
function locLichSu(ls) {
  if (!Array.isArray(ls)) return [];
  return ls
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-TOI_DA_LICH_SU)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 2000),
    }));
}

function hopLe(hoi) {
  const s = String(hoi || "").trim();
  if (s.length < 2) return "";
  if (/^(.)\1{9,}$/.test(s.replace(/\s/g, ""))) return ""; // gõ một ký tự lặp
  return s.slice(0, TOI_DA_HOI);
}

function ngayHomNay() {
  // Theo giờ Việt Nam để "mỗi ngày" đúng cảm nhận người dùng, không lệ thuộc giờ máy chủ.
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

/* Chặn theo IP: hạn mức mỗi ngày tính theo TÀI KHOẢN, nhưng một người có thể lập
   hàng loạt tài khoản. Bộ đếm trong RAM (mất khi restart — chấp nhận được, đây là
   lớp chắn thứ hai chứ không phải lớp chính). */
function chanTheoIp(max, cuaSoMs) {
  const dem = new Map();
  return function (req, res, next) {
    const now = Date.now();
    const key = req.ip || "?";
    let h = dem.get(key);
    if (!h || now - h.t0 > cuaSoMs) { h = { t0: now, n: 0 }; dem.set(key, h); }
    h.n++;
    if (dem.size > 5000) dem.clear();
    if (h.n > max) {
      return res.status(429).json({ error: "Bạn hỏi hơi dày rồi, nghỉ vài phút rồi hỏi tiếp nhé." });
    }
    next();
  };
}

function createTutor(pool) {
  const r = express.Router();
  const q = (text, params) => pool.query(text, params);

  r.use("/tutor", (req, res, next) => {
    if (!pool) return res.status(503).json({ on: false, error: "Máy chủ chưa nối cơ sở dữ liệu." });
    next();
  });

  /* Hạng tài khoản: tạm thời mọi người là "miễn phí"; khi bán hàng sẽ đọc từ
     users.profile->>'plan'. Tách hàm để chỗ khác không phải sửa. */
  function hanMuc(user) {
    const cfg = aiConfig();
    const plan = (user && user.profile && user.profile.plan) || "free";
    return plan === "paid" ? cfg.paidPerDay : cfg.freePerDay;
  }

  async function daDung(uid) {
    const f = await q("SELECT so_luot FROM tutor_usage WHERE user_id = $1 AND ngay = $2", [uid, ngayHomNay()]);
    return f.rows[0] ? Number(f.rows[0].so_luot) : 0;
  }

  async function themLuot(uid, buoc) {
    await q(
      `INSERT INTO tutor_usage (user_id, ngay, so_luot) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, ngay) DO UPDATE SET so_luot = tutor_usage.so_luot + $3`,
      [uid, ngayHomNay(), buoc]
    );
  }

  function requireAuth(req, res, next) {
    if (!req.session || !req.session.uid) return res.status(401).json({ error: "Bạn chưa đăng nhập." });
    next();
  }

  /* Giao diện hỏi trước để biết có hiện nút "Hỏi gia sư" không, còn bao nhiêu lượt.
     KHÔNG trả về tên nhà cung cấp/model — người dùng không cần biết. */
  r.get("/tutor/status", async (req, res, next) => {
    try {
      const cfg = aiConfig();
      if (!cfg.ready) return res.json({ on: false });
      if (!req.session || !req.session.uid) return res.json({ on: true, dangNhap: false });
      const u = await q("SELECT profile FROM users WHERE id = $1", [req.session.uid]);
      const max = hanMuc(u.rows[0]);
      const dung = await daDung(req.session.uid);
      res.json({ on: true, dangNhap: true, hanMuc: max, conLai: Math.max(0, max - dung) });
    } catch (e) { next(e); }
  });

  const ipLimit = chanTheoIp(Number(process.env.AI_IP_PER_HOUR || 60), 60 * 60 * 1000);

  r.post("/tutor", ipLimit, requireAuth, async (req, res, next) => {
    try {
      const cfg = aiConfig();
      if (!cfg.ready) return res.status(503).json({ error: "Gia sư AI chưa được bật trên máy chủ." });

      const b = req.body || {};
      const hoi = hopLe(b.question);
      if (!hoi) return res.status(400).json({ error: "Bạn nhập câu hỏi trước nhé." });

      /* Ngữ cảnh dựng ở máy chủ — chỉ nhận ID từ trình duyệt. */
      const bai = b.lessonId ? layBai(b.lessonId) : null;
      const cau = b.questionId ? layCau(b.questionId) : null;
      if (b.lessonId && !bai) return res.status(400).json({ error: "Không tìm thấy bài học này." });
      if (b.questionId && !cau) return res.status(400).json({ error: "Không tìm thấy câu hỏi này." });

      /* Chế độ gợi ý bài thực hành: đề bài + đáp án mẫu tra từ máy chủ, chỉ có
         BÀI LÀM là của trình duyệt (không còn nguồn nào khác) nên cắt độ dài. */
      let bt = null;
      if (b.exLoai != null || b.exIndex != null) {
        const loai = LOAI_BT.includes(String(b.exLoai)) ? String(b.exLoai) : null;
        const de = loai ? layBaiTap(loai, b.lessonId, b.exIndex) : null;
        if (!de) return res.status(400).json({ error: "Không tìm thấy bài thực hành này." });
        bt = {
          loai, de,
          code: String(b.code || "").slice(0, TOI_DA_CODE),
          ketQua: String(b.ketQua || "").slice(0, TOI_DA_KETQUA),
          loi: String(b.loi || "").slice(0, TOI_DA_KETQUA),
        };
      }
      /* Không có bài lẫn câu hỏi = chế độ HỎI CHUNG (từ robot trợ lý). Vẫn phải
         đăng nhập, vẫn trừ lượt như thường, và prompt tự rào trong phạm vi môn
         Tin học THPT — nên không thành chatbot chung miễn phí. */

      /* Hồ sơ (nếu có) chỉ dùng để ghi nhật ký, phải thuộc đúng tài khoản. */
      let profileId = null;
      if (b.profileId) {
        const p = await q("SELECT id FROM profiles WHERE id = $1 AND user_id = $2", [Number(b.profileId), req.session.uid]);
        profileId = p.rows[0] ? p.rows[0].id : null;
      }

      const u = await q("SELECT profile FROM users WHERE id = $1", [req.session.uid]);
      const max = hanMuc(u.rows[0]);
      const dung = await daDung(req.session.uid);
      if (dung >= max) {
        return res.status(429).json({
          error: "Hôm nay bạn đã dùng hết " + max + " lượt hỏi gia sư. Mai lượt được cấp lại nhé.",
          hetLuot: true, hanMuc: max,
        });
      }
      await themLuot(req.session.uid, 1); // trừ trước để không bị lách bằng cách ngắt giữa chừng

      const system = dungSystem(bai, cau, b.daChon, bt);
      const messages = locLichSu(b.history).concat([{ role: "user", content: hoi }]);

      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Accel-Buffering", "no"); // proxy đừng gom lại rồi mới trả
      if (res.flushHeaders) res.flushHeaders();

      const huy = new AbortController();
      req.on("close", () => { if (!res.writableEnded) huy.abort(); });

      let traLoi = "";
      try {
        await aiChat({
          system, messages, deep: !!b.deep, maxTokens: b.deep ? 1200 : 700,
          signal: huy.signal,
          onText(t) {
            traLoi += t;
            if (!res.writableEnded) res.write(JSON.stringify({ t }) + "\n");
          },
        });
      } catch (e) {
        if (!traLoi) await themLuot(req.session.uid, -1); // chưa nói được chữ nào thì hoàn lượt
        console.error("[tutor] Lỗi gọi AI:", e.status || "", e.message, e.chiTiet || "");
        if (!res.writableEnded) res.write(JSON.stringify({ loi: e.message || "Gia sư đang bận, thử lại sau." }) + "\n");
      }

      if (traLoi) {
        try {
          await q(
            `INSERT INTO tutor_log (user_id, profile_id, kieu, lesson_id, question_id, cau_hoi, tra_loi)
             VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [req.session.uid, profileId, bt ? "exercise" : cau ? "wrong" : bai ? "lesson" : "general", bai ? bai.id : null,
             cau ? cau.id : null, hoi, traLoi.slice(0, TOI_DA_LUU)]
          );
        } catch (e) { console.error("[tutor] Không ghi được nhật ký:", e.message); }
      }

      const conLai = Math.max(0, max - (await daDung(req.session.uid)));
      if (!res.writableEnded) res.end(JSON.stringify({ xong: true, conLai }) + "\n");
    } catch (e) {
      if (res.headersSent) { try { res.end(); } catch (_) {} return; }
      next(e);
    }
  });

  return r;
}

module.exports = { createTutor, dungSystem, locLichSu, hopLe };
