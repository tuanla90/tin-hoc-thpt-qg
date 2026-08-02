# Prompt sinh 45 ảnh huy hiệu bằng linh vật

Toàn bộ 45 huy hiệu trong `GAM_BADGES` (`public/js/gamify.js`) đều có prompt đầy
đủ ở đây — **coi như chưa có ảnh nào**, kể cả 10 tấm đang có trong
`public/asset/mascot/badges/` (nên vẽ lại cho đồng bộ với thang tiến hoá và nền
chroma key mới).

Mỗi prompt dán thẳng vào mô hình sinh ảnh, không cần ghép gì thêm.

---

## 1. Vì sao nền magenta, không phải nền trắng

Ảnh cũ sinh trên nền trắng nên khi xoá phông, công cụ ăn luôn mảng trắng ở bụng
bộ đồ — chính là lỗi trong ảnh `first_lesson` hiện tại.

Nhân vật này dùng bảng màu **trắng · bạc · xanh ngọc · viền xanh navy · vàng kim
(bậc hiếm)**. Vậy màu nền an toàn phải nằm **ngoài** bảng đó:

| Màu nền | Dùng được? | Lí do |
|---|---|---|
| Trắng | ✗ | Trùng bộ đồ và tóc — đúng lỗi đang gặp |
| Xanh lá (green screen) | ✗ | Quá gần xanh ngọc của bộ đồ và tai nghe |
| Xanh dương | ✗ | Trùng viền navy và mắt |
| **Magenta `#FF00FF`** | ✓ | Không có một điểm nào trong bảng màu nhân vật |

Prompt còn ép **viền navy khép kín quanh toàn thân**. Có viền thì công cụ tách
nền cắt đúng đường viền, không mò vào trong nhân vật.

### Tách nền sau khi sinh

```bash
magick in.png -fuzz 18% -transparent "#FF00FF" -trim +repage -resize 256x256 out.png
```

Nếu còn viền hồng lem quanh mép (despill):

```bash
magick in.png -fuzz 18% -transparent "#FF00FF" -channel A -morphology Erode Disk:1 +channel -trim +repage -resize 256x256 out.png
```

Sau đó luôn xem thử trên **nền tối** (thẻ huy hiệu trong app là nền tối) — lỗi
lem hồng chỉ lộ ra trên nền tối.

---

## 2. Thang tiến hoá 7 bậc

Đây là phần "linh vật tiến bộ dần". Mỗi bậc **cộng dồn** lên bậc trước — bậc 6
vẫn đeo ba lô của bậc 2. Người học liếc qua là thấy mình đã đi được bao xa.

| Bậc | Tên | Thêm gì |
|---|---|---|
| S1 | Tân binh | bộ đồ gốc |
| S2 | Học viên | ba lô xanh ngọc + ghim huy hiệu tròn trên ngực |
| S3 | Kĩ thuật viên | kính bảo hộ đẩy lên trán + màn hình nhỏ ở cổ tay trái |
| S4 | Lập trình viên | hoodie kĩ thuật ngắn khoác ngoài + ăng-ten trên tai nghe |
| S5 | Chuyên gia | áo choàng ngắn phát sáng + đai lưng đựng dụng cụ |
| S6 | Bậc thầy | giáp vai phát sáng + drone khối lập phương bay cạnh đầu |
| S7 | Huyền thoại | áo choàng dài hoa văn mạch điện vàng + vương miện hologram |

**S7 chỉ dành riêng cho `level_7`** — đích cuối của cả hệ thống, không huy hiệu
nào khác được chạm tới.

Huy hiệu **hiếm** (`rare: true`) đổi nhấn xanh ngọc ở món đồ mới nhất sang vàng
kim, thêm hạt sáng vàng bay quanh.

### Ràng buộc bắt buộc: đọc được khi xám

Huy hiệu chưa mở khoá bị phủ `filter: grayscale(1); opacity:.5`
([gamify.js:83](public/js/gamify.js:83)). Hai tấm cùng bậc mà chỉ khác màu thì
khi xám trông y hệt nhau. Vì vậy mỗi tấm phải khác nhau ở **dáng người và đạo
cụ** — điều này đã được cài sẵn trong từng prompt bên dưới.

---

## 3. Bốn nhăm prompt

### 3.1 Học tập — 10 huy hiệu

#### `first_lesson` · Bước đầu tiên · S1

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: base outfit only, no extra gear.
Pose: taking a big excited first step forward, one hand raised in greeting, a single open book floating in front.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `lessons_5` · Khởi động · S1

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: base outfit only, no extra gear.
Pose: crouching low like a runner at the starting line, both hands on the ground, a small five-leaf sprout growing beside the feet.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `lessons_10` · Ham học · S2

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + small teal school backpack, + round silver badge pin on the chest.
Pose: hugging a tall stack of ten colourful books with both arms, cheeks squished against the top book, happy closed eyes.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `lessons_25` · Chăm chỉ · S2

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + small teal school backpack, + round silver badge pin on the chest.
Pose: sitting cross-legged, writing in an open notebook with an oversized pencil, tongue sticking out in concentration.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `lessons_50` · Nửa chặng đường · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: standing on top of a short half-built stone staircase, one hand shading the eyes, looking ahead into the distance.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `lessons_75` · Sắp về đích · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Pose: running fast toward a small chequered finish flag, leaning forward, arms pumping, motion streaks behind.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `lessons_all` · Mọt sách ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: floating cross-legged in mid-air, eyes closed peacefully, a ring of open glowing books orbiting around the body.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `tin10_done` · Chinh phục lớp 10 ⭐ · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: holding a thick green textbook overhead in triumph with both hands, big open smile, one knee raised.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `tin11_done` · Chinh phục lớp 11 ⭐ · S5

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + short glowing cape, + utility belt with small tool pouches; keeps hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: holding a thick blue textbook overhead in triumph with both hands, cape flowing behind, confident grin.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `tin12_done` · Chinh phục lớp 12 ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: holding a thick orange textbook overhead in triumph with both hands, the drone circling just above the book.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

---

### 3.2 Từ vựng — 5 huy hiệu

#### `vocab_10` · Chào từ mới · S1

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: base outfit only, no extra gear.
Pose: waving cheerfully at a floating rounded speech bubble that holds three blank square tiles.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `vocab_25` · Vốn từ vựng · S2

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + small teal school backpack, + round silver badge pin on the chest.
Pose: holding an open pocket dictionary in one hand and pointing at it proudly with the other, chest puffed out.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `vocab_50` · Kho từ · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: pulling open the drawer of a floating card-index cabinet, blank index cards fanning out into the air.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `vocab_100` · Từ điển sống · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Pose: standing beside an open dictionary as tall as the character, one hand resting on it, the other on the hip.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `vocab_200` · Bậc thầy từ vựng ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: arms spread wide, a swirling ring of glowing blank square tiles orbiting the whole body.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

---

### 3.3 Luyện tập — 10 huy hiệu

#### `correct_10` · Phát súng đầu · S1

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: base outfit only, no extra gear.
Pose: pumping one fist in the air beside a large floating green check mark, wide happy grin.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `correct_50` · Xạ thủ · S2

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + small teal school backpack, + round silver badge pin on the chest.
Pose: aiming a toy dart at a small floating round target board, one eye closed, tongue poking out.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `correct_100` · Thiện xạ · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: drawing a glowing energy bow to full draw, an arrow of light already stuck in the bullseye of a small floating target.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `correct_200` · Bách phát bách trúng · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Pose: standing proudly with arms crossed, three round target boards floating around, every one hit dead centre by a glowing arrow.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `correct_500` · Vua luyện đề ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: sitting on a throne built from stacked answer sheets, one leg crossed, holding a round target board upright like a sceptre.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `code_1` · Dòng code đầu tiên · S1

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: base outfit only, no extra gear.
Pose: pressing one key on an oversized floating keyboard with a single finger, eyes wide with wonder, leaning in.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `code_5` · Tập viết code · S2

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + small teal school backpack, + round silver badge pin on the chest.
Pose: sitting on the floor with a small laptop balanced on the knees, typing, brow furrowed in focus.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `code_10` · Lập trình viên · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: standing in front of one floating holographic panel filled with glowing curly brackets and dots, both hands typing in the air.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `code_25` · Cao thủ code · S5

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + short glowing cape, + utility belt with small tool pouches; keeps hoodie, goggles, wrist screen, backpack, chest pin.
Pose: surrounded by three floating holographic panels of glowing brackets, conducting them like an orchestra with both hands raised.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `code_50` · Kiến trúc sư code ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: standing on a floating platform built from interlocking glowing blocks, placing the final block into a gap with one hand.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

---

### 3.4 Thi thử — 10 huy hiệu

#### `exam_first` · Thử sức · S1

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: base outfit only, no extra gear.
Pose: nervously holding a single blank exam paper with both hands, one bead of sweat, determined little smile.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_5` · Quen trận · S2

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + small teal school backpack, + round silver badge pin on the chest.
Pose: confidently flipping through a small stack of blank finished exam papers with one hand, relaxed smile.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_10` · Dày dạn · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: leaning casually against a tall filing cabinet stuffed with blank papers, arms crossed, one eyebrow raised.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_25` · Luyện đề bền bỉ · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Pose: walking forward carrying a heavy crate overflowing with rolled blank papers, completely unbothered, easy smile.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_50` · Chiến binh phòng thi ⭐ · S5

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + short glowing cape, + utility belt with small tool pouches; keeps hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: standing on top of a tall tower of stacked blank papers, one foot forward, hands on hips, cape flowing.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_pass7` · Vượt ngưỡng · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: pushing open a heavy glowing gate with both hands, bright light spilling through the gap, hopeful expression.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_pass8` · Học sinh giỏi · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Pose: holding up a blank report card with one hand, one large glowing star floating above the head, proud smile.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_pass9` · Xuất sắc · S5

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + short glowing cape, + utility belt with small tool pouches; keeps hoodie, goggles, wrist screen, backpack, chest pin.
Pose: holding up a blank report card with one hand, three glowing stars arcing above the head, cape flowing, radiant smile.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_perfect` · Điểm tuyệt đối ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: jumping in the air with both arms thrown up, a huge glowing gold ring bursting outward behind the body.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `exam_perfect_3` · Không phải may mắn ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: standing perfectly still with arms crossed, calm half-smile, three thin gold rings spinning at three different angles around the whole body.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

---

### 3.5 Chăm chỉ — 5 huy hiệu

#### `streak_3` · Đều đặn · S2

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + small teal school backpack, + round silver badge pin on the chest.
Pose: reaching up to tick three boxes on a small floating wall calendar with a pen, satisfied smile.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `streak_7` · Kiên trì · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: cupping a small warm flame in both hands close to the chest, face lit warm orange from below, gentle smile.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `streak_14` · Hai tuần liền · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Pose: standing on a floating calendar page, hands on hips, a tall steady flame burning behind the shoulders.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `streak_30` · Cả tháng không nghỉ ⭐ · S5

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + short glowing cape, + utility belt with small tool pouches; keeps hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: standing inside a tall column of gold flame, arms crossed, calm confident expression, cape lifted by the heat.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `streak_60` · Hai tháng bền bỉ ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: standing on a small rocky peak with arms relaxed at the sides, two tall pillars of gold flame rising on the left and right.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

---

### 3.6 Cấp độ — 5 huy hiệu

#### `level_3` · Vào guồng · S3

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + tech goggles pushed up on the forehead, + small screen on the left wrist; keeps backpack and chest pin.
Pose: caught mid-stride walking forward, bolts of teal lightning crackling around the feet, focused look.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `level_5` · Lên hạng · S5

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + short glowing cape, + utility belt with small tool pouches; keeps hoodie, goggles, wrist screen, backpack, chest pin.
Pose: launching straight upward like a rocket, arms tight at the sides, a plume of teal energy below the feet, cape streaming up.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `level_7` · Huyền thoại ⭐ · S7

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + long flowing cape with glowing gold circuit patterns, + gold trim on the shoulder armour, + a floating holographic gold crown above the head; keeps the drone, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: standing still and regal, arms relaxed at the sides, chin slightly raised, gold light radiating outward from the whole body.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `xp_1000` · Nghìn XP · S4

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + open short teal technical hoodie over the bodysuit, + small antenna on the headphones; keeps goggles, wrist screen, backpack, chest pin.
Pose: sitting on a small mound of glowing teal gems, tossing one gem up in the air and watching it, playful grin.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

#### `xp_5000` · Vượt trần ⭐ · S6

```
Chibi anime mascot, 3-heads-tall, short silver-white bob hair with soft inner shadow, very large expressive cyan-teal eyes with white highlights, small rounded nose, warm friendly face, light skin. White and light-grey futuristic tech bodysuit with glowing teal seam lines, a small round teal gem at the collar, dark grey fingerless gloves. Oversized white headphones with teal ear pads and a thin teal light strip. Clean thin dark-navy line art, flat cel shading with soft gradients, bright friendly style for a children's educational app.
Gear: + glowing shoulder armour plates, + a small floating cube-shaped drone beside the head; keeps cape, utility belt, hoodie, goggles, wrist screen, backpack, chest pin.
Rare: gold accents replace the teal glow on the newest gear piece, faint gold sparkles float around the character.
Pose: standing with one arm raised high, a comet of gold light streaking diagonally past behind the shoulders, hair blown back.
Full body, centred, facing the viewer, square 1:1, 1024x1024, character fills about 80% of the frame with even margins. Background: one solid flat magenta #FF00FF, perfectly uniform, no gradient, no texture, no shadow cast onto it; magenta must not appear anywhere on the character. Continuous dark-navy outline closing the whole silhouette against the magenta. Silhouette must still read clearly when desaturated to greyscale.
Negative: no white background, no transparent background, no text, no letters, no numbers, no watermark, no logo, no signature, no scenery, no ground shadow, no frame, no border, no drop shadow, not photorealistic, no extra characters, no cut-off limbs.
```

---

## 4. Thứ tự nên vẽ

Vẽ **theo bậc**, không theo nhóm — cùng một bộ đồ vẽ liền một mạch thì đỡ trôi
phong cách hơn nhảy qua nhảy lại:

| Bậc | Số tấm | Danh sách |
|---|---|---|
| S1 | 6 | `first_lesson` `lessons_5` `vocab_10` `correct_10` `code_1` `exam_first` |
| S2 | 7 | `lessons_10` `lessons_25` `vocab_25` `correct_50` `code_5` `exam_5` `streak_3` |
| S3 | 8 | `lessons_50` `vocab_50` `correct_100` `code_10` `exam_10` `exam_pass7` `streak_7` `level_3` |
| S4 | 8 | `lessons_75` `tin10_done` `vocab_100` `correct_200` `exam_25` `exam_pass8` `streak_14` `xp_1000` |
| S5 | 6 | `tin11_done` `code_25` `exam_50` `exam_pass9` `streak_30` `level_5` |
| S6 | 9 | `lessons_all` `tin12_done` `vocab_200` `correct_500` `code_50` `exam_perfect` `exam_perfect_3` `streak_60` `xp_5000` |
| S7 | 1 | `level_7` |

Tổng 6+7+8+8+6+9+1 = **45**.

## 5. Mẹo giữ nhất quán

1. **Đính ảnh tham chiếu.** Model nào nhận ảnh đầu vào (Nano Banana, Midjourney
   `--cref`, IP-Adapter) thì kèm `public/asset/mascot/poses/standing.png`. Ăn đứt
   việc chỉ tả bằng chữ.
2. **Chốt seed theo bậc.** Sinh được một tấm ưng ý thì giữ nguyên seed cho cả
   bậc đó.
3. **Nghiệm thu 3 bước:** (a) xem trên nền tối tìm viền hồng lem; (b) đổ
   `grayscale(1)` xem có lẫn với tấm cùng bậc không; (c) thu về 96px xem còn
   nhận ra dáng không — trong app huy hiệu chỉ hiện 96×96.
4. **Đừng để model viết chữ.** Mọi model đều viết sai chính tả tiếng Việt. Prompt
   đã ép giấy/sách/thẻ đều **để trắng**. Cần chữ thì chèn bằng CSS sau.

## 6. Việc trong mã sau khi có ảnh

1. Lưu vào `public/asset/mascot/badges/<id>.png`, tên **trùng đúng** `id` trong
   `GAM_BADGES`.
2. Thêm `id` vào `GAM_BADGE_ANH` ([gamify.js:404](public/js/gamify.js:404)) — id
   nào chưa có trong mảng thì vẫn hiện emoji. Khi đủ 45 tấm thì bỏ hẳn mảng này
   và để `gamBadgeIc()` luôn trả `<img>` (emoji vẫn là dự phòng qua `onerror`).
3. Nén về 256×256; 45 tấm nên nằm dưới ~1,5 MB — đây là PWA, ảnh vào cache.
4. **Tuỳ chọn** — bản nam: sinh thêm bộ vào `asset/mascot/nam/badges/` rồi cho
   `gamBadgeIc()` đi qua `mascotSrc()` ([app.js:2766](public/js/app.js:2766))
   như các ảnh linh vật khác.
