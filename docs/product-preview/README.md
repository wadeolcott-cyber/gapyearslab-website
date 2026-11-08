# Genuine live Roth-conversion comparison

`assets/product/income-planner-public-beta.webp` shows the actual live Overview after a genuine hypothetical decision was added through Decision Simulator. The previous matching-plan screenshot has been replaced. `capture-evidence.json` records synthetic inputs, UI sequence, observed outputs, capture dimensions, compression and file hash.

## Reproduce the synthetic workflow

Use the existing external Playwright/Chromium setup to run `capture-live-overview.cjs` through the inherited HTTPS proxy. It starts a fresh disposable context and writes only local review artifacts in `/tmp`; it does not change application source or its persistence implementation.

1. Skip the introduction and enter a 2026 joint-filing, two-person contiguous/DC household.
2. Enter $75,000 in taxable retirement withdrawals. Leave other income/adjustment categories unused; the current UI treats them as zero. Use the base standard deduction.
3. Enter hypothetical monthly eligible-member selected-plan/benchmark Silver premiums of $1,400/$1,600, zero monthly advances and January–December coverage. Record the Marketplace/lawful-presence/eligibility assumptions with no other qualifying coverage and confirm full-year records. These are not real quotes or a taxpayer eligibility determination.
4. Review the synthetic Baseline inputs using the app's checkbox.
5. Open Decision Simulator, enter an **additional $10,000 taxable Roth conversion** named “Hypothetical $10,000 Roth conversion,” confirm insurance assumptions, and wait for the actual estimated $12,930 combined-cost increase. The raw simulator text is recorded locally before proceeding.
6. Click **Add to Modified Plan**, then open Overview. Verify one hypothetical decision, Baseline $75,000 and Modified $85,000, and the actual output differences before capture. No baseline conversion or manual Modified override is entered.

| Observed measure | Baseline | Modified |
| --- | ---: | ---: |
| ACA income | $75,000.00 | $85,000.00 |
| Federal tax before credits | $4,640.00 | $5,840.00 |
| Estimated ACA subsidy | $11,730.00 | $0.00 |
| Estimated annual insurance cost | $5,070.00 | $16,800.00 |
| Combined tax + insurance cost | $9,710.00 | $22,640.00 |

The app displays a **+$12,930.00 combined-cost change** and +$10,000.00 of ACA income. Under this assumed household configuration the conversion crosses the modeled subsidy threshold. This does not make a conversion universally good/bad or predict another household's outcome. The conversion is a proposed noncash asset transfer, not completed income or a lifetime strategy. These are observed continuous planning estimates, not certified tax-return results.

## Image handling and scope

The real browser viewport is 1728×1100; a 1728×858 region retains both complete financial cards, the actual delta explanation, and sidebar context. It is resized proportionally to 1440×715 (the original image ratio) with Lanczos and encoded as WebP quality 94/method 6. No numbers, DOM text/styles, application UI, or pixels are fabricated or composited. The applied conversion is documented in the caption; no personal financial information is used. The screenshot's deployed source commit was not independently established.

The original responsive dimensions, native full-size link, lazy loading, and continuous-estimate explanation remain. Only the image, its alt/caption, and its existing provenance files change; unrelated homepage layout and the independently validated cliff example are preserved. Prior homepage before/after screenshots are historical review artifacts, not the new preview.
