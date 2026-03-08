import { useState } from 'react';
import { Plus, Trash2, FileSpreadsheet, Database, ChevronLeft, ChevronRight } from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

const PAGE_SIZE = 200;

export default function DataSourcesPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { datasets, deleteDataset, currentDataset, setCurrentDataset, dashboards, deleteDashboard } =
    useDashboardStore();

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    // Remove dashboards that depend on this dataset
    dashboards.forEach((d) => {
      if (d.widgets.some((w) => w.config.datasetId === deleteTargetId)) {
        deleteDashboard(d.id);
      }
    });
    deleteDataset(deleteTargetId);
    setDeleteTargetId(null);
  };

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
                      onClick={() => { setCurrentDataset(dataset); setPreviewPage(1); }}
                      className={`group relative flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
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
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(dataset.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
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
                        {currentDataset.data.slice((previewPage - 1) * PAGE_SIZE, previewPage * PAGE_SIZE).map((row, i) => (
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
                  {/* Pagination */}
                  {currentDataset.data.length > PAGE_SIZE && (
                    <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
                      <p className="text-xs text-muted-foreground">
                        Page {previewPage} of {Math.ceil(currentDataset.data.length / PAGE_SIZE)} ({currentDataset.data.length} rows)
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={previewPage <= 1} onClick={() => setPreviewPage(p => p - 1)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled={previewPage >= Math.ceil(currentDataset.data.length / PAGE_SIZE)} onClick={() => setPreviewPage(p => p + 1)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this dataset?</AlertDialogTitle>
            <AlertDialogDescription>
              Dashboards using this dataset may stop working. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
