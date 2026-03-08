import { useState } from 'react';
import { History, Save, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useVersionStore, DashboardSnapshot } from '@/stores/versionStore';
import { Dashboard } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

interface VersionManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboard: Dashboard;
  onRestore: (dashboard: Dashboard) => void;
}

export function VersionManager({ open, onOpenChange, dashboard, onRestore }: VersionManagerProps) {
  const [name, setName] = useState('');
  const { saveSnapshot, restoreSnapshot, deleteSnapshot, getSnapshotsForDashboard } = useVersionStore();
  const snapshots = getSnapshotsForDashboard(dashboard.id);

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: 'Enter a version name', variant: 'destructive' });
      return;
    }
    saveSnapshot(dashboard, name.trim());
    setName('');
    toast({ title: 'Snapshot saved', description: name.trim() });
  };

  const handleRestore = (id: string) => {
    const restored = restoreSnapshot(id);
    if (restored) {
      onRestore(restored);
      toast({ title: 'Version restored' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Version History
          </DialogTitle>
        </DialogHeader>

        {/* Save new snapshot */}
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Version name (e.g., Draft v2)"
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <Button onClick={handleSave} size="sm" className="gap-1 shrink-0">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>

        {/* Snapshot list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {snapshots.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No snapshots yet</p>
          ) : (
            snapshots.slice().reverse().map(snap => (
              <div key={snap.id} className="flex items-center gap-2 rounded-lg border border-border/50 p-3 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{snap.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(snap.createdAt).toLocaleString()} • {snap.snapshot.widgets.length} widgets
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleRestore(snap.id)}>
                  <RotateCcw className="h-3 w-3 mr-1" /> Restore
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteSnapshot(snap.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
