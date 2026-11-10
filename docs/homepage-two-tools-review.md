# Homepage positioning for two planning tools

The hero, existing two-tool cards, audience explanation, three-step journey, final CTA, and homepage SEO now describe both tools. The primary starting point is estimating retirement funding and taxable bridge coverage; the Income Planner remains a prominent secondary route to annual income/federal-tax/ACA tradeoffs.

The approved headline, brand, layout and tool-section position are preserved. The hero question panel now covers both tools instead of presenting only Income Planner questions. Its “See How It Works” link points to the existing three-step section (`#planning-steps`); the screenshot section's `#how-it-works` anchor remains intact. The existing browser check follows the revised explanatory link destination.

Public Beta appears beside Income Planner actions and in its tool-card eyebrow. Calculator inputs are described as local, unsaved, and not transmitted. Income Planner messaging preserves its no-account/privacy link and accurately describes browser-local saved plans without automatic financial uploads. The journey explicitly states that tools work independently and do not share financial inputs. No storage behavior is changed.

The short homepage CSS addition only wraps paired actions, positions the planner-specific label, and preserves readable secondary-button hover colors. Both tool cards retain identical button treatments and equal desktop/tablet dimensions. No new JavaScript or dependency is introduced.

## Before and after screenshots

Screenshots use the same local Chromium viewports and unchanged hypothetical examples:

| Viewport | Before | After |
| --- | --- | --- |
| 390px mobile | [Before](screenshots/homepage-two-tools/before-mobile.png) | [After](screenshots/homepage-two-tools/after-mobile.png) |
| 1440px desktop | [Before](screenshots/homepage-two-tools/before-desktop.png) | [After](screenshots/homepage-two-tools/after-desktop.png) |

768px tablet was also captured and tested. Hero screenshots, tablet tool cards and mobile final CTA were visually reviewed. Financial examples and app screenshot remain associated specifically with the Income Planner.

## Verification

- Build and source/build validation pass: 13 HTML pages, 277 local references; metadata/canonical/sitemap/indexability checks pass.
- All 60 existing Chromium page/viewport combinations pass (12 pages at 320/360/390/768/1440px). Heading hierarchy, named navigation/controls, keyboard skip navigation, launch links, and page overflow checks pass.
- Focused checks click every calculator and Income Planner CTA in the hero, cards, and final section at 390/768/1440px. Calculator links resolve locally; app links use plain `https://app.gapyearslab.com/`, same-tab keyboard activation, without transferred inputs. App destination is intercepted: this verifies website navigation, not app availability or calculations.
- Equal card dimensions at tablet/desktop, equal mobile widths, CTA/label overflow, and secondary-button hover contrast pass.
- Existing homepage/article financial-reference checks pass on source and built output. Calculator interaction/privacy checks and all 16 model tests pass.
- Source comparisons confirm byte-for-byte preservation of the complete ACA example and screenshot sections, analytics snippet, canonical and social image tags. All calculator/app engines, articles, Privacy, sitemap, robots, security headers, build/deployment configuration and stored-data behavior are unchanged.
- `git diff --check` passes. No full assistive-technology audit or live analytics verification is claimed.

Changed files: homepage HTML, three focused CSS rules, the existing browser test's explanatory-link assertion, and these review materials/screenshots. This PR does not deploy or merge automatically. Verify the public page after deployment.
