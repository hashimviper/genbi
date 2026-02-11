export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'area' 
  | 'scatter' 
  | 'kpi' 
  | 'table'
  | 'gauge'
  | 'radar'
  | 'treemap'
  | 'funnel'
  | 'combo'
  | 'waterfall'
  | 'stackedBar'
  | 'donut'
  | 'sparkline'
  | 'horizontalBar';

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date';
}

export interface DataSet {
  id: string;
  name: string;
  columns: DataColumn[];
  data: Record<string, unknown>[];
  createdAt: Date;
}

export interface BaseWidgetConfig {
  id: string;
  title: string;
  datasetId: string;
  width: number;
  height: number;
  position: { x: number; y: number };
  ranking?: {
    enabled: boolean;
    field?: string;
    direction?: 'asc' | 'desc';
    limit?: number;
  };
  summaryMetrics?: {
    enabled: boolean;
    metrics?: Array<'total' | 'average' | 'min' | 'max' | 'count' | 'percentContribution'>;
    valueField?: string;
  };
}

export interface ChartConfig extends BaseWidgetConfig {
  type: Exclude<ChartType, 'kpi'>;
  xAxis?: string;
  yAxis?: string;
  valueField?: string;
  labelField?: string;
}

export interface KPIConfig extends BaseWidgetConfig {
  type: 'kpi';
  valueField: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  prefix?: string;
  suffix?: string;
}

export type WidgetConfig = ChartConfig | KPIConfig;

export interface DashboardWidget {
  id: string;
  type: ChartType;
  config: WidgetConfig;
  gridPosition: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  widgets: Omit<DashboardWidget, 'id'>[];
  sampleData?: Record<string, unknown>[];
  sampleColumns?: DataColumn[];
}

// Type guard to check if config is ChartConfig
export function isChartConfig(config: WidgetConfig): config is ChartConfig {
  return config.type !== 'kpi';
}

// Type guard to check if config is KPIConfig
export function isKPIConfig(config: WidgetConfig): config is KPIConfig {
  return config.type === 'kpi';
}
