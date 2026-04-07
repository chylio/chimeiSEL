/* ============================================================
   心靈成長花園 | SEL 學習平台 — 應用程式邏輯
   修改頁面互動行為請編輯此檔案
   ============================================================ */

/* ── 從 SCENARIOS 建立快速查找 Map ── */
var DATA = {};
var ACK  = {};
SCENARIOS.forEach(function(s) {
  DATA[s.key] = s;
  ACK[s.key]  = { msg: s.ackMsg, sub: s.ackSub, cta: s.ackCta, col: s.col };
});

/* ── 頁面列表（固定系統頁面 + 動態案例頁） ── */
var ALL_PAGES = ["home", "scenario", "sel", "platform", "teaching", "vision"];
var NAV_MAP   = {
  home:     "n-home",
  sel:      "n-sel",
  platform: "n-platform",
  teaching: "n-teaching",
  vision:   "n-vision"
};
var curEmo = null;

/* ── 頁面切換 ── */
function showPage(name) {
  ALL_PAGES.forEach(function(p) {
    var el = document.getElementById("page-" + p);
    if (el) { el.classList.remove("active", "page-enter"); }
  });
  var target = document.getElementById("page-" + name);
  if (target) { target.classList.add("active", "page-enter"); }

  Object.keys(NAV_MAP).forEach(function(k) {
    var a = document.getElementById(NAV_MAP[k]);
    if (a) a.classList.remove("active");
  });
  if (NAV_MAP[name]) {
    var activeLink = document.getElementById(NAV_MAP[name]);
    if (activeLink) activeLink.classList.add("active");
  }
  window.scrollTo(0, 0);
}

/* ── 捲動到情緒選擇 ── */
function scrollToEmo() {
  showPage("home");
  setTimeout(function() {
    document.getElementById("emo-anchor").scrollIntoView({ behavior: "smooth" });
  }, 50);
}

/* ── 情緒選擇 ── */
function selectEmo(id) {
  document.querySelectorAll(".emo-card").forEach(function(c) {
    c.classList.remove("selected");
  });
  document.getElementById("ec-" + id).classList.add("selected");
  curEmo = id;

  var a     = ACK[id];
  var d     = DATA[id];
  var panel = document.getElementById("ack-panel");
  panel.style.display = "block";

  panel.innerHTML =
    '<div class="ack-card" style="border-color:' + a.col + '20">' +
      '<div class="ack-top" style="background:linear-gradient(135deg,' +
          hexToRgba(a.col, .12) + ',' + hexToRgba(a.col, .06) + ')">' +
        '<div class="ack-icon" style="background:' + a.col + '">' + d.icon + '</div>' +
        '<div>' +
          '<div class="ack-msg" style="color:' + a.col + '">' + a.msg + '</div>' +
          '<div class="ack-sub" style="color:' + a.col + '">' + a.sub + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ack-bottom" style="background:' + a.col +
          ';border-top:1px solid rgba(255,255,255,.2)">' +
        '<div class="ack-hint" style="color:rgba(255,255,255,.85)">點擊右側按鈕，進入對應的學習情境 →</div>' +
        '<button class="cta-btn" style="color:' + a.col +
            '" onclick="goScenario(\'' + id + '\')">' +
          a.cta + '<span class="arr">→</span>' +
        '</button>' +
      '</div>' +
    '</div>';

  setTimeout(function() {
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

/* ── 進入情境頁面 ── */
function goScenario(id) {
  var d       = DATA[id];
  var a       = ACK[id];
  var tags    = d.etags.map(function(e) { return '<span class="etag">' + e + '</span>'; }).join("");
  var rqsHtml = d.rqs.map(function(q) { return '<li>' + q + '</li>'; }).join("");

  document.getElementById("scn-content").innerHTML =
    '<div class="scn-top">' +
      '<button class="back-btn" onclick="showPage(\'home\')">← 返回首頁</button>' +
      '<div class="scn-top-title">' + d.icon + ' ' + d.sel + '</div>' +
      '<div class="scn-top-tag">' + d.selEn + '</div>' +
    '</div>' +
    '<div class="scn-body">' +
      '<div class="scn-col">' +
        '<div class="scard" style="border-top:4px solid ' + d.col +
            ';background:linear-gradient(135deg,#FFF8ED,#F5ECD0)">' +
          '<div class="scard-lbl" style="color:' + d.col + '">你今天的感受</div>' +
          '<div style="font-size:1.1rem;font-weight:800;margin-bottom:6px">' + d.emo + '</div>' +
          '<div style="font-size:.92rem;color:var(--mid)">' + a.msg + '</div>' +
        '</div>' +
        '<div class="scard">' +
          '<div class="scard-lbl">📌 情境描述</div>' +
          '<div class="scard-title">' + d.stitle + '</div>' +
          '<div class="scard-text">' + d.stext + '</div>' +
          '<div class="etags">' + tags + '</div>' +
        '</div>' +
        '<div class="scard" style="background:#FFF0D0;border-color:#E5C870">' +
          '<div class="scard-lbl" style="color:' + d.col + '">🔑 SEL 核心關鍵</div>' +
          '<div style="font-size:1rem;font-weight:800;background:' + d.col +
              ';color:#fff;padding:12px 16px;border-radius:8px;margin-bottom:12px">' + d.core + '</div>' +
          '<div style="font-size:.9rem;color:var(--mid);white-space:pre-line;line-height:1.75">' + d.selkey + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="scn-col">' +
        '<div class="scard">' +
          '<div class="scard-lbl">💭 反思練習</div>' +
          '<div class="rq-title">🗣 ' + d.rtitle + '</div>' +
          '<ul class="rqs">' + rqsHtml + '</ul>' +
        '</div>' +
        '<div class="scard">' +
          '<div class="scard-lbl">📖 示範學習</div>' +
          '<div class="cgrid">' +
            '<div class="cmini">' +
              '<div class="cmini-lbl">✅ 可以怎麼做</div>' +
              '<div class="cmini-text">' + d.action + '</div>' +
            '</div>' +
            '<div class="cmini">' +
              '<div class="cmini-lbl">💬 我可以對自己說</div>' +
              '<div class="cmini-text"><div class="qline">' + d.talk + '</div></div>' +
            '</div>' +
            '<div class="lesson-box">🎯 <strong>SEL 教學重點：</strong>' + d.lesson + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  showPage("scenario");
}

/* ── 工具函式：hex 轉 rgba ── */
function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

/* ── 動態渲染 SEL 卡片（讀取 scenarios.js） ── */
function renderSelCards() {
  var row = document.getElementById("sel-cards-row");
  if (!row) return;
  row.innerHTML = SCENARIOS.map(function(s) {
    return (
      '<div class="sel-card" onclick="goScenario(\'' + s.key + '\')" style="border-color:' + s.col + '">' +
        '<div class="sel-card-img">' +
          '<img src="' + s.cardImage + '" alt="' + s.sel + '" loading="lazy">' +
        '</div>' +
        '<div class="sel-card-body" style="border-color:' + s.col + '">' +
          '<div class="sel-card-zh">' + s.sel + '</div>' +
          '<div class="sel-card-en">' + s.selEn + '</div>' +
          '<div class="sel-card-desc">' + s.cardDesc + '</div>' +
          '<div class="sel-card-arrow">進入情境 →</div>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}

/* ── 動態渲染情緒選擇卡（讀取 scenarios.js） ── */
function renderEmoCards() {
  var grid = document.getElementById("emo-grid");
  if (!grid) return;
  grid.innerHTML = SCENARIOS.map(function(s) {
    return (
      '<div class="emo-card" id="ec-' + s.key + '" onclick="selectEmo(\'' + s.key + '\')">' +
        '<img src="' + s.emoImage + '" alt="' + s.emoLabel + '" loading="lazy">' +
        '<span class="el">' + s.emoLabel + '</span>' +
        '<span class="es">' + s.emoLabelEn + '</span>' +
      '</div>'
    );
  }).join("");
}

/* ── 初始化 ── */
document.addEventListener("DOMContentLoaded", function() {
  renderSelCards();
  renderEmoCards();
});
