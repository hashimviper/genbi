import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Maximize2 } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ChartCard } from '@/components/charts/ChartCard';
import { BarChartWidget } from '@/components/charts/BarChartWidget';
import { LineChartWidget } from '@/components/charts/LineChartWidget';
import { PieChartWidget } from '@/components/charts/PieChartWidget';
import { AreaChartWidget } from '@/components/charts/AreaChartWidget';
import { KPICard } from '@/components/charts/KPICard';
import { DataTableWidget } from '@/components/charts/DataTableWidget';
import { Button } from '@/components/ui/button';
import { isChartConfig, isKPIConfig, DashboardWidget } from '@/types/dashboard';

export default function DashboardOutputPage() {
  const { id } = useParams<{ id: string }>();
  const { dashboards, datasets, currentDashboard, setCurrentDashboard } = useDashboardStore();

  useEffect(() => {
    if (id) {
      const dashboard = dashboards.find((d) => d.id === id);
      if (dashboard) setCurrentDashboard(dashboard);
    }
  }, [id, dashboards, setCurrentDashboard]);

  const getDatasetData = (datasetId: string) => {
    return datasets.find((d) => d.id === datasetId)?.data || [];
  };

  const getDatasetColumns = (datasetId: string) => {
    return datasets.find((d) => d.id === datasetId)?.columns.map((c) => c.name) || [];
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

  const renderWidget = (widget: DashboardWidget) => {
    const config = widget.config;
    const data = getDatasetData(config.datasetId);

    if (isKPIConfig(config)) {
      const value = calculateKPIValue(config.datasetId, config.valueField, config.aggregation);
      return (
        <KPICard 
          title={config.title} 
          value={value} 
          prefix={config.prefix} 
          suffix={config.suffix} 
          trend="up" 
          trendValue="+12.5%" 
        />
      );
    }

    if (isChartConfig(config)) {
      switch (widget.type) {
        case 'bar':
          return <BarChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'line':
          return <LineChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'pie':
          return <PieChartWidget data={data} labelField={config.labelField || ''} valueField={config.valueField || ''} />;
        case 'area':
          return <AreaChartWidget data={data} xAxis={config.xAxis || ''} yAxis={config.yAxis || ''} />;
        case 'table':
          return <DataTableWidget data={data} columns={getDatasetColumns(config.datasetId)} />;
        default:
          return <div className="text-muted-foreground">Unknown widget type</div>;
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

  return (
    <div className="min-h-screen bg-background">
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
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Maximize2 className="h-4 w-4" /> Fullscreen
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6">
        {currentDashboard.widgets.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-muted-foreground">No widgets in this dashboard</p>
            <Link to={`/builder?id=${currentDashboard.id}`} className="mt-4">
              <Button>Add Widgets</Button>
            </Link>
          </div>
        ) : (
          <div className="chart-grid">
            {currentDashboard.widgets.map((widget) => (
              widget.type === 'kpi' ? (
                <div key={widget.id} className="animate-fade-in">
                  {renderWidget(widget)}
                </div>
              ) : (
                <ChartCard
                  key={widget.id}
                  title={widget.config.title}
                  className="h-80 animate-fade-in"
                >
                  {renderWidget(widget)}
                </ChartCard>
              )
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-4 text-center text-sm text-muted-foreground">
        Generated by GenBI • Last updated: {new Date(currentDashboard.updatedAt).toLocaleString()}
      </footer>
    </div>
  );
}
