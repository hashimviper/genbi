import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Calendar,
  LayoutGrid,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const { dashboards, createDashboard, deleteDashboard } = useDashboardStore();

  const handleCreate = () => {
    if (newName.trim()) {
      createDashboard(newName.trim(), newDescription.trim() || undefined);
      setNewName('');
      setNewDescription('');
      setIsCreateOpen(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Dashboards</h1>
            <p className="mt-1 text-muted-foreground">
              View and manage your saved dashboards
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Dashboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Sales Dashboard"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Track monthly sales performance..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!newName.trim()}>
                  Create Dashboard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dashboard Grid */}
        {dashboards.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <LayoutGrid className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-foreground">
              No dashboards yet
            </h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Create your first dashboard to start visualizing your data
            </p>
            <Button className="mt-6 gap-2" onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dashboards.map((dashboard, index) => (
              <div
                key={dashboard.id}
                className="glass-card group animate-fade-in rounded-xl p-5 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
                    <LayoutGrid className="h-6 w-6 text-accent" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => deleteDashboard(dashboard.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {dashboard.name}
                </h3>
                {dashboard.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {dashboard.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <LayoutGrid className="h-3 w-3" />
                    {dashboard.widgets.length} widgets
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(dashboard.updatedAt)}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/builder?id=${dashboard.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2" size="sm">
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/view/${dashboard.id}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
