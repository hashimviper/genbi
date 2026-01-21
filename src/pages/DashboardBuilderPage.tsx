import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Save, Undo, Redo, GripVertical, Database, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useUndoStore } from '@/stores/undoStore';
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
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { isChartConfig, isKPIConfig, DashboardWidget, Dashboard } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { sampleDatasets } from '@/data/sampleDatasets';

export default function DashboardBuilderPage() {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('id');
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [showDatasetSwitcher, setShowDatasetSwitcher] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  const { dashboards, datasets, currentDashboard, setCurrentDashboard, removeWidget, updateWidget, updateDashboard } = useDashboardStore();
  const { pushState, undo, redo, canUndo, canRedo, clear: clearUndoHistory } = useUndoStore();
  
  // Combine user datasets with sample datasets
  const allDatasets = [...datasets, ...sampleDatasets];

  useEffect(() => {
    if (dashboardId) {
      const dashboard = dashboards.find((d) => d.id === dashboardId);
      if (dashboard) {
        setCurrentDashboard(dashboard);
        clearUndoHistory();
      }
    }
  }, [dashboardId, dashboards, setCurrentDashboard, clearUndoHistory]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && dashboardRef.current) {
      dashboardRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        setIsFullscreen(true);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Save state before modifications for undo
  const saveStateForUndo = useCallback(() => {
    if (currentDashboard) {
      pushState(currentDashboard);
    }
  }, [currentDashboard, pushState]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (currentDashboard && canUndo()) {
      const previousState = undo(currentDashboard);
      if (previousState) {
        updateDashboard(currentDashboard.id, { widgets: previousState.widgets });
        toast({ title: 'Undo successful', description: 'Previous state restored.' });
      }
    }
  }, [currentDashboard, canUndo, undo, updateDashboard]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (currentDashboard && canRedo()) {
      const nextState = redo(currentDashboard);
      if (nextState) {
        updateDashboard(currentDashboard.id, { widgets: nextState.widgets });
        toast({ title: 'Redo successful', description: 'Action restored.' });
      }
    }
  }, [currentDashboard, canRedo, redo, updateDashboard]);

  const getDatasetData = (datasetId: string) => {
    const dataset = allDatasets.find((d) => d.id === datasetId);
    const rawData = dataset?.data || [];
    return applyFilters(rawData, filters);
  };

  const getRawDatasetData = (datasetId: string) => {
    return allDatasets.find((d) => d.id === datasetId)?.data || [];
  };

  const getDatasetColumns = (datasetId: string) => {
    return allDatasets.find((d) => d.id === datasetId)?.columns || [];
  };
  
  const getCurrentDataset = () => {
    if (!currentDashboard?.widgets.length) return null;
    const datasetId = currentDashboard.widgets[0]?.config.datasetId;
    return allDatasets.find(d => d.id === datasetId) || null;
  };

  const calculateKPIValue = (datasetId: string, field: string, aggregation: string) => {
    const data = getDatasetData(datasetId);
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

  const handleSave = () => {
    toast({ title: 'Dashboard saved', description: 'Your changes have been saved locally.' });
  };

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
    if (currentDashboard) {
      saveStateForUndo();
      removeWidget(currentDashboard.id, widgetId);
      toast({ title: 'Widget deleted', description: 'Widget has been removed from the dashboard.' });
    }
  };

  const handleDatasetSwitch = (newDatasetId: string, remappedWidgets: DashboardWidget[]) => {
    if (currentDashboard) {
      saveStateForUndo();
      updateDashboard(currentDashboard.id, { widgets: remappedWidgets });
      toast({ title: 'Dataset switched', description: 'Fields have been automatically remapped.' });
    }
  };

  const renderWidget = (widget: DashboardWidget) => {
    const config = widget.config;
    const datasetId = config.datasetId;
    const data = getDatasetData(datasetId);

    // Validate that data exists
    if (!data || data.length === 0) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>;
    }

    if (isKPIConfig(config)) {
      const value = calculateKPIValue(datasetId, config.valueField, config.aggregation);
      return <KPICard title={config.title} value={value} prefix={config.prefix} suffix={config.suffix} trend="up" trendValue="+12.5%" />;
    }

    if (isChartConfig(config)) {
      switch (widget.type) {
        case 'bar': return <BarChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'line': return <LineChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'pie': return <PieChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'area': return <AreaChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'table': return <DataTableWidget data={data} columns={getDatasetColumns(datasetId).map(c => c.name)} />;
        case 'gauge': {
          const gaugeValue = calculateKPIValue(datasetId, config.valueField || '', 'avg');
          return <GaugeChartWidget value={gaugeValue} title={config.title} />;
        }
        case 'radar': return <RadarChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'treemap': return <TreemapWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'funnel': return <FunnelChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'combo': return <ComboChartWidget data={data} xAxis={config.xAxis || ''} barField={config.yAxis || ''} lineField={config.valueField || config.yAxis || ''} />;
        case 'donut': return <DonutChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'horizontalBar': return <HorizontalBarWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'waterfall': return <WaterfallChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'scatter': return <ScatterPlotWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'stackedBar': {
          // StackedBar requires stackFields array - use yAxis field as the single stack field
          const stackFields = config.yAxis ? [config.yAxis] : [];
          return <StackedBarChartWidget data={data} xAxis={config.xAxis || ''} stackFields={stackFields} />;
        }
        case 'sparkline': {
          // Sparkline needs title and value
          const sparkValue = calculateKPIValue(datasetId, config.valueField || '', 'sum');
          return <SparklineWidget data={data} valueField={config.valueField || ''} title={config.title} value={sparkValue} />;
        }
        default: return <div className="text-muted-foreground">Unknown widget type: {widget.type}</div>;
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

  const kpiWidgets = currentDashboard.widgets.filter(w => w.type === 'kpi' || w.type === 'gauge');
  const chartWidgets = currentDashboard.widgets.filter(w => w.type !== 'kpi' && w.type !== 'gauge');

  return (
    <MainLayout>
      <div ref={dashboardRef} className={cn("flex h-full flex-col", isFullscreen && "bg-background")}>
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{currentDashboard.name}</h1>
            <p className="text-sm text-muted-foreground">{currentDashboard.widgets.length} widgets • Drag to reorder</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowDatasetSwitcher(true)}>
              <Database className="h-4 w-4" /> Switch Dataset
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setFilters([])}>
              <RotateCcw className="h-4 w-4" /> Reset Filters
            </Button>
            <ShareMenu elementId="dashboard-canvas" dashboardName={currentDashboard.name} />
            <ExportMenu elementId="dashboard-canvas" dashboardName={currentDashboard.name} dashboardData={currentDashboard} />
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2" 
              onClick={handleUndo}
              disabled={!canUndo()}
            >
              <Undo className="h-4 w-4" /> Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2" 
              onClick={handleRedo}
              disabled={!canRedo()}
            >
              <Redo className="h-4 w-4" /> Redo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <><Minimize2 className="h-4 w-4" /> Exit Fullscreen</>
              ) : (
                <><Maximize2 className="h-4 w-4" /> Fullscreen</>
              )}
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
                                <button
                                  onClick={() => handleDeleteWidget(widget.id)}
                                  className="absolute -right-2 -top-2 z-20 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-destructive/90"
                                  title="Delete widget"
                                >
                                  ×
                                </button>
                                <div onClick={() => setEditingWidget(widget)} className="cursor-pointer">{renderWidget(widget)}</div>
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
                    <div ref={provided.innerRef} {...provided.droppableProps} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {chartWidgets.map((widget, index) => (
                        <Draggable key={widget.id} draggableId={widget.id} index={kpiWidgets.length + index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className={cn('relative', snapshot.isDragging && 'z-50')}>
                              <ChartCard
                                title={widget.config.title}
                                className="h-80"
                                isDragging={snapshot.isDragging}
                                onDelete={() => handleDeleteWidget(widget.id)}
                                onConfigure={() => setEditingWidget(widget)}
                              >
                                <div {...provided.dragHandleProps} className="absolute left-2 top-2 z-10 opacity-0 group-hover:opacity-100 cursor-grab">
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                {renderWidget(widget)}
                              </ChartCard>
                            </div>
                          )}
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
    </MainLayout>
  );
}
