/* TheoEngine — global click ripples + cursor-follow sheen (pure flair, no deps) */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let audioCtx;
  function tone(type = "click") {
    if (reduce) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime, stretch = type === "stretch";
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = stretch ? "sine" : "triangle";
      osc.frequency.setValueAtTime(stretch ? 180 : 520, now);
      osc.frequency.exponentialRampToValueAtTime(stretch ? 95 : 760, now + (stretch ? .16 : .055));
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(stretch ? .045 : .065, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + (stretch ? .18 : .075));
      osc.connect(gain).connect(audioCtx.destination); osc.start(now); osc.stop(now + (stretch ? .2 : .09));
    } catch (_) {}
  }
  window.TRFX = { tone, burst };
  function burst(x, y) {
    if (reduce) return;
    const layer = document.createElement("div"); layer.className = "fx-burst";
    layer.style.left = x + "px"; layer.style.top = y + "px";
    for (let i = 0; i < 10; i++) { const p = document.createElement("i"); p.style.setProperty("--a", (i * 36) + "deg"); p.style.setProperty("--d", (18 + Math.random() * 18) + "px"); layer.appendChild(p); }
    document.body.appendChild(layer); layer.addEventListener("animationend", () => layer.remove(), { once: true });
  }

  // elements that get a click ripple (tappad has its own richer effect → excluded)
  const RIPPLE = ".tool,.build,.hero,.mini,.ghost,.sendbtn,.playbtn,.rail-btn,.chip";

  document.addEventListener("pointerdown", (e) => {
    if (reduce || e.button !== 0) return;
    const el = e.target.closest(RIPPLE);
    if (!el || el.disabled) return;
    tone(); burst(e.clientX, e.clientY);
    el.classList.remove("fx-press"); void el.offsetWidth; el.classList.add("fx-press");
    el.addEventListener("animationend", () => el.classList.remove("fx-press"), { once: true });
    const r = el.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 1.6;
    const rip = document.createElement("span");
    rip.className = "rfx";
    rip.style.width = rip.style.height = d + "px";
    rip.style.left = (e.clientX - r.left) + "px";
    rip.style.top = (e.clientY - r.top) + "px";
    el.appendChild(rip);
    rip.animate(
      [{ transform: "translate(-50%,-50%) scale(0)", opacity: 0.55 },
       { transform: "translate(-50%,-50%) scale(1)", opacity: 0 }],
      { duration: 560, easing: "cubic-bezier(0.23,1,0.32,1)" }
    ).onfinish = () => rip.remove();
  }, { passive: true });

  // cursor-follow radial sheen on tools / hero / build
  if (!reduce) {
    const GLOW = ".tool,.hero,.build";
    let raf = 0, last = null;
    document.addEventListener("pointermove", (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = last.target.closest(GLOW);
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((last.clientX - r.left) / r.width * 100) + "%");
        el.style.setProperty("--my", ((last.clientY - r.top) / r.height * 100) + "%");
      });
    }, { passive: true });
  }
})();
