# Cài app ra màn hình chính & Nhắc học — hướng dẫn tích hợp

Hai tính năng đi liền nhau nên viết chung một tài liệu: **iPhone chỉ cho phép
nhận thông báo đẩy khi trang đã được cài ra màn hình chính**. Bỏ phần PWA thì
mất luôn một nửa người dùng của phần nhắc học.

Đọc theo thứ tự: mục 1–2 là việc phải làm để bật lên, mục 3–5 là hiểu và chỉnh,
mục 6 là khi có sự cố.

---

## 1. Bật lên (khoảng 5 phút)

### Bước 1 — Sinh cặp khoá VAPID

```bash
node scripts/vapid.js
```

In ra ba dòng. Khoá này là **danh tính của máy chủ** đối với dịch vụ đẩy của
Google/Apple/Mozilla — họ dùng nó để biết bản tin thật sự đến từ mình.

> ⚠️ **Sinh một lần rồi cất kỹ.** Đổi khoá là **mọi thiết bị đã bật nhắc phải
> bật lại**, vì đăng ký của trình duyệt gắn chặt với khoá công khai lúc tạo.
> Đừng chạy lại script này mỗi lần deploy.
>
> Cặp khoá đang nằm trong `.env` ở máy làm việc chỉ để chạy thử — **không dùng
> cho bản chạy thật**.

### Bước 2 — Dán vào Railway

Vào service web → **Variables** → thêm ba biến:

| Biến | Giá trị |
|---|---|
| `VAPID_PUBLIC` | dòng `VAPID_PUBLIC=…` script vừa in |
| `VAPID_PRIVATE` | dòng `VAPID_PRIVATE=…` — **giữ như mật khẩu** |
| `VAPID_SUB` | `mailto:tuanla.company@gmail.com` (dịch vụ đẩy liên hệ khi có sự cố) |

Railway tự deploy lại. Thiếu khoá thì **không hỏng gì cả** — tính năng tự tắt,
nút "Bật nhắc học" không hiện ra, phần còn lại của app chạy bình thường.

### Bước 3 — Xác nhận máy chủ đã bật

Xem log Railway, phải thấy:

```
[nhac] Bật nhắc học — quét 5 phút một lượt.
```

Nếu thấy `[nhac] Chưa đặt VAPID_PUBLIC/VAPID_PRIVATE — tính năng nhắc học đang tắt.`
thì biến chưa vào (gõ sai tên biến, hoặc chưa deploy lại).

Kiểm nhanh từ trình duyệt: mở `https://<tên-miền>/api/nhac/config` phải trả
`{"bat":true,"publicKey":"B…"}`.

---

## 2. Kiểm tra trên máy thật

Phần này **bắt buộc làm bằng điện thoại thật**. Môi trường phát triển chặn sẵn
quyền thông báo nên không thay thế được.

### Android (Chrome)

1. Mở `https://<tên-miền>/hoc` → học xong 2 bài → hiện thanh **"Cài app ra màn
   hình chính"** → bấm **Cài**.
2. Học thêm 1 bài nữa → hiện thanh **"Nhắc bạn học mỗi tối?"** → bấm **Bật** →
   Chrome hỏi quyền → **Cho phép**.
3. Vào **Tài khoản → 🔔 Nhắc học** → bấm **Gửi thử**. Thông báo phải hiện trong
   vài giây, bấm vào là mở đúng app.

### iPhone / iPad (Safari)

1. Mở trang → bấm nút **Chia sẻ** ở thanh dưới → **Thêm vào MH chính**.
2. **Mở app từ biểu tượng vừa tạo** (không phải từ Safari — mở từ Safari thì
   iOS không cho đăng ký đẩy).
3. Vào **Tài khoản → 🔔 Nhắc học → Bật nhắc học** → **Gửi thử**.

Nếu thẻ Nhắc học hiện chữ *"Trên iPhone/iPad, hãy bấm Chia sẻ → Thêm vào MH
chính"* thì app đang chạy trong Safari chứ chưa phải bản đã cài.

### Kiểm phần chạy khi mất mạng

Mở app một lượt cho tải đủ dữ liệu → **bật chế độ máy bay** → mở lại app: vẫn
vào được, vẫn xem được bài đã tải. Phần chấm điểm, đồng bộ và gia sư AI thì
vẫn cần Internet — đúng như câu trả lời trong FAQ ở trang giới thiệu.

---

## 3. Người dùng nhìn thấy gì

Không có chỗ nào hỏi ngay khi vừa mở app. Lý do: **bị chặn một lần là trình
duyệt vĩnh viễn không hỏi lại**, người dùng phải tự vào cài đặt mở lại — hầu
như không ai làm. Nên mọi lời mời đều đợi có dấu hiệu dùng thật.

| Lúc nào | Hiện gì | Ngưỡng |
|---|---|---|
| Học xong bài / nộp xong bài luyện lần thứ 2 | Thanh mời **cài app** | `MOC_MOI = 2` trong `public/js/pwa.js` |
| …lần thứ 3 | Thanh mời **bật nhắc học** | `MOC_MOI = 3` trong `public/js/nhac.js` |
| Bấm "Để sau" | Im 7 ngày (cài app) / 10 ngày (nhắc học); từ chối 3 lần (cài) hoặc 2 lần (nhắc) thì thôi hẳn | `HOI_LAI`, `TOI_DA_TU_CHOI` |
| Bất cứ lúc nào | Thẻ **Tài khoản → 🔔 Nhắc học**: bật/tắt, đổi giờ, gửi thử | — |

Hai thanh mời không bao giờ hiện cùng lúc (`nhac.js` kiểm tra `#pwaBar` trước).

**Lời nhắc gửi khi nào:** đúng giờ người dùng chọn, **và** hôm nay có trong lịch
học của hồ sơ, **và** hôm nay chưa học. Thiếu bất kỳ điều kiện nào thì im lặng.
Một ngày tối đa một lời nhắc.

---

## 4. Bên trong chạy thế nào

```
public/manifest.webmanifest   khai báo app: tên, icon, mở ra trang nào
public/sw.js                  service worker: cache offline + nhận bản tin đẩy
public/js/pwa.js              đăng ký SW, thanh mời cài app
public/js/nhac.js             xin quyền, đăng ký đẩy, thẻ cài đặt trong Tài khoản
scripts/icon.js               sinh 4 icon PNG từ logo (chạy lại khi đổi logo)
scripts/vapid.js              sinh cặp khoá (chạy MỘT LẦN)

server/nhac.js                ký VAPID, các tuyến /api/nhac/*, lượt quét gửi nhắc
server/db.js                  bảng push_subs
server/index.js               gọi batDauLich(pool) khi khởi động
```

### Đường đi của một lời nhắc

```
[19:00] bộ đếm giờ trong server/index.js  →  quet()
   ├─ lọc: đúng giờ · hôm nay có lịch · hôm nay chưa học
   ├─ ký JWT ES256 (VAPID) rồi POST tới endpoint của trình duyệt — KHÔNG kèm nội dung
   └─ ghi lan_cuoi = hôm nay  (để hôm nay không gửi nữa)

[điện thoại] service worker nhận bản tin (rỗng)
   ├─ POST /api/nhac/noidung  kèm endpoint của chính nó
   ├─ máy chủ tra chuỗi + lịch học ngay lúc đó rồi trả chữ để hiện
   └─ showNotification(...)   ← bắt buộc, im lặng là trình duyệt tự hiện thông báo rác
```

**Vì sao bản tin không kèm nội dung:** kèm nội dung thì phải mã hoá đầu-cuối
theo RFC 8291 (ECDH + HKDF + AES-GCM) — nhiều mã, nhiều chỗ sai, thường phải kéo
thêm thư viện. Bỏ nội dung đi thì chỉ cần ký JWT, `node:crypto` làm được. Đổi
lại được một cái lợi thật: chữ hiện ra **tính tại thời điểm đọc**, nên ai vừa
kịp học trước khi mở thông báo thì thấy lời khen chứ không bị nhắc "chưa học".

### Các tuyến API

| Tuyến | Cần đăng nhập | Việc |
|---|---|---|
| `GET /api/nhac/config` | không | trả `{bat, publicKey}` — client hỏi trước khi hiện nút |
| `POST /api/nhac/noidung` | không | service worker hỏi chữ để hiện (nhận diện bằng endpoint) |
| `POST /api/nhac/dangky` | có | bật nhắc / đổi giờ (gọi lại nhiều lần vô hại) |
| `POST /api/nhac/tat` | có | tắt trên thiết bị này |
| `POST /api/nhac/thu` | có | gửi thử một cái ngay |

### Bảng `push_subs`

Mỗi **thiết bị** một dòng — một học sinh có thể vừa cài trên điện thoại vừa mở
trên máy tính, tắt máy này không tắt máy kia. `endpoint` (URL do trình duyệt
cấp) làm khoá; `lan_cuoi` chốt mỗi ngày một lần; `loi` đếm lỗi liên tiếp.

---

## 5. Những thứ hay phải chỉnh

| Muốn đổi | Sửa ở đâu |
|---|---|
| Chữ trong lời nhắc | `loiNhac()` — `server/nhac.js` |
| Chữ khi mất mạng lúc nhận bản tin | `NHAC_MAC_DINH` — `public/sw.js` |
| Giờ mặc định (19h) | `GIO_MAC_DINH` — `public/js/nhac.js`, và mặc định cột `gio` trong `server/db.js` |
| Danh sách giờ cho chọn | `GIO_CHON` — `public/js/nhac.js` |
| Mời cài app / bật nhắc sớm hay muộn hơn | `MOC_MOI`, `HOI_LAI`, `TOI_DA_TU_CHOI` — `public/js/pwa.js`, `public/js/nhac.js` |
| Tần suất quét (5 phút) | `batDauLich()` — `server/nhac.js` |
| Bỏ đăng ký chết sau bao nhiêu lần lỗi (10) | `quet()` — `server/nhac.js` |

### Thêm chỗ mời mới

Hai hàm này đếm "dùng thật", gọi thêm ở đâu cũng được:

```js
if (window.Pwa)  Pwa.dungThat();    // đủ ngưỡng thì tự hiện thanh mời cài app
if (window.Nhac) Nhac.dungThat();   // đủ ngưỡng thì tự hiện thanh mời bật nhắc
```

Hiện đang gọi ở `markLearned()` (học xong bài) và `doSubmit()` (nộp bài) trong
`public/js/app.js`. Đừng gọi ở chỗ người dùng chỉ lướt qua — ngưỡng mất ý nghĩa
và lời mời lại rơi vào lúc người ta chưa thấy app đáng cài.

### Khi nào phải đụng vào service worker

Đổi `PHIEN_BAN` trong `public/sw.js` sẽ **xoá sạch cache cũ** ở mọi máy. Chỉ cần
làm khi đổi chiến lược cache hoặc khi có tệp trong `asset/`, `js/vendor/` đổi
nội dung mà **giữ nguyên tên** (hai thư mục này lấy cache trước, không hỏi lại
máy chủ). Deploy thường không cần đổi: `js/`, `css/`, HTML đều lấy mạng trước.

> Đừng chuyển `js/` sang lấy-cache-trước cho nhanh. Các tệp câu hỏi đánh số nối
> tiếp nhau (`questions-tinh-huong.js` sinh mã tiếp theo số đã có), trộn bản cũ
> với bản mới sẽ sinh câu **trùng mã**. Nhanh thêm vài trăm mili giây không đáng.

### Đổi logo

Sửa `NET` / `MAU_NEN` trong `scripts/icon.js` cho khớp `public/asset/favicon.svg`
rồi chạy `node scripts/icon.js`. Bản *maskable* nền phải tràn kín khung vì
Android cắt icon thành hình tròn/giọt nước.

---

## 6. Khắc phục sự cố

| Triệu chứng | Nguyên nhân thường gặp | Xử lý |
|---|---|---|
| Không thấy thẻ 🔔 Nhắc học | máy chủ chưa có khoá VAPID, hoặc trình duyệt không hỗ trợ | mở `/api/nhac/config` xem `bat` |
| Thẻ báo *"Trình duyệt đang chặn thông báo"* | người dùng đã bấm Chặn | bấm ổ khoá cạnh thanh địa chỉ → cho phép Thông báo → tải lại. **Không có cách nào hỏi lại từ trong code** |
| iPhone không bật được | mở từ Safari chứ không phải từ biểu tượng đã cài | Chia sẻ → Thêm vào MH chính, rồi mở từ đó |
| "Gửi thử" báo lỗi 502 | dịch vụ đẩy từ chối — hay gặp nhất là **khoá VAPID trên Railway khác khoá lúc thiết bị đăng ký** | tắt rồi bật lại nhắc trên thiết bị đó |
| Đang nhận bình thường rồi im hẳn | gỡ app / xoá dữ liệu trang → dịch vụ đẩy trả 410 → máy chủ xoá đăng ký (đúng như thiết kế) | bật lại trên thiết bị |
| Nhắc vào ngày đã nghỉ đúng lịch | hồ sơ chưa đặt lịch học (để trống = mọi ngày) | Hồ sơ → chọn các thứ trong tuần |
| Nhắc sai giờ | máy chủ tính theo **giờ Việt Nam cố định UTC+7** | người dùng ở múi giờ khác sẽ lệch — xem Giới hạn bên dưới |
| Một lời nhắc đến hai lần | Railway đang chạy **nhiều bản** cùng lúc, mỗi bản một bộ đếm giờ | để service web ở 1 replica, hoặc chuyển lượt quét sang worker riêng |

Xem log Railway: mỗi lượt có gửi được sẽ in `[nhac] Đã gửi 3/5 lời nhắc.`
(gửi 3 trong 5 đăng ký đến giờ — 2 cái còn lại rơi vào diện đã học hoặc ngày nghỉ).

---

## 7. Giới hạn đã biết

- **Múi giờ đóng cứng UTC+7.** Học sinh ở nước ngoài sẽ nhận lệch giờ. Muốn
  đúng thì lưu thêm múi giờ của thiết bị lúc đăng ký (`Intl.DateTimeFormat()
  .resolvedOptions().timeZone`) và tính theo cột đó.
- **Chưa có kênh dự phòng.** Máy không cho thông báo (iOS cũ, người dùng chặn)
  thì không nhắc được. Email nhắc là bước tiếp theo tự nhiên, nhưng cần dựng
  dịch vụ gửi thư.
- **Một lời nhắc mỗi ngày.** Cố ý — nhắc nhiều là bị tắt.
- **Đường đi thật chưa chạy đầu-cuối.** Phần máy chủ có 21 test với dịch vụ đẩy
  giả và chữ ký VAPID được xác minh bằng chính khoá công khai, nhưng chặng
  *trình duyệt đăng ký → Google/Apple → hiện thông báo* phải thử trên điện thoại
  thật (mục 2).
- **Lượt quét chạy trong tiến trình web.** Đơn giản và đủ dùng ở quy mô này;
  nếu sau này chạy nhiều bản song song thì phải tách ra (xem bảng sự cố).

---

## 8. Chạy thử ở máy nhà

```bash
node scripts/vapid.js
```

Dán ba dòng vào `.env`, rồi:

```bash
npm start
```

`localhost` được trình duyệt coi là nơi an toàn nên đăng ký đẩy vẫn chạy được
mà không cần HTTPS. Riêng phần **cài ra màn hình chính** thì nên thử trên tên
miền thật, vì mỗi hệ điều hành một kiểu.

Chạy test phần này:

```bash
npx node --test server/test/nhac.test.js
```
