## Plan: Fix, Update & Expand VisoryBI — Targeted Repairs

### Issues Identified

1. **Chart widgets don't accept color/label config** — The color customization in WidgetEditDialog stores `primaryColor`, `labelColor`, `showDataLabels`, etc. in widget config, but chart components (BarChartWidget, LineChartWidget, PieChartWidget, etc.) don't accept or use these props. Colors are hardcoded.
2. **Double-click Q&A partially broken** — In DashboardOutputPage, `onDoubleClick` is on the wrapper div but `stopPropagation` is missing (unlike DashboardBuilderPage which has it). Also, clicking outside the InsightModal doesn't close it (no backdrop/click-away handler).
3. **WidgetEditDialog Data Editor** — Already structurally fixed with `flex flex-col` and `maxHeight: 400px`, but the `onSave` callback signature accepts `updatedData` but the handler in DashboardBuilderPage ignores it (line 242-248), so data edits are silently lost.
4. **Cross-filtering not wired to chart clicks** — Charts render but have no `onClick` handlers to trigger cross-filtering. The `handleDrillClick` exists in the builder but charts don't receive click callbacks.
5. **Delete function is not working -** The delete funcction which is already existited and worked properly isnt working now and i need you to wire the delete function propely as make it able to work
6. **Create Icons for Pre-Build Templates -**  Create an icon which should represent all the templates based on their department

### Plan

#### A. Wire color config into chart components (6 chart files + renderWidget)

Add optional `primaryColor`, `labelColor`, `showDataLabels` props to: `BarChartWidget`, `LineChartWidget`, `PieChartWidget`, `AreaChartWidget`, `DonutChartWidget`, `HorizontalBarWidget`. Each component falls back to its current default if prop is undefined.

Update `renderWidget()` in both `DashboardBuilderPage` and `DashboardOutputPage` to pass these config values from `widget.config` to each chart component.

#### B. Fix double-click InsightModal dismiss

Add a backdrop overlay behind the InsightModal (transparent click target) so clicking outside closes it. Add `stopPropagation` to the DashboardOutputPage double-click handler.

#### C. Fix data edit persistence

Update `handleWidgetSave` in DashboardBuilderPage to accept and apply `updatedData` when provided by the WidgetEditDialog. Store updated data in the dashboard store or dataset.

#### D. Wire cross-filter click handlers to charts

Add `onBarClick` / `onSliceClick` callbacks to BarChartWidget, PieChartWidget, etc. In `renderWidget()`, pass a handler that calls `handleCrossFilterClick(xAxisField, clickedValue)` for the builder page, and `handleCrossFilterClick` for the output page.

#### E. Fix InsightModal viewport clipping

Ensure the modal constrains to viewport with `Math.max(10, ...)` for both top and left to avoid negative positioning.

#### F. Fix Delete option in the Dashboard Builder  
  
Ensure that the model is containing deleting option which is fully functionable and which is used in the Dashboard Builder page  
  
G.Fix the template page with providing icons for the  pre-defined templates which should represent the department

### Files Modified


| File                                            | Change                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `src/components/charts/BarChartWidget.tsx`      | Add `primaryColor`, `showDataLabels`, `labelColor`, `onBarClick` props                        |
| `src/components/charts/LineChartWidget.tsx`     | Add `primaryColor`, `showDataLabels`, `labelColor` props                                      |
| `src/components/charts/PieChartWidget.tsx`      | Add `colors`, `showDataLabels`, `labelColor`, `onSliceClick` props                            |
| `src/components/charts/AreaChartWidget.tsx`     | Add `primaryColor` prop                                                                       |
| `src/components/charts/DonutChartWidget.tsx`    | Add `colors`, `onSliceClick` props                                                            |
| `src/components/charts/HorizontalBarWidget.tsx` | Add `primaryColor`, `onBarClick` props                                                        |
| `src/pages/DashboardBuilderPage.tsx`            | Pass color/label/click props in `renderWidget`; fix `handleWidgetSave` to handle data updates |
| `src/pages/DashboardOutputPage.tsx`             | Pass color/label/click props in `renderWidget`; fix double-click `stopPropagation`            |
| `src/components/dashboard/InsightModal.tsx`     | Add click-away backdrop; fix viewport clamping                                                |
