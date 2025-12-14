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

export function DataTableWidget({ data, columns }: DataTableWidgetProps) {
  return (
    <ScrollArea className="h-full w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col}
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 50).map((row, i) => (
            <TableRow
              key={i}
              className="border-border/30 hover:bg-secondary/50"
            >
              {columns.map((col) => (
                <TableCell key={col} className="text-sm">
                  {String(row[col] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
