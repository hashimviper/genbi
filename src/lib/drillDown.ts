import { DataColumn } from '@/types/dashboard';

// Drill-down hierarchy definitions
export interface DrillHierarchy {
  name: string;
  levels: string[];
}

// Predefined hierarchies derived from common BI patterns
const predefinedHierarchies: Record<string, string[]> = {
  // Date hierarchies
  'year': ['year', 'quarter', 'month', 'week', 'day'],
  'quarter': ['quarter', 'month', 'week', 'day'],
  'month': ['month', 'week', 'day'],
  'date': ['year', 'quarter', 'month', 'day'],
  
  // Geographic hierarchies
  'region': ['region', 'country', 'state', 'city'],
  'country': ['country', 'state', 'city'],
  'state': ['state', 'city'],
  
  // Organizational hierarchies
  'department': ['department', 'team', 'employee'],
  'team': ['team', 'employee'],
  
  // Product hierarchies
  'category': ['category', 'subcategory', 'product'],
  'product': ['product'],
  
  // Channel hierarchies
  'channel': ['channel'],
};

// Keywords to detect hierarchy membership
const hierarchyKeywords: Record<string, string[]> = {
  date: ['date', 'time', 'period', 'year', 'quarter', 'month', 'week', 'day', 'created', 'updated'],
  geo: ['region', 'country', 'state', 'city', 'location', 'area', 'territory', 'zone'],
  org: ['department', 'team', 'division', 'group', 'unit', 'employee', 'manager'],
  product: ['category', 'subcategory', 'product', 'item', 'sku', 'brand', 'line'],
  channel: ['channel', 'source', 'medium', 'campaign', 'platform'],
};

export interface DrillState {
  hierarchy: string[];
  currentLevel: number;
  filters: Record<string, unknown>;
  breadcrumb: { level: string; value: string }[];
}

export interface DrillAction {
  type: 'drill-down' | 'drill-up' | 'reset';
  field?: string;
  value?: unknown;
}

// Auto-derive drill hierarchies from dataset columns
export function deriveHierarchies(columns: DataColumn[]): DrillHierarchy[] {
  const hierarchies: DrillHierarchy[] = [];
  const columnNames = columns.map(c => c.name.toLowerCase());

  // Check for date hierarchies
  const dateColumns = columns.filter(c => 
    c.type === 'date' || hierarchyKeywords.date.some(kw => c.name.toLowerCase().includes(kw))
  );
  if (dateColumns.length > 0) {
    const dateLevels = dateColumns.map(c => c.name);
    // Also add derived levels if only a single date column exists
    if (dateLevels.length === 1) {
      hierarchies.push({
        name: 'Date',
        levels: dateLevels,
      });
    } else {
      hierarchies.push({
        name: 'Date',
        levels: dateLevels,
      });
    }
  }

  // Check for geographic hierarchies
  const geoColumns = columns.filter(c =>
    hierarchyKeywords.geo.some(kw => c.name.toLowerCase().includes(kw))
  );
  if (geoColumns.length > 0) {
    hierarchies.push({
      name: 'Geography',
      levels: geoColumns.map(c => c.name),
    });
  }

  // Check for organizational hierarchies
  const orgColumns = columns.filter(c =>
    hierarchyKeywords.org.some(kw => c.name.toLowerCase().includes(kw))
  );
  if (orgColumns.length > 0) {
    hierarchies.push({
      name: 'Organization',
      levels: orgColumns.map(c => c.name),
    });
  }

  // Check for product hierarchies
  const productColumns = columns.filter(c =>
    hierarchyKeywords.product.some(kw => c.name.toLowerCase().includes(kw))
  );
  if (productColumns.length > 0) {
    hierarchies.push({
      name: 'Product',
      levels: productColumns.map(c => c.name),
    });
  }

  // Check for channel hierarchies
  const channelColumns = columns.filter(c =>
    hierarchyKeywords.channel.some(kw => c.name.toLowerCase().includes(kw))
  );
  if (channelColumns.length > 0) {
    hierarchies.push({
      name: 'Channel',
      levels: channelColumns.map(c => c.name),
    });
  }

  // Fallback: create simple hierarchies from categorical columns
  if (hierarchies.length === 0) {
    const categoricalCols = columns.filter(c => c.type === 'string');
    if (categoricalCols.length > 0) {
      hierarchies.push({
        name: 'Categories',
        levels: categoricalCols.map(c => c.name),
      });
    }
  }

  return hierarchies;
}

// Create initial drill state
export function createDrillState(hierarchy: DrillHierarchy): DrillState {
  return {
    hierarchy: hierarchy.levels,
    currentLevel: 0,
    filters: {},
    breadcrumb: [],
  };
}

// Process drill-down action
export function processDrillAction(state: DrillState, action: DrillAction): DrillState {
  switch (action.type) {
    case 'drill-down': {
      if (state.currentLevel >= state.hierarchy.length - 1) {
        return state; // Already at deepest level
      }
      const currentField = state.hierarchy[state.currentLevel];
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        filters: {
          ...state.filters,
          [currentField]: action.value,
        },
        breadcrumb: [
          ...state.breadcrumb,
          { level: currentField, value: String(action.value) },
        ],
      };
    }
    case 'drill-up': {
      if (state.currentLevel <= 0) {
        return state; // Already at top level
      }
      const newBreadcrumb = state.breadcrumb.slice(0, -1);
      const newFilters = { ...state.filters };
      const previousField = state.hierarchy[state.currentLevel - 1];
      delete newFilters[previousField];
      
      return {
        ...state,
        currentLevel: state.currentLevel - 1,
        filters: newFilters,
        breadcrumb: newBreadcrumb,
      };
    }
    case 'reset':
      return {
        ...state,
        currentLevel: 0,
        filters: {},
        breadcrumb: [],
      };
    default:
      return state;
  }
}

// Apply drill filters to data
export function applyDrillFilters(
  data: Record<string, unknown>[],
  drillState: DrillState
): Record<string, unknown>[] {
  if (Object.keys(drillState.filters).length === 0) return data;
  
  return data.filter(row => {
    return Object.entries(drillState.filters).every(([field, value]) => {
      return row[field] === value;
    });
  });
}

// Get the current drill field (the dimension to show at current level)
export function getCurrentDrillField(drillState: DrillState): string | null {
  if (drillState.currentLevel >= drillState.hierarchy.length) return null;
  return drillState.hierarchy[drillState.currentLevel];
}

// Check if drill-down is available for a given field
export function canDrillDown(drillState: DrillState): boolean {
  return drillState.currentLevel < drillState.hierarchy.length - 1;
}

// Check if drill-up is available
export function canDrillUp(drillState: DrillState): boolean {
  return drillState.currentLevel > 0;
}

// Aggregate data for drill level
export function aggregateForDrillLevel(
  data: Record<string, unknown>[],
  groupField: string,
  valueFields: string[]
): Record<string, unknown>[] {
  const groups = new Map<string, Record<string, unknown>>();

  data.forEach(row => {
    const key = String(row[groupField] ?? 'Unknown');
    if (!groups.has(key)) {
      groups.set(key, { [groupField]: key });
      valueFields.forEach(f => {
        groups.get(key)![f] = 0;
      });
    }
    const group = groups.get(key)!;
    valueFields.forEach(f => {
      const val = Number(row[f]) || 0;
      group[f] = (group[f] as number) + val;
    });
  });

  return Array.from(groups.values());
}
