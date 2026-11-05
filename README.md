# GapYears Lab

A dependency-free static website for **gapyearslab.com**. The site introduces a free-to-use early-retirement planning project and the GapYears Income Planner.

## Local development

Use Python 3 (no packages required):

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` in your own browser. Edit HTML or `assets/site.css` and reload. There is no JavaScript shipped to visitors, database, account system, external font, analytics integration, or application engine.

## Structure

- `index.html`: homepage
- `planning-tools/`, `planner/`, `learn/`, `about/`: product and educational pages
- `methodology/`, `privacy/`, `disclaimer/`, `contact/`: supporting information
- `assets/`: shared stylesheet and SVG favicon
- `404.html`: custom not-found page
- `robots.txt`, `sitemap.xml`: search engine discovery
- `scripts/`: dependency-free build/link validation and optional browser checks

Pages are standalone semantic HTML with shared CSS. When editing the navigation or footer, update all HTML pages together. Keep page titles, descriptions, canonical URLs, and sitemap entries in sync. The chart is CSS with a text alternative; figures must continue to be labeled illustrative.

## Validation

```sh
python3 scripts/check_links.py
bash scripts/build.sh
python3 scripts/check_links.py dist
```

The link checker validates local targets, fragments, one primary heading per page, basic metadata, and sitemap destinations. Build output contains public files only and is ignored by Git. It requires Bash and standard `cp`; no package installation is needed.

Optional browser validation requires Node.js, Playwright, and Chromium. Keep those test dependencies outside this repository:

```sh
npm install --prefix /tmp/gapyears-browser-checks playwright
/tmp/gapyears-browser-checks/node_modules/.bin/playwright install chromium
# Run the Python server above in another terminal first.
NODE_PATH=/tmp/gapyears-browser-checks/node_modules node scripts/check_browser.cjs
```

Set `CHROMIUM_PATH` to use an existing Chromium executable, and `SITE_URL` to change the test origin. The script checks nine pages at widths 360, 390, 768, and 1440 pixels, HTTP responses, horizontal overflow, primary headings, and keyboard skip navigation. Desktop/mobile screenshots are written to `/tmp`. It is a smoke check, not a full accessibility audit; review contrast, zoom, keyboard use, and screen-reader behavior when changing components.

## Cloudflare Pages deployment

1. In Cloudflare, create a Pages project and connect `wadeolcott-cyber/gapyearslab-website`.
2. Select production branch `main` and framework preset **None**.
3. Set build command to `bash scripts/build.sh` and build output directory to `dist`. Leave the project root at the repository root. No environment variables or secrets are required.
4. Review the Pages preview deployment before promoting changes. The root `404.html` provides the not-found page; there are no SPA rewrites.
5. Add `gapyearslab.com` in the project's custom domains and follow Cloudflare's DNS instructions. Configure any desired `www` redirect in Cloudflare. Confirm HTTPS, canonical hostname, all page paths, `/robots.txt`, `/sitemap.xml`, and a missing URL on the deployed site.

Deployment and DNS changes have not been performed by this implementation. Preview deployments retain production canonical metadata. Apply access controls or noindex response headers to previews in Cloudflare if needed; don't change production robots rules to accomplish that.

## Planner integration

All “Open Planner” and “Explore the Income Planner” links currently lead to `/planner/`, an informative static preview. No requests are made to `app.gapyearslab.com`. The actual planner is maintained separately; this repository does not implement its calculation engine or modify its repository.

Once the separate application is live and verified, update the relevant CTAs and document the integration. Publish actual methodology and privacy information based on that application's behavior first.

## Content remaining before public launch

- **Privacy:** identify the operator, monitored contact details, hosting/provider practices, retention, and applicable rights after reviewing actual hosting settings. Current copy is explicitly provisional and makes no legal assurances.
- **Disclaimer:** review the introductory educational disclaimer for the intended launch.
- **Contact:** replace the coming-soon notice with a monitored contact channel. No invented email address is provided.
- **Methodology:** document the actual planner's calculations, assumptions, data sources, limits, and update practices. The current page explains only the made-up website illustration.
- **Learn:** three clearly labeled planned topics are previews, not published guides.
- **Planner:** replace the static preview only when the separate application is available. Figures do not model tax, healthcare, inflation, returns, or savings sustainability.

## Validation recorded during implementation

Internal links and sitemap targets passed; nine pages passed Chromium checks at four viewport widths, with no horizontal overflow and working keyboard skip links. Desktop and mobile screenshots were reviewed. Cloudflare deployment, production DNS, and a complete assistive-technology audit remain unverified.
