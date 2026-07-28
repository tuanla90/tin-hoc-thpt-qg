# Kế hoạch chuyển sang app thương mại (có tài khoản + DB, host Railway)

> Mục tiêu: từ app tĩnh hiện tại → app bán được, có tài khoản học sinh, lưu tiến độ
> trên server, giáo viên giao bài & theo dõi lớp, thu tiền qua mã kích hoạt.
> Nguyên tắc xuyên suốt: **giữ nguyên frontend vanilla JS**, thêm dần backend,
> app vẫn dùng được đầy đủ khi CHƯA đăng nhập (offline-first).

> **✅ TRẠNG THÁI (24/07/2026): Phase 0 + 1 + 2 ĐÃ CODE XONG & TEST.**
> 10/10 test API pass (`npm test`, pg-mem); e2e trình duyệt OK (đăng ký → làm bài
> → xoá máy → đăng nhập lại → tiến độ kéo về đủ). **Đã chốt:** làm cho học sinh
> tự học trước; tạm **FREE toàn bộ nội dung** (chưa gate premium); dùng **pg
> thuần** thay Prisma (đơn giản, không build step). **Còn chờ user:** nối Railway
> (các bước ở Phase 1 bên dưới) và chuyển repo private.

## 1. Hiện trạng (đã khảo sát)

- Frontend thuần vanilla JS, không build step: `index.html` + `js/` (~40 module) + `css/` + `asset/`.
- Nội dung (câu hỏi, bài học SGK, bài tập web/SQL/đồ hoạ) nằm **trong file JS**, sinh bằng sub-agent, version bằng git — workflow này đang tốt, **không nhập DB vội**.
- Tiến độ lưu localStorage, đã tập trung qua `load()/save()` trong `js/app.js:53-55` (key `tinhoc_thpt_v1`: `settings`, `history`, `learned`, `profile`). Gamify lưu riêng (`tinhoc_gam_v1`), vocab lưu `vocabPrefs`.
- Bản ghi lịch sử làm bài (`app.js` ~1580): `{ mode, lessonId, score, correctCount, total, durationSec, timeUp, ... }` — map thẳng sang bảng `attempts`.
- ID nội dung: bài học đã có ID ổn định (`C12-15`…), câu hỏi có (`A-mc-1`…); **`exercises.js` và `web-exercises-data.js` chưa có ID** → việc Phase 0.
- Repo: `github.com/tuanla90/tin-hoc-thpt-qg`. ⚠️ **ĐÃ KIỂM TRA (24/07/2026): repo đang PUBLIC** — toàn bộ ngân hàng câu hỏi/bài giảng tải được tự do → **chuyển private ngay đầu Phase 0** (GitHub → Settings → Danger Zone → Change visibility; Railway vẫn deploy được repo private bình thường).

## 2. Kiến trúc đích

```
┌────────────────────────── Railway project ──────────────────────────┐
│  ┌──────────────────────────────┐      ┌─────────────────────────┐  │
│  │  Web service (Node/Express)  │◄────►│  PostgreSQL (plugin)    │  │
│  │  - Serve static  public/     │      │  users, attempts,       │  │
│  │  - REST API      /api/*      │      │  classes, licenses...   │  │
│  │  - Session cookie auth       │      └─────────────────────────┘  │
│  └──────────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────┘
        ▲  auto-deploy khi push GitHub main
```

**1 service duy nhất** (Express vừa serve static vừa làm API): không CORS, deploy 1 chỗ, rẻ nhất. Frontend giữ nguyên, chỉ thêm 1 lớp gọi API mỏng.

### Stack & lý do chọn

| Thành phần | Chọn | Lý do |
|---|---|---|
| Runtime | Node 22 + Express | Cùng ngôn ngữ JS với frontend, Railway auto-detect |
| DB | PostgreSQL (Railway plugin) | Filesystem Railway không bền → không dùng SQLite; Postgres có backup, `DATABASE_URL` tự inject |
| DB access | `pg` thuần + schema idempotent (đã đổi, bỏ Prisma) | `CREATE TABLE IF NOT EXISTS` chạy lúc khởi động — DB Railway mới tự có đủ bảng, không cần migrate tool/build step; sau này đổi schema thì thêm `ALTER` |
| Auth | Session cookie (`express-session` + `connect-pg-simple`) | Đơn giản hơn JWT cho web cùng origin, revoke được, session lưu Postgres |
| Hash mật khẩu | `bcryptjs` | Thuần JS, không cần node-gyp trên Windows |

### Cấu trúc thư mục đích

```
tin_hoc/
├── package.json, .env.example
├── server/
│   ├── index.js            # Express: static + mount routes
│   ├── prisma/schema.prisma
│   └── routes/  auth.js, progress.js, classes.js, licenses.js, admin.js
├── public/                 # ← TOÀN BỘ frontend hiện tại dời vào đây (giữ nguyên đường dẫn tương đối)
│   ├── index.html, landing.html
│   └── js/  css/  asset/
├── business-onepager.html, doi-chieu-chuong-trinh.html  # tài liệu nội bộ, để ngoài public
└── sach/                   # đã gitignore, giữ nguyên
```

Lưu ý: nếu đang bật GitHub Pages thì giữ Pages đến khi Railway chạy ổn rồi mới tắt (dời file vào `public/` sẽ đổi URL Pages).

## 3. Thiết kế DB (Postgres, v1)

Nội dung câu hỏi/bài học **vẫn ở file JS trong repo**; DB chỉ lưu **người dùng + kết quả + tham chiếu ID**. Sau này phần premium mới chuyển dần vào DB để chống copy.

```sql
users               id, role ('student'|'teacher'|'admin'), email UNIQUE,
                    password_hash, name, track ('khmt'|'udung'|NULL),
                    created_at, last_seen_at
session             (connect-pg-simple tự tạo)

attempts            id, user_id→users, mode ('practice'|'exam'|'web'|'sql'|'graphics'),
                    lesson_id TEXT NULL, score NUMERIC(4,2), correct_count INT,
                    total INT, duration_sec INT, time_up BOOL,
                    detail JSONB,          -- toàn bộ record hiện tại của frontend
                    created_at
lesson_progress     user_id, lesson_id, learned_at, best_ratio NUMERIC(3,2)
                    PRIMARY KEY (user_id, lesson_id)
gamify              user_id PK, data JSONB   -- port nguyên object tinhoc_gam_v1

classes             id, teacher_id→users, name, join_code CHAR(6) UNIQUE, created_at
class_members       class_id, student_id  PRIMARY KEY (class_id, student_id)
assignments         id, class_id→classes, title, item_type, item_ids JSONB,
                    due_at, created_at
submissions         assignment_id, student_id, attempt_id→attempts, submitted_at
                    PRIMARY KEY (assignment_id, student_id)

licenses            id, code UNIQUE, plan ('student_year'|'class_year'),
                    seats INT DEFAULT 1, expires_at,
                    activated_by→users NULL, activated_at NULL, note
```

Quyền premium của 1 user = tồn tại license `activated_by = user.id` (hoặc user thuộc lớp có license `class_year`) còn hạn.

## 4. Lộ trình theo phase

### Phase 0 — Chuẩn hoá ✅ XONG (24/07/2026)
- [x] Dời frontend vào `public/` (`git mv`; `sach/` cũng dời vào `public/sach/`, vẫn gitignore nên KHÔNG deploy — ảnh SGK có `onerror` ẩn êm trên bản web).
- [ ] ~~Gán ID cho `exercises.js`, `web-exercises-data.js`~~ → HOÃN sang Phase 3 (chỉ cần khi giao bài tập).
- [ ] Chuyển repo private — **user tự làm** (cần máy có tài khoản GitHub).

### Phase 1 — Backend skeleton + deploy Railway ✅ CODE XONG — còn bước nối Railway (user làm)
- [x] `server/` Express: serve `public/` + `GET /api/health`; `npm start`; test `npm test`.
- [x] Chạy local không cần Postgres: `.env` với `DATABASE_URL=pgmem` (DB giả lập RAM để thử tài khoản) hoặc bỏ trống (chỉ trang tĩnh, API trả 503).
- [ ] **Railway (làm 1 lần, ~10 phút):**
  1. New Project → **Deploy from GitHub repo** → chọn repo này (auto-deploy nhánh `main` bật sẵn).
  2. Trong project: **+ New → Database → PostgreSQL**.
  3. Vào service web → tab **Variables** → thêm:
     - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (chọn kiểu *Variable Reference* trỏ sang service Postgres)
     - `SESSION_SECRET` = chuỗi ngẫu nhiên dài (gõ bừa ~40 ký tự)
  4. Settings → Networking → **Generate Domain** để lấy URL public.
- **Xong khi**: mở `https://<app>.up.railway.app` thấy app + đăng ký được tài khoản.

### Phase 2 — Tài khoản + đồng bộ tiến độ ✅ XONG (24/07/2026) ← giá trị lõi
- [x] Schema idempotent trong `server/db.js`: `users`, `attempts` (UNIQUE user+client_ts chống trùng), `learned`, `gamify` (JSONB), bảng `session` (connect-pg-simple tự tạo).
- [x] API: `POST /api/auth/register|login|logout`, `GET /api/me`, `GET /api/sync`, `POST /api/attempts` (đơn + bulk), `PUT /api/learned|gamify|profile`. Giới hạn 30 lượt auth/10 phút/IP. Thông báo lỗi tiếng Việt.
- [x] Frontend `public/js/account.js`: view Tài khoản (nav mới, route `#/account`), đăng nhập/đăng ký, chấm xanh trên nav khi đã đăng nhập, nút Đồng bộ ngay/Đăng xuất.
- [x] Hook **một chỗ** trong `save()` (app.js): đẩy fire-and-forget khi có thay đổi; gamify đẩy định kỳ 60s + debounce.
- [x] Trộn khi đăng nhập: learned = hợp; history = gộp theo `at`; gamify = bên XP cao thắng; profile = local có tên thì thắng. Server giữ đủ 500 attempts gần nhất, local vẫn cắt 50.
- [x] Test: 10/10 API test (pg-mem); e2e trình duyệt: đăng ký → hoạt động học → xoá sạch máy → đăng nhập → dữ liệu về đủ, trang Kết quả hiển thị đúng, 0 lỗi console.
- **Đã đạt tiêu chí**: làm đề trên máy A, đăng nhập máy B thấy đủ lịch sử + bài đã học.

### Phase 3 — Giáo viên & lớp học (2–3 buổi) ← điểm bán cho kênh GV
- [ ] GV tạo lớp → app sinh `join_code` 6 ký tự → HS nhập mã vào lớp.
- [ ] GV giao bài: chọn bài học/bộ câu hỏi/đề thử + hạn nộp; HS thấy mục "Bài tập được giao"; nộp = attempt gắn vào `submissions`.
- [ ] Dashboard GV: bảng HS × bài tập (điểm, chưa làm, trễ hạn); xuất CSV.
- **Xong khi**: 1 GV + 2 HS demo trọn luồng giao–làm–xem.

### Phase 4 — Thu tiền (1–2 buổi cho bản thủ công)
- [x] Chốt ranh giới **free vs premium** (28/07/2026) — xem bảng ngay dưới. Nguyên tắc đã chốt: **Free = toàn bộ phần HỌC; mọi nhóm luyện/ôn đều có hạn mức.** (Bỏ hướng cũ "khoá theo lớp" — khách chính là HS 12, khoá lớp 12 là chặn đúng người mua ngay ngày đầu; khoá phần luyện thì cả HS 10–11 ôn kiểm tra trên lớp cũng có lý do nâng cấp.)

#### Ranh giới Free/Premium (chốt 28/07/2026)

Tư tưởng: **free là sản phẩm hoàn chỉnh để HỌC, premium là bộ tăng tốc để LUYỆN & THI.**
Một HS học đều mỗi ngày (đọc bài + quiz cuối bài) gần như không chạm trần; cứ chuyển
sang chế độ "cày" (ôn kiểm tra giữa/cuối kì lớp 10–11, ôn thi TN lớp 12) là chạm — upsell
đúng lúc người dùng đang cần nhất.

| Nhóm | Free | Premium |
|---|---|---|
| **Phần HỌC**: 119 bài lý thuyết + concept lab trong trang bài + từ vựng/flashcard (325 thuật ngữ) + gamify (XP/huy hiệu/streak) + đồng bộ thiết bị | Toàn bộ, không giới hạn | Toàn bộ |
| Sân chơi tự do (playground Python/HTML/SQL/đồ hoạ — không chấm) | Toàn bộ (không tốn gì, là mồi trải nghiệm; có thể siết sau nếu thấy cần) | Toàn bộ |
| **Quỹ câu luyện có chấm/ngày** — gồm: quiz cuối bài, trung tâm Luyện tập (theo bài/chương/chủ đề/lớp), Luyện nhanh 10 câu, Luyện Đúng/Sai | **30 câu/ngày** (đủ nhịp học hằng ngày + đạt mục tiêu 80 XP; cày ôn kiểm tra là hết) | Không giới hạn |
| Tab **"Chỗ yếu"** + luyện theo chỗ yếu | Khoá (radar năng lực vẫn XEM được — làm teaser) | Đầy đủ |
| **Thi thử** (không tính vào quỹ câu) | 3 đề cố định: TC1 + mã 101, 102 (làm lại thoải mái) | 13 đề + đề random không giới hạn |
| **Xưởng thực hành có chấm** (327 bài) | ~15% bài đầu mỗi xưởng: Python 20/151 · Web 8/49 · SQL 6/40 · Đồ hoạ 3/13 (concept lab thuộc phần học, free hết) | Toàn bộ |
| **Gia sư AI** (cả "Vì sao tôi sai?") | 5 lượt/ngày (`AI_FREE_PER_DAY`, đã enforce server) | 50 lượt/ngày + nút "giải thích kỹ hơn" (model sâu) CHỈ premium |
| Hồ sơ học tập trong 1 tài khoản | 1 hồ sơ | 3 hồ sơ (nhà 2 con, GV dùng thử) |

Điểm chạm bán hàng (chỉ hiện khi user vừa cảm nhận giá trị, **không bao giờ chặn giữa một bài đang làm**):
1. Hết quỹ 30 câu/ngày → modal "Nâng cấp để luyện không giới hạn" (kèm số câu đã làm hôm nay).
2. Bấm đề khoá ở màn Thi thử → hiện điểm các đề đã làm + "mở 10 đề còn lại".
3. Bấm bài thực hành khoá / tab Chỗ yếu → modal upsell chung.
4. Hết 5 lượt AI → "Nạp để hỏi tiếp 50 lượt/ngày".

Ghi chú thực thi (độ kín):
- **AI**: enforce server-side sẵn rồi — chỉ cần `hanMuc()` (`server/tutor.js`) đọc plan từ `licenses` thay vì mặc định free. Kín 100%.
- **Quỹ câu/ngày**: đếm client theo hồ sơ (localStorage) + đối chiếu server qua `attempts` đã sync (app đã bắt buộc đăng nhập). Kín ~95%, đủ dùng.
- **Đề cố định / xưởng / Chỗ yếu**: nội dung đang nằm trong JS public → giai đoạn đầu chỉ **khoá UI** (đủ với tuyệt đại đa số HS); chuyển nội dung premium sang API có auth ở bước "chống copy dần" bên dưới.
- **Rủi ro cần theo dõi**: quỹ câu/ngày cắt vào vòng lặp giữ chân (XP/streak) — sau khi bật, theo dõi tỉ lệ quay lại; nếu rớt thì nới 30 → 50 câu/ngày TRƯỚC khi nghĩ cách khác.

Thứ tự triển khai gate (sau khi có bảng `licenses`):
1. Hàm chung `getPlan(userId)` server + `GET /api/me` trả thêm `plan`.
2. Nối `hanMuc()` của tutor vào đó (xoá TODO có sẵn).
3. Frontend: helper `Plan.has(...)` + khoá 4 điểm móc có sẵn: `EXAM_CODES`/`MOCK_EXAMS` (exam-modes.js), quỹ câu trong `newQuiz`/`doSubmit` (app.js), cụm `injectExercises/injectSqlExercises/injectWebExercises/injectGraphicsLab` (app.js), tab Chỗ yếu (`PRACTICE_TABS`). 1 modal upsell dùng chung.
4. Màn nhập mã kích hoạt trong trang Tài khoản + trang admin mini tạo mã (mục dưới).

Giá: theo khung `business-onepager.html` (~249k/năm học); cân nhắc thêm **gói nước rút 2–3 tháng** giá thấp cho HS 12 vào muộn (tháng 4–6) — mùa vụ môn này rất rõ, chỉ có gói năm sẽ mất nhóm đơn này.
- [ ] Bán **mã kích hoạt**: khách chuyển khoản VietQR/Momo cá nhân → gửi mã qua Zalo → nhập mã trong app (`POST /api/licenses/activate`). Chưa cần cổng thanh toán, chưa cần pháp nhân.
- [ ] Trang admin mini (role `admin`): tạo lô mã, xem user/doanh số.
- [ ] Sau khi có doanh thu đều: tích hợp xác nhận chuyển khoản tự động (SePay/Casso webhook — phí thấp, hợp cá nhân) hoặc PayOS.
- [ ] Chống copy dần: chuyển các file JS nội dung premium sang serve qua endpoint có auth.
- **Xong khi**: người lạ tự mua → kích hoạt → mở khoá, không cần mình can thiệp ngoài gửi mã.

### Phase 5 — Vận hành (song song, mỗi thứ 30')
- [ ] Backup: bật backup Postgres của Railway + cron `pg_dump` hàng tuần về máy.
- [ ] Uptime monitor miễn phí (UptimeRobot) trỏ `/api/health`.
- [ ] Trang Điều khoản + Quyền riêng tư (HS vị thành niên → thu thập tối thiểu: tên hiển thị + email; tham chiếu NĐ 13/2023/NĐ-CP).
- [ ] Domain riêng (~300k/năm) trỏ vào Railway.

## 5. Chi phí ước tính

| Khoản | Tiền |
|---|---|
| Railway Hobby (gồm $5 usage) | $5/tháng, giai đoạn đầu web+Postgres thường ~$5–10/tháng |
| Domain .vn hoặc .com | ~200–600k/năm |
| Cổng thanh toán (khi cần) | SePay/Casso ~100–200k/tháng, thu phí khi đã có doanh thu |

## 6. Rủi ro & nguyên tắc

1. **Repo public = mất tài sản** — kiểm tra ngay đầu Phase 0.
2. **Đừng nhập nội dung vào DB sớm** — mất workflow sinh nội dung bằng sub-agent + git đang rất hiệu quả. DB chỉ giữ người dùng/kết quả.
3. **Sync giữ tối giản** — attempts append-only, learned lấy hợp, KHÔNG làm sync 2 chiều phức tạp.
4. **Không ép đăng nhập** — bản free dùng thoải mái không tài khoản; đăng nhập = lưu tiến độ đa thiết bị (mồi tự nhiên để tạo tài khoản).
5. Gamify (XP/huy hiệu) tạm để local, sync sau — không chặn phase nào.

## 7. Cần anh/chị chốt (không chặn Phase 0–1)

1. **Bán cho ai trước?** Đề xuất: HS tự học trước (Phase 2 xong là bán được), gói GV theo lớp sau (Phase 3).
2. ~~Ranh giới free/premium~~ ✅ **đã chốt 28/07/2026** — bảng chi tiết trong Phase 4 (free = toàn bộ phần học; luyện/thi/thực hành/AI có hạn mức).
3. **Giá** — theo khung trong `business-onepager.html`; còn cần chốt giá gói nước rút (nếu làm).
