import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VisoryBILogo } from '@/components/VisoryBILogo';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const { register, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoginLoading(false);
    if (result.success) {
      toast({ title: 'Welcome back!', description: 'You have been logged in.' });
      navigate('/');
    } else {
      toast({ title: 'Login failed', description: result.error, variant: 'destructive' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setRegLoading(true);
    const result = await register(regUsername, regEmail, regPassword);
    setRegLoading(false);
    if (result.success) {
      toast({ title: 'Account created!', description: 'Welcome to VisoryBI.' });
      navigate('/');
    } else {
      toast({ title: 'Registration failed', description: result.error, variant: 'destructive' });
    }
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
          <p className="text-sm text-muted-foreground">Secure Offline Business Intelligence</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="gap-2"><LogIn className="h-4 w-4" /> Sign In</TabsTrigger>
              <TabsTrigger value="register" className="gap-2"><UserPlus className="h-4 w-4" /> Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input id="login-password" type={showPassword ? 'text' : 'password'} required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-bg" disabled={loginLoading}>
                  {loginLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input id="reg-username" required value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" required minLength={6} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="At least 6 characters" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Confirm Password</Label>
                  <Input id="reg-confirm" type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="Repeat password" />
                </div>
                <Button type="submit" className="w-full gradient-bg" disabled={regLoading}>
                  {regLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            All credentials are stored locally with SHA-256 encryption. No data leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
}
