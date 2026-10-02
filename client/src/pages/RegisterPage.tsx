import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast('Account created! Welcome to Quill.', 'success');
      navigate('/');
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast(e.message ?? 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : 3;

  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColor = ['', 'bg-[#C41E3A]', 'bg-amber-400', 'bg-emerald-500'];

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1C1917] p-12">
        <div>
          <Link to="/" className="text-[#C41E3A] font-serif text-2xl font-bold">Quill</Link>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C41E3A]/20 flex items-center justify-center shrink-0 mt-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C41E3A" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-sans font-medium mb-1">Write freely</h3>
              <p className="text-[#78716C] font-sans text-sm">A beautiful editor built for focused writing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C41E3A]/20 flex items-center justify-center shrink-0 mt-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C41E3A" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-sans font-medium mb-1">Reach readers</h3>
              <p className="text-[#78716C] font-sans text-sm">Share your work with a curious audience.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C41E3A]/20 flex items-center justify-center shrink-0 mt-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C41E3A" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-sans font-medium mb-1">Track your work</h3>
              <p className="text-[#78716C] font-sans text-sm">Dashboard to manage all your articles.</p>
            </div>
          </div>
        </div>
        <p className="text-[#57534E] font-sans text-sm">Free forever for independent writers.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#1C1917] mb-2">Create your account</h1>
            <p className="text-[#78716C] font-sans text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#C41E3A] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="Jane Smith"
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <div>
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="hover:text-[#1C1917] transition-colors"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                }
              />
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength ? strengthColor[strength] : 'bg-[#E7E5E4]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#78716C] font-sans">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>
            <Input
              label="Confirm password"
              type={showPw ? 'text' : 'password'}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={errors.confirm}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[#A8A29E] font-sans">
            By creating an account, you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
