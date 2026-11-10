import { EXAMPLE, LABELS, validate, calculate } from './model.mjs';
const fields = Object.fromEntries(Object.keys(LABELS).map(k => [k, document.getElementById(k)]));
const errors = document.getElementById('calculator-errors');
const results = document.getElementById('calculator-results');
const status = document.getElementById('calculator-status');
const exampleNotice = document.getElementById('example-notice');
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const percent = value => Number.isFinite(value) ? `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)}%` : 'Percentage exceeds display range';
function node(tag, text, cls) {
  const el = document.createElement(tag); if (text !== undefined) el.textContent = text;
  if (cls) el.className = cls; return el;
}
function metric(dl, label, value) { const row = node('div'); row.append(node('dt', label), node('dd', value)); dl.append(row); }
function renderSection(title, scenarios, prefix) {
  const section = node('section', undefined, 'funding-section');
  const heading = node('h3', title); heading.id = `${prefix}-title`; section.setAttribute('aria-labelledby', heading.id); section.append(heading);
  const coverageKey = prefix === 'overall' ? 'overallCoverage' : 'bridgeCoverage';
  const finiteCoverages = scenarios.filter(s => s.result).map(s => s.result[coverageKey]).filter(Number.isFinite);
  // All rows share the same percentage scale and aligned 100% reference within a section.
  const scale = Math.min(200, Math.max(150, ...finiteCoverages));
  for (const { label, result: r, error } of scenarios) {
    const article = node('article', undefined, 'funding-scenario'); article.append(node('h4', label));
    if (error) { article.append(node('p', error, 'calculation-limitation')); section.append(article); continue; }
    const overall = prefix === 'overall', target = overall ? r.overallTarget : r.bridgeTarget;
    const savings = overall ? r.combinedSavings : r.taxableSavings;
    const difference = overall ? r.overallDifference : r.bridgeDifference;
    const coverage = r[coverageKey];
    const dl = node('dl', undefined, 'funding-metrics');
    metric(dl, overall ? 'Combined portfolio savings' : 'Taxable savings available', money(savings));
    if (!overall) metric(dl, 'Years before retirement-account withdrawals', String(r.bridgeYears));
    metric(dl, overall ? 'Estimated target today' : 'Estimated bridge target', money(target));
    metric(dl, difference >= 0 ? 'Above estimated target' : 'Below estimated target', money(Math.abs(difference)));
    if (target === 0) {
      article.append(node('p', overall ? 'No portfolio funding needed for this estimate' : 'No taxable bridge funding needed', 'zero-target'));
    } else {
      metric(dl, 'Estimated target funded', percent(coverage));
      const chart = node('div', undefined, 'coverage-chart'); chart.setAttribute('aria-hidden', 'true');
      chart.style.setProperty('--marker', `${100 / scale * 100}%`);
      const track = node('div', undefined, 'coverage-track');
      const bar = node('div', undefined, 'coverage-bar');
      bar.style.width = `${Math.min(Number.isFinite(coverage) ? coverage : scale, scale) / scale * 100}%`;
      track.append(bar, node('span', undefined, 'coverage-marker')); chart.append(track);
      const axis = node('div', undefined, 'coverage-axis'); axis.append(node('span', '0%'), node('span', '100% target', 'target-label'), node('span', `${scale}%`)); chart.append(axis);
      article.append(chart);
      if (!Number.isFinite(coverage) || coverage > scale) article.append(node('p', 'Bar reaches the visual scale limit. The full dollar amounts and coverage are shown below.', 'scope-note'));
      article.append(node('p', difference >= 0 ? 'Above estimated target under these assumptions.' : 'Below estimated target under these assumptions.'));
    }
    article.append(dl); section.append(article);
  }
  return section;
}
function update() {
  const raw = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value]));
  const ss = raw.socialSecurity.trim();
  fields.socialYears.disabled = ss !== '' && Number(ss) === 0;
  const checked = validate(raw);
  for (const [key, input] of Object.entries(fields)) {
    const invalid = checked.errors.some(e => e.key === key);
    input.setAttribute('aria-invalid', String(invalid));
  }
  errors.replaceChildren(); errors.hidden = checked.errors.length === 0;
  if (checked.errors.length) {
    errors.append(node('p', 'Complete or correct these fields to see estimates:'));
    const list = node('ul');
    for (const error of checked.errors) {
      const li = node('li'); const a = node('a', error.message); a.href = `#${error.key}`;
      a.addEventListener('click', e => { e.preventDefault(); fields[error.key].focus(); }); li.append(a); list.append(li);
    }
    errors.append(list); results.hidden = true; results.replaceChildren(); status.textContent = 'Estimates are unavailable until the listed fields are complete.'; return;
  }
  const returns = checked.values.realReturn === 0 ? [0] : [0, checked.values.realReturn / 100];
  const scenarios = returns.map(r => {
    const label = r === 0 ? '0% real-return baseline' : `${checked.values.realReturn}% real-return scenario`;
    try { return { label, result: calculate(checked.values, r) }; }
    catch (error) { return { label, error: error.message }; }
  });
  results.hidden = false; results.replaceChildren();
  results.append(renderSection('Estimated retirement funding target', scenarios, 'overall'));
  results.append(renderSection('Taxable bridge coverage', scenarios, 'bridge'));
  const r = scenarios.find(s => s.result)?.result;
  if (r) results.append(node('p', `Annual portfolio spending gap before Social Security: ${money(r.gapBefore)}. Ongoing gap: ${money(r.gapAfter)}.`, 'scope-note'));
  status.textContent = 'Estimates updated. Review the overall target and the separate taxable bridge check below.';
}
for (const input of Object.values(fields)) input.addEventListener('input', update);
document.getElementById('calculate').addEventListener('click', () => { update(); if (!errors.hidden) errors.focus(); });
document.getElementById('load-example').addEventListener('click', () => {
  for (const [key, value] of Object.entries(EXAMPLE)) fields[key].value = String(value);
  exampleNotice.hidden = false; update();
});
document.getElementById('reset-calculator').addEventListener('click', () => {
  for (const [key, input] of Object.entries(fields)) { input.value = key === 'withdrawal' ? '4' : key === 'realReturn' ? '0' : ''; input.removeAttribute('aria-invalid'); input.disabled = false; }
  errors.hidden = true; errors.replaceChildren(); results.hidden = true; results.replaceChildren(); exampleNotice.hidden = true;
  status.textContent = 'Calculator cleared. Enter your assumptions or deliberately load the hypothetical example.';
});
