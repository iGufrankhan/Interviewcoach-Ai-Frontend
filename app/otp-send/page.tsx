'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendOTP } from '@/lib/api';
import { validateEmail } from '@/lib/validators';

export default function OTPSendPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate email using validator
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);

    try {
      const response = await sendOTP(email.trim());
      
      // Check if user already exists
      if (response.data?.user_exists) {
        setError('User already exists with this email. Please login instead.');
        return;
      }

      setSuccess('OTP sent successfully to your email!');
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=register`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
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
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Get OTP Code</h1>
              <p className="text-zinc-400 text-sm">Enter your email to receive verification code</p>
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

              <form onSubmit={handleSendOTP} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] mt-4"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP Code'}
                </button>
              </form>

              {/* Links */}
              <div className="mt-8 text-center border-t border-white/[0.05] pt-6">
                <p className="text-zinc-500 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}