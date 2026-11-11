# Homepage positioning and content simplification

Only `index.html` changes visitor-facing content. No shared CSS, JavaScript, financial model, data fixture, article, hosting configuration or dependency changes.

## Hero copy

The main brand headline remains “Make the most of the years between.” Both existing hero actions and the Income Planner-specific Public Beta label remain.

| Element | Before | After |
| --- | --- | --- |
| Eyebrow | A NEW CHAPTER. A CLEARER PICTURE. | EARLY RETIREMENT · INCOME · TAXES · HEALTHCARE |
| Supporting headline | Plan for early retirement with greater confidence. | Early retirement is about more than having enough saved. |
| Introduction | GapYears Lab helps you explore whether your savings can support early retirement—and how to manage income, taxes, and healthcare costs along the way. | Estimate how you'll fund your gap years, then explore how investment withdrawals, Roth conversions, and income decisions affect your taxes and healthcare costs. |

The question panel asks how gap-year decisions connect, retaining the three funding/accessibility/income questions and the planning-steps link while removing its repeated journey sentence.

## Content hierarchy and CTAs

- Two equal tool cards remain immediately after the hero. Their concise descriptions emphasize taxable bridge coverage and the income/federal-tax/ACA relationship.
- The ACA example retains its scenario cards, values, household assumptions, methodology references, qualifiers and one prominent planner CTA plus secondary article link. Two surrounding paragraphs are shortened; the income-mix distinction and realized-gains-versus-proceeds explanation remain. The single assumptions disclosure is unchanged and closed by default.
- The screenshot lead now describes the hypothetical $10,000 Roth conversion. The genuine image, alt text, full-size links, caption, continuous-versus-filing qualification and model exclusions are unchanged. Its redundant app button is removed, retaining the product-overview text link.
- Audience heading and inclusive early-retirement/part-time-work introduction remain; the repeated platform description is removed and four overlapping bullets become two about investment income, taxes, healthcare and account decisions. The professional-advice/tax-scope note remains.
- Three short steps retain funding → taxable bridge → annual income/tax/healthcare exploration, followed by the unchanged independent-tools/no-shared-inputs statement and independent-verification note.
- The final repeated two-button CTA block is removed. Learn resources and all header/footer/contact navigation remain.

Main-content prominent buttons decrease from eight to five: calculator + planner in the hero, calculator + planner in the tool cards, and planner beside the ACA example. The header launch remains. Destinations are unchanged; no app inputs are transferred.

## SEO and privacy

HTML/Open Graph/Twitter title is “Early Retirement Income, Tax & Healthcare Planning | GapYears Lab”. All three descriptions are “Explore early retirement income planning, taxable bridge funding, Roth conversions, federal taxes, and ACA healthcare costs with GapYears Lab.” Production canonical and existing social images are unchanged.

Existing privacy text is preserved exactly: the calculator runs locally without saving/transmitting entered financial values; the Income Planner saves plans locally without automatic financial uploads. Public Beta applies only to the Income Planner. Privacy, Disclaimer and Methodology links remain. No sitemap, robots, indexing, structured metadata, security header or analytics changes.

## Screenshots

| Viewport | Before | After |
| --- | --- | --- |
| 390px mobile | [Before](screenshots/homepage-positioning/before-mobile.png) | [After](screenshots/homepage-positioning/after-mobile.png) |
| 1440px desktop | [Before](screenshots/homepage-positioning/before-desktop.png) | [After](screenshots/homepage-positioning/after-desktop.png) |

768px tablet was also captured/tested. Desktop/mobile heroes and tablet tool cards/product preview were visually reviewed. All images are real browser captures of the existing assets and hypothetical examples.

## Validation

- Static build; source/build local link, metadata, sitemap and indexing checks pass: 13 HTML pages, 276 local references.
- Existing homepage and article financial-reference checks pass on source and built output. Calculator interaction/privacy suite and all 16 model tests pass.
- Existing Chromium suite passes 60 page/viewport combinations (12 pages × 320/360/390/768/1440px), including named controls/navigation, heading hierarchy, launch URLs, keyboard skip navigation and no page overflow.
- Focused checks at 390/768/1440px verify both hero actions, immediate two-tool section, equal card sizes, correct calculator links, same-tab keyboard app launch, one closed assumptions disclosure with keyboard toggling, loaded/responsive screenshot, updated SEO, and reduced button count. The app destination is intercepted: this checks website navigation, not live app calculations/availability.
- Source comparisons confirm byte-for-byte preservation of financial `data-measure` values, scenario cards, complete assumptions disclosure, screenshot figure/caption, year/financial qualifications, hero privacy, footer and analytics. Financial modules and all other public pages remain unchanged.
- `git diff --check` passes. No full assistive-technology audit or live analytics verification is claimed.

No deployment or automatic merge. Verify public rendering, metadata and links after deployment. No new features or financial validation claims are introduced.
