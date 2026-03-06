import { DataColumn } from '@/types/dashboard';
import { analyzeDatasetFields } from '@/lib/fieldMapping';

// ─── Schema Model ───────────────────────────────────────────────────

export interface DataModelSchema {
  datasetId: string;
  dimensions: string[];
  measures: string[];
  dateFields: string[];
  categoricalFields: string[];
}

// Schema cache
const schemaCache = new Map<string, DataModelSchema>();

export function getOrBuildSchema(datasetId: string, columns: DataColumn[], data: Record<string, unknown>[] = []): DataModelSchema {
  if (schemaCache.has(datasetId)) return schemaCache.get(datasetId)!;
  const analysis = analyzeDatasetFields(columns, data);
  const schema: DataModelSchema = {
    datasetId,
    dimensions: analysis.dimensionFields,
    measures: analysis.measureFields,
    dateFields: analysis.dateFields,
    categoricalFields: analysis.categoricalFields,
  };
  schemaCache.set(datasetId, schema);
  return schema;
}

export function clearSchemaCache(datasetId?: string) {
  if (datasetId) schemaCache.delete(datasetId);
  else schemaCache.clear();
}

// ─── Aggregation Engine ─────────────────────────────────────────────

export type AggType = 'sum' | 'avg' | 'count' | 'min' | 'max';

export function aggregateData(
  data: Record<string, unknown>[],
  groupByField: string,
  measureField: string,
  aggType: AggType = 'sum'
): Record<string, unknown>[] {
  const groups = new Map<string, number[]>();
  for (const row of data) {
    const key = String(row[groupByField] ?? 'Unknown');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(Number(row[measureField]) || 0);
  }

  const result: Record<string, unknown>[] = [];
  for (const [key, values] of groups) {
    let agg: number;
    switch (aggType) {
      case 'sum': agg = values.reduce((a, b) => a + b, 0); break;
      case 'avg': agg = values.reduce((a, b) => a + b, 0) / values.length; break;
      case 'count': agg = values.length; break;
      case 'min': agg = Math.min(...values); break;
      case 'max': agg = Math.max(...values); break;
      default: agg = values.reduce((a, b) => a + b, 0);
    }
    result.push({ [groupByField]: key, [measureField]: Math.round(agg * 100) / 100 });
  }
  return result;
}

// Detect default aggregation type
function detectDefaultAgg(measureField: string): AggType {
  const lower = measureField.toLowerCase();
  if (['count', 'employees', 'users', 'patients', 'orders', 'units'].some(k => lower.includes(k))) return 'count';
  if (['avg', 'average', 'rate', 'percentage', 'satisfaction'].some(k => lower.includes(k))) return 'avg';
  return 'sum';
}

// ─── Smart Category Limit ───────────────────────────────────────────

export function limitCategories(
  data: Record<string, unknown>[],
  labelField: string,
  valueField: string,
  maxCategories: number
): Record<string, unknown>[] {
  if (data.length <= maxCategories) return data;
  const sorted = [...data].sort((a, b) => (Number(b[valueField]) || 0) - (Number(a[valueField]) || 0));
  const top = sorted.slice(0, maxCategories - 1);
  const rest = sorted.slice(maxCategories - 1);
  const othersValue = rest.reduce((sum, r) => sum + (Number(r[valueField]) || 0), 0);
  return [...top, { [labelField]: 'Others', [valueField]: Math.round(othersValue * 100) / 100 }];
}

// ─── Auto Aggregate (main entry point for charts) ───────────────────

const aggregationCache = new Map<string, Record<string, unknown>[]>();

export function clearAggregationCache() {
  aggregationCache.clear();
}

export interface AutoAggregateOptions {
  chartType: string;
  groupField: string;
  measureField: string;
  aggType?: AggType;
}

export function autoAggregate(
  data: Record<string, unknown>[],
  options: AutoAggregateOptions
): Record<string, unknown>[] {
  const { chartType, groupField, measureField } = options;
  if (!groupField || !measureField) return data;

  // Small datasets don't need aggregation
  if (data.length <= 50) return data;

  const aggType = options.aggType || detectDefaultAgg(measureField);
  const cacheKey = `${groupField}:${measureField}:${aggType}:${data.length}`;
  if (aggregationCache.has(cacheKey)) return aggregationCache.get(cacheKey)!;

  let result = aggregateData(data, groupField, measureField, aggType);

  // Apply category limits
  const maxCats = ['pie', 'donut'].includes(chartType) ? 8 : 12;
  result = limitCategories(result, groupField, measureField, maxCats);

  aggregationCache.set(cacheKey, result);
  return result;
}

// ─── Filter Engine ──────────────────────────────────────────────────

export function applyFilterState(
  data: Record<string, unknown>[],
  filterState: Record<string, unknown>
): Record<string, unknown>[] {
  if (!filterState || Object.keys(filterState).length === 0) return data;
  return data.filter(row =>
    Object.entries(filterState).every(([field, value]) =>
      row[field] === undefined ? true : row[field] === value
    )
  );
}

// ─── Data Preview Pagination ────────────────────────────────────────

export function getPreviewPage(
  data: Record<string, unknown>[],
  page: number,
  pageSize: number = 200
): { rows: Record<string, unknown>[]; totalPages: number; totalRows: number } {
  const totalRows = data.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  return {
    rows: data.slice(start, start + pageSize),
    totalPages,
    totalRows,
  };
}

// ─── Drill Hierarchy Detection ──────────────────────────────────────

export function detectDrillHierarchy(columns: DataColumn[]): string[][] {
  const hierarchies: string[][] = [];
  const names = columns.map(c => c.name.toLowerCase());

  // Date hierarchy
  const dateOrder = ['year', 'quarter', 'month', 'day'];
  const dateHierarchy = dateOrder.filter(d => names.some(n => n.includes(d)));
  if (dateHierarchy.length >= 2) {
    hierarchies.push(dateHierarchy.map(d => columns.find(c => c.name.toLowerCase().includes(d))!.name));
  }

  // Geo hierarchy
  const geoOrder = ['region', 'country', 'state', 'city'];
  const geoHierarchy = geoOrder.filter(g => names.some(n => n.includes(g)));
  if (geoHierarchy.length >= 2) {
    hierarchies.push(geoHierarchy.map(g => columns.find(c => c.name.toLowerCase().includes(g))!.name));
  }

  // Org hierarchy
  const orgOrder = ['department', 'team', 'employee'];
  const orgHierarchy = orgOrder.filter(o => names.some(n => n.includes(o)));
  if (orgHierarchy.length >= 2) {
    hierarchies.push(orgHierarchy.map(o => columns.find(c => c.name.toLowerCase().includes(o))!.name));
  }

  return hierarchies;
}
