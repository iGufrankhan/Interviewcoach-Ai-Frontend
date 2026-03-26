'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyForgotPasswordOTP, resendForgotPasswordOTP } from '@/lib/auth/forgotPasswordApi';

export default function ResetPasswordOTPPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyForgotPasswordOTP(email, otp);
      setSuccess('OTP verified successfully!');
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&step=newpassword&verified=true`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    setCountdown(60);

    try {
      const result = await resendForgotPasswordOTP(email);
      setSuccess('Reset code resent successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      <nav className="px-6 py-4 border-b border-slate-700/50">
        <Link href="/" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Interview Coach AI
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Verify Your Reset Code</h1>
              <p className="text-slate-400">Enter the 6-digit code sent to</p>
              <p className="text-blue-400 font-medium">{email}</p>
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

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reset Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-400 text-center tracking-widest transition text-3xl font-bold"
                />
                <p className="text-xs text-slate-400 mt-2">Check your email for the code</p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold transition"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-700/50 pt-6">
              {countdown > 0 ? (
                <p className="text-slate-400 text-sm">
                  Resend code in <span className="text-cyan-400 font-bold">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={loading || countdown > 0}
                  className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition"
                >
                  Didn't receive code? Resend
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link href="/reset-password" className="text-slate-400 hover:text-slate-300 text-sm transition">
                ← Back to reset password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
