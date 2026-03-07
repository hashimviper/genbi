## Objective:  
Implement missing usability features, improve dataset handling for large datasets, and complete template UI enhancements **without removing any existing functionality**.

All current working features such as:

- Cross filtering
- Chart deletion
- Dashboard creation
- Dataset import
- Existing templates

**must remain unchanged.**

---

# 1. Canvas Double-Click Q&A Feature

## Problem

Double-click on the dashboard canvas does not open the **Q&A query dialog**.

This happens because the event listener checks:

```
e.target === e.currentTarget
```

But clicks often land on **child elements inside the canvas**, causing the condition to fail.

---

## Implementation

File:

```
src/pages/DashboardBuilderPage.tsx
```

### Step 1 — Add widget identifier

Every widget container must include:

```
data-widget-id={widget.id}
```

Example wrapper:

```
<div
  key={widget.id}
  data-widget-id={widget.id}
  className="widget-container"
>
```

---

### Step 2 — Update canvas double-click logic

Replace the existing double-click condition with a **closest() widget detection**.

```
const handleCanvasDoubleClick = (e: React.MouseEvent) => {

  const target = e.target as HTMLElement;

  const clickedWidget = target.closest("[data-widget-id]");

  if (!clickedWidget) {
      setQaDialogOpen(true);
  }

};
```

---

### Step 3 — Attach handler to canvas

```
<div
 className="dashboard-canvas select-none"
 onDoubleClick={handleCanvasDoubleClick}
>
```

---

### Step 4 — Keep toolbar fallback

The existing **"Ask Data" button in the toolbar must remain** as a manual Q&A trigger.

---

# 2. Large Dataset Support (1000+ Rows)

## Problem

Large datasets work when imported manually but **templates struggle with large datasets** and create redundant rendering.

---

## Solution

Add **dataset processing + virtualization**.

---

## Step 1 — Dataset Normalization

File:

```
src/utils/datasetProcessor.ts
```

Create a processing utility:

```
export function normalizeDataset(data:any[]) {

  const MAX_ROWS = 2000

  if(data.length > MAX_ROWS){

    return data.slice(0, MAX_ROWS)

  }

  return data
}
```

Use this during dataset import.

---

## Step 2 — Chart Aggregation

Before rendering charts:

```
if(dataset.length > 100){
   applyAutoAggregation(dataset)
}
```

Aggregation methods:

- count
- sum
- average
- groupBy category

---

## Step 3 — Virtual Table Rendering

Install

```
react-window
```

Use it in dataset preview tables.

Example:

```
FixedSizeList
```

This allows **10,000+ rows without UI lag**.

---

# 3. Template Icons Inside Template Cards

## Problem

Icons appear near **template categories**, but **individual templates still show empty icon placeholders**.

Each template card contains a **dedicated icon box** that must be populated.

---

## Implementation

File:

```
src/pages/TemplatesPage.tsx
```

---

### Step 1 — Extend template metadata

Example:

```
{
 id: "hr-analytics-1",
 name: "HR Workforce Overview",
 department: "HR",
 icon: "users"
}
```

---

### Step 2 — Create icon mapper

```
import {
 Users,
 Database,
 FolderKanban,
 BarChart3,
 Briefcase,
 ShoppingCart
} from "lucide-react"
```

```
const iconMap = {
 hr: Users,
 data: Database,
 analytics: BarChart3,
 sales: ShoppingCart,
 business: Briefcase,
 dashboard: FolderKanban
}
```

---

### Step 3 — Render inside icon box

```
const IconComponent = iconMap[template.department] || BarChart3

<IconComponent size={28} />
```

---

Result:

Every template card will display its **dedicated icon automatically**.

---

# 4. Delete Imported Data Sources

## Problem

Imported datasets cannot be removed easily.

Also deleting datasets does not clear **dependent dashboards**.

---

## Implementation

File:

```
src/pages/DataSourcesPage.tsx
```

---

### Step 1 — Add delete button

```
<button
 onClick={() => handleDelete(dataset.id)}
 className="text-red-500 hover:text-red-700"
>
 <Trash2 size={16}/>
</button>
```

---

### Step 2 — Confirmation dialog

Use:

```
AlertDialog
```

Confirmation message:

```
Delete this dataset?

Dashboards using this dataset may stop working.
```

---

### Step 3 — Cleanup references

When dataset deleted:

```
dashboards = dashboards.filter(d =>
 !d.widgets.some(w => w.datasetId === deletedId)
)
```

---

# 5. Notification Cleanup

## Problem

Notifications accumulate without delete option.

---

## Implementation

File:

```
src/components/NotificationsPanel.tsx
```

---

### Add delete option

Per notification:

```
<X size={14} onClick={()=>removeNotification(id)} />
```

---

### Add clear all button

```
Clear All
```

```
setNotifications([])
```

---

# 6. Dataset Preview Pagination

Large dataset preview should not render thousands of rows.

---

File:

```
src/pages/DataSourcesPage.tsx
```

---

### Pagination state

```
const [page,setPage] = useState(1)
const PAGE_SIZE = 200
```

---

### Slice rows

```
const paginated = data.slice(
 (page-1)*PAGE_SIZE,
 page*PAGE_SIZE
)
```

---

### Pagination UI

Add controls:

```
Previous | Page X | Next
```

---

# 7. Lazy Widget Rendering (Performance Optimization)

When dashboards contain **many widgets**, rendering slows down.

---

File:

```
src/components/LazyWidget.tsx
```

---

### Use IntersectionObserver

Render charts **only when visible**.

```
const observer = new IntersectionObserver()
```

If widget not visible:

Show skeleton placeholder.

---

### Benefits

- Faster dashboard load
- Better performance with 30+ widgets