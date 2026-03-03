import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Save, Undo, Redo, GripVertical, Database, RotateCcw, Maximize2, Minimize2, Home } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useUndoStore } from '@/stores/undoStore';
import { useDrillStore } from '@/stores/drillStore';
import { useAuthStore } from '@/stores/authStore';
import { ChartCard } from '@/components/charts/ChartCard';
import { BarChartWidget } from '@/components/charts/BarChartWidget';
import { LineChartWidget } from '@/components/charts/LineChartWidget';
import { PieChartWidget } from '@/components/charts/PieChartWidget';
import { AreaChartWidget } from '@/components/charts/AreaChartWidget';
import { KPICard } from '@/components/charts/KPICard';
import { DataTableWidget } from '@/components/charts/DataTableWidget';
import { GaugeChartWidget } from '@/components/charts/GaugeChartWidget';
import { RadarChartWidget } from '@/components/charts/RadarChartWidget';
import { TreemapWidget } from '@/components/charts/TreemapWidget';
import { FunnelChartWidget } from '@/components/charts/FunnelChartWidget';
import { ComboChartWidget } from '@/components/charts/ComboChartWidget';
import { DonutChartWidget } from '@/components/charts/DonutChartWidget';
import { HorizontalBarWidget } from '@/components/charts/HorizontalBarWidget';
import { WaterfallChartWidget } from '@/components/charts/WaterfallChartWidget';
import { ScatterPlotWidget } from '@/components/charts/ScatterPlotWidget';
import { StackedBarChartWidget } from '@/components/charts/StackedBarChartWidget';
import { SparklineWidget } from '@/components/charts/SparklineWidget';
import { WidgetEditDialog } from '@/components/dashboard/WidgetEditDialog';
import { ExportMenu } from '@/components/dashboard/ExportMenu';
import { ShareMenu } from '@/components/dashboard/ShareMenu';
import { GlobalFilterBar, FilterConfig, applyFilters } from '@/components/dashboard/GlobalFilterBar';
import { DatasetSwitcher } from '@/components/dashboard/DatasetSwitcher';
import { InsightModal } from '@/components/dashboard/InsightModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { isChartConfig, isKPIConfig, DashboardWidget, Dashboard } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { sampleDatasets } from '@/data/sampleDatasets';
import { deriveHierarchies, applyDrillFilters, getCurrentDrillField, canDrillDown, canDrillUp, aggregateForDrillLevel } from '@/lib/drillDown';
import { calculateSummaries } from '@/lib/rankingUtils';

export default function DashboardBuilderPage() {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('id');
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [showDatasetSwitcher, setShowDatasetSwitcher] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Double-click insight modal state
  const [insightWidget, setInsightWidget] = useState<DashboardWidget | null>(null);
  const [insightPos, setInsightPos] = useState({ x: 0, y: 0 });
  
  // Auth for role-based UI
  const { canEdit, canDelete } = useAuthStore();
  
  const { dashboards, datasets, currentDashboard, setCurrentDashboard, removeWidget, updateWidget, updateDashboard, addWidget } = useDashboardStore();
  const { pushState, undo, redo, canUndo, canRedo, clear: clearUndoHistory } = useUndoStore();
  
  const allDatasets = [...datasets, ...sampleDatasets];
  const { drillStates, crossFilters, initDrill, drillDown, drillUp, resetDrill, clearAllCrossFilters } = useDrillStore();

  useEffect(() => {
    if (dashboardId) {
      const dashboard = dashboards.find((d) => d.id === dashboardId);
      if (dashboard) {
        setCurrentDashboard(dashboard);
        clearUndoHistory();
        dashboard.widgets.forEach(widget => {
          const datasetId = widget.config.datasetId;
          const columns = allDatasets.find(d => d.id === datasetId)?.columns || [];
          if (columns.length > 0) {
            const hierarchies = deriveHierarchies(columns);
            if (hierarchies.length > 0 && !drillStates[widget.id]) {
              initDrill(widget.id, hierarchies[0]);
            }
          }
        });
      }
    }
  }, [dashboardId, dashboards, setCurrentDashboard, clearUndoHistory]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && dashboardRef.current) {
      dashboardRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(true));
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const saveStateForUndo = useCallback(() => {
    if (currentDashboard) pushState(currentDashboard);
  }, [currentDashboard, pushState]);

  const handleUndo = useCallback(() => {
    if (currentDashboard && canUndo()) {
      const prev = undo(currentDashboard);
      if (prev) { updateDashboard(currentDashboard.id, { widgets: prev.widgets }); toast({ title: 'Undo successful' }); }
    }
  }, [currentDashboard, canUndo, undo, updateDashboard]);

  const handleRedo = useCallback(() => {
    if (currentDashboard && canRedo()) {
      const next = redo(currentDashboard);
      if (next) { updateDashboard(currentDashboard.id, { widgets: next.widgets }); toast({ title: 'Redo successful' }); }
    }
  }, [currentDashboard, canRedo, redo, updateDashboard]);

  const getDatasetData = (datasetId: string, widgetId?: string) => {
    const dataset = allDatasets.find((d) => d.id === datasetId);
    let rawData = dataset?.data || [];
    rawData = applyFilters(rawData, filters);
    if (Object.keys(crossFilters).length > 0) {
      rawData = rawData.filter(row => Object.entries(crossFilters).every(([field, value]) => row[field] === undefined ? true : row[field] === value));
    }
    if (widgetId && drillStates[widgetId]) {
      rawData = applyDrillFilters(rawData, drillStates[widgetId]);
    }
    return rawData;
  };

  const getRawDatasetData = (datasetId: string) => allDatasets.find((d) => d.id === datasetId)?.data || [];
  const getDatasetColumns = (datasetId: string) => allDatasets.find((d) => d.id === datasetId)?.columns || [];
  
  const getCurrentDataset = () => {
    if (!currentDashboard?.widgets.length) return null;
    const datasetId = currentDashboard.widgets[0]?.config.datasetId;
    return allDatasets.find(d => d.id === datasetId) || null;
  };

  const handleDrillClick = useCallback((widgetId: string, value: unknown) => {
    const drillState = drillStates[widgetId];
    if (!drillState || !canDrillDown(drillState)) return;
    drillDown(widgetId, value);
    toast({ title: 'Drilled down', description: `Showing details for: ${String(value)}` });
  }, [drillStates, drillDown]);

  const handleDrillUp = useCallback((widgetId: string) => { drillUp(widgetId); }, [drillUp]);
  const handleDrillReset = useCallback((widgetId: string) => { resetDrill(widgetId); clearAllCrossFilters(); }, [resetDrill, clearAllCrossFilters]);

  const calculateKPIValue = (datasetId: string, field: string, aggregation: string, widgetId?: string) => {
    const data = getDatasetData(datasetId, widgetId);
    if (!field || !data.length) return 0;
    const values = data.map((row) => Number(row[field]) || 0);
    if (values.length === 0) return 0;
    switch (aggregation) {
      case 'sum': return values.reduce((a, b) => a + b, 0);
      case 'avg': return values.reduce((a, b) => a + b, 0) / values.length;
      case 'count': return values.length;
      case 'min': return Math.min(...values);
      case 'max': return Math.max(...values);
      default: return 0;
    }
  };

  const handleSave = () => { toast({ title: 'Dashboard saved', description: 'Your changes have been saved locally.' }); };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentDashboard) return;
    saveStateForUndo();
    const items = Array.from(currentDashboard.widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateDashboard(currentDashboard.id, { widgets: items });
  };

  const handleWidgetSave = (widget: DashboardWidget) => {
    if (currentDashboard) {
      saveStateForUndo();
      updateWidget(currentDashboard.id, widget.id, widget);
      toast({ title: 'Widget updated' });
    }
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (!canDelete()) {
      toast({ title: 'Permission denied', description: 'Only admins can delete widgets.', variant: 'destructive' });
      return;
    }
    if (currentDashboard) {
      saveStateForUndo();
      removeWidget(currentDashboard.id, widgetId);
      toast({ title: 'Widget deleted' });
    }
  };

  const handleDatasetSwitch = (newDatasetId: string, remappedWidgets: DashboardWidget[]) => {
    if (currentDashboard) {
      saveStateForUndo();
      updateDashboard(currentDashboard.id, { widgets: remappedWidgets });
      toast({ title: 'Dataset switched' });
    }
  };

  // Double-click handler for insight modal
  const handleWidgetDoubleClick = useCallback((widget: DashboardWidget, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setInsightWidget(widget);
    setInsightPos({ x: event.clientX + 10, y: event.clientY - 20 });
  }, []);

  const renderWidget = (widget: DashboardWidget) => {
    const config = widget.config;
    const datasetId = config.datasetId;
    const data = getDatasetData(datasetId, widget.id);
    const drillState = drillStates[widget.id];
    const currentDrillField = drillState ? getCurrentDrillField(drillState) : null;

    if (!data || data.length === 0) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>;
    }

    if (isKPIConfig(config)) {
      const value = calculateKPIValue(datasetId, config.valueField, config.aggregation, widget.id);
      return <KPICard title={config.title} value={value} prefix={config.prefix} suffix={config.suffix} trend="up" trendValue="+12.5%" />;
    }

    if (isChartConfig(config)) {
      const effectiveXAxis = currentDrillField || config.xAxis || '';
      const effectiveLabelField = currentDrillField || config.labelField || '';
      let chartData = data;
      if (currentDrillField && drillState && drillState.currentLevel > 0) {
        const numericCols = getDatasetColumns(datasetId).filter(c => c.type === 'number').map(c => c.name);
        chartData = aggregateForDrillLevel(data, currentDrillField, numericCols);
      }

      switch (widget.type) {
        case 'bar': return <BarChartWidget data={chartData} xAxis={effectiveXAxis} yAxis={config.yAxis || ''} />;
        case 'line': return <LineChartWidget data={chartData} xAxis={effectiveXAxis} yAxis={config.yAxis || ''} />;
        case 'pie': return <PieChartWidget data={chartData} labelField={effectiveLabelField} valueField={config.valueField || ''} />;
        case 'area': return <AreaChartWidget data={chartData} xAxis={effectiveXAxis} yAxis={config.yAxis || ''} />;
        case 'table': return <DataTableWidget data={chartData} columns={getDatasetColumns(datasetId).map(c => c.name)} />;
        case 'gauge': { const v = calculateKPIValue(datasetId, config.valueField || '', 'avg', widget.id); return <GaugeChartWidget value={v} title={config.title} />; }
        case 'radar': return <RadarChartWidget data={chartData} labelField={effectiveLabelField} valueField={config.valueField || ''} />;
        case 'treemap': return <TreemapWidget data={chartData} labelField={effectiveLabelField} valueField={config.valueField || ''} />;
        case 'funnel': return <FunnelChartWidget data={chartData} labelField={effectiveLabelField} valueField={config.valueField || ''} />;
        case 'combo': return <ComboChartWidget data={chartData} xAxis={effectiveXAxis} barField={config.yAxis || ''} lineField={config.valueField || config.yAxis || ''} />;
        case 'donut': return <DonutChartWidget data={chartData} labelField={effectiveLabelField} valueField={config.valueField || ''} />;
        case 'horizontalBar': return <HorizontalBarWidget data={chartData} labelField={effectiveLabelField} valueField={config.valueField || ''} />;
        case 'waterfall': return <WaterfallChartWidget data={chartData} labelField={effectiveLabelField} valueField={config.valueField || ''} />;
        case 'scatter': return <ScatterPlotWidget data={chartData} xAxis={effectiveXAxis} yAxis={config.yAxis || ''} />;
        case 'stackedBar': { const sf = config.yAxis ? [config.yAxis] : []; return <StackedBarChartWidget data={chartData} xAxis={effectiveXAxis} stackFields={sf} />; }
        case 'sparkline': { const sv = calculateKPIValue(datasetId, config.valueField || '', 'sum', widget.id); return <SparklineWidget data={chartData} valueField={config.valueField || ''} title={config.title} value={sv} />; }
        default: return <div className="text-muted-foreground">Unknown type: {widget.type}</div>;
      }
    }
    return <div className="text-muted-foreground">Invalid configuration</div>;
  };

  if (!currentDashboard) {
    return (
      <MainLayout>
        <div className="flex h-full flex-col items-center justify-center p-6">
          <p className="text-muted-foreground">Select a dashboard from My Dashboards or create a new one.</p>
        </div>
      </MainLayout>
    );
  }

  const kpiWidgets = currentDashboard.widgets.filter(w => w.type === 'kpi' || w.type === 'gauge' || w.type === 'sparkline');
  const chartWidgets = currentDashboard.widgets.filter(w => w.type !== 'kpi' && w.type !== 'gauge' && w.type !== 'sparkline');
  const userCanEdit = canEdit();
  const userCanDelete = canDelete();

  return (
    <MainLayout>
      <div ref={dashboardRef} className={cn("flex h-full flex-col", isFullscreen && "bg-background")}>
        <div className="flex flex-wrap items-center justify-between border-b border-border/50 px-6 py-4 gap-2">
          <div>
            <h1 className="text-xl font-bold text-foreground">{currentDashboard.name}</h1>
            <p className="text-sm text-muted-foreground">{currentDashboard.widgets.length} widgets • Double-click for insights</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowDatasetSwitcher(true)}>
              <Database className="h-4 w-4" /> Switch Dataset
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setFilters([])}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <ShareMenu elementId="dashboard-canvas" dashboardName={currentDashboard.name} dashboardId={currentDashboard.id} datasetId={getCurrentDataset()?.id} filters={Object.fromEntries(filters.map(f => [f.field, f.values]))} drillState={drillStates} />
            <ExportMenu elementId="dashboard-canvas" dashboardName={currentDashboard.name} dashboardData={currentDashboard} />
            <Button variant="outline" size="sm" className="gap-2" onClick={handleUndo} disabled={!canUndo()}><Undo className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRedo} disabled={!canRedo()}><Redo className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={toggleFullscreen}>
              {isFullscreen ? <><Minimize2 className="h-4 w-4" /> Exit</> : <><Maximize2 className="h-4 w-4" /> Full</>}
            </Button>
            <Button size="sm" className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save</Button>
          </div>
        </div>

        <div id="dashboard-canvas" className="flex-1 overflow-auto p-6">
          {getCurrentDataset() && (
            <GlobalFilterBar
              columns={getCurrentDataset()?.columns || []}
              data={getRawDatasetData(getCurrentDataset()?.id || '')}
              filters={filters}
              onFiltersChange={setFilters}
              className="mb-6"
            />
          )}

          {/* Summary Metrics */}
          {getCurrentDataset() && getDatasetData(getCurrentDataset()?.id || '').length > 0 && (() => {
            const ds = getCurrentDataset()!;
            const data = getDatasetData(ds.id);
            const numericCols = ds.columns.filter(c => c.type === 'number');
            if (numericCols.length === 0) return null;
            const primaryField = numericCols[0].name;
            const summaries = calculateSummaries(data, { metrics: ['total', 'average', 'min', 'max', 'count'], valueField: primaryField });
            return (
              <div className="mb-6 glass-card rounded-xl p-4">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Summary — {primaryField.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {(['total', 'average', 'min', 'max', 'count'] as const).map(key => (
                    <div key={key} className="rounded-lg bg-primary/5 p-3 text-center">
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                      <p className="text-lg font-bold text-foreground">{typeof summaries[key] === 'number' ? (summaries[key] as number).toLocaleString() : summaries[key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {currentDashboard.widgets.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Plus className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 font-medium text-muted-foreground">No widgets yet</p>
              <p className="text-sm text-muted-foreground">Go to Admin Panel to add widgets</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              {kpiWidgets.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Key Metrics</h3>
                  <Droppable droppableId="kpis" direction="horizontal">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {kpiWidgets.map((widget, index) => (
                          <Draggable key={widget.id} draggableId={widget.id} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} className={cn('relative group', snapshot.isDragging && 'z-50')}>
                                <div {...provided.dragHandleProps} className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                {userCanDelete && (
                                  <button onClick={() => handleDeleteWidget(widget.id)} className="absolute -right-2 -top-2 z-20 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-destructive/90" title="Delete widget">×</button>
                                )}
                                <div
                                  onClick={() => userCanEdit && setEditingWidget(widget)}
                                  onDoubleClick={(e) => handleWidgetDoubleClick(widget, e)}
                                  className={cn("cursor-pointer", !userCanEdit && "cursor-default")}
                                >
                                  {renderWidget(widget)}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )}
              {chartWidgets.length > 0 && (
                <Droppable droppableId="charts">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" style={{ minWidth: 0 }}>
                      {chartWidgets.map((widget, index) => (
                        <Draggable key={widget.id} draggableId={widget.id} index={kpiWidgets.length + index}>
                          {(provided, snapshot) => {
                            const widgetDrillState = drillStates[widget.id];
                            const drillBreadcrumb = widgetDrillState?.breadcrumb || [];
                            const canDrillUpWidget = widgetDrillState ? canDrillUp(widgetDrillState) : false;
                            const canDrillDownWidget = widgetDrillState ? canDrillDown(widgetDrillState) : false;
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={cn('relative', snapshot.isDragging && 'z-50')}
                                onDoubleClick={(e) => handleWidgetDoubleClick(widget, e)}
                              >
                                <ChartCard
                                  title={widget.config.title}
                                  className="h-80"
                                  isDragging={snapshot.isDragging}
                                  onDelete={userCanDelete ? () => handleDeleteWidget(widget.id) : undefined}
                                  onConfigure={userCanEdit ? () => setEditingWidget(widget) : undefined}
                                  drillBreadcrumb={drillBreadcrumb}
                                  canDrillUp={canDrillUpWidget}
                                  canDrillDown={canDrillDownWidget}
                                  onDrillUp={() => handleDrillUp(widget.id)}
                                  onDrillReset={() => handleDrillReset(widget.id)}
                                >
                                  <div {...provided.dragHandleProps} className="absolute left-2 top-2 z-10 opacity-0 group-hover:opacity-100 cursor-grab">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  {renderWidget(widget)}
                                </ChartCard>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </DragDropContext>
          )}
        </div>
      </div>

      <WidgetEditDialog
        open={!!editingWidget}
        onOpenChange={(open) => !open && setEditingWidget(null)}
        widget={editingWidget}
        columns={editingWidget ? getDatasetColumns(editingWidget.config.datasetId) : []}
        data={editingWidget ? getRawDatasetData(editingWidget.config.datasetId) : []}
        onSave={handleWidgetSave}
      />
      
      <DatasetSwitcher
        open={showDatasetSwitcher}
        onOpenChange={setShowDatasetSwitcher}
        currentDataset={getCurrentDataset()}
        availableDatasets={allDatasets}
        widgets={currentDashboard?.widgets || []}
        onSwitch={handleDatasetSwitch}
      />

      {/* Double-click Insight Modal */}
      {insightWidget && (
        <InsightModal
          widget={insightWidget}
          data={getDatasetData(insightWidget.config.datasetId, insightWidget.id)}
          position={insightPos}
          onClose={() => setInsightWidget(null)}
        />
      )}
    </MainLayout>
  );
}
