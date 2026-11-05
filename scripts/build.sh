#!/usr/bin/env bash
# Run from any directory. Only public website files are copied into dist.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
cp index.html 404.html robots.txt sitemap.xml _headers dist/
cp -R assets about contact disclaimer learn methodology planner planning-tools privacy dist/
