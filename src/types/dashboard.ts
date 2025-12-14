export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'kpi' | 'table';

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

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  xAxis?: string;
  yAxis?: string;
  valueField?: string;
  labelField?: string;
  datasetId: string;
  width: number;
  height: number;
  position: { x: number; y: number };
}

export interface KPIConfig {
  id: string;
  type: 'kpi';
  title: string;
  valueField: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  datasetId: string;
  prefix?: string;
  suffix?: string;
  width: number;
  height: number;
  position: { x: number; y: number };
}

export interface DashboardWidget {
  id: string;
  type: ChartType;
  config: ChartConfig | KPIConfig;
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
  thumbnail: string;
  widgets: Omit<DashboardWidget, 'id'>[];
}
