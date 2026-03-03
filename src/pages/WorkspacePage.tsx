import { Users, Building2, Shield, Edit3, Crown } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { STATIC_ORG, useAuthStore, UserRole } from '@/stores/authStore';

export default function WorkspacePage() {
  const { currentUser } = useAuthStore();

  const roleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'badge-primary';
      case 'editor': return 'badge-success';
      case 'viewer': return 'badge-info';
    }
  };

  const roleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Crown className="h-3.5 w-3.5" />;
      case 'editor': return <Edit3 className="h-3.5 w-3.5" />;
      default: return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-[hsl(var(--chart-5))]" /> Collaboration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Team workspace & member roles (UI simulation)</p>
        </div>

        {/* Organization Card */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{STATIC_ORG.name}</h2>
              <p className="text-sm text-muted-foreground">{STATIC_ORG.members.length} members • Offline workspace</p>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Team Members</h3>
            {STATIC_ORG.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 transition-colors hover:bg-muted/80"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {member.username[0].toUpperCase()}
                    </div>
                    {/* Active indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      {member.username}
                      {member.isOwner && (
                        <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Owner</span>
                      )}
                      {currentUser?.username === member.username && (
                        <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">You</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${roleColor(member.role)} gap-1`}>
                    {roleIcon(member.role)}
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Permissions Info */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Role Permissions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground text-sm">Admin</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Edit & delete charts</li>
                <li>• Full dashboard control</li>
                <li>• Manage configurations</li>
              </ul>
            </div>
            <div className="rounded-lg bg-[hsl(var(--success)/0.05)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="h-4 w-4 text-[hsl(var(--success))]" />
                <span className="font-semibold text-foreground text-sm">Editor</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Edit charts only</li>
                <li>• View dashboards</li>
                <li>• Cannot delete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
