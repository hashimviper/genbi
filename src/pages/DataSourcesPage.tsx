import { useState } from 'react';
import { Plus, Trash2, FileSpreadsheet, Database } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FileUploader } from '@/components/data/FileUploader';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DataSourcesPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { datasets, deleteDataset, currentDataset, setCurrentDataset } =
    useDashboardStore();

  return (
    <MainLayout>
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Sources</h1>
            <p className="mt-1 text-muted-foreground">
              Import and manage your datasets
            </p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Dataset</DialogTitle>
              </DialogHeader>
              <FileUploader onSuccess={() => setIsUploadOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-3">
          {/* Datasets List */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-4">
              <h2 className="mb-4 font-semibold text-foreground">
                Your Datasets ({datasets.length})
              </h2>
              {datasets.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Database className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No datasets imported yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {datasets.map((dataset) => (
                    <button
                      key={dataset.id}
                      onClick={() => setCurrentDataset(dataset)}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                        currentDataset?.id === dataset.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      <FileSpreadsheet className="h-5 w-5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{dataset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {dataset.data.length} rows • {dataset.columns.length}{' '}
                          columns
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDataset(dataset.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Data Preview */}
          <div className="lg:col-span-2">
            <div className="glass-card flex h-full flex-col rounded-xl">
              {currentDataset ? (
                <>
                  <div className="flex items-center justify-between border-b border-border/50 p-4">
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {currentDataset.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Preview (first 50 rows)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {currentDataset.columns.slice(0, 5).map((col) => (
                        <Badge
                          key={col.name}
                          variant="secondary"
                          className="text-xs"
                        >
                          {col.name}
                          <span className="ml-1 text-muted-foreground">
                            ({col.type})
                          </span>
                        </Badge>
                      ))}
                      {currentDataset.columns.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{currentDataset.columns.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50">
                          {currentDataset.columns.map((col) => (
                            <TableHead
                              key={col.name}
                              className="text-xs font-semibold uppercase text-muted-foreground"
                            >
                              {col.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDataset.data.slice(0, 50).map((row, i) => (
                          <TableRow
                            key={i}
                            className="border-border/30 hover:bg-secondary/30"
                          >
                            {currentDataset.columns.map((col) => (
                              <TableCell key={col.name} className="text-sm">
                                {String(row[col.name] ?? '')}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <FileSpreadsheet className="h-16 w-16 text-muted-foreground/30" />
                  <p className="mt-4 font-medium text-muted-foreground">
                    Select a dataset to preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
