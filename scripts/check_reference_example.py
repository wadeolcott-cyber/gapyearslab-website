"""Check presentation against a transcription of the merged independent fixture.

Only format expected values; do not run or recreate financial calculations.
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
        self.values = {}
        self.measure = None
        self.tag = None
        self.value = ''
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        measure = dict(attrs).get('data-measure')
        if measure:
            self.measure, self.tag, self.value = measure, tag, ''
    def handle_data(self, data):
        if self.measure:
            self.value += data
    def handle_endtag(self, tag):
        if tag == self.tag:
            self.values.setdefault(self.measure, []).append(self.value.strip())
            self.measure = self.tag = None

def dollars(value):
    return f"${Decimal(value).quantize(Decimal('.01'), rounding=ROUND_HALF_UP):,.2f}"

data = json.loads((SOURCE/'docs/capital-gains-homepage-reference-2026.json').read_text(), parse_float=Decimal)
text = (ROOT/'index.html').read_text()
comparison = Comparison(text)
assert [c['id'] for c in data['cases']] == ['CG-CLIFF-A', 'CG-CLIFF-B']
for measure in ['nonQualifiedDividends', 'qualifiedDividends', 'longTermGains',
                'magi', 'federalTax', 'ptc', 'netPremium', 'combinedCost']:
    source = 'income' if measure in ['nonQualifiedDividends', 'qualifiedDividends', 'longTermGains'] else 'expected'
    expected = [dollars(c['input']['income'][measure] if source == 'income' else c['expected'][measure])
                for c in data['cases']]
    assert comparison.values[measure] == expected, (measure, comparison.values[measure], expected)
assert comparison.values['combinedCostIncrease'] == [dollars(data['combinedCostIncrease'])]
assert '$1,591' not in text
assert 'income consists entirely of taxable retirement withdrawals' not in text.lower()
print('PASS: 16 scenario amounts and the cost difference match the merged capital-gains reference to cents.')
