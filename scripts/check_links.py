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
        self.canonical=None; self.og_url=None; self.robots=''
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        for key in ('href','src'):
            if key in a: self.links.append(a[key])
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='meta' and a.get('property')=='og:url': self.og_url=a.get('content')
        if tag=='meta' and a.get('name')=='robots': self.robots=a.get('content','')
        if tag=='h1': self.h1+=1
        if tag=='title': self.title=True
        if tag=='meta' and a.get('name')=='description': self.description=True
pages={p:Document(p) for p in ROOT.rglob('*.html') if 'dist' not in p.relative_to(ROOT).parts}
errors=[]; count=0
for path,doc in pages.items():
    if doc.h1!=1 or not doc.title or not doc.description: errors.append(f'{path}: invalid page metadata/headings')
    relative=path.relative_to(ROOT).as_posix()
    expected='https://gapyearslab.com/'+('' if relative=='index.html' else relative.removesuffix('index.html'))
    if relative!='404.html' and (doc.canonical!=expected or doc.og_url!=expected):
        errors.append(f'{path}: incorrect canonical/Open Graph URL')
    if 'noindex' not in doc.robots.split(', '): errors.append(f'{path}: missing pre-launch noindex')
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
    if not loc.text.startswith('https://gapyearslab.com/'): errors.append(f'Noncanonical sitemap URL: {loc.text}')
    if urlsplit(loc.text).path not in ['/', '/planning-tools/', '/about/']: errors.append(f'Unfinished page in sitemap: {loc.text}')
    target=ROOT/urlsplit(loc.text).path.lstrip('/')/'index.html'
    if target not in pages: errors.append(f'Sitemap missing page: {loc.text}')
robots=(ROOT/'robots.txt').read_text()
if 'Sitemap: https://gapyearslab.com/sitemap.xml' not in robots: errors.append('Incorrect robots sitemap')
if 'Allow: /' not in robots or 'Disallow: /' in robots: errors.append('Crawling must allow discovery of noindex')
if 'X-Robots-Tag: noindex, follow' not in (ROOT/'_headers').read_text(): errors.append('Missing Cloudflare noindex header')
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML pages; {count} local links/assets/fragments; sitemap targets and metadata valid.')
