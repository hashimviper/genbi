import { useState } from 'react';
import { Building2, Users, UserPlus, Shield, Trash2, Mail } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { toast } from '@/hooks/use-toast';

export default function WorkspacePage() {
  const { currentUser, users } = useAuthStore();
  const { organizations, members, invitations, createOrganization, inviteMember, removeMember, updateMemberRole, deleteOrganization, getOrgMembers, getOrgInvitations } = useWorkspaceStore();

  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');

  if (!currentUser) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center p-6">
          <p className="text-muted-foreground">Please sign in to access workspaces.</p>
        </div>
      </MainLayout>
    );
  }

  const userOrgs = organizations.filter(o => 
    o.ownerId === currentUser.id || members.some(m => m.organizationId === o.id && m.userId === currentUser.id)
  );

  const handleCreateOrg = () => {
    if (!orgName.trim()) return;
    createOrganization(orgName.trim(), currentUser.id);
    toast({ title: 'Organization created', description: `"${orgName}" workspace is ready.` });
    setOrgName('');
    setShowCreateOrg(false);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || !selectedOrgId) return;
    inviteMember(selectedOrgId, inviteEmail.trim(), inviteRole, currentUser.id);
    toast({ title: 'Invitation sent', description: `Invited ${inviteEmail} as ${inviteRole}.` });
    setInviteEmail('');
    setShowInvite(false);
  };

  const roleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'badge-primary';
      case 'editor': return 'badge-success';
      case 'viewer': return 'badge-info';
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" /> Workspaces
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage organizations and team collaboration</p>
          </div>
          <Button onClick={() => setShowCreateOrg(true)} className="gap-2 gradient-bg">
            <Building2 className="h-4 w-4" /> New Organization
          </Button>
        </div>

        {userOrgs.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No organizations yet</p>
            <p className="text-sm text-muted-foreground">Create an organization to start collaborating</p>
            <Button onClick={() => setShowCreateOrg(true)} className="mt-4 gradient-bg">Create Organization</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrgs.map(org => {
              const orgMembers = getOrgMembers(org.id);
              const orgInvites = getOrgInvitations(org.id).filter(i => i.status === 'pending');
              const isOwner = org.ownerId === currentUser.id;

              return (
                <div key={org.id} className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{org.name}</h2>
                      <p className="text-xs text-muted-foreground">{orgMembers.length} member(s) • Created {new Date(org.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      {isOwner && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => { setSelectedOrgId(org.id); setShowInvite(true); }} className="gap-1">
                            <UserPlus className="h-4 w-4" /> Invite
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => { deleteOrganization(org.id); toast({ title: 'Organization deleted' }); }} className="gap-1 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Members */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Members</h3>
                    {orgMembers.map(member => {
                      const user = users.find(u => u.id === member.userId);
                      return (
                        <div key={member.userId} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {user?.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{user?.username || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={roleColor(member.role)}>{member.role}</Badge>
                            {isOwner && member.userId !== currentUser.id && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { removeMember(org.id, member.userId); toast({ title: 'Member removed' }); }}>
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pending Invitations */}
                  {orgInvites.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Mail className="h-4 w-4" /> Pending Invitations</h3>
                      {orgInvites.map(inv => (
                        <div key={inv.id} className="flex items-center justify-between rounded-lg bg-warning/5 border border-warning/20 px-4 py-2">
                          <span className="text-sm text-foreground">{inv.email}</span>
                          <Badge className="badge-warning">{inv.role} (pending)</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Org Dialog */}
      <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="My Company" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateOrg(false)}>Cancel</Button>
            <Button onClick={handleCreateOrg} className="gradient-bg">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={v => setInviteRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={handleInvite} className="gradient-bg">Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
