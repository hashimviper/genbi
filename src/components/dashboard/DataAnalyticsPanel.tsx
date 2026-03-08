import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Table2, BarChart3, Trophy, ArrowUpDown, Download, Search, Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { DataColumn } from '@/types/dashboard';
import { calculateSummaries, rankData, RankingConfig } from '@/lib/rankingUtils';
import { formatAxisValue } from '@/lib/chartUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DataAnalyticsPanelProps {
  columns: DataColumn[];
  data: Record<string, unknown>[];
}

interface ExpandableSectionProps {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function ExpandableSection({ title, icon, badge, defaultOpen = false, children }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {badge && (
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">{badge}</Badge>
        )}
        <div className="ml-auto">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-border/50 p-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DATA TABLE SECTION
// ══════════════════════════════════════════════════════════════════════════════
function DataTableSection({ columns, data }: { columns: DataColumn[]; data: Record<string, unknown>[] }) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columnNames = columns.map(c => c.name);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') { setSortColumn(null); setSortDirection(null); }
      else setSortDirection('asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter(row =>
      columnNames.some(col => String(row[col] ?? '').toLowerCase().includes(lower))
    );
  }, [data, columnNames, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') cmp = aVal - bVal;
      else cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''));
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleExportCSV = () => {
    const header = columnNames.join(',');
    const rows = sortedData.map(row => columnNames.map(col => {
      const val = row[col];
      const str = String(val ?? '');
      return str.includes(',') ? `"${str}"` : str;
    }).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search all columns..."
            className="h-9 pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCSV}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
        <span className="text-xs text-muted-foreground">
          {filteredData.length} of {data.length} rows
        </span>
      </div>

      {/* Table */}
      <ScrollArea className="h-[300px] rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {columnNames.map((col) => (
                <TableHead
                  key={col}
                  className="text-xs font-semibold uppercase cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-1">
                    <span className="truncate">{col}</span>
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.slice(0, 100).map((row, i) => (
              <TableRow key={i} className="hover:bg-muted/50">
                {columnNames.map((col) => (
                  <TableCell key={col} className="text-sm py-2">
                    {typeof row[col] === 'number' ? (row[col] as number).toLocaleString() : String(row[col] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUMMARY METRICS SECTION
// ══════════════════════════════════════════════════════════════════════════════
function SummaryMetricsSection({ columns, data }: { columns: DataColumn[]; data: Record<string, unknown>[] }) {
  const numericCols = columns.filter(c => c.type === 'number');
  const [selectedField, setSelectedField] = useState(numericCols[0]?.name || '');

  const summaries = useMemo(() => {
    if (!selectedField) return null;
    return calculateSummaries(data, { metrics: ['total', 'average', 'min', 'max', 'count', 'distinctCount'], valueField: selectedField });
  }, [data, selectedField]);

  if (numericCols.length === 0) {
    return <p className="text-sm text-muted-foreground">No numeric columns available for summary.</p>;
  }

  const formatLabel = (label: string) => {
    if (label === 'distinctCount') return 'Distinct';
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="space-y-4">
      {/* Field Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Summarize:</span>
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger className="w-[200px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {numericCols.map(col => (
              <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Grid */}
      {summaries && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {(['total', 'average', 'min', 'max', 'count', 'distinctCount'] as const).map(key => (
            <div
              key={key}
              className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 p-4 text-center"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">{formatLabel(key)}</p>
              <p className="text-xl font-bold text-foreground">
                {typeof summaries[key] === 'number' ? formatAxisValue(summaries[key] as number) : summaries[key]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RANKING SECTION
// ══════════════════════════════════════════════════════════════════════════════
function RankingSection({ columns, data }: { columns: DataColumn[]; data: Record<string, unknown>[] }) {
  const numericCols = columns.filter(c => c.type === 'number');
  const stringCols = columns.filter(c => c.type === 'string');
  
  const [rankField, setRankField] = useState(numericCols[0]?.name || '');
  const [labelField, setLabelField] = useState(stringCols[0]?.name || columns[0]?.name || '');
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [limit, setLimit] = useState(10);

  const rankedData = useMemo(() => {
    if (!rankField) return [];
    const config: RankingConfig = {
      enabled: true,
      field: rankField,
      direction,
      limit,
    };
    return rankData(data, config);
  }, [data, rankField, direction, limit]);

  if (numericCols.length === 0) {
    return <p className="text-sm text-muted-foreground">No numeric columns available for ranking.</p>;
  }

  const maxValue = rankedData.length > 0 ? Math.max(...rankedData.map(r => Number(r[rankField]) || 0)) : 1;

  const getMedalColor = (index: number) => {
    if (direction === 'desc') {
      if (index === 0) return 'text-yellow-500';
      if (index === 1) return 'text-slate-400';
      if (index === 2) return 'text-amber-600';
    } else {
      const lastIndex = rankedData.length - 1;
      if (index === lastIndex) return 'text-yellow-500';
      if (index === lastIndex - 1) return 'text-slate-400';
      if (index === lastIndex - 2) return 'text-amber-600';
    }
    return 'text-muted-foreground/30';
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rank by:</span>
          <Select value={rankField} onValueChange={setRankField}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {numericCols.map(col => (
                <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Label:</span>
          <Select value={labelField} onValueChange={setLabelField}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {columns.map(col => (
                <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Order:</span>
          <Select value={direction} onValueChange={(v) => setDirection(v as 'asc' | 'desc')}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Best → Worst</SelectItem>
              <SelectItem value="asc">Worst → Best</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Top:</span>
          <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
            <SelectTrigger className="w-[80px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ranking List */}
      <div className="space-y-2">
        {rankedData.map((row, index) => {
          const value = Number(row[rankField]) || 0;
          const label = String(row[labelField] ?? `Item ${index + 1}`);
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const isTop3 = direction === 'desc' ? index < 3 : index >= rankedData.length - 3;

          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-muted/50',
                isTop3 && 'bg-gradient-to-r from-primary/5 to-transparent'
              )}
            >
              {/* Rank Number */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm shrink-0">
                {index + 1}
              </div>

              {/* Medal for top 3 */}
              <Medal className={cn('h-5 w-5 shrink-0', getMedalColor(index))} />

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{label}</p>
                {/* Progress bar */}
                <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      direction === 'desc'
                        ? index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-600' : 'bg-primary/60'
                        : 'bg-primary/60'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Value */}
              <div className="flex items-center gap-1 shrink-0">
                {direction === 'desc' && index < 3 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                {direction === 'asc' && index < 3 && <TrendingDown className="h-4 w-4 text-red-500" />}
                <span className="text-sm font-bold text-foreground">{formatAxisValue(value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
export function DataAnalyticsPanel({ columns, data }: DataAnalyticsPanelProps) {
  if (data.length === 0) return null;

  const numericCols = columns.filter(c => c.type === 'number');

  return (
    <div className="mb-6 space-y-3">
      {/* Data Table Section */}
      <ExpandableSection
        title="Data Table"
        icon={<Table2 className="h-4 w-4 text-primary" />}
        badge={`${data.length} rows`}
        defaultOpen={false}
      >
        <DataTableSection columns={columns} data={data} />
      </ExpandableSection>

      {/* Summary Metrics Section */}
      {numericCols.length > 0 && (
        <ExpandableSection
          title="Summary Metrics"
          icon={<BarChart3 className="h-4 w-4 text-primary" />}
          badge={`${numericCols.length} numeric fields`}
          defaultOpen={true}
        >
          <SummaryMetricsSection columns={columns} data={data} />
        </ExpandableSection>
      )}

      {/* Ranking Section */}
      {numericCols.length > 0 && (
        <ExpandableSection
          title="Ranking"
          icon={<Trophy className="h-4 w-4 text-primary" />}
          badge="Best → Worst"
          defaultOpen={false}
        >
          <RankingSection columns={columns} data={data} />
        </ExpandableSection>
      )}
    </div>
  );
}
