import { DataColumn } from '@/types/dashboard';

// ─── Analysis Type Detection ────────────────────────────────────────

export type AnalysisType =
  | 'comparison'
  | 'composition'
  | 'distribution'
  | 'trend'
  | 'relationship'
  | 'ranking'
  | 'part-to-whole'
  | 'deviation'
  | 'flow'
  | 'performance';

export interface AnalysisInstance {
  type: AnalysisType;
  title: string;
  description: string;
  fields: { dimension?: string; measure?: string; secondary?: string };
  recommendedCharts: ChartRecommendation[];
}

export interface ChartRecommendation {
  chartType: string;
  suitability: 'highly-recommended' | 'recommended' | 'possible';
  reason: string;
  available: boolean;
}

const AVAILABLE_CHARTS = [
  'bar', 'line', 'pie', 'area', 'scatter', 'kpi', 'table', 'gauge',
  'radar', 'treemap', 'funnel', 'combo', 'waterfall', 'stackedBar',
  'donut', 'sparkline', 'horizontalBar',
];

const CHART_LABELS: Record<string, string> = {
  bar: 'Bar Chart', line: 'Line Chart', pie: 'Pie Chart', area: 'Area Chart',
  scatter: 'Scatter Plot', kpi: 'KPI Card', table: 'Data Table', gauge: 'Gauge',
  radar: 'Radar Chart', treemap: 'Treemap', funnel: 'Funnel Chart',
  combo: 'Combo Chart', waterfall: 'Waterfall Chart', stackedBar: 'Stacked Bar',
  donut: 'Donut Chart', sparkline: 'Sparkline', horizontalBar: 'Horizontal Bar',
};

// Date-related keywords
const DATE_KEYWORDS = ['date', 'time', 'day', 'month', 'year', 'quarter', 'week', 'period', 'created', 'updated'];
const MEASURE_KEYWORDS = ['revenue', 'sales', 'amount', 'total', 'cost', 'price', 'profit', 'budget', 'spend', 'count', 'rate', 'score', 'value', 'units', 'orders', 'salary', 'growth', 'impressions', 'clicks', 'conversions', 'roi', 'employees', 'patients', 'users', 'views', 'visitors'];
const CATEGORICAL_KEYWORDS = ['name', 'category', 'type', 'status', 'region', 'country', 'department', 'product', 'channel', 'segment', 'group', 'team', 'city', 'project'];
const SEQUENTIAL_KEYWORDS = ['stage', 'step', 'phase', 'level', 'funnel', 'pipeline'];

function classifyField(col: DataColumn, data: Record<string, unknown>[]): 'date' | 'measure' | 'dimension' | 'sequential' {
  const name = col.name.toLowerCase();
  if (DATE_KEYWORDS.some(k => name.includes(k)) || col.type === 'date') return 'date';
  if (SEQUENTIAL_KEYWORDS.some(k => name.includes(k))) return 'sequential';
  if (col.type === 'number' || MEASURE_KEYWORDS.some(k => name.includes(k))) return 'measure';
  return 'dimension';
}

function getUniqueCount(data: Record<string, unknown>[], field: string): number {
  return new Set(data.map(d => String(d[field] ?? ''))).size;
}

function rec(chartType: string, suitability: ChartRecommendation['suitability'], reason: string): ChartRecommendation {
  return { chartType, suitability, reason, available: AVAILABLE_CHARTS.includes(chartType) };
}

// ─── Main Analysis Engine ───────────────────────────────────────────

export function analyzeDataset(columns: DataColumn[], data: Record<string, unknown>[]): AnalysisInstance[] {
  const instances: AnalysisInstance[] = [];
  const fields = columns.map(c => ({ ...c, classification: classifyField(c, data) }));

  const dateFields = fields.filter(f => f.classification === 'date');
  const measures = fields.filter(f => f.classification === 'measure');
  const dimensions = fields.filter(f => f.classification === 'dimension');
  const sequentials = fields.filter(f => f.classification === 'sequential');

  // ── Trend Analysis (date + measure) ──
  for (const date of dateFields) {
    for (const measure of measures.slice(0, 3)) {
      instances.push({
        type: 'trend',
        title: `${measure.name} Trend over ${date.name}`,
        description: `Track how ${measure.name} changes over ${date.name}. Ideal for spotting growth patterns, seasonality, and anomalies.`,
        fields: { dimension: date.name, measure: measure.name },
        recommendedCharts: [
          rec('line', 'highly-recommended', 'Line charts excel at showing continuous trends over time with clear directional movement'),
          rec('area', 'highly-recommended', 'Area charts add volume context to trends, emphasizing cumulative magnitude'),
          rec('sparkline', 'recommended', 'Compact trend indicator perfect for dashboards with limited space'),
          rec('combo', 'recommended', 'Overlay bar and line to compare volume vs. trend simultaneously'),
          rec('bar', 'possible', 'Works for discrete time periods but loses continuity compared to line charts'),
        ],
      });
    }
  }

  // ── Comparison Analysis (dimension + measure) ──
  for (const dim of dimensions.slice(0, 3)) {
    const uniqueCount = getUniqueCount(data, dim.name);
    for (const measure of measures.slice(0, 2)) {
      instances.push({
        type: 'comparison',
        title: `Compare ${measure.name} across ${dim.name}`,
        description: `Side-by-side comparison of ${measure.name} values across different ${dim.name} categories (${uniqueCount} unique values). Essential for identifying top/bottom performers.`,
        fields: { dimension: dim.name, measure: measure.name },
        recommendedCharts: [
          rec('bar', 'highly-recommended', 'Bar charts provide the clearest categorical comparison with precise value reading'),
          rec('horizontalBar', 'highly-recommended', `Horizontal bars excel when you have ${uniqueCount > 6 ? 'many' : 'several'} categories with long labels`),
          rec('treemap', uniqueCount > 5 ? 'recommended' : 'possible', 'Treemaps show proportional size differences, revealing dominance patterns'),
          rec('radar', uniqueCount <= 8 ? 'recommended' : 'possible', 'Radar charts compare multiple categories on a single axis for balanced profiling'),
          rec('table', 'recommended', 'Tables provide exact values for precise comparison and drill-down'),
        ],
      });
    }
  }

  // ── Composition / Part-to-Whole (dimension + measure, few categories) ──
  for (const dim of dimensions.slice(0, 2)) {
    const uniqueCount = getUniqueCount(data, dim.name);
    if (uniqueCount <= 12) {
      for (const measure of measures.slice(0, 2)) {
        instances.push({
          type: 'composition',
          title: `${measure.name} Composition by ${dim.name}`,
          description: `Understand how ${measure.name} is distributed across ${dim.name} segments. Shows proportional contribution of each part.`,
          fields: { dimension: dim.name, measure: measure.name },
          recommendedCharts: [
            rec('pie', uniqueCount <= 6 ? 'highly-recommended' : 'recommended', `Pie charts work best with ${uniqueCount <= 6 ? '≤6' : 'limited'} categories for clean readability`),
            rec('donut', uniqueCount <= 8 ? 'highly-recommended' : 'recommended', 'Donut charts add a center metric while showing proportional breakdown'),
            rec('treemap', 'recommended', 'Treemaps handle more categories than pie, showing hierarchical composition'),
            rec('stackedBar', 'recommended', 'Stacked bars reveal composition changes across another dimension'),
            rec('waterfall', 'possible', 'Waterfall charts show how components add up to a total progressively'),
          ],
        });
      }
    }
  }

  // ── Distribution Analysis (single measure) ──
  for (const measure of measures.slice(0, 3)) {
    instances.push({
      type: 'distribution',
      title: `${measure.name} Distribution Analysis`,
      description: `Examine how ${measure.name} values are spread across the dataset. Reveals concentration, outliers, and range patterns.`,
      fields: { measure: measure.name },
      recommendedCharts: [
        rec('bar', 'highly-recommended', 'Histogram-style bar charts reveal frequency distribution patterns clearly'),
        rec('scatter', 'recommended', 'Scatter plots show individual data point spread and clustering'),
        rec('kpi', 'recommended', 'KPI cards summarize key distribution metrics: mean, median, range'),
        rec('gauge', 'recommended', 'Gauge shows current value against expected range benchmarks'),
        rec('table', 'possible', 'Statistical summary table for detailed distribution metrics'),
      ],
    });
  }

  // ── Relationship Analysis (measure vs measure) ──
  if (measures.length >= 2) {
    for (let i = 0; i < Math.min(measures.length, 3); i++) {
      for (let j = i + 1; j < Math.min(measures.length, 4); j++) {
        instances.push({
          type: 'relationship',
          title: `${measures[i].name} vs ${measures[j].name} Correlation`,
          description: `Explore the relationship between ${measures[i].name} and ${measures[j].name}. Detect positive/negative correlations and outlier pairs.`,
          fields: { dimension: measures[i].name, measure: measures[j].name },
          recommendedCharts: [
            rec('scatter', 'highly-recommended', 'Scatter plots are the gold standard for showing bivariate relationships and correlation patterns'),
            rec('combo', 'recommended', 'Combo charts overlay both measures on shared axes for dual-metric analysis'),
            rec('line', 'possible', 'Dual-line overlay shows parallel trends between two measures'),
            rec('table', 'possible', 'Side-by-side values for detailed correlation inspection'),
          ],
        });
      }
    }
  }

  // ── Ranking Analysis ──
  for (const dim of dimensions.slice(0, 2)) {
    for (const measure of measures.slice(0, 2)) {
      instances.push({
        type: 'ranking',
        title: `Top/Bottom ${dim.name} by ${measure.name}`,
        description: `Rank ${dim.name} categories by their ${measure.name} values to identify leaders and laggards.`,
        fields: { dimension: dim.name, measure: measure.name },
        recommendedCharts: [
          rec('horizontalBar', 'highly-recommended', 'Horizontal bars sorted by value are the definitive ranking visualization'),
          rec('bar', 'highly-recommended', 'Vertical bars with descending sort provide clear ranking hierarchy'),
          rec('treemap', 'recommended', 'Treemaps show relative ranking through proportional area sizing'),
          rec('table', 'recommended', 'Sorted tables with conditional formatting for detailed rank analysis'),
          rec('funnel', 'possible', 'Funnel charts show progressive ranking drop-off between stages'),
        ],
      });
    }
  }

  // ── Flow / Sequential Analysis ──
  if (sequentials.length > 0) {
    for (const seq of sequentials) {
      for (const measure of measures.slice(0, 2)) {
        instances.push({
          type: 'flow',
          title: `${measure.name} Flow through ${seq.name}`,
          description: `Visualize how ${measure.name} progresses through sequential ${seq.name} stages. Identify bottlenecks and drop-offs.`,
          fields: { dimension: seq.name, measure: measure.name },
          recommendedCharts: [
            rec('funnel', 'highly-recommended', 'Funnel charts are purpose-built for showing progressive stage drop-offs'),
            rec('waterfall', 'highly-recommended', 'Waterfall charts show incremental gains/losses through each stage'),
            rec('bar', 'recommended', 'Sequential bar charts show volume at each stage'),
            rec('line', 'possible', 'Line charts track continuous flow metrics between stages'),
          ],
        });
      }
    }
  }

  // ── Performance / KPI Analysis ──
  for (const measure of measures.slice(0, 4)) {
    instances.push({
      type: 'performance',
      title: `${measure.name} Performance Metric`,
      description: `Monitor ${measure.name} as a key performance indicator. Track against targets, thresholds, and historical benchmarks.`,
      fields: { measure: measure.name },
      recommendedCharts: [
        rec('kpi', 'highly-recommended', 'KPI cards provide instant, at-a-glance metric visibility with trend indicators'),
        rec('gauge', 'highly-recommended', 'Gauge charts show current performance against defined targets and thresholds'),
        rec('sparkline', 'highly-recommended', 'Sparklines show recent performance trend in compact form'),
        rec('bar', 'possible', 'Bar chart comparing current vs. target values'),
      ],
    });
  }

  // ── Deviation Analysis (measure with potential pos/neg) ──
  for (const measure of measures.slice(0, 2)) {
    const values = data.map(d => Number(d[measure.name]) || 0);
    const hasNegative = values.some(v => v < 0);
    const hasHighVariance = values.length > 1 && (Math.max(...values) / (Math.min(...values.filter(v => v > 0)) || 1)) > 10;

    if (hasNegative || hasHighVariance) {
      instances.push({
        type: 'deviation',
        title: `${measure.name} Deviation Analysis`,
        description: `Analyze variance and deviations in ${measure.name}. ${hasNegative ? 'Contains positive and negative values.' : 'High variance detected.'} Useful for identifying outliers and anomalies.`,
        fields: { measure: measure.name, dimension: dimensions[0]?.name },
        recommendedCharts: [
          rec('waterfall', 'highly-recommended', 'Waterfall charts clearly show positive and negative deviations from a baseline'),
          rec('bar', 'highly-recommended', 'Diverging bar charts highlight above/below average performance'),
          rec('combo', 'recommended', 'Overlay actual vs. expected with deviation bands'),
          rec('scatter', 'recommended', 'Scatter plots identify statistical outliers visually'),
          rec('kpi', 'possible', 'Summary KPI showing deviation percentage from target'),
        ],
      });
    }
  }

  return instances;
}

// ─── Chatbot Response Builder ───────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: AnalysisInstance[];
  timestamp: Date;
}

export function generateBotResponse(
  query: string,
  columns: DataColumn[],
  data: Record<string, unknown>[]
): { content: string; recommendations: AnalysisInstance[] } {
  const lower = query.toLowerCase();
  const allAnalyses = analyzeDataset(columns, data);

  // Filter based on user query
  let filtered = allAnalyses;
  let contextNote = '';

  if (lower.includes('trend') || lower.includes('time') || lower.includes('over time') || lower.includes('growth')) {
    filtered = allAnalyses.filter(a => a.type === 'trend');
    contextNote = '📈 **Trend Analysis** — Tracking metrics over time reveals patterns, seasonality, and growth trajectories.';
  } else if (lower.includes('compare') || lower.includes('comparison') || lower.includes('versus') || lower.includes('vs')) {
    filtered = allAnalyses.filter(a => a.type === 'comparison');
    contextNote = '📊 **Comparison Analysis** — Side-by-side evaluation helps identify top performers and gaps.';
  } else if (lower.includes('composition') || lower.includes('breakdown') || lower.includes('proportion') || lower.includes('share')) {
    filtered = allAnalyses.filter(a => a.type === 'composition' || a.type === 'part-to-whole');
    contextNote = '🧩 **Composition Analysis** — Understanding part-to-whole relationships reveals structural insights.';
  } else if (lower.includes('distribution') || lower.includes('spread') || lower.includes('range') || lower.includes('histogram')) {
    filtered = allAnalyses.filter(a => a.type === 'distribution');
    contextNote = '📐 **Distribution Analysis** — Examining value spread reveals concentration, skewness, and outliers.';
  } else if (lower.includes('correlat') || lower.includes('relationship') || lower.includes('scatter')) {
    filtered = allAnalyses.filter(a => a.type === 'relationship');
    contextNote = '🔗 **Relationship Analysis** — Exploring variable correlations uncovers hidden dependencies.';
  } else if (lower.includes('rank') || lower.includes('top') || lower.includes('bottom') || lower.includes('best') || lower.includes('worst')) {
    filtered = allAnalyses.filter(a => a.type === 'ranking');
    contextNote = '🏆 **Ranking Analysis** — Ordering entities by performance reveals leaders and laggards.';
  } else if (lower.includes('kpi') || lower.includes('metric') || lower.includes('performance') || lower.includes('monitor')) {
    filtered = allAnalyses.filter(a => a.type === 'performance');
    contextNote = '🎯 **Performance Monitoring** — Real-time KPI tracking for operational awareness.';
  } else if (lower.includes('funnel') || lower.includes('flow') || lower.includes('pipeline') || lower.includes('stage')) {
    filtered = allAnalyses.filter(a => a.type === 'flow');
    contextNote = '🔄 **Flow Analysis** — Sequential stage tracking identifies bottlenecks and conversion rates.';
  } else if (lower.includes('deviat') || lower.includes('outlier') || lower.includes('anomal') || lower.includes('variance')) {
    filtered = allAnalyses.filter(a => a.type === 'deviation');
    contextNote = '⚡ **Deviation Analysis** — Variance detection highlights anomalies requiring investigation.';
  } else if (lower.includes('all') || lower.includes('everything') || lower.includes('what can') || lower.includes('suggest') || lower.includes('recommend') || lower.includes('help')) {
    contextNote = '🔍 **Full Dataset Analysis** — Here are all the analytical opportunities detected in your data.';
  }

  // If no specific match, check for field names
  if (filtered.length === allAnalyses.length && !contextNote) {
    const fieldMatch = columns.find(c => lower.includes(c.name.toLowerCase()));
    if (fieldMatch) {
      filtered = allAnalyses.filter(a =>
        a.fields.dimension === fieldMatch.name || a.fields.measure === fieldMatch.name || a.fields.secondary === fieldMatch.name
      );
      contextNote = `📋 **Analysis for "${fieldMatch.name}"** — Here are the best visualizations for this field.`;
    }
  }

  // Limit results
  const results = filtered.slice(0, 6);
  const totalCount = filtered.length;

  let content = contextNote || '🤖 **Analytics Advisor** — Based on your dataset structure, here are my recommendations.';
  content += `\n\nI identified **${totalCount} analytical opportunit${totalCount === 1 ? 'y' : 'ies'}** for your data.`;
  if (totalCount > 6) content += ` Showing the top 6 most relevant.`;
  content += `\n\n💡 *Try asking about specific analysis types: trends, comparisons, distributions, rankings, correlations, KPIs, or mention a specific field name.*`;

  return { content, recommendations: results };
}

// ─── Quick Suggestion Prompts ───────────────────────────────────────

export function getQuickPrompts(columns: DataColumn[]): string[] {
  const prompts: string[] = [];
  const numericCols = columns.filter(c => c.type === 'number');
  const stringCols = columns.filter(c => c.type === 'string');
  const dateCols = columns.filter(c => c.type === 'date' || DATE_KEYWORDS.some(k => c.name.toLowerCase().includes(k)));

  if (dateCols.length > 0 && numericCols.length > 0) {
    prompts.push(`Show me ${numericCols[0].name} trends over time`);
  }
  if (stringCols.length > 0 && numericCols.length > 0) {
    prompts.push(`Compare ${numericCols[0].name} across ${stringCols[0].name}`);
    prompts.push(`Rank ${stringCols[0].name} by ${numericCols[0].name}`);
  }
  if (numericCols.length >= 2) {
    prompts.push(`Show correlation between ${numericCols[0].name} and ${numericCols[1].name}`);
  }
  prompts.push('What KPIs should I track?');
  prompts.push('Suggest all possible analyses');

  return prompts.slice(0, 6);
}
