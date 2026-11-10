# Educational disclaimer consistency review

This is a content review, not legal advice or a legal compliance certification. The public website changes are limited to two HTML pages; other existing disclosures are retained without repetitive warnings.

## Existing coverage and targeted changes

All 13 website HTML pages, including the 404 page, retain the exact footer statement “Built for exploration. For educational purposes only.” and a named `/disclaimer/` link.

| Location | Existing coverage | Action |
| --- | --- | --- |
| `/disclaimer/` | General education; no individualized financial, tax, legal, investment or healthcare advice; illustrative examples, uncertain outcomes and professional guidance | Replace the generic guidance clause with the requested specific recommendation; preserve the rest, including the provisional notice |
| Homepage | Independent verification in hero/journey, hypothetical example and eligibility qualifications, no professional-advice replacement, tax/model limitations, footer Disclaimer link | No change |
| `/retirement-calculator/` | Directional estimates; no guaranteed safe rate or retirement success; changing returns/spending/taxes; separate accessibility check; detailed expandable model exclusions; disclaimer link inside the explanation | Add one educational/advice/professional-verification statement beside results; move the existing contextual link out of collapsed details into that statement |
| `/planning-tools/` | Annual-estimate scope, unsupported tax/eligibility/retirement features, footer educational statement and Disclaimer link | No change; existing coverage is adequate for a tool directory |
| `/planner/` | Estimates and independent verification before decisions, hypothetical preview, model limits, footer education/Disclaimer access | No change |
| ACA capital-gains article | Educational considerations rather than individualized tax/investment recommendations, hypothetical values and limitations, draft-versus-final filing qualifications, official references and explicit educational Disclaimer link | No change |
| Taxable-brokerage article | General education, not personalized financial/tax advice; hypothetical bridge, tax/access exceptions and volatility exclusions; no guaranteed retirement success; footer Disclaimer link | No change |
| `/about/` | Educational planning estimates, no personalized financial/tax/investment advice, methodology/limitations link and footer Disclaimer access | No change |

## Exact website wording

On `/disclaimer/`, retain “Examples are illustrative and do not predict future outcomes. Decisions depend on your circumstances and current rules.” Replace the vague appended clause about seeking guidance with a separate paragraph:

> Before making significant financial, tax, investment, or insurance decisions, consider consulting an appropriately qualified professional, such as a financial advisor, CPA, tax professional, or licensed insurance agent.

Beside calculator results, after the existing non-guarantee paragraph, add:

> For educational planning purposes only. Estimates are not personalized financial or tax advice. Verify important decisions with appropriately qualified professionals. [Read the educational disclaimer](/disclaimer/).

The existing detailed assumptions, exclusions, and non-guarantee wording remain. Only its repeated contextual disclaimer link is relocated to the visible note. The sitewide footer link remains, providing normal navigation rather than another warning paragraph.

## Separate Income Planner: read-only review

Reviewed private repository `wadeolcott-cyber/aca-income-optimizer` at main commit `b3ff2a15c1a35c189d042024c8aa8b8109fd2b96` through the GitHub contents API. No application repository was checked out or modified, and no second PR was created. This source review does not establish the currently deployed version or constitute a full application audit.

Direct-entry disclosure coverage is generally consistent:

- `web/BetaWelcome.tsx:40–41`: visible introduction says results are estimates and should be independently verified. Its “Important Limitations” details at lines 104–122 state no personalized financial/tax/insurance advice, incomplete tax-return coverage, exclusions, and independent eligibility/deduction review.
- `web/App.tsx:221–226`: visible workspace “Estimates only” note asks users to review assumptions and says the app does not replace professional advice. It remains available when users skip the introduction.
- `web/App.tsx:548–594`: expandable “Assumptions & Limitations” explains that income alone does not establish eligibility, requires independent review of coverage conditions, and states this is not a tax return or completed Form 8962 reconciliation.
- `web/AppShell.tsx:58,73`: educational-prototype label and persistent “Plan thoughtfully. Verify independently.” footer. Footer currently links back to the website rather than directly to its Disclaimer.

Recommended follow-up in the app, not implemented here:

1. In the existing `web/App.tsx:221–226` workspace note, consider: “Educational estimates only—not personalized financial, tax, investment, or insurance advice. Independently verify important decisions and consider consulting an appropriately qualified professional.” This makes the educational purpose, advice scope and optional professional guidance explicit even after skipping the introduction. Replace existing wording rather than stacking warnings.
2. In `web/BetaWelcome.tsx:107–109`, consider adding “investment” to the existing advice list. In its existing independent-verification paragraph at lines 119–122, consider appending: “Before making significant financial, tax, investment, or insurance decisions, consider consulting an appropriately qualified professional.” This aligns vocabulary without adding a new acknowledgment or banner.
3. In `web/AppShell.tsx:73–74`, consider a discreet “Disclaimer” link to `https://gapyearslab.com/disclaimer/` alongside the existing footer. This gives direct visitors access to the broader advice statement. Keep detailed tax/Marketplace qualifications where they already appear.

These are modest clarity recommendations, not findings that the app guarantees outcomes, provides individualized advice, or needs mandatory professional consultation. No changes to app notices, controls, calculations, storage, privacy, or beta access are made in this PR.

## Validation and unchanged scope

- Static build and source/build link/metadata/sitemap checks pass: 13 HTML pages and 277 local references.
- Existing homepage and article numerical-reference checks pass on source and build. All 16 calculator model tests and the existing calculator interaction/privacy suite pass.
- Existing 60 Chromium page/viewport checks pass at 320/360/390/768/1440px.
- Focused checks at 390/768/1440px confirm the educational note is visible outside collapsed details, the single contextual Disclaimer link receives visible keyboard focus and opens the correct page, and the exact professional-guidance sentence appears once. Responsive screenshots were captured; no page overflow.
- Automated comparison confirms all 13 footers have the retained wording/link. Modified-page head metadata, footer and analytics match main byte-for-byte. `git diff --check` passes.

No financial module, input handling, saved data, financial example, article, homepage, Privacy policy, Cloudflare configuration, analytics, authentication, beta behavior, indexing header, sitemap, robots or structured metadata changes. No new CSS, JavaScript, dependency, popup or mandatory acknowledgment. The dedicated notice remains explicitly provisional and needs owner review; this task does not certify legal protection or compliance. Verify the published copy after deployment; this PR does not deploy or merge automatically.
