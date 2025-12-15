import { DataSet } from '@/types/dashboard';

// HR Analysis Sample Data
const hrData = [
  { department: 'Engineering', employees: 45, turnover_rate: 8.2, avg_salary: 95000, satisfaction: 4.2, training_hours: 32 },
  { department: 'Sales', employees: 32, turnover_rate: 12.5, avg_salary: 72000, satisfaction: 3.8, training_hours: 24 },
  { department: 'Marketing', employees: 18, turnover_rate: 6.1, avg_salary: 68000, satisfaction: 4.0, training_hours: 28 },
  { department: 'Finance', employees: 12, turnover_rate: 4.3, avg_salary: 85000, satisfaction: 4.1, training_hours: 20 },
  { department: 'HR', employees: 8, turnover_rate: 3.2, avg_salary: 62000, satisfaction: 4.5, training_hours: 40 },
  { department: 'Operations', employees: 28, turnover_rate: 9.8, avg_salary: 58000, satisfaction: 3.6, training_hours: 18 },
  { department: 'Legal', employees: 6, turnover_rate: 2.1, avg_salary: 110000, satisfaction: 4.3, training_hours: 15 },
  { department: 'IT Support', employees: 15, turnover_rate: 7.5, avg_salary: 65000, satisfaction: 3.9, training_hours: 35 },
];

// Web Analytics Sample Data
const webAnalyticsData = [
  { page: 'Homepage', views: 45230, unique_visitors: 32100, bounce_rate: 35.2, avg_time: 125, conversions: 890 },
  { page: 'Products', views: 28450, unique_visitors: 21300, bounce_rate: 42.1, avg_time: 180, conversions: 1250 },
  { page: 'Pricing', views: 18920, unique_visitors: 15600, bounce_rate: 28.5, avg_time: 210, conversions: 720 },
  { page: 'Blog', views: 35600, unique_visitors: 28400, bounce_rate: 55.3, avg_time: 320, conversions: 180 },
  { page: 'Contact', views: 8920, unique_visitors: 7800, bounce_rate: 22.1, avg_time: 95, conversions: 450 },
  { page: 'About', views: 12340, unique_visitors: 10200, bounce_rate: 48.7, avg_time: 85, conversions: 65 },
  { page: 'Docs', views: 22100, unique_visitors: 18500, bounce_rate: 31.2, avg_time: 420, conversions: 320 },
  { page: 'Support', views: 9870, unique_visitors: 8200, bounce_rate: 25.8, avg_time: 280, conversions: 890 },
];

// Sales Report Sample Data
const salesData = [
  { month: 'January', revenue: 125000, orders: 342, avg_order: 365, new_customers: 89, region: 'North' },
  { month: 'February', revenue: 142000, orders: 398, avg_order: 357, new_customers: 112, region: 'North' },
  { month: 'March', revenue: 168000, orders: 456, avg_order: 368, new_customers: 134, region: 'South' },
  { month: 'April', revenue: 155000, orders: 421, avg_order: 368, new_customers: 98, region: 'East' },
  { month: 'May', revenue: 189000, orders: 512, avg_order: 369, new_customers: 156, region: 'West' },
  { month: 'June', revenue: 201000, orders: 548, avg_order: 367, new_customers: 178, region: 'North' },
  { month: 'July', revenue: 178000, orders: 489, avg_order: 364, new_customers: 145, region: 'South' },
  { month: 'August', revenue: 195000, orders: 534, avg_order: 365, new_customers: 167, region: 'East' },
  { month: 'September', revenue: 212000, orders: 578, avg_order: 367, new_customers: 189, region: 'West' },
  { month: 'October', revenue: 228000, orders: 612, avg_order: 373, new_customers: 201, region: 'North' },
  { month: 'November', revenue: 256000, orders: 689, avg_order: 372, new_customers: 234, region: 'South' },
  { month: 'December', revenue: 298000, orders: 798, avg_order: 373, new_customers: 278, region: 'East' },
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

// General Report Sample Data
const generalReportData = [
  { category: 'Product A', q1: 45000, q2: 52000, q3: 48000, q4: 61000, yoy_growth: 12.5 },
  { category: 'Product B', q1: 38000, q2: 41000, q3: 45000, q4: 52000, yoy_growth: 18.2 },
  { category: 'Product C', q1: 62000, q2: 58000, q3: 65000, q4: 72000, yoy_growth: 8.9 },
  { category: 'Product D', q1: 28000, q2: 32000, q3: 35000, q4: 42000, yoy_growth: 25.1 },
  { category: 'Product E', q1: 51000, q2: 49000, q3: 53000, q4: 58000, yoy_growth: 6.8 },
  { category: 'Service A', q1: 125000, q2: 132000, q3: 145000, q4: 168000, yoy_growth: 22.4 },
  { category: 'Service B', q1: 89000, q2: 95000, q3: 102000, q4: 115000, yoy_growth: 15.6 },
  { category: 'Service C', q1: 72000, q2: 78000, q3: 82000, q4: 91000, yoy_growth: 11.2 },
];

// Finance Dashboard Sample Data
const financeData = [
  { account: 'Revenue', jan: 520000, feb: 548000, mar: 612000, apr: 589000, may: 645000, jun: 698000 },
  { account: 'COGS', jan: 312000, feb: 328800, mar: 367200, apr: 353400, may: 387000, jun: 418800 },
  { account: 'Gross Profit', jan: 208000, feb: 219200, mar: 244800, apr: 235600, may: 258000, jun: 279200 },
  { account: 'Operating Expenses', jan: 125000, feb: 128000, mar: 135000, apr: 132000, may: 138000, jun: 142000 },
  { account: 'Net Income', jan: 83000, feb: 91200, mar: 109800, apr: 103600, may: 120000, jun: 137200 },
  { account: 'Cash Flow', jan: 95000, feb: 102000, mar: 125000, apr: 118000, may: 135000, jun: 152000 },
  { account: 'Investments', jan: 45000, feb: 48000, mar: 52000, apr: 55000, may: 58000, jun: 62000 },
  { account: 'Liabilities', jan: 280000, feb: 275000, mar: 268000, apr: 262000, may: 255000, jun: 248000 },
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
    id: 'hr-analysis-dataset',
    name: 'HR Analysis Data',
    columns: [
      { name: 'department', type: 'string' },
      { name: 'employees', type: 'number' },
      { name: 'turnover_rate', type: 'number' },
      { name: 'avg_salary', type: 'number' },
      { name: 'satisfaction', type: 'number' },
      { name: 'training_hours', type: 'number' },
    ],
    data: hrData,
    createdAt: new Date(),
  },
  {
    id: 'web-analytics-dataset',
    name: 'Web Analytics Data',
    columns: [
      { name: 'page', type: 'string' },
      { name: 'views', type: 'number' },
      { name: 'unique_visitors', type: 'number' },
      { name: 'bounce_rate', type: 'number' },
      { name: 'avg_time', type: 'number' },
      { name: 'conversions', type: 'number' },
    ],
    data: webAnalyticsData,
    createdAt: new Date(),
  },
  {
    id: 'sales-report-dataset',
    name: 'Sales Report Data',
    columns: [
      { name: 'month', type: 'string' },
      { name: 'revenue', type: 'number' },
      { name: 'orders', type: 'number' },
      { name: 'avg_order', type: 'number' },
      { name: 'new_customers', type: 'number' },
      { name: 'region', type: 'string' },
    ],
    data: salesData,
    createdAt: new Date(),
  },
  {
    id: 'medical-analysis-dataset',
    name: 'Medical Analysis Data',
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
    name: 'Factory Operations Data',
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
    name: 'Global Overview Data',
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
    name: 'Weather Analytics Data',
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
    id: 'general-report-dataset',
    name: 'General Report Data',
    columns: [
      { name: 'category', type: 'string' },
      { name: 'q1', type: 'number' },
      { name: 'q2', type: 'number' },
      { name: 'q3', type: 'number' },
      { name: 'q4', type: 'number' },
      { name: 'yoy_growth', type: 'number' },
    ],
    data: generalReportData,
    createdAt: new Date(),
  },
  {
    id: 'finance-dashboard-dataset',
    name: 'Finance Dashboard Data',
    columns: [
      { name: 'account', type: 'string' },
      { name: 'jan', type: 'number' },
      { name: 'feb', type: 'number' },
      { name: 'mar', type: 'number' },
      { name: 'apr', type: 'number' },
      { name: 'may', type: 'number' },
      { name: 'jun', type: 'number' },
    ],
    data: financeData,
    createdAt: new Date(),
  },
  {
    id: 'ecommerce-analytics-dataset',
    name: 'E-commerce Analytics Data',
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
    name: 'Project Management Data',
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
  'hr-analysis': 'hr-analysis-dataset',
  'web-analysis': 'web-analytics-dataset',
  'sales-report': 'sales-report-dataset',
  'medical-analysis': 'medical-analysis-dataset',
  'factory-analysis': 'factory-operations-dataset',
  'global-analysis': 'global-overview-dataset',
  'weather-analytics': 'weather-analytics-dataset',
  'general-report': 'general-report-dataset',
  'finance-dashboard': 'finance-dashboard-dataset',
  'ecommerce-analytics': 'ecommerce-analytics-dataset',
  'project-management': 'project-management-dataset',
};

export const getDatasetForTemplate = (templateId: string): DataSet | undefined => {
  const datasetId = templateDatasetMap[templateId];
  return sampleDatasets.find(ds => ds.id === datasetId);
};
