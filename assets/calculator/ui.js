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
function renderWithdrawalComparison(values, open) {
  const details = node('details', undefined, 'scenario-assumptions withdrawal-comparison');
  details.open = open;
  details.append(node('summary', 'How would a different withdrawal rate change my target?'));
  details.append(node('p', `Illustrative comparison rates, not recommendations. Only the withdrawal rate changes; all other inputs, including your ${values.realReturn}% annual real return, stay the same.`, 'scope-note'));
  const rates = [3, 3.5, 4];
  if (!rates.includes(values.withdrawal)) rates.push(values.withdrawal);
  rates.sort((a, b) => a - b);
  const rows = rates.map(withdrawal => {
    try { return { withdrawal, result: calculate({ ...values, withdrawal }) }; }
    catch (error) { return { withdrawal, error: error.message }; }
  });
  if (rows.every(row => row.result?.overallTarget === 0)) {
    details.append(node('p', 'No portfolio funding needed under these assumptions at any comparison rate.'));
  } else {
    const wrap = node('div', undefined, 'article-table-wrap');
    wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Withdrawal-rate comparison'); wrap.tabIndex = 0;
    const table = node('table', undefined, 'article-table withdrawal-table');
    table.append(node('caption', `Overall targets at ${values.realReturn}% annual real return`));
    const head = node('thead'), header = node('tr');
    for (const label of ['Withdrawal rate', 'Estimated target', 'Combined savings vs target']) {
      const th = node('th', label); th.scope = 'col'; header.append(th);
    }
    head.append(header); table.append(head);
    const body = node('tbody');
    for (const { withdrawal, result, error } of rows) {
      const tr = node('tr');
      const label = [3, 3.5, 4].includes(withdrawal) ? withdrawal.toFixed(1) : String(withdrawal);
      const th = node('th', `${label}%${withdrawal === values.withdrawal ? ' (entered)' : ''}`); th.scope = 'row'; tr.append(th);
      if (error) {
        const td = node('td', error, 'calculation-limitation'); td.colSpan = 2; tr.append(td);
      } else {
        tr.append(node('td', money(result.overallTarget)));
        const td = node('td', money(Math.abs(result.overallDifference)));
        td.append(node('span', result.overallDifference === 0 ? 'At target' : result.overallDifference > 0 ? 'Above target' : 'Below target', 'comparison-direction'));
        tr.append(td);
      }
      body.append(tr);
    }
    table.append(body); wrap.append(table); details.append(wrap);
  }
  details.append(node('p', 'Lower withdrawal rates produce higher estimated funding targets under this model. These comparisons do not measure the probability that savings will last throughout retirement.', 'scope-note'));
  return details;
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
  const comparisonOpen = results.querySelector('.withdrawal-comparison')?.open ?? false;
  results.hidden = false; results.replaceChildren();
  const overall = renderSection('Estimated retirement funding target', scenarios, 'overall');
  if (scenarios.some(s => s.result)) overall.append(renderWithdrawalComparison(checked.values, comparisonOpen));
  results.append(overall);
  const bridge = renderSection('Taxable bridge coverage', scenarios, 'bridge');
  bridge.append(document.getElementById('bridge-guidance').content.cloneNode(true)); results.append(bridge);
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
