import { useState, useEffect } from 'react';
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

interface WidgetEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widget: DashboardWidget | null;
  columns: DataColumn[];
  data: Record<string, unknown>[];
  onSave: (widget: DashboardWidget, updatedData?: Record<string, unknown>[]) => void;
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

  useEffect(() => {
    if (widget) {
      setEditedWidget(JSON.parse(JSON.stringify(widget)));
      setEditedData(JSON.parse(JSON.stringify(data)));
    }
  }, [widget, data]);

  if (!editedWidget) return null;

  const numericColumns = columns.filter((c) => c.type === 'number');

  const updateConfig = (updates: Record<string, unknown>) => {
    setEditedWidget({
      ...editedWidget,
      config: { ...editedWidget.config, ...updates },
    });
  };

  const updateDataCell = (rowIndex: number, column: string, value: string) => {
    const newData = [...editedData];
    const columnDef = columns.find(c => c.name === column);
    newData[rowIndex] = {
      ...newData[rowIndex],
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
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                        <Select value={editedWidget.config.labelField || ''} onValueChange={(v) => updateConfig({ labelField: v })}>
                          <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                          <SelectContent>{columns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Value Field</Label>
                        <Select value={editedWidget.config.valueField || ''} onValueChange={(v) => updateConfig({ valueField: v })}>
                          <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                          <SelectContent>{numericColumns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : editedWidget.type === 'gauge' ? (
                    <div className="space-y-2">
                      <Label>Value Field</Label>
                      <Select value={editedWidget.config.valueField || ''} onValueChange={(v) => updateConfig({ valueField: v })}>
                        <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                        <SelectContent>{numericColumns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>X Axis</Label>
                        <Select value={editedWidget.config.xAxis || ''} onValueChange={(v) => updateConfig({ xAxis: v })}>
                          <SelectTrigger><SelectValue placeholder="Select field" /></SelectTrigger>
                          <SelectContent>{columns.map((c) => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Y Axis</Label>
                        <Select value={editedWidget.config.yAxis || ''} onValueChange={(v) => updateConfig({ yAxis: v })}>
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

          {/* Colors Tab */}
          <TabsContent value="colors" className="flex-1 overflow-y-auto mt-4 min-h-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary Chart Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(editedWidget.config as any).primaryColor || '#6366f1'}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="h-9 w-12 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={(editedWidget.config as any).primaryColor || '#6366f1'}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="flex-1"
                    placeholder="#6366f1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Label Text Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(editedWidget.config as any).labelColor || '#666666'}
                    onChange={(e) => updateConfig({ labelColor: e.target.value })}
                    className="h-9 w-12 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={(editedWidget.config as any).labelColor || '#666666'}
                    onChange={(e) => updateConfig({ labelColor: e.target.value })}
                    className="flex-1"
                    placeholder="#666666"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Label Background</Label>
                <Select
                  value={(editedWidget.config as any).labelBg === true ? 'true' : 'false'}
                  onValueChange={(v) => updateConfig({ labelBg: v === 'true' })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Enabled</SelectItem>
                    <SelectItem value="false">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Show Labels</Label>
                <Select
                  value={(editedWidget.config as any).showDataLabels === true ? 'true' : 'false'}
                  onValueChange={(v) => updateConfig({ showDataLabels: v === 'true' })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

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

              {isChartConfig(editedWidget.config) && !['kpi', 'gauge', 'table'].includes(editedWidget.type) && (
                <>
                  <div className="space-y-2">
                    <Label>X-Axis Label</Label>
                    <Input
                      value={(editedWidget.config as any).xAxisLabel || ''}
                      onChange={(e) => updateConfig({ xAxisLabel: e.target.value })}
                      placeholder="Auto (field name)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y-Axis Label</Label>
                    <Input
                      value={(editedWidget.config as any).yAxisLabel || ''}
                      onChange={(e) => updateConfig({ yAxisLabel: e.target.value })}
                      placeholder="Auto (field name)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={(editedWidget.config as any).fontSize || '12'}
                      onValueChange={(v) => updateConfig({ fontSize: v })}
                    >
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
                    <Select
                      value={(editedWidget.config as any).legendPosition || 'bottom'}
                      onValueChange={(v) => updateConfig({ legendPosition: v })}
                    >
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
                    <Select
                      value={(editedWidget.config as any).showLegend === false ? 'false' : 'true'}
                      onValueChange={(v) => updateConfig({ showLegend: v === 'true' })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Data Editor - FIXED flex layout */}
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
                  {editedData.slice(0, 50).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="text-center text-muted-foreground">
                        {rowIndex + 1}
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
            {editedData.length > 50 && (
              <p className="mt-2 text-sm text-muted-foreground text-center shrink-0">
                Showing first 50 rows of {editedData.length} total
              </p>
            )}
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
