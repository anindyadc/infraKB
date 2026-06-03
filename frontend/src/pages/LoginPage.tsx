import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';
import { supabase } from '../lib/supabase';
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
      if (import.meta.env.VITE_BACKEND_TYPE === 'supabase') {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (authError) throw authError;
        // The store listener in main.tsx/Root will handle the user state
        navigate('/');
      } else {
        const response = await client.post('/auth/login', data);
        const { user, accessToken } = response.data.data;
        setAuth(user, accessToken);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Left Side: Premium Hero Section - Forced Dark Scheme for Visibility */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden dark">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-110"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0d1117] via-[#0d1117]/90 to-transparent" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-noise opacity-20" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/50 ring-1 ring-white/20">
              <span className="font-mono text-xl font-bold">KB</span>
            </div>
            
            <div className="mt-20 space-y-4">
              <h1 className="text-6xl font-black tracking-tight leading-none text-white drop-shadow-2xl">
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
                <p className="text-3xl font-black tabular-nums text-white tracking-tighter">1.2ms</p>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Global Search</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black tabular-nums text-white tracking-tighter">256-bit</p>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">AES Encryption</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black tabular-nums text-white tracking-tighter">∞</p>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Collaborators</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Premium Decorated Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative bg-background overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-1/4 right-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-[440px] mx-auto relative group">
          {/* Decorative outer glow/box */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          {/* Main Login Card */}
          <div className="relative space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 bg-card border border-border/50 rounded-[1.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm">
            
            {/* Inner top decoration line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />

            <div className="space-y-2 text-center lg:text-left">
              <div className="lg:hidden h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-primary text-primary-foreground mb-8 font-black shadow-lg shadow-primary/20">KB</div>
              <h2 className="text-4xl font-black tracking-tighter text-foreground uppercase">Secure Access</h2>
              <p className="text-muted-foreground font-medium text-sm">Deployment command center authentication.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="rounded-xl bg-destructive/5 p-4 text-xs text-destructive border border-destructive/20 flex items-center gap-3 animate-shake font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                  {error}
                </div>
              )}
              
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 group-focus-within:text-primary transition-colors ml-1">
                    Identification / Email
                  </label>
                  <div className="relative">
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full rounded-xl border border-border bg-muted/30 px-4 py-4 text-sm text-foreground placeholder-muted-foreground/30 focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all duration-300"
                      placeholder="operator@infrakb.local"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-[10px] text-destructive font-black uppercase tracking-tight ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2 group">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                      Security / Password
                    </label>
                    <a href="#" className="text-[10px] font-black text-primary/60 hover:text-primary transition-colors uppercase tracking-widest">Reset?</a>
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full rounded-xl border border-border bg-muted/30 px-4 py-4 text-sm text-foreground placeholder-muted-foreground/30 focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1.5 text-[10px] text-destructive font-black uppercase tracking-tight ml-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-primary py-4 text-[11px] font-black uppercase tracking-[0.3em] text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.97] disabled:opacity-70"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="h-3 w-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Verifying Identity...</span>
                    </>
                  ) : (
                    <>
                      <span>Initialize Session</span>
                      <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </div>
                {/* Subtle shine effect on button */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
              </button>
            </form>

            <div className="pt-8 border-t border-border/40 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">
                  Cluster Status: Online
                </p>
              </div>
            </div>
          </div>

          {/* Decorative small boxes behind/under the main card */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 border border-primary/10 rounded-2xl -z-10 blur-sm" />
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/5 border border-primary/10 rounded-xl -z-10 blur-sm" />
        </div>
        
        <p className="mt-12 text-center text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.4em]">
          Internal Knowledge Network — v1.0.4
        </p>
      </div>
    </div>
  );
}
