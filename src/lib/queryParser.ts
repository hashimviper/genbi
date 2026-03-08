// Q&A Query Analytics Parser (PowerBI Style - Enhanced)
// Supports: time-based, top-N, comparative queries

import { DataColumn } from '@/types/dashboard';

export interface ParsedQuery {
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  measure: string;
  dimension: string;
  chartType: string;
  isValid: boolean;
  error?: string;
  topN?: number;
  sortDirection?: 'asc' | 'desc';
  timeFilter?: { field: string; period: string };
  compareFields?: string[];
}

const AGGREGATION_MAP: Record<string, ParsedQuery['aggregation']> = {
  'sum': 'sum', 'total': 'sum', 'average': 'avg', 'avg': 'avg', 'mean': 'avg',
  'count': 'count', 'number': 'count', 'minimum': 'min', 'min': 'min', 'maximum': 'max', 'max': 'max',
};

const CHART_TYPE_MAP: Record<string, string> = {
  'bar': 'bar', 'bar chart': 'bar', 'column': 'bar', 'line': 'line', 'line chart': 'line',
  'trend': 'line', 'pie': 'pie', 'pie chart': 'pie', 'donut': 'donut', 'doughnut': 'donut',
  'area': 'area', 'area chart': 'area', 'scatter': 'scatter', 'scatter plot': 'scatter',
  'radar': 'radar', 'treemap': 'treemap', 'funnel': 'funnel', 'waterfall': 'waterfall',
  'gauge': 'gauge', 'horizontal bar': 'horizontalBar', 'horizontal': 'horizontalBar',
  'stacked bar': 'stackedBar', 'stacked': 'stackedBar', 'combo': 'combo', 'kpi': 'kpi', 'table': 'table',
};

const TIME_PATTERNS: { regex: RegExp; period: string }[] = [
  { regex: /last\s+(\d+)\s+months?/i, period: 'months' },
  { regex: /last\s+(\d+)\s+years?/i, period: 'years' },
  { regex: /last\s+(\d+)\s+weeks?/i, period: 'weeks' },
  { regex: /last\s+(\d+)\s+days?/i, period: 'days' },
  { regex: /this\s+year/i, period: 'thisYear' },
  { regex: /this\s+month/i, period: 'thisMonth' },
  { regex: /this\s+quarter/i, period: 'thisQuarter' },
  { regex: /q([1-4])\s+vs\s+q([1-4])/i, period: 'quarterCompare' },
  { regex: /ytd|year\s+to\s+date/i, period: 'ytd' },
];

export function parseQuery(query: string, columns: DataColumn[]): ParsedQuery {
  const lower = query.toLowerCase().trim();

  if (!lower) {
    return { aggregation: 'sum', measure: '', dimension: '', chartType: 'bar', isValid: false, error: 'Empty query' };
  }

  // Detect aggregation
  let aggregation: ParsedQuery['aggregation'] = 'sum';
  for (const [keyword, agg] of Object.entries(AGGREGATION_MAP)) {
    if (lower.startsWith(keyword + ' ')) { aggregation = agg; break; }
  }

  // Detect chart type (check from end of string)
  let chartType = 'bar';
  const sortedChartKeys = Object.keys(CHART_TYPE_MAP).sort((a, b) => b.length - a.length);
  for (const keyword of sortedChartKeys) {
    if (lower.endsWith(keyword)) { chartType = CHART_TYPE_MAP[keyword]; break; }
  }

  // ── Top-N Detection ──
  let topN: number | undefined;
  let sortDirection: 'asc' | 'desc' | undefined;
  const topMatch = lower.match(/top\s+(\d+)/);
  const bottomMatch = lower.match(/bottom\s+(\d+)/);
  if (topMatch) { topN = parseInt(topMatch[1]); sortDirection = 'desc'; }
  else if (bottomMatch) { topN = parseInt(bottomMatch[1]); sortDirection = 'asc'; }

  // ── Time Filter Detection ──
  let timeFilter: ParsedQuery['timeFilter'] | undefined;
  const dateColumns = columns.filter(c => c.type === 'date' || 
    ['date', 'time', 'day', 'month', 'year', 'quarter', 'period', 'created'].some(k => c.name.toLowerCase().includes(k)));
  
  for (const tp of TIME_PATTERNS) {
    const match = lower.match(tp.regex);
    if (match && dateColumns.length > 0) {
      timeFilter = { field: dateColumns[0].name, period: `${match[1] || ''}${tp.period}` };
      break;
    }
  }

  // ── Comparative Query Detection ──
  let compareFields: string[] | undefined;
  const vsMatch = lower.match(/(\w+)\s+vs\.?\s+(\w+)/);
  if (vsMatch) {
    const f1 = findBestMatch(vsMatch[1], columns);
    const f2 = findBestMatch(vsMatch[2], columns);
    if (f1 && f2) compareFields = [f1, f2];
  }

  // Extract measure and dimension
  const numericCols = columns.filter(c => c.type === 'number');
  const stringCols = columns.filter(c => c.type === 'string');
  let measure = '';
  let dimension = '';

  // Try pattern: "... of MEASURE by DIMENSION ..."
  const ofByMatch = lower.match(/(?:of|for)\s+(.+?)\s+by\s+(.+?)(?:\s+(?:bar|line|pie|donut|area|scatter|radar|treemap|funnel|waterfall|gauge|horizontal|stacked|combo|kpi|table).*)?$/);
  if (ofByMatch) {
    measure = findBestMatch(ofByMatch[1].trim(), columns) || '';
    dimension = findBestMatch(ofByMatch[2].trim(), columns) || '';
  }

  // Fallback: find column names mentioned
  if (!measure || !dimension) {
    for (const col of columns) {
      const colLower = col.name.toLowerCase().replace(/_/g, ' ');
      if (lower.includes(colLower)) {
        if (col.type === 'number' && !measure) measure = col.name;
        else if (col.type === 'string' && !dimension) dimension = col.name;
      }
    }
  }

  // Final fallback
  if (!measure && numericCols.length > 0) measure = numericCols[0].name;
  if (!dimension && stringCols.length > 0) dimension = stringCols[0].name;

  // Auto-select chart type for time queries
  if (timeFilter && chartType === 'bar') chartType = 'line';

  const isValid = !!measure && !!dimension;
  return {
    aggregation, measure, dimension, chartType, isValid,
    error: isValid ? undefined : `Could not identify ${!measure ? 'measure' : 'dimension'} field. Available: ${columns.map(c => c.name).join(', ')}`,
    topN, sortDirection, timeFilter, compareFields,
  };
}

function findBestMatch(candidate: string, columns: DataColumn[]): string | null {
  const lower = candidate.toLowerCase().replace(/_/g, ' ');
  for (const col of columns) {
    if (col.name.toLowerCase() === lower || col.name.toLowerCase().replace(/_/g, ' ') === lower) return col.name;
  }
  for (const col of columns) {
    const colLower = col.name.toLowerCase().replace(/_/g, ' ');
    if (colLower.includes(lower) || lower.includes(colLower)) return col.name;
  }
  return null;
}

export function getQuerySuggestions(columns: DataColumn[]): string[] {
  const numericCols = columns.filter(c => c.type === 'number');
  const stringCols = columns.filter(c => c.type === 'string');
  if (numericCols.length === 0 || stringCols.length === 0) return [];

  const suggestions: string[] = [];
  const measure = numericCols[0].name.replace(/_/g, ' ');
  const dimension = stringCols[0].name.replace(/_/g, ' ');

  suggestions.push(`Sum of ${measure} by ${dimension} Bar Chart`);
  suggestions.push(`Average ${measure} by ${dimension} Line Chart`);
  suggestions.push(`Count of ${measure} by ${dimension} Pie Chart`);
  suggestions.push(`Top 10 ${dimension} by ${measure}`);

  if (numericCols.length > 1) {
    const m2 = numericCols[1].name.replace(/_/g, ' ');
    suggestions.push(`${measure} vs ${m2} by ${dimension}`);
  }
  if (stringCols.length > 1) {
    const d2 = stringCols[1].name.replace(/_/g, ' ');
    suggestions.push(`Sum of ${measure} by ${d2} Horizontal Bar`);
  }

  return suggestions;
}
