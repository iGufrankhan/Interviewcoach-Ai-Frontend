'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOTP, resendOTP } from '@/lib/api';
import { validateOTP } from '@/lib/validators';

function VerifyOTPPageContent() {
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

    // Validate OTP using validator
    const otpError = validateOTP(otp);
    if (otpError) {
      setError(otpError);
      return;
    }

    setLoading(true);
    const type = searchParams.get('type');

    try {
      const response = await verifyOTP(email, otp);

      setSuccess('Email verified successfully!');
      setTimeout(() => {
        if (type === 'register') {
          const token = response.data?.registration_token || response.registration_token || '';
          router.push(`/register?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&verified=true`);
        } else {
          router.push(`/reset-password?email=${encodeURIComponent(email)}&step=newpassword&verified=true`);
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    setCountdown(60);

    try {
      await resendOTP(email);
      setSuccess('OTP resent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
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
    <div className="relative flex flex-col min-h-screen bg-[#030014] text-white font-sans overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <nav className="relative z-10 px-6 py-4 border-b border-white/[0.05] bg-[#030014]/60 backdrop-blur-md">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
          InterviewCoach<span className="text-violet-500">.ai</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent pointer-events-none"></div>

            <div className="relative text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                {searchParams.get('type') === 'register' ? 'Verify Your Email' : 'Verify Reset Code'}
              </h1>
              <p className="text-zinc-400 text-sm">Enter the 6-digit code sent to</p>
              <p className="text-cyan-400 font-medium mt-1">{email}</p>
            </div>

            <div className="relative">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3">
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300 text-center">Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                    className="w-full px-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-zinc-600 text-center tracking-[0.5em] transition-colors text-3xl font-bold font-mono"
                  />
                  <p className="text-xs text-zinc-500 mt-3 text-center">Check your email for the code</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] mt-4"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
                {countdown > 0 ? (
                  <p className="text-zinc-500 text-sm">
                    Resend code in <span className="text-violet-400 font-bold">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={loading || countdown > 0}
                    className="text-violet-400 hover:text-violet-300 font-medium text-sm transition-colors"
                  >
                    Didn't receive code? Resend
                  </button>
                )}
              </div>

              <div className="mt-4 text-center">
                <Link 
                  href={searchParams.get('type') === 'register' ? '/otp-send' : '/reset-password'}  
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  ← Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030014]" />}>
      <VerifyOTPPageContent />
    </Suspense>
  );
}
