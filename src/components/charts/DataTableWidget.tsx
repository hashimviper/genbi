import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableWidgetProps {
  data: Record<string, unknown>[];
  columns: string[];
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTableWidget({ data, columns }: DataTableWidgetProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''));
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, sortColumn, sortDirection]);

  // Calculate summary row
  const summaryRow = useMemo(() => {
    const summary: Record<string, string> = {};
    columns.forEach(col => {
      const numericValues = data.map(row => row[col]).filter((v): v is number => typeof v === 'number');
      if (numericValues.length > 0 && numericValues.length === data.filter(row => row[col] !== undefined && row[col] !== null && row[col] !== '').length) {
        const total = numericValues.reduce((a, b) => a + b, 0);
        summary[col] = `Σ ${total.toLocaleString()}`;
      } else {
        summary[col] = '';
      }
    });
    return summary;
  }, [data, columns]);

  return (
    <ScrollArea className="h-full w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col}
                className="text-xs font-semibold uppercase text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => handleSort(col)}
              >
                <span className="flex items-center gap-1">
                  {col}
                  {sortColumn === col ? (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.slice(0, 50).map((row, i) => (
            <TableRow
              key={i}
              className="border-border/30 hover:bg-secondary/50"
            >
              {columns.map((col) => (
                <TableCell key={col} className="text-sm">
                  {typeof row[col] === 'number' ? (row[col] as number).toLocaleString() : String(row[col] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {/* Summary Row */}
          {Object.values(summaryRow).some(v => v !== '') && (
            <TableRow className="border-t-2 border-border bg-muted/30 font-medium">
              {columns.map((col) => (
                <TableCell key={col} className="text-xs text-primary font-semibold">
                  {summaryRow[col]}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
