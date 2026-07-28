# JICO Properties — website

Owner-operated Grand Strand real estate: we buy residential **and** commercial property,
fix it up, and lease it. In-house maintenance. Slogan: **Opening New Doors.**

Static site — no build step. Black `#0d0d0f` / white / red `#D71F27`, Archivo + Inter.

## Structure
```
index.html                 single page (all sections)
assets/css/styles.css       site styles (black/white/red system)
assets/js/main.js           nav, montage hero, units grid+filter, counters, before/after, contact form
assets/img/                 logo variants, favicon (red door), placeholder photos
assets/video/               crossfading hero clips (muted, looping)
```

## Editing the common things
- **Available units** — edit the `SAMPLE_UNITS` array in `assets/js/main.js` (currently sample data).
- **Hero video** — reorder/swap the `HERO_CLIPS` array in `assets/js/main.js`; drop new `.mp4`s in `assets/video/`.
- **Before/after** — replace the two images in the `#renovation` block of `index.html`.
- **Logo** — `assets/img/logo-white-reddoor.png` (header/footer). Black + monochrome variants also in `assets/img/`.

## TODO before launch
- [ ] Confirm public email (using `info@jicoproperties.com` placeholder in `index.html` + `main.js`).
- [ ] Replace sample unit listings + photos with real ones.
- [ ] Real before/after photo pair (before = at acquisition, after = move-in ready).
- [ ] Real tenant reviews in `#proof` — **do not fabricate testimonials.**
- [ ] Verify the six markets in `#areas` match where JICO actually owns.
- [ ] Contact form: create a free Formspree form, put its endpoint in `<form id="contactForm" action="...">`. Until then it falls back to a mailto.
- [ ] TenantCloud deep links: buttons point to `jicoproperties.tenantcloud.com`; refine to per-action URLs if available.

## Deploy (GitHub Pages)
1. Push to a GitHub repo, enable Pages from `main`.
2. Set custom domain `jicoproperties.com`.
3. GoDaddy DNS — **web records only:** `@` A records → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`; `www` CNAME → `<user>.github.io`.
4. **Do NOT change nameservers or MX records** — that would break GoDaddy Workspace email.
