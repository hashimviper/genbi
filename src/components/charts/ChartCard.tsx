import { ReactNode, useState } from 'react';
import { MoreHorizontal, Maximize2, Minimize2, Trash2, Settings, ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface DrillBreadcrumb {
  level: string;
  value: string;
}

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  onDelete?: () => void;
  onConfigure?: () => void;
  isDragging?: boolean;
  drillBreadcrumb?: DrillBreadcrumb[];
  canDrillUp?: boolean;
  canDrillDown?: boolean;
  onDrillUp?: () => void;
  onDrillReset?: () => void;
}

export function ChartCard({
  title,
  children,
  className,
  onDelete,
  onConfigure,
  isDragging,
  drillBreadcrumb,
  canDrillUp: drillUpAvailable,
  canDrillDown: drillDownAvailable,
  onDrillUp,
  onDrillReset,
}: ChartCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasDrill = drillBreadcrumb && drillBreadcrumb.length > 0;

  return (
    <>
      <div
        className={cn(
          'glass-card group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300',
          isDragging && 'ring-2 ring-primary shadow-lg scale-[1.02]',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
            {drillDownAvailable && !hasDrill && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0 text-primary border-primary/30">
                Click to drill
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {hasDrill && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onDrillReset}
                  title="Reset drill"
                >
                  <Home className="h-3.5 w-3.5" />
                </Button>
                {drillUpAvailable && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={onDrillUp}
                    title="Drill up"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                )}
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setIsFullscreen(true)}
            >
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

        {/* Drill Breadcrumb */}
        {hasDrill && (
          <div className="flex items-center gap-1 px-4 py-1.5 bg-primary/5 border-b border-border/30 text-xs">
            <button onClick={onDrillReset} className="text-primary hover:underline font-medium">All</button>
            {drillBreadcrumb!.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-foreground font-medium">{crumb.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Chart Content */}
        <div className="flex-1 p-4">{children}</div>
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {hasDrill && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs">
              <button onClick={onDrillReset} className="text-primary hover:underline font-medium">All</button>
              {drillBreadcrumb!.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground font-medium">{crumb.value}</span>
                </span>
              ))}
              {drillUpAvailable && (
                <Button variant="ghost" size="sm" className="h-6 ml-2 text-xs" onClick={onDrillUp}>
                  <ChevronLeft className="h-3 w-3 mr-1" /> Back
                </Button>
              )}
            </div>
          )}
          <div className="flex-1 min-h-0 p-4">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
