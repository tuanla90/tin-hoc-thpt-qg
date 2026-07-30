/* ============================================================================
 *  BỘ ICON NÉT (outline, kiểu Lucide) — thay emoji ở vài chỗ cho gọn/đẹp.
 *  Nhúng SVG inline (chạy offline, không thư viện ngoài). Dùng currentColor
 *  nên tự đổi màu theo chỗ đặt + theme sáng/tối.
 *   ICON(name, size)  -> chuỗi <svg>...</svg>
 *   iconify(root)     -> điền icon vào các phần tử có [data-ic]
 *  Nạp TRƯỚC app.js.
 * ==========================================================================*/
(function () {
  var P = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 2 6 2s6-1 6-2v-5"/><path d="M22 10v5.5"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6"/>',
    zap: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.3 12.4 2.6 2.6 4.8-5.2"/>',
    exam: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>',
    chart: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="7" rx="1"/><rect x="12" y="7" width="3" height="11" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/>',
    trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3"/><path d="M17 6h3v1a3 3 0 0 1-3 3"/>',
    brain: '<path d="M9.5 3.5A2.5 2.5 0 0 0 7 6a3 3 0 0 0-2 5.2A3 3 0 0 0 6.5 17 2.5 2.5 0 0 0 9 19.5a2.5 2.5 0 0 0 2.5-2.5V6a2.5 2.5 0 0 0-2-2.5Z"/><path d="M14.5 3.5A2.5 2.5 0 0 1 17 6a3 3 0 0 1 2 5.2A3 3 0 0 1 17.5 17 2.5 2.5 0 0 1 15 19.5a2.5 2.5 0 0 1-2.5-2.5"/>',
    lightning: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>',
    medal: '<path d="m15.5 12.9 1.5 8.6-5-3-5 3 1.5-8.6"/><circle cx="12" cy="8" r="6"/>',
    star: '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 20.4l1-5.8-4.3-4.1 5.9-.9z"/>',
    check2: '<circle cx="12" cy="12" r="9"/><path d="m8.3 12.4 2.6 2.6 4.8-5.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    volumeoff: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
    letters: '<path d="m3 16 4-10 4 10"/><path d="M4.4 13h5.2"/><path d="M14 10.5a3 3 0 1 1 0 5.2V17"/><path d="M14 8.2V17"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    aright: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    aleft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z"/>',
    bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    sprout: '<path d="M7 20h10"/><path d="M12 20c0-6 2-9 8-9-1 6-4 9-8 9Z"/><path d="M12 15C6 15 4 11 4 6c5 0 8 3 8 8Z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
    rocket: '<path d="M5 16c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2-.1-2.8a2 2 0 0 0-2.8-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.5-3 2-4c1.6-1 5 0 5 0"/><path d="M12 15v5s3-.5 4-2c1-1.6 0-5 0-5"/>',
    crown: '<path d="M11.6 3.5a1 1 0 0 1 .8 0l3 6 4.5-3.5a1 1 0 0 1 1.6 1L19 18H5L2.5 7a1 1 0 0 1 1.6-1L8.6 9.5z"/><path d="M5 21h14"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
    chevdown: '<path d="m6 9 6 6 6-6"/>',
    x: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.2"/><circle cx="16" cy="16" r="1.2"/><circle cx="16" cy="8" r="1.2"/><circle cx="8" cy="16" r="1.2"/><circle cx="12" cy="12" r="1.2"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V4"/>',
    party: '<path d="M2 22 8 8l8 8-14 6Z"/><path d="M14 6a2 2 0 0 1 2-2M18 2a2 2 0 0 0 2 2 2 2 0 0 0-2 2 2 2 0 0 0-2-2 2 2 0 0 0 2-2ZM12 2v2M20 12h2"/>'
  };
  var css =
    ".ic{display:inline-block;vertical-align:middle;flex:none}" +
    ".nav-ic{display:inline-flex;align-items:center;margin-right:6px;vertical-align:-4px}" +
    ".nav-ic .ic{width:17px;height:17px}" +
    ".m-icon{color:var(--primary);line-height:0}" +
    ".m-icon .ic{width:30px;height:30px}" +
    ".hero-ic{width:58px;height:58px;border-radius:16px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;margin:0 auto 14px}" +
    ".hero-ic .ic{width:30px;height:30px}" +
    ".gam-chip .ic,.gam-cat-head .ic,.section-title .ic{vertical-align:-3px;margin-right:4px}" +
    ".gam-ach-title .ic{vertical-align:-4px;margin-right:8px}" +
    ".btn .ic,.back-link .ic{vertical-align:-3px;margin-right:5px}" +
    ".ls-note b .ic,.ls-keypoints b .ic,.ls-out .ic,.sgk-head span .ic{vertical-align:-2px;margin-right:4px}" +
    ".ls-story-icon .ic{vertical-align:middle}" +
    ".voc-mode .ic,.voc-vlabel .ic,.voc-vtest .ic,.voc-vnote .ic{vertical-align:-3px;margin-right:4px}" +
    ".flash-pron .ic,.flash-src .ic{vertical-align:-2px;margin-right:3px}" +
    ".brand-logo{color:var(--primary);display:inline-flex;align-items:center}" +
    ".result-msg .ic,.result-flag .ic,.pg-title .ic,.chip .ic,.flag-btn .ic{vertical-align:-3px;margin-right:4px}" +
    ".ex-hint .ic,.ex-result .ic{vertical-align:-2px;margin-right:3px}";
  var st = document.createElement("style");
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function ICON(name, size, color) {
    var inner = P[name] || P.check;
    var s = size || 24;
    return '<svg class="ic" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="' + (color || "currentColor") + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  }
  function iconify(root) {
    var nodes = (root || document).querySelectorAll("[data-ic]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute("data-ic-done")) continue;
      el.innerHTML = ICON(el.getAttribute("data-ic"), +el.getAttribute("data-ic-size") || undefined);
      el.setAttribute("data-ic-done", "1");
    }
  }
  window.ICON = ICON;
  window.iconify = iconify;
})();
