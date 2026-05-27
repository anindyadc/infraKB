import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';
import ThemeToggle from '../components/shared/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.post('/auth/login', data);
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left Side: Visual Hero */}
      <div className="hidden w-1/2 lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/20 via-primary/5 to-background border-r border-border relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary font-mono text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
            KB
          </div>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight">
            Infrastructure <span className="text-primary">Knowledge.</span><br />
            Redefined.
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-md leading-relaxed">
            The private, secure, and markdown-native command center for your DevOps playbooks.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex gap-8 items-center text-muted-foreground/60">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-foreground">100%</span>
              <span className="text-xs uppercase tracking-widest font-mono">Self-Hosted</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-foreground">Markdown</span>
              <span className="text-xs uppercase tracking-widest font-mono">Native</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-foreground">Private</span>
              <span className="text-xs uppercase tracking-widest font-mono">Storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary font-mono text-xl font-bold text-primary-foreground mb-6">
              KB
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Sign in to workspace</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your team's runbooks.
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="block w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive font-medium ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                    Password
                  </label>
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="block w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive font-medium ml-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-muted-foreground/60 font-mono uppercase tracking-widest">
            InfraKB v1.0.0 — Secured Environment
          </p>
        </div>
      </div>
    </div>
  );
}
