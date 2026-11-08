"""Compare article figures to frozen PR #47 expectations; no tax computation."""
from pathlib import Path
from html.parser import HTMLParser
from decimal import Decimal, ROUND_HALF_UP
import json
import sys
SOURCE = Path(__file__).resolve().parents[1]
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else SOURCE
ARTICLE = 'learn/zero-percent-capital-gains-aca-subsidy-cliff/index.html'
class Tables(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.rows=[]; self.row=None; self.cell=None; self.planning={}; self.plan=None
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='tr' and a.get('data-reference'): self.row=[a['data-reference'],[]]
        if tag=='td' and self.row: self.cell=''
        if a.get('data-planning'): self.plan=a['data-planning']; self.planning[self.plan]=''
    def handle_data(self, data):
        if self.cell is not None: self.cell+=data
        if self.plan: self.planning[self.plan]+=data
    def handle_endtag(self, tag):
        if tag=='td' and self.cell is not None: self.row[1].append(self.cell.strip()); self.cell=None
        if tag=='tr' and self.row: self.rows.append(self.row); self.row=None
        if tag=='strong': self.plan=None

data=json.loads((SOURCE/'docs/article-aca-rounding-reference-2026.json').read_text())
text=(ROOT/ARTICLE).read_text(); parsed=Tables(text)
assert [c['id'] for c in data['cases']]==['128600.00','128601.00']
assert len(parsed.rows)==8
for key,values in parsed.rows:
    group,measure=key.split('.')
    expected=[f"${Decimal(c[group][measure]):,.0f}" for c in data['cases']]
    actual=[v.removeprefix('Approximately ') for v in values]
    assert actual==expected,(key,actual,expected)
for key,value in parsed.planning.items():
    expected=Decimal(data['cases'][0]['planning'][key]).quantize(Decimal('.01'),rounding=ROUND_HALF_UP)
    assert value==f'${expected:,.2f}'
assert 'draft 2026' in text.lower()
assert 'one additional dollar' in text.lower()
assert '$88,600.01' not in text and '$128,600.01' not in text
assert 'not added twice' in text
print('PASS: 16 prominent article table values and 2 continuous estimates match revised PR #47 cases; draft/rounding qualifications retained.')
