# First educational article: source and review notes

Article: `/learn/zero-percent-capital-gains-aca-subsidy-cliff/`.

Primary financial reference is the merged application PR #47 report, `docs/validation/2026-aca-cliff-rounding-review.md`, and its separate `tests/fixtures/financial-validation/aca-cliff-rounding-2026.json`, read at application revision `7d83650c78592087ce3f7c17f8f869706d1f7e03`. Both were checked against that exact revision. The source repository remains private; public copy summarizes its findings and uses official source URLs rather than inaccessible GitHub links.

The article uses revised cases `128600.00` and `128601.00`, not the earlier cent-level publication reference. `article-aca-rounding-reference-2026.json` is a limited transcription of the new pair, not new financial calculations. `scripts/check_article_reference.py` compares 16 table amounts and the two continuous estimates against those frozen expectations. Qualified/nonqualified dividends remain disjoint; the text explicitly explains Form 1040 line 3b's inclusion of qualified dividends and avoids double counting. Primary PTC/net-premium amounts are approximately $23,191/$6,809; continuous $23,191.44/$6,808.56 are explained separately. Draft 2026 annual-line, continuous, and final-return results are never conflated.

The report records fresh IRS/HHS retrieval and reviewed source status. Its final 2026 Form 8962 probes did not locate final instructions; its annual comparator uses an October 20, 2026 draft, not for filing. Final 2025 worksheet/reporting instructions support structure only, not 2026 enhanced percentages. The article retains those qualifications. No final-year accuracy certification or Marketplace eligibility guarantee is asserted.

Fresh requests to the five requested IRS/HealthCare.gov URLs were denied by this environment's outbound proxy (CONNECT 403), so current public response codes/content could not be verified here. The official URLs are retained as requested, with mutable-source/year qualifications. Recheck these official links and final-year guidance before publishing or relying on filing results. The HealthCare.gov glossary is educational context; the financial values are supported by the merged report's IRS/HHS source review and fixtures.

No author identity, publication date, or review credentials were invented. No Article JSON-LD was added because the existing site has no structured-data system; Open Graph article metadata and Twitter metadata follow existing conventions. No dependencies, CMS, charting library, analytics provider, application code, fixture, storage, or Cloudflare setting changes.

Reviewed screenshots: `screenshots/article-header-desktop.png` and `screenshots/article-comparison-mobile.png`. They are website review artifacts, not application screenshots. Automated browser coverage includes the new article, responsive overflow/headings/named controls/skip links, same-tab launch targets, and keyboard-focusable article tables. Local tests intercept the existing external analytics module; they do not verify collection. Existing homepage product examples remain unchanged, and Learn's three planned topics remain intact.

This task prepares a review PR, not a deployment or tax-guidance certification. Publication date can be added when actually known. Existing owner-side launch and provider follow-ups remain separate.
