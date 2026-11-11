#!/usr/bin/env python3
"""Offline arithmetic/presentation check for this fixed hypothetical article only.
Not a financial model: never imported by, or copied into, the public website.
"""
from decimal import Decimal as D
from html.parser import HTMLParser
from pathlib import Path
import sys

SOURCE = Path(__file__).resolve().parents[1]
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else SOURCE
text = (ROOT / 'learn/roth-conversion-aca-subsidy-cost/index.html').read_text()

# IRS RP 2025-32: MFJ standard deduction and continuous ordinary/CG rate bands.
# IRS RP 2025-25: flat 9.96% contribution for 300–400% FPL in 2026.
# HHS 2025 two-person contiguous-state poverty guideline: $21,150.
ordinary = [D(40000) + D(5000) + D(5000), D(60000)]
gain, deduction, lower_band, zero_gain_ceiling = D(15000), D(32200), D(24800), D(98900)
poverty, contribution = D(21150), D('.0996')
selected, benchmark = D(1600) * 12, D(1800) * 12
magi = [income + gain for income in ordinary]
assert magi == [D(65000), D(75000)]
assert all(poverty * 3 <= income < poverty * 4 for income in magi)
assert poverty * 4 == D(84600)
assert all(income - deduction < zero_gain_ceiling for income in magi)
taxable_ordinary = [income - deduction for income in ordinary]
tax = [min(value, lower_band) * D('.10') + max(D(0), value - lower_band) * D('.12') for value in taxable_ordinary]
credit = [min(selected, benchmark - income * contribution) for income in magi]
net = [selected - amount for amount in credit]
combined = [tax[i] + net[i] for i in range(2)]
assert tax == [D(1780), D(2840)]
assert benchmark == D(21600)
assert credit == [D(15126), D(14130)]
assert net == [D(4074), D(5070)]
assert combined == [D(5854), D(7910)]
assert tax[1] - tax[0] == D(1060)
assert credit[0] - credit[1] == D(996)
assert combined[1] - combined[0] == D(2056)
assert (combined[1] - combined[0]) / D(10000) == D('.2056')

class Table(HTMLParser):
    def __init__(self):
        super().__init__(); self.key = None; self.cell = None; self.values = {}
    def handle_starttag(self, tag, attrs):
        if tag == 'tr':
            self.key = dict(attrs).get('data-roth-measure')
        if tag == 'td' and self.key:
            self.cell = ''
    def handle_data(self, data):
        if self.cell is not None:
            self.cell += data
    def handle_endtag(self, tag):
        if tag == 'td' and self.cell is not None:
            self.values.setdefault(self.key, []).append(self.cell.strip()); self.cell = None
        if tag == 'tr':
            self.key = None

p = Table(); p.feed(text)
for name, amounts in {'magi': magi, 'federalTax': tax, 'netPremium': net, 'combinedCosts': combined}.items():
    assert p.values[name] == [f'${value:,.0f}' for value in amounts], name
for phrase in ['$15,126 to $14,130', '$1,060', '$996', '$2,056', '20.6 cents per dollar converted',
               '$84,600', '9.96%', '$0 in advance premium tax credits', 'full $1,600 monthly insurance premium',
               'not intended to reproduce the separate Roth conversion illustration', 'not a completed tax return']:
    assert phrase in text, phrase
assert 'data-roth-measure="combinedCosts"' in text
print('PASS: 8 article table values and fixed 2026 arithmetic match; tax/PTC/net/combined costs, below-cliff scope and payment timing verified.')
