/* TheoEngine — Browsing view: embedded reference/social browser */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const TR = window.TR;
  const LS_URL = "tr_browse_url";

  const frame = $("browserFrame");
  const input = $("browseUrl");
  const pop = $("browsePop");
  const fullBtn = $("browseFull");
  const view = $("view-browsing");
  const app = $("app");
  if (!frame || !input || !view) return;

  let full = false;

  function normalUrl(raw) {
    let u = String(raw || "").trim();
    if (!u) return "https://www.youtube.com";
    if (/^https?:\/\/(?:www\.)?youtube\.com(?:\/|$)/i.test(u)) {
      if (/watch\?v=|shorts\//i.test(u)) {
        const m = u.match(/watch\?v=([^&]+)/i) || u.match(/shorts\/([^?&]+)/i);
        if (m && m[1]) u = "https://www.youtube.com/watch?v=" + m[1];
      }
    }
    if (!/^https?:\/\//i.test(u)) {
      if (/\s|\./.test(u)) u = /^([^\s]+\.[^\s]+)$/.test(u) ? "https://" + u : "https://www.youtube.com/results?search_query=" + encodeURIComponent(u);
      else u = "https://www.youtube.com/results?search_query=" + encodeURIComponent(u);
    }
    return u;
  }

  function setActive(btn) {
    document.querySelectorAll(".browse-btn").forEach((b) => b.classList.toggle("active", b === btn));
  }

  function renderFullMode() {
    view.classList.toggle("browse-fullscreen", full);
    if (app) app.classList.toggle("browse-fullscreen", full);
    if (fullBtn) fullBtn.textContent = full ? "↩" : "⛶";
    if (fullBtn) fullBtn.title = full ? "go back" : "fullscreen in panel";
  }

  function setFull(on) {
    full = !!on;
    renderFullMode();
  }

  function load(url, popUrl, btn) {
    const u = normalUrl(url);
    frame.src = u;
    input.value = popUrl || u;
    localStorage.setItem(LS_URL, input.value);
    if (pop) pop.dataset.url = popUrl || u;
    if (btn) setActive(btn);
  }

  document.querySelectorAll(".browse-btn").forEach((btn) => {
    btn.addEventListener("click", () => load(btn.dataset.url, btn.dataset.pop, btn));
  });

  $("browseGo").addEventListener("click", () => load(input.value));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") load(input.value); });
  pop.addEventListener("click", () => TR.openURL(pop.dataset.url || input.value || frame.src));
  fullBtn.addEventListener("click", () => setFull(!full));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && full) setFull(false);
  });

  const saved = localStorage.getItem(LS_URL);
  if (saved) load(saved);
  renderFullMode();
})();
