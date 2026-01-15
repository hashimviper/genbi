import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Save, Undo, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardStore } from '@/stores/dashboardStore';
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
import { WidgetEditDialog } from '@/components/dashboard/WidgetEditDialog';
import { ExportMenu } from '@/components/dashboard/ExportMenu';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { isChartConfig, isKPIConfig, DashboardWidget } from '@/types/dashboard';
import { cn } from '@/lib/utils';

export default function DashboardBuilderPage() {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('id');
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  
  const { dashboards, datasets, currentDashboard, setCurrentDashboard, removeWidget, updateWidget, updateDashboard } = useDashboardStore();

  useEffect(() => {
    if (dashboardId) {
      const dashboard = dashboards.find((d) => d.id === dashboardId);
      if (dashboard) setCurrentDashboard(dashboard);
    }
  }, [dashboardId, dashboards, setCurrentDashboard]);

  const getDatasetData = (datasetId: string) => {
    return datasets.find((d) => d.id === datasetId)?.data || [];
  };

  const getDatasetColumns = (datasetId: string) => {
    return datasets.find((d) => d.id === datasetId)?.columns || [];
  };

  const calculateKPIValue = (datasetId: string, field: string, aggregation: string) => {
    const data = getDatasetData(datasetId);
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
    const items = Array.from(currentDashboard.widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateDashboard(currentDashboard.id, { widgets: items });
  };

  const handleWidgetSave = (widget: DashboardWidget) => {
    if (currentDashboard) {
      updateWidget(currentDashboard.id, widget.id, widget);
      toast({ title: 'Widget updated' });
    }
  };

  const renderWidget = (widget: DashboardWidget) => {
    const config = widget.config;
    const data = getDatasetData(config.datasetId);

    if (isKPIConfig(config)) {
      const value = calculateKPIValue(config.datasetId, config.valueField, config.aggregation);
      return <KPICard title={config.title} value={value} prefix={config.prefix} suffix={config.suffix} trend="up" trendValue="+12.5%" />;
    }

    if (isChartConfig(config)) {
      switch (widget.type) {
        case 'bar': return <BarChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'line': return <LineChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'pie': return <PieChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'area': return <AreaChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'table': return <DataTableWidget data={data} columns={getDatasetColumns(config.datasetId).map(c => c.name)} />;
        case 'gauge': return <GaugeChartWidget value={calculateKPIValue(config.datasetId, config.valueField || '', 'avg')} />;
        case 'radar': return <RadarChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'treemap': return <TreemapWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'funnel': return <FunnelChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'combo': return <ComboChartWidget data={data} xAxis={config.xAxis || ''} barField={config.yAxis || ''} lineField={config.valueField || config.yAxis || ''} />;
        case 'donut': return <DonutChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'horizontalBar': return <HorizontalBarWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'waterfall': return <WaterfallChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'scatter': return <ScatterPlotWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        default: return <div className="text-muted-foreground">Unknown widget type</div>;
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
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{currentDashboard.name}</h1>
            <p className="text-sm text-muted-foreground">{currentDashboard.widgets.length} widgets • Drag to reorder</p>
          </div>
          <div className="flex gap-2">
            <ExportMenu elementId="dashboard-canvas" dashboardName={currentDashboard.name} dashboardData={currentDashboard} />
            <Button variant="outline" size="sm" className="gap-2"><Undo className="h-4 w-4" /> Undo</Button>
            <Button size="sm" className="gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save</Button>
          </div>
        </div>

        <div id="dashboard-canvas" className="flex-1 overflow-auto p-6">
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
                                onDelete={() => removeWidget(currentDashboard.id, widget.id)}
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
        data={editingWidget ? getDatasetData(editingWidget.config.datasetId) : []}
        onSave={handleWidgetSave}
      />
    </MainLayout>
  );
}
