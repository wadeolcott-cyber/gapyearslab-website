# Taxable brokerage article publication review

Article: `/learn/why-taxable-brokerage-matters-early-retirement/`.

The approved shortened draft is preserved, including its title, three benefits, numerical examples, alternatives to taxable savings, and educational disclaimer. The small editorial addition explicitly distinguishes Roth IRA regular contributions from conversions and earnings. A secondary Public Beta Income Planner link uses the requested copy and plain same-tab application URL. No author, publication date, credentials, or personalized recommendation is invented.

## Authoritative source verification

All four URLs below were successfully fetched directly during implementation. IRS Publications 550 and 590-B currently identify their edition as 2025; the article uses general rules, not unverified year-specific thresholds.

- [IRS early distribution exceptions](https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-exceptions-to-tax-on-early-distributions): confirms the general 10% additional tax before 59½ and exceptions, including substantially equal periodic payments and qualified employer-plan separation distributions. The latter is not a general IRA exception. The article intentionally avoids suggesting that retirement accounts are inaccessible before 59½.
- [IRS Publication 590-B](https://www.irs.gov/publications/p590b): regular Roth IRA contributions are first in the nonqualified distribution ordering rules, before conversions/rollovers and earnings; conversion five-year rules and earnings treatment differ. Taxable Roth conversions generally enter income. No blanket claim that every Roth withdrawal is tax-free is made.
- [IRS Publication 550](https://www.irs.gov/publications/p550): investment sale gains depend on amount realized and adjusted basis; eligible net long-term gains can receive a 0% federal rate depending on taxable income. Investment income and transactions may be taxable; taxable brokerage access does not trigger the retirement-account early-distribution tax. The simple example assumes its stated original basis is the relevant basis, with no fees or adjustments.
- [HealthCare.gov income guidance](https://www.healthcare.gov/income-and-household-information/income/): explicitly includes capital gains in Marketplace household income. A 0% federal gain rate does not remove gains from household income.

No material factual correction was needed. The title's “essential” wording is preserved as approved; the body explicitly says a taxable account is not required and identifies other access options.

## Arithmetic and interpretation

- $75,000 − $25,000 = $50,000 annual gap.
- $50,000 × 7 = $350,000 bridge at 0% real return.
- $350,000 − $250,000 = $100,000 shortfall.
- $50,000 proceeds − $30,000 basis = $20,000 realized gain.

All figures are hypothetical. The bridge is a separate accessibility check, not an expense added to the overall funding target. The $1.1 million overall balance is conditional on a planning estimate, not a determination of retirement readiness. The article states that estimates do not guarantee success and omit volatility and account-specific taxes.

## Integration and scope

The calculator is already merged in main (PR #20), so its primary CTA works without an interim destination. Its explanatory text now includes a secondary article link; no calculator module, formula, field, or chart changed. The Learn card uses the existing published-article pattern and retains the existing article/planned resources. Homepage already links to Learn and is unchanged. Planning Tools was reviewed and needs no change.

Canonical, Open Graph and Twitter metadata use the production domain and existing brand assets. Sitemap adds one entry; robots, host-specific indexing headers, privacy, application, analytics implementation, Cloudflare configuration and financial reference fixtures remain unchanged. The new page reuses the existing single analytics snippet exactly. Existing recursive Learn build inclusion already covers the page. No styling or dependency is added.

## Validation and publication dependencies

- Build plus source/build link and metadata checks pass: 13 HTML pages, 275 local references; sitemap XML, complete canonical coverage, unique metadata and indexability pass.
- Existing homepage/article financial-reference checks pass on source and built output; original article is unchanged.
- General Chromium smoke checks pass for 12 pages at 320/360/390/768/1440px (60 combinations): named controls/navigation, heading order, launch links, keyboard skip navigation, and no page overflow.
- Focused browser checks verify Learn → article → calculator → article navigation; exact financial table values, captions/scoped headers, one analytics module, and the plain same-tab Income Planner link. Screenshots captured at 390/768/1440px; desktop article and desktop/mobile financial tables visually reviewed.
- Existing calculator interaction/privacy suite and all 16 numerical tests pass. External analytics is intercepted during focused tests; this does not verify live analytics collection.
- `git diff --check` passes. No full assistive-technology audit is claimed.

No known code/publication dependency blocks this article. This change creates a review PR, not a deployment. After merge/deployment, check production routing, served metadata, sitemap and Cloudflare headers. Tax rules and individual circumstances can change; review source guidance when revising the article.
