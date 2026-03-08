import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DataTableWidgetProps {
  data: Record<string, unknown>[];
  columns: string[];
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTableWidget({ data, columns }: DataTableWidgetProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

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
    let result = data;
    // Global search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(row =>
        columns.some(col => String(row[col] ?? '').toLowerCase().includes(lower))
      );
    }
    // Column filters
    for (const [col, filter] of Object.entries(columnFilters)) {
      if (filter) {
        const lower = filter.toLowerCase();
        result = result.filter(row => String(row[col] ?? '').toLowerCase().includes(lower));
      }
    }
    return result;
  }, [data, columns, searchTerm, columnFilters]);

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

  // Summary row
  const summaryRow = useMemo(() => {
    const summary: Record<string, string> = {};
    columns.forEach(col => {
      const numericValues = filteredData.map(row => row[col]).filter((v): v is number => typeof v === 'number');
      if (numericValues.length > 0 && numericValues.length === filteredData.filter(row => row[col] !== undefined && row[col] !== null && row[col] !== '').length) {
        const total = numericValues.reduce((a, b) => a + b, 0);
        summary[col] = `Σ ${total.toLocaleString()}`;
      } else {
        summary[col] = '';
      }
    });
    return summary;
  }, [filteredData, columns]);

  const handleExportCSV = () => {
    const header = columns.join(',');
    const rows = sortedData.map(row => columns.map(col => {
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
    <div className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border/30 shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search all columns..."
            className="h-7 pl-7 text-xs"
          />
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={handleExportCSV}>
          <Download className="h-3 w-3" /> CSV
        </Button>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {filteredData.length} of {data.length} rows
        </span>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col} className="text-xs font-semibold uppercase text-muted-foreground p-0">
                  <div
                    className="flex items-center gap-1 px-3 py-2 cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort(col)}
                  >
                    <span className="truncate">{col}</span>
                    {sortColumn === col ? (
                      sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 shrink-0" /> : <ArrowDown className="h-3 w-3 shrink-0" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30 shrink-0" />
                    )}
                  </div>
                  {/* Column filter */}
                  <Input
                    value={columnFilters[col] || ''}
                    onChange={e => setColumnFilters(prev => ({ ...prev, [col]: e.target.value }))}
                    placeholder="Filter..."
                    className="h-6 text-[10px] mx-2 mb-1 bg-muted/30 border-0 focus-visible:ring-1"
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.slice(0, 100).map((row, i) => (
              <TableRow key={i} className="border-border/30 hover:bg-secondary/50">
                {columns.map((col) => (
                  <TableCell key={col} className="text-sm py-1.5">
                    {typeof row[col] === 'number' ? (row[col] as number).toLocaleString() : String(row[col] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {/* Summary Row */}
            {Object.values(summaryRow).some(v => v !== '') && (
              <TableRow className="border-t-2 border-border bg-muted/30 font-medium">
                {columns.map((col) => (
                  <TableCell key={col} className="text-xs text-primary font-semibold py-1.5">
                    {summaryRow[col]}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
