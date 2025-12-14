import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Calendar,
  LayoutGrid,
  Edit3,
  ExternalLink,
  Sparkles,
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

const colorPalette = [
  'from-primary to-accent',
  'from-accent to-primary',
  'from-[hsl(155,75%,45%)] to-[hsl(200,90%,50%)]',
  'from-[hsl(38,95%,55%)] to-[hsl(330,85%,60%)]',
  'from-[hsl(200,90%,50%)] to-[hsl(250,95%,62%)]',
  'from-[hsl(280,85%,58%)] to-[hsl(330,85%,60%)]',
];

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Dashboards</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage your saved dashboards
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-bg hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" />
                New Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
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
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Track monthly sales performance..."
                    className="bg-background"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!newName.trim()} className="gradient-bg">
                  Create Dashboard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dashboard Grid */}
        {dashboards.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-soft rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl gradient-bg animate-float">
                <LayoutGrid className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-foreground">
              No dashboards yet
            </h2>
            <p className="mt-3 max-w-sm text-muted-foreground">
              Create your first dashboard or start from a template to visualize your data
            </p>
            <div className="mt-8 flex gap-4">
              <Button className="gap-2 gradient-bg hover:opacity-90" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Dashboard
              </Button>
              <Link to="/templates">
                <Button variant="outline" className="gap-2 hover-lift">
                  <Sparkles className="h-4 w-4" />
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dashboards.map((dashboard, index) => (
              <div
                key={dashboard.id}
                className="glass-card-hover group rounded-xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Color Header */}
                <div className={`h-2 bg-gradient-to-r ${colorPalette[index % colorPalette.length]}`} />
                
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorPalette[index % colorPalette.length]} shadow-lg`}>
                      <LayoutGrid className="h-6 w-6 text-white" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => deleteDashboard(dashboard.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                    {dashboard.name}
                  </h3>
                  {dashboard.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {dashboard.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary font-medium">
                      <LayoutGrid className="h-3 w-3" />
                      {dashboard.widgets.length} widgets
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(dashboard.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Link to={`/builder?id=${dashboard.id}`} className="flex-1">
                      <Button variant="outline" className="w-full gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all" size="sm">
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/view/${dashboard.id}`}>
                      <Button className="gap-2 gradient-bg hover:opacity-90" size="sm">
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
