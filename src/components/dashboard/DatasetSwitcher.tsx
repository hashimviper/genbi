import { useState, useEffect } from 'react';
import { Database, RefreshCw, AlertCircle, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DataSet, DashboardWidget, DataColumn } from '@/types/dashboard';
import { remapWidgetFields, analyzeDatasetFields, validateWidgetConfig } from '@/lib/fieldMapping';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DatasetSwitcherProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDataset: DataSet | null;
  availableDatasets: DataSet[];
  widgets: DashboardWidget[];
  onSwitch: (newDatasetId: string, remappedWidgets: DashboardWidget[]) => void;
}

export function DatasetSwitcher({
  open,
  onOpenChange,
  currentDataset,
  availableDatasets,
  widgets,
  onSwitch,
}: DatasetSwitcherProps) {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(currentDataset?.id || '');
  const [preview, setPreview] = useState<{ 
    widget: DashboardWidget; 
    newConfig: Record<string, unknown>;
    isValid?: boolean;
    missingFields?: string[];
  }[]>([]);

  const selectedDataset = availableDatasets.find(d => d.id === selectedDatasetId);

  const handleDatasetSelect = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    
    const newDataset = availableDatasets.find(d => d.id === datasetId);
    if (!newDataset || !currentDataset) {
      setPreview([]);
      return;
    }

    // Preview field remapping with validation
    const previewMappings = widgets.map(widget => {
      const configAsRecord = JSON.parse(JSON.stringify(widget.config)) as Record<string, unknown>;
      const newConfig = remapWidgetFields(
        configAsRecord,
        currentDataset.columns,
        newDataset.columns,
        newDataset.data
      );
      
      // Validate the new configuration
      const validation = validateWidgetConfig(newConfig, widget.type, newDataset.columns);
      
      return { 
        widget, 
        newConfig,
        isValid: validation.isValid,
        missingFields: validation.missingFields 
      };
    });

    setPreview(previewMappings);
  };

  const handleConfirmSwitch = () => {
    if (!selectedDataset) return;

    const remappedWidgets = widgets.map(widget => {
      const mapping = preview.find(p => p.widget.id === widget.id);
      if (mapping) {
        return {
          ...widget,
          config: {
            ...widget.config,
            ...mapping.newConfig,
            datasetId: selectedDatasetId,
          },
        };
      }
      return {
        ...widget,
        config: {
          ...widget.config,
          datasetId: selectedDatasetId,
        },
      };
    });

    onSwitch(selectedDatasetId, remappedWidgets);
    onOpenChange(false);
  };

  const renderFieldChange = (widget: DashboardWidget, newConfig: Record<string, unknown>) => {
    const oldConfig = JSON.parse(JSON.stringify(widget.config)) as Record<string, unknown>;
    const changes: { field: string; from: string | null; to: string | null }[] = [];

    ['xAxis', 'yAxis', 'labelField', 'valueField'].forEach(field => {
      const oldVal = oldConfig[field] as string | undefined;
      const newVal = newConfig[field] as string | undefined;
      if (oldVal !== newVal) {
        changes.push({
          field,
          from: oldVal || null,
          to: newVal || null,
        });
      }
    });

    return changes;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Switch Dataset
          </DialogTitle>
          <DialogDescription>
            Select a new dataset for this dashboard. Fields will be automatically remapped.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Dataset</label>
            <Select value={selectedDatasetId} onValueChange={handleDatasetSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a dataset..." />
              </SelectTrigger>
              <SelectContent>
                {availableDatasets.map(ds => (
                  <SelectItem key={ds.id} value={ds.id}>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>{ds.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {ds.columns.length} fields
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {ds.data.length} rows
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDataset && selectedDataset.id !== currentDataset?.id && (
            <>
              <Alert>
                <RefreshCw className="h-4 w-4" />
                <AlertDescription>
                  <strong>Smart Remapping Active:</strong> Fields will be automatically matched based on 
                  name similarity and data type.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">Field Mapping Preview</label>
                <ScrollArea className="h-48 rounded-md border p-3">
                  <div className="space-y-3">
                    {preview.map(({ widget, newConfig, isValid, missingFields }) => {
                      const changes = renderFieldChange(widget, newConfig);
                      return (
                        <div key={widget.id} className={`rounded border p-2 ${!isValid ? 'border-amber-500/50 bg-amber-500/5' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{widget.config.title}</span>
                            <Badge variant="secondary" className="text-xs">{widget.type}</Badge>
                            {!isValid && (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/50">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Needs Review
                              </Badge>
                            )}
                          </div>
                          {changes.length > 0 ? (
                            <div className="space-y-1">
                              {changes.map((change, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <span className="text-muted-foreground">{change.field}:</span>
                                  <span className="line-through text-destructive/70">{change.from || 'none'}</span>
                                  <span>→</span>
                                  <span className="text-primary font-medium">{change.to || 'none'}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Check className="h-3 w-3 text-emerald-500" />
                              No changes needed
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {selectedDataset && (
                <div className="rounded-md border p-3 bg-secondary/20">
                  <div className="text-sm font-medium mb-2">New Dataset Fields</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedDataset.columns.map(col => (
                      <Badge 
                        key={col.name} 
                        variant={col.type === 'number' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {col.name}
                        <span className="ml-1 opacity-70">({col.type})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSwitch}
            disabled={!selectedDatasetId || selectedDatasetId === currentDataset?.id}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Switch Dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
