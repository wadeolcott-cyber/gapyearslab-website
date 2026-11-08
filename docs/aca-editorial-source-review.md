# ACA editorial/repayment draft: publication verification required

**Do not publish this draft until current official sources are checked.**

The existing merged application report `docs/validation/2026-aca-cliff-rounding-review.md` (PR #47) was re-read for this task. It supports the unchanged $1 scenario and documented, at its review, IRS PTC FAQ Q30–31 as stating that the excess-APTC repayment cap does not apply after 2025. It recorded draft 2026 Form 8962 instructions and did not establish final 2026 filing accuracy.

Fresh requests in this task to the IRS PTC FAQ and current Form 8962 instructions were denied by the environment proxy (CONNECT 403). No current live IRS/HHS content or newer final 2026 instructions were independently verified. The proposed repayment copy is therefore held in a draft PR, not certified ready to publish. No validated amounts were changed and no application calculation defect is implied.

Pending official verification:
- https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit — confirm current 2026 full excess-APTC repayment rule and eligibility qualifications.
- https://www.irs.gov/instructions/i8962 — identify the served tax year, draft/final status, reconciliation guidance, and whether newer final 2026 instructions affect the current explanation.
- Verify linked IRS/HHS source revisions as appropriate. Do not use 2025 repayment-limit tables for 2026 or silently substitute new financial outputs.

The environment draft preserves existing network entries and adds www.irs.gov, aspe.hhs.gov, and www.healthcare.gov for owner review/save/publication. That save does not apply access or publish website code. After access changes, retry official requests and record source status before marking the PR ready.

Editorial scope: remove public development-history/PR language; preserve all financial values; move rounding, detailed assumptions, exclusions, and draft-method qualifications to native details/summary; keep official sources visible. Main article assumptions and hypothetical context remain visible. The repayment illustration uses hypothetical $20,000 advances and $0 allowable credit, not an asserted liability for everyone. It is reconciliation, not a penalty, and must not be added again to the economic loss of PTC. The main scenario has zero advances.

No new app feature name was asserted. Planning language encourages a reasonable margin for uncertain gains/dividends/interest/conversions/distributions and updated Marketplace income projections, without promising eligibility. No application repository or calculations were modified.

Validation completed: static build; source/build links and metadata/indexing checks; homepage and article reference checks; 50 page/viewport browser checks; keyboard technical-notes disclosure; screenshot review; unchanged analytics, canonical metadata, and other protected-file checks. Browser tests intercept the existing analytics module, not live collection.
