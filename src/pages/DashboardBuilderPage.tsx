import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Save, Undo } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ChartCard } from '@/components/charts/ChartCard';
import { BarChartWidget } from '@/components/charts/BarChartWidget';
import { LineChartWidget } from '@/components/charts/LineChartWidget';
import { PieChartWidget } from '@/components/charts/PieChartWidget';
import { AreaChartWidget } from '@/components/charts/AreaChartWidget';
import { KPICard } from '@/components/charts/KPICard';
import { DataTableWidget } from '@/components/charts/DataTableWidget';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { isChartConfig, isKPIConfig, DashboardWidget } from '@/types/dashboard';

export default function DashboardBuilderPage() {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('id');
  
  const { dashboards, datasets, currentDashboard, setCurrentDashboard, removeWidget } = useDashboardStore();

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

  const handleSave = () => {
    toast({ title: 'Dashboard saved', description: 'Your changes have been saved locally.' });
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
      <MainLayout>
        <div className="flex h-full flex-col items-center justify-center p-6">
          <p className="text-muted-foreground">Select a dashboard from My Dashboards or create a new one.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{currentDashboard.name}</h1>
            <p className="text-sm text-muted-foreground">{currentDashboard.widgets.length} widgets</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Undo className="h-4 w-4" /> Undo
            </Button>
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6">
          {currentDashboard.widgets.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Plus className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 font-medium text-muted-foreground">No widgets yet</p>
              <p className="text-sm text-muted-foreground">Go to Admin Panel to add widgets</p>
            </div>
          ) : (
            <div className="chart-grid">
              {currentDashboard.widgets.map((widget) => (
                widget.type === 'kpi' ? (
                  <div key={widget.id} className="animate-scale-in">
                    {renderWidget(widget)}
                  </div>
                ) : (
                  <ChartCard
                    key={widget.id}
                    title={widget.config.title}
                    className="h-80 animate-scale-in"
                    onDelete={() => removeWidget(currentDashboard.id, widget.id)}
                  >
                    {renderWidget(widget)}
                  </ChartCard>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
