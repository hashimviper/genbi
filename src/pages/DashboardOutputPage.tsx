import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Maximize2, Minimize2, X } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { InsightModal } from '@/components/dashboard/InsightModal';
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
import { ExportMenu } from '@/components/dashboard/ExportMenu';
import { ShareMenu } from '@/components/dashboard/ShareMenu';
import { GlobalFilterBar, FilterConfig, applyFilters } from '@/components/dashboard/GlobalFilterBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { isChartConfig, isKPIConfig, DashboardWidget } from '@/types/dashboard';
import { sampleDatasets } from '@/data/sampleDatasets';
import { decodeShareState, DashboardShareState } from '@/lib/shareUtils';
import { calculateSummaries } from '@/lib/rankingUtils';
import { toast } from '@/hooks/use-toast';
import { autoAggregate } from '@/lib/dataModel';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { VisoryBILogo } from '@/components/VisoryBILogo';

export default function DashboardOutputPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { dashboards, datasets, currentDashboard, setCurrentDashboard } = useDashboardStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [sharedState, setSharedState] = useState<DashboardShareState | null>(null);
  const [crossFilters, setCrossFilters] = useState<Record<string, unknown>>({});
  const [insightWidget, setInsightWidget] = useState<DashboardWidget | null>(null);
  const [insightPos, setInsightPos] = useState({ x: 0, y: 0 });
  
  const allDatasets = [...datasets, ...sampleDatasets];

  useEffect(() => {
    if (id) {
      const dashboard = dashboards.find((d) => d.id === id);
      if (dashboard) setCurrentDashboard(dashboard);
    }
  }, [id, dashboards, setCurrentDashboard]);

  useEffect(() => {
    const stateParam = searchParams.get('state');
    if (stateParam) {
      const decoded = decodeShareState(stateParam);
      if (decoded) {
        setSharedState(decoded);
        if (decoded.filters && typeof decoded.filters === 'object') {
          const filterArray: FilterConfig[] = Object.entries(decoded.filters).map(([field, values]) => ({
            field,
            type: 'multiSelect' as const,
            values: Array.isArray(values) ? values as (string | number)[] : [values as string | number],
          }));
          setFilters(filterArray);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const filterParam = searchParams.get('filters');
    if (filterParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(filterParam));
        if (Array.isArray(parsed)) setFilters(parsed);
      } catch { /* ignore */ }
    }
  }, [searchParams]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const getDatasetData = (datasetId: string) => {
    const dataset = allDatasets.find((d) => d.id === datasetId);
    let rawData = dataset?.data || [];
    rawData = applyFilters(rawData, filters);
    if (Object.keys(crossFilters).length > 0) {
      rawData = rawData.filter(row => Object.entries(crossFilters).every(([field, value]) => row[field] === undefined ? true : row[field] === value));
    }
    return rawData;
  };

  const handleCrossFilterClick = useCallback((field: string, value: unknown) => {
    setCrossFilters(prev => {
      if (prev[field] === value) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: value };
    });
    toast({ title: 'Cross-filter applied', description: `Filtering by: ${String(value)}` });
  }, []);

  const handleWidgetDoubleClick = useCallback((widget: DashboardWidget, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setInsightWidget(widget);
    setInsightPos({ x: event.clientX + 10, y: event.clientY - 20 });
  }, []);

  const clearCrossFilters = useCallback(() => {
    setCrossFilters({});
    toast({ title: 'Cross-filters cleared' });
  }, []);

  const getRawDatasetData = (datasetId: string) => allDatasets.find((d) => d.id === datasetId)?.data || [];
  const getDatasetColumns = (datasetId: string) => allDatasets.find((d) => d.id === datasetId)?.columns || [];

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

  const renderWidget = (widget: DashboardWidget) => {
    const config = widget.config;
    let data = getDatasetData(config.datasetId);

    const primaryColor = (config as any).primaryColor as string | undefined;
    const labelColor = (config as any).labelColor as string | undefined;
    const showDataLabels = (config as any).showDataLabels as boolean | undefined;
    const categoryColors = (config as any).categoryColors as Record<string, string> | undefined;
    const chartBgColor = (config as any).chartBgColor as string | undefined;
    const axisColor = (config as any).axisColor as string | undefined;
    const gridColor = (config as any).gridColor as string | undefined;
    const lineThickness = (config as any).lineThickness as number | undefined;
    const areaFill = (config as any).areaFill as boolean | undefined;

    if (!data || data.length === 0) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>;
    }

    if (isKPIConfig(config)) {
      const value = calculateKPIValue(config.datasetId, config.valueField, config.aggregation);
      return <KPICard title={config.title} value={value} prefix={config.prefix} suffix={config.suffix} trend="up" trendValue="+12.5%" />;
    }

    if (isChartConfig(config)) {
      const xAxis = config.xAxis || '';
      const labelField = config.labelField || '';

      // Auto-aggregate for large datasets
      const groupField = xAxis || labelField;
      const measureField = config.yAxis || config.valueField || '';
      if (data.length > 50 && groupField && measureField) {
        data = autoAggregate(data, { chartType: widget.type, groupField, measureField });
      }

      const onCrossFilter = (value: unknown) => {
        const field = xAxis || labelField;
        if (field) handleCrossFilterClick(field, value);
      };

      switch (widget.type) {
        case 'bar': return <BarChartWidget data={data} xAxis={xAxis} yAxis={config.yAxis || ''} primaryColor={primaryColor} labelColor={labelColor} showDataLabels={showDataLabels} categoryColors={categoryColors} chartBgColor={chartBgColor} axisColor={axisColor} gridColor={gridColor} onBarClick={onCrossFilter} />;
        case 'line': return <LineChartWidget data={data} xAxis={xAxis} yAxis={config.yAxis || ''} primaryColor={primaryColor} labelColor={labelColor} showDataLabels={showDataLabels} lineThickness={lineThickness} areaFill={areaFill} chartBgColor={chartBgColor} axisColor={axisColor} gridColor={gridColor} />;
        case 'pie': return <PieChartWidget data={data} labelField={labelField} valueField={config.valueField || ''} labelColor={labelColor} showDataLabels={showDataLabels} categoryColors={categoryColors} onSliceClick={onCrossFilter} />;
        case 'area': return <AreaChartWidget data={data} xAxis={xAxis} yAxis={config.yAxis || ''} primaryColor={primaryColor} labelColor={labelColor} chartBgColor={chartBgColor} axisColor={axisColor} gridColor={gridColor} />;
        case 'table': return <DataTableWidget data={data} columns={getDatasetColumns(config.datasetId).map(c => c.name)} />;
        case 'gauge': { const v = calculateKPIValue(config.datasetId, config.valueField || '', 'avg'); return <GaugeChartWidget value={v} title={config.title} />; }
        case 'radar': return <RadarChartWidget data={data} labelField={labelField} valueField={config.valueField || ''} />;
        case 'treemap': return <TreemapWidget data={data} labelField={labelField} valueField={config.valueField || ''} />;
        case 'funnel': return <FunnelChartWidget data={data} labelField={labelField} valueField={config.valueField || ''} />;
        case 'combo': return <ComboChartWidget data={data} xAxis={xAxis} barField={config.yAxis || ''} lineField={config.valueField || config.yAxis || ''} />;
        case 'donut': return <DonutChartWidget data={data} labelField={labelField} valueField={config.valueField || ''} onSliceClick={onCrossFilter} />;
        case 'horizontalBar': return <HorizontalBarWidget data={data} labelField={labelField} valueField={config.valueField || ''} primaryColor={primaryColor} onBarClick={onCrossFilter} />;
        case 'waterfall': return <WaterfallChartWidget data={data} labelField={labelField} valueField={config.valueField || ''} />;
        case 'scatter': return <ScatterPlotWidget data={data} xAxis={xAxis} yAxis={config.yAxis || ''} />;
        case 'stackedBar': { const sf = config.yAxis ? [config.yAxis] : []; return <StackedBarChartWidget data={data} xAxis={xAxis} stackFields={sf} />; }
        case 'sparkline': { const v = calculateKPIValue(config.datasetId, config.valueField || '', 'sum'); return <SparklineWidget data={data} valueField={config.valueField || ''} title={config.title} value={v} />; }
        default: return <div className="text-muted-foreground">Unknown widget type: {widget.type}</div>;
      }
    }

    return <div className="text-muted-foreground">Invalid configuration</div>;
  };

  if (!currentDashboard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <p className="text-muted-foreground">Dashboard not found</p>
        <Link to="/dashboards" className="mt-4">
          <Button variant="outline">Back to Dashboards</Button>
        </Link>
      </div>
    );
  }

  const kpiWidgets = currentDashboard.widgets.filter(w => w.type === 'kpi' || w.type === 'gauge' || w.type === 'sparkline');
  const chartWidgets = currentDashboard.widgets.filter(w => w.type !== 'kpi' && w.type !== 'gauge' && w.type !== 'sparkline');

  return (
    <div className="min-h-screen bg-background">
      {/* Branding Header */}
      <DashboardHeader
        branding={currentDashboard.branding}
        onBrandingChange={() => {}}
        editable={false}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboards">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">{currentDashboard.name}</h1>
              {currentDashboard.description && (
                <p className="text-sm text-muted-foreground">{currentDashboard.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareMenu elementId="dashboard-output-canvas" dashboardName={currentDashboard.name} dashboardId={currentDashboard.id} />
            <ExportMenu elementId="dashboard-output-canvas" dashboardName={currentDashboard.name} dashboardData={currentDashboard} />
            <Button variant="outline" size="sm" className="gap-2" onClick={toggleFullscreen}>
              {isFullscreen ? <><Minimize2 className="h-4 w-4" /> Exit Fullscreen</> : <><Maximize2 className="h-4 w-4" /> Fullscreen</>}
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main id="dashboard-output-canvas" className="p-6">
        {/* Filters */}
        {getCurrentDataset() && (
          <>
            <GlobalFilterBar
              columns={getCurrentDataset()?.columns || []}
              data={getRawDatasetData(getCurrentDataset()?.id || '')}
              filters={filters}
              onFiltersChange={setFilters}
              className="mb-4"
            />
            {Object.keys(crossFilters).length > 0 && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground">Cross-filters:</span>
                {Object.entries(crossFilters).map(([field, value]) => (
                  <Badge key={field} variant="secondary" className="gap-1 cursor-pointer" onClick={() => handleCrossFilterClick(field, value)}>
                    {field}: {String(value)} <X className="h-3 w-3" />
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearCrossFilters}>Clear all</Button>
              </div>
            )}
          </>
        )}

        {/* Summary Metrics Panel */}
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
                <div className="rounded-lg bg-primary/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-foreground">{typeof summaries.total === 'number' ? summaries.total.toLocaleString() : summaries.total}</p>
                </div>
                <div className="rounded-lg bg-primary/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Average</p>
                  <p className="text-lg font-bold text-foreground">{typeof summaries.average === 'number' ? summaries.average.toLocaleString() : summaries.average}</p>
                </div>
                <div className="rounded-lg bg-primary/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="text-lg font-bold text-foreground">{typeof summaries.min === 'number' ? summaries.min.toLocaleString() : summaries.min}</p>
                </div>
                <div className="rounded-lg bg-primary/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="text-lg font-bold text-foreground">{typeof summaries.max === 'number' ? summaries.max.toLocaleString() : summaries.max}</p>
                </div>
                <div className="rounded-lg bg-primary/5 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="text-lg font-bold text-foreground">{summaries.count}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {currentDashboard.widgets.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-muted-foreground">No widgets in this dashboard</p>
            <Link to={`/builder?id=${currentDashboard.id}`} className="mt-4">
              <Button>Add Widgets</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* KPI/Gauge/Sparkline Section */}
            {kpiWidgets.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {kpiWidgets.map((widget) => (
                    <div key={widget.id} className="animate-fade-in" onDoubleClick={(e) => handleWidgetDoubleClick(widget, e)} style={{ pointerEvents: 'auto' }}>
                      {renderWidget(widget)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts Section */}
            {chartWidgets.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {chartWidgets.map((widget) => (
                  <div key={widget.id} onDoubleClick={(e) => handleWidgetDoubleClick(widget, e)} style={{ pointerEvents: 'auto' }}>
                    <ChartCard
                      title={widget.config.title}
                      className="h-80 animate-fade-in"
                    >
                      {renderWidget(widget)}
                    </ChartCard>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-4 text-center text-sm text-muted-foreground">
        Generated by VisoryBI • Last updated: {new Date(currentDashboard.updatedAt).toLocaleString()}
      </footer>

      {/* Double-click Insight Modal */}
      {insightWidget && (
        <InsightModal
          widget={insightWidget}
          data={getDatasetData(insightWidget.config.datasetId)}
          position={insightPos}
          onClose={() => setInsightWidget(null)}
        />
      )}
    </div>
  );
}
