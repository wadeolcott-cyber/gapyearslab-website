# GapYears Lab

A dependency-free static website for **gapyearslab.com**. The site introduces a free-to-use early-retirement planning project and the GapYears Income Planner.

## Local development

Use Python 3 (no packages required):

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` in your own browser. Edit HTML or `assets/site.css` and reload. The only visitor JavaScript is the supplied Cloudflare Web Analytics beacon. There is no database, account system, external font, or application engine in this website.

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
python3 scripts/check_reference_example.py
python3 scripts/check_reference_example.py dist
```

The link checker validates local targets, fragments, one primary heading per page, canonical/Open Graph URLs, sitemap destinations, robots.txt, and public-page indexability, unique titles/descriptions, sitemap coverage, and host-scoped Cloudflare header configuration. Build output contains public files only and is ignored by Git. It requires Bash and standard `cp`; no package installation is needed.

Optional browser validation requires Node.js, Playwright, and Chromium. Keep those test dependencies outside this repository:

```sh
npm install --prefix /tmp/gapyears-browser-checks playwright
/tmp/gapyears-browser-checks/node_modules/.bin/playwright install chromium
# Run the Python server above in another terminal first.
NODE_PATH=/tmp/gapyears-browser-checks/node_modules node scripts/check_browser.cjs
```

Set `CHROMIUM_PATH` to use an existing Chromium executable, and `SITE_URL` to change the test origin. The script checks nine pages at widths 320, 360, 390, 768, and 1440 pixels, HTTP responses, horizontal overflow, heading order, named navigation/controls, keyboard skip focus, and launch/how-it-works destinations. Desktop/mobile screenshots are written to `/tmp`. It is a smoke check, not a full accessibility audit; review contrast, zoom, keyboard use, and screen-reader behavior when changing components.

## Cloudflare Pages deployment

1. In Cloudflare, create a Pages project and connect `wadeolcott-cyber/gapyearslab-website`.
2. Select production branch `main` and framework preset **None**.
3. Set build command to `bash scripts/build.sh` and build output directory to `dist`. Leave the project root at the repository root. No environment variables or secrets are required.
4. Review the Pages preview deployment before promoting changes. The root `404.html` provides the not-found page; there are no SPA rewrites.
5. Add `gapyearslab.com` in the project's custom domains and follow Cloudflare's DNS instructions. Configure any desired `www` redirect in Cloudflare. Confirm HTTPS, canonical hostname, all page paths, `/robots.txt`, `/sitemap.xml`, and a missing URL on the deployed site.

The current development deployment is https://gapyearslab-website.pages.dev/. This refinement does not deploy, change DNS, or alter the Cloudflare build command or output directory.

### Production indexing and preview protection

The ten public informational pages use normal search engine indexing defaults and production canonical/Open Graph URLs under **https://gapyearslab.com/**. The custom 404 remains noindex and is excluded from the sitemap. `robots.txt` permits public crawling and references `https://gapyearslab.com/sitemap.xml`.

`_headers` applies noindex only to the development hostname and its branch/version preview subdomains. No blanket production noindex remains. Local Python serving does not interpret these Cloudflare header rules; verify them after deployment. Cloudflare-managed header or crawler rules may also need owner review. The separate application indexing strategy is unchanged.

The static sitemap lists all ten canonical public pages. When adding a page, add its production canonical URL to the sitemap; do not add 404s, app URLs, redirects, preview hosts, or private resources. The validator compares the complete public-page set with sitemap entries and rejects duplicates, accidental noindex, and missing/noncanonical targets. No speculative lastmod, priority, or changefreq values are generated.

### Post-deployment indexing checklist

- Verify HTTPS and expected content/status codes for every sitemap URL.
- Fetch `https://gapyearslab.com/robots.txt` and `https://gapyearslab.com/sitemap.xml`; confirm the sitemap is valid XML and the robots reference is correct.
- Inspect production HTML and response headers for unintended noindex/none directives, including Cloudflare-managed `X-Robots-Tag` rules. Verify canonical URLs use the production domain.
- Confirm pages.dev development/preview responses retain noindex and production security headers remain intact. Check a missing URL returns 404.
- In Google Search Console, verify domain ownership if needed, submit `https://gapyearslab.com/sitemap.xml`, request indexing for the homepage/primary planning pages, and monitor status/errors.
- Consider submitting the same sitemap in Bing Webmaster Tools.

These are owner follow-ups, not claims of deployment, submission, or indexing. Search engines decide when and whether to index pages.

## Planner integration

“Launch Income Planner” links open **https://app.gapyearslab.com** in the same tab. The homepage and Planning Tools page also link to `/planner/`, the product overview and feature explanation. The illustrative annual example remains explicitly separate from genuine application results.

The website and planner remain separate GitHub repositories and Cloudflare Pages projects. There is no iframe, shared calculation engine, or app code in this repository. The public website indexing configuration is separate from the application’s indexing strategy.

## Product scope

GapYears Lab is the broader early-retirement income-planning platform. Its first application, the existing GapYears Income Planner, focuses on annual income sources, estimated federal income taxes only, ACA premiums and premium tax credits, Roth conversion opportunities, and scenario comparison of overall annual financial outcomes. State income taxes and payroll/self-employment taxes are not currently modeled. It does not currently offer comprehensive multi-year retirement projections, portfolio longevity calculations, or Social Security optimization.

## Content remaining before public launch

- **Founder story:** review the completed draft based on approved themes, including the wording about more than 20 years of experience and leadership at Visa. No name, photo, degrees, or professional tax/investment credentials are included.
- **Indexing and hosting:** complete the post-deployment checklist above, including production headers, canonical routing, and preview-host protection.
- **Privacy:** review provider/infrastructure and feedback settings, contact availability, and any applicable visitor rights. Set the notice’s actual publication date when it goes live; this PR does not claim publication or verified retention periods.
- **Disclaimer:** review the introductory educational disclaimer for the intended launch.
- **Contact:** replace the coming-soon notice with a monitored contact channel. No invented email address is provided.
- **Methodology:** keep the accessible summaries aligned with the underlying validation reports and known filing-method limitations. Evidence and attribution notes are in `docs/positioning-evidence.md`.
- **Learn:** three clearly labeled planned topics are previews, not published guides.
- **Planner:** the live application is linked; keep its features and documentation aligned as it evolves. The homepage comparison transcribes the validated 2026 capital-gains ACA threshold cases; the planner overview keeps a separate made-up conceptual example. Neither is a live screenshot or a personalized recommendation.

## Validation recorded during implementation

Internal links and sitemap targets passed; nine pages passed Chromium checks at five viewport widths (45 combinations), with no horizontal overflow, valid heading order, named navigation/controls, working keyboard skip focus, and functional launch/how-it-works links. Desktop and mobile screenshots were reviewed. Cloudflare deployment, production DNS, and a complete assistive-technology audit remain unverified.

## Refinement review limitations

The deployed pages.dev URL could not be fetched from the development environment because its outbound proxy denied that host. Validation therefore uses the repository’s built output locally; this is not verification of deployed content or live Cloudflare headers. No deployment or separate Income Planner application changes were made.

## Live planner link validation

Website launch links target `https://app.gapyearslab.com` in the same tab. Responsive browser checks verify every launch link, absence of iframe embeds, and same-tab navigation using an intercepted destination (no app calculations are exercised). The development environment proxy denied direct access to the app hostname during this change, so live application availability and functionality were not independently verified. No application code or hosting configuration was modified.

## Homepage positioning and evidence review

The homepage now explains the ACA-focused audience and shows a 2026 threshold comparison from frozen reference cases, with assumptions and separate federal income tax and net insurance costs. Methodology summarizes documented validation, with tester attribution and filing-method caveats. The application repository is private; visitor-facing pages provide accessible summaries instead of private GitHub links.

`docs/capital-gains-homepage-reference-2026.json` is the current limited source-value extract, not a new financial model. `scripts/check_reference_example.py` checks the current fourteen whole-dollar scenario amounts and approximate highlight against PR #47’s draft annual filing comparator. The earlier withdrawal-case extract is retained unchanged as historical evidence. Read `docs/capital-gains-example-evidence.md` for the current scenario sources and scope; `docs/positioning-evidence.md` records the earlier positioning and founder review. Reviewed screenshots are in `docs/screenshots/`; none are fabricated application screenshots. These developer review files are excluded from the existing public build by its allowlisted copies.

Supported planning year remains **2026**. No 2027 support or release date is promised. Noindex, navigation, deployment configuration, and Privacy/Disclaimer/Contact pages remain unchanged. Application validation reports were read but their financial suites were not rerun; no app repository or engine changes were made.

## Public website analytics

Cloudflare Web Analytics is manually installed once immediately before `</body>` on all ten public HTML pages, including the custom 404. The public site identifier is `2c066b4f0f454d73b66d63f1630e8c43`; it is not a credential. Automatic injection is managed separately in Cloudflare and must remain disabled to avoid duplicates. No custom events or financial inputs, plan data, form contents, or personal identifiers are attached by website code. The separate Income Planner repository and its CSP/storage/privacy controls are not modified.

**Privacy disclosure:** the Privacy page now distinguishes browser-local financial plans from website analytics and hosting metadata. Provider retention, infrastructure, external feedback settings, and contact availability still need operational review; no unverified retention periods or legal assurances are stated.

No repository CSP or CSP meta tags were found, and the development site's observed response had no CSP header; no CSP changes were needed. The environment proxy blocked inspection of the production domain's response headers. Check any Cloudflare-managed CSP on the public domain after deployment: it must permit the module from `https://static.cloudflareinsights.com` and the beacon's request destinations (including `https://cloudflareinsights.com`). Scope any needed adjustment to this website only; do not change the planner CSP.

Live collection remains unverified until deployment. On production, confirm one beacon script per page, successful module loading and beacon requests without CSP errors, and traffic appearing in the correct Web Analytics property. Check the custom 404 as well. Local browser tests validate layout/navigation with the external module intercepted; they do not establish live collection. Noindex and existing Cloudflare Pages configuration remain unchanged.

## Browser-local financial data notice

The homepage privacy statement links to `/privacy/`. The revised notice reflects the merged application privacy audit (`docs/security/financial-data-privacy-audit-2026.md`, PR #39), reviewed implementation `fa728da988c0f6d7952f39b9ab50258aa8a3c1ed`, and the operator-reported subsequent live Chrome DevTools checks supplied for this content task. Those live observations are explicitly distinguished from the source/local-runtime audit; they were not rerun by this website update.

No app accounts or brokerage connections are required by the reviewed application. Calculations and workers execute in the browser; autosave uses unencrypted origin-local storage when available. Exports are unencrypted, import is local, and clearing saved entries is not secure erasure. Shared profiles, extensions, compromised devices, files/backups and other tabs remain relevant risks. Hosting/website analytics metadata and voluntary external submissions are distinct from automatic financial uploads.

**Publication follow-up:** this change prepares a PR, not a deployment. The Privacy page does not falsely claim November 6, 2026 as its publication date; replace the pending-publication line with the actual date when the notice goes live (use November 6 only if published that day). The Contact page still has no configured public channel and is a launch-readiness issue. Cloudflare infrastructure/log-retention and external feedback-form settings were not fully verified. No absolute security, encryption, anonymity, or legal-compliance assurances are made.

## Educational articles

The first article is `/learn/zero-percent-capital-gains-aca-subsidy-cliff/`. It reuses standalone HTML, shared navigation/footer/analytics, and responsive article styles; the existing recursive `learn` build copy includes it without build configuration changes. Add future articles to Learn, the canonical sitemap, and browser coverage. Keep planned topics distinct from published resources.

Run `python3 scripts/check_article_reference.py` and `python3 scripts/check_article_reference.py dist` for the revised whole-dollar comparison. Source review and publication qualifications are in `docs/first-article-evidence.md`. Fresh live checks of official IRS/HealthCare.gov URLs were proxy-blocked in this environment; recheck them and the applicable final-year guidance before publication. No author/date is invented while publication is pending review.

## Homepage whole-dollar publication example

The homepage now uses the same revised $128,600/$128,601 pair as the educational article, based on the recorded PR #47 report and `docs/article-aca-rounding-reference-2026.json`. The cards display approximately $23,191 of credit and $6,809 of net premiums at A, $0/$30,000 at B, and $0 regular federal income tax before credits in both. The estimate is not a guaranteed filed result. Methodology preserves the separate continuous planning $23,191.44/$6,808.56 figures and explains why they differ. Earlier cent-level extracts and review screenshots are historical technical evidence, not the current homepage publication reference. No reference fixture or app calculation is changed.
