import { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataColumn, ChartType, DashboardWidget } from '@/types/dashboard';
import { parseQuery, getQuerySuggestions } from '@/lib/queryParser';
import { v4 as uuidv4 } from 'uuid';

interface QueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: DataColumn[];
  datasetId: string;
  onAddWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
}

export function QueryDialog({ open, onOpenChange, columns, datasetId, onAddWidget }: QueryDialogProps) {
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => getQuerySuggestions(columns), [columns]);

  const parsed = useMemo(() => {
    if (!query.trim()) return null;
    return parseQuery(query, columns);
  }, [query, columns]);

  const handleGenerate = () => {
    if (!parsed || !parsed.isValid) return;

    const chartType = parsed.chartType as ChartType;
    const usesXY = ['bar', 'line', 'area', 'scatter', 'combo', 'stackedBar'].includes(chartType);

    const config: Record<string, unknown> = {
      title: `${parsed.aggregation.toUpperCase()} of ${parsed.measure} by ${parsed.dimension}`,
      datasetId,
      width: 6,
      height: 4,
      position: { x: 0, y: 0 },
      type: chartType,
    };

    if (chartType === 'kpi') {
      Object.assign(config, {
        valueField: parsed.measure,
        aggregation: parsed.aggregation,
      });
    } else if (usesXY) {
      Object.assign(config, {
        xAxis: parsed.dimension,
        yAxis: parsed.measure,
      });
    } else {
      Object.assign(config, {
        labelField: parsed.dimension,
        valueField: parsed.measure,
      });
    }

    const widget: Omit<DashboardWidget, 'id'> = {
      type: chartType,
      config: config as any,
      gridPosition: { x: 0, y: 0, w: 6, h: 4 },
    };

    onAddWidget(widget);
    setQuery('');
    onOpenChange(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Q&A Query Analytics
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder='Try: "Sum of Sales by Region Bar Chart"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="pr-24 text-base h-12"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1 h-10 gap-1 gradient-bg"
              onClick={handleGenerate}
              disabled={!parsed?.isValid}
            >
              Generate <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Parse preview */}
          {parsed && query.trim() && (
            <div className="rounded-lg border border-border p-3 space-y-2">
              <p className="text-sm font-medium text-foreground">
                {parsed.isValid ? '✅ Parsed successfully' : '❌ ' + parsed.error}
              </p>
              {parsed.isValid && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Fn: {parsed.aggregation.toUpperCase()}</Badge>
                  <Badge variant="secondary">Measure: {parsed.measure}</Badge>
                  <Badge variant="secondary">Dimension: {parsed.dimension}</Badge>
                  <Badge className="gradient-bg text-white">Chart: {parsed.chartType}</Badge>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && !query.trim() && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Suggested queries
              </p>
              <div className="space-y-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-left rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Format: <code className="bg-muted px-1 rounded">Aggregation of Measure by Dimension ChartType</code>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
