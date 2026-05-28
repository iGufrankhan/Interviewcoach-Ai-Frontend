'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeRegistration } from '@/lib/api';
import { validatePassword, validatePasswordMatch } from '@/lib/validators';

function RegisterPageContent() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const [registrationToken, setRegistrationToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const verifiedToken = searchParams.get('token');
    const verified = searchParams.get('verified');
    
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    if (verifiedToken) {
      const decodedToken = decodeURIComponent(verifiedToken);
      setRegistrationToken(decodedToken);
    }
    
    if (verified !== 'true') {
      router.push('/otp-send');
    }
  }, [searchParams, router]);

  // Calculate password strength
  useEffect(() => {
    if (password.length < 8) {
      setPasswordStrength('weak');
    } else if (password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [password]);

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const matchError = validatePasswordMatch(password, confirmPassword);
    if (matchError) {
      setError(matchError);
      return;
    }

    if (!registrationToken) {
      setError('Registration token missing! Please verify your email again.');
      return;
    }

    setLoading(true);

    try {
      await completeRegistration(email, password, fullName.trim(), registrationToken);

      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Complete Your Profile</h1>
              <p className="text-zinc-400 text-sm">Enter your details to finish registration</p>
            </div>

            <div className="relative">
              {/* Email Display */}
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

              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-zinc-300">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
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
                  
                  {password && (
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
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs font-medium text-red-400 mt-2">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || password !== confirmPassword || password.length < 8 || !fullName.trim()}
                  className="w-full group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] mt-4"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </form>

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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030014]" />}>
      <RegisterPageContent />
    </Suspense>
  );
}
