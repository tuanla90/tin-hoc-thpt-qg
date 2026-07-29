/* ============================================================================
 *  SINH CẶP KHOÁ VAPID CHO NHẮC HỌC  —  node scripts/vapid.js
 *
 *  Chạy MỘT LẦN, rồi dán hai dòng in ra vào Railway → Variables. Khoá này là
 *  danh tính của máy chủ đối với dịch vụ đẩy của Google/Apple/Mozilla.
 *
 *  ĐỔI KHOÁ = MẤT HẾT ĐĂNG KÝ CŨ: mọi thiết bị đã bật nhắc phải bật lại, vì
 *  đăng ký của trình duyệt gắn chặt với khoá công khai lúc tạo. Nên sinh một
 *  lần rồi cất kỹ, đừng chạy lại mỗi lần deploy.
 * ==========================================================================*/
const crypto = require("crypto");

const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const pub = publicKey.export({ format: "jwk" });
const priv = privateKey.export({ format: "jwk" });

/* Khoá công khai theo chuẩn Web Push là điểm dạng "không nén": 0x04 || X || Y. */
const nen = Buffer.concat([
  Buffer.from([4]),
  Buffer.from(pub.x, "base64url"),
  Buffer.from(pub.y, "base64url"),
]).toString("base64url");

console.log("Dán vào Railway → Variables (và .env khi chạy máy nhà):\n");
console.log("VAPID_PUBLIC=" + nen);
console.log("VAPID_PRIVATE=" + priv.d);
console.log("VAPID_SUB=mailto:tuanla.company@gmail.com");
console.log("\nGiữ VAPID_PRIVATE như mật khẩu. Đổi khoá là mọi thiết bị phải bật nhắc lại.");
