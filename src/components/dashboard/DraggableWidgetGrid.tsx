import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ReactNode } from 'react';
import { DashboardWidget } from '@/types/dashboard';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableWidgetGridProps {
  widgets: DashboardWidget[];
  onReorder: (widgets: DashboardWidget[]) => void;
  renderWidget: (widget: DashboardWidget) => ReactNode;
  renderCard: (widget: DashboardWidget, children: ReactNode, isDragging: boolean) => ReactNode;
}

export function DraggableWidgetGrid({
  widgets,
  onReorder,
  renderWidget,
  renderCard,
}: DraggableWidgetGridProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update grid positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      gridPosition: {
        ...item.gridPosition,
        x: (index % 2) * 6,
        y: Math.floor(index / 2) * 4,
      },
    }));

    onReorder(updatedItems);
  };

  // Separate KPI widgets and chart widgets for better layout
  const kpiWidgets = widgets.filter(w => w.type === 'kpi' || w.type === 'gauge' || w.type === 'sparkline');
  const chartWidgets = widgets.filter(w => w.type !== 'kpi' && w.type !== 'gauge' && w.type !== 'sparkline');

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* KPI Section */}
      {kpiWidgets.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Key Metrics
          </h3>
          <Droppable droppableId="kpis" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
                  snapshot.isDraggingOver && 'bg-primary/5 rounded-lg'
                )}
              >
                {kpiWidgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          'relative group',
                          snapshot.isDragging && 'z-50'
                        )}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className={cn(
                          'transition-transform',
                          snapshot.isDragging && 'scale-105 shadow-xl'
                        )}>
                          {renderWidget(widget)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}

      {/* Charts Section */}
      {chartWidgets.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Visualizations
          </h3>
          <Droppable droppableId="charts">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
                  snapshot.isDraggingOver && 'bg-primary/5 rounded-lg'
                )}
              >
                {chartWidgets.map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={kpiWidgets.length + index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          'relative',
                          snapshot.isDragging && 'z-50'
                        )}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        {renderCard(widget, renderWidget(widget), snapshot.isDragging)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </DragDropContext>
  );
}
