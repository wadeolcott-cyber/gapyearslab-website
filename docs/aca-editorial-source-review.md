# ACA editorial/repayment: official source verification

**Official-source verification completed on retry.** The earlier network blocker is resolved; this note supersedes its pending-verification status.

The unchanged financial comparison remains grounded in the merged application report `docs/validation/2026-aca-cliff-rounding-review.md` (PR #47). Fresh official-source checks now independently support the proposed repayment explanation:

- IRS PTC FAQ Q30–31 returned HTTP 200. Q31 states: “There is no repayment cap for tax years after 2025” and “you must repay the full amount by which your advance credit payments exceed your Premium Tax Credit.” Q30 distinguishes allowed credit, advance payments, refund/balance adjustments and pre-2026 caps. This supports the qualified hypothetical $20,000 advance/$0 allowed credit illustration, not a penalty or a fixed universal liability.
- The current Form 8962 HTML instructions returned HTTP 200 and identify **2025**. Their repayment-limit tables must not be applied to 2026.
- The draft instruction PDF returned HTTP 200, identifies **2026**, is dated **October 20, 2026**, and remains explicitly **DRAFT—NOT FOR FILING**. Its “What’s New” section confirms removal of prior excess-APTC repayment limitations after 2025. The checked final-2026 PDF endpoint returned 404. No claim is made that all possible IRS endpoints were exhaustively searched or that final 2026 instructions were verified.
- The official HHS historical workbook returned HTTP 200. In “48 Contiguous States--Nonfarm,” B6 is 2025 and F6 is 32150, confirming the unchanged four-person guideline underlying the $128,600 threshold.
- All six IRS/HealthCare.gov URLs linked from the article returned HTTP 200, including the current instructions, draft instructions, premium tax credit FAQ, 2026 contribution bulletin, 2026 deduction/gain threshold PDF, and FPL glossary.

`aca-editorial-official-source-check.json` records retrieved artifact hashes, URLs, observed statuses and a UTC retrieval timestamp. Mutable endpoints may change later. The current source checks do not establish final-return accuracy or a Marketplace determination. No validated scenario values were changed, and no new calculation defect was identified.

Editorial scope: remove public development-history/PR language; preserve all financial values; move rounding, detailed assumptions, exclusions, and draft-method qualifications to native details/summary; keep official sources visible. Main article assumptions and hypothetical context remain visible. The repayment illustration uses hypothetical $20,000 advances and $0 allowable credit, not an asserted liability for everyone. It is reconciliation, not a penalty, and must not be added again to the economic loss of PTC. The main scenario has zero advances.

No new app feature name was asserted. Planning language encourages a reasonable margin for uncertain gains/dividends/interest/conversions/distributions and updated Marketplace income projections, without promising eligibility. No application repository or calculations were modified.

Validation completed: static build; source/build links and metadata/indexing checks; homepage and article reference checks; 50 page/viewport browser checks; keyboard technical-notes disclosure; screenshot review; unchanged analytics, canonical metadata, and other protected-file checks. Browser tests intercept the existing analytics module, not live collection.
