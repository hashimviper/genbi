# VisoryBI — User Manual

**Version:** 2.0  
**Last Updated:** March 8, 2026  
**Platform:** Browser-based Web Application (100% Offline)

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Authentication & Roles](#2-authentication--roles)
3. [Navigation & Sidebar](#3-navigation--sidebar)
4. [Dashboard Templates](#4-dashboard-templates)
5. [Time Series & Forecasting Template](#5-time-series--forecasting-template)
6. [Data Sources & File Upload](#6-data-sources--file-upload)
7. [Dashboard Builder](#7-dashboard-builder)
8. [Dashboard View Mode](#8-dashboard-view-mode)
9. [Chart Types & Widgets](#9-chart-types--widgets)
10. [Ask Data (Natural Language Queries)](#10-ask-data-natural-language-queries)
11. [Data Transformation](#11-data-transformation)
12. [Statistical Analysis & Forecasting](#12-statistical-analysis--forecasting)
13. [Global Filters & Cross-Filtering](#13-global-filters--cross-filtering)
14. [Export Options](#14-export-options)
15. [Presentation Mode](#15-presentation-mode)
16. [Dashboard Versioning](#16-dashboard-versioning)
17. [Collaboration & Workspace](#17-collaboration--workspace)
18. [Admin Panel (Owner Only)](#18-admin-panel-owner-only)
19. [IndexedDB Data Storage Viewer](#19-indexeddb-data-storage-viewer)
20. [Keyboard Shortcuts](#20-keyboard-shortcuts)
21. [Onboarding Tour](#21-onboarding-tour)
22. [Accessibility Features](#22-accessibility-features)
23. [Troubleshooting](#23-troubleshooting)

---

## 1. Getting Started

### What is VisoryBI?
VisoryBI is a fully offline, browser-based Business Intelligence (BI) platform. All data processing, visualization, and storage happen locally in your browser — no cloud, no server, no data leaves your machine.

### First Launch
1. Open the application URL in your browser
2. A cinematic loading animation plays (once per session)
3. You land on the **Home Page** with feature highlights
4. Click **"Get Started"** or **"Sign In"** to proceed

### System Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- Minimum 1024px screen width recommended
- No internet required after initial load (PWA supported)

---

## 2. Authentication & Roles

### Signing In
1. Navigate to `/auth` or click **Sign In** in the sidebar
2. Enter your **username** and **password**
3. Click **Login**

### Creating an Account
1. On the auth page, switch to the **Register** tab
2. Enter a username and password
3. Select your role: **Editor** or **Viewer**
4. Click **Register**

### Built-in Accounts

| Username | Role | Notes |
|----------|------|-------|
| Viper | Admin/Owner | Full access, cannot be deleted |
| Thaslee | Editor | Pre-seeded account |
| Naveen | Editor | Pre-seeded account |
| Abd | Editor | Pre-seeded account |

### Role Permissions

| Feature | Admin (Owner) | Editor | Viewer |
|---------|:---:|:---:|:---:|
| View dashboards | ✅ | ✅ | ✅ |
| Browse templates | ✅ | ✅ | ✅ |
| Create dashboards | ✅ | ✅ | ❌ |
| Upload data | ✅ | ✅ | ❌ |
| Dashboard Builder | ✅ | ✅ | ❌ |
| Collaboration | ✅ | ✅ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ |
| Data Storage Viewer | ✅ | ❌ | ❌ |

### Password Reset
1. Click **"Forgot Password?"** on the login form
2. Enter your username
3. Set a new password
4. Note: The Owner account (Viper) password cannot be reset

### Signing Out
- Click the **logout icon** next to your username in the sidebar bottom section

---

## 3. Navigation & Sidebar

The sidebar is the primary navigation tool. It can be **collapsed/expanded** using the arrow button on its edge.

### Sidebar Items
| Item | Path | Visibility |
|------|------|------------|
| Home | `/` | All users |
| Collaboration | `/workspace` | Editors+ |
| Dashboard Builder | `/builder` | Editors+ |
| Templates | `/templates` | All users |
| My Dashboards | `/dashboards` | All users |
| Data Sources | `/data` | Editors+ |
| Admin Panel | `/admin` | Owner only |

### Bottom Section
- **User avatar** with username and role badge
- **Sign Out** button
- **"New Dashboard"** quick-action button → navigates to Templates

---

## 4. Dashboard Templates

### Accessing Templates
Navigate to **Templates** from the sidebar or click **"New Dashboard"**.

### Available Templates (16+)

| Template | Category | Widgets | Key Features |
|----------|----------|:---:|--------------|
| Sales Performance | Sales | 9 | Revenue, profit, units, target achievement |
| Growth Dashboard | Sales | 9 | User acquisition, retention, churn analysis |
| Sales Dashboard | Sales | 11 | Monthly revenue, orders, customer growth |
| HR Insights | Human Resources | 9 | Headcount, salary, satisfaction, turnover |
| HR Analytics | Human Resources | 11 | Department metrics, training distribution |
| Finance KPI | Finance | 9 | Budget vs actual, variance, YoY growth |
| Marketing Analysis | Marketing | 9 | Campaign ROI, channel performance |
| Operations Dashboard | Manufacturing | 9 | Output, efficiency, defects, downtime |
| Executive KPI | General | 9 | High-level metrics, growth rate gauges |
| **Time Series & Forecasting** | **Analytics** | **14** | **24-month trend data, forecasting, anomaly detection** |
| Web Analytics | Digital Marketing | 11 | Traffic, bounce rate, conversions |
| Medical Analysis | Healthcare | 11 | Patient metrics, treatment success |
| Factory Analysis | Manufacturing | 11 | Production lines, defect rates |
| Global Analysis | Global | 11 | Multi-country revenue, market share |
| Weather Analytics | Environment | 11 | Temperature, humidity, precipitation |
| E-commerce | E-commerce | 11 | Orders, returns, ratings, stock |
| Project Management | Project Management | 11 | Budget, progress, team size |
| Blank Canvas | General | 0 | Start from scratch |

### Using a Template
1. Click on a template card
2. A dialog opens with options:
   - **Dashboard Name**: Customize the name
   - **Use Sample Data**: Toggle to use built-in data (recommended for first-time)
   - **Link Your Dataset**: Choose your uploaded dataset instead
3. Click **"Create Dashboard"**
4. You're redirected to the Dashboard Builder with all widgets pre-configured

---

## 5. Time Series & Forecasting Template

This is the dedicated analytics template designed for time-based analysis:

### Sample Data
- **24 months** of business metrics (Jan 2023 – Dec 2024)
- **7 columns**: month, revenue, orders, customers, avg_order_value, churn_rate, support_tickets

### Included Widgets (14 total)
1. **KPI Cards** (3): Total Revenue, Total Orders, Avg Order Value
2. **Gauge**: Churn Rate meter
3. **Line Chart**: Revenue Trend (Monthly) — primary time series
4. **Area Chart**: Orders Over Time — volume tracking
5. **Bar Chart**: Customer Growth — month-by-month comparison
6. **Combo Chart**: Revenue vs Orders — dual-axis overlay
7. **Sparklines** (2): Revenue trend & Churn rate mini-charts
8. **Scatter Plot**: Orders vs Revenue correlation
9. **Waterfall Chart**: Month-over-month revenue changes
10. **Radar Chart**: Multi-metric snapshot across months
11. **Data Table**: Full time series data with search/filter

### Analytics Features Available
- **Trend Analysis Panel**: Auto-calculates statistical trends comparing dataset halves
- **Insight Summary**: AI-driven analysis of patterns, outliers, and recommendations
- **Anomaly Detection**: Z-score and IQR-based outlier identification
- **Forecasting**: Linear regression projection with dotted forecast lines
- **Cross-Filtering**: Click any chart to filter all others
- **Ask Data**: Natural language queries like "revenue last 6 months" or "top 5 months by orders"

---

## 6. Data Sources & File Upload

### Uploading Data
1. Navigate to **Data Sources** (`/data`)
2. Click **"Upload"** or drag a file into the upload zone
3. Supported formats: **CSV**, **Excel (XLSX)**
4. The system automatically:
   - Parses column headers
   - Detects column types (string, number, date)
   - Limits to 2,000 rows for performance
   - Routes large datasets (>2MB) to IndexedDB storage

### Managing Datasets
- **Preview**: Click a dataset to see paginated data (200 rows/page)
- **Column badges**: Each column shows its detected type
- **Delete**: Hover over a dataset to reveal the delete button

### Storage Strategy
| Dataset Size | Storage |
|-------------|---------|
| < 2 MB | localStorage (Zustand persist) |
| ≥ 2 MB | IndexedDB (automatic) |

---

## 7. Dashboard Builder

### Accessing
Navigate to **Dashboard Builder** (`/builder`) or create from a template.

### Interface Layout
- **Left Panel**: Dataset switcher, widget palette
- **Center**: Dashboard canvas (drag-and-drop grid)
- **Top Bar**: Dashboard name, filters, export, share, branding, undo/redo

### Adding Widgets
1. Click a chart type from the **Widget Palette** (left panel)
2. Widget appears on the canvas with auto-configured fields
3. **Double-click** a widget to edit its configuration

### Widget Configuration
- **Title**: Custom widget title
- **Dataset**: Select data source
- **X-Axis / Y-Axis**: Choose columns for chart axes
- **Label / Value Fields**: For pie, donut, funnel, etc.
- **Aggregation**: Sum, Average, Count, Min, Max
- **Prefix/Suffix**: For KPI formatting (e.g., "$" prefix, "%" suffix)

### Drag & Drop
- Drag widgets by their grip handle to reorder
- Widgets snap to a grid layout

### Branding
- Click the **branding icon** in the header
- Set: Company Name, Dashboard Title, Logo URL
- Branding appears as a sticky header in View Mode

### Theme Configuration
- Background type: Solid, Gradient, or Image
- Card opacity adjustment
- Pre-built theme selection

### Data Transformation
- Click the **transform icon** to open the Data Transform Dialog
- Create calculated columns (e.g., `[Revenue] - [Cost]`)
- Rename columns, cast types

### Undo / Redo
- **Ctrl+Z**: Undo last action
- **Ctrl+Y**: Redo last undone action
- Works for widget add/remove/reorder operations

---

## 8. Dashboard View Mode

### Accessing
- From **My Dashboards**, click a dashboard card
- URL format: `/view/:dashboardId`

### Features
- **Read-only**: No editing controls visible
- **Sticky branding header**: Company name/logo fixed at top during scroll
- **Fullscreen mode**: Click the fullscreen icon (browser API)
- **Widget fullscreen**: Expand individual charts
- **Cross-filtering**: Click chart elements to filter other widgets
- **Insight modal**: Double-click a widget for statistical analysis
- **Export/Share**: Available from the header toolbar

### Layout Sections
1. **Key Metrics** (KPIs & Gauges) — top row
2. **Insight Summary** — AI-generated analysis with recommendations
3. **Visualizations** — all chart widgets
4. **Data Table** — pinned full-width at bottom

---

## 9. Chart Types & Widgets

### Standard Charts (6)
| Type | Best For |
|------|----------|
| **Bar Chart** | Category comparisons |
| **Line Chart** | Trends over time |
| **Pie Chart** | Proportional distribution |
| **Area Chart** | Volume trends with filled regions |
| **Scatter Plot** | Correlation between two metrics |
| **Data Table** | Raw data display with sort/filter |

### Metrics (3)
| Type | Best For |
|------|----------|
| **KPI Card** | Single value highlights (e.g., Total Revenue: $1.2M) |
| **Gauge** | Progress toward a target (0-100%) |
| **Sparkline** | Compact inline trend line |

### Advanced Charts (8)
| Type | Best For |
|------|----------|
| **Donut Chart** | Proportional display with center stat |
| **Horizontal Bar** | Category comparison (horizontal layout) |
| **Funnel Chart** | Stage-by-stage conversion |
| **Treemap** | Hierarchical area-based distribution |
| **Radar Chart** | Multi-axis metric comparison |
| **Combo Chart** | Dual-axis (bar + line overlay) |
| **Waterfall** | Sequential positive/negative changes |
| **Stacked Bar** | Multi-series category breakdown |

### Widget Features (All Types)
- Smart field auto-assignment
- Multiple aggregation modes
- Cross-filtering support
- Chart-level fullscreen
- Double-click for insight modal
- Ranking controls (top N / bottom N)
- Summary metrics panel

---

## 10. Ask Data (Natural Language Queries)

### How to Use
1. Click **"Ask Data"** button in the Dashboard Builder header
2. Or **double-click** the canvas background
3. Type a question in natural language
4. The system generates a visualization

### Supported Query Types

| Query Pattern | Example | Result |
|--------------|---------|--------|
| Simple metric | "show revenue" | Bar chart of revenue |
| By dimension | "revenue by region" | Grouped bar chart |
| Top N | "top 10 products by revenue" | Filtered bar chart |
| Time-based | "sales last 6 months" | Time-filtered line chart |
| Comparison | "revenue vs cost by region" | Combo chart |
| Aggregation | "average salary by department" | Bar chart with avg |
| Distribution | "distribution of revenue" | Pie/donut chart |

### Tips
- Use column names from your dataset for best results
- Queries are case-insensitive
- The parser uses pattern matching — keep queries simple and direct

---

## 11. Data Transformation

### Accessing
Click the **transform icon** (⚡) in the Dashboard Builder toolbar.

### Available Operations
1. **Calculated Columns**: Create new columns using expressions
   - Syntax: `[ColumnName]` references a column
   - Example: `[Revenue] - [Cost]` creates a Profit column
   - Supports: `+`, `-`, `*`, `/` operators
2. **Column Renaming**: Change display names
3. **Type Casting**: Convert between string/number/date
4. **Data Joins**: Left-join two datasets on a common key

---

## 12. Statistical Analysis & Forecasting

### Trend Analysis Panel
- Automatically visible in Dashboard View Mode
- Compares first half vs second half of dataset
- Shows percentage change and direction arrows
- Mini sparklines for each metric

### Anomaly Detection
- **Z-Score Method**: Flags values >2 standard deviations from mean
- **IQR Method**: Flags values outside 1.5× interquartile range
- Outliers highlighted in insight summaries

### Forecasting
- **Linear Regression**: Least-squares trend projection
- Projects 3 future periods beyond existing data
- Shows R² goodness-of-fit score
- Moving average smoothing available

### Summary Statistics
Available for any numeric column:
- Mean, Median, Standard Deviation
- Min, Max, Range
- Q1, Q3, IQR
- Skewness
- Outlier count

---

## 13. Global Filters & Cross-Filtering

### Global Filter Bar
- Located at the top of the Dashboard Builder
- Filter by any column across ALL widgets simultaneously
- Multiple filters can be applied at once

### Cross-Filtering
- Click on a bar, slice, or data point in any chart
- All other charts filter to match the selected value
- Click again to clear the filter
- Works across all chart types

---

## 14. Export Options

### PDF Export
- Captures the entire dashboard as a multi-page PDF
- Includes branding header
- Uses html2canvas + jsPDF

### PNG Export
- Exports dashboard as a single image
- High-resolution capture

### PowerPoint (PPTX) Export
- Each widget becomes a separate slide
- Uses pptxgenjs library
- Includes titles and data
- No cloud dependency

### CSV Export
- Export filtered/aggregated data from Data Table widgets
- Downloads directly to your device

### How to Export
1. Click the **Export** icon in the dashboard header
2. Select format: PDF, PNG, PPTX, or CSV
3. File downloads automatically

---

## 15. Presentation Mode

### Accessing
Click the **Presentation** icon in the Dashboard Builder or View Mode header.

### Features
- Full-screen overlay with dark background
- Auto-cycles through widgets every N seconds (configurable)
- Manual navigation with arrow keys
- ESC to exit
- Ideal for meeting displays and lobby screens

---

## 16. Dashboard Versioning

### Saving Snapshots
1. Click the **Version** icon in the Dashboard Builder
2. Enter a version name (e.g., "Draft v1", "Final")
3. Click **Save Snapshot**

### Restoring Versions
1. Open the Version Manager
2. Browse saved snapshots with timestamps
3. Click **Restore** to revert to that state
4. Stored in localStorage — persists across sessions

---

## 17. Collaboration & Workspace

### Accessing
Navigate to **Collaboration** (`/workspace`) — requires Editor role.

### Features
- **Organization**: Default "VisoryBI Team" with custom org creation
- **Team Members**: View all members with roles and online status
- **Online Presence**: Real-time status with 30-second heartbeat
- **Team Creation**: Group members into named teams
- **Dashboard Sharing**: Share dashboards with team members
- **Notifications**: Real-time alerts for team events

### Online Status
| Status | Meaning |
|--------|---------|
| 🟢 Active now | Heartbeat within last 2 minutes |
| ⚫ Offline | No heartbeat for 2+ minutes |

---

## 18. Admin Panel (Owner Only)

Accessible only to the Owner account (Viper) at `/admin`.

### Widget Builder Tab
- **17 chart type selectors** organized by category
- Auto-field configuration based on dataset
- Smart title generation
- Target dashboard selection
- **3D Charts toggle**: Enable/disable 3D chart variants

### Data Storage Tab
- **IndexedDB Viewer**: Graphical view of all stored datasets
- Summary cards: Total datasets, rows, and columns
- Per-dataset info: Name, row count, column count, file size
- **View button**: Opens dataset in chart or table format
- **Delete**: Remove individual datasets or clear all

---

## 19. IndexedDB Data Storage Viewer

### What it Shows
- All datasets stored in browser IndexedDB (large files >2MB)
- Real-time summary statistics

### Viewing a Dataset
1. Click the **eye icon** on any dataset row
2. Choose view mode:
   - **Charts**: Auto-generated bar, line, and pie charts
   - **Table**: Paginated data table with column type badges
3. Charts display up to 20 rows; table shows up to 50 rows

### Managing Storage
- **Delete**: Remove individual datasets
- **Clear All**: Wipe all IndexedDB data
- **Refresh**: Reload dataset list

---

## 20. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo last dashboard change |
| `Ctrl + Y` | Redo last undone change |
| `Ctrl + S` | Save dashboard |
| `Ctrl + E` | Open export menu |
| `Delete` | Remove selected widget |
| `Escape` | Exit fullscreen / close dialogs |
| `?` | Show keyboard shortcut help |

---

## 21. Onboarding Tour

### First-Time Experience
A guided 4-step walkthrough appears for new users:

1. **Upload Data** — How to import CSV/Excel files
2. **Pick a Template** — Browse and select pre-built dashboards
3. **Customize** — Edit widgets, apply filters, configure branding
4. **Export & Share** — Generate PDF/PNG/PPTX and share links

### Re-triggering the Tour
The tour runs once per session. Clear `sessionStorage` to see it again, or access it from settings.

---

## 22. Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard-focusable
- `Tab` / `Shift+Tab` to navigate between elements
- `Enter` / `Space` to activate buttons and links
- `Escape` to close modals, dialogs, and fullscreen

### Screen Reader Support
- Semantic HTML5 elements (`<nav>`, `<main>`, `<aside>`, `<header>`)
- ARIA labels on all icon-only buttons
- Radix UI primitives provide built-in ARIA attributes
- Form labels associated with inputs via `htmlFor`
- Toast notifications announced to screen readers

### Visual Accessibility
- **Color contrast**: Semantic design tokens ensure WCAG-compliant contrast ratios
- **Dark/Light mode**: System-adaptive theming via CSS custom properties
- **Focus indicators**: Visible focus rings on all interactive elements
- **Responsive design**: Works from 320px to 4K displays
- **Text scaling**: Relative font sizing (rem units) respects browser zoom
- **Reduced motion**: CSS `prefers-reduced-motion` respected by animations

### Data Accessibility
- **Alt text**: Chart descriptions available via tooltips
- **Data tables**: All chart data accessible in tabular format
- **Column type badges**: Visual + text indicators for data types
- **Summary metrics**: Numeric values always displayed alongside visual charts

### Interactive Accessibility
- **Drag-and-drop**: Alternative button controls for widget reordering
- **Color palettes**: Designed for color-blind users (distinguishable hues)
- **Error states**: Clear text messages with destructive color coding
- **Loading states**: Spinner animations with text labels
- **Empty states**: Descriptive messages when no data is available

---

## 23. Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| Data not appearing in charts | Check that the correct dataset is selected in widget config |
| Upload fails silently | File may exceed localStorage limit; large files auto-route to IndexedDB |
| Charts show "No data" | Ensure X-axis and Y-axis fields are configured correctly |
| Widgets overlap | Drag widgets to reorder; they snap to grid positions |
| Export is blank | Ensure dashboard has at least one widget with data |
| Password reset fails | Owner account (Viper) password cannot be reset |
| Sidebar items missing | Role-based visibility — sign in with Editor or Admin role |
| Filters not working | Ensure filter column exists in the widget's dataset |
| Template shows no data | Toggle "Use sample data" when creating from template |
| Browser storage full | Use Admin > Data Storage to clear old datasets |

### Clearing All Data
To completely reset the application:
1. Open browser DevTools (F12)
2. Go to Application > Storage
3. Click "Clear site data"
4. Refresh the page

### Browser Compatibility
| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Fully supported |
| Firefox 90+ | ✅ Fully supported |
| Edge 90+ | ✅ Fully supported |
| Safari 15+ | ✅ Supported |
| Mobile Chrome/Safari | ⚠️ Functional (limited screen space) |

---

## Glossary

| Term | Definition |
|------|-----------|
| **KPI** | Key Performance Indicator — a single metric value |
| **Widget** | A chart, table, or metric card on the dashboard |
| **Dataset** | A collection of rows and columns (from CSV/Excel upload) |
| **Cross-filtering** | Clicking a chart element filters all other charts |
| **Aggregation** | Mathematical operation applied to grouped data (sum, avg, etc.) |
| **IndexedDB** | Browser storage for large datasets (>2MB) |
| **PPTX** | PowerPoint file format for slide deck export |
| **PWA** | Progressive Web App — installable offline web application |
| **RBAC** | Role-Based Access Control — permissions tied to user roles |
| **Sparkline** | A small inline chart showing trend direction |

---

*VisoryBI User Manual — Generated March 8, 2026*
