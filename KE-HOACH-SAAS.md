# Kế hoạch chuyển sang app thương mại (có tài khoản + DB, host Railway)

> Mục tiêu: từ app tĩnh hiện tại → app bán được, có tài khoản học sinh, lưu tiến độ
> trên server, giáo viên giao bài & theo dõi lớp, thu tiền qua mã kích hoạt.
> Nguyên tắc xuyên suốt: **giữ nguyên frontend vanilla JS**, thêm dần backend,
> app vẫn dùng được đầy đủ khi CHƯA đăng nhập (offline-first).

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
| ORM | Prisma | Migration rõ ràng, client JS dễ dùng, chạy tốt trên Railway |
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

### Phase 0 — Chuẩn hoá (1 buổi, chưa đụng server)
- [ ] Gán ID ổn định cho `exercises.js`, `web-exercises-data.js` (bài SQL/đồ hoạ kiểm tra luôn thể).
- [ ] Dời frontend vào `public/` (đường dẫn tương đối giữ nguyên → không sửa HTML).
- [ ] Kiểm tra repo public/private; nếu public → chuyển private (Settings → Danger Zone).
- **Xong khi**: mở `public/index.html` chạy y như cũ.

### Phase 1 — Backend skeleton + deploy Railway (1 buổi)
- [ ] `npm init -y; npm install express` — `server/index.js` serve `public/` + `GET /api/health`.
- [ ] Railway: New Project → Deploy from GitHub repo → add **PostgreSQL** plugin.
- [ ] Biến môi trường service web: `SESSION_SECRET` (chuỗi ngẫu nhiên dài), `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (reference variable), `NODE_ENV=production`.
- [ ] Bật auto-deploy nhánh `main` (khớp workflow commit+push hiện tại).
- **Xong khi**: mở `https://<app>.up.railway.app` thấy app y như bản local.

### Phase 2 — Tài khoản + đồng bộ tiến độ (2–3 buổi) ← giá trị lõi
- [ ] Prisma schema (users, attempts, lesson_progress, gamify) + `prisma migrate deploy` trong lệnh start.
- [ ] API: `POST /api/auth/register|login|logout`, `GET /api/me`; `POST /api/attempts`; `GET /api/sync` (kéo toàn bộ tiến độ); `PUT /api/learned`.
- [ ] Frontend: view Đăng nhập/Đăng ký (thêm 1 view trong `app.js`, UI theo style sẵn có).
- [ ] Sửa **một chỗ** `save()` trong `app.js`: sau khi lưu local, nếu đã đăng nhập → đẩy lên server (fire-and-forget). Khi login trên máy mới: kéo `GET /api/sync` về, merge (learned = hợp 2 tập; history = gộp theo thời gian; attempts là append-only nên không xung đột).
- [ ] Bỏ giới hạn `history.slice(0, 50)` phía server (server giữ đủ, local vẫn cắt 50).
- **Xong khi**: làm đề trên máy A, đăng nhập máy B thấy đủ lịch sử + bài đã học.

### Phase 3 — Giáo viên & lớp học (2–3 buổi) ← điểm bán cho kênh GV
- [ ] GV tạo lớp → app sinh `join_code` 6 ký tự → HS nhập mã vào lớp.
- [ ] GV giao bài: chọn bài học/bộ câu hỏi/đề thử + hạn nộp; HS thấy mục "Bài tập được giao"; nộp = attempt gắn vào `submissions`.
- [ ] Dashboard GV: bảng HS × bài tập (điểm, chưa làm, trễ hạn); xuất CSV.
- **Xong khi**: 1 GV + 2 HS demo trọn luồng giao–làm–xem.

### Phase 4 — Thu tiền (1–2 buổi cho bản thủ công)
- [ ] Chốt ranh giới **free vs premium** (đề xuất: lớp 10–11 + một phần lớp 12 free; toàn bộ lớp 12 + đề thi thử không giới hạn + xưởng thực hành = premium — chốt cùng `business-onepager.html`).
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
2. **Ranh giới free/premium** cụ thể (mục Phase 4).
3. **Giá** — theo khung trong `business-onepager.html`.
