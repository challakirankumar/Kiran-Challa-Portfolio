# Kiran Kumar Challa — Portfolio

A premium, single-page personal portfolio built with plain **HTML, CSS and JavaScript** — no frameworks and no build step. It is ready to deploy on **Cloudflare Pages** or **Cloudflare Workers** and connect to a custom domain.

```
.
├── wrangler.jsonc          # Cloudflare Workers (static assets) config — serves ./html
└── html/                   # ← the website (this folder is what gets deployed)
    ├── index.html          # the whole site
    ├── 404.html            # custom "page not found"
    ├── _headers            # security + caching headers (Cloudflare)
    ├── _redirects          # short links: /resume, /linkedin, /instagram, /preparation-ai
    ├── robots.txt · sitemap.xml · site.webmanifest · favicon.svg
    └── assets/
        ├── css/styles.css
        ├── js/main.js
        ├── img/            # portrait, ID photo, social preview, app icons
        ├── docs/           # put the resume PDF here
        └── video/          # (optional) put the intro video here
```

## Sections

1. **Hero:** headline, intro, call-to-action buttons, live stats, and a scroll-triggered intro: Kiran, with the background removed, walks forward and talks over the outlined "KIRAN" wordmark.
2. **About:** bio, a 3D lanyard **developer ID card** that tilts with the mouse and flips on hover or tap (its QR code scans to LinkedIn), and a quick-facts panel.
3. **Skills:** a "periodic table" of 33 skills with colour-coded icons (brand marks for Claude, Gemini, ElevenLabs, NotebookLM, Kubernetes and CI/CD), category filters, and a live inspector that shows which projects use each skill.
4. **Work:** the LearnX flagship card plus an expanding accordion of 9 projects. Each project has its own animated example UI.
5. **Experience:** a scroll-driven timeline from education to the current role, including the founder track and key contributions from the resume.
6. **Achievements:** a drag-to-scroll carousel with count-up numbers.
7. **Contact:** the email address with a copy button, phone numbers, social links, and a rotating "Say hello" button.

The site is responsive from phone to widescreen, works with keyboard navigation, and respects the "reduce motion" accessibility setting. It also includes SEO metadata, Open Graph social cards and JSON-LD structured data.

---

## Deploy to Cloudflare

### Option A — Cloudflare Pages (simplest, recommended)

1. Push this repository to GitHub (already done if you are reading this there).
2. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
3. Pick this repository and the branch you want to publish.
4. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `html`
5. Click **Save and Deploy**. Your site is live at `https://<project>.pages.dev`.
6. **Custom domain:** in the project, open **Custom domains → Set up a custom domain** and enter your domain (e.g. `kiranchalla.com`). If the domain's DNS is already on Cloudflare, the record is created for you. Otherwise, add the CNAME that Cloudflare shows at your domain registrar.

Every push to the branch redeploys automatically.

### Option B — Cloudflare Workers (static assets)

`wrangler.jsonc` is already set up to serve the `html/` folder.

- **From the dashboard:** go to **Workers & Pages → Create → Workers → Import a repository**, select this repo, and leave the build command empty. The deploy command is `npx wrangler deploy`.
- **From your computer:**

  ```bash
  npx wrangler login
  ```

  ```bash
  npx wrangler deploy
  ```

- **Custom domain:** open the Worker, go to **Settings → Domains & Routes → Add → Custom domain**, and enter your domain.

### Preview locally

```bash
npx wrangler dev
```

You can also use any static server, for example `python3 -m http.server 8787 --directory html`, and then open http://localhost:8787.

---

## After you connect your domain

Replace `YOUR-DOMAIN.com` in `html/robots.txt` and `html/sitemap.xml` with your real domain.

## Media files

| What | File(s) | How it's used |
| --- | --- | --- |
| **Resume** | `html/assets/docs/Kiran-Kumar-Challa-Resume.pdf` | Opened by the "Resume" buttons and downloaded by "Download resume". The short link `/resume` points to it as well. |
| **Intro video (background removed)** | `html/assets/video/kiran-intro-alpha.mp4` + `.webm` | A "stacked alpha" video: the picture is in the top half and the person's cut-out mask in the bottom half. A small WebGL shader joins them in the browser, so Kiran appears with **no background**, standing directly on the page. |
| **Intro video (original)** | `html/assets/video/kiran-intro.mp4` + `.webm` | Fallback, only for browsers without WebGL. |
| **Stills** | `html/assets/img/intro-start.*` (first frame) and `kiran-portrait.*` (last frame) | Transparent cut-outs, shown before the intro starts and after it ends. |
| **ID card photo** | `html/assets/img/kiran-id.webp` / `.jpg` | The photo on the lanyard ID card. |

### How the hero works

- **Desktop:** the hero is pinned. The visitor's first scroll starts the intro: the text steps aside and Kiran walks forward and talks. When he finishes, the text returns, he settles beside it, and scrolling continues normally.
- **Tablet and phone:** the text comes first. The intro starts when the visitor scrolls Kiran into view.
- **Sound:** browsers only allow sound after a visitor's first tap, click or keypress. If sound is blocked, the intro plays silently with a **Tap to hear Kiran** button. The corner button switches between Play intro, Sound on/Mute and Replay intro.
- **Respectful defaults:** the intro pauses when scrolled off-screen, and it never autoplays for visitors with *reduced motion* or *data saver* on. They can still press Play.

To replace the intro with a new clip, the stacked-alpha file has to be regenerated (person segmentation for each frame, with colour stacked above the mask). Ask Claude to do this from the new MP4.

To change any text, edit `html/index.html`: every section is clearly commented. To add or remove skills tags on a project, edit that project's `data-skills` attribute. The skills inspector updates automatically.

## Credits

Icons: [Lucide](https://lucide.dev) (ISC License). Fonts: Inter Tight, Instrument Serif and JetBrains Mono via Google Fonts.
