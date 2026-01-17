import { useState, useEffect, useMemo } from 'react';
import { Filter, Calendar, X, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataColumn } from '@/types/dashboard';
import { cn } from '@/lib/utils';

export interface FilterConfig {
  field: string;
  type: 'select' | 'multiSelect' | 'range' | 'dateRange' | 'search';
  values?: (string | number)[];
  min?: number;
  max?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface GlobalFilterBarProps {
  columns: DataColumn[];
  data: Record<string, unknown>[];
  filters: FilterConfig[];
  onFiltersChange: (filters: FilterConfig[]) => void;
  className?: string;
}

export function GlobalFilterBar({
  columns,
  data,
  filters,
  onFiltersChange,
  className,
}: GlobalFilterBarProps) {
  const [localFilters, setLocalFilters] = useState<FilterConfig[]>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Get unique values for categorical fields
  const getUniqueValues = (fieldName: string): (string | number)[] => {
    const values = new Set<string | number>();
    data.forEach(row => {
      const val = row[fieldName];
      if (val !== null && val !== undefined) {
        values.add(val as string | number);
      }
    });
    return Array.from(values).sort();
  };

  // Get min/max for numeric fields
  const getNumericRange = (fieldName: string): { min: number; max: number } => {
    const values = data
      .map(row => Number(row[fieldName]))
      .filter(v => !isNaN(v));
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const categoricalColumns = useMemo(() => 
    columns.filter(c => c.type === 'string'), [columns]);
  
  const numericColumns = useMemo(() => 
    columns.filter(c => c.type === 'number'), [columns]);

  const dateColumns = useMemo(() => 
    columns.filter(c => c.type === 'date' || 
      c.name.toLowerCase().includes('date') || 
      c.name.toLowerCase().includes('month')), [columns]);

  const addFilter = (field: string, type: FilterConfig['type']) => {
    const newFilter: FilterConfig = { field, type };
    
    if (type === 'range') {
      const range = getNumericRange(field);
      newFilter.min = range.min;
      newFilter.max = range.max;
    }
    
    setLocalFilters([...localFilters, newFilter]);
    onFiltersChange([...localFilters, newFilter]);
  };

  const updateFilter = (index: number, updates: Partial<FilterConfig>) => {
    const newFilters = [...localFilters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = localFilters.filter((_, i) => i !== index);
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setLocalFilters([]);
    onFiltersChange([]);
  };

  const renderFilterControl = (filter: FilterConfig, index: number) => {
    const column = columns.find(c => c.name === filter.field);
    const uniqueValues = column?.type === 'string' ? getUniqueValues(filter.field) : [];

    return (
      <div 
        key={index} 
        className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2"
      >
        <span className="text-sm font-medium text-foreground">
          {filter.field.replace(/_/g, ' ')}
        </span>

        {filter.type === 'select' && (
          <Select
            value={filter.values?.[0]?.toString() || ''}
            onValueChange={(v) => updateFilter(index, { values: [v] })}
          >
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {uniqueValues.map((val) => (
                <SelectItem key={String(val)} value={String(val)}>
                  {String(val)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {filter.type === 'multiSelect' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                {filter.values?.length || 0} selected
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {uniqueValues.map((val) => (
                    <div key={String(val)} className="flex items-center gap-2">
                      <Checkbox
                        id={`${filter.field}-${val}`}
                        checked={filter.values?.includes(val) || false}
                        onCheckedChange={(checked) => {
                          const currentValues = filter.values || [];
                          const newValues = checked
                            ? [...currentValues, val]
                            : currentValues.filter(v => v !== val);
                          updateFilter(index, { values: newValues });
                        }}
                      />
                      <label 
                        htmlFor={`${filter.field}-${val}`}
                        className="text-sm cursor-pointer"
                      >
                        {String(val)}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}

        {filter.type === 'range' && (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={filter.min || ''}
              onChange={(e) => updateFilter(index, { min: Number(e.target.value) })}
              className="h-7 w-20 text-xs"
              placeholder="Min"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              value={filter.max || ''}
              onChange={(e) => updateFilter(index, { max: Number(e.target.value) })}
              className="h-7 w-20 text-xs"
              placeholder="Max"
            />
          </div>
        )}

        {filter.type === 'search' && (
          <Input
            type="text"
            value={filter.searchTerm || ''}
            onChange={(e) => updateFilter(index, { searchTerm: e.target.value })}
            className="h-7 w-32 text-xs"
            placeholder="Search..."
          />
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => removeFilter(index)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className={cn('rounded-lg border border-border/50 bg-card/50 p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">Filters</span>
          {localFilters.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {localFilters.length} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {localFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 text-xs gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </Button>
          )}
          
          {/* Add Filter Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Filter className="h-3 w-3" />
                Add Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-4">
                {categoricalColumns.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Categories</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {categoricalColumns.map(col => (
                        <Button
                          key={col.name}
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => addFilter(col.name, 'multiSelect')}
                        >
                          {col.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {numericColumns.length > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Numeric Range</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {numericColumns.slice(0, 6).map(col => (
                        <Button
                          key={col.name}
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => addFilter(col.name, 'range')}
                        >
                          {col.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {localFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {localFilters.map((filter, index) => renderFilterControl(filter, index))}
        </div>
      )}

      {localFilters.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No filters applied. Click "Add Filter" to get started.
        </p>
      )}
    </div>
  );
}

// Apply filters to data
export function applyFilters(
  data: Record<string, unknown>[],
  filters: FilterConfig[]
): Record<string, unknown>[] {
  if (filters.length === 0) return data;

  return data.filter(row => {
    return filters.every(filter => {
      const value = row[filter.field];

      switch (filter.type) {
        case 'select':
          return filter.values?.length === 0 || filter.values?.includes(value as string | number);
        
        case 'multiSelect':
          return filter.values?.length === 0 || filter.values?.includes(value as string | number);
        
        case 'range':
          const numVal = Number(value);
          const minOk = filter.min === undefined || numVal >= filter.min;
          const maxOk = filter.max === undefined || numVal <= filter.max;
          return minOk && maxOk;
        
        case 'search':
          if (!filter.searchTerm) return true;
          return String(value).toLowerCase().includes(filter.searchTerm.toLowerCase());
        
        default:
          return true;
      }
    });
  });
}
