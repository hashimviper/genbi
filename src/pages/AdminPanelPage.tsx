import { useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  Table2,
  Hash,
  Settings2,
  Save,
  GripVertical,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ChartType, DashboardWidget } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const chartTypes: { type: ChartType; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
  { type: 'line', icon: LineChart, label: 'Line Chart' },
  { type: 'pie', icon: PieChart, label: 'Pie Chart' },
  { type: 'area', icon: AreaChart, label: 'Area Chart' },
  { type: 'scatter', icon: ScatterChart, label: 'Scatter Plot' },
  { type: 'table', icon: Table2, label: 'Data Table' },
  { type: 'kpi', icon: Hash, label: 'KPI Card' },
];

const aggregations = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
];

interface ChartConfiguration {
  type: ChartType;
  title: string;
  datasetId: string;
  xAxis?: string;
  yAxis?: string;
  labelField?: string;
  valueField?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  prefix?: string;
  suffix?: string;
}

export default function AdminPanelPage() {
  const { datasets, dashboards, addWidget, currentDashboard, setCurrentDashboard } = useDashboardStore();
  const [selectedDashboard, setSelectedDashboard] = useState<string>('');
  const [configs, setConfigs] = useState<ChartConfiguration[]>([]);

  const handleAddConfig = (type: ChartType) => {
    setConfigs((prev) => [
      ...prev,
      {
        type,
        title: '',
        datasetId: datasets[0]?.id || '',
        xAxis: '',
        yAxis: '',
        labelField: '',
        valueField: '',
        aggregation: 'sum',
        prefix: '',
        suffix: '',
      },
    ]);
  };

  const updateConfig = (index: number, updates: Partial<ChartConfiguration>) => {
    setConfigs((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...updates } : c))
    );
  };

  const removeConfig = (index: number) => {
    setConfigs((prev) => prev.filter((_, i) => i !== index));
  };

  const getDatasetColumns = (datasetId: string) => {
    return datasets.find((d) => d.id === datasetId)?.columns || [];
  };

  const handleSaveConfigurations = () => {
    if (!selectedDashboard) {
      toast({
        title: 'Select a dashboard',
        description: 'Please select a dashboard to add widgets to.',
        variant: 'destructive',
      });
      return;
    }

    configs.forEach((config, index) => {
      const widget: Omit<DashboardWidget, 'id'> = {
        type: config.type,
        config: {
          id: '',
          type: config.type,
          title: config.title || `Widget ${index + 1}`,
          datasetId: config.datasetId,
          xAxis: config.xAxis,
          yAxis: config.yAxis,
          labelField: config.labelField,
          valueField: config.valueField,
          aggregation: config.aggregation as 'sum' | 'avg' | 'count' | 'min' | 'max',
          prefix: config.prefix,
          suffix: config.suffix,
          width: 1,
          height: 1,
          position: { x: 0, y: 0 },
        },
        gridPosition: {
          x: (index % 2) * 6,
          y: Math.floor(index / 2) * 4,
          w: config.type === 'kpi' ? 3 : 6,
          h: config.type === 'kpi' ? 2 : 4,
        },
      };
      addWidget(selectedDashboard, widget);
    });

    toast({
      title: 'Widgets added',
      description: `${configs.length} widget(s) added to dashboard.`,
    });

    setConfigs([]);
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="mt-1 text-muted-foreground">
            Configure charts and widgets for your dashboards
          </p>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-3">
          {/* Chart Types Panel */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-4">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Settings2 className="h-5 w-5" />
                Widget Types
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {chartTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => handleAddConfig(type)}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border/50 p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-border/50 pt-4">
                <Label>Target Dashboard</Label>
                <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select dashboard" />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboards.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <div className="glass-card flex h-full flex-col rounded-xl">
              <div className="flex items-center justify-between border-b border-border/50 p-4">
                <h2 className="font-semibold text-foreground">
                  Widget Configurations ({configs.length})
                </h2>
                {configs.length > 0 && (
                  <Button onClick={handleSaveConfigurations} className="gap-2">
                    <Save className="h-4 w-4" />
                    Add to Dashboard
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-4 overflow-auto p-4">
                {configs.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                    <Settings2 className="h-12 w-12 text-muted-foreground/30" />
                    <p className="mt-4 font-medium text-muted-foreground">
                      No widgets configured
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click on a widget type to start configuring
                    </p>
                  </div>
                ) : (
                  configs.map((config, index) => {
                    const columns = getDatasetColumns(config.datasetId);
                    const numericColumns = columns.filter((c) => c.type === 'number');
                    const ChartIcon = chartTypes.find((c) => c.type === config.type)?.icon || BarChart3;

                    return (
                      <div
                        key={index}
                        className="animate-fade-in rounded-lg border border-border/50 bg-secondary/30 p-4"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                          <ChartIcon className="h-5 w-5 text-primary" />
                          <span className="font-medium text-foreground">
                            {chartTypes.find((c) => c.type === config.type)?.label}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-destructive hover:text-destructive"
                            onClick={() => removeConfig(index)}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={config.title}
                              onChange={(e) =>
                                updateConfig(index, { title: e.target.value })
                              }
                              placeholder="Widget title"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Dataset</Label>
                            <Select
                              value={config.datasetId}
                              onValueChange={(v) =>
                                updateConfig(index, { datasetId: v })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select dataset" />
                              </SelectTrigger>
                              <SelectContent>
                                {datasets.map((d) => (
                                  <SelectItem key={d.id} value={d.id}>
                                    {d.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {config.type !== 'kpi' && config.type !== 'table' && (
                            <>
                              <div className="space-y-2">
                                <Label>
                                  {config.type === 'pie' ? 'Label Field' : 'X Axis'}
                                </Label>
                                <Select
                                  value={config.type === 'pie' ? config.labelField : config.xAxis}
                                  onValueChange={(v) =>
                                    updateConfig(index, config.type === 'pie' ? { labelField: v } : { xAxis: v })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {columns.map((c) => (
                                      <SelectItem key={c.name} value={c.name}>
                                        {c.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>
                                  {config.type === 'pie' ? 'Value Field' : 'Y Axis'}
                                </Label>
                                <Select
                                  value={config.type === 'pie' ? config.valueField : config.yAxis}
                                  onValueChange={(v) =>
                                    updateConfig(index, config.type === 'pie' ? { valueField: v } : { yAxis: v })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {numericColumns.map((c) => (
                                      <SelectItem key={c.name} value={c.name}>
                                        {c.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}

                          {config.type === 'kpi' && (
                            <>
                              <div className="space-y-2">
                                <Label>Value Field</Label>
                                <Select
                                  value={config.valueField}
                                  onValueChange={(v) =>
                                    updateConfig(index, { valueField: v })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {numericColumns.map((c) => (
                                      <SelectItem key={c.name} value={c.name}>
                                        {c.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Aggregation</Label>
                                <Select
                                  value={config.aggregation}
                                  onValueChange={(v) =>
                                    updateConfig(index, { aggregation: v as 'sum' | 'avg' | 'count' | 'min' | 'max' })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {aggregations.map((a) => (
                                      <SelectItem key={a.value} value={a.value}>
                                        {a.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Prefix</Label>
                                <Input
                                  value={config.prefix}
                                  onChange={(e) =>
                                    updateConfig(index, { prefix: e.target.value })
                                  }
                                  placeholder="$"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Suffix</Label>
                                <Input
                                  value={config.suffix}
                                  onChange={(e) =>
                                    updateConfig(index, { suffix: e.target.value })
                                  }
                                  placeholder="%"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
