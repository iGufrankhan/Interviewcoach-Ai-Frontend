'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { validateLoginForm } from '@/lib/validators';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate using validators
    const validationErrors = validateLoginForm(email, password);
    if (validationErrors.length > 0) {
      setError(validationErrors[0].message);
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email.trim(), password);

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#030014] text-white font-sans overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <nav className="relative z-10 px-6 py-4 border-b border-white/[0.05] bg-[#030014]/60 backdrop-blur-md">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
          InterviewCoach<span className="text-violet-500">.ai</span>
        </Link>
      </nav>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h12.75M11 12a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-zinc-400 text-sm">Sign in to your account to continue</p>
            </div>

            <div className="relative">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder-zinc-500 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Link href="/reset-password" className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] mt-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.05]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#030014] text-zinc-500">New to InterviewCoach.ai?</span>
                </div>
              </div>

              <Link
                href="/OtpSend"
                className="w-full flex items-center justify-center px-4 py-3.5 bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-violet-500/30 rounded-xl font-semibold transition-all text-zinc-300 hover:text-white"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-zinc-500 font-medium">
            <p className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-emerald-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Enterprise-grade encryption secures your data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
