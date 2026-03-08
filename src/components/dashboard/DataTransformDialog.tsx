import { useState } from 'react';
import { Wand2, Plus, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataColumn, DataSet } from '@/types/dashboard';
import { addCalculatedColumn, renameColumn, castColumn, leftJoin } from '@/lib/dataTransform';
import { toast } from '@/hooks/use-toast';

interface DataTransformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataset: DataSet;
  allDatasets: DataSet[];
  onApply: (data: Record<string, unknown>[], columns: DataColumn[]) => void;
}

export function DataTransformDialog({ open, onOpenChange, dataset, allDatasets, onApply }: DataTransformDialogProps) {
  const [tab, setTab] = useState('calculated');

  // Calculated column state
  const [calcName, setCalcName] = useState('');
  const [calcExpr, setCalcExpr] = useState('');

  // Rename state
  const [renameOld, setRenameOld] = useState('');
  const [renameNew, setRenameNew] = useState('');

  // Cast state
  const [castCol, setCastCol] = useState('');
  const [castType, setCastType] = useState<'string' | 'number' | 'date'>('number');

  // Join state
  const [joinDatasetId, setJoinDatasetId] = useState('');
  const [joinLeftKey, setJoinLeftKey] = useState('');
  const [joinRightKey, setJoinRightKey] = useState('');

  const handleCalculated = () => {
    if (!calcName.trim() || !calcExpr.trim()) {
      toast({ title: 'Enter column name and expression', variant: 'destructive' });
      return;
    }
    const { data, columns } = addCalculatedColumn(dataset.data, dataset.columns, calcName.trim(), calcExpr.trim());
    onApply(data, columns);
    toast({ title: 'Calculated column added', description: calcName });
    setCalcName('');
    setCalcExpr('');
  };

  const handleRename = () => {
    if (!renameOld || !renameNew.trim()) {
      toast({ title: 'Select column and enter new name', variant: 'destructive' });
      return;
    }
    const { data, columns } = renameColumn(dataset.data, dataset.columns, renameOld, renameNew.trim());
    onApply(data, columns);
    toast({ title: 'Column renamed' });
  };

  const handleCast = () => {
    if (!castCol) return;
    const { data, columns } = castColumn(dataset.data, dataset.columns, castCol, castType);
    onApply(data, columns);
    toast({ title: 'Column type changed' });
  };

  const handleJoin = () => {
    const rightDs = allDatasets.find(d => d.id === joinDatasetId);
    if (!rightDs || !joinLeftKey || !joinRightKey) {
      toast({ title: 'Configure all join fields', variant: 'destructive' });
      return;
    }
    const joinedData = leftJoin(dataset.data, rightDs.data, joinLeftKey, joinRightKey);
    // Merge columns
    const existingNames = new Set(dataset.columns.map(c => c.name));
    const newCols = rightDs.columns
      .filter(c => c.name !== joinRightKey)
      .map(c => existingNames.has(c.name) ? { ...c, name: `${c.name}_joined` } : c);
    onApply(joinedData, [...dataset.columns, ...newCols]);
    toast({ title: 'Datasets joined', description: `${joinedData.length} rows` });
  };

  const otherDatasets = allDatasets.filter(d => d.id !== dataset.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" /> Data Transformations
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculated">Calculate</TabsTrigger>
            <TabsTrigger value="rename">Rename</TabsTrigger>
            <TabsTrigger value="cast">Cast</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>

          <TabsContent value="calculated" className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>New Column Name</Label>
              <Input value={calcName} onChange={e => setCalcName(e.target.value)} placeholder="e.g., Profit" />
            </div>
            <div className="space-y-2">
              <Label>Expression</Label>
              <Input value={calcExpr} onChange={e => setCalcExpr(e.target.value)} placeholder="e.g., Revenue - Cost" />
              <p className="text-[10px] text-muted-foreground">Supports: FieldA + FieldB, FieldA - FieldB, FieldA * FieldB, FieldA / FieldB</p>
            </div>
            <Button onClick={handleCalculated} className="gap-1"><Plus className="h-4 w-4" /> Add Column</Button>
          </TabsContent>

          <TabsContent value="rename" className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>Column to Rename</Label>
              <Select value={renameOld} onValueChange={setRenameOld}>
                <SelectTrigger><SelectValue placeholder="Select column" /></SelectTrigger>
                <SelectContent>{dataset.columns.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>New Name</Label>
              <Input value={renameNew} onChange={e => setRenameNew(e.target.value)} placeholder="New column name" />
            </div>
            <Button onClick={handleRename} className="gap-1"><ArrowRightLeft className="h-4 w-4" /> Rename</Button>
          </TabsContent>

          <TabsContent value="cast" className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>Column</Label>
              <Select value={castCol} onValueChange={setCastCol}>
                <SelectTrigger><SelectValue placeholder="Select column" /></SelectTrigger>
                <SelectContent>{dataset.columns.map(c => <SelectItem key={c.name} value={c.name}>{c.name} ({c.type})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Type</Label>
              <Select value={castType} onValueChange={v => setCastType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="string">Text</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCast}>Apply Cast</Button>
          </TabsContent>

          <TabsContent value="join" className="space-y-3 mt-4">
            {otherDatasets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Import another dataset to enable joins</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Join with Dataset</Label>
                  <Select value={joinDatasetId} onValueChange={setJoinDatasetId}>
                    <SelectTrigger><SelectValue placeholder="Select dataset" /></SelectTrigger>
                    <SelectContent>{otherDatasets.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Left Key ({dataset.name})</Label>
                    <Select value={joinLeftKey} onValueChange={setJoinLeftKey}>
                      <SelectTrigger><SelectValue placeholder="Key field" /></SelectTrigger>
                      <SelectContent>{dataset.columns.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Right Key</Label>
                    <Select value={joinRightKey} onValueChange={setJoinRightKey}>
                      <SelectTrigger><SelectValue placeholder="Key field" /></SelectTrigger>
                      <SelectContent>
                        {joinDatasetId && allDatasets.find(d => d.id === joinDatasetId)?.columns.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleJoin} className="gap-1"><ArrowRightLeft className="h-4 w-4" /> Join Datasets</Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
