EVERYDAY (PWA) — install on Android

A PWA must be served over HTTPS (or localhost). Pick one:

1) GitHub Pages (easiest)
   - Repo Settings > Pages > Deploy from a branch > pick the branch, folder "/ (root)".
   - Open https://<user>.github.io/<repo>/install.html in Chrome on your phone.

2) Any static host (Netlify, Cloudflare Pages, Vercel): upload this folder as-is.

Install: open the site in Chrome on Android > menu (3 dots) > "Install app" / "Add to Home screen".
It then opens straight into the game, full-screen, and works offline.

Updating: edit files, then change VERSION in sw.js (e.g. everyday-v2) so phones refresh the cache.
Tip: the game is landscape-first; rotate your phone for the best view.
