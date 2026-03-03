import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisoryBILogo } from '@/components/VisoryBILogo';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('editor');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({ title: 'Error', description: 'Please enter a username', variant: 'destructive' });
      return;
    }
    login(username.trim(), role);
    toast({ title: 'Welcome!', description: `Signed in as ${username} (${role})` });
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/8 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-accent/8 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-lg">
            <VisoryBILogo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">VisoryBI</h1>
          <p className="text-sm text-muted-foreground">Offline Business Intelligence Platform</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Sign In</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Admin can edit & delete charts. Editor can edit only.
              </p>
            </div>

            <Button type="submit" className="w-full gradient-bg">
              Sign In
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo mode — no backend, no password required. Session stored in localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}
