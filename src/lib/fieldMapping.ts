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
  'budget', 'spent', 'value', 'units', 'orders', 'rate', 'percentage', 'score', 'index', 'growth'];

// Keywords that suggest a field is a dimension (categorical)
const dimensionKeywords = ['name', 'category', 'type', 'status', 'region', 'country', 'department', 
  'product', 'channel', 'segment', 'group', 'team', 'project', 'condition', 'line', 'page', 'account'];

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
    if (isDate) {
      dateFields.push(col.name);
    }

    // Numeric fields
    if (col.type === 'number') {
      numericFields.push(col.name);
      
      // Check if it's a measure (aggregatable numeric)
      const isMeasure = measureKeywords.some(kw => lowerName.includes(kw));
      if (isMeasure) {
        measureFields.push(col.name);
      }
    }

    // Categorical/dimension fields
    if (col.type === 'string' && !isDate) {
      categoricalFields.push(col.name);
      
      // Check if it's a dimension
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

// Remap widget fields when dataset changes
export function remapWidgetFields(
  currentConfig: Record<string, unknown>,
  oldColumns: DataColumn[],
  newColumns: DataColumn[],
  newData: Record<string, unknown>[] = []
): Record<string, unknown> {
  const analysis = analyzeDatasetFields(newColumns, newData);
  const updatedConfig = { ...currentConfig };

  // Try to find equivalent fields by name similarity or fallback to smart defaults
  const findEquivalentField = (oldField: string, fieldType: 'dimension' | 'measure' | 'any'): string | null => {
    if (!oldField) return null;
    
    // First, try exact match
    const exactMatch = newColumns.find(c => c.name === oldField);
    if (exactMatch) return oldField;
    
    // Try to find similar name
    const lowerOldField = oldField.toLowerCase();
    const similarField = newColumns.find(c => 
      c.name.toLowerCase().includes(lowerOldField) || 
      lowerOldField.includes(c.name.toLowerCase())
    );
    if (similarField) return similarField.name;
    
    // Fallback to smart defaults based on type
    if (fieldType === 'dimension') {
      return analysis.suggestedLabelField;
    } else if (fieldType === 'measure') {
      return analysis.suggestedValueField;
    } else {
      return analysis.suggestedXAxis;
    }
  };

  // Remap common fields
  if ('xAxis' in updatedConfig && updatedConfig.xAxis) {
    updatedConfig.xAxis = findEquivalentField(updatedConfig.xAxis as string, 'dimension');
  }
  if ('yAxis' in updatedConfig && updatedConfig.yAxis) {
    updatedConfig.yAxis = findEquivalentField(updatedConfig.yAxis as string, 'measure');
  }
  if ('labelField' in updatedConfig && updatedConfig.labelField) {
    updatedConfig.labelField = findEquivalentField(updatedConfig.labelField as string, 'dimension');
  }
  if ('valueField' in updatedConfig && updatedConfig.valueField) {
    updatedConfig.valueField = findEquivalentField(updatedConfig.valueField as string, 'measure');
  }

  return updatedConfig;
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
      baseConfig.labelField = analysis.suggestedLabelField;
      baseConfig.valueField = analysis.suggestedValueField;
      break;
    
    case 'kpi':
    case 'gauge':
      baseConfig.valueField = analysis.suggestedValueField;
      baseConfig.aggregation = 'sum';
      break;
    
    case 'radar':
      baseConfig.labelField = analysis.suggestedLabelField;
      baseConfig.valueField = analysis.suggestedValueField;
      break;
    
    case 'stackedBar':
    case 'waterfall':
      baseConfig.labelField = analysis.suggestedLabelField;
      baseConfig.valueField = analysis.suggestedValueField;
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
    default:
      break;
  }

  return 'New Widget';
}
