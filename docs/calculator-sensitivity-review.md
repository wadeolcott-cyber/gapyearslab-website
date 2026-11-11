# Withdrawal-rate sensitivity and taxable bridge guidance

## Implementation

The 4% default remains editable under the existing validation rules. Its help now explicitly addresses longer early-retirement horizons and the illustrative nature of this starting point.

A native, initially closed disclosure follows the overall target cards: “How would a different withdrawal rate change my target?” A semantic table uses the existing `calculate()` function for 3.0%, 3.5% and 4.0%, keeping current spending, dependable income, Social Security amount/timing, savings, bridge years, and entered real return unchanged. A custom entered rate is added once and labeled; the main input is never overwritten. No recommendation or probability of success is calculated.

The existing 0% baseline/entered-return bars remain separate and unchanged. The table fixes real return at the user's entered value (blank means the existing 0% default). Open state is preserved during valid edits; initial render/reset is closed and missing/invalid results do not show the disclosure. All-zero targets show a sentence rather than a table. Numeric limits produce readable errors per comparison row rather than NaN/Infinity.

Below bridge results, one short note explains that household-specific realized gains, taxes and ACA effects can reduce spending power. Two contextual text links lead to the existing ACA article and plain Income Planner URL; the existing taxable-account article link is grouped with them. The app callout remains unchanged. A sentence in detailed assumptions names omitted embedded-gain, sale/state-tax, harvesting, tax-lot and ACA effects. There is no after-tax adjustment, new tax engine, financial input, or new button.

## Numerical references

Existing hypothetical inputs: spending $75,000; dependable income $25,000; SS $30,000 starting in 10 years; taxable $250,000; retirement $850,000; bridge 7 years. Dollar figures below are rounded only for presentation.

| Withdrawal rate | Target at 0% real return | Savings minus target | Target at 3% real return | Savings minus target |
| --- | ---: | ---: | ---: | ---: |
| 3.0% | $1,166,667 | −$66,667 | $935,368 | +$164,632 |
| 3.5% | $1,071,429 | +$28,571 | $864,502 | +$235,498 |
| 4.0% | $1,000,000 | +$100,000 | $811,352 | +$288,648 |
| 3.25% custom | $1,115,385 | −$15,385 | $897,209 | +$202,791 |

Bridge target remains $350,000 at 0% and approximately $320,860 at 3% across these withdrawal rates. The existing $1,100,000 combined savings and $100,000 zero-return bridge shortfall remain unchanged. Nonzero references were independently evaluated using beginning-year discounted gaps and the discounted future ongoing target. No financial fixture or model formula is modified.

## Validation

- All 19 Node model tests pass, including the 16 existing tests and new 0%/3%/custom/zero-gap sensitivity references. Inputs are not mutated and bridge targets remain independent of withdrawal rates.
- Existing calculator interaction/privacy suite passes, including both real-return scenarios, example/reset, bars, zero/invalid/extreme cases and keyboard errors.
- New `scripts/calculator-sensitivity-browser.cjs` passes: initially hidden comparison, closed disclosure, keyboard toggling, no input overwrite, custom-rate row/no duplicates, selected-return updates, preserved baseline, zero-target message, invalid/reset states, per-row numeric limits, semantic headers/caption, links, and responsive screenshots at 390/768/1440px.
- Existing site-wide Chromium checks pass: 60 page/viewport combinations at 320/360/390/768/1440px; no page overflow, appropriate heading order, named controls/navigation and keyboard skip navigation.
- Build, source/build links/metadata/indexing checks pass: 13 HTML pages and 277 local references. Existing homepage/article financial-reference checks pass on source and build. `git diff --check` passes.
- Source comparisons confirm unchanged `model.mjs`, main bar renderer, example/reset/input handlers, calculator metadata/header/footer/analytics and original app callout. Homepage, articles, policy pages, navigation, sitemap, hosting settings and application repository remain unchanged.

Run the new browser suite like the existing one, with external Playwright/Chromium and a local build server:

```sh
NODE_PATH=/path/to/external/node_modules SITE_URL=http://127.0.0.1:8000 node scripts/calculator-sensitivity-browser.cjs
```

Set `CHROMIUM_PATH` for an existing browser executable. No visitor dependency is added.

## Screenshots

- [Collapsed desktop](screenshots/calculator-sensitivity/collapsed-desktop.png)
- [Expanded desktop](screenshots/calculator-sensitivity/expanded-desktop.png)
- [Collapsed mobile](screenshots/calculator-sensitivity/collapsed-mobile.png)
- [Expanded mobile](screenshots/calculator-sensitivity/expanded-mobile.png)
- [Mobile bridge guidance](screenshots/calculator-sensitivity/bridge-mobile.png)

Tablet screenshots are also captured in `/tmp`. The mobile expanded comparison and desktop bridge guidance were visually reviewed.

## Privacy and limits

Sensitivity uses the current in-memory values only and introduces no I/O, storage or analytics event. Browser assertions confirm no new requests during financial interactions/toggles, empty local/session storage, no cookies, unchanged URL and blank inputs after reload. App links carry no financial values and open in the same tab. Tests intercept the existing analytics module and external app destination: this verifies website behavior without certifying live third-party analytics or app availability.

This remains a constant-real-return directional estimate, with no market/sequence risk, retirement end date or success probability. Lower-rate comparisons are illustrative, not universally appropriate withdrawal recommendations. Bridge balances remain unadjusted for tax/subsidy consequences. Extreme numbers can exceed the existing model's finite limits. Automated accessibility checks are not a full assistive-technology audit. No deployment or automatic merge; verify routing/module serving and the public calculator after deployment.
