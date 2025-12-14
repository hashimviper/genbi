import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseFile } from '@/lib/dataParser';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onSuccess?: () => void;
}

export function FileUploader({ onSuccess }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const addDataset = useDashboardStore((state) => state.addDataset);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);
    
    try {
      const { columns, data } = await parseFile(file);
      
      addDataset({
        name: file.name.replace(/\.[^/.]+$/, ''),
        columns,
        data,
      });
      
      toast({
        title: 'Dataset imported successfully',
        description: `${data.length} rows and ${columns.length} columns imported.`,
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to parse file',
        variant: 'destructive',
      });
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  if (uploadedFile && !isProcessing) {
    return (
      <div className="glass-card flex items-center gap-4 rounded-xl p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{uploadedFile.name}</p>
          <p className="text-sm text-muted-foreground">
            {(uploadedFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-5/20">
            <Check className="h-4 w-4 text-chart-5" />
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border/50 hover:border-primary/50 hover:bg-secondary/30',
        isProcessing && 'pointer-events-none opacity-50'
      )}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Upload className="h-7 w-7 text-primary" />
      </div>
      <p className="mt-4 text-center font-medium text-foreground">
        {isProcessing ? 'Processing...' : 'Drop your file here'}
      </p>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Supports CSV and Excel files
      </p>
    </label>
  );
}
