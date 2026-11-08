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
        self.canonical=None; self.og_url=None; self.robots=''; self.title_text=''; self.in_title=False; self.description_text=''
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        for key in ('href','src'):
            if key in a: self.links.append(a[key])
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='meta' and a.get('property')=='og:url': self.og_url=a.get('content')
        if tag=='meta' and a.get('name','').lower() in ['robots','googlebot','bingbot']: self.robots+=' '+a.get('content','')
        if tag=='h1': self.h1+=1
        if tag=='title': self.title=True; self.in_title=True
        if tag=='meta' and a.get('name')=='description': self.description=True; self.description_text=a.get('content','')
    def handle_data(self, data):
        if self.in_title: self.title_text+=data
    def handle_endtag(self, tag):
        if tag=='title': self.in_title=False
pages={p:Document(p) for p in ROOT.rglob('*.html') if 'dist' not in p.relative_to(ROOT).parts}
errors=[]; count=0; public_canonicals=set(); titles=set(); descriptions=set()
for path,doc in pages.items():
    if doc.h1!=1 or not doc.title or not doc.description: errors.append(f'{path}: invalid page metadata/headings')
    relative=path.relative_to(ROOT).as_posix()
    expected='https://gapyearslab.com/'+('' if relative=='index.html' else relative.removesuffix('index.html'))
    if relative!='404.html' and (doc.canonical!=expected or doc.og_url!=expected):
        errors.append(f'{path}: incorrect canonical/Open Graph URL')
    directives=set(doc.robots.lower().replace(',', ' ').split())
    if relative=='404.html':
        if 'noindex' not in directives: errors.append('404 must remain noindex')
    else:
        if directives & {'noindex', 'none', 'nofollow'}: errors.append(f'{path}: unintended indexing restriction')
        public_canonicals.add(expected)
        if not doc.title_text.strip() or doc.title_text in titles: errors.append(f'{path}: missing/duplicate title')
        if not doc.description_text.strip() or doc.description_text in descriptions: errors.append(f'{path}: missing/duplicate description')
        titles.add(doc.title_text); descriptions.add(doc.description_text)
    for link in doc.links:
        u=urlsplit(link)
        if u.scheme or u.netloc: continue
        target=(ROOT/u.path.lstrip('/')) if u.path.startswith('/') else (path.parent/u.path if u.path else path)
        if target.is_dir(): target=target/'index.html'
        count+=1
        if not target.is_file(): errors.append(f'{path}: missing {link}')
        elif u.fragment and target in pages and u.fragment not in pages[target].ids: errors.append(f'{path}: missing fragment {link}')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap=ET.parse(ROOT/'sitemap.xml')
if sitemap.getroot().tag!='{http://www.sitemaps.org/schemas/sitemap/0.9}urlset': errors.append('Invalid sitemap namespace/root')
locations=[loc.text for loc in sitemap.findall('.//s:loc',ns)]
if len(locations)!=len(set(locations)): errors.append('Duplicate sitemap URLs')
if set(locations)!=public_canonicals: errors.append('Sitemap must list every indexable canonical page exactly once')
for url in locations:
    u=urlsplit(url)
    if u.scheme!='https' or u.netloc!='gapyearslab.com' or u.query or u.fragment:
        errors.append(f'Noncanonical sitemap URL: {url}')
    target=ROOT/u.path.lstrip('/')/'index.html'
    if target not in pages: errors.append(f'Sitemap missing page: {url}')
    if url not in public_canonicals: errors.append(f'Nonindexable sitemap target: {url}')
robots=(ROOT/'robots.txt').read_text()
if 'Sitemap: https://gapyearslab.com/sitemap.xml' not in robots: errors.append('Incorrect robots sitemap')
if any(line.lower().startswith('disallow:') and line.split(':',1)[1].strip() for line in robots.splitlines()):
    errors.append('Unexpected robots crawl block')
headers=(ROOT/'_headers').read_text()
active_rule=None
for line in headers.splitlines():
    if not line.strip() or line.lstrip().startswith('#'): continue
    if not line[0].isspace(): active_rule=line.strip()
    elif 'x-robots-tag:' in line.lower() and any(x in line.lower() for x in ['noindex','none','nofollow']):
        if active_rule not in ['https://gapyearslab-website.pages.dev/*','https://:preview.gapyearslab-website.pages.dev/*']:
            errors.append(f'Unintended response indexing restriction: {active_rule}')
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML pages; {count} local links/assets/fragments; sitemap targets and metadata valid.')
