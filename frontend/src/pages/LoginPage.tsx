import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';

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
    <div className="flex h-screen items-center justify-center bg-[#0d1117]">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-[#30363d] bg-[#161b22] p-10 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#10b981] font-mono text-xl font-bold text-[#0d1117]">
            KB
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-[#e6edf3]">InfraKB</h2>
          <p className="mt-2 text-sm text-[#8b949e]">DevOps Knowledge Base</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-400 border border-red-900/50">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8b949e]">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 block w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[#e6edf3] placeholder-[#484f58] focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                placeholder="ravi@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8b949e]">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="mt-1 block w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[#e6edf3] placeholder-[#484f58] focus:border-[#10b981] focus:outline-none focus:ring-1 focus:ring-[#10b981]"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md border border-transparent bg-[#10b981] px-4 py-2 text-sm font-semibold text-[#0d1117] shadow-sm hover:bg-[#0d9268] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
