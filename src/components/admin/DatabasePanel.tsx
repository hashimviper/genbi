import { useState, useEffect } from 'react';
import {
  Users,
  GitBranch,
  Activity,
  Wifi,
  Trash2,
  RefreshCw,
  Shield,
  Eye,
  Edit,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { toast } from '@/hooks/use-toast';
import {
  getAllUsers,
  getCollabRequests,
  getActivityLog,
  getOnlineUsers,
  type StoredUser,
  type CollabRequest,
  type ActivityEntry,
  type PresenceRecord,
} from '@/lib/localDB';

type DBTab = 'users' | 'collab' | 'activity' | 'presence';

const tabs: { id: DBTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'collab', label: 'Requests', icon: GitBranch },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'presence', label: 'Online', icon: Wifi },
];

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    admin: 'bg-destructive/15 text-destructive border-destructive/30',
    editor: 'bg-primary/15 text-primary border-primary/30',
    viewer: 'bg-muted text-muted-foreground border-border',
  };
  return map[role] || map.viewer;
};

const roleIcon = (role: string) => {
  if (role === 'admin') return <Shield className="h-3 w-3" />;
  if (role === 'editor') return <Edit className="h-3 w-3" />;
  return <Eye className="h-3 w-3" />;
};

export function DatabasePanel() {
  const [activeTab, setActiveTab] = useState<DBTab>('users');
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [collabRequests, setCollabRequests] = useState<CollabRequest[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<PresenceRecord[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  const refresh = () => {
    setUsers(getAllUsers());
    setCollabRequests(getCollabRequests());
    setActivityLog(getActivityLog(100));
    setOnlineUsers(getOnlineUsers());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteUser = (userId: string) => {
    const stored = JSON.parse(localStorage.getItem('visorybi-db:users') || '[]');
    const filtered = stored.filter((u: StoredUser) => u.id !== userId);
    localStorage.setItem('visorybi-db:users', JSON.stringify(filtered));
    toast({ title: 'User deleted', description: 'User record removed from database.' });
    refresh();
  };

  const handleClearActivity = () => {
    localStorage.setItem('visorybi-db:activity-log', '[]');
    toast({ title: 'Activity log cleared' });
    refresh();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border/50 px-4 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count =
            tab.id === 'users' ? users.length :
            tab.id === 'collab' ? collabRequests.length :
            tab.id === 'activity' ? activityLog.length :
            onlineUsers.length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={refresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-xs uppercase text-muted-foreground">Username</TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground">Role</TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground">Registered</TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No registered users yet
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="group border-border/30 hover:bg-secondary/30">
                    <TableCell className="font-medium text-foreground">{user.username}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 ${roleBadge(user.role)}`}>
                        {roleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget({ type: 'user', id: user.id })}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* COLLAB REQUESTS TAB */}
        {activeTab === 'collab' && (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-xs uppercase text-muted-foreground">From</TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground">To</TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground">Message</TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collabRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No collaboration requests
                  </TableCell>
                </TableRow>
              ) : (
                collabRequests.map((req) => (
                  <TableRow key={req.id} className="border-border/30 hover:bg-secondary/30">
                    <TableCell className="font-medium text-foreground">{req.fromUser}</TableCell>
                    <TableCell className="text-foreground">{req.toUser}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{req.message}</TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'accepted' ? 'default' : req.status === 'declined' ? 'destructive' : 'secondary'}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{timeAgo(req.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* ACTIVITY LOG TAB */}
        {activeTab === 'activity' && (
          <div>
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" className="gap-2 text-destructive" onClick={handleClearActivity}>
                <Trash2 className="h-3.5 w-3.5" /> Clear Log
              </Button>
            </div>
            <div className="space-y-2">
              {activityLog.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No activity recorded</div>
              ) : (
                activityLog.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 rounded-lg border border-border/30 bg-secondary/20 px-4 py-3">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{entry.username}</span>{' '}
                        <span className="text-muted-foreground">{entry.action}</span>
                        {entry.target && (
                          <span className="text-primary"> {entry.target}</span>
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{timeAgo(entry.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PRESENCE TAB */}
        {activeTab === 'presence' && (
          <div className="space-y-3">
            {onlineUsers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No users online</div>
            ) : (
              onlineUsers.map((user) => (
                <div key={user.userId} className="flex items-center gap-3 rounded-lg border border-border/30 bg-secondary/20 px-4 py-3">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {user.username[0]?.toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.username}</p>
                    <p className="text-[11px] text-muted-foreground">Last seen {timeAgo(user.lastSeen)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </ScrollArea>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget?.type === 'user') handleDeleteUser(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
