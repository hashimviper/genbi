import { DataColumn } from '@/types/dashboard';

export interface FieldAnalysis {
  dateFields: string[];
  numericFields: string[];
  categoricalFields: string[];
  measureFields: string[];
  dimensionFields: string[];
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

export function analyzeDatasetFields(columns: DataColumn[], data: Record<string, unknown>[] = []): FieldAnalysis {
  const dateFields: string[] = [];
  const numericFields: string[] = [];
  const categoricalFields: string[] = [];
  const measureFields: string[] = [];
  const dimensionFields: string[] = [];

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
      
      // Check if it's a measure (aggregatable numeric)
      const isMeasure = measureKeywords.some(kw => lowerName.includes(kw));
      if (isMeasure || col.type === 'number') {
        measureFields.push(col.name);
      }
    }

    // Categorical/dimension fields
    if (col.type === 'string') {
      categoricalFields.push(col.name);
      
      // Check if it's a dimension - all string fields can be dimensions
      const isDimension = dimensionKeywords.some(kw => lowerName.includes(kw)) || col.type === 'string';
      if (isDimension) {
        dimensionFields.push(col.name);
      }
    }
  });

  // Smart defaults like Tableau/Power BI
  // X-Axis: Prefer date fields, then categorical/dimension fields
  const suggestedXAxis = dateFields[0] || dimensionFields[0] || categoricalFields[0] || null;
  
  // Y-Axis: Prefer measure fields, then any numeric field
  const suggestedYAxis = measureFields[0] || numericFields[0] || null;
  
  // Label Field: For pie/donut charts - prefer dimension fields
  const suggestedLabelField = dimensionFields[0] || categoricalFields[0] || null;
  
  // Value Field: For pie/donut/gauge - prefer measure fields
  const suggestedValueField = measureFields[0] || numericFields[0] || null;

  return {
    dateFields,
    numericFields,
    categoricalFields,
    measureFields,
    dimensionFields,
    suggestedXAxis,
    suggestedYAxis,
    suggestedLabelField,
    suggestedValueField,
  };
}

// Remap widget fields when dataset changes - IMPROVED VERSION
export function remapWidgetFields(
  currentConfig: Record<string, unknown>,
  oldColumns: DataColumn[],
  newColumns: DataColumn[],
  newData: Record<string, unknown>[] = []
): Record<string, unknown> {
  const analysis = analyzeDatasetFields(newColumns, newData);
  const updatedConfig = { ...currentConfig };
  const newColumnNames = new Set(newColumns.map(c => c.name));

  // Helper to find equivalent field with smart fallback
  const findEquivalentField = (oldField: string | undefined, fieldType: 'dimension' | 'measure' | 'date' | 'any'): string | null => {
    if (!oldField) return null;
    
    // First, try exact match
    if (newColumnNames.has(oldField)) return oldField;
    
    // Try to find similar name (case-insensitive partial match)
    const lowerOldField = oldField.toLowerCase();
    const similarField = newColumns.find(c => 
      c.name.toLowerCase().includes(lowerOldField) || 
      lowerOldField.includes(c.name.toLowerCase())
    );
    if (similarField) return similarField.name;
    
    // Try to match by semantic meaning (common field patterns)
    const semanticMatch = findSemanticMatch(oldField, newColumns);
    if (semanticMatch) return semanticMatch;
    
    // Fallback to smart defaults based on type
    switch (fieldType) {
      case 'dimension':
        return analysis.suggestedLabelField;
      case 'measure':
        return analysis.suggestedValueField;
      case 'date':
        return analysis.dateFields[0] || analysis.suggestedXAxis;
      default:
        return analysis.suggestedXAxis;
    }
  };

  // Remap common fields based on their semantic type
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

// Find semantic match based on field meaning
function findSemanticMatch(oldField: string, newColumns: DataColumn[]): string | null {
  const lowerOld = oldField.toLowerCase();
  
  // Common semantic mappings
  const semanticGroups: Record<string, string[]> = {
    'category': ['department', 'category', 'type', 'segment', 'group', 'product', 'channel'],
    'revenue': ['revenue', 'sales', 'amount', 'total', 'value', 'profit'],
    'count': ['count', 'orders', 'units', 'quantity', 'employees', 'users', 'patients'],
    'rate': ['rate', 'percentage', 'ratio', 'growth', 'efficiency'],
    'name': ['name', 'title', 'label', 'description'],
    'date': ['date', 'time', 'period', 'month', 'year', 'quarter', 'week'],
    'region': ['region', 'country', 'city', 'location', 'area'],
  };

  // Find which semantic group the old field belongs to
  let oldGroup: string | null = null;
  for (const [group, keywords] of Object.entries(semanticGroups)) {
    if (keywords.some(kw => lowerOld.includes(kw))) {
      oldGroup = group;
      break;
    }
  }

  if (!oldGroup) return null;

  // Find a new column in the same semantic group
  const groupKeywords = semanticGroups[oldGroup];
  for (const col of newColumns) {
    const lowerName = col.name.toLowerCase();
    if (groupKeywords.some(kw => lowerName.includes(kw))) {
      return col.name;
    }
  }

  return null;
}

// Auto-configure widget based on chart type and dataset
export function autoConfigureWidget(
  chartType: string,
  columns: DataColumn[],
  data: Record<string, unknown>[] = []
): Record<string, unknown> {
  const analysis = analyzeDatasetFields(columns, data);
  
  const baseConfig: Record<string, unknown> = {};

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
    case 'scatter':
    case 'combo':
      baseConfig.xAxis = analysis.suggestedXAxis;
      baseConfig.yAxis = analysis.suggestedYAxis;
      break;
    
    case 'pie':
    case 'donut':
    case 'funnel':
    case 'treemap':
    case 'horizontalBar':
    case 'radar':
    case 'waterfall':
      baseConfig.labelField = analysis.suggestedLabelField;
      baseConfig.valueField = analysis.suggestedValueField;
      break;
    
    case 'kpi':
    case 'gauge':
    case 'sparkline':
      baseConfig.valueField = analysis.suggestedValueField;
      baseConfig.aggregation = 'sum';
      break;
    
    case 'stackedBar':
      baseConfig.xAxis = analysis.suggestedXAxis;
      baseConfig.yAxis = analysis.suggestedYAxis;
      break;
    
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
  valueField?: string
): string {
  const formatFieldName = (name: string) => 
    name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
      if (xAxis && yAxis) return `${formatFieldName(yAxis)} by ${formatFieldName(xAxis)}`;
      break;
    case 'pie':
    case 'donut':
      if (labelField && valueField) return `${formatFieldName(valueField)} Distribution`;
      break;
    case 'kpi':
      if (valueField) return `Total ${formatFieldName(valueField)}`;
      break;
    case 'gauge':
      if (valueField) return `${formatFieldName(valueField)} Gauge`;
      break;
    case 'scatter':
      if (xAxis && yAxis) return `${formatFieldName(xAxis)} vs ${formatFieldName(yAxis)}`;
      break;
    case 'funnel':
      if (labelField) return `${formatFieldName(labelField)} Funnel`;
      break;
    case 'treemap':
      if (labelField && valueField) return `${formatFieldName(valueField)} Treemap`;
      break;
    case 'horizontalBar':
      if (labelField && valueField) return `${formatFieldName(valueField)} by ${formatFieldName(labelField)}`;
      break;
    case 'waterfall':
      if (labelField && valueField) return `${formatFieldName(valueField)} Waterfall`;
      break;
    case 'radar':
      if (labelField && valueField) return `${formatFieldName(valueField)} Radar`;
      break;
    case 'stackedBar':
      if (xAxis && yAxis) return `Stacked ${formatFieldName(yAxis)} by ${formatFieldName(xAxis)}`;
      break;
    default:
      break;
  }

  return 'New Widget';
}

// Validate widget configuration - returns true if widget has valid field mappings
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

  // Check based on chart type
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
