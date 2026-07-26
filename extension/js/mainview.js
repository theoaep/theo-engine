/* TheoEngine — Main release view and GitHub update status */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const VERSION = "1.1.1";
  const API = "https://api.github.com/repos/theoaep/theo-engine/releases/latest";
  const REPO = "https://github.com/theoaep/theo-engine";
  let latestUrl = REPO;
  function parts(v) { return String(v || "0").replace(/^v/i, "").split(".").map((n) => parseInt(n, 10) || 0); }
  function newer(a, b) { const x = parts(a), y = parts(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; }
  function setStatus(text, update) { const s = $("mainStatus"); if (s) s.textContent = text; const d = $("mainDownload"); if (d) d.classList.toggle("hidden", !update); }
  function check() {
    setStatus("Checking GitHub…", false);
    fetch(API, { headers: { Accept: "application/vnd.github+json" } }).then((r) => r.ok ? r.json() : null).then((j) => {
      if (!j) { setStatus("Unable to check right now", false); return; }
      const ver = String(j.tag_name || j.version || "").replace(/^v/i, "");
      const notes = String(j.body || j.notes || "").split("\n")[0].replace(/[#*_`>\-]/g, "").trim();
      if ($("mainNotes") && notes) $("mainNotes").textContent = notes;
      latestUrl = REPO;
      if (newer(ver, VERSION)) {
        setStatus("TheoEngine v" + ver + " is released", true);
        if ($("updateBar")) { $("updateVer").textContent = "TheoEngine update · v" + ver; $("updateNote").textContent = notes ? " — " + notes : ""; $("updateGet").onclick = () => TR.openURL(latestUrl); $("updateSkip").onclick = () => $("updateBar").classList.add("hidden"); $("updateBar").classList.remove("hidden"); }
      } else setStatus("Up to date", false);
    }).catch(() => setStatus("Offline — version check skipped", false));
  }
  $("mainCheck").onclick = check;
  $("mainDownload").onclick = () => TR.openURL(REPO);
  check();
})();
