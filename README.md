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

Pages are standalone semantic HTML with shared CSS. When editing the navigation or footer, update all HTML pages together. Keep page titles, descriptions, canonical URLs, and sitemap entries in sync. The annual preview uses semantic definition lists and explanatory text; figures must continue to be labeled illustrative and must not be presented as application outputs.

## Branding assets

`assets/branding/` contains the supplied assets, extracted unchanged from the uploaded `gapyearslab-brand-assets.zip`. All pages use `logo-full.png` in the header and footer with accessible image text, intrinsic dimensions, and responsive CSS (`height: auto`). Browser icons include the ICO and 16/32/48px PNGs; `icon-180.png` is the Apple touch icon. Navy and teal site colors remain unchanged. The old monogram markup and SVG favicon have been removed.

## Validation

```sh
python3 scripts/check_links.py
bash scripts/build.sh
python3 scripts/check_links.py dist
```

The link checker validates local targets, fragments, one primary heading per page, canonical/Open Graph URLs, sitemap destinations, robots.txt, and pre-launch noindex metadata and Cloudflare header configuration. Build output contains public files only and is ignored by Git. It requires Bash and standard `cp`; no package installation is needed.

Optional browser validation requires Node.js, Playwright, and Chromium. Keep those test dependencies outside this repository:

```sh
npm install --prefix /tmp/gapyears-browser-checks playwright
/tmp/gapyears-browser-checks/node_modules/.bin/playwright install chromium
# Run the Python server above in another terminal first.
NODE_PATH=/tmp/gapyears-browser-checks/node_modules node scripts/check_browser.cjs
```

Set `CHROMIUM_PATH` to use an existing Chromium executable, and `SITE_URL` to change the test origin. The script checks nine pages at widths 320, 360, 390, 768, and 1440 pixels, HTTP responses, horizontal overflow, heading order, named navigation/controls, keyboard skip focus, and preview/how-it-works destinations. Desktop/mobile screenshots are written to `/tmp`. It is a smoke check, not a full accessibility audit; review contrast, zoom, keyboard use, and screen-reader behavior when changing components.

## Cloudflare Pages deployment

1. In Cloudflare, create a Pages project and connect `wadeolcott-cyber/gapyearslab-website`.
2. Select production branch `main` and framework preset **None**.
3. Set build command to `bash scripts/build.sh` and build output directory to `dist`. Leave the project root at the repository root. No environment variables or secrets are required.
4. Review the Pages preview deployment before promoting changes. The root `404.html` provides the not-found page; there are no SPA rewrites.
5. Add `gapyearslab.com` in the project's custom domains and follow Cloudflare's DNS instructions. Configure any desired `www` redirect in Cloudflare. Confirm HTTPS, canonical hostname, all page paths, `/robots.txt`, `/sitemap.xml`, and a missing URL on the deployed site.

The current development deployment is https://gapyearslab-website.pages.dev/. This refinement does not deploy, change DNS, or alter the Cloudflare build command or output directory.

### Pre-launch indexing safeguards

Every HTML page currently carries `noindex, follow`, and `_headers` applies `X-Robots-Tag: noindex, follow` to every path in Cloudflare Pages. The build copies `_headers` to `dist`. This deliberately keeps both the development deployment and any custom-domain deployment unindexed until launch review is complete. Local Python serving does not interpret Cloudflare `_headers`.

Canonical and Open Graph URLs remain on **https://gapyearslab.com/**. `robots.txt` allows crawling so search engines can read noindex directives, and references `https://gapyearslab.com/sitemap.xml`. It is not a privacy or access-control mechanism. The sitemap includes only the homepage, Planning Tools, and About; unfinished policy, contact, learning, methodology, and planner-preview pages are omitted. Do not submit the sitemap until launch approval and removal of noindex on reviewed public pages.

At launch, review content and domain routing first, then deliberately revise the blanket `_headers` rule and per-page robots metadata for approved production pages. Keep unfinished pages noindex and keep **all `pages.dev` hosts** noindex using Cloudflare host-specific rules (or verified production redirects), including branch previews. Test actual response headers after deployment; do not simply remove the blanket rule while leaving the development host indexable.

## Planner integration

All “Preview Planner” and “Preview the Income Planner” links currently lead to `/planner/`, an informative static preview. No requests are made to `app.gapyearslab.com`. The actual planner is maintained separately; this repository does not implement its calculation engine or modify its repository.

Once the separate application is live and verified, update the relevant CTAs and document the integration. Publish actual methodology and privacy information based on that application's behavior first.

## Product scope

GapYears Lab is the broader early-retirement income-planning platform. Its first application, the existing GapYears Income Planner, focuses on annual income sources, estimated federal and applicable state income taxes, ACA premiums and premium tax credits, Roth conversion opportunities, and scenario comparison of overall annual financial outcomes. It does not currently offer comprehensive multi-year retirement projections, portfolio longevity calculations, or Social Security optimization.

## Content remaining before public launch

- **Founder story:** obtain and approve the founder’s short account; the About section currently contains neutral editorial placeholder copy.
- **Indexing and hosting:** review the safeguards above and verify actual Cloudflare response headers, custom-domain routing, and preview-host protection before enabling indexing.
- **Privacy:** identify the operator, monitored contact details, hosting/provider practices, retention, and applicable rights after reviewing actual hosting settings. Current copy is explicitly provisional and makes no legal assurances.
- **Disclaimer:** review the introductory educational disclaimer for the intended launch.
- **Contact:** replace the coming-soon notice with a monitored contact channel. No invented email address is provided.
- **Methodology:** document the actual planner's calculations, assumptions, data sources, limits, and update practices. The current page explains only the made-up website illustration.
- **Learn:** three clearly labeled planned topics are previews, not published guides.
- **Planner:** replace the static preview only when the separate application is available. Figures illustrate annual income, a taxable Roth conversion, and simplified MAGI. They are not tax, ACA, savings, or optimizer results.

## Validation recorded during implementation

Internal links and sitemap targets passed; nine pages passed Chromium checks at five viewport widths (45 combinations), with no horizontal overflow, valid heading order, named navigation/controls, working keyboard skip focus, and functional preview/how-it-works links. Desktop and mobile screenshots were reviewed. Cloudflare deployment, production DNS, and a complete assistive-technology audit remain unverified.

## Refinement review limitations

The deployed pages.dev URL could not be fetched from the development environment because its outbound proxy denied that host. Validation therefore uses the repository’s built output locally; this is not verification of deployed content or live Cloudflare headers. No deployment or separate Income Planner application changes were made.
