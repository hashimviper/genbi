/**
 * Smart axis formatting utilities for high-variance datasets.
 * Converts large numbers to abbreviated forms (K, M, B, T).
 */

export function formatAxisValue(value: number): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000_000) return `${sign}${(abs / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
}

export function formatTooltipValue(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/**
 * Detects if a dataset has high variance and returns stats.
 */
export function detectVariance(data: Record<string, unknown>[], field: string): { hasHighVariance: boolean; max: number; min: number; ratio: number } {
  const values = data.map(d => Number(d[field]) || 0).filter(v => v !== 0);
  if (values.length < 2) return { hasHighVariance: false, max: 0, min: 0, ratio: 1 };
  const max = Math.max(...values);
  const min = Math.min(...values);
  const ratio = min !== 0 ? max / min : max;
  return { hasHighVariance: ratio > 100, max, min, ratio };
}
