// Q&A Query Analytics Parser (PowerBI Style - No AI)
// Format: "Aggregation of Measure by Dimension ChartType"

import { DataColumn } from '@/types/dashboard';

export interface ParsedQuery {
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  measure: string;
  dimension: string;
  chartType: string;
  isValid: boolean;
  error?: string;
}

const AGGREGATION_MAP: Record<string, ParsedQuery['aggregation']> = {
  'sum': 'sum',
  'total': 'sum',
  'average': 'avg',
  'avg': 'avg',
  'mean': 'avg',
  'count': 'count',
  'number': 'count',
  'minimum': 'min',
  'min': 'min',
  'maximum': 'max',
  'max': 'max',
};

const CHART_TYPE_MAP: Record<string, string> = {
  'bar': 'bar',
  'bar chart': 'bar',
  'column': 'bar',
  'line': 'line',
  'line chart': 'line',
  'trend': 'line',
  'pie': 'pie',
  'pie chart': 'pie',
  'donut': 'donut',
  'doughnut': 'donut',
  'area': 'area',
  'area chart': 'area',
  'scatter': 'scatter',
  'scatter plot': 'scatter',
  'radar': 'radar',
  'treemap': 'treemap',
  'funnel': 'funnel',
  'waterfall': 'waterfall',
  'gauge': 'gauge',
  'horizontal bar': 'horizontalBar',
  'horizontal': 'horizontalBar',
  'stacked bar': 'stackedBar',
  'stacked': 'stackedBar',
  'combo': 'combo',
  'kpi': 'kpi',
  'table': 'table',
};

export function parseQuery(query: string, columns: DataColumn[]): ParsedQuery {
  const lower = query.toLowerCase().trim();
  
  if (!lower) {
    return { aggregation: 'sum', measure: '', dimension: '', chartType: 'bar', isValid: false, error: 'Empty query' };
  }

  // Detect aggregation
  let aggregation: ParsedQuery['aggregation'] = 'sum';
  for (const [keyword, agg] of Object.entries(AGGREGATION_MAP)) {
    if (lower.startsWith(keyword + ' ')) {
      aggregation = agg;
      break;
    }
  }

  // Detect chart type (check from end of string)
  let chartType = 'bar';
  const sortedChartKeys = Object.keys(CHART_TYPE_MAP).sort((a, b) => b.length - a.length);
  for (const keyword of sortedChartKeys) {
    if (lower.endsWith(keyword)) {
      chartType = CHART_TYPE_MAP[keyword];
      break;
    }
  }

  // Extract measure and dimension using "of" and "by" keywords
  const colNames = columns.map(c => c.name.toLowerCase());
  const numericCols = columns.filter(c => c.type === 'number');
  const stringCols = columns.filter(c => c.type === 'string');

  let measure = '';
  let dimension = '';

  // Try pattern: "... of MEASURE by DIMENSION ..."
  const ofByMatch = lower.match(/(?:of|for)\s+(.+?)\s+by\s+(.+?)(?:\s+(?:bar|line|pie|donut|area|scatter|radar|treemap|funnel|waterfall|gauge|horizontal|stacked|combo|kpi|table).*)?$/);
  
  if (ofByMatch) {
    const measureCandidate = ofByMatch[1].trim();
    const dimensionCandidate = ofByMatch[2].trim();
    
    // Find best matching column for measure
    measure = findBestMatch(measureCandidate, columns) || '';
    dimension = findBestMatch(dimensionCandidate, columns) || '';
  }

  // Fallback: if no "of...by" pattern, try to find column names mentioned
  if (!measure || !dimension) {
    for (const col of columns) {
      const colLower = col.name.toLowerCase().replace(/_/g, ' ');
      if (lower.includes(colLower)) {
        if (col.type === 'number' && !measure) {
          measure = col.name;
        } else if (col.type === 'string' && !dimension) {
          dimension = col.name;
        }
      }
    }
  }

  // Final fallback to first available columns
  if (!measure && numericCols.length > 0) measure = numericCols[0].name;
  if (!dimension && stringCols.length > 0) dimension = stringCols[0].name;

  const isValid = !!measure && !!dimension;

  return {
    aggregation,
    measure,
    dimension,
    chartType,
    isValid,
    error: isValid ? undefined : `Could not identify ${!measure ? 'measure' : 'dimension'} field. Available columns: ${columns.map(c => c.name).join(', ')}`,
  };
}

function findBestMatch(candidate: string, columns: DataColumn[]): string | null {
  const lower = candidate.toLowerCase().replace(/_/g, ' ');
  
  // Exact match
  for (const col of columns) {
    if (col.name.toLowerCase() === lower || col.name.toLowerCase().replace(/_/g, ' ') === lower) {
      return col.name;
    }
  }
  
  // Partial match
  for (const col of columns) {
    const colLower = col.name.toLowerCase().replace(/_/g, ' ');
    if (colLower.includes(lower) || lower.includes(colLower)) {
      return col.name;
    }
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
  
  if (numericCols.length > 1) {
    const measure2 = numericCols[1].name.replace(/_/g, ' ');
    suggestions.push(`Total ${measure2} by ${dimension} Donut`);
  }
  if (stringCols.length > 1) {
    const dim2 = stringCols[1].name.replace(/_/g, ' ');
    suggestions.push(`Sum of ${measure} by ${dim2} Horizontal Bar`);
  }
  
  return suggestions;
}
