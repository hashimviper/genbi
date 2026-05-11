import { useState, useEffect, useCallback } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Building2, Shield, Edit3, Crown, Plus, Share2, UserPlus, X, Building, Trash2, Wifi, WifiOff, Copy, Radio, Send, MessageSquare } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STATIC_ORG, useAuthStore, UserRole } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import { toast } from '@/hooks/use-toast';
import { updatePresence, isUserOnline } from '@/lib/localDB';
import { lanSync, LANSyncManager, type LANPeer, type LANMessage } from '@/lib/lanSync';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Team {
  id: string;
  name: string;
  members: string[];
}

interface Organization {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members?: string[];
}

const TEAMS_STORAGE_KEY = 'visorybi-teams';
const SHARED_DASHBOARDS_KEY = 'visorybi-shared-dashboards';
const ORGS_STORAGE_KEY = 'visorybi-organizations';

function loadTeams(): Team[] {
  try { return JSON.parse(localStorage.getItem(TEAMS_STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveTeams(teams: Team[]) {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
}
function loadSharedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(SHARED_DASHBOARDS_KEY) || '[]'); } catch { return []; }
}
function saveSharedIds(ids: string[]) {
  localStorage.setItem(SHARED_DASHBOARDS_KEY, JSON.stringify(ids));
}
function loadOrgs(): Organization[] {
  try { return JSON.parse(localStorage.getItem(ORGS_STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveOrgs(orgs: Organization[]) {
  localStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(orgs));
}

export default function WorkspacePage() {
  const { currentUser } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { dashboards } = useDashboardStore();

  const [teams, setTeams] = useState<Team[]>(loadTeams);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [sharedIds, setSharedIds] = useState<string[]>(loadSharedIds);

  // Organization state
  const [organizations, setOrganizations] = useState<Organization[]>(loadOrgs);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const [showAddUserOrg, setShowAddUserOrg] = useState<string | null>(null);
  const [newOrgUsername, setNewOrgUsername] = useState('');

  // LAN Sync state
  const [lanConnected, setLanConnected] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [lanPeers, setLanPeers] = useState<LANPeer[]>([]);

  // Update presence for the logged-in user
  useEffect(() => {
    if (currentUser) {
      updatePresence(currentUser.id, currentUser.username);
      const interval = setInterval(() => updatePresence(currentUser.id, currentUser.username), 30_000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // LAN peer polling
  useEffect(() => {
    if (!lanConnected) return;
    const interval = setInterval(() => {
      setLanPeers(lanSync.getActivePeers());
    }, 2000);
    setLanPeers(lanSync.getActivePeers());
    return () => clearInterval(interval);
  }, [lanConnected]);

  // LAN message handler
  useEffect(() => {
    if (!lanConnected) return;
    const unsub = lanSync.onMessage((msg: LANMessage) => {
      if (msg.type === 'presence') {
        setLanPeers(lanSync.getActivePeers());
      } else if (msg.type === 'presence-leave') {
        setLanPeers(lanSync.getActivePeers());
      } else if (msg.type === 'chat') {
        toast({ title: `${msg.senderName}`, description: String(msg.payload || '') });
      } else if (msg.type === 'dashboard-share') {
        addNotification('Dashboard Shared via LAN', `${msg.senderName} shared a dashboard.`);
      }
    });
    return unsub;
  }, [lanConnected, addNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't disconnect on page nav, only on full unmount
    };
  }, []);

  const handleCreateRoom = useCallback(() => {
    if (!currentUser) return;
    const code = LANSyncManager.generateRoomCode();
    setRoomCode(code);
    lanSync.connect(currentUser.id, currentUser.username, code);
    setLanConnected(true);
    toast({ title: 'Network Room Created', description: `Room code: ${code}` });
  }, [currentUser]);

  const handleJoinRoom = useCallback(() => {
    if (!currentUser || !joinCode.trim()) return;
    const code = joinCode.trim().toUpperCase();
    setRoomCode(code);
    lanSync.connect(currentUser.id, currentUser.username, code);
    setLanConnected(true);
    setJoinCode('');
    toast({ title: 'Joined Room', description: `Connected to room ${code}` });
  }, [currentUser, joinCode]);

  const handleDisconnect = useCallback(() => {
    lanSync.disconnect();
    setLanConnected(false);
    setRoomCode('');
    setLanPeers([]);
    toast({ title: 'Disconnected from network room' });
  }, []);

  const handleCopyRoomCode = useCallback(() => {
    navigator.clipboard.writeText(roomCode);
    toast({ title: 'Room code copied!' });
  }, [roomCode]);

  const checkOnline = (username: string) => {
    if (currentUser?.username === username) return true;
    return isUserOnline(username);
  };

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

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) { toast({ title: 'Enter a team name', variant: 'destructive' }); return; }
    if (selectedMembers.length === 0) { toast({ title: 'Select at least one member', variant: 'destructive' }); return; }
    const team: Team = { id: Date.now().toString(36), name: newTeamName.trim(), members: selectedMembers };
    const updated = [...teams, team];
    setTeams(updated);
    saveTeams(updated);
    setNewTeamName('');
    setSelectedMembers([]);
    addNotification('Team Created', `Team "${team.name}" has been created with ${team.members.length} members.`);
    toast({ title: 'Team created', description: team.name });
    if (lanConnected) lanSync.send('team-update', { action: 'created', team });
  };

  const handleDeleteTeam = (id: string) => {
    const updated = teams.filter(t => t.id !== id);
    setTeams(updated);
    saveTeams(updated);
    toast({ title: 'Team deleted' });
  };

  const toggleMember = (username: string) => {
    setSelectedMembers(prev => prev.includes(username) ? prev.filter(m => m !== username) : [...prev, username]);
  };

  const handleShareDashboard = (dashboardId: string, dashboardName: string) => {
    const updated = [...new Set([...sharedIds, dashboardId])];
    setSharedIds(updated);
    saveSharedIds(updated);
    addNotification('Dashboard Shared', `"${dashboardName}" has been shared with the team.`);
    toast({ title: 'Dashboard shared', description: dashboardName });
    if (lanConnected) lanSync.send('dashboard-share', { dashboardId, dashboardName });
  };

  const handleCreateOrg = () => {
    if (!newOrgName.trim()) { toast({ title: 'Enter an organization name', variant: 'destructive' }); return; }
    const org: Organization = {
      id: Date.now().toString(36),
      name: newOrgName.trim(),
      description: newOrgDesc.trim(),
      createdAt: new Date().toISOString(),
      members: [],
    };
    const updated = [...organizations, org];
    setOrganizations(updated);
    saveOrgs(updated);
    setNewOrgName('');
    setNewOrgDesc('');
    setShowCreateOrg(false);
    addNotification('Organization Created', `Organization "${org.name}" has been created.`);
    toast({ title: 'Organization created', description: org.name });
    if (lanConnected) lanSync.send('org-update', { action: 'created', org });
  };

  const handleDeleteOrg = (id: string) => {
    const updated = organizations.filter(o => o.id !== id);
    setOrganizations(updated);
    saveOrgs(updated);
    toast({ title: 'Organization deleted' });
  };

  const handleAddUserToOrg = () => {
    if (!showAddUserOrg || !newOrgUsername.trim()) return;
    
    const updated = organizations.map(org => {
      if (org.id === showAddUserOrg) {
        const members = org.members || [];
        if (!members.includes(newOrgUsername.trim())) {
          return { ...org, members: [...members, newOrgUsername.trim()] };
        }
      }
      return org;
    });
    
    setOrganizations(updated);
    saveOrgs(updated);
    
    const orgName = organizations.find(o => o.id === showAddUserOrg)?.name || 'Organization';
    toast({ title: 'User added', description: `${newOrgUsername} added to ${orgName}` });
    addNotification('User Added', `${newOrgUsername} was added to ${orgName}.`);
    
    setNewOrgUsername('');
    setShowAddUserOrg(null);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-[hsl(var(--chart-5))]" /> LAN Network Collaboration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time collaboration with peers on the same network
          </p>
        </div>

        {/* LAN Network Room */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${lanConnected ? 'bg-[hsl(var(--success))]/10' : 'bg-muted'}`}>
              {lanConnected ? <Wifi className="h-5 w-5 text-[hsl(var(--success))]" /> : <WifiOff className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                Network Room
                <Badge variant={lanConnected ? 'default' : 'secondary'} className="text-[10px]">
                  {lanConnected ? 'Connected' : 'Offline'}
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">
                {lanConnected
                  ? `Room: ${roomCode} • ${lanPeers.length} peer${lanPeers.length !== 1 ? 's' : ''} connected`
                  : 'Create or join a room to sync with peers on your network'}
              </p>
            </div>
          </div>

          {!lanConnected ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Button onClick={handleCreateRoom} className="w-full gap-2">
                  <Radio className="h-4 w-4" /> Create Room
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Generate a room code to share with your team
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    maxLength={6}
                    className="font-mono tracking-widest text-center uppercase"
                  />
                  <Button onClick={handleJoinRoom} disabled={joinCode.trim().length < 4} variant="outline">
                    Join
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground text-center">
                  Enter the code shared by a peer
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Room code & controls */}
              <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
                <span className="text-xs text-muted-foreground">Room Code:</span>
                <span className="font-mono text-lg font-bold text-primary tracking-widest">{roomCode}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyRoomCode}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="ml-auto text-destructive" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>

              {/* Connected peers */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Connected Peers ({lanPeers.length})
                </h4>
                {lanPeers.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">
                    Waiting for peers to join room {roomCode}...
                  </p>
                ) : (
                  lanPeers.map((peer) => (
                    <div key={peer.userId} className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-2.5">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {peer.username[0]?.toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))] border-2 border-card" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {peer.username}
                          {peer.userId === currentUser?.id && (
                            <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded-full ml-1.5">You</span>
                          )}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {Date.now() - peer.lastSeen < 5000 ? 'Active now' : `${Math.floor((Date.now() - peer.lastSeen) / 1000)}s ago`}
                        </p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Organizations */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Building className="h-4 w-4" /> Organizations
            </h3>
            <Button size="sm" onClick={() => setShowCreateOrg(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Create Organization
            </Button>
          </div>

          {/* Default org */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {STATIC_ORG.name}
                  <Badge variant="secondary" className="text-[10px]">Default</Badge>
                </p>
                <p className="text-xs text-muted-foreground">{STATIC_ORG.members.length} members</p>
              </div>
            </div>
          </div>

          {/* Custom orgs */}
          {organizations.map((org) => (
            <div key={org.id} className="group rounded-lg bg-muted/50 px-4 py-3 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{org.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    {org.description || 'No description'}
                    {org.members && org.members.length > 0 && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        {org.members.length} member{org.members.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => setShowAddUserOrg(org.id)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteOrg(org.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {organizations.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">No custom organizations yet. Create one to organize your teams.</p>
          )}
        </div>

        {/* Organization Card (Members) */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{STATIC_ORG.name}</h2>
              <p className="text-sm text-muted-foreground">
                {STATIC_ORG.members.length} members • {lanConnected ? 'LAN Connected' : 'Local workspace'}
              </p>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Team Members</h3>
            {STATIC_ORG.members.map((member) => {
              const online = checkOnline(member.username);
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 transition-colors hover:bg-muted/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {member.username[0].toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${online ? 'bg-[hsl(var(--success))]' : 'bg-muted-foreground/40'}`} />
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
                      <p className="text-xs text-muted-foreground">{online ? 'Active now' : 'Offline'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${roleColor(member.role)} gap-1`}>
                      {roleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Team */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Create Team
          </h3>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>Team Name</Label>
              <Input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="e.g. Analytics Team" />
            </div>
            <div className="space-y-2">
              <Label>Assign Members</Label>
              <div className="flex flex-wrap gap-2">
                {STATIC_ORG.members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleMember(m.username)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedMembers.includes(m.username)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/50 text-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {m.username}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleCreateTeam} className="gap-2 w-fit">
              <Plus className="h-4 w-4" /> Create Team
            </Button>
          </div>

          {/* Existing Teams */}
          {teams.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Teams</h4>
              {teams.map((team) => (
                <div key={team.id} className="group flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{team.name}</p>
                    <p className="text-xs text-muted-foreground">{team.members.join(', ')}</p>
                  </div>
                  <button onClick={() => handleDeleteTeam(team.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Dashboard */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share Dashboard
            {lanConnected && <Badge variant="outline" className="text-[10px] gap-1"><Wifi className="h-3 w-3" /> LAN</Badge>}
          </h3>
          {dashboards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No dashboards available to share.</p>
          ) : (
            <div className="space-y-2">
              {dashboards.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    {sharedIds.includes(d.id) && (
                      <Badge variant="secondary" className="text-[10px]">Shared</Badge>
                    )}
                  </div>
                  {!sharedIds.includes(d.id) ? (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleShareDashboard(d.id, d.name)}>
                      <Share2 className="h-3 w-3" /> Share
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[hsl(var(--success))] inline-block" /> Active Now
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
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

        {/* Create Organization Dialog */}
        <Dialog open={showCreateOrg} onOpenChange={setShowCreateOrg}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Create Organization
              </DialogTitle>
              <DialogDescription>
                Create a new organization to group teams and manage access.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-desc">Description (optional)</Label>
                <Input
                  id="org-desc"
                  value={newOrgDesc}
                  onChange={(e) => setNewOrgDesc(e.target.value)}
                  placeholder="e.g. Main analytics division"
                  className="bg-background"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateOrg(false)}>Cancel</Button>
              <Button onClick={handleCreateOrg} disabled={!newOrgName.trim()} className="gap-2">
                <Plus className="h-4 w-4" /> Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add User to Organization Dialog */}
        <Dialog open={!!showAddUserOrg} onOpenChange={(open) => !open && setShowAddUserOrg(null)}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Add User to Organization
              </DialogTitle>
              <DialogDescription>
                Invite a new member to {organizations.find(o => o.id === showAddUserOrg)?.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="org-username">Username or Email</Label>
                <Input
                  id="org-username"
                  value={newOrgUsername}
                  onChange={(e) => setNewOrgUsername(e.target.value)}
                  placeholder="e.g. john.doe or john@example.com"
                  className="bg-background"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddUserOrg(null)}>Cancel</Button>
              <Button onClick={handleAddUserToOrg} disabled={!newOrgUsername.trim()} className="gap-2">
                <Plus className="h-4 w-4" /> Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
