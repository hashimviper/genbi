import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisoryBILogo } from '@/components/VisoryBILogo';
import { useAuthStore, STATIC_ORG } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

// Static passwords for demo members
const MEMBER_PASSWORDS: Record<string, string> = {
  'viper': 'viper@123',
  'thaslee': 'thaslee@123',
  'naveen': 'naveen@123',
  'abd': 'abd@123',
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please enter your username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Find member in organization data (case-insensitive)
    const member = STATIC_ORG.members.find(
      (m) => m.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (!member) {
      setError('Username not found. Please check your credentials.');
      return;
    }

    // Check password
    const expectedPassword = MEMBER_PASSWORDS[member.username.toLowerCase()];
    if (password !== expectedPassword) {
      setError('Incorrect password. Please try again.');
      return;
    }

    // Login with role auto-detected from organization data
    login(member.username, member.role);
    toast({
      title: `Welcome back, ${member.username}!`,
      description: `Signed in as ${member.role}${member.isOwner ? ' (Owner)' : ''}`,
    });
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
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Enter your username"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button type="submit" className="w-full gradient-bg">
              Sign In
            </Button>
          </form>

          <div className="mt-5 rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
              {STATIC_ORG.members.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">{m.username}</span>
                  <span className="text-muted-foreground/60">({m.role})</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60 mt-2">
              Password format: username@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
