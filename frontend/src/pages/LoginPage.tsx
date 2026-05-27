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
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Left Side: Premium Hero Section */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-110"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0d1117] via-[#0d1117]/80 to-transparent" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[url(\'https://grainy-gradients.vercel.app/noise.svg\')] opacity-20" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/50 ring-1 ring-white/20">
              <span className="font-mono text-xl font-bold">KB</span>
            </div>
            
            <div className="mt-20 space-y-4">
              <h1 className="text-6xl font-black tracking-tighter leading-none">
                BUILD <span className="text-primary italic">FASTER.</span><br />
                DOCUMENT BETTER.
              </h1>
              <p className="text-xl text-zinc-400 max-w-lg font-medium leading-relaxed">
                The high-performance knowledge base for modern engineering teams. Standardize your infrastructure playbooks in one secure place.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="h-px w-24 bg-primary/50" />
            <div className="flex gap-12">
              <div className="space-y-1">
                <p className="text-3xl font-bold tabular-nums">1.2ms</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Global Search</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tabular-nums">256-bit</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">AES Encryption</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tabular-nums">∞</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Collaborators</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Elegant Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative bg-background">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-[400px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-2">
            <div className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground mb-6 font-bold">KB</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 flex items-center gap-3 animate-shake">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                  Work Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 text-foreground placeholder-muted-foreground/30 ring-offset-background focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-[11px] text-destructive font-bold uppercase tracking-tight">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                    Password
                  </label>
                  <a href="#" className="text-[11px] font-bold text-primary hover:underline underline-offset-4">Forgot?</a>
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 text-foreground placeholder-muted-foreground/30 ring-offset-background focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1.5 text-[11px] text-destructive font-bold uppercase tracking-tight">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO INFRAKB</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="pt-10 border-t border-border/50">
            <div className="flex items-center gap-4 justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
                System Status: All Operational
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
