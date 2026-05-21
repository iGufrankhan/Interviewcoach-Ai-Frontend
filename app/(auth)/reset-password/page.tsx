'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { requestForgotPassword, resetForgotPassword } from '@/lib/auth/forgotPasswordApi';
import { validateEmail, validatePassword, validatePasswordMatch } from '@/lib/validators';

type ResetStep = 'email' | 'newpassword';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const stepParam = searchParams.get('step');
    const verified = searchParams.get('verified');

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (stepParam === 'newpassword' && verified === 'true') {
      setStep('newpassword');
    }
  }, [searchParams]);

  useEffect(() => {
    if (newPassword.length < 8) {
      setPasswordStrength('weak');
    } else if (newPassword.length < 12 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [newPassword]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);

    try {
      const result = await requestForgotPassword(email);
      setSuccess('Reset code sent! Redirecting to verification...');
      setTimeout(() => {
        router.push(`/reset-password-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Validate passwords match
    const matchError = validatePasswordMatch(newPassword, confirmPassword);
    if (matchError) {
      setError(matchError);
      return;
    }

    setLoading(true);

    try {
      const result = await resetForgotPassword(email, newPassword);
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
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
            
            {step === 'email' && (
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">Forgot Password?</h1>
                  <p className="text-zinc-400 text-sm">Enter your email to get a reset link</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-zinc-500 transition-colors"
                    />
                    <p className="text-xs text-zinc-500 mt-3 text-center">
                      We'll send a verification code to this email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] mt-4"
                  >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>

                <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
                  <p className="text-zinc-500 text-sm">
                    Remember your password?{' '}
                    <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {step === 'newpassword' && (
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">Create New Password</h1>
                  <p className="text-zinc-400 text-sm">Set a strong new password for your account</p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 mb-0.5">Verified Email</p>
                    <p className="text-white font-medium text-sm">{email}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder-zinc-500 transition-colors"
                    />

                    {newPassword && (
                      <div className="mt-3 space-y-2">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength === 'weak'
                                ? 'w-1/3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                                : passwordStrength === 'medium'
                                ? 'w-2/3 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]'
                                : 'w-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                            }`}
                          />
                        </div>
                        <p className={`text-xs font-medium ${
                          passwordStrength === 'weak'
                            ? 'text-red-400'
                            : passwordStrength === 'medium'
                            ? 'text-yellow-400'
                            : 'text-emerald-400'
                        }`}>
                          Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder-zinc-500 transition-colors"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs font-medium text-red-400 mt-2">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                    className="w-full group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] mt-4"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>

                <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
                  <p className="text-zinc-500 text-sm">
                    <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                      ← Back to login
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
