## Plan: Rebuild and Correct VisoryBI

This plan addresses all requirements: navigation changes, dashboard builder chart library slider, collaboration page fixes, double-click Q&A structural fix, Data Editor overflow fix, notification bell, layout stability, and online/offline member status.

---

### 1. Remove Admin from Sidebar, Integrate into Builder

**AppSidebar.tsx**: Remove the `{ icon: Shield, label: 'Admin Panel', href: '/admin' }` entry from `navItems` array.

**DashboardBuilderPage.tsx**: Add a collapsible side slider panel containing the chart library (Bar, Line, Pie, KPI, Table + all existing chart types). This panel will:

- Use a button to toggle open/close with animation
- Slide in from the left side of the builder canvas
- Not overlap the dashboard grid (use flex layout, not absolute positioning)
- Allow clicking a chart type to add it to the current dashboard (reusing the existing `addWidget` logic from AdminPanelPage)
- Include the admin config fields (dataset selector, field mapping) inline
- Include the 3D chart toggle from AdminPanelPage

The Admin page route remains but is no longer in the nav.

### 2. Home Page: Fix Landing Navbar + Add Notification Bell

**Index.tsx**: The landing navbar already exists and is only on the Home page (Index uses its own layout, not MainLayout). This is correct. Add:

- A notification bell icon with numeric badge in the top-right nav area
- Dropdown panel showing notifications from localStorage
- Store notifications via a simple zustand store with persist

**Create `src/stores/notificationStore.ts**`: Simple store with `notifications[]`, `addNotification()`, `markRead()`, `unreadCount`.

### 3. Collaboration Page: Online/Offline Status + Team Creation

**WorkspacePage.tsx**:

- Change member status: Only **Naveen** shows as "Online" (green dot + "Active now"). All others (Viper, Thaslee, Abd) show as "Offline" (gray dot + "Offline").
- Add "Create Team" section: form to create a new team name, assign from static members, store in localStorage via workspaceStore
- Add "Share Dashboard" simulation: button that marks a dashboard as "Shared" (badge), triggers a notification, shows static "Active Now" indicator

**WorkspaceStore.ts**: Add `teams[]` array with `createTeam()`, `shareDashboard()` methods.

### 4. Double-Click Q&A Structural Fix

**DashboardBuilderPage.tsx** and **DashboardOutputPage.tsx**:

- Move `onDoubleClick` from the chart card inner content to an outer wrapper `<div>` around each widget
- Ensure `pointer-events` are enabled on the wrapper
- Ensure drag handle does not consume the double-click event (already uses `stopPropagation` appropriately)

**InsightModal.tsx**:

- Already uses `position: fixed` and `z-[100]` -- verify this is correct and modal is not clipped by any `overflow: hidden` parent

### 5. Configuration Panel Data Editor Flex Fix (Critical)

**WidgetEditDialog.tsx**: The Data Editor tab currently renders a table inside a ScrollArea. The fix:

- Ensure the Dialog content uses `flex flex-col` with proper `overflow-y: auto` on the tab content
- Data Editor's `ScrollArea` must have a fixed max-height and scroll internally
- Input fields inside table cells: use `w-full` and remove any fixed widths
- Add `min-w-0` to flex children to prevent overflow
- The dialog must not cause horizontal page scroll

### 6. Chart & Label Color System in Configuration

**WidgetEditDialog.tsx**: Add a "Colors" section in the Config tab:

- Color picker for primary chart color (bar fill, line stroke, pie slice)
- Label text color picker
- Label background color toggle
- Toggle labels ON/OFF
- Store color settings in widget config

### 7. Cross-Filtering Stability

Already implemented in DashboardBuilderPage. Verify:

- No layout shift on filter
- Works with 100+ rows (already filters in-memory)
- No duplication

### 8. Drill-Down: Replace Data, No Stack

Already implemented. The current drill-down replaces chart data via `aggregateForDrillLevel`. The chart container uses fixed `h-80` class. Verify no stacking occurs. And should avoid Data Redudency by summarizing them

### 9. Layout Stability

- All grid containers already use `grid` and `gap` classes
- Add `min-w-0` to grid children where missing to prevent overflow
- Ensure slider panel uses flex-shrink-0 and doesn't push content

---

### Technical Summary


| File                                            | Change                                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/components/layout/AppSidebar.tsx`          | Remove Admin nav item                                                                  |
| `src/pages/DashboardBuilderPage.tsx`            | Add collapsible chart library slider panel with admin config; fix double-click wrapper |
| `src/stores/notificationStore.ts`               | New store for notifications                                                            |
| `src/pages/Index.tsx`                           | Add notification bell with badge and dropdown                                          |
| `src/pages/WorkspacePage.tsx`                   | Online/offline per member; team creation UI; share simulation                          |
| `src/stores/workspaceStore.ts`                  | Add teams array and share methods                                                      |
| `src/components/dashboard/WidgetEditDialog.tsx` | Fix Data Editor flex layout; add color configuration                                   |
| `src/components/dashboard/InsightModal.tsx`     | Ensure fixed positioning not clipped                                                   |
| `src/pages/DashboardOutputPage.tsx`             | Fix double-click wrapper structure                                                     |
