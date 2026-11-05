"""Validate local links, fragments, metadata, and sitemap using only Python."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
import sys
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.links=[]; self.ids=set(); self.h1=0; self.title=False; self.description=False
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        for key in ('href','src'):
            if key in a: self.links.append(a[key])
        if tag=='h1': self.h1+=1
        if tag=='title': self.title=True
        if tag=='meta' and a.get('name')=='description': self.description=True
pages={p:Document(p) for p in ROOT.rglob('*.html') if 'dist' not in p.relative_to(ROOT).parts}
errors=[]; count=0
for path,doc in pages.items():
    if doc.h1!=1 or not doc.title or not doc.description: errors.append(f'{path}: invalid page metadata/headings')
    for link in doc.links:
        u=urlsplit(link)
        if u.scheme or u.netloc: continue
        target=(ROOT/u.path.lstrip('/')) if u.path.startswith('/') else (path.parent/u.path if u.path else path)
        if target.is_dir(): target=target/'index.html'
        count+=1
        if not target.is_file(): errors.append(f'{path}: missing {link}')
        elif u.fragment and target in pages and u.fragment not in pages[target].ids: errors.append(f'{path}: missing fragment {link}')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
for loc in ET.parse(ROOT/'sitemap.xml').findall('.//s:loc',ns):
    target=ROOT/urlsplit(loc.text).path.lstrip('/')/'index.html'
    if target not in pages: errors.append(f'Sitemap missing page: {loc.text}')
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML pages; {count} local links/assets/fragments; sitemap targets and metadata valid.')
