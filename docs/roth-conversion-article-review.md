# Roth conversion / ACA article publication review

Publishes `/learn/roth-conversion-aca-subsidy-cost/` using the approved narrative and existing article template. The Learn card, one reciprocal paragraph in the capital-gains article, canonical sitemap entry and browser coverage integrate it with the website. The homepage was reviewed and is unchanged; its different Roth conversion screenshot is explicitly distinguished in the new article.

No author, publication date, credentials, new social graphic, framework, CSS or visitor JavaScript is added. The existing exact analytics snippet appears once on the new page. The static build's existing recursive Learn copy already includes the article.

## Financial verification

The brief supplies the Income Planner reproduction. This website task independently checks the fixed example against official rules and arithmetic; it does not rerun or certify the separate application's engine or live deployment.

All required amounts match the approved example, using continuous annual planning calculations:

| Measure | Baseline | Modified |
| --- | ---: | ---: |
| Ordinary income before deduction | $50,000 | $60,000 |
| Long-term gain | $15,000 | $15,000 |
| ACA household income | $65,000 | $75,000 |
| Base standard deduction | $32,200 | $32,200 |
| Taxable ordinary income | $17,800 | $27,800 |
| Total taxable income including gains | $32,800 | $42,800 |
| Regular federal income tax before credits | $1,780 | $2,840 |
| Annual selected premiums | $19,200 | $19,200 |
| Annual benchmark premiums | $21,600 | $21,600 |
| Expected household contribution at 9.96% | $6,474 | $7,470 |
| Premium tax credit | $15,126 | $14,130 |
| Annual net premiums after final PTC | $4,074 | $5,070 |
| Combined annual modeled cost | $5,854 | $7,910 |

The $15,000 gain is taxed at 0% under these assumptions: total taxable income in each case is below the $98,900 MFJ preferential 0% ceiling, and the deduction is absorbed by ordinary income. Baseline tax is $17,800 × 10% = $1,780. Modified tax is $24,800 × 10% + $3,000 × 12% = $2,840.

The 2025 two-person contiguous-state poverty guideline is $21,150, used for 2026 coverage. Three times is $63,450 and four times is $84,600. Both incomes are in the flat 9.96% 300–400% band and below the cliff. The benchmark minus expected contribution determines PTC here; selected annual premiums do not bind the credit cap. The conversion increases tax by $1,060 and reduces PTC by $996, totaling $2,056, or 20.56% (displayed as 20.6 cents per converted dollar). The federal-only increase is 10.6 cents per dollar.

With $0 APTC the household pays $1,600 monthly, $19,200 across the year, then claims the final credit on its return. $4,074/$5,070 are annual economic costs after that credit, not the monthly payments. The $10,000 moves between accounts rather than becoming living-expense cash. The article preserves alternative cost-funding considerations, conditional future benefits, professional guidance and the planner's annual-only scope.

## Authoritative sources checked

All source URLs below were successfully fetched during implementation. No financial value conflicted with the continuous planning example; final tax-return rules are not certified.

- [IRS RP 2025-32](https://www.irs.gov/pub/irs-drop/rp-25-32.pdf): 2026 MFJ 10% band through $24,800, 12% above that up to $100,800, base standard deduction $32,200, and 0% preferential ceiling $98,900. These are the specific published 2026 amounts, not older-year thresholds.
- [IRS RP 2025-25 in IRB 2025-32](https://www.irs.gov/irb/2025-32_IRB): 2026 applicable percentage table has a flat 9.96% from 300% through 400% FPL.
- [HHS historical poverty guidelines through 2026](https://aspe.hhs.gov/sites/default/files/documents/ca4d59081203b81022bdb86b64ae36cc/Historical%20Poverty%20Guidelines%20Through%202026.xlsx): 48-contiguous-states/nonfarm sheet, row 6, B6=2025 and D6=21150. The public HHS guidelines root also responds. An initially guessed 2025 HTML path returned 404; verification uses this official workbook, not that path.
- [IRS PTC questions and answers](https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit): household-income/FPL principles, pre-open-enrollment guidelines, ability to claim credit when filing, and advance-payment reconciliation.
- [IRS Publication 590-A](https://www.irs.gov/publications/p590a): taxable traditional-to-Roth conversions and normally reporting converted amounts in the relevant tax year.
- [IRS Publication 590-B](https://www.irs.gov/publications/p590b): separate conversion five-year periods, exceptions to the additional tax, ordering rules and explicit treatment of a conversion distribution in one year with a rollover contribution in the next.
- [IRS Form 8606 instructions](https://www.irs.gov/instructions/i8606): basis, aggregate traditional IRA balances, and conversion calculations; the definition includes applicable traditional SEP/SIMPLE balances. [Form 8606 page](https://www.irs.gov/forms-pubs/about-form-8606) also resolves.
- [IRS IRA FAQs](https://www.irs.gov/retirement-plans/retirement-plans-faqs-regarding-iras): 60-day conversion rollovers versus direct transfers; this supports the year-end wording clarification below.
- [IRS Form 8962 page](https://www.irs.gov/forms-pubs/about-form-8962) resolves and links the applicable premium-tax-credit form/instructions.

General IRA publications/instructions currently identify a 2025 edition; they are used for continuing conversion/ordering/basis rules, not for the 2026 financial thresholds. The article directs readers to applicable rules rather than claiming final 2026 filing certification.

## Minor editorial and presentation changes

- Table headers explicitly identify Before/Baseline and After/Modified; caption labels the hypothetical 2026 annual comparison. Combined costs remain bold. No table value changes.
- Detailed approved assumptions go inside one closed native disclosure; visible narrative still states the hypothetical nature, $0 advance-credit/payment timing, below-cliff status and annual scope.
- Clarify the timing bullet to: “For a conversion counted in 2026, the traditional IRA distribution generally must occur by December 31, 2026. Custodian processing deadlines and any applicable rollover-completion rules also matter.” This avoids presenting December 31 as an absolute completion deadline for every indirect rollover, while retaining the year-end planning point. IRS guidance allows a conversion distribution in one year and a rollover contribution in the next. No numerical substitution is made.
- Add one assumptions sentence: “These are continuous annual planning estimates, not a completed tax return; final IRS Tax Table results and filing conventions may differ.” This aligns the article with existing website methodology and distinguishes the verified schedule-based estimates from filed-return amounts.

## Validation

- `python3 scripts/check_roth_article_reference.py` and the `dist` variant pass: fixed-case Decimal arithmetic, all 8 table values, credit/tax/combined differences, below-cliff range, and visible timing qualifications. This is an offline verification script only, not a new visitor financial model or application engine.
- Build and source/build link, canonical/metadata, sitemap/indexability checks pass: 14 HTML pages, 302 local references. Existing homepage and article reference checks pass on source/build.
- Existing site-wide Chromium suite passes 65 page/viewport checks (13 public pages × 320/360/390/768/1440px), covering heading hierarchy, named navigation/controls, keyboard skip navigation and no page overflow.
- New `scripts/roth-article-browser.cjs` passes: Learn link, reciprocal article link, related articles, methodology and same-tab app CTA; exact table amounts and scoped headers; visible payment/scope qualifiers; collapsed keyboard-operable assumptions; one analytics snippet; article/table screenshots at 390/768/1440px; no overflow or page errors.
- Both existing calculator browser suites and all 19 numerical tests pass. No calculator formula, application, user-input, storage or privacy behavior changes.
- Source comparison confirms the capital-gains article changes only by the reciprocal paragraph; its examples and assumptions match main exactly. New analytics snippet matches the template byte-for-byte. Homepage, assets, engines, Privacy/Disclaimer, robots, security headers and build configuration remain unchanged. `git diff --check` passes.

Browser checks intercept the external analytics module and app destination, verifying website navigation rather than live analytics or app availability. All linked IRS article sources were independently fetched successfully. No full assistive-technology audit is claimed.

## Screenshots and publication

- [Desktop article](screenshots/roth-conversion-article/desktop.png)
- [Mobile article](screenshots/roth-conversion-article/mobile.png)
- [Mobile financial table](screenshots/roth-conversion-article/table-mobile.png)

Tablet screenshots are also captured in `/tmp`. Desktop/mobile tables and the full desktop article were visually reviewed. No new application image was generated or substituted.

No implementation dependency blocks publication. This PR does not merge or deploy. After publication, verify article routing, served metadata, sitemap and host-specific headers. Tax guidance and individual circumstances can change; the article is general education and annual estimates, not personal advice or an optimal lifetime conversion recommendation.
