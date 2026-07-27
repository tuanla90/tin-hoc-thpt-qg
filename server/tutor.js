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
const { layBai, layCau, noiDungBai, noiDungCau } = require("./lessons");

const TOI_DA_HOI = 500;      // ký tự một câu hỏi
const TOI_DA_LICH_SU = 6;    // lượt hội thoại gửi kèm
const TOI_DA_LUU = 4000;     // ký tự câu trả lời lưu vào nhật ký

const LUAT = `Quy tắc:
1. CHỈ trả lời dựa trên nội dung bài ở trên. Hỏi ngoài phạm vi thì nói thẳng là bài này không bàn tới, chỉ tên chủ đề/bài có nội dung đó rồi mời họ mở bài ấy.
2. KHÔNG làm hộ bài tập. Gợi ý từng bước, hỏi ngược lại để họ tự nghĩ.
3. Giải thích dễ hiểu, xưng "mình" và gọi người học là "bạn", KHÔNG trẻ con hoá. Thuật ngữ tiếng Anh kèm nghĩa tiếng Việt.
4. Trả lời ngắn (dưới 200 chữ) trừ khi được yêu cầu nói kỹ.
5. Nếu bài có ví dụ code, ưu tiên giải thích bằng chính ví dụ đó.
6. Viết bằng tiếng Việt, dùng markdown đơn giản (in đậm, gạch đầu dòng, khối code).`;

/* Ghép prompt hệ thống. `bai` luôn có; `cau` chỉ có ở chế độ "vì sao tôi sai". */
function dungSystem(bai, cau, daChon) {
  const p = ["Bạn là gia sư môn Tin học THPT, đang kèm một người TỰ HỌC ôn thi tốt nghiệp.", ""];
  if (bai) {
    p.push(noiDungBai(bai));
  } else {
    p.push("BÀI ĐANG HỌC: (người học đang ôn luyện, không mở bài cụ thể nào)");
  }
  if (cau) {
    p.push("", "─────────", "Người học vừa làm câu hỏi sau và muốn hiểu vì sao mình sai:", noiDungCau(cau, daChon),
      "", "Hãy chỉ ra chỗ hiểu nhầm dẫn tới lựa chọn sai đó, rồi giảng lại ý đúng. Đừng chỉ nhắc lại đáp án.");
  }
  p.push("", "─────────", LUAT);
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

  r.post("/tutor", requireAuth, async (req, res, next) => {
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
      if (!bai && !cau) return res.status(400).json({ error: "Thiếu bài học để hỏi." });

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

      const system = dungSystem(bai, cau, b.daChon);
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
            [req.session.uid, profileId, cau ? "wrong" : "lesson", bai ? bai.id : null,
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
