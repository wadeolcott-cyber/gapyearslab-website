"""Check displayed reference values against the transcribed frozen application cases.

No financial calculations: only formatting source expectations for presentation.
"""
import json
from decimal import Decimal, ROUND_HALF_UP
from html.parser import HTMLParser
from pathlib import Path
import sys

SOURCE = Path(__file__).resolve().parents[1]
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else SOURCE

class Comparison(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.rows = {}
        self.measure = None
        self.cell = None
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        if tag == 'tr':
            self.measure = dict(attrs).get('data-measure')
            if self.measure:
                self.rows[self.measure] = []
        if tag == 'td' and self.measure:
            self.cell = ''
    def handle_data(self, data):
        if self.cell is not None:
            self.cell += data
    def handle_endtag(self, tag):
        if tag == 'td' and self.cell is not None:
            self.rows[self.measure].append(self.cell.strip())
            self.cell = None
        if tag == 'tr':
            self.measure = None

data = json.loads((SOURCE/'docs/homepage-reference-2026.json').read_text(), parse_float=Decimal)
comparison = Comparison((ROOT/'index.html').read_text())
assert len(data['cases']) == 2
for measure in ['magi', 'federalTax', 'ptc', 'netPremium', 'combinedCost']:
    expected = [f"${Decimal(c['expected'][measure]).quantize(Decimal('.01'), rounding=ROUND_HALF_UP):,.2f}"
                for c in data['cases']]
    assert comparison.rows[measure] == expected, (measure, comparison.rows[measure], expected)
assert 'FOUNDER STORY · PLACEHOLDER' not in (ROOT/'about/index.html').read_text()
print('PASS: all 10 comparison amounts match C07/C08 reference values to cents; no founder placeholder.')
