import { useState } from 'react';
import { Code2, Copy, Check, ChevronRight, Cpu, Brain, AlertTriangle, HardDrive } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface SourceModule {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tech: string[];
  filePath: string;
  code: string;
}

const modules: SourceModule[] = [
  {
    id: 'field-mapping',
    title: 'Smart Field Mapping Engine',
    icon: Cpu,
    description:
      'Heuristic engine that classifies dataset columns into qualitative (labels) vs quantitative (measures). Uses keyword dictionaries, data sampling, and a 60% numeric threshold to prevent numeric fields like "year" or "salary" from appearing as chart labels.',
    tech: ['Keyword Dictionary', 'Data Sampling', 'Semantic Grouping', 'Auto-Rotation'],
    filePath: 'src/lib/fieldMapping.ts',
    code: `// ── Smart Field Mapping Engine ──────────────────────────────────
// Classifies dataset fields into qualitative vs quantitative categories.

// Quantitative exclusions — fields that look categorical but are numeric
const quantitativeExclusions = [
  'year', 'age', 'salary', 'price', 'cost', 'amount', 'total',
  'revenue', 'profit', 'budget', 'spend', 'score', 'rate', 'count',
  'units', 'orders', 'value', 'index', 'temperature', 'humidity',
  'percentage', 'growth', 'target', 'weight', 'height', 'quantity',
];

// Qualitative primaries — fields that ARE good chart labels
const qualitativePrimary = [
  'department', 'region', 'country', 'city', 'name', 'category',
  'type', 'status', 'product', 'channel', 'segment', 'team',
  'project', 'brand', 'vendor', 'employee', 'division',
  'location', 'store', 'branch', 'campus', 'facility',
];

function isQualitativeField(
  fieldName: string,
  colType: string,
  data?: Record<string, unknown>[]
): boolean {
  const lower = fieldName.toLowerCase();

  // Numeric columns are never qualitative labels
  if (colType === 'number') return false;

  // Date fields are not qualitative labels
  const dateKeywords = ['date', 'time', 'day', 'month', 'year'];
  if (dateKeywords.some(kw => lower.includes(kw))) return false;

  // Check quantitative exclusion list
  for (const kw of quantitativeExclusions) {
    if (lower === kw || lower.endsWith(\`_\${kw}\`)) return false;
  }

  // Explicit qualitative match
  if (qualitativePrimary.some(kw => lower.includes(kw))) return true;

  // Data-driven heuristic: if >60% of sample values parse as numbers,
  // it's not qualitative
  if (data && data.length > 0 && colType === 'string') {
    const sample = data.slice(0, 10).map(r => r[fieldName]).filter(Boolean);
    const numericCount = sample.filter(v => !isNaN(Number(v))).length;
    if (sample.length > 0 && numericCount / sample.length > 0.6) {
      return false;
    }
  }

  return colType === 'string';
}

// ── Auto-configure with UNIQUE fields per chart ─────────────────
// Each call rotates through measures so no two charts reuse the same
// measure + aggregation combination.

let _usedMeasureIndex = 0;
const AGG_ROTATION = ['sum', 'avg', 'count', 'max', 'min'];

function getNextMeasure(measures: string[]): string {
  const field = measures[_usedMeasureIndex % measures.length];
  _usedMeasureIndex++;
  return field;
}

// Semantic field remapping when switching datasets
function findSemanticMatch(oldField: string, newColumns): string | null {
  const semanticGroups = {
    category: ['department', 'category', 'type', 'segment', 'product'],
    revenue:  ['revenue', 'sales', 'amount', 'total', 'profit'],
    count:    ['count', 'orders', 'units', 'employees', 'users'],
    region:   ['region', 'country', 'city', 'location', 'area'],
  };

  let oldGroup = null;
  for (const [group, keywords] of Object.entries(semanticGroups)) {
    if (keywords.some(kw => oldField.toLowerCase().includes(kw))) {
      oldGroup = group;
      break;
    }
  }
  if (!oldGroup) return null;

  for (const col of newColumns) {
    if (semanticGroups[oldGroup].some(kw =>
      col.name.toLowerCase().includes(kw)
    )) {
      return col.name;
    }
  }
  return null;
}`,
  },
  {
    id: 'nlp-query',
    title: 'NLP Intent Classification',
    icon: Brain,
    description:
      'Rule-based natural language query parser that converts plain English questions into chart configurations. Supports aggregation detection, chart type inference, top-N queries, time filters, and comparative (vs) queries — all without external AI.',
    tech: ['Regex Patterns', 'Intent Matching', 'Time Filters', 'Top-N Detection'],
    filePath: 'src/lib/queryParser.ts',
    code: `// ── NLP Intent Classification (Q&A Query Parser) ──────────────
// Converts natural language into chart specifications.
// Example: "Sum of revenue by department bar chart"

interface ParsedQuery {
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  measure: string;
  dimension: string;
  chartType: string;
  topN?: number;
  sortDirection?: 'asc' | 'desc';
  timeFilter?: { field: string; period: string };
  compareFields?: string[];
  isValid: boolean;
}

// ── Aggregation Intent Detection ────────────────────────────────
const AGGREGATION_MAP = {
  sum: 'sum', total: 'sum',
  average: 'avg', avg: 'avg', mean: 'avg',
  count: 'count', number: 'count',
  minimum: 'min', min: 'min',
  maximum: 'max', max: 'max',
};

// ── Chart Type Intent ───────────────────────────────────────────
const CHART_TYPE_MAP = {
  'bar': 'bar', 'bar chart': 'bar', 'column': 'bar',
  'line': 'line', 'trend': 'line',
  'pie': 'pie', 'donut': 'donut',
  'area': 'area', 'scatter': 'scatter',
  'radar': 'radar', 'treemap': 'treemap',
  'funnel': 'funnel', 'waterfall': 'waterfall',
  'gauge': 'gauge', 'horizontal bar': 'horizontalBar',
  'stacked bar': 'stackedBar', 'combo': 'combo',
};

// ── Time Filter Patterns ────────────────────────────────────────
const TIME_PATTERNS = [
  { regex: /last\\s+(\\d+)\\s+months?/i,  period: 'months'  },
  { regex: /last\\s+(\\d+)\\s+years?/i,   period: 'years'   },
  { regex: /last\\s+(\\d+)\\s+weeks?/i,   period: 'weeks'   },
  { regex: /this\\s+year/i,              period: 'thisYear' },
  { regex: /this\\s+quarter/i,           period: 'thisQuarter' },
  { regex: /ytd|year\\s+to\\s+date/i,    period: 'ytd'      },
  { regex: /q([1-4])\\s+vs\\s+q([1-4])/i, period: 'quarterCompare' },
];

// ── Top-N Detection ─────────────────────────────────────────────
function detectTopN(query: string) {
  const topMatch = query.match(/top\\s+(\\d+)/);
  const bottomMatch = query.match(/bottom\\s+(\\d+)/);
  if (topMatch)    return { n: parseInt(topMatch[1]),    dir: 'desc' };
  if (bottomMatch) return { n: parseInt(bottomMatch[1]), dir: 'asc'  };
  return null;
}

// ── Main Parser ─────────────────────────────────────────────────
function parseQuery(query: string, columns): ParsedQuery {
  const lower = query.toLowerCase().trim();

  // 1. Detect aggregation from first word
  let aggregation = 'sum';
  for (const [keyword, agg] of Object.entries(AGGREGATION_MAP)) {
    if (lower.startsWith(keyword + ' ')) { aggregation = agg; break; }
  }

  // 2. Detect chart type from end of string
  let chartType = 'bar';
  for (const [keyword, type] of Object.entries(CHART_TYPE_MAP)) {
    if (lower.endsWith(keyword)) { chartType = type; break; }
  }

  // 3. Extract "... of MEASURE by DIMENSION ..."
  const ofByMatch = lower.match(
    /(?:of|for)\\s+(.+?)\\s+by\\s+(.+?)(?:\\s+(?:bar|line|pie).*)?$/
  );

  // 4. Time filter detection
  let timeFilter = undefined;
  for (const tp of TIME_PATTERNS) {
    const match = lower.match(tp.regex);
    if (match) { timeFilter = { period: tp.period }; break; }
  }

  // 5. Comparative query: "revenue vs profit"
  const vsMatch = lower.match(/(\\w+)\\s+vs\\.?\\s+(\\w+)/);

  return { aggregation, chartType, /* ... */ isValid: true };
}`,
  },
  {
    id: 'z-score',
    title: 'Z-Score Anomaly Detection',
    icon: AlertTriangle,
    description:
      'Statistical outlier detection using both Z-Score and IQR methods. Includes linear regression forecasting, moving averages, and full summary statistics — all computed locally in the browser with zero cloud dependencies.',
    tech: ['Z-Score', 'IQR Method', 'Linear Regression', 'Moving Average', 'Forecasting'],
    filePath: 'src/lib/statistics.ts',
    code: `// ── Z-Score Anomaly Detection ────────────────────────────────────
// Detects outliers using standard deviation distance from the mean.

interface Outlier {
  index: number;
  value: number;
  zScore: number;
  label?: string;
}

function detectOutliersZScore(
  values: number[],
  threshold: number = 2.0,
  labels?: string[]
): Outlier[] {
  if (values.length < 3) return [];

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  );
  if (stdDev === 0) return [];

  return values
    .map((v, i) => ({
      index: i,
      value: v,
      zScore: Math.abs((v - mean) / stdDev),
      label: labels?.[i],
    }))
    .filter(o => o.zScore > threshold);
}

// ── IQR Outlier Detection ───────────────────────────────────────
function detectOutliersIQR(values: number[]): Outlier[] {
  if (values.length < 4) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;

  return values
    .map((v, i) => ({ index: i, value: v, zScore: 0 }))
    .filter(o => o.value < lower || o.value > upper);
}

// ── Linear Regression & Forecasting ─────────────────────────────
interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  predict: (x: number) => number;
}

function linearRegression(x: number[], y: number[]): RegressionResult {
  const n = x.length;
  const sumX  = x.reduce((a, b) => a + b, 0);
  const sumY  = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0);
  const sumXX = x.reduce((a, xi) => a + xi * xi, 0);

  const slope     = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R-squared (coefficient of determination)
  const meanY = sumY / n;
  const ssRes = y.reduce((a, yi, i) => a + (yi - (slope * x[i] + intercept)) ** 2, 0);
  const ssTot = y.reduce((a, yi) => a + (yi - meanY) ** 2, 0);
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared, predict: (xi) => slope * xi + intercept };
}

// ── Moving Average ──────────────────────────────────────────────
function movingAverage(values: number[], window = 3): number[] {
  return values.map((_, i) => {
    const start = Math.max(0, i - Math.floor(window / 2));
    const end = Math.min(values.length, start + window);
    const slice = values.slice(start, end);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

// ── Summary Statistics ──────────────────────────────────────────
function computeStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const median = n % 2 === 0
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2
    : sorted[Math.floor(n / 2)];
  const stdDev = Math.sqrt(
    sorted.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n
  );
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const skewness = stdDev === 0 ? 0 : (3 * (mean - median)) / stdDev;

  return { mean, median, stdDev, min: sorted[0], max: sorted[n-1],
           q1, q3, iqr: q3 - q1, skewness };
}`,
  },
  {
    id: 'storage-tier',
    title: 'Storage Tier Router',
    icon: HardDrive,
    description:
      'Intelligent storage routing that decides whether to persist datasets in localStorage (small) or IndexedDB (large, >2 MB). Provides a unified API for saving, loading, and clearing datasets regardless of the underlying storage layer.',
    tech: ['IndexedDB', 'localStorage', 'Size Estimation', 'idb-keyval'],
    filePath: 'src/lib/indexedDB.ts',
    code: `// ── Storage Tier Router ──────────────────────────────────────────
// Automatically routes datasets to the correct storage backend
// based on estimated size.

import { get, set, del, keys } from 'idb-keyval';

// Threshold: datasets > 2 MB use IndexedDB, smaller use localStorage
const IDB_THRESHOLD_BYTES = 2 * 1024 * 1024;

// ── Size Estimation ─────────────────────────────────────────────
function estimateDatasetSize(dataset): number {
  try {
    return new Blob([JSON.stringify(dataset.data)]).size;
  } catch {
    return dataset.data.length * 200; // rough estimate per row
  }
}

// ── IndexedDB Layer ─────────────────────────────────────────────
const DS_PREFIX = 'dataset:';

async function saveDatasetToIDB(dataset): Promise<void> {
  await set(\`\${DS_PREFIX}\${dataset.id}\`, dataset);
}

async function getDatasetFromIDB(id: string) {
  return await get(\`\${DS_PREFIX}\${id}\`);
}

async function deleteDatasetFromIDB(id: string): Promise<void> {
  await del(\`\${DS_PREFIX}\${id}\`);
}

async function getAllDatasetsFromIDB() {
  const allKeys = await keys();
  const dsKeys = allKeys.filter(k => String(k).startsWith(DS_PREFIX));
  const datasets = [];
  for (const key of dsKeys) {
    const ds = await get(key);
    if (ds) datasets.push(ds);
  }
  return datasets;
}

// ── Unified Storage API ─────────────────────────────────────────
// The tier router checks the size and picks the right backend.

async function saveDataset(dataset) {
  const size = estimateDatasetSize(dataset);
  if (size > IDB_THRESHOLD_BYTES) {
    // Large dataset → IndexedDB (no localStorage quota issues)
    await saveDatasetToIDB(dataset);
    console.log(\`[StorageTier] Saved to IndexedDB (\${(size/1024/1024).toFixed(1)} MB)\`);
  } else {
    // Small dataset → localStorage (faster reads, synchronous)
    try {
      localStorage.setItem(
        \`visorybi-ds:\${dataset.id}\`,
        JSON.stringify(dataset)
      );
      console.log(\`[StorageTier] Saved to localStorage (\${(size/1024).toFixed(1)} KB)\`);
    } catch (e) {
      // localStorage full — fallback to IndexedDB
      await saveDatasetToIDB(dataset);
      console.warn('[StorageTier] localStorage full, fell back to IndexedDB');
    }
  }
}

async function loadDataset(id: string) {
  // Check localStorage first (faster)
  const local = localStorage.getItem(\`visorybi-ds:\${id}\`);
  if (local) return JSON.parse(local);
  // Then check IndexedDB
  return await getDatasetFromIDB(id);
}

async function deleteDataset(id: string) {
  localStorage.removeItem(\`visorybi-ds:\${id}\`);
  await deleteDatasetFromIDB(id);
}`,
  },
];

export default function SourceCodePage() {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const [copied, setCopied] = useState(false);

  const current = modules.find(m => m.id === activeModule) || modules[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    toast({ title: 'Code copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" /> Source Code Reference
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Core algorithmic engines powering VisoryBI — all running locally, zero cloud dependencies
          </p>
        </div>

        {/* Module Selector */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map(mod => {
            const isActive = mod.id === activeModule;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`text-left rounded-xl p-4 border transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <mod.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {mod.title}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{mod.description.slice(0, 80)}…</p>
              </button>
            );
          })}
        </div>

        {/* Module Detail */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <current.icon className="h-5 w-5 text-primary" />
                {current.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{current.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {current.tech.map(t => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                <ChevronRight className="h-3 w-3" /> {current.filePath}
              </span>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Code Block */}
          <div className="relative rounded-lg bg-[hsl(var(--muted))] border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
              <span className="text-[11px] font-mono text-muted-foreground">{current.filePath}</span>
              <span className="text-[10px] text-muted-foreground">TypeScript</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed max-h-[500px] overflow-y-auto">
              <code className="text-foreground font-mono text-xs whitespace-pre">
                {current.code}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
