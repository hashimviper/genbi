

## Plan: LAN Collaboration, Admin DB Viewer, and College Templates

### 1. LAN-Based Collaboration Page

Since this is a static frontend app (no backend server), true LAN peer discovery requires a creative approach. The plan uses **BroadcastChannel API** for real cross-tab communication on the same machine, combined with a **manual peer connection** flow where users on the same network can share a room code to sync presence and data via localStorage polling.

**Changes to `src/pages/WorkspacePage.tsx`:**
- Replace "UI simulation" label with "LAN Network Collaboration"
- Add a "Network Room" section where users can create/join a room code
- Use `BroadcastChannel` to sync presence, teams, and org data across browser tabs in real-time
- Show connected peers with live status indicators
- Add network status banner showing connection mode (Local / LAN)

**New file: `src/lib/lanSync.ts`:**
- BroadcastChannel wrapper for cross-tab real-time sync
- Room code generation and management
- Message types: presence heartbeat, org updates, team updates, dashboard share events
- Auto-cleanup on disconnect

### 2. Admin Panel: Replace IndexedDB Viewer with User Database Viewer

**Changes to `src/pages/AdminPanelPage.tsx`:**
- Rename "Data Storage" tab to "User Database"
- Replace `<IndexedDBViewer />` with `<DatabasePanel />` (already exists at `src/components/admin/DatabasePanel.tsx`)
- The DatabasePanel already shows Users, Collaboration Requests, Activity Log, and Online Presence — all read-only views of the localDB
- Make the Users tab strictly read-only (remove the delete button for non-owner users)

### 3. College Performance Templates (with dedicated datasets)

**Add to `src/data/templates.ts`** — 4 new fully-furnished templates:

**a) Student Performance Analytics**
- Dataset: student name, department, semester, GPA, attendance%, credits, backlogs
- Widgets: KPIs (avg GPA, total students, avg attendance), bar chart (GPA by dept), line chart (semester trends), donut (department distribution), gauge (attendance rate), table

**b) Staff Performance Dashboard**
- Dataset: staff name, department, designation, experience_years, publications, courses_taught, rating
- Widgets: KPIs (total staff, avg rating, avg experience), horizontal bar (publications by dept), radar (rating distribution), pie (designation split), table

**c) College Exam Results**
- Dataset: subject, pass_count, fail_count, avg_marks, highest_marks, department
- Widgets: KPIs (pass rate, avg marks), stacked bar (pass vs fail by subject), waterfall (marks distribution), funnel (grade distribution), table

**d) College Attendance Tracker**
- Dataset: department, total_students, present_avg, absent_avg, late_avg, month
- Widgets: KPIs (overall attendance%), area chart (monthly trends), donut (present/absent/late split), bar (by department), gauge (target vs actual), table

Each template includes 8-12 sample data rows and 8-11 widgets with ranking controls and summary metrics enabled.

### Technical Details

**Files to create:**
- `src/lib/lanSync.ts` — BroadcastChannel-based sync utility

**Files to modify:**
- `src/pages/WorkspacePage.tsx` — LAN collaboration UI with room codes and real-time sync
- `src/pages/AdminPanelPage.tsx` — Swap IndexedDB viewer for DatabasePanel (user entries, read-only)
- `src/data/templates.ts` — Add 4 college templates with full sample datasets and widgets

