# Positioning and trust copy: evidence and review notes

Application repository (read only): `wadeolcott-cyber/aca-income-optimizer`.
Reviewed revision: `acae42863333e0d0e96c2e6aa58f1a652e3ce7e7`.
The repository is private. Public website copy uses accessible summaries, not inaccessible GitHub links. No application checkout, code, tests, engine, or deployment was changed. No screenshot was found in the website repository; the comparison is semantic HTML, not an imitation application screenshot.

## Evidence map

- `docs/2026-financial-validation.md`: independently derived planning cases, automated regression checks, and 59 supported regular federal comparisons matching Tax-Calculator 6.8.5. These comparisons do not validate ACA or full tax returns. The original audit predates standard capital-loss support.
- `docs/limitations.md`: only 2026 supported; standard allowable capital losses and carryforwards are supported with exclusions. State/local, payroll/self-employment, full-return and full-eligibility exclusions remain. Federal schedules and continuous ACA arithmetic differ from filing methods; final-2026 filing/rounding validation is not established. No certification is claimed.
- `docs/Illustrative_Example_Plan.md`: a different example with a different income mix and premium inputs; not substituted for C07/C08.
- `tests/fixtures/financial-validation/golden-2026.json`: C07/C08 inputs and expected outputs used for the homepage. The limited extract in `homepage-reference-2026.json` preserves the source numerical precision. Tests format values to cents; no engine or new tax calculation is introduced.
- `docs/validation-2026/manual-production-validation-2026-11-05.md`: merged report of eight human-tested scenario groups, all reported passed. This is tester-reported evidence, not a replay or independently observed field-level audit. The report explicitly distinguishes reference values from observed readings and leaves deployed build identity unspecified.

## Comparison review

The requested displayed MAGI, credit, and combined values match C07/C08 to cents. Federal tax and net insurance cost rows are also directly transcribed fixture outputs, not new outputs. C08 federal tax is 11072.0012 and combined cost is 23072.0012 before display rounding. No APTC settlement is inferred. The income consists of taxable retirement withdrawals only, not the separate Example Plan. The cases hold coverage/eligibility assumptions fixed.

## Founder approval and launch items

The About story uses only the user-approved themes, including more than 20 years in fintech, revenue operations, and analytics and leadership experience at Visa. No name, photo, degree, license, title, dates of employment, or professional tax/investment credentials are added. Founder should approve the final wording and representation of that experience before public release.

Keep noindex HTML metadata and Cloudflare headers intact. Existing public-domain, hosting, privacy/disclaimer/contact, and launch approval items remain. No 2027 support or release date is promised. Reference/methodology evidence describes documented exercises, not tests rerun by this website change or a guarantee of correctness.

## Validation and visuals

Run the existing build, link/metadata/indexing checks, browser checks, and `python3 scripts/check_reference_example.py` against source and `dist`. Browser screenshots and additional changed-page screenshots are review artifacts, not application screenshots. Test dependencies remain outside the repository.
