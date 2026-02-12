import { DashboardTemplate, DataColumn } from '@/types/dashboard';

// Sales Performance Dashboard - with advanced widgets
export const salesPerformanceTemplate: DashboardTemplate = {
  id: 'sales-performance',
  name: 'Sales Performance',
  description: 'Comprehensive sales analytics with KPIs, gauges, and advanced charts',
  category: 'Sales',
  icon: 'TrendingUp',
  color: 'hsl(142, 71%, 45%)',
  sampleColumns: [
    { name: 'region', type: 'string' },
    { name: 'product', type: 'string' },
    { name: 'revenue', type: 'number' },
    { name: 'profit', type: 'number' },
    { name: 'units', type: 'number' },
    { name: 'target', type: 'number' },
    { name: 'growth_rate', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { region: 'North', product: 'Electronics', revenue: 425000, profit: 106250, units: 1250, target: 400000, growth_rate: 15.2 },
    { region: 'South', product: 'Clothing', revenue: 312000, profit: 78000, units: 2100, target: 350000, growth_rate: -8.5 },
    { region: 'East', product: 'Home Goods', revenue: 489000, profit: 122250, units: 1680, target: 450000, growth_rate: 22.4 },
    { region: 'West', product: 'Electronics', revenue: 567000, profit: 141750, units: 1890, target: 500000, growth_rate: 18.9 },
    { region: 'Central', product: 'Software', revenue: 892000, profit: 446000, units: 450, target: 800000, growth_rate: 35.2 },
    { region: 'North', product: 'Services', revenue: 345000, profit: 172500, units: 890, target: 320000, growth_rate: 12.8 },
    { region: 'South', product: 'Electronics', revenue: 398000, profit: 99500, units: 1120, target: 420000, growth_rate: -5.2 },
    { region: 'East', product: 'Software', revenue: 756000, profit: 378000, units: 380, target: 700000, growth_rate: 28.6 },
  ],
  widgets: [
    // KPIs Row
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Revenue', datasetId: '', valueField: 'revenue', aggregation: 'sum', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 0, y: 0 } }, gridPosition: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Profit', datasetId: '', valueField: 'profit', aggregation: 'sum', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 1, y: 0 } }, gridPosition: { x: 1, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Units Sold', datasetId: '', valueField: 'units', aggregation: 'sum', prefix: '', suffix: '', width: 1, height: 1, position: { x: 2, y: 0 } }, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { type: 'gauge', config: { id: '', type: 'gauge', title: 'Target Achievement', datasetId: '', valueField: 'growth_rate', width: 1, height: 1, position: { x: 3, y: 0 } }, gridPosition: { x: 3, y: 0, w: 1, h: 1 } },
    // Charts Row 1
    { type: 'horizontalBar', config: { id: '', type: 'horizontalBar', title: 'Revenue by Region', datasetId: '', labelField: 'region', valueField: 'revenue', width: 2, height: 2, position: { x: 0, y: 1 } }, gridPosition: { x: 0, y: 1, w: 2, h: 2 } },
    { type: 'donut', config: { id: '', type: 'donut', title: 'Profit Distribution', datasetId: '', labelField: 'product', valueField: 'profit', width: 2, height: 2, position: { x: 2, y: 1 } }, gridPosition: { x: 2, y: 1, w: 2, h: 2 } },
    // Charts Row 2
    { type: 'waterfall', config: { id: '', type: 'waterfall', title: 'Revenue Waterfall', datasetId: '', labelField: 'region', valueField: 'revenue', width: 2, height: 2, position: { x: 0, y: 3 } }, gridPosition: { x: 0, y: 3, w: 2, h: 2 } },
    { type: 'bar', config: { id: '', type: 'bar', title: 'Units by Product', datasetId: '', xAxis: 'product', yAxis: 'units', width: 2, height: 2, position: { x: 2, y: 3 } }, gridPosition: { x: 2, y: 3, w: 2, h: 2 } },
    // Table
    { type: 'table', config: { id: '', type: 'table', title: 'Sales Details', datasetId: '', width: 4, height: 2, position: { x: 0, y: 5 } }, gridPosition: { x: 0, y: 5, w: 4, h: 2 } },
  ],
};

// HR Insights Dashboard - with advanced widgets
export const hrInsightsTemplate: DashboardTemplate = {
  id: 'hr-insights',
  name: 'HR Insights',
  description: 'Employee analytics with gauges, donuts, and workforce metrics',
  category: 'Human Resources',
  icon: 'Users',
  color: 'hsl(262, 83%, 60%)',
  sampleColumns: [
    { name: 'department', type: 'string' },
    { name: 'employees', type: 'number' },
    { name: 'avg_salary', type: 'number' },
    { name: 'turnover_rate', type: 'number' },
    { name: 'satisfaction', type: 'number' },
    { name: 'training_hours', type: 'number' },
    { name: 'headcount_target', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { department: 'Engineering', employees: 145, avg_salary: 125000, turnover_rate: 8.2, satisfaction: 4.3, training_hours: 42, headcount_target: 160 },
    { department: 'Sales', employees: 89, avg_salary: 85000, turnover_rate: 15.5, satisfaction: 3.8, training_hours: 28, headcount_target: 100 },
    { department: 'Marketing', employees: 45, avg_salary: 78000, turnover_rate: 6.2, satisfaction: 4.1, training_hours: 35, headcount_target: 50 },
    { department: 'Finance', employees: 32, avg_salary: 95000, turnover_rate: 4.8, satisfaction: 4.2, training_hours: 25, headcount_target: 35 },
    { department: 'HR', employees: 18, avg_salary: 72000, turnover_rate: 3.1, satisfaction: 4.5, training_hours: 48, headcount_target: 20 },
    { department: 'Operations', employees: 78, avg_salary: 62000, turnover_rate: 12.3, satisfaction: 3.6, training_hours: 22, headcount_target: 85 },
    { department: 'Legal', employees: 12, avg_salary: 135000, turnover_rate: 2.5, satisfaction: 4.4, training_hours: 18, headcount_target: 12 },
    { department: 'IT Support', employees: 28, avg_salary: 68000, turnover_rate: 9.8, satisfaction: 3.9, training_hours: 52, headcount_target: 30 },
  ],
  widgets: [
    // KPIs and Gauge Row
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Headcount', datasetId: '', valueField: 'employees', aggregation: 'sum', prefix: '', suffix: '', width: 1, height: 1, position: { x: 0, y: 0 } }, gridPosition: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Avg Salary', datasetId: '', valueField: 'avg_salary', aggregation: 'avg', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 1, y: 0 } }, gridPosition: { x: 1, y: 0, w: 1, h: 1 } },
    { type: 'gauge', config: { id: '', type: 'gauge', title: 'Satisfaction Score', datasetId: '', valueField: 'satisfaction', width: 1, height: 1, position: { x: 2, y: 0 } }, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Turnover Rate', datasetId: '', valueField: 'turnover_rate', aggregation: 'avg', prefix: '', suffix: '%', width: 1, height: 1, position: { x: 3, y: 0 } }, gridPosition: { x: 3, y: 0, w: 1, h: 1 } },
    // Charts Row 1
    { type: 'donut', config: { id: '', type: 'donut', title: 'Headcount by Dept', datasetId: '', labelField: 'department', valueField: 'employees', width: 2, height: 2, position: { x: 0, y: 1 } }, gridPosition: { x: 0, y: 1, w: 2, h: 2 } },
    { type: 'horizontalBar', config: { id: '', type: 'horizontalBar', title: 'Salary by Department', datasetId: '', labelField: 'department', valueField: 'avg_salary', width: 2, height: 2, position: { x: 2, y: 1 } }, gridPosition: { x: 2, y: 1, w: 2, h: 2 } },
    // Charts Row 2
    { type: 'radar', config: { id: '', type: 'radar', title: 'Training Hours', datasetId: '', labelField: 'department', valueField: 'training_hours', width: 2, height: 2, position: { x: 0, y: 3 } }, gridPosition: { x: 0, y: 3, w: 2, h: 2 } },
    { type: 'bar', config: { id: '', type: 'bar', title: 'Turnover by Department', datasetId: '', xAxis: 'department', yAxis: 'turnover_rate', width: 2, height: 2, position: { x: 2, y: 3 } }, gridPosition: { x: 2, y: 3, w: 2, h: 2 } },
    // Table
    { type: 'table', config: { id: '', type: 'table', title: 'Workforce Details', datasetId: '', width: 4, height: 2, position: { x: 0, y: 5 } }, gridPosition: { x: 0, y: 5, w: 4, h: 2 } },
  ],
};

// Finance KPI Dashboard - with advanced widgets
export const financeKPITemplate: DashboardTemplate = {
  id: 'finance-summary',
  name: 'Finance KPI Dashboard',
  description: 'Financial metrics with gauges, waterfalls, and budget tracking',
  category: 'Finance',
  icon: 'DollarSign',
  color: 'hsl(120, 60%, 45%)',
  sampleColumns: [
    { name: 'category', type: 'string' },
    { name: 'budget', type: 'number' },
    { name: 'actual', type: 'number' },
    { name: 'variance', type: 'number' },
    { name: 'forecast', type: 'number' },
    { name: 'yoy_change', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { category: 'Revenue', budget: 5200000, actual: 5450000, variance: 250000, forecast: 5600000, yoy_change: 12.5 },
    { category: 'COGS', budget: 2600000, actual: 2720000, variance: -120000, forecast: 2800000, yoy_change: 8.2 },
    { category: 'Gross Profit', budget: 2600000, actual: 2730000, variance: 130000, forecast: 2800000, yoy_change: 18.4 },
    { category: 'OpEx', budget: 1200000, actual: 1150000, variance: 50000, forecast: 1180000, yoy_change: 5.2 },
    { category: 'EBITDA', budget: 1400000, actual: 1580000, variance: 180000, forecast: 1620000, yoy_change: 28.6 },
    { category: 'Net Income', budget: 980000, actual: 1120000, variance: 140000, forecast: 1200000, yoy_change: 32.1 },
    { category: 'Cash Flow', budget: 850000, actual: 920000, variance: 70000, forecast: 980000, yoy_change: 15.8 },
    { category: 'CapEx', budget: 450000, actual: 380000, variance: 70000, forecast: 420000, yoy_change: -8.5 },
  ],
  widgets: [
    // KPIs Row
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Revenue', datasetId: '', valueField: 'actual', aggregation: 'max', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 0, y: 0 } }, gridPosition: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Net Income', datasetId: '', valueField: 'variance', aggregation: 'sum', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 1, y: 0 } }, gridPosition: { x: 1, y: 0, w: 1, h: 1 } },
    { type: 'gauge', config: { id: '', type: 'gauge', title: 'YoY Growth', datasetId: '', valueField: 'yoy_change', width: 1, height: 1, position: { x: 2, y: 0 } }, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Avg Variance', datasetId: '', valueField: 'variance', aggregation: 'avg', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 3, y: 0 } }, gridPosition: { x: 3, y: 0, w: 1, h: 1 } },
    // Charts Row 1
    { type: 'waterfall', config: { id: '', type: 'waterfall', title: 'Budget vs Actual', datasetId: '', labelField: 'category', valueField: 'variance', width: 2, height: 2, position: { x: 0, y: 1 } }, gridPosition: { x: 0, y: 1, w: 2, h: 2 } },
    { type: 'horizontalBar', config: { id: '', type: 'horizontalBar', title: 'Actual by Category', datasetId: '', labelField: 'category', valueField: 'actual', width: 2, height: 2, position: { x: 2, y: 1 } }, gridPosition: { x: 2, y: 1, w: 2, h: 2 } },
    // Charts Row 2
    { type: 'donut', config: { id: '', type: 'donut', title: 'Budget Allocation', datasetId: '', labelField: 'category', valueField: 'budget', width: 2, height: 2, position: { x: 0, y: 3 } }, gridPosition: { x: 0, y: 3, w: 2, h: 2 } },
    { type: 'line', config: { id: '', type: 'line', title: 'YoY Change Trend', datasetId: '', xAxis: 'category', yAxis: 'yoy_change', width: 2, height: 2, position: { x: 2, y: 3 } }, gridPosition: { x: 2, y: 3, w: 2, h: 2 } },
    // Table
    { type: 'table', config: { id: '', type: 'table', title: 'Financial Summary', datasetId: '', width: 4, height: 2, position: { x: 0, y: 5 } }, gridPosition: { x: 0, y: 5, w: 4, h: 2 } },
  ],
};

// Operations Dashboard - with advanced widgets
export const operationsTemplate: DashboardTemplate = {
  id: 'operations-monitoring',
  name: 'Operations Dashboard',
  description: 'Operations monitoring with efficiency gauges and productivity metrics',
  category: 'Manufacturing',
  icon: 'Factory',
  color: 'hsl(43, 96%, 56%)',
  sampleColumns: [
    { name: 'line', type: 'string' },
    { name: 'output', type: 'number' },
    { name: 'efficiency', type: 'number' },
    { name: 'defects', type: 'number' },
    { name: 'downtime', type: 'number' },
    { name: 'target_output', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { line: 'Assembly A', output: 12500, efficiency: 94.5, defects: 125, downtime: 8, target_output: 13000 },
    { line: 'Assembly B', output: 11200, efficiency: 89.2, defects: 180, downtime: 14, target_output: 12500 },
    { line: 'Packaging', output: 24500, efficiency: 98.2, defects: 45, downtime: 3, target_output: 25000 },
    { line: 'Quality Control', output: 23800, efficiency: 99.5, defects: 12, downtime: 1, target_output: 24000 },
    { line: 'Machining', output: 8200, efficiency: 82.5, defects: 220, downtime: 22, target_output: 10000 },
    { line: 'Welding', output: 6800, efficiency: 85.8, defects: 95, downtime: 18, target_output: 8000 },
    { line: 'Painting', output: 9500, efficiency: 92.4, defects: 72, downtime: 6, target_output: 10000 },
    { line: 'Final Assembly', output: 5100, efficiency: 96.8, defects: 28, downtime: 4, target_output: 5500 },
  ],
  widgets: [
    // KPIs and Gauges Row
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Output', datasetId: '', valueField: 'output', aggregation: 'sum', prefix: '', suffix: ' units', width: 1, height: 1, position: { x: 0, y: 0 } }, gridPosition: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'gauge', config: { id: '', type: 'gauge', title: 'Avg Efficiency', datasetId: '', valueField: 'efficiency', width: 1, height: 1, position: { x: 1, y: 0 } }, gridPosition: { x: 1, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Defects', datasetId: '', valueField: 'defects', aggregation: 'sum', prefix: '', suffix: '', width: 1, height: 1, position: { x: 2, y: 0 } }, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Downtime Hours', datasetId: '', valueField: 'downtime', aggregation: 'sum', prefix: '', suffix: ' hrs', width: 1, height: 1, position: { x: 3, y: 0 } }, gridPosition: { x: 3, y: 0, w: 1, h: 1 } },
    // Charts Row 1
    { type: 'horizontalBar', config: { id: '', type: 'horizontalBar', title: 'Output by Line', datasetId: '', labelField: 'line', valueField: 'output', width: 2, height: 2, position: { x: 0, y: 1 } }, gridPosition: { x: 0, y: 1, w: 2, h: 2 } },
    { type: 'donut', config: { id: '', type: 'donut', title: 'Defects Distribution', datasetId: '', labelField: 'line', valueField: 'defects', width: 2, height: 2, position: { x: 2, y: 1 } }, gridPosition: { x: 2, y: 1, w: 2, h: 2 } },
    // Charts Row 2
    { type: 'bar', config: { id: '', type: 'bar', title: 'Efficiency by Line', datasetId: '', xAxis: 'line', yAxis: 'efficiency', width: 2, height: 2, position: { x: 0, y: 3 } }, gridPosition: { x: 0, y: 3, w: 2, h: 2 } },
    { type: 'waterfall', config: { id: '', type: 'waterfall', title: 'Downtime Analysis', datasetId: '', labelField: 'line', valueField: 'downtime', width: 2, height: 2, position: { x: 2, y: 3 } }, gridPosition: { x: 2, y: 3, w: 2, h: 2 } },
    // Table
    { type: 'table', config: { id: '', type: 'table', title: 'Production Details', datasetId: '', width: 4, height: 2, position: { x: 0, y: 5 } }, gridPosition: { x: 0, y: 5, w: 4, h: 2 } },
  ],
};

// Executive KPI Dashboard - with advanced widgets  
export const executiveKPITemplate: DashboardTemplate = {
  id: 'executive-kpi',
  name: 'Executive KPI Dashboard',
  description: 'High-level executive metrics with gauges and trend analysis',
  category: 'General',
  icon: 'FileBarChart',
  color: 'hsl(280, 70%, 55%)',
  sampleColumns: [
    { name: 'metric', type: 'string' },
    { name: 'current', type: 'number' },
    { name: 'target', type: 'number' },
    { name: 'previous', type: 'number' },
    { name: 'growth_rate', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { metric: 'Revenue', current: 4250000, target: 4000000, previous: 3800000, growth_rate: 11.8 },
    { metric: 'Profit', current: 850000, target: 800000, previous: 720000, growth_rate: 18.1 },
    { metric: 'Customers', current: 12500, target: 12000, previous: 10800, growth_rate: 15.7 },
    { metric: 'Orders', current: 45200, target: 42000, previous: 38500, growth_rate: 17.4 },
    { metric: 'NPS Score', current: 72, target: 70, previous: 68, growth_rate: 5.9 },
    { metric: 'Churn Rate', current: 4.2, target: 5.0, previous: 5.8, growth_rate: -27.6 },
    { metric: 'ARPU', current: 340, target: 320, previous: 310, growth_rate: 9.7 },
    { metric: 'CAC', current: 85, target: 90, previous: 95, growth_rate: -10.5 },
  ],
  widgets: [
    // KPIs and Gauges Row
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Revenue', datasetId: '', valueField: 'current', aggregation: 'max', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 0, y: 0 } }, gridPosition: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Profit', datasetId: '', valueField: 'target', aggregation: 'sum', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 1, y: 0 } }, gridPosition: { x: 1, y: 0, w: 1, h: 1 } },
    { type: 'gauge', config: { id: '', type: 'gauge', title: 'Growth Rate', datasetId: '', valueField: 'growth_rate', width: 1, height: 1, position: { x: 2, y: 0 } }, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Customers', datasetId: '', valueField: 'current', aggregation: 'avg', prefix: '', suffix: '', width: 1, height: 1, position: { x: 3, y: 0 } }, gridPosition: { x: 3, y: 0, w: 1, h: 1 } },
    // Charts Row 1
    { type: 'horizontalBar', config: { id: '', type: 'horizontalBar', title: 'Current vs Target', datasetId: '', labelField: 'metric', valueField: 'current', width: 2, height: 2, position: { x: 0, y: 1 } }, gridPosition: { x: 0, y: 1, w: 2, h: 2 } },
    { type: 'donut', config: { id: '', type: 'donut', title: 'Target Distribution', datasetId: '', labelField: 'metric', valueField: 'target', width: 2, height: 2, position: { x: 2, y: 1 } }, gridPosition: { x: 2, y: 1, w: 2, h: 2 } },
    // Charts Row 2
    { type: 'waterfall', config: { id: '', type: 'waterfall', title: 'Growth Analysis', datasetId: '', labelField: 'metric', valueField: 'growth_rate', width: 2, height: 2, position: { x: 0, y: 3 } }, gridPosition: { x: 0, y: 3, w: 2, h: 2 } },
    { type: 'line', config: { id: '', type: 'line', title: 'Performance Trend', datasetId: '', xAxis: 'metric', yAxis: 'current', width: 2, height: 2, position: { x: 2, y: 3 } }, gridPosition: { x: 2, y: 3, w: 2, h: 2 } },
    // Table
    { type: 'table', config: { id: '', type: 'table', title: 'KPI Details', datasetId: '', width: 4, height: 2, position: { x: 0, y: 5 } }, gridPosition: { x: 0, y: 5, w: 4, h: 2 } },
  ],
};

// Marketing Analysis Dashboard
export const marketingAnalysisTemplate: DashboardTemplate = {
  id: 'marketing-analysis',
  name: 'Marketing Analysis',
  description: 'Campaign performance with ROI gauges and channel analytics',
  category: 'Digital Marketing',
  icon: 'Globe',
  color: 'hsl(173, 80%, 50%)',
  sampleColumns: [
    { name: 'channel', type: 'string' },
    { name: 'impressions', type: 'number' },
    { name: 'clicks', type: 'number' },
    { name: 'conversions', type: 'number' },
    { name: 'spend', type: 'number' },
    { name: 'roi', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { channel: 'Google Ads', impressions: 1450000, clicks: 52000, conversions: 2150, spend: 32000, roi: 3.8 },
    { channel: 'Facebook', impressions: 980000, clicks: 38000, conversions: 1280, spend: 18500, roi: 3.2 },
    { channel: 'LinkedIn', impressions: 520000, clicks: 21000, conversions: 580, spend: 28000, roi: 1.9 },
    { channel: 'Email', impressions: 145000, clicks: 35000, conversions: 2850, spend: 4200, roi: 9.5 },
    { channel: 'Twitter', impressions: 720000, clicks: 18000, conversions: 420, spend: 9500, roi: 1.6 },
    { channel: 'Instagram', impressions: 1250000, clicks: 62000, conversions: 1680, spend: 22000, roi: 4.2 },
    { channel: 'TikTok', impressions: 2400000, clicks: 98000, conversions: 2450, spend: 28000, roi: 4.8 },
    { channel: 'YouTube', impressions: 890000, clicks: 28000, conversions: 780, spend: 35000, roi: 2.4 },
  ],
  widgets: [
    // KPIs and Gauges Row
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Impressions', datasetId: '', valueField: 'impressions', aggregation: 'sum', prefix: '', suffix: '', width: 1, height: 1, position: { x: 0, y: 0 } }, gridPosition: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Conversions', datasetId: '', valueField: 'conversions', aggregation: 'sum', prefix: '', suffix: '', width: 1, height: 1, position: { x: 1, y: 0 } }, gridPosition: { x: 1, y: 0, w: 1, h: 1 } },
    { type: 'gauge', config: { id: '', type: 'gauge', title: 'Avg ROI', datasetId: '', valueField: 'roi', width: 1, height: 1, position: { x: 2, y: 0 } }, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Spend', datasetId: '', valueField: 'spend', aggregation: 'sum', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 3, y: 0 } }, gridPosition: { x: 3, y: 0, w: 1, h: 1 } },
    // Charts Row 1
    { type: 'horizontalBar', config: { id: '', type: 'horizontalBar', title: 'Conversions by Channel', datasetId: '', labelField: 'channel', valueField: 'conversions', width: 2, height: 2, position: { x: 0, y: 1 } }, gridPosition: { x: 0, y: 1, w: 2, h: 2 } },
    { type: 'donut', config: { id: '', type: 'donut', title: 'Spend Distribution', datasetId: '', labelField: 'channel', valueField: 'spend', width: 2, height: 2, position: { x: 2, y: 1 } }, gridPosition: { x: 2, y: 1, w: 2, h: 2 } },
    // Charts Row 2  
    { type: 'funnel', config: { id: '', type: 'funnel', title: 'Conversion Funnel', datasetId: '', labelField: 'channel', valueField: 'clicks', width: 2, height: 2, position: { x: 0, y: 3 } }, gridPosition: { x: 0, y: 3, w: 2, h: 2 } },
    { type: 'bar', config: { id: '', type: 'bar', title: 'ROI by Channel', datasetId: '', xAxis: 'channel', yAxis: 'roi', width: 2, height: 2, position: { x: 2, y: 3 } }, gridPosition: { x: 2, y: 3, w: 2, h: 2 } },
    // Table
    { type: 'table', config: { id: '', type: 'table', title: 'Campaign Details', datasetId: '', width: 4, height: 2, position: { x: 0, y: 5 } }, gridPosition: { x: 0, y: 5, w: 4, h: 2 } },
  ],
};

// Blank Canvas Template - for custom dashboard creation
export const blankCanvasTemplate: DashboardTemplate = {
  id: 'blank-canvas',
  name: 'Blank Canvas',
  description: 'Start from scratch - add your own data and build custom visualizations',
  category: 'General',
  icon: 'FileBarChart',
  color: 'hsl(220, 70%, 50%)',
  sampleColumns: [
    { name: 'category', type: 'string' },
    { name: 'value', type: 'number' },
    { name: 'count', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { category: 'Category A', value: 100, count: 10 },
    { category: 'Category B', value: 150, count: 15 },
    { category: 'Category C', value: 200, count: 20 },
    { category: 'Category D', value: 120, count: 12 },
  ],
  widgets: [], // Empty - user builds from scratch
};

// Growth Dashboard
export const growthDashboardTemplate: DashboardTemplate = {
  id: 'growth-dashboard',
  name: 'Growth Dashboard',
  description: 'Track user acquisition, retention, and growth metrics across channels',
  category: 'Sales',
  icon: 'TrendingUp',
  color: 'hsl(160, 70%, 45%)',
  sampleColumns: [
    { name: 'channel', type: 'string' },
    { name: 'new_users', type: 'number' },
    { name: 'active_users', type: 'number' },
    { name: 'retention_rate', type: 'number' },
    { name: 'revenue', type: 'number' },
    { name: 'churn_rate', type: 'number' },
  ] as DataColumn[],
  sampleData: [
    { channel: 'Organic', new_users: 12500, active_users: 45000, retention_rate: 78.5, revenue: 425000, churn_rate: 4.2 },
    { channel: 'Paid Search', new_users: 8900, active_users: 28000, retention_rate: 65.2, revenue: 312000, churn_rate: 8.5 },
    { channel: 'Social', new_users: 15200, active_users: 38000, retention_rate: 52.8, revenue: 198000, churn_rate: 12.1 },
    { channel: 'Referral', new_users: 4800, active_users: 18000, retention_rate: 88.4, revenue: 285000, churn_rate: 2.8 },
    { channel: 'Email', new_users: 3200, active_users: 22000, retention_rate: 82.1, revenue: 195000, churn_rate: 5.5 },
    { channel: 'Direct', new_users: 6500, active_users: 35000, retention_rate: 72.3, revenue: 380000, churn_rate: 6.8 },
    { channel: 'Partnerships', new_users: 2100, active_users: 9500, retention_rate: 91.2, revenue: 178000, churn_rate: 1.9 },
    { channel: 'Content', new_users: 7800, active_users: 32000, retention_rate: 68.9, revenue: 245000, churn_rate: 7.2 },
  ],
  widgets: [
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'New Users', datasetId: '', valueField: 'new_users', aggregation: 'sum', prefix: '', suffix: '', width: 1, height: 1, position: { x: 0, y: 0 } }, gridPosition: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Active Users', datasetId: '', valueField: 'active_users', aggregation: 'sum', prefix: '', suffix: '', width: 1, height: 1, position: { x: 1, y: 0 } }, gridPosition: { x: 1, y: 0, w: 1, h: 1 } },
    { type: 'gauge', config: { id: '', type: 'gauge', title: 'Retention Rate', datasetId: '', valueField: 'retention_rate', width: 1, height: 1, position: { x: 2, y: 0 } }, gridPosition: { x: 2, y: 0, w: 1, h: 1 } },
    { type: 'kpi', config: { id: '', type: 'kpi', title: 'Total Revenue', datasetId: '', valueField: 'revenue', aggregation: 'sum', prefix: '$', suffix: '', width: 1, height: 1, position: { x: 3, y: 0 } }, gridPosition: { x: 3, y: 0, w: 1, h: 1 } },
    { type: 'bar', config: { id: '', type: 'bar', title: 'New Users by Channel', datasetId: '', xAxis: 'channel', yAxis: 'new_users', width: 2, height: 2, position: { x: 0, y: 1 } }, gridPosition: { x: 0, y: 1, w: 2, h: 2 } },
    { type: 'donut', config: { id: '', type: 'donut', title: 'Revenue Share', datasetId: '', labelField: 'channel', valueField: 'revenue', width: 2, height: 2, position: { x: 2, y: 1 } }, gridPosition: { x: 2, y: 1, w: 2, h: 2 } },
    { type: 'horizontalBar', config: { id: '', type: 'horizontalBar', title: 'Retention by Channel', datasetId: '', labelField: 'channel', valueField: 'retention_rate', width: 2, height: 2, position: { x: 0, y: 3 } }, gridPosition: { x: 0, y: 3, w: 2, h: 2 } },
    { type: 'waterfall', config: { id: '', type: 'waterfall', title: 'Churn Analysis', datasetId: '', labelField: 'channel', valueField: 'churn_rate', width: 2, height: 2, position: { x: 2, y: 3 } }, gridPosition: { x: 2, y: 3, w: 2, h: 2 } },
    { type: 'table', config: { id: '', type: 'table', title: 'Growth Details', datasetId: '', width: 4, height: 2, position: { x: 0, y: 5 } }, gridPosition: { x: 0, y: 5, w: 4, h: 2 } },
  ],
};

// Export all advanced templates
export const advancedTemplates: DashboardTemplate[] = [
  salesPerformanceTemplate,
  hrInsightsTemplate,
  financeKPITemplate,
  operationsTemplate,
  executiveKPITemplate,
  marketingAnalysisTemplate,
  growthDashboardTemplate,
  blankCanvasTemplate,
];

// Map advanced template IDs to their datasets  
export const advancedTemplateDatasetMap: Record<string, string> = {
  'sales-performance': 'sales-performance-dataset',
  'hr-insights': 'hr-analysis-dataset',
  'finance-summary': 'finance-expenses-dataset',
  'operations-monitoring': 'operations-productivity-dataset',
  'executive-kpi': 'executive-kpi-dataset',
  'marketing-analysis': 'marketing-campaigns-dataset',
  'growth-dashboard': 'growth-dashboard-dataset',
  'blank-canvas': '',
};
