# Early Retirement Calculator review

This deterministic browser-only tool estimates funding needs in today's dollars. It is not a lifetime cash-flow simulation, success probability, tax engine, or determination of retirement readiness. Planning Tools remains the shared navigation hub; both tools are linked there and in a new homepage section without crowding the primary navigation.

## Model

Let S be spending, I dependable outside income, SS annual Social Security, N years until benefits start, B independently entered taxable bridge years, w withdrawal rate as a fraction, and r constant annual real return. Portfolio dividends/interest belong in total return, not outside income. Annual spending should include the visitor's own tax/healthcare estimates.

- Before-benefit gap = max(0, S − I).
- After-benefit gap = max(0, S − I − SS).
- PV(A, n, r) = A × sum((1+r)^−t), t = 0…n−1: beginning-of-year withdrawals. At r=0 this is A×n. The implementation uses log1p/expm1 to reduce cancellation near zero.
- Overall target = PV(before gap, N, r) + (after gap/w)/(1+r)^N. With immediate benefits this is after gap/w. With zero SS, ignore N and use before gap/w.
- Taxable bridge target = PV of the applicable gaps over B years, reducing the gap when benefits start inside the bridge. This checks accessibility separately and is never added to the overall target.
- Combined savings = taxable + retirement savings. Differences are savings minus the applicable target; coverage is savings/target. Zero targets have descriptive messages instead of percentages.

A 0% real-return baseline is always shown. Nonzero returns add a comparison; each scenario's own target defines 100%. Within each result section the shared visual scale has aligned target markers and room above 100%. Visual bars cap at 200% where needed; actual percentages and dollars remain in text. Nonfinite calculations yield a readable limitation rather than NaN/Infinity.

## Reference checks

For spending $75,000, outside income $25,000, SS $30,000 beginning in 10 years, taxable savings $250,000, retirement savings $850,000, bridge 7 years, and withdrawal rate 4%:

| Real return | Overall target | Overall difference | Bridge target | Bridge difference |
| --- | ---: | ---: | ---: | ---: |
| 0% | $1,000,000 | +$100,000 | $350,000 | −$100,000 |
| 3% | $811,352 | +$288,648 | $320,860 | −$70,860 |

Values are rounded for display only. These are hypothetical assumptions, not Income Planner outputs.

The 16 Node model tests cover both reference cases, beginning-of-year timing, near-zero and negative returns, zero/immediate Social Security, benefits during/after the bridge, independent timing, zero gaps/years, excluded inferred investment income, extreme rates/overflow, invalid/blank/nonfinite/negative inputs, all-error aggregation, and percentages above 100%.

The focused Chromium test covers initial blank state, deliberate example loading, reset/reload, optional return, independent baseline, visible reference amounts, aligned markers, capped bars, zero-target messages, accessible error links/focus, preserved entries, and plain same-tab app links. It checks that calculator interactions produce no requests, URL changes, local/session storage, or cookies with the existing external analytics module intercepted. This does not verify deployed analytics collection or third-party script behavior.

## Screenshots

Hypothetical example at 3% real return; both baseline and scenario appear:

- [Desktop, 1440px](screenshots/retirement-calculator-desktop.png)
- [Mobile, 390px](screenshots/retirement-calculator-mobile.png)

Automated responsive checks also cover 768px; the general site check covers 320, 360, 390, 768, and 1440px. Screenshots show the hypothetical-example notice. They are calculator screenshots, not Income Planner screenshots.

## Limits and follow-up

Constant real returns and spending are simplifications. No market variability, sequence risk, longevity, inflation forecast, taxes, ACA calculations, withdrawal ordering, account access eligibility/penalties, Social Security optimization, temporary income, or automatic benefit estimation is modeled. The withdrawal rate is a user assumption, not a guaranteed safe rate. Future benefits and outside income are assumed to maintain today's purchasing power. Extreme finite inputs may exceed numeric/display limits and are rejected visibly.

Inputs remain in this page's memory, with no financial-data transfer to the separate app. Existing website analytics is preserved unchanged, with no custom events. No application repository, engine, saved-plan behavior, Privacy/Disclaimer content, financial examples, Cloudflare Access, or indexing settings are modified. Build-copy inclusion adds the page without changing the Cloudflare command or output directory.

This PR does not deploy. After deployment, verify public routing, module MIME/loading, host-specific headers, and analytics behavior in the production browser. Automated accessibility smoke checks and visual review do not replace a full assistive-technology audit.
