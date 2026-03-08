import { DataColumn } from '@/types/dashboard';

export interface FieldAnalysis {
  dateFields: string[];
  numericFields: string[];
  categoricalFields: string[];
  measureFields: string[];
  dimensionFields: string[];
  qualitativeFields: string[];  // True categorical labels (department, name, region)
  quantitativeFields: string[]; // Numeric measures + numeric-like fields (age, year, salary)
  suggestedXAxis: string | null;
  suggestedYAxis: string | null;
  suggestedLabelField: string | null;
  suggestedValueField: string | null;
}

// Keywords that suggest a field is a date
const dateKeywords = ['date', 'time', 'day', 'month', 'year', 'quarter', 'week', 'created', 'updated', 'period'];

// Keywords that suggest a field is a measure (aggregatable)
const measureKeywords = ['revenue', 'sales', 'amount', 'total', 'sum', 'count', 'cost', 'price', 'profit', 
  'budget', 'spent', 'value', 'units', 'orders', 'rate', 'percentage', 'score', 'index', 'growth',
  'impressions', 'clicks', 'conversions', 'spend', 'roi', 'employees', 'patients', 'users',
  'views', 'visitors', 'bounce', 'avg', 'salary', 'satisfaction', 'training', 'turnover',
  'efficiency', 'defect', 'downtime', 'energy', 'temperature', 'humidity', 'precipitation',
  'wind', 'uv', 'market_share', 'offices', 'progress', 'team_size', 'days_remaining',
  'current', 'target', 'previous', 'variance', 'completion', 'tasks', 'stock', 'returns', 'rating'];

// Keywords that suggest a field is a dimension (categorical)
const dimensionKeywords = ['name', 'category', 'type', 'status', 'region', 'country', 'department', 
  'product', 'channel', 'segment', 'group', 'team', 'project', 'condition', 'line', 'page', 'account',
  'city', 'metric', 'expense_type', 'task_type', 'quarter'];

// ── Fields that are NUMERIC but should NOT be used as the primary label/x-axis ──
// These look like dimensions but are quantitative in nature
const quantitativeExclusions = [
  'year', 'age', 'salary', 'price', 'cost', 'amount', 'total', 'revenue', 'profit',
  'budget', 'spend', 'score', 'rate', 'count', 'units', 'orders', 'value', 'index',
  'temperature', 'humidity', 'wind', 'uv', 'id', 'zip', 'code', 'number', 'num',
  'percentage', 'growth', 'target', 'current', 'previous', 'days', 'hours', 'minutes',
  'weight', 'height', 'size', 'quantity', 'distance', 'latitude', 'longitude',
  'impressions', 'clicks', 'conversions', 'roi', 'satisfaction', 'efficiency',
  'stock', 'returns', 'rating', 'capacity', 'volume', 'duration',
];

// ── Fields that ARE good primary labels (qualitative categorical) ──
const qualitativePrimary = [
  'department', 'region', 'country', 'city', 'state', 'name', 'category', 'type',
  'status', 'product', 'channel', 'segment', 'group', 'team', 'project', 'brand',
  'vendor', 'supplier', 'customer', 'employee', 'manager', 'division', 'unit',
  'industry', 'sector', 'condition', 'grade', 'level', 'tier', 'class',
  'location', 'store', 'branch', 'office', 'campus', 'facility',
  'expense_type', 'task_type', 'metric', 'phase', 'stage', 'priority',
];

/**
 * Checks if a field name is qualitative (good for primary labels/x-axis).
 * Rejects numeric-like fields such as year, age, salary, etc.
 */
function isQualitativeField(fieldName: string, colType: string, data?: Record<string, unknown>[]): boolean {
  const lower = fieldName.toLowerCase();
  
  // Numeric type columns are never qualitative labels
  if (colType === 'number') return false;
  
  // Date fields are not qualitative labels
  if (dateKeywords.some(kw => lower.includes(kw))) return false;
  
  // Check against quantitative exclusion list (exact match or compound match)
  for (const kw of quantitativeExclusions) {
    if (lower === kw || lower === `${kw}s` || lower.endsWith(`_${kw}`) || lower.startsWith(`${kw}_`)) return false;
  }
  
  // Explicit qualitative match
  if (qualitativePrimary.some(kw => lower.includes(kw))) return true;
  
  // If we have data, check if values look like numbers or dates
  if (data && data.length > 0 && colType === 'string') {
    const sample = data.slice(0, 10).map(r => r[fieldName]).filter(Boolean);
    const numericCount = sample.filter(v => !isNaN(Number(v))).length;
    // If >60% of values are parseable numbers, it's not qualitative
    if (sample.length > 0 && numericCount / sample.length > 0.6) return false;
    
    // Check if values look like dates
    const dateCount = sample.filter(v => {
      const s = String(v);
      return /^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(s) || /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(s);
    }).length;
    if (sample.length > 0 && dateCount / sample.length > 0.6) return false;
  }
  
  // String type fields that aren't excluded are considered qualitative
  if (colType === 'string') return true;
  
  return false;
}

export function analyzeDatasetFields(columns: DataColumn[], data: Record<string, unknown>[] = []): FieldAnalysis {
  const dateFields: string[] = [];
  const numericFields: string[] = [];
  const categoricalFields: string[] = [];
  const measureFields: string[] = [];
  const dimensionFields: string[] = [];
  const qualitativeFields: string[] = [];
  const quantitativeFields: string[] = [];

  columns.forEach(col => {
    const lowerName = col.name.toLowerCase();
    
    // Check if it's a date field
    const isDate = col.type === 'date' || dateKeywords.some(kw => lowerName.includes(kw));
    if (isDate && col.type !== 'number') {
      dateFields.push(col.name);
    }

    // Numeric fields
    if (col.type === 'number') {
      numericFields.push(col.name);
      quantitativeFields.push(col.name);
      measureFields.push(col.name);
    }

    // Categorical/dimension fields
    if (col.type === 'string') {
      categoricalFields.push(col.name);
      
      if (dimensionKeywords.some(kw => lowerName.includes(kw)) || col.type === 'string') {
        dimensionFields.push(col.name);
      }
    }

    // Qualitative classification (for primary labels)
    if (isQualitativeField(col.name, col.type, data)) {
      qualitativeFields.push(col.name);
    }
  });

  // If no qualitative fields found, do a deeper scan of string columns
  // to find the one with the most distinct non-numeric values
  if (qualitativeFields.length === 0 && data.length > 0) {
    let bestField: string | null = null;
    let bestDistinctCount = 0;
    
    for (const col of columns) {
      if (col.type !== 'string') continue;
      const vals = new Set(data.slice(0, 50).map(r => String(r[col.name] ?? '')));
      const nonNumericVals = [...vals].filter(v => v && isNaN(Number(v)));
      if (nonNumericVals.length > bestDistinctCount) {
        bestDistinctCount = nonNumericVals.length;
        bestField = col.name;
      }
    }
    if (bestField) qualitativeFields.push(bestField);
  }

  // Primary label: MUST be qualitative (department, region, name, etc.)
  // Never use year, age, salary, date fields as primary label
  const suggestedLabelField = qualitativeFields[0] || dimensionFields[0] || categoricalFields[0] || null;
  
  // X-Axis: prefer qualitative for category charts, date for trend charts
  const suggestedXAxis = qualitativeFields[0] || dateFields[0] || dimensionFields[0] || null;
  
  // Y-Axis: Prefer measure fields
  const suggestedYAxis = measureFields[0] || numericFields[0] || null;
  
  // Value Field: For pie/donut/gauge
  const suggestedValueField = measureFields[0] || numericFields[0] || null;

  return {
    dateFields,
    numericFields,
    categoricalFields,
    measureFields,
    dimensionFields,
    qualitativeFields,
    quantitativeFields,
    suggestedXAxis,
    suggestedYAxis,
    suggestedLabelField,
    suggestedValueField,
  };
}

// ── Unique Measure Tracker ──────────────────────────────────────────
// Tracks which measures have been used so each chart gets a different one

let _usedMeasureIndex = 0;
let _usedAggIndex = 0;

export function resetFieldTracker() {
  _usedMeasureIndex = 0;
  _usedAggIndex = 0;
}

const AGG_ROTATION: Array<'sum' | 'avg' | 'count' | 'max' | 'min'> = ['sum', 'avg', 'count', 'max', 'min'];

function getNextMeasure(measures: string[]): string {
  if (measures.length === 0) return '';
  const field = measures[_usedMeasureIndex % measures.length];
  _usedMeasureIndex++;
  return field;
}

function getNextAggregation(): 'sum' | 'avg' | 'count' | 'max' | 'min' {
  const agg = AGG_ROTATION[_usedAggIndex % AGG_ROTATION.length];
  _usedAggIndex++;
  return agg;
}

// ── Smart aggregation based on field semantics ──
function getSmartAggregation(fieldName: string): 'sum' | 'avg' | 'count' | 'max' | 'min' {
  const lower = fieldName.toLowerCase();
  if (['count', 'employees', 'users', 'patients', 'orders', 'units', 'tasks'].some(k => lower.includes(k))) return 'count';
  if (['avg', 'average', 'rate', 'percentage', 'satisfaction', 'score', 'efficiency', 'rating'].some(k => lower.includes(k))) return 'avg';
  if (['max', 'peak', 'highest', 'top'].some(k => lower.includes(k))) return 'max';
  if (['min', 'lowest', 'minimum'].some(k => lower.includes(k))) return 'min';
  return 'sum';
}

// Remap widget fields when dataset changes
export function remapWidgetFields(
  currentConfig: Record<string, unknown>,
  oldColumns: DataColumn[],
  newColumns: DataColumn[],
  newData: Record<string, unknown>[] = []
): Record<string, unknown> {
  const analysis = analyzeDatasetFields(newColumns, newData);
  const updatedConfig = { ...currentConfig };
  const newColumnNames = new Set(newColumns.map(c => c.name));

  const findEquivalentField = (oldField: string | undefined, fieldType: 'dimension' | 'measure' | 'date' | 'any'): string | null => {
    if (!oldField) return null;
    if (newColumnNames.has(oldField)) return oldField;
    
    const lowerOldField = oldField.toLowerCase();
    const similarField = newColumns.find(c => 
      c.name.toLowerCase().includes(lowerOldField) || 
      lowerOldField.includes(c.name.toLowerCase())
    );
    if (similarField) return similarField.name;
    
    const semanticMatch = findSemanticMatch(oldField, newColumns);
    if (semanticMatch) return semanticMatch;
    
    switch (fieldType) {
      case 'dimension':
        return analysis.qualitativeFields[0] || analysis.suggestedLabelField;
      case 'measure':
        return analysis.suggestedValueField;
      case 'date':
        return analysis.dateFields[0] || analysis.suggestedXAxis;
      default:
        return analysis.suggestedXAxis;
    }
  };

  if ('xAxis' in updatedConfig) {
    const oldField = updatedConfig.xAxis as string | undefined;
    const isDateField = oldField && dateKeywords.some(kw => oldField.toLowerCase().includes(kw));
    updatedConfig.xAxis = findEquivalentField(oldField, isDateField ? 'date' : 'dimension');
  }
  
  if ('yAxis' in updatedConfig) {
    updatedConfig.yAxis = findEquivalentField(updatedConfig.yAxis as string | undefined, 'measure');
  }
  
  if ('labelField' in updatedConfig) {
    updatedConfig.labelField = findEquivalentField(updatedConfig.labelField as string | undefined, 'dimension');
  }
  
  if ('valueField' in updatedConfig) {
    updatedConfig.valueField = findEquivalentField(updatedConfig.valueField as string | undefined, 'measure');
  }

  return updatedConfig;
}

function findSemanticMatch(oldField: string, newColumns: DataColumn[]): string | null {
  const lowerOld = oldField.toLowerCase();
  
  const semanticGroups: Record<string, string[]> = {
    'category': ['department', 'category', 'type', 'segment', 'group', 'product', 'channel'],
    'revenue': ['revenue', 'sales', 'amount', 'total', 'value', 'profit'],
    'count': ['count', 'orders', 'units', 'quantity', 'employees', 'users', 'patients'],
    'rate': ['rate', 'percentage', 'ratio', 'growth', 'efficiency'],
    'name': ['name', 'title', 'label', 'description'],
    'date': ['date', 'time', 'period', 'month', 'year', 'quarter', 'week'],
    'region': ['region', 'country', 'city', 'location', 'area'],
  };

  let oldGroup: string | null = null;
  for (const [group, keywords] of Object.entries(semanticGroups)) {
    if (keywords.some(kw => lowerOld.includes(kw))) {
      oldGroup = group;
      break;
    }
  }

  if (!oldGroup) return null;

  const groupKeywords = semanticGroups[oldGroup];
  for (const col of newColumns) {
    const lowerName = col.name.toLowerCase();
    if (groupKeywords.some(kw => lowerName.includes(kw))) {
      return col.name;
    }
  }

  return null;
}

// ── Auto-configure with UNIQUE fields per chart ─────────────────────
// Each call rotates through available measures so no two charts use
// the same measure+aggregation combination.

export function autoConfigureWidget(
  chartType: string,
  columns: DataColumn[],
  data: Record<string, unknown>[] = []
): Record<string, unknown> {
  const analysis = analyzeDatasetFields(columns, data);
  const baseConfig: Record<string, unknown> = {};

  // Primary label is always qualitative (department, region, name — never year, age, salary)
  const primaryLabel = analysis.qualitativeFields[0] || analysis.dimensionFields[0] || analysis.categoricalFields[0] || '';
  const measures = analysis.measureFields.length > 0 ? analysis.measureFields : analysis.numericFields;

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
    case 'stackedBar': {
      baseConfig.xAxis = primaryLabel;
      baseConfig.yAxis = getNextMeasure(measures);
      break;
    }
    case 'scatter': {
      // Scatter uses two different numeric fields
      const m1 = getNextMeasure(measures);
      let m2 = getNextMeasure(measures);
      if (m2 === m1 && measures.length > 1) m2 = measures.find(m => m !== m1) || m2;
      baseConfig.xAxis = m1;
      baseConfig.yAxis = m2;
      break;
    }
    case 'combo': {
      baseConfig.xAxis = primaryLabel;
      baseConfig.yAxis = getNextMeasure(measures);
      // Line field should be a different measure
      const barMeasure = baseConfig.yAxis as string;
      let lineMeasure = getNextMeasure(measures);
      if (lineMeasure === barMeasure && measures.length > 1) {
        lineMeasure = measures.find(m => m !== barMeasure) || lineMeasure;
      }
      baseConfig.valueField = lineMeasure;
      break;
    }
    case 'pie':
    case 'donut':
    case 'funnel':
    case 'treemap':
    case 'horizontalBar':
    case 'radar':
    case 'waterfall': {
      baseConfig.labelField = primaryLabel;
      baseConfig.valueField = getNextMeasure(measures);
      break;
    }
    case 'kpi': {
      const measure = getNextMeasure(measures);
      baseConfig.valueField = measure;
      baseConfig.aggregation = getSmartAggregation(measure);
      break;
    }
    case 'gauge': {
      const measure = getNextMeasure(measures);
      baseConfig.valueField = measure;
      baseConfig.aggregation = 'avg';
      break;
    }
    case 'sparkline': {
      const measure = getNextMeasure(measures);
      baseConfig.valueField = measure;
      baseConfig.aggregation = getNextAggregation();
      break;
    }
    default:
      break;
  }

  return baseConfig;
}

// Generate smart title based on field assignments
export function generateSmartTitle(
  chartType: string,
  xAxis?: string,
  yAxis?: string,
  labelField?: string,
  valueField?: string,
  aggregation?: string
): string {
  const formatFieldName = (name: string) => 
    name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const aggLabel = aggregation ? aggregation.charAt(0).toUpperCase() + aggregation.slice(1) : '';

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
      if (xAxis && yAxis) return `${formatFieldName(yAxis)} by ${formatFieldName(xAxis)}`;
      break;
    case 'pie':
    case 'donut':
      if (labelField && valueField) return `${formatFieldName(valueField)} Distribution by ${formatFieldName(labelField)}`;
      break;
    case 'kpi':
      if (valueField) return `${aggLabel || 'Total'} ${formatFieldName(valueField)}`;
      break;
    case 'gauge':
      if (valueField) return `Avg ${formatFieldName(valueField)}`;
      break;
    case 'sparkline':
      if (valueField) return `${aggLabel || 'Sum'} ${formatFieldName(valueField)} Trend`;
      break;
    case 'scatter':
      if (xAxis && yAxis) return `${formatFieldName(xAxis)} vs ${formatFieldName(yAxis)}`;
      break;
    case 'funnel':
      if (labelField && valueField) return `${formatFieldName(valueField)} Funnel by ${formatFieldName(labelField)}`;
      break;
    case 'treemap':
      if (labelField && valueField) return `${formatFieldName(valueField)} Treemap by ${formatFieldName(labelField)}`;
      break;
    case 'horizontalBar':
      if (labelField && valueField) return `${formatFieldName(valueField)} by ${formatFieldName(labelField)}`;
      break;
    case 'waterfall':
      if (labelField && valueField) return `${formatFieldName(valueField)} Waterfall`;
      break;
    case 'radar':
      if (labelField && valueField) return `${formatFieldName(valueField)} Radar by ${formatFieldName(labelField)}`;
      break;
    case 'combo':
      if (xAxis && yAxis) return `${formatFieldName(yAxis)} Combo by ${formatFieldName(xAxis)}`;
      break;
    case 'stackedBar':
      if (xAxis && yAxis) return `Stacked ${formatFieldName(yAxis)} by ${formatFieldName(xAxis)}`;
      break;
    default:
      break;
  }

  return 'New Widget';
}

// Validate widget configuration
export function validateWidgetConfig(
  config: Record<string, unknown>,
  chartType: string,
  columns: DataColumn[]
): { isValid: boolean; missingFields: string[] } {
  const columnNames = new Set(columns.map(c => c.name));
  const missingFields: string[] = [];

  const checkField = (fieldName: string, value: unknown) => {
    if (value && typeof value === 'string' && !columnNames.has(value)) {
      missingFields.push(fieldName);
    }
  };

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
    case 'combo':
      checkField('xAxis', config.xAxis);
      checkField('yAxis', config.yAxis);
      break;
    case 'pie':
    case 'donut':
    case 'funnel':
    case 'treemap':
    case 'horizontalBar':
    case 'radar':
    case 'waterfall':
      checkField('labelField', config.labelField);
      checkField('valueField', config.valueField);
      break;
    case 'kpi':
    case 'gauge':
    case 'sparkline':
      checkField('valueField', config.valueField);
      break;
    default:
      break;
  }

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}
