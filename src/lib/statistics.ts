/**
 * Statistical Analysis: Anomaly Detection & Forecasting
 * Pure frontend — no cloud dependencies
 */

// ── Z-Score Outlier Detection ─────────────────────────────────────

export interface Outlier {
  index: number;
  value: number;
  zScore: number;
  label?: string;
}

export function detectOutliersZScore(
  values: number[],
  threshold: number = 2.0,
  labels?: string[]
): Outlier[] {
  if (values.length < 3) return [];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length);
  if (stdDev === 0) return [];

  return values
    .map((v, i) => ({ index: i, value: v, zScore: Math.abs((v - mean) / stdDev), label: labels?.[i] }))
    .filter(o => o.zScore > threshold);
}

// ── IQR Outlier Detection ─────────────────────────────────────────

export function detectOutliersIQR(
  values: number[],
  labels?: string[]
): Outlier[] {
  if (values.length < 4) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;

  return values
    .map((v, i) => ({ index: i, value: v, zScore: 0, label: labels?.[i] }))
    .filter(o => o.value < lower || o.value > upper);
}

// ── Linear Regression ─────────────────────────────────────────────

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  predict: (x: number) => number;
}

export function linearRegression(xValues: number[], yValues: number[]): RegressionResult {
  const n = xValues.length;
  if (n < 2) return { slope: 0, intercept: 0, rSquared: 0, predict: () => 0 };

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((a, x, i) => a + x * yValues[i], 0);
  const sumXX = xValues.reduce((a, x) => a + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared
  const meanY = sumY / n;
  const ssRes = yValues.reduce((a, y, i) => a + (y - (slope * xValues[i] + intercept)) ** 2, 0);
  const ssTot = yValues.reduce((a, y) => a + (y - meanY) ** 2, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared, predict: (x: number) => slope * x + intercept };
}

// ── Moving Average ────────────────────────────────────────────────

export function movingAverage(values: number[], window: number = 3): number[] {
  if (values.length < window) return values;
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - Math.floor(window / 2));
    const end = Math.min(values.length, start + window);
    const slice = values.slice(start, end);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}

// ── Forecast Projection ───────────────────────────────────────────

export interface ForecastPoint {
  index: number;
  value: number;
  label: string;
  isForecast: boolean;
}

export function generateForecast(
  values: number[],
  labels: string[],
  forecastPeriods: number = 3
): ForecastPoint[] {
  const xValues = values.map((_, i) => i);
  const reg = linearRegression(xValues, values);

  // Historical points
  const points: ForecastPoint[] = values.map((v, i) => ({
    index: i,
    value: v,
    label: labels[i] || `Point ${i + 1}`,
    isForecast: false,
  }));

  // Forecast points
  for (let i = 1; i <= forecastPeriods; i++) {
    const x = values.length - 1 + i;
    points.push({
      index: x,
      value: Math.round(reg.predict(x) * 100) / 100,
      label: `Forecast ${i}`,
      isForecast: true,
    });
  }

  return points;
}

// ── Summary Statistics ────────────────────────────────────────────

export interface StatsSummary {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  outlierCount: number;
}

export function computeStats(values: number[]): StatsSummary {
  if (values.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, range: 0, q1: 0, q3: 0, iqr: 0, skewness: 0, outlierCount: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const stdDev = Math.sqrt(sorted.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n);
  const min = sorted[0];
  const max = sorted[n - 1];
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Skewness (Pearson's)
  const skewness = stdDev === 0 ? 0 : (3 * (mean - median)) / stdDev;

  const outlierCount = detectOutliersIQR(values).length;

  return { mean, median, stdDev, min, max, range: max - min, q1, q3, iqr, skewness, outlierCount };
}
