import { DataSet } from '@/types/dashboard';

// HR Analysis Sample Data
const hrData = [
  { department: 'Engineering', employees: 45, turnover_rate: 8.2, avg_salary: 95000, satisfaction: 4.2, training_hours: 32, date: '2024-01' },
  { department: 'Sales', employees: 32, turnover_rate: 12.5, avg_salary: 72000, satisfaction: 3.8, training_hours: 24, date: '2024-01' },
  { department: 'Marketing', employees: 18, turnover_rate: 6.1, avg_salary: 68000, satisfaction: 4.0, training_hours: 28, date: '2024-01' },
  { department: 'Finance', employees: 12, turnover_rate: 4.3, avg_salary: 85000, satisfaction: 4.1, training_hours: 20, date: '2024-01' },
  { department: 'HR', employees: 8, turnover_rate: 3.2, avg_salary: 62000, satisfaction: 4.5, training_hours: 40, date: '2024-01' },
  { department: 'Operations', employees: 28, turnover_rate: 9.8, avg_salary: 58000, satisfaction: 3.6, training_hours: 18, date: '2024-01' },
  { department: 'Legal', employees: 6, turnover_rate: 2.1, avg_salary: 110000, satisfaction: 4.3, training_hours: 15, date: '2024-02' },
  { department: 'IT Support', employees: 15, turnover_rate: 7.5, avg_salary: 65000, satisfaction: 3.9, training_hours: 35, date: '2024-02' },
  { department: 'Engineering', employees: 48, turnover_rate: 7.8, avg_salary: 98000, satisfaction: 4.3, training_hours: 34, date: '2024-02' },
  { department: 'Sales', employees: 35, turnover_rate: 11.2, avg_salary: 74000, satisfaction: 3.9, training_hours: 26, date: '2024-02' },
];

// Web Analytics Sample Data
const webAnalyticsData = [
  { page: 'Homepage', views: 45230, unique_visitors: 32100, bounce_rate: 35.2, avg_time: 125, conversions: 890, date: '2024-01-15' },
  { page: 'Products', views: 28450, unique_visitors: 21300, bounce_rate: 42.1, avg_time: 180, conversions: 1250, date: '2024-01-15' },
  { page: 'Pricing', views: 18920, unique_visitors: 15600, bounce_rate: 28.5, avg_time: 210, conversions: 720, date: '2024-01-15' },
  { page: 'Blog', views: 35600, unique_visitors: 28400, bounce_rate: 55.3, avg_time: 320, conversions: 180, date: '2024-01-15' },
  { page: 'Contact', views: 8920, unique_visitors: 7800, bounce_rate: 22.1, avg_time: 95, conversions: 450, date: '2024-01-15' },
  { page: 'About', views: 12340, unique_visitors: 10200, bounce_rate: 48.7, avg_time: 85, conversions: 65, date: '2024-01-15' },
  { page: 'Docs', views: 22100, unique_visitors: 18500, bounce_rate: 31.2, avg_time: 420, conversions: 320, date: '2024-01-15' },
  { page: 'Support', views: 9870, unique_visitors: 8200, bounce_rate: 25.8, avg_time: 280, conversions: 890, date: '2024-01-15' },
];

// Sales Performance Data (Enhanced)
const salesPerformanceData = [
  { date: '2024-01', region: 'North', product: 'Electronics', category: 'Consumer', revenue: 125000, profit: 31250, units: 342 },
  { date: '2024-01', region: 'South', product: 'Clothing', category: 'Retail', revenue: 89000, profit: 22250, units: 567 },
  { date: '2024-01', region: 'East', product: 'Home Goods', category: 'Consumer', revenue: 156000, profit: 39000, units: 423 },
  { date: '2024-01', region: 'West', product: 'Electronics', category: 'Business', revenue: 234000, profit: 58500, units: 189 },
  { date: '2024-02', region: 'North', product: 'Software', category: 'Business', revenue: 312000, profit: 156000, units: 78 },
  { date: '2024-02', region: 'South', product: 'Electronics', category: 'Consumer', revenue: 178000, profit: 44500, units: 412 },
  { date: '2024-02', region: 'East', product: 'Clothing', category: 'Retail', revenue: 98000, profit: 24500, units: 689 },
  { date: '2024-02', region: 'West', product: 'Home Goods', category: 'Consumer', revenue: 145000, profit: 36250, units: 398 },
  { date: '2024-03', region: 'North', product: 'Electronics', category: 'Consumer', revenue: 167000, profit: 41750, units: 398 },
  { date: '2024-03', region: 'South', product: 'Software', category: 'Business', revenue: 289000, profit: 144500, units: 65 },
  { date: '2024-03', region: 'East', product: 'Electronics', category: 'Business', revenue: 256000, profit: 64000, units: 212 },
  { date: '2024-03', region: 'West', product: 'Clothing', category: 'Retail', revenue: 112000, profit: 28000, units: 789 },
  { date: '2024-04', region: 'North', product: 'Home Goods', category: 'Consumer', revenue: 189000, profit: 47250, units: 534 },
  { date: '2024-04', region: 'South', product: 'Electronics', category: 'Consumer', revenue: 198000, profit: 49500, units: 467 },
  { date: '2024-04', region: 'East', product: 'Software', category: 'Business', revenue: 345000, profit: 172500, units: 89 },
  { date: '2024-04', region: 'West', product: 'Electronics', category: 'Business', revenue: 278000, profit: 69500, units: 234 },
];

// Marketing Campaigns Data (NEW)
const marketingCampaignsData = [
  { channel: 'Google Ads', impressions: 1250000, clicks: 45000, conversions: 1850, spend: 28500, roi: 3.2, date: '2024-01' },
  { channel: 'Facebook', impressions: 890000, clicks: 32000, conversions: 980, spend: 15200, roi: 2.8, date: '2024-01' },
  { channel: 'LinkedIn', impressions: 450000, clicks: 18000, conversions: 420, spend: 22000, roi: 1.9, date: '2024-01' },
  { channel: 'Email', impressions: 125000, clicks: 28000, conversions: 2200, spend: 3500, roi: 8.5, date: '2024-01' },
  { channel: 'Twitter', impressions: 680000, clicks: 15000, conversions: 320, spend: 8900, roi: 1.5, date: '2024-01' },
  { channel: 'Instagram', impressions: 1100000, clicks: 52000, conversions: 1450, spend: 18500, roi: 3.8, date: '2024-01' },
  { channel: 'TikTok', impressions: 2100000, clicks: 89000, conversions: 2100, spend: 25000, roi: 4.2, date: '2024-02' },
  { channel: 'YouTube', impressions: 780000, clicks: 24000, conversions: 680, spend: 32000, roi: 2.1, date: '2024-02' },
  { channel: 'Google Ads', impressions: 1380000, clicks: 52000, conversions: 2150, spend: 31200, roi: 3.5, date: '2024-02' },
  { channel: 'Facebook', impressions: 920000, clicks: 35000, conversions: 1080, spend: 16800, roi: 2.9, date: '2024-02' },
  { channel: 'Email', impressions: 142000, clicks: 32000, conversions: 2580, spend: 3800, roi: 9.2, date: '2024-02' },
  { channel: 'LinkedIn', impressions: 520000, clicks: 21000, conversions: 510, spend: 24500, roi: 2.1, date: '2024-02' },
];

// Finance / Expenses Data (NEW)
const financeExpensesData = [
  { date: '2024-01', department: 'Engineering', expense_type: 'Salaries', amount: 485000, budget: 500000, variance: 15000 },
  { date: '2024-01', department: 'Engineering', expense_type: 'Equipment', amount: 125000, budget: 100000, variance: -25000 },
  { date: '2024-01', department: 'Marketing', expense_type: 'Advertising', amount: 85000, budget: 90000, variance: 5000 },
  { date: '2024-01', department: 'Marketing', expense_type: 'Events', amount: 45000, budget: 50000, variance: 5000 },
  { date: '2024-01', department: 'Sales', expense_type: 'Travel', amount: 62000, budget: 55000, variance: -7000 },
  { date: '2024-01', department: 'Sales', expense_type: 'Commissions', amount: 178000, budget: 180000, variance: 2000 },
  { date: '2024-01', department: 'Operations', expense_type: 'Utilities', amount: 28000, budget: 30000, variance: 2000 },
  { date: '2024-01', department: 'Operations', expense_type: 'Maintenance', amount: 42000, budget: 40000, variance: -2000 },
  { date: '2024-02', department: 'Engineering', expense_type: 'Salaries', amount: 492000, budget: 500000, variance: 8000 },
  { date: '2024-02', department: 'Engineering', expense_type: 'Cloud Services', amount: 78000, budget: 70000, variance: -8000 },
  { date: '2024-02', department: 'Marketing', expense_type: 'Advertising', amount: 92000, budget: 90000, variance: -2000 },
  { date: '2024-02', department: 'HR', expense_type: 'Training', amount: 35000, budget: 40000, variance: 5000 },
];

// Operations / Productivity Data (NEW)
const operationsProductivityData = [
  { team: 'Team Alpha', task_type: 'Development', status: 'Completed', completion_time: 4.5, date: '2024-01-15', tasks_count: 23 },
  { team: 'Team Alpha', task_type: 'Testing', status: 'Completed', completion_time: 2.8, date: '2024-01-15', tasks_count: 45 },
  { team: 'Team Beta', task_type: 'Development', status: 'Completed', completion_time: 5.2, date: '2024-01-15', tasks_count: 18 },
  { team: 'Team Beta', task_type: 'Design', status: 'In Progress', completion_time: 6.1, date: '2024-01-15', tasks_count: 12 },
  { team: 'Team Gamma', task_type: 'Development', status: 'Completed', completion_time: 3.9, date: '2024-01-22', tasks_count: 28 },
  { team: 'Team Gamma', task_type: 'Documentation', status: 'Completed', completion_time: 1.5, date: '2024-01-22', tasks_count: 15 },
  { team: 'Team Delta', task_type: 'Testing', status: 'Completed', completion_time: 2.2, date: '2024-01-22', tasks_count: 52 },
  { team: 'Team Delta', task_type: 'Bug Fixes', status: 'In Progress', completion_time: 1.8, date: '2024-01-22', tasks_count: 34 },
  { team: 'Team Alpha', task_type: 'Deployment', status: 'Completed', completion_time: 0.5, date: '2024-01-29', tasks_count: 8 },
  { team: 'Team Beta', task_type: 'Development', status: 'Completed', completion_time: 4.8, date: '2024-01-29', tasks_count: 21 },
  { team: 'Team Gamma', task_type: 'Review', status: 'Completed', completion_time: 1.2, date: '2024-01-29', tasks_count: 42 },
  { team: 'Team Delta', task_type: 'Development', status: 'Blocked', completion_time: 0, date: '2024-01-29', tasks_count: 5 },
];

// Medical Analysis Sample Data
const medicalData = [
  { condition: 'Hypertension', patients: 1250, avg_age: 52, treatment_success: 78.5, readmission_rate: 12.3, cost: 4500 },
  { condition: 'Diabetes', patients: 980, avg_age: 48, treatment_success: 72.1, readmission_rate: 18.7, cost: 6200 },
  { condition: 'Heart Disease', patients: 650, avg_age: 61, treatment_success: 65.8, readmission_rate: 22.4, cost: 12500 },
  { condition: 'Respiratory', patients: 820, avg_age: 45, treatment_success: 81.2, readmission_rate: 15.6, cost: 3800 },
  { condition: 'Orthopedic', patients: 540, avg_age: 42, treatment_success: 88.4, readmission_rate: 8.2, cost: 8900 },
  { condition: 'Neurological', patients: 320, avg_age: 55, treatment_success: 62.3, readmission_rate: 25.1, cost: 15200 },
  { condition: 'Oncology', patients: 280, avg_age: 58, treatment_success: 58.7, readmission_rate: 28.9, cost: 28500 },
  { condition: 'Pediatric', patients: 890, avg_age: 8, treatment_success: 92.1, readmission_rate: 6.5, cost: 2800 },
];

// Factory Operations Sample Data
const factoryData = [
  { line: 'Assembly A', units_produced: 12500, defect_rate: 1.2, efficiency: 94.5, downtime_hours: 8, energy_kwh: 4500 },
  { line: 'Assembly B', units_produced: 11800, defect_rate: 1.8, efficiency: 91.2, downtime_hours: 12, energy_kwh: 4200 },
  { line: 'Packaging', units_produced: 24000, defect_rate: 0.5, efficiency: 97.8, downtime_hours: 4, energy_kwh: 2800 },
  { line: 'Quality Control', units_produced: 23500, defect_rate: 0.1, efficiency: 99.2, downtime_hours: 2, energy_kwh: 1200 },
  { line: 'Machining', units_produced: 8900, defect_rate: 2.1, efficiency: 88.5, downtime_hours: 18, energy_kwh: 6500 },
  { line: 'Welding', units_produced: 6500, defect_rate: 1.5, efficiency: 92.1, downtime_hours: 14, energy_kwh: 8200 },
  { line: 'Painting', units_produced: 9800, defect_rate: 0.8, efficiency: 95.6, downtime_hours: 6, energy_kwh: 3800 },
  { line: 'Final Assembly', units_produced: 5200, defect_rate: 0.3, efficiency: 98.1, downtime_hours: 3, energy_kwh: 2100 },
];

// Global Overview Sample Data
const globalData = [
  { country: 'United States', revenue: 4500000, users: 125000, growth: 15.2, market_share: 28.5, offices: 12 },
  { country: 'United Kingdom', revenue: 1800000, users: 48000, growth: 12.8, market_share: 18.2, offices: 4 },
  { country: 'Germany', revenue: 1500000, users: 42000, growth: 18.5, market_share: 15.6, offices: 3 },
  { country: 'Japan', revenue: 2100000, users: 65000, growth: 8.9, market_share: 22.1, offices: 5 },
  { country: 'Australia', revenue: 890000, users: 28000, growth: 22.4, market_share: 12.8, offices: 2 },
  { country: 'Canada', revenue: 720000, users: 21000, growth: 19.1, market_share: 9.5, offices: 2 },
  { country: 'France', revenue: 980000, users: 32000, growth: 14.2, market_share: 11.2, offices: 2 },
  { country: 'Brazil', revenue: 650000, users: 45000, growth: 28.5, market_share: 8.9, offices: 1 },
];

// Weather Analytics Sample Data
const weatherData = [
  { city: 'New York', temperature: 72, humidity: 65, precipitation: 3.2, wind_speed: 12, uv_index: 6 },
  { city: 'Los Angeles', temperature: 78, humidity: 45, precipitation: 0.5, wind_speed: 8, uv_index: 9 },
  { city: 'Chicago', temperature: 68, humidity: 70, precipitation: 2.8, wind_speed: 18, uv_index: 5 },
  { city: 'Houston', temperature: 85, humidity: 78, precipitation: 4.5, wind_speed: 10, uv_index: 8 },
  { city: 'Phoenix', temperature: 98, humidity: 25, precipitation: 0.2, wind_speed: 6, uv_index: 11 },
  { city: 'Seattle', temperature: 62, humidity: 80, precipitation: 5.8, wind_speed: 14, uv_index: 4 },
  { city: 'Miami', temperature: 88, humidity: 82, precipitation: 6.2, wind_speed: 15, uv_index: 10 },
  { city: 'Denver', temperature: 70, humidity: 35, precipitation: 1.5, wind_speed: 20, uv_index: 7 },
];

// Executive KPI Data (NEW)
const executiveKpiData = [
  { metric: 'Revenue', current: 4250000, target: 4000000, previous: 3800000, growth_rate: 11.8, quarter: 'Q1' },
  { metric: 'Gross Margin', current: 42.5, target: 40.0, previous: 38.2, growth_rate: 11.3, quarter: 'Q1' },
  { metric: 'Customer Acquisition', current: 2850, target: 2500, previous: 2200, growth_rate: 29.5, quarter: 'Q1' },
  { metric: 'Churn Rate', current: 4.2, target: 5.0, previous: 5.8, growth_rate: -27.6, quarter: 'Q1' },
  { metric: 'NPS Score', current: 72, target: 70, previous: 68, growth_rate: 5.9, quarter: 'Q1' },
  { metric: 'Revenue', current: 4580000, target: 4200000, previous: 4250000, growth_rate: 7.8, quarter: 'Q2' },
  { metric: 'Gross Margin', current: 43.8, target: 42.0, previous: 42.5, growth_rate: 3.1, quarter: 'Q2' },
  { metric: 'Customer Acquisition', current: 3120, target: 2800, previous: 2850, growth_rate: 9.5, quarter: 'Q2' },
  { metric: 'Churn Rate', current: 3.8, target: 4.5, previous: 4.2, growth_rate: -9.5, quarter: 'Q2' },
  { metric: 'NPS Score', current: 75, target: 72, previous: 72, growth_rate: 4.2, quarter: 'Q2' },
];

// E-commerce Analytics Sample Data
const ecommerceData = [
  { product: 'Electronics', orders: 4520, revenue: 892000, returns: 180, rating: 4.5, stock: 2800 },
  { product: 'Clothing', orders: 8920, revenue: 445000, returns: 890, rating: 4.2, stock: 12500 },
  { product: 'Home & Garden', orders: 3210, revenue: 384000, returns: 128, rating: 4.6, stock: 4200 },
  { product: 'Sports', orders: 2890, revenue: 312000, returns: 115, rating: 4.4, stock: 3100 },
  { product: 'Books', orders: 5680, revenue: 142000, returns: 85, rating: 4.7, stock: 8900 },
  { product: 'Beauty', orders: 4120, revenue: 268000, returns: 206, rating: 4.3, stock: 5600 },
  { product: 'Toys', orders: 2450, revenue: 196000, returns: 98, rating: 4.5, stock: 3800 },
  { product: 'Automotive', orders: 1280, revenue: 512000, returns: 38, rating: 4.4, stock: 890 },
];

// Project Management Sample Data
const projectData = [
  { project: 'Website Redesign', budget: 150000, spent: 125000, progress: 85, team_size: 8, days_remaining: 15 },
  { project: 'Mobile App', budget: 280000, spent: 195000, progress: 68, team_size: 12, days_remaining: 45 },
  { project: 'CRM Integration', budget: 95000, spent: 72000, progress: 78, team_size: 5, days_remaining: 22 },
  { project: 'Data Migration', budget: 65000, spent: 58000, progress: 92, team_size: 4, days_remaining: 8 },
  { project: 'Security Audit', budget: 45000, spent: 32000, progress: 72, team_size: 3, days_remaining: 18 },
  { project: 'API Development', budget: 120000, spent: 45000, progress: 35, team_size: 6, days_remaining: 60 },
  { project: 'Cloud Migration', budget: 200000, spent: 85000, progress: 42, team_size: 10, days_remaining: 75 },
  { project: 'Training Program', budget: 35000, spent: 28000, progress: 88, team_size: 2, days_remaining: 10 },
];

// Create Dataset objects
export const sampleDatasets: DataSet[] = [
  {
    id: 'sales-performance-dataset',
    name: 'Sales Performance',
    columns: [
      { name: 'date', type: 'string' },
      { name: 'region', type: 'string' },
      { name: 'product', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'revenue', type: 'number' },
      { name: 'profit', type: 'number' },
      { name: 'units', type: 'number' },
    ],
    data: salesPerformanceData,
    createdAt: new Date(),
  },
  {
    id: 'marketing-campaigns-dataset',
    name: 'Marketing Campaigns',
    columns: [
      { name: 'channel', type: 'string' },
      { name: 'impressions', type: 'number' },
      { name: 'clicks', type: 'number' },
      { name: 'conversions', type: 'number' },
      { name: 'spend', type: 'number' },
      { name: 'roi', type: 'number' },
      { name: 'date', type: 'string' },
    ],
    data: marketingCampaignsData,
    createdAt: new Date(),
  },
  {
    id: 'hr-analysis-dataset',
    name: 'HR / Employee Analytics',
    columns: [
      { name: 'department', type: 'string' },
      { name: 'employees', type: 'number' },
      { name: 'turnover_rate', type: 'number' },
      { name: 'avg_salary', type: 'number' },
      { name: 'satisfaction', type: 'number' },
      { name: 'training_hours', type: 'number' },
      { name: 'date', type: 'string' },
    ],
    data: hrData,
    createdAt: new Date(),
  },
  {
    id: 'finance-expenses-dataset',
    name: 'Finance / Expenses',
    columns: [
      { name: 'date', type: 'string' },
      { name: 'department', type: 'string' },
      { name: 'expense_type', type: 'string' },
      { name: 'amount', type: 'number' },
      { name: 'budget', type: 'number' },
      { name: 'variance', type: 'number' },
    ],
    data: financeExpensesData,
    createdAt: new Date(),
  },
  {
    id: 'operations-productivity-dataset',
    name: 'Operations / Productivity',
    columns: [
      { name: 'team', type: 'string' },
      { name: 'task_type', type: 'string' },
      { name: 'status', type: 'string' },
      { name: 'completion_time', type: 'number' },
      { name: 'date', type: 'string' },
      { name: 'tasks_count', type: 'number' },
    ],
    data: operationsProductivityData,
    createdAt: new Date(),
  },
  {
    id: 'executive-kpi-dataset',
    name: 'Executive KPI Overview',
    columns: [
      { name: 'metric', type: 'string' },
      { name: 'current', type: 'number' },
      { name: 'target', type: 'number' },
      { name: 'previous', type: 'number' },
      { name: 'growth_rate', type: 'number' },
      { name: 'quarter', type: 'string' },
    ],
    data: executiveKpiData,
    createdAt: new Date(),
  },
  {
    id: 'web-analytics-dataset',
    name: 'Web Analytics',
    columns: [
      { name: 'page', type: 'string' },
      { name: 'views', type: 'number' },
      { name: 'unique_visitors', type: 'number' },
      { name: 'bounce_rate', type: 'number' },
      { name: 'avg_time', type: 'number' },
      { name: 'conversions', type: 'number' },
      { name: 'date', type: 'string' },
    ],
    data: webAnalyticsData,
    createdAt: new Date(),
  },
  {
    id: 'medical-analysis-dataset',
    name: 'Medical Analysis',
    columns: [
      { name: 'condition', type: 'string' },
      { name: 'patients', type: 'number' },
      { name: 'avg_age', type: 'number' },
      { name: 'treatment_success', type: 'number' },
      { name: 'readmission_rate', type: 'number' },
      { name: 'cost', type: 'number' },
    ],
    data: medicalData,
    createdAt: new Date(),
  },
  {
    id: 'factory-operations-dataset',
    name: 'Factory Operations',
    columns: [
      { name: 'line', type: 'string' },
      { name: 'units_produced', type: 'number' },
      { name: 'defect_rate', type: 'number' },
      { name: 'efficiency', type: 'number' },
      { name: 'downtime_hours', type: 'number' },
      { name: 'energy_kwh', type: 'number' },
    ],
    data: factoryData,
    createdAt: new Date(),
  },
  {
    id: 'global-overview-dataset',
    name: 'Global Overview',
    columns: [
      { name: 'country', type: 'string' },
      { name: 'revenue', type: 'number' },
      { name: 'users', type: 'number' },
      { name: 'growth', type: 'number' },
      { name: 'market_share', type: 'number' },
      { name: 'offices', type: 'number' },
    ],
    data: globalData,
    createdAt: new Date(),
  },
  {
    id: 'weather-analytics-dataset',
    name: 'Weather Analytics',
    columns: [
      { name: 'city', type: 'string' },
      { name: 'temperature', type: 'number' },
      { name: 'humidity', type: 'number' },
      { name: 'precipitation', type: 'number' },
      { name: 'wind_speed', type: 'number' },
      { name: 'uv_index', type: 'number' },
    ],
    data: weatherData,
    createdAt: new Date(),
  },
  {
    id: 'ecommerce-analytics-dataset',
    name: 'E-commerce Analytics',
    columns: [
      { name: 'product', type: 'string' },
      { name: 'orders', type: 'number' },
      { name: 'revenue', type: 'number' },
      { name: 'returns', type: 'number' },
      { name: 'rating', type: 'number' },
      { name: 'stock', type: 'number' },
    ],
    data: ecommerceData,
    createdAt: new Date(),
  },
  {
    id: 'project-management-dataset',
    name: 'Project Management',
    columns: [
      { name: 'project', type: 'string' },
      { name: 'budget', type: 'number' },
      { name: 'spent', type: 'number' },
      { name: 'progress', type: 'number' },
      { name: 'team_size', type: 'number' },
      { name: 'days_remaining', type: 'number' },
    ],
    data: projectData,
    createdAt: new Date(),
  },
];

// Map template IDs to their corresponding dataset IDs
export const templateDatasetMap: Record<string, string> = {
  'executive-kpi': 'executive-kpi-dataset',
  'sales-performance': 'sales-performance-dataset',
  'marketing-analysis': 'marketing-campaigns-dataset',
  'hr-insights': 'hr-analysis-dataset',
  'finance-summary': 'finance-expenses-dataset',
  'operations-monitoring': 'operations-productivity-dataset',
  'hr-analysis': 'hr-analysis-dataset',
  'web-analysis': 'web-analytics-dataset',
  'sales-report': 'sales-performance-dataset',
  'medical-analysis': 'medical-analysis-dataset',
  'factory-analysis': 'factory-operations-dataset',
  'global-analysis': 'global-overview-dataset',
  'weather-analytics': 'weather-analytics-dataset',
  'ecommerce-analytics': 'ecommerce-analytics-dataset',
  'project-management': 'project-management-dataset',
};

export const getDatasetForTemplate = (templateId: string): DataSet | undefined => {
  const datasetId = templateDatasetMap[templateId];
  return sampleDatasets.find(ds => ds.id === datasetId);
};

export const getDatasetById = (datasetId: string): DataSet | undefined => {
  return sampleDatasets.find(ds => ds.id === datasetId);
};
