'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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
    setLoading(true);

    try {
      const response = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail?.error || 'Failed to send reset code');
        return;
      }

      setSuccess('Reset code sent! Redirecting to verification...');
      setTimeout(() => {
        router.push(`/auth/reset-password-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail?.error || 'Failed to reset password');
        return;
      }

      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      <nav className="px-6 py-4 border-b border-slate-700/50">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Interview Coach AI
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            {step === 'email' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
                  <p className="text-slate-400">Enter your email to get started</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white placeholder-slate-400 transition"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Enter the email address associated with your account.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-700/50 pt-6">
                  <p className="text-slate-400 text-sm">
                    Remember your password?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </>
            )}

            {step === 'newpassword' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
                  <p className="text-slate-400">Set a strong new password for your account</p>
                </div>

                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg px-4 py-2 mb-6">
                  <p className="text-xs text-slate-400">Verified Email</p>
                  <p className="text-white font-medium">{email}</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white placeholder-slate-400 transition"
                    />

                    {newPassword && (
                      <div className="mt-2 space-y-2">
                        <div className="h-1 bg-slate-600/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              passwordStrength === 'weak'
                                ? 'w-1/3 bg-red-500'
                                : passwordStrength === 'medium'
                                ? 'w-2/3 bg-yellow-500'
                                : 'w-full bg-green-500'
                            }`}
                          />
                        </div>
                        <p className={`text-xs ${
                          passwordStrength === 'weak'
                            ? 'text-red-400'
                            : passwordStrength === 'medium'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>
                          Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                      • Minimum 8 characters
                      <br />
                      • Use uppercase, numbers for stronger password
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white placeholder-slate-400 transition"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold transition"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-700/50 pt-6">
                  <p className="text-slate-400 text-sm">
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
                      ← Back to login
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}