// Ranking and summary metrics utilities for dashboards

export type RankingDirection = 'asc' | 'desc';
export type SummaryMetric = 'total' | 'average' | 'min' | 'max' | 'count' | 'distinctCount' | 'percentContribution';

export interface RankingConfig {
  enabled: boolean;
  field: string;
  direction: RankingDirection;
  limit?: number; // Top N / Bottom N
}

export interface SummaryConfig {
  metrics: SummaryMetric[];
  valueField: string;
  groupByField?: string;
}

export function rankData(
  data: Record<string, unknown>[],
  config: RankingConfig
): Record<string, unknown>[] {
  if (!config.enabled || !config.field) {
    return data;
  }

  const sorted = [...data].sort((a, b) => {
    const aVal = a[config.field];
    const bVal = b[config.field];

    let comparison = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    }

    return config.direction === 'asc' ? comparison : -comparison;
  });

  return config.limit ? sorted.slice(0, config.limit) : sorted;
}

export function calculateSummaries(
  data: Record<string, unknown>[],
  config: SummaryConfig
): Record<SummaryMetric, number | string> {
  const values = data
    .map(item => item[config.valueField])
    .filter((v): v is number => typeof v === 'number');

  if (values.length === 0) {
    return {
      total: 0,
      average: 0,
      min: 0,
      max: 0,
      count: 0,
      distinctCount: 0,
      percentContribution: 0,
    };
  }

  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const count = values.length;
  const distinctCount = new Set(values).size;

  return {
    total,
    average: parseFloat(average.toFixed(2)),
    min,
    max,
    count,
    distinctCount,
    percentContribution: 0, // Calculated per row if needed
  };
}

export function calculatePercentContribution(
  data: Record<string, unknown>[],
  valueField: string
): Record<string, unknown>[] {
  const values = data
    .map(item => item[valueField])
    .filter((v): v is number => typeof v === 'number');

  const total = values.reduce((a, b) => a + b, 0);

  return data.map(item => ({
    ...item,
    percentContribution: total > 0 ? ((item[valueField] as number) / total * 100) : 0,
  }));
}

export function getPerformanceStatus(
  value: number,
  target: number,
  threshold: number = 0.9 // 90% is good
): 'excellent' | 'good' | 'needsAttention' {
  const ratio = value / target;
  if (ratio >= 1) return 'excellent';
  if (ratio >= threshold) return 'good';
  return 'needsAttention';
}
