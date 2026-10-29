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

1. **Hero:** headline, intro, call-to-action buttons, live stats, cut-out portrait over an outlined "KIRAN" wordmark, and floating highlight chips.
2. **About:** bio, a 3D lanyard **developer ID card** that tilts with the mouse and flips on hover or tap (its QR code scans to LinkedIn), and a quick-facts panel.
3. **Skills:** a "periodic table" of 33 skills with category filters and a live inspector that shows which projects use each skill.
4. **Work:** the LearnX flagship card plus an expanding accordion of 9 projects. Each project has its own animated example UI.
5. **Experience:** a scroll-driven timeline that lights up each stop as you scroll.
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

## Adding your files

| What | Where | Notes |
| --- | --- | --- |
| **Resume PDF** | `html/assets/docs/Kiran-Kumar-Challa-Resume.pdf` | All "Resume" buttons and `/resume` use this file. Until it exists, the buttons open LinkedIn instead. |
| **Intro video** (optional) | `html/assets/video/kiran-intro.mp4` | If the file exists, it plays in the hero (muted, with a sound toggle) in place of the photo. An MP4 (H.264) under ~8 MB works best. |
| **Higher-resolution photos** | `html/assets/img/kiran-portrait.png` / `.webp` (600×940, transparent background) and `kiran-id.jpg` / `.webp` | The current images were taken from a screen recording. Swap in originals for sharper results. |

To change any text, edit `html/index.html`: every section is clearly commented. To add or remove skills tags on a project, edit that project's `data-skills` attribute. The skills inspector updates automatically.

## Credits

Icons: [Lucide](https://lucide.dev) (ISC License). Fonts: Inter Tight, Instrument Serif and JetBrains Mono via Google Fonts.
