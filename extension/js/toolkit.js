/* TheoEngine — Toolkit view: reverse preset library + one-click tools */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const TR = window.TR;

  /* ── Reverse preset library ────────────────────────────── */
  const QR_LS = "tr_reverse_presets";
  const baseName = (p) => String(p).replace(/.*[\\/]/, "");
  const uid = () => "r" + Math.random().toString(36).slice(2, 9);
  let reverseLib = loadReverseLib();

  function loadReverseLib() {
    try {
      const list = JSON.parse(localStorage.getItem(QR_LS));
      if (list && list.length) return list;
    } catch (e) {}
    // Migrate the old one-preset setting so existing users do not lose it.
    const old = (localStorage.getItem("tr_qr_path") || "").trim();
    return old ? [{ id: uid(), name: baseName(old).replace(/\.ffx$/i, ""), path: old }] : [];
  }
  function saveReverseLib() {
    localStorage.setItem(QR_LS, JSON.stringify(reverseLib));
    if (reverseLib[0]) localStorage.setItem("tr_qr_path", reverseLib[0].path);
    else localStorage.removeItem("tr_qr_path");
  }
  function applyReverse(item) {
    TR.toast("Applying " + item.name + "…");
    TR.evalJSX("theoReverse_quickReverse(" + JSON.stringify(item.path) + ")").then((res) => {
      if (res && res.indexOf("OK") === 0) TR.toast(res.replace(/^OK:?/, "✓ "), "ok");
      else TR.toast(res || "No response from After Effects.", "err");
    });
  }
  function renameReverse(item) {
    const next = window.prompt("Rename reverse preset", item.name);
    if (next == null) return;
    const name = next.trim();
    if (!name) { TR.toast("Preset name can't be empty.", "err"); return; }
    item.name = name;
    saveReverseLib();
    renderReverseLib();
  }
  function deleteReverse(item) {
    reverseLib = reverseLib.filter((x) => x.id !== item.id);
    saveReverseLib();
    renderReverseLib();
    TR.toast("removed " + item.name, "ok");
  }
  function renderReverseLib() {
    const wrap = $("qrLibrary");
    if (!wrap) return;
    wrap.innerHTML = "";
    $("qrEmpty").classList.toggle("hidden", reverseLib.length > 0);
    reverseLib.forEach((item) => {
      const row = document.createElement("div");
      row.className = "reverse-preset";
      const main = document.createElement("div");
      main.className = "reverse-preset-main";
      main.innerHTML = '<span class="reverse-preset-name"></span><span class="reverse-preset-file"></span>';
      main.querySelector(".reverse-preset-name").textContent = item.name;
      main.querySelector(".reverse-preset-file").textContent = baseName(item.path);
      main.title = item.path;

      const apply = document.createElement("button");
      apply.type = "button"; apply.className = "preset-apply"; apply.textContent = "Apply";
      apply.addEventListener("click", () => applyReverse(item));
      const rename = document.createElement("button");
      rename.type = "button"; rename.className = "reverse-action"; rename.textContent = "✎"; rename.title = "rename";
      rename.addEventListener("click", () => renameReverse(item));
      const del = document.createElement("button");
      del.type = "button"; del.className = "preset-del"; del.textContent = "×"; del.title = "delete";
      del.addEventListener("click", () => deleteReverse(item));

      row.appendChild(main); row.appendChild(apply); row.appendChild(rename); row.appendChild(del);
      wrap.appendChild(row);
    });
  }
  $("qrPick").addEventListener("click", () => {
    TR.evalJSX("theoReverse_pickFile()").then((res) => {
      if (!res || res.indexOf("OK:") !== 0) { TR.toast(res || "couldn't open the file picker.", "err"); return; }
      const path = res.slice(3).trim();
      if (!path) return;
      const existing = reverseLib.filter((x) => x.path.toLowerCase() === path.toLowerCase())[0];
      if (existing) { TR.toast("that preset is already in the library", "err"); return; }
      reverseLib.push({ id: uid(), name: baseName(path).replace(/\.ffx$/i, ""), path: path });
      saveReverseLib();
      renderReverseLib();
      TR.toast("added · " + baseName(path), "ok");
    });
  });
  saveReverseLib();
  renderReverseLib();

  /* ── one-click tools ─────────────────────────────────── */
  // unified line-icon set (24px, currentColor) — swaps out the emoji for a professional look
  const svg = (p) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  const ICON = {
    saveFrame:    svg('<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7l1.4-2.4h4.2L15.5 7"/><circle cx="12" cy="13.3" r="3.2"/>'),
    precompEach:  svg('<path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z"/><path d="M4.3 7.3 12 11.5l7.7-4.2"/><path d="M12 11.5V21"/>'),
    splitLayer:   svg('<circle cx="6" cy="7" r="2.2"/><circle cx="6" cy="17" r="2.2"/><path d="M8 8.2 19 16.5M8 15.8 19 7.5"/>'),
    reverseLayer: svg('<path d="M11 7v10l-7-5 7-5Z"/><path d="M20 7v10l-7-5 7-5Z"/>'),
    freeze:       svg('<path d="M12 3v18"/><path d="M4.2 7.5 19.8 16.5"/><path d="M19.8 7.5 4.2 16.5"/><path d="m9.5 5 2.5-2 2.5 2"/><path d="m9.5 19 2.5 2 2.5-2"/><path d="m4.8 10.2-.6-2.9 2.9-.3"/><path d="m19.2 10.2.6-2.9-2.9-.3"/><path d="m4.8 13.8-.6 2.9 2.9.3"/><path d="m19.2 13.8.6 2.9-2.9.3"/>'),
    loop:         svg('<path d="M4 10.5V10a5 5 0 0 1 5-5h9"/><path d="M15 1.5 18.5 5 15 8.5"/><path d="M20 13.5v.5a5 5 0 0 1-5 5H6"/><path d="M9 22.5 5.5 19 9 15.5"/>'),
    trimWA:       svg('<path d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H16"/>'),
    sequence:     svg('<rect x="3" y="9" width="4.7" height="6" rx="1"/><rect x="9.6" y="9" width="4.7" height="6" rx="1"/><rect x="16.3" y="9" width="4.7" height="6" rx="1"/>'),
    pixelMotion:  svg('<path d="M2.5 12.5c2 0 2.5-5 4.5-5s2.5 9 4.5 9 2.5-5 4.5-5 2 1.5 3 1.5"/>'),
    motionBlur:   svg('<path d="M4 8h13"/><path d="M3 12h18"/><path d="M6 16h11"/>'),
    fitComp:      svg('<path d="M9 4H5.2A1.2 1.2 0 0 0 4 5.2V9M15 4h3.8A1.2 1.2 0 0 1 20 5.2V9M20 15v3.8a1.2 1.2 0 0 1-1.2 1.2H15M4 15v3.8A1.2 1.2 0 0 0 5.2 20H9"/>'),
    centerAnchor: svg('<circle cx="12" cy="12" r="7.3"/><path d="M12 1.8v3.4M12 18.8v3.4M1.8 12h3.4M18.8 12h3.4"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>'),
    adjust:       svg('<path d="M4 7h8M16 7h4M4 12h3M11 12h9M4 17h5M13 17h7"/><circle cx="14" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="11" cy="17" r="2"/>'),
    solidBG:      svg('<rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" fill-opacity="0.16"/>'),
    speedRamp:    svg('<path d="M3 19c7 0 9-13 18-13"/><path d="M16 6h5v5"/>'),
    beatZoom:     svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M10.5 7.7v5.6M7.7 10.5h5.6"/><path d="M20.5 20.5 15.6 15.6"/>'),
    flash:        svg('<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>'),
    organize:     svg('<path d="M3 7.5a1.5 1.5 0 0 1 1.5-1.5H8l2 2h8.5A1.5 1.5 0 0 1 20 9.5v8A1.5 1.5 0 0 1 18.5 19h-14A1.5 1.5 0 0 1 3 17.5Z"/>')
  };
  const LS_CUSTOM = "tr_custom_kit";
  const TOOL_GROUPS = [
    { title: "Most used", note: "speed + beat helpers", tools: [
      { key: "speedRamp",    lab: "Speed Ramp" },
      { key: "beatZoom",     lab: "Beat Zoom" },
      { key: "flash",        lab: "Flash" },
      { key: "precompEach",  lab: "Precomp Each" }
    ] },
    { title: "Layer timing", note: "cut, reverse, loop", tools: [
      { key: "splitLayer",   lab: "Split Layer" },
      { key: "reverseLayer", lab: "Reverse Layer" },
      { key: "freeze",       lab: "Freeze Frame" },
      { key: "loop",         lab: "Loop Layer" },
      { key: "trimWA",       lab: "Trim to WA" },
      { key: "sequence",     lab: "Sequence" }
    ] },
    { title: "Layer setup", note: "fit, anchor, quality", tools: [
      { key: "pixelMotion",  lab: "Pixel Motion" },
      { key: "motionBlur",   lab: "Motion Blur" },
      { key: "fitComp",      lab: "Fit to Comp" },
      { key: "centerAnchor", lab: "Center Anchor" }
    ] },
    { title: "Project", note: "export + clean up", tools: [
      { key: "saveFrame",    lab: "Save Frame" },
      { key: "organize",     lab: "Organize" },
      { key: "adjust",       lab: "Adjust Layer" },
      { key: "solidBG",      lab: "Solid BG" }
    ] }
  ];
  const ALL_TOOLS = [];
  const TOOL_BY_KEY = {};
  TOOL_GROUPS.forEach((g) => g.tools.forEach((t) => {
    if (!TOOL_BY_KEY[t.key]) { TOOL_BY_KEY[t.key] = t; ALL_TOOLS.push(t); }
  }));
  function loadCustom() {
    try {
      const a = JSON.parse(localStorage.getItem(LS_CUSTOM));
      if (a && a.length) return a.filter((key) => TOOL_BY_KEY[key]);
    } catch (e) {}
    return [];
  }
  function saveCustom(list) { localStorage.setItem(LS_CUSTOM, JSON.stringify(list)); }
  let customTools = loadCustom();

  function runTool(t, b) {
    b.classList.remove("flash");
    void b.offsetWidth;
    b.classList.add("flash");
    const SPECIAL = {
      precompEach: "theoReverse_precompEach()",
      saveFrame:   "theoReverse_saveFrame()",
      speedRamp:   'theoReverse_speedRamp("")',
      beatZoom:    'theoReverse_beatZoom("")',
      organize:    "theoReverse_organize()",
      flash:       'theoReverse_flash("")'
    };
    const call = SPECIAL[t.key] || ("theoReverse_tool(" + JSON.stringify(t.key) + ")");
    TR.evalJSX(call).then((res) => {
      if (res && res.indexOf("OK") === 0) TR.toast(res.replace(/^OK:?/, "✓ "), "ok");
      else TR.toast(res || "No response from After Effects.", "err");
    });
  }

  function makeToolButton(t, opts) {
    opts = opts || {};
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tool" + (opts.custom ? " custom-tool" : "");
    b.innerHTML = '<span class="tool-ico">' + (ICON[t.key] || "") + '</span><span class="tool-lab">' + t.lab + "</span>";
    b.addEventListener("click", () => runTool(t, b));
    if (opts.custom) {
      const x = document.createElement("span");
      x.className = "tool-remove";
      x.textContent = "×";
      x.title = "remove from custom";
      x.addEventListener("click", (e) => {
        e.stopPropagation();
        customTools = customTools.filter((key) => key !== t.key);
        saveCustom(customTools);
        renderAll();
        TR.toast("removed from custom", "ok");
      });
      b.appendChild(x);
    }
    return b;
  }

  const cats = $("kitcats");

  function renderCustom() {
    const section = document.createElement("section");
    section.className = "kitcat kitcat-custom";

    const head = document.createElement("div");
    head.className = "kitcat-head";
    head.innerHTML = '<span class="kitcat-title">Custom</span><span class="kitcat-note">your own panel</span>';
    section.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "kitgrid custom-grid";
    customTools.forEach((key) => grid.appendChild(makeToolButton(TOOL_BY_KEY[key], { custom: true })));

    const add = document.createElement("button");
    add.type = "button";
    add.className = "tool tool-add";
    add.innerHTML = '<span class="tool-ico">＋</span><span class="tool-lab">Add tool</span>';
    grid.appendChild(add);
    section.appendChild(grid);

    const picker = document.createElement("div");
    picker.className = "custom-picker hidden";
    ALL_TOOLS.forEach((t) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "custom-chip" + (customTools.indexOf(t.key) >= 0 ? " added" : "");
      chip.textContent = t.lab;
      chip.addEventListener("click", () => {
        if (customTools.indexOf(t.key) >= 0) return;
        customTools.push(t.key);
        saveCustom(customTools);
        renderAll();
        TR.toast("added " + t.lab + " to custom", "ok");
      });
      picker.appendChild(chip);
    });
    section.appendChild(picker);
    add.addEventListener("click", () => picker.classList.toggle("hidden"));
    cats.appendChild(section);
  }

  function renderGroup(group) {
    const section = document.createElement("section");
    section.className = "kitcat";

    const head = document.createElement("div");
    head.className = "kitcat-head";
    head.innerHTML = '<span class="kitcat-title">' + group.title + '</span><span class="kitcat-note">' + group.note + '</span>';
    section.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "kitgrid";
    group.tools.forEach((t) => grid.appendChild(makeToolButton(t)));
    section.appendChild(grid);
    cats.appendChild(section);
  }

  function renderAll() {
    cats.innerHTML = "";
    renderCustom();
    TOOL_GROUPS.forEach(renderGroup);
  }
  renderAll();
})();
