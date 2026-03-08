import { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Trash2,
  BarChart3,
  Table2,
  HardDrive,
  FileSpreadsheet,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  getAllDatasetsFromIDB,
  deleteDatasetFromIDB,
  clearAllDatasetsFromIDB,
} from '@/lib/indexedDB';
import { DataSet } from '@/types/dashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
];

export function IndexedDBViewer() {
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [clearAll, setClearAll] = useState(false);
  const [viewDataset, setViewDataset] = useState<DataSet | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const refresh = async () => {
    setLoading(true);
    try {
      const ds = await getAllDatasetsFromIDB();
      setDatasets(ds);
    } catch {
      setDatasets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDatasetFromIDB(id);
    toast({ title: 'Dataset deleted', description: 'Removed from IndexedDB.' });
    setDeleteTarget(null);
    refresh();
  };

  const handleClearAll = async () => {
    await clearAllDatasetsFromIDB();
    toast({ title: 'All datasets cleared' });
    setClearAll(false);
    refresh();
  };

  const estimateSize = (data: Record<string, unknown>[]) => {
    try {
      const bytes = new Blob([JSON.stringify(data)]).size;
      if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      if (bytes > 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${bytes} B`;
    } catch {
      return 'N/A';
    }
  };

  const getNumericColumns = (ds: DataSet) =>
    ds.columns.filter((c) => c.type === 'number').map((c) => c.name);

  const getStringColumns = (ds: DataSet) =>
    ds.columns.filter((c) => c.type === 'string').map((c) => c.name);

  const renderDatasetChart = (ds: DataSet) => {
    const numCols = getNumericColumns(ds);
    const strCols = getStringColumns(ds);
    const labelCol = strCols[0];
    const displayData = ds.data.slice(0, 20);

    if (!labelCol || numCols.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          No chartable columns found
        </div>
      );
    }

    // Show bar chart for first 2 numeric cols + pie for first numeric col
    const valCols = numCols.slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Bar Chart */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-foreground">
            Bar Chart — {valCols.join(', ')} by {labelCol}
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey={labelCol} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend />
              {valCols.map((col, i) => (
                <Bar key={col} dataKey={col} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        {valCols.length >= 2 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Trend — {valCols.join(', ')}
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey={labelCol} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Legend />
                {valCols.map((col, i) => (
                  <Line key={col} type="monotone" dataKey={col} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-foreground">
            Distribution — {valCols[0]} by {labelCol}
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={displayData.slice(0, 8)}
                dataKey={valCols[0]}
                nameKey={labelCol}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {displayData.slice(0, 8).map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderDatasetTable = (ds: DataSet) => {
    const displayData = ds.data.slice(0, 50);
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            {ds.columns.map((col) => (
              <TableHead key={col.name} className="text-xs uppercase text-muted-foreground">
                {col.name}
                <Badge variant="outline" className="ml-1 text-[9px] px-1">
                  {col.type}
                </Badge>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((row, i) => (
            <TableRow key={i} className="border-border/30">
              {ds.columns.map((col) => (
                <TableCell key={col.name} className="text-sm">
                  {String(row[col.name] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">IndexedDB Storage</h3>
            <p className="text-xs text-muted-foreground">
              {datasets.length} dataset{datasets.length !== 1 ? 's' : ''} stored
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {datasets.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive"
              onClick={() => setClearAll(true)}
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear All
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refresh}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Dataset list */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Loading datasets...
          </div>
        ) : datasets.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
            <HardDrive className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No datasets in IndexedDB</p>
            <p className="text-xs text-muted-foreground">
              Upload large datasets (2MB+) and they'll be stored here automatically
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 text-center">
                <p className="text-2xl font-bold text-primary">{datasets.length}</p>
                <p className="text-xs text-muted-foreground">Datasets</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {datasets.reduce((sum, d) => sum + d.data.length, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Rows</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {datasets.reduce((sum, d) => sum + d.columns.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Columns</p>
              </div>
            </div>

            {/* Dataset rows */}
            {datasets.map((ds) => (
              <div
                key={ds.id}
                className="flex items-center gap-4 rounded-lg border border-border/30 bg-secondary/20 px-4 py-3 hover:bg-secondary/40 transition-colors"
              >
                <FileSpreadsheet className="h-8 w-8 text-primary/70 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{ds.name}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {ds.data.length.toLocaleString()} rows
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {ds.columns.length} cols
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {estimateSize(ds.data)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:text-primary"
                    onClick={() => {
                      setViewDataset(ds);
                      setViewMode('chart');
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(ds.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* View Dataset Dialog */}
      <Dialog open={!!viewDataset} onOpenChange={(open) => !open && setViewDataset(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              {viewDataset?.name}
              <div className="ml-auto flex gap-1">
                <Button
                  variant={viewMode === 'chart' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('chart')}
                  className="gap-1"
                >
                  <BarChart3 className="h-3.5 w-3.5" /> Charts
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="gap-1"
                >
                  <Table2 className="h-3.5 w-3.5" /> Table
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 mt-4">
            {viewDataset && (
              viewMode === 'chart'
                ? renderDatasetChart(viewDataset)
                : renderDatasetTable(viewDataset)
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete single */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this dataset?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the dataset from IndexedDB.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear all */}
      <AlertDialog open={clearAll} onOpenChange={setClearAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all datasets?</AlertDialogTitle>
            <AlertDialogDescription>This will remove all datasets from IndexedDB. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleClearAll}
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
