import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardWidget, DataColumn, isKPIConfig, isChartConfig } from '@/types/dashboard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPreviewPage } from '@/lib/dataModel';

interface WidgetEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget: DashboardWidget | null;
  columns: DataColumn[];
  data: Record<string, unknown>[];
  onSave: (widget: DashboardWidget, updatedData?: Record<string, unknown>[]) => void;
}

// Color picker row component
function ColorPickerRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded border border-border cursor-pointer"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1" placeholder={value} />
      </div>
    </div>
  );
}

export function WidgetEditDialog({
  open,
  onOpenChange,
  widget,
  columns,
  data,
  onSave,
}: WidgetEditDialogProps) {
  const [editedWidget, setEditedWidget] = useState<DashboardWidget | null>(null);
  const [editedData, setEditedData] = useState<Record<string, unknown>[]>([]);
  const [activeTab, setActiveTab] = useState('config');
  const [dataPage, setDataPage] = useState(1);

  useEffect(() => {
    if (widget) {
      setEditedWidget(JSON.parse(JSON.stringify(widget)));
      setEditedData(JSON.parse(JSON.stringify(data)));
      setDataPage(1);
    }
  }, [widget, data]);

  const dataPreview = useMemo(() => getPreviewPage(editedData, dataPage, 200), [editedData, dataPage]);

  if (!editedWidget) return null;

  const numericColumns = columns.filter((c) => c.type === 'number');
  const cfg = editedWidget.config as any;

  const updateConfig = (updates: Record<string, unknown>) => {
    setEditedWidget({
      ...editedWidget,
      config: { ...editedWidget.config, ...updates },
    });
  };

  const updateDataCell = (rowIndex: number, column: string, value: string) => {
    const globalIndex = (dataPage - 1) * 200 + rowIndex;
    const newData = [...editedData];
    const columnDef = columns.find(c => c.name === column);
    newData[globalIndex] = {
      ...newData[globalIndex],
      [column]: columnDef?.type === 'number' ? parseFloat(value) || 0 : value,
    };
    setEditedData(newData);
  };

  const handleSave = () => {
    if (editedWidget) {
      onSave(editedWidget, editedData);
    }
    onOpenChange(false);
  };

  // Detect unique categories for per-category color pickers
  const categoryField = cfg.xAxis || cfg.labelField || '';
  const uniqueCategories = useMemo(() => {
    if (!categoryField || !data.length) return [];
    const unique = [...new Set(data.map(r => String(r[categoryField] ?? '')))];
    return unique.slice(0, 12);
  }, [data, categoryField]);

  const categoryColors: Record<string, string> = cfg.categoryColors || {};
  const setCategoryColor = (cat: string, color: string) => {
    updateConfig({ categoryColors: { ...categoryColors, [cat]: color } });
  };

  const DEFAULT_CAT_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#14b8a6', '#a855f7', '#eab308'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl flex flex-col" style={{ maxHeight: '90vh' }}>
        <DialogHeader className="shrink-0">
          <DialogTitle>Edit Widget: {editedWidget.config.title}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4 shrink-0">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="labels">Labels</TabsTrigger>
            <TabsTrigger value="data">Data Editor</TabsTrigger>
          </TabsList>

          {/* ── Configuration Tab ── */}
          <TabsContent value="config" className="flex-1 overflow-y-auto mt-4 min-h-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editedWidget.config.title}
                  onChange={(e) => updateConfig({ title: e.target.value })}
                />
              </div>

              {isChartConfig(editedWidget.config) && editedWidget.type !== 'table' && (
                <>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Chart Type</Label>
                    <Select
                      value={editedWidget.type}
                      onValueChange={(v) => {
                        setEditedWidget({
                          ...editedWidget,
                          type: v as any,
                          config: { ...editedWidget.config, type: v as any },
                        });
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="donut">Donut Chart</SelectItem>
                        <SelectItem value="horizontalBar">Horizontal Bar</SelectItem>
                        <SelectItem value="scatter">Scatter Plot</SelectItem>
                        <SelectItem value="radar">Radar Chart</SelectItem>
                        <SelectItem value="treemap">Treemap</SelectItem>
                        <SelectItem value="funnel">Funnel Chart</SelectItem>
                        <SelectItem value="waterfall">Waterfall</SelectItem>
                        <SelectItem value="gauge">Gauge</SelectItem>
                        <SelectItem value="combo">Combo Chart</SelectItem>
                        <SelectItem value="stackedBar">Stacked Bar</SelectItem>
                        <SelectItem value="sparkline">Sparkline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {['pie', 'donut', 'treemap', 'funnel', 'horizontalBar', 'radar', 'waterfall'].includes(editedWidget.type) ? (
                    <>
                      <div className="space-y-2">
                        <Label>Label Field</Label>
                        <Select value={cfg.labelField || ''} onValueChange={(v) => updateConfig({ labelField: v })}>
                          <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                          <SelectContent>{columns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Value Field</Label>
                        <Select value={cfg.valueField || ''} onValueChange={(v) => updateConfig({ valueField: v })}>
                          <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                          <SelectContent>{numericColumns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : editedWidget.type === 'gauge' ? (
                    <div className="space-y-2">
                      <Label>Value Field</Label>
                      <Select value={cfg.valueField || ''} onValueChange={(v) => updateConfig({ valueField: v })}>
                        <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                        <SelectContent>{numericColumns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>X Axis</Label>
                        <Select value={cfg.xAxis || ''} onValueChange={(v) => updateConfig({ xAxis: v })}>
                          <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                          <SelectContent>{columns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Y Axis</Label>
                        <Select value={cfg.yAxis || ''} onValueChange={(v) => updateConfig({ yAxis: v })}>
                          <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                          <SelectContent>{numericColumns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </>
              )}

              {isKPIConfig(editedWidget.config) && (
                <>
                  <div className="space-y-2">
                    <Label>Value Field</Label>
                    <Select value={editedWidget.config.valueField} onValueChange={(v) => updateConfig({ valueField: v })}>
                      <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                      <SelectContent>{numericColumns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Aggregation</Label>
                    <Select value={editedWidget.config.aggregation} onValueChange={(v) => updateConfig({ aggregation: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="avg">Average</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="min">Minimum</SelectItem>
                        <SelectItem value="max">Maximum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prefix</Label>
                    <Input value={editedWidget.config.prefix || ''} onChange={(e) => updateConfig({ prefix: e.target.value })} placeholder="$" />
                  </div>
                  <div className="space-y-2">
                    <Label>Suffix</Label>
                    <Input value={editedWidget.config.suffix || ''} onChange={(e) => updateConfig({ suffix: e.target.value })} placeholder="%" />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* ── Colors Tab ── */}
          <TabsContent value="colors" className="flex-1 overflow-y-auto mt-4 min-h-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorPickerRow label="Primary Chart Color" value={cfg.primaryColor || '#6366f1'} onChange={(v) => updateConfig({ primaryColor: v })} />
              <ColorPickerRow label="Chart Background" value={cfg.chartBgColor || '#ffffff'} onChange={(v) => updateConfig({ chartBgColor: v === '#ffffff' ? undefined : v })} />
              <ColorPickerRow label="Axis Color" value={cfg.axisColor || '#e2e8f0'} onChange={(v) => updateConfig({ axisColor: v })} />
              <ColorPickerRow label="Gridline Color" value={cfg.gridColor || '#e2e8f0'} onChange={(v) => updateConfig({ gridColor: v })} />

              <div className="space-y-2">
                <Label>Show Labels</Label>
                <Select
                  value={cfg.showDataLabels === true ? 'true' : 'false'}
                  onValueChange={(v) => updateConfig({ showDataLabels: v === 'true' })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Line chart extras */}
              {editedWidget.type === 'line' && (
                <>
                  <div className="space-y-2">
                    <Label>Line Thickness</Label>
                    <Select value={String(cfg.lineThickness || 2)} onValueChange={(v) => updateConfig({ lineThickness: Number(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Thin (1px)</SelectItem>
                        <SelectItem value="2">Normal (2px)</SelectItem>
                        <SelectItem value="3">Thick (3px)</SelectItem>
                        <SelectItem value="4">Extra Thick (4px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Area Fill</Label>
                    <Select value={cfg.areaFill ? 'true' : 'false'} onValueChange={(v) => updateConfig({ areaFill: v === 'true' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* Per-category color pickers */}
            {uniqueCategories.length > 0 && ['bar', 'pie', 'donut', 'horizontalBar'].includes(editedWidget.type) && (
              <div className="mt-6 space-y-3">
                <Label className="text-sm font-medium">Category Colors ({categoryField})</Label>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {uniqueCategories.map((cat, i) => (
                    <div key={cat} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={categoryColors[cat] || DEFAULT_CAT_COLORS[i % DEFAULT_CAT_COLORS.length]}
                        onChange={(e) => setCategoryColor(cat, e.target.value)}
                        className="h-7 w-9 rounded border border-border cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-foreground truncate">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Labels Tab ── */}
          <TabsContent value="labels" className="flex-1 overflow-y-auto mt-4 min-h-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Chart Title</Label>
                <Input
                  value={editedWidget.config.title}
                  onChange={(e) => updateConfig({ title: e.target.value })}
                  placeholder="Chart title"
                />
              </div>

              <ColorPickerRow label="Title Color" value={cfg.titleColor || '#333333'} onChange={(v) => updateConfig({ titleColor: v })} />
              <ColorPickerRow label="Label Text Color" value={cfg.labelColor || '#666666'} onChange={(v) => updateConfig({ labelColor: v })} />

              {isChartConfig(editedWidget.config) && !['kpi', 'gauge', 'table'].includes(editedWidget.type) && (
                <>
                  <div className="space-y-2">
                    <Label>X-Axis Label</Label>
                    <Input
                      value={cfg.xAxisLabel || ''}
                      onChange={(e) => updateConfig({ xAxisLabel: e.target.value })}
                      placeholder="Auto (field name)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y-Axis Label</Label>
                    <Input
                      value={cfg.yAxisLabel || ''}
                      onChange={(e) => updateConfig({ yAxisLabel: e.target.value })}
                      placeholder="Auto (field name)"
                    />
                  </div>
                  <ColorPickerRow label="X-Axis Label Color" value={cfg.xAxisLabelColor || '#666666'} onChange={(v) => updateConfig({ xAxisLabelColor: v })} />
                  <ColorPickerRow label="Y-Axis Label Color" value={cfg.yAxisLabelColor || '#666666'} onChange={(v) => updateConfig({ yAxisLabelColor: v })} />
                  <ColorPickerRow label="Legend Text Color" value={cfg.legendColor || '#666666'} onChange={(v) => updateConfig({ legendColor: v })} />
                  <ColorPickerRow label="Data Label Color" value={cfg.dataLabelColor || '#666666'} onChange={(v) => updateConfig({ dataLabelColor: v })} />
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select value={cfg.fontSize || '12'} onValueChange={(v) => updateConfig({ fontSize: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10px</SelectItem>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Legend Position</Label>
                    <Select value={cfg.legendPosition || 'bottom'} onValueChange={(v) => updateConfig({ legendPosition: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="none">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Show Legend</Label>
                    <Select value={cfg.showLegend === false ? 'false' : 'true'} onValueChange={(v) => updateConfig({ showLegend: v === 'true' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Label Background</Label>
                    <Select value={cfg.labelBg === true ? 'true' : 'false'} onValueChange={(v) => updateConfig({ labelBg: v === 'true' })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Enabled</SelectItem>
                        <SelectItem value="false">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* ── Data Editor Tab with Pagination ── */}
          <TabsContent value="data" className="flex-1 flex flex-col mt-4 min-h-0">
            <div className="flex-1 overflow-auto rounded-md border min-h-0" style={{ maxHeight: '400px' }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center sticky top-0 bg-muted/90 z-10">#</TableHead>
                    {columns.map((col) => (
                      <TableHead key={col.name} className="min-w-[120px] sticky top-0 bg-muted/90 z-10">
                        {col.name}
                        <span className="ml-1 text-xs text-muted-foreground">({col.type})</span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataPreview.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="text-center text-muted-foreground">
                        {(dataPage - 1) * 200 + rowIndex + 1}
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.name} className="p-1">
                          <Input
                            value={String(row[col.name] ?? '')}
                            onChange={(e) => updateDataCell(rowIndex, col.name, e.target.value)}
                            className="h-8 text-sm w-full"
                            type={col.type === 'number' ? 'number' : 'text'}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="mt-2 flex items-center justify-between shrink-0">
              <p className="text-sm text-muted-foreground">
                Rows {(dataPage - 1) * 200 + 1}–{Math.min(dataPage * 200, dataPreview.totalRows)} of {dataPreview.totalRows}
              </p>
              {dataPreview.totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={dataPage <= 1} onClick={() => setDataPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground px-2">Page {dataPage}/{dataPreview.totalPages}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" disabled={dataPage >= dataPreview.totalPages} onClick={() => setDataPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
