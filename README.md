# TheoEngine — After Effects toolkit

A CEP panel for football/TikTok editors: AI assistant, one-click editor tools, reverse preset
library, browsing, and a text-animation library. The download has one obvious Windows launcher;
the panel's internal files are kept together under `extension/`. **Restart AE after installing updates.**

Open in AE: **Window → Extensions → TheoEngine**.

## First launch
Type your name once → every launch greets you by name. Click the **"hi, …"** chip to change it.

## Sidebar
### ✦ AI — "Editing Bot by Theo"
- **Setup (⚙ button):** paste one free Google AI Studio key (`AIzaSy…` from aistudio.google.com/apikey)
  and hit **Save**. That's it — no provider toggle, no model dropdown, no thinking level. On Save the
  panel asks your key which models it can run and **locks onto the best flash model your key actually
  has** (shown as "✓ you're in — running …"). The key stays in your localStorage. Auth/access errors
  re-open setup.
- **One model, auto-detected.** Earlier builds let you pick models, but hardcoded names 404'd on some
  keys and the picker just caused confusion — so now it's a single working Gemini model chosen from
  your own key's catalog. If the stored model ever stops existing, the panel silently re-detects a
  working one (and `/models` in chat prints exactly what your key serves).
- **Model badge** reads **Gemini** (hover shows the exact model id).
- **Rate-limit handling:** Gemini's free tier is request-capped (per-minute + ~daily), not credit-metered.
  On a **429** it degrades once to a flash-lite model (its own separate free quota) for that message —
  no cooldown, no lockout. If it's still capped it tells you to wait a minute.
- The bot never names the model/company — asked what it is, it's "an Editing Bot made by Theo."
- Talks like a **real mate** (short, casual, no AI-markdown), fast (thinking off + short answers).
- **Reads your real AE setup** (active comp, selected layers + effects, full plugin list) and
  recommends plugins you actually own.
- **Does edits for you** — "add twitch to this layer", "reverse these", "precomp each", "fade this
  in" → it calls the tool and does it. Actions show a ⚙ line so you see what it did.
- **Actually animates** — it can build motion, not just talk about it:
  - "shake neymarr, small and soft" / "punchy zoom shake" → bakes real shake keyframes
    (position / scale-zoom / rotation, subtle→strong, optional fade-out settle).
  - "grow it in", "slide from the left", "spin it" → keyframes position/scale/rotation/opacity
    with your chosen ease (smooth / linear / hold / punch / overshoot).
  - "make it wiggle", "loop this", "bounce" → drops the right AE expression.
  It reads your selected layer's current transform + the comp center so the values land right.

### ⚡ Kit — one-click tools
- **Reverse presets** is the streamlined reverse workflow. Click **Add preset** to
  choose reverse `.ffx` files, then apply them to selected layers with automatic keyframe stretching.
  Presets can be renamed or removed, and the library is remembered in localStorage.
- Tools grid is grouped so the panel feels less random: **Custom** (users click **Add tool** / plus
  and pick their favourite actions so they have their own mini panel), **Most used** (Speed Ramp, Beat Zoom, Flash,
  Precomp Each), **Layer timing** (Split, Reverse, Freeze, Loop, Trim, Sequence), **Layer setup**
  (Pixel Motion, Motion Blur, Fit to Comp, Center Anchor), and **Project** (Save Frame, Organize,
  Adjustment Layer, Solid BG).
  **Save Frame** (📸 exports the current frame of the active comp to a PNG — a save
  dialog picks where; defaults to the project folder, named `<comp> f<frame>.png`), **Precomp Each**
  (each selected layer → its own Wizard-style precomp with all attributes moved in; the precomp keeps the
  selected layer's original size, source timing, Time Remap values, and position while its duration matches
  the visible layer span), Split Layer, Reverse Layer,
  Trim to Work Area, Sequence, Pixel Motion, Motion Blur, Fit to Comp, Center Anchor,
  Adjustment Layer, Solid BG.

### ◉ Browsing — in-panel browser
- Built-in buttons for **YouTube**, **TikTok**, and **Telegram** so editors can watch
  references, use socials, or browse without leaving After Effects.
- YouTube opens its normal site/search view, and the external-open button handles pages that the embedded browser cannot show.
- The URL bar also works as a normal browser/search box, with **open outside** for sites that block iframe embedding.
- **⛶ fullscreen** hides the quick buttons and expands the browser card inside the panel; press **↩** or **Esc** to go back.
- Layout is responsive: browsing cards and Kit buttons use fluid grids/clamped sizes so resizing the panel stretches
  controls instead of leaving awkward empty bars.

### ∿ Graph — ease curve editor
Select **2+ keyframes** on a property in AE, then shape the curve on the canvas (drag the two
dots — pull past the box for anticipation/overshoot) and **Apply**: it converts the bezier into
real AE speed/influence eases on those keys (multiple selected keys = each consecutive pair).
Built-in presets (Ramp, Smooth, Soft, Punch, Anticipate, Overshoot) + save your own by name.
**✨ ask ai** jumps to the chat with a pre-written message — describe the vibe ("aggressive ramp",
"smooth soft") and the bot applies the graph itself via its set_graph tool.

### T — Text anims
Set **Anim IN duration** / **Anim OUT duration**, select layer(s), click an anim.
IN anims start at the layer in-point; OUT anims end at the out-point.
IN: Fade, Pop, Slide Up/Down, Blur, Typewriter*, Tracking*. OUT: Fade, Pop, Slide Up/Down, Blur,
Tracking*. (*needs a text layer)

### ▦ Presets — your `.ffx` library
- **Add preset** → native file dialog to pick a `.ffx`; it's saved to your library (the file stays
  where it is on disk — the library just remembers it).
- **Folders** — **＋ folder** to make one; click a folder chip to filter; the active folder's **×**
  deletes it (its presets fall back to **Unfiled**). **All** shows everything.
- **Apply** — select layer(s) in AE, hit **Apply** on any preset and it's applied to each.
- The library lives in your localStorage; nothing is uploaded.

### ❒ Projects — your `.aep` library
- **Add .aep** → pick a saved project to remember; **Save current** → Save-As the open project into
  your library. Same folders/filter model as Presets.
- **Import** (one click) → merges that project's comps + footage **into whatever you have open now**
  (`app.project.importFile` on the `.aep`) — no digging through File › Import. Great for reusable
  title scenes, transition packs, or a starter template.

### Live "N online"
The live count is opt-in: it only appears once `PRESENCE_URL` is set in [extension/js/presence.js](extension/js/presence.js). Setup (free, ~3 min, no server
code): create a **Firebase** project → add a **Realtime Database** → set its rules so `/presence` is
public, then paste the database URL:
```json
{ "rules": { "presence": { ".read": true, ".write": true } } }
```
Each open panel writes a timestamp every ~20s; the badge counts panels seen in the last 45s and cleans
up stale entries. Left unset, the badge just stays hidden.

## Install (for users)
Download the latest release ZIP and unzip it. For the least restrictive/manual path, run **`INSTALL MANUAL THEOENGINE.bat`** and press Enter to use:
`%APPDATA%\Adobe\CEP\extensions\com.theo.engine`, or enter another destination.
The file-copy installers do not change the registry, download software, or require administrator access.
If Windows SmartScreen warns, verify the package came from the official release page before choosing **More info → Run anyway**.

After copying, restart After Effects → **Window → Extensions → TheoEngine**. If the unsigned CEP panel is not listed, follow Adobe’s manual CEP support setup for your installed version.


## Releasing + "update available" banner
On launch the panel checks `UPDATE_URL` (already wired to
`https://api.github.com/repos/theoaep/theo-engine/releases/latest`) and, if a newer version is live,
shows a banner: **"Update available · v1.1.0 — <note>"** with **Install** (opens the release page —
zip + installers) and **Skip** (hides it until an even newer version). Skips are remembered in
localStorage (`tr_update_skip`).

**To ship a new version:**
1. Bump the version in **both** places (keep them equal):
   - `extension/CSXS/manifest.xml` → `ExtensionBundleVersion` and the `<Extension … Version>`
   - [extension/js/main.js](extension/js/main.js) → `CURRENT_VERSION`
2. Commit + push.
3. On GitHub → **Releases → Draft a new release** → tag `vX.Y.Z` → write a short description (its
   first line becomes the banner note) → **Publish**. Attach a ZIP containing the repository root;
   the root launcher and its `installer/` + `extension/` folders must remain together. GitHub's automatic
   source ZIP is also installable.

(Alternative to GitHub Releases: host a `version.json` elsewhere and point `UPDATE_URL` at it —
`{ "version", "notes", "url" }`.)

**Optional — signed `.zxp`:** sign with Adobe's `ZXPSignCmd` (needs a cert.p12) so users can install
with the **ZXP/UXP Installer** instead of the `.bat`. Not required — the `.bat` path works today.

## Debugging
- Panel DevTools: open panel → browse `http://localhost:8099` in Chrome.
- ExtendScript errors surface as toasts prefixed `ERR:`.
- After editing files here, restart AE.

## Layout
```
INSTALL THEOENGINE.bat  one obvious Windows installer launcher
START HERE.txt            quick beginner instructions
installer/install.ps1     installer implementation
docs/INSTALL.txt          troubleshooting and manual installation
extension/                CEP payload; keep this folder intact
  CSXS/manifest.xml       CEP manifest (AEFT, CEP 9+)
  index.html              panel shell
  css/style.css           all styles
  js/                     panel modules
  jsx/engine.jsx          ExtendScript host engine
```
