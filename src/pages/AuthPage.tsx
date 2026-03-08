import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, UserPlus, KeyRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisoryBILogo } from '@/components/VisoryBILogo';
import { useAuthStore, STATIC_ORG } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { registerUser, authenticateUser, getAllUsers, type StoredUser } from '@/lib/localDB';

// Only Viper is static (owner). All others are dynamic localDB accounts.
const OWNER_PASSWORD = 'viper@123';

// Seed built-in team members into localDB on first load
const SEED_MEMBERS = [
  { username: 'Thaslee', password: 'thaslee@123', role: 'editor' as const },
  { username: 'Naveen', password: 'naveen@123', role: 'editor' as const },
  { username: 'Abd', password: 'abd@123', role: 'editor' as const },
];

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'editor' | 'viewer'>('editor');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Seed built-in members into localDB once
  useEffect(() => {
    const seeded = localStorage.getItem('visorybi-db:seeded');
    if (!seeded) {
      SEED_MEMBERS.forEach((m) => registerUser(m.username, m.password, m.role));
      localStorage.setItem('visorybi-db:seeded', 'true');
    }
  }, []);

  const resetFields = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
    setError('');
    setShowPassword(false);
  };

  const switchMode = (m: AuthMode) => {
    resetFields();
    setMode(m);
  };

  // ── Login ──────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = username.trim();
    if (!trimmed) { setError('Please enter your username'); return; }
    if (!password) { setError('Please enter your password'); return; }

    // Static owner check (Viper only)
    if (trimmed.toLowerCase() === 'viper') {
      if (password !== OWNER_PASSWORD) { setError('Incorrect password.'); return; }
      login('Viper', 'admin');
      toast({ title: 'Welcome back, Viper!', description: 'Signed in as admin (Owner)' });
      navigate('/');
      return;
    }

    // All other users are in localDB
    const localUser = authenticateUser(trimmed, password);
    if (!localUser) { setError('Invalid username or password.'); return; }
    login(localUser.username, localUser.role);
    toast({ title: `Welcome, ${localUser.username}!`, description: `Signed in as ${localUser.role}` });
    navigate('/');
  };

  // ── Register ───────────────────────────────────────────
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = username.trim();
    if (!trimmed) { setError('Please enter a username'); return; }
    if (trimmed.length < 3) { setError('Username must be at least 3 characters'); return; }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    // Block registering as "Viper" (reserved owner)
    if (trimmed.toLowerCase() === 'viper') {
      setError('This username is reserved.');
      return;
    }

    const user = registerUser(trimmed, password, selectedRole);
    if (!user) { setError('Username already taken.'); return; }

    login(user.username, user.role);
    toast({ title: 'Account created!', description: `Welcome, ${user.username}` });
    navigate('/');
  };

  // ── Forgot Password ───────────────────────────────────
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = username.trim();
    if (!trimmed) { setError('Enter your username to reset password'); return; }
    if (!newPassword || newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }

    // Owner account cannot be reset
    if (trimmed.toLowerCase() === 'viper') {
      setError('Owner account cannot be reset from here.');
      return;
    }

    // Find and update in local DB
    const key = 'visorybi-db:users';
    const all: StoredUser[] = JSON.parse(localStorage.getItem(key) || '[]');
    const idx = all.findIndex((u) => u.username.toLowerCase() === trimmed.toLowerCase());
    if (idx < 0) { setError('Username not found.'); return; }
    all[idx].passwordHash = btoa(newPassword);
    localStorage.setItem(key, JSON.stringify(all));

    toast({ title: 'Password reset!', description: 'You can now sign in with your new password.' });
    switchMode('login');
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
          {/* ── Sign In ── */}
          {mode === 'login' && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <LogIn className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Sign In</h2>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} placeholder="Enter your username" autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Enter your password" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                <Button type="submit" className="w-full gradient-bg">Sign In</Button>
              </form>
              <div className="mt-4 flex items-center justify-between text-sm">
                <button onClick={() => switchMode('forgot')} className="text-muted-foreground hover:text-primary transition-colors">Forgot password?</button>
                <button onClick={() => switchMode('register')} className="text-primary font-medium hover:underline">Create account</button>
              </div>
            </>
          )}

          {/* ── Register ── */}
          {mode === 'register' && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Create Account</h2>
              </div>
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input id="reg-username" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} placeholder="Choose a username" autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input id="reg-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Min 6 characters" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Confirm Password</Label>
                  <Input id="reg-confirm" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} placeholder="Re-enter password" />
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('editor')}
                      className={`rounded-lg border p-3 text-center transition-all ${
                        selectedRole === 'editor'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <p className="text-sm font-semibold">Editor</p>
                      <p className="text-[10px] mt-0.5">Create & edit dashboards</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('viewer')}
                      className={`rounded-lg border p-3 text-center transition-all ${
                        selectedRole === 'viewer'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      <p className="text-sm font-semibold">Viewer</p>
                      <p className="text-[10px] mt-0.5">View-only access (client)</p>
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                <Button type="submit" className="w-full gradient-bg">Create Account</Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button onClick={() => switchMode('login')} className="text-primary font-medium hover:underline">Sign in</button>
              </div>
            </>
          )}

          {/* ── Forgot Password ── */}
          {mode === 'forgot' && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <KeyRound className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Reset Password</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">Enter your username and a new password to reset access.</p>
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="forgot-username">Username</Label>
                  <Input id="forgot-username" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }} placeholder="Your username" autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forgot-newpass">New Password</Label>
                  <div className="relative">
                    <Input id="forgot-newpass" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(''); }} placeholder="Min 6 characters" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                <Button type="submit" className="w-full gradient-bg">Reset Password</Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <button onClick={() => switchMode('login')} className="text-primary font-medium hover:underline">Back to sign in</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
