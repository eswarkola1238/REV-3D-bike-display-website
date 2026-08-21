# REV — 3D Bike Showcase

A live, playful catalog of 10 motorcycles rendered in real-time 3D (Three.js), with a hero viewer, filterable grid, spinning thumbnails, and a full-screen model viewer per bike.

## Run it

Browsers block loading local `.glb` files over `file://`, so you need a tiny local server. From this folder, run **one** of:

```bash
# Python 3
python3 -m http.server 8000

# Node
npx serve .
```

Then open **http://localhost:8000** in your browser.

## Structure

```
index.html          — the whole site (HTML/CSS/JS, Three.js via CDN)
game.html            — "Experience The Throttle" mini-game (login-gated)
login.html           — sign in
signup.html          — create account
auth.css / auth-visual.js / auth-form.js — shared auth page styling & logic
models/              — your 10 .glb bike models
audio/               — real engine sound recordings (10 of 10 provided)
README.md
```

## The Throttle game

The "Experience The Throttle" button on the homepage (just above the garage)
opens a first-person endless rider: dodge traffic across 3 lanes, hold your
line, and cover 1.5 km before the 60-second clock runs out. Crashing into
traffic ends the run immediately.

Controls: W/S or ↑/↓ to throttle/brake, A/D or ←/→ to change lanes, Esc to
pause. On touch devices, on-screen buttons appear automatically.

**This is gated behind the mock login/signup flow** — since there's no real
backend, "logged in" is just a `localStorage` flag (`rev_authed`) set when the
login or signup form is submitted. Clicking the throttle button:
- If `rev_authed` is `true` → goes straight to `game.html`
- If not → redirects to `login.html?next=game.html`, and after a successful
  (mock) sign-in/sign-up it redirects on to the game automatically

Because this is front-end only, clearing your browser's localStorage (or using
a private/incognito window) will require signing in again. Wiring this up to
a real auth backend would just mean replacing the `localStorage` check in
`game.html`'s auth-gate block and the `setItem` call in `auth-form.js` with
real session logic.

## Bike sounds

Clicking "Experience the sound" in a bike's viewer plays that bike's real engine
recording once through. All 10 bikes now have a real recording wired up.

The synthesized fallback (Web Audio API) is still in the code and will
automatically kick in if a bike's `sound` field is ever set to `null` or an
audio file fails to load — so the feature degrades gracefully if you swap
files around later.

To change any bike's sound, drop the audio file into `audio/` and update that
bike's `sound:` field (in the `BIKES` array near the top of the
`<script type="module">` block in `index.html`) to its path.

## Notes

- Thumbnails in the catalog grid lazy-load their 3D model only when scrolled into view, to keep things smooth.
- Click any card to open the full viewer: drag to orbit, scroll to zoom, toggle auto-rotate, reset the camera.
- Specs shown (engine cc, power, top speed, weight) are approximate real-world figures for each bike — swap in your own in the `BIKES` array near the top of the `<script type="module">` block in `index.html`.
- To add more bikes: drop a `.glb` into `models/` and add an entry to the `BIKES` array.
