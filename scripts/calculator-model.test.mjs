import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, presentValue, validate, EXAMPLE } from '../assets/calculator/model.mjs';
const near = (actual, expected, tolerance = 0.01) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`);
const base = { spending: 100, income: 0, socialSecurity: 0, socialYears: '', taxable: 200, retirement: 300, bridgeYears: 2, withdrawal: 4, realReturn: 0 };

test('provided zero-return example, independent reference values and no bridge double count', () => {
  const r = calculate(EXAMPLE);
  assert.equal(r.gapBefore, 50000); assert.equal(r.gapAfter, 20000);
  assert.equal(r.combinedSavings, 1100000); assert.equal(r.overallTarget, 1000000);
  assert.equal(r.bridgeTarget, 350000); assert.equal(r.overallDifference, 100000);
  assert.equal(r.bridgeDifference, -100000); near(r.overallCoverage, 110); near(r.bridgeCoverage, 71.4285714286);
});
test('provided 3% reference, without mutating example', () => {
  const r = calculate(EXAMPLE, .03);
  near(r.overallTarget, 811352, .5); near(r.bridgeTarget, 320860, .5);
  near(r.overallDifference, 288648, .5); near(r.bridgeDifference, -70860, .5);
  assert.equal(EXAMPLE.realReturn, 0);
});
test('beginning-of-year PV: zero years, zero return, positive and negative return', () => {
  assert.equal(presentValue(100, 0, .1), 0); assert.equal(presentValue(100, 3, 0), 300);
  near(presentValue(110, 2, .1), 210); near(presentValue(100, 2, -.5), 300);
  near(presentValue(100, 3, 1e-14), 300, 1e-10); near(presentValue(100, 3, -1e-14), 300, 1e-10);
});
test('Social Security immediately reduces both ongoing gap and bridge', () => {
  const r = calculate({ ...base, socialSecurity: 60, socialYears: 0 });
  assert.equal(r.overallTarget, 1000); assert.equal(r.bridgeTarget, 80);
});
test('zero benefits ignore even invalid timing; returns do not change gap/rate target', () => {
  for (const socialYears of ['', 0, 20, 'not a year', Infinity, -1]) {
    const r = calculate({ ...base, socialYears, realReturn: 3 });
    assert.equal(r.overallTarget, 2500); near(r.bridgeTarget, 197.08737864);
  }
});
test('benefits begin inside bridge: separate timing and discounted amounts', () => {
  const r = calculate({ ...base, socialSecurity: 50, socialYears: 2, bridgeYears: 4 });
  assert.equal(r.overallTarget, 1450); assert.equal(r.bridgeTarget, 300);
});
test('benefits after bridge and independent bridge duration', () => {
  const r = calculate({ ...base, socialSecurity: 50, socialYears: 5, bridgeYears: 2 });
  assert.equal(r.overallTarget, 1750); assert.equal(r.bridgeTarget, 200);
  const longer = calculate({ ...base, socialSecurity: 50, socialYears: 5, bridgeYears: 7 });
  assert.equal(longer.overallTarget, 1750); assert.equal(longer.bridgeTarget, 600);
});
test('future target discounted at the same beginning-of-year boundary', () => {
  // One $100 withdrawal today, then $1,000 ongoing target discounted one year at 10%.
  const r = calculate({ ...base, socialSecurity: 60, socialYears: 1 }, .1);
  near(r.overallTarget, 1009.09090909); near(r.bridgeTarget, 136.36363636);
});
test('zero gaps and zero-year bridge have null percentages, never divide by zero', () => {
  const zero = calculate({ ...base, income: 150 });
  assert.equal(zero.overallTarget, 0); assert.equal(zero.bridgeTarget, 0);
  assert.equal(zero.overallCoverage, null); assert.equal(zero.bridgeCoverage, null);
  assert.equal(calculate({ ...base, bridgeYears: 0 }).bridgeTarget, 0);
});
test('outside income is separate; no inferred portfolio yield or double counting', () => {
  const a = calculate(base), b = calculate({ ...base, taxable: 1000000, retirement: 2000000 });
  assert.equal(a.gapBefore, b.gapBefore); assert.equal(a.overallTarget, b.overallTarget);
});
test('negative real returns supported above -100%', () => {
  const r = calculate({ ...base, socialSecurity: 100, socialYears: 2, realReturn: -50 });
  assert.equal(r.overallTarget, 300); assert.equal(r.bridgeTarget, 300);
});
test('invalid returns, withdrawal rates, nonfinite amounts and invalid whole years', () => {
  for (const realReturn of [-100, -101, Infinity, NaN, 'no', '0x10']) assert.ok(validate({ ...base, realReturn }).errors.length);
  for (const withdrawal of [0, -1, 101, Infinity, '']) assert.ok(validate({ ...base, withdrawal }).errors.length);
  for (const spending of [-1, Infinity, NaN, '1e309', 'abc', '0x10']) assert.ok(validate({ ...base, spending }).errors.length);
  for (const bridgeYears of [-1, .5, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.ok(validate({ ...base, bridgeYears }).errors.length);
  assert.throws(() => presentValue(100, 2, -1)); assert.throws(() => presentValue(100, .5, 0));
});
test('optional blank return is zero, blank money is not silently zero', () => {
  assert.equal(validate({ ...base, realReturn: '' }).values.realReturn, 0);
  assert.ok(validate({ ...base, income: '' }).errors.some(e => e.key === 'income'));
});
test('missing fields reported together; SS timing required only for positive benefit', () => {
  const errors = validate({ withdrawal: 4, realReturn: 0 }).errors;
  assert.ok(errors.some(e => e.key === 'spending')); assert.ok(errors.some(e => e.key === 'taxable'));
  assert.ok(validate({ ...base, socialSecurity: 10 }).errors.some(e => e.key === 'socialYears'));
});
test('nonfinite targets or derived percentages fail explicitly; zero gaps avoid overflow', () => {
  assert.throws(() => calculate({ ...base, socialSecurity: 50, socialYears: 10000, realReturn: -99 }));
  assert.throws(() => calculate({ ...base, spending: 1e308, bridgeYears: 100 }));
  assert.throws(() => calculate({ ...base, spending: 1e-300, taxable: 1e308 }));
  assert.equal(calculate({ ...base, spending: 0, socialSecurity: 100, socialYears: 10000, realReturn: -99 }).overallTarget, 0);
});
test('100% withdrawal accepted; above-target coverage retains actual percentage', () => {
  const r = calculate({ ...base, withdrawal: 100, taxable: 1000 });
  assert.equal(r.overallTarget, 100); assert.equal(r.overallCoverage, 1300);
});

test('withdrawal sensitivity: reference targets at fixed 0% return, same bridge and unmutated inputs', () => {
  const input = { ...EXAMPLE };
  for (const [withdrawal, target, difference] of [[3, 1166666.666667, -66666.666667], [3.5, 1071428.571429, 28571.428571], [4, 1000000, 100000], [3.25, 1115384.615385, -15384.615385]]) {
    const result = calculate({ ...input, withdrawal });
    near(result.overallTarget, target); near(result.overallDifference, difference);
    assert.equal(result.bridgeTarget, 350000); assert.equal(result.combinedSavings, 1100000);
  }
  assert.deepEqual(input, EXAMPLE);
});
test('withdrawal sensitivity: fixed entered 3% real return uses discounted targets, unchanged bridge', () => {
  // Independently evaluated beginning-year discounted gaps plus future ongoing target.
  for (const [withdrawal, target] of [[3, 935368.056025], [3.5, 864501.968892], [4, 811352.403542], [3.25, 897209.393723]]) {
    const result = calculate({ ...EXAMPLE, realReturn: 3, withdrawal });
    near(result.overallTarget, target); near(result.bridgeTarget, 320859.572240, .01);
    near(result.overallDifference, 1100000 - target);
  }
});
test('withdrawal sensitivity: all-zero funding gaps remain zero, including negative real returns', () => {
  for (const withdrawal of [3, 3.5, 4, 3.25]) {
    const result = calculate({ ...EXAMPLE, income: 75000, realReturn: -3, withdrawal });
    assert.equal(result.overallTarget, 0); assert.equal(result.bridgeTarget, 0); assert.equal(result.overallCoverage, null);
  }
});
