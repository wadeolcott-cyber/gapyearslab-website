"""Check presentation against a transcription of the merged independent fixture.

Only format expected values; do not run or recreate financial calculations.
"""
import json
from decimal import Decimal
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
    return f"${Decimal(value):,.0f}"

data = json.loads((SOURCE/'docs/article-aca-rounding-reference-2026.json').read_text())
text = (ROOT/'index.html').read_text()
comparison = Comparison(text)
assert [c['id'] for c in data['cases']] == ['128600.00', '128601.00']
for measure in ['nonQualifiedDividends', 'qualifiedDividends', 'longTermGains',
                'magi', 'federalTax', 'ptc', 'netPremium']:
    source = 'income' if measure in ['nonQualifiedDividends', 'qualifiedDividends', 'longTermGains'] else 'filing'
    expected = [dollars(c[source][measure]) for c in data['cases']]
    actual = [v.removeprefix('Approximately ') for v in comparison.values[measure]]
    assert actual == expected, (measure, actual, expected)
assert comparison.values['combinedCostIncrease'] == ['≈ '+dollars(data['cases'][0]['filing']['ptc'])]
example = text.split('<section class="planner-window reference-demo"', 1)[1].split('<section class="section container">', 1)[0]
assert 'one cent' not in example.lower() and 'one-cent' not in example.lower()
assert '$128,600.01' not in example and '$88,600.01' not in example
assert 'reviewed draft 2026 annual Form 8962 method' in example
assert 'continuous calculations' in example
print('PASS: 14 scenario amounts and whole-dollar highlight match revised PR #47 filing comparator; planning/draft distinction retained.')
