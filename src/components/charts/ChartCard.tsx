import { ReactNode } from 'react';
import { MoreHorizontal, Maximize2, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  onDelete?: () => void;
  onConfigure?: () => void;
  isDragging?: boolean;
}

export function ChartCard({
  title,
  children,
  className,
  onDelete,
  onConfigure,
  isDragging,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        'glass-card group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300',
        isDragging && 'ring-2 ring-primary shadow-lg scale-[1.02]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onConfigure}>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
