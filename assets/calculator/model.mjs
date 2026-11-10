// Deterministic, beginning-of-year withdrawals in today's dollars. No I/O.
export const EXAMPLE = Object.freeze({ spending: 75000, income: 25000, socialSecurity: 30000,
  socialYears: 10, taxable: 250000, retirement: 850000, bridgeYears: 7, withdrawal: 4, realReturn: 0 });
export const LABELS = Object.freeze({ spending: 'Expected annual spending', income: 'Dependable annual income',
  socialSecurity: 'Expected annual Social Security benefits', socialYears: 'Years until Social Security starts',
  taxable: 'Taxable savings available for retirement spending', retirement: 'Retirement account savings',
  bridgeYears: 'Years before drawing from retirement accounts', withdrawal: 'Assumed starting withdrawal rate',
  realReturn: 'Annual investment return after inflation' });

export function validate(raw) {
  const values = {}, errors = [];
  for (const key of Object.keys(LABELS)) {
    // Zero Social Security makes its timing irrelevant, including invalid timing.
    if (key === 'socialYears' && Number(raw.socialSecurity) === 0 && String(raw.socialSecurity).trim() !== '') {
      values[key] = 0; continue;
    }
    const text = String(raw[key] ?? '').trim();
    if (key === 'realReturn' && !text) { values[key] = 0; continue; }
    const value = Number(text);
    let reason = !text ? 'Enter a value (use 0 when none applies).' :
      (!Number.isFinite(value) || !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) ? 'Enter a finite number.' : '';
    if (!reason) {
      if (key === 'withdrawal' && (value <= 0 || value > 100)) reason = 'Use a rate greater than 0% and no more than 100%.';
      else if (key === 'realReturn' && value <= -100) reason = 'Use a return greater than −100%.';
      else if (['socialYears', 'bridgeYears'].includes(key) && (!Number.isSafeInteger(value) || value < 0)) reason = 'Enter a nonnegative whole number of years.';
      else if (!['realReturn', 'withdrawal'].includes(key) && value < 0) reason = 'Enter 0 or a positive amount.';
    }
    if (reason) errors.push({ key, message: `${LABELS[key]}: ${reason}` });
    values[key] = value;
  }
  return { values, errors };
}
const finite = value => {
  if (!Number.isFinite(value) || value < 0) throw new RangeError('These assumptions produce amounts too large to display reliably. Try a shorter period or less extreme amounts or returns.');
  return value;
};
function period(years) {
  if (!Number.isSafeInteger(years) || years < 0) throw new RangeError('Years must be nonnegative whole numbers.');
}
function rate(r) { if (!Number.isFinite(r) || r <= -1) throw new RangeError('Real return must be finite and greater than −100%.'); }
// A * sum((1+r)^(-t)), t = 0...years-1. expm1/log1p avoid near-zero cancellation.
export function presentValue(amount, years, r) {
  period(years); rate(r); finite(amount);
  if (years === 0 || amount === 0) return 0;
  if (r === 0) return finite(amount * years);
  const log = Math.log1p(r);
  return finite(amount * (Math.expm1(-years * log) / Math.expm1(-log)));
}
function discounted(amount, years, r) {
  if (amount === 0) return 0;
  return finite(amount * Math.exp(-years * Math.log1p(r)));
}
export function calculate(v, r = v.realReturn / 100) {
  const checked = validate(v);
  if (checked.errors.length) throw new RangeError(checked.errors.map(e => e.message).join(' '));
  v = checked.values; rate(r);
  const gapBefore = Math.max(0, v.spending - v.income);
  const gapAfter = Math.max(0, v.spending - v.income - v.socialSecurity);
  const w = v.withdrawal / 100;
  const n = v.socialSecurity > 0 ? v.socialYears : 0;
  const ongoingGap = v.socialSecurity > 0 ? gapAfter : gapBefore;
  const overallTarget = finite(presentValue(gapBefore, n, r) + discounted(finite(ongoingGap / w), n, r));
  const beforeYears = v.socialSecurity > 0 ? Math.min(v.bridgeYears, n) : v.bridgeYears;
  const afterYears = v.bridgeYears - beforeYears;
  const bridgeTarget = finite(presentValue(gapBefore, beforeYears, r) +
    discounted(presentValue(ongoingGap, afterYears, r), beforeYears, r));
  const combinedSavings = finite(v.taxable + v.retirement);
  const overallDifference = combinedSavings - overallTarget;
  const bridgeDifference = v.taxable - bridgeTarget;
  if (![overallDifference, bridgeDifference].every(Number.isFinite)) throw new RangeError('The differences are too large to display reliably.');
  // Zero targets have no funded percentage; extreme ratios fail explicitly.
  return { r, gapBefore, gapAfter: ongoingGap, overallTarget, bridgeTarget, combinedSavings,
    taxableSavings: v.taxable, bridgeYears: v.bridgeYears, overallDifference, bridgeDifference,
    overallCoverage: overallTarget > 0 ? finite(combinedSavings / overallTarget * 100) : null,
    bridgeCoverage: bridgeTarget > 0 ? finite(v.taxable / bridgeTarget * 100) : null };
}
