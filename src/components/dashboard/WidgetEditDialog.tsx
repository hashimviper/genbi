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
import { ScrollArea } from '@/components/ui/scroll-area';
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Widget: {editedWidget.config.title}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="data">Data Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4 mt-4">
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
                  {/* Chart type selector */}
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
                        <Select
                          value={editedWidget.config.labelField || ''}
                          onValueChange={(v) => updateConfig({ labelField: v })}
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
                        <Label>Value Field</Label>
                        <Select
                          value={editedWidget.config.valueField || ''}
                          onValueChange={(v) => updateConfig({ valueField: v })}
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
                  ) : editedWidget.type === 'gauge' ? (
                    <>
                      <div className="space-y-2">
                        <Label>Value Field</Label>
                        <Select
                          value={editedWidget.config.valueField || ''}
                          onValueChange={(v) => updateConfig({ valueField: v })}
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
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>X Axis</Label>
                        <Select
                          value={editedWidget.config.xAxis || ''}
                          onValueChange={(v) => updateConfig({ xAxis: v })}
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
                        <Label>Y Axis</Label>
                        <Select
                          value={editedWidget.config.yAxis || ''}
                          onValueChange={(v) => updateConfig({ yAxis: v })}
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
                </>
              )}

              {isKPIConfig(editedWidget.config) && (
                <>
                  <div className="space-y-2">
                    <Label>Value Field</Label>
                    <Select
                      value={editedWidget.config.valueField}
                      onValueChange={(v) => updateConfig({ valueField: v })}
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
                      value={editedWidget.config.aggregation}
                      onValueChange={(v) => updateConfig({ aggregation: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Input
                      value={editedWidget.config.prefix || ''}
                      onChange={(e) => updateConfig({ prefix: e.target.value })}
                      placeholder="$"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Suffix</Label>
                    <Input
                      value={editedWidget.config.suffix || ''}
                      onChange={(e) => updateConfig({ suffix: e.target.value })}
                      placeholder="%"
                    />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">#</TableHead>
                    {columns.map((col) => (
                      <TableHead key={col.name} className="min-w-[120px]">
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
                            className="h-8 text-sm"
                            type={col.type === 'number' ? 'number' : 'text'}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            {editedData.length > 50 && (
              <p className="mt-2 text-sm text-muted-foreground text-center">
                Showing first 50 rows of {editedData.length} total
              </p>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
