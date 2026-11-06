# Capital-gains homepage example evidence

Verified merged application main revision: `fa728da988c0f6d7952f39b9ab50258aa8a3c1ed` in `wadeolcott-cyber/aca-income-optimizer` (read only).

Sources:
- `docs/validation-2026/capital-gains-aca-cliff-example.md`
- `tests/fixtures/financial-validation/capital-gains-aca-cliff-2026.json`

The document is merged and agrees with every requested input and output. The repository remains private; visitor-facing Methodology provides an accessible summary rather than a private GitHub link. The report documents independent Decimal derivation, regression comparisons, 564 passing unit/integration tests, four passing browser tests, TypeScript and production build checks. Those are recorded application validation outcomes, not tests rerun during the website task. Browser validation was against a local production preview, not a new deployed human audit.

`capital-gains-homepage-reference-2026.json` is a limited presentation transcription of the two new source cases and the stored cost difference. No reference outputs were derived from the application engine or recalculated here. The existing `homepage-reference-2026.json` is retained unchanged as historical evidence for the superseded withdrawal illustration. No existing validated fixture in either repository was changed.

The website now presents CG-CLIFF-A/B, not C07/C08: nonqualified dividends $27,000, qualified dividends $13,000, realized long-term gains $88,600/$88,600.01, premiums $2,500/$3,000 monthly. There are no wages, retirement withdrawals, Roth conversions, losses, carryforwards, or other income/adjustments. Full-year qualifying coverage, base standard deduction, eligible preferential treatment, all required credit eligibility conditions and explicitly zero monthly advances are assumed. Realized gains are not gross proceeds. Hypothetical premiums are not quotes.

All displayed amounts are formatted from stored expectations. A one-cent continuous-model boundary is not a guaranteed filed-return difference; rounding, final instructions, eligibility and Form 1095-A records matter. Federal scope excludes state/local, payroll/self-employment, NIIT, AMT, other credits and unsupported treatments. The example is not advice against realizing gains.

`python3 scripts/check_reference_example.py [dist]` verifies sixteen input/output amounts plus the stored $23,191.44 cost difference. The build/link/indexing checks and browser suite remain required. Screenshots for this update are in `docs/screenshots/capital-gains-*`; historical screenshots remain earlier review artifacts.

Only the website is modified. No application checkout, engine/fixture changes, Cloudflare settings, noindex changes, or deployments are part of this task.
