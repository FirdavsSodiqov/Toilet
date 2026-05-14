import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/authStore';
import { mockLogin } from '../services/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuthStore();
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'password' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = await mockLogin(form);
      login(session);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-100">
            <ShieldCheck className="h-4 w-4" />
            Toilet Admin Console
          </div>
          <h1 className="mt-8 max-w-2xl text-5xl font-semibold tracking-tight">
            Scalable admin panel for monitoring users, toilets, reviews, and moderation.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Feature-based structure, protected routes, query layer, Zustand stores, and reusable UI primitives.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white p-8 text-slate-950 shadow-2xl shadow-blue-950/30">
          <div>
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Sign in to dashboard</h2>
            <p className="mt-2 text-sm text-slate-500">
              Use the prefilled mock credentials to create a fake JWT session.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="password"
                autoComplete="current-password"
              />
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
