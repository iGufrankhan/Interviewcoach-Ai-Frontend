'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { requestForgotPassword, resetForgotPassword } from '@/lib/auth/forgotPasswordApi';
import { validateEmail, validatePassword, validatePasswordMatch } from '@/lib/validators';

type ResetStep = 'email' | 'newpassword';

/* ─── inner component uses useSearchParams ─── */
function ResetPasswordInner() {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const stepParam  = searchParams.get('step');
    const verified   = searchParams.get('verified');
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (stepParam === 'newpassword' && verified === 'true') setStep('newpassword');
  }, [searchParams]);

  useEffect(() => {
    if (newPassword.length < 8) setPasswordStrength('weak');
    else if (newPassword.length < 12 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [newPassword]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const emailError = validateEmail(email);
    if (emailError) { setError(emailError); return; }
    setLoading(true);
    try {
      await requestForgotPassword(email);
      setSuccess('Reset code sent! Redirecting to verification...');
      setTimeout(() => router.push(`/reset-password-otp?email=${encodeURIComponent(email)}`), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const passwordError = validatePassword(newPassword);
    if (passwordError) { setError(passwordError); return; }
    const matchError = validatePasswordMatch(newPassword, confirmPassword);
    if (matchError) { setError(matchError); return; }
    setLoading(true);
    try {
      await resetForgotPassword(email, newPassword);
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = passwordStrength === 'weak' ? '#ef4444' : passwordStrength === 'medium' ? '#eab308' : '#22c55e';
  const strengthWidth = passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%';

  return (
    <main className="lp-main">
      <div className="lp-card">
        {/* ── STEP 1: EMAIL ── */}
        {step === 'email' && (
          <>
            <div className="lp-badge">
              <div className="lp-dot" /><span>Forgot Password</span>
            </div>
            <h1>Send Reset Code</h1>
            <p className="lp-cardsub">Enter the email associated with your account.</p>

            {error && (
              <div className="lp-alert lp-err">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}
            {success && (
              <div className="lp-alert lp-ok">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                {success}
              </div>
            )}

            <form onSubmit={handleRequestReset}>
              <div className="lp-field">
                <label>Email Address</label>
                <div className="lp-inp">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>
              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? <><span className="lp-spin" />Sending...</> : 'Send Reset Code'}
              </button>
            </form>

            <div className="lp-foot">
              <p>Remember your password? <Link href="/login">Sign in here</Link></p>
            </div>
          </>
        )}

        {/* ── STEP 2: NEW PASSWORD ── */}
        {step === 'newpassword' && (
          <>
            <div className="lp-badge">
              <div className="lp-dot" /><span>Create Password</span>
            </div>
            <h1>New Password</h1>
            <p className="lp-cardsub">Set a strong new password for your account.</p>

            {error && (
              <div className="lp-alert lp-err">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="lp-field">
                <label>New Password</label>
                <div className="lp-inp">
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: '62px' }} />
                  <button type="button" className="lp-showhide" onClick={() => setShowNew(p => !p)}>{showNew ? 'Hide' : 'Show'}</button>
                </div>
                {newPassword && (
                  <div className="rp-strength" style={{ marginTop: '10px' }}>
                    <div style={{ height: '3px', background: '#1e1e1e', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: strengthWidth, background: strengthColor, height: '100%', transition: 'all 0.3s' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="lp-field">
                <label>Confirm Password</label>
                <div className="lp-inp">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: '62px' }} />
                  <button type="button" className="lp-showhide" onClick={() => setShowConfirm(p => !p)}>{showConfirm ? 'Hide' : 'Show'}</button>
                </div>
              </div>

              <button type="submit" className="lp-btn" disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}>
                {loading ? <><span className="lp-spin" />Resetting...</> : 'Reset Password'}
              </button>
            </form>

            <div className="lp-foot">
              <p><Link href="/login">← Back to login</Link></p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: #080808;
          position: relative;
          overflow: hidden;
        }

        .lp-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(185,29,29,0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,29,29,0.13) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .lp-glow {
          position: fixed; z-index: 0; pointer-events: none;
          width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(185,29,29,0.28) 0%, rgba(185,29,29,0.12) 35%, transparent 65%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        .lp-nav {
          position: relative; z-index: 10;
          padding: 36px 52px 0;
          display: flex; flex-direction: column;
          align-items: flex-start;
        }

        .lp-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 4px;
          color: #fff; text-decoration: none;
          display: block; margin-bottom: 14px;
        }
        .lp-brand em { font-style: normal; color: #b91d1d; }

        .lp-deco { display: flex; align-items: center; gap: 0; }
        .lp-deco-vline { width: 2px; height: 28px; background: #b91d1d; }
        .lp-deco-hline { height: 2px; width: 48px; background: linear-gradient(to right, #b91d1d, transparent); }

        .lp-main {
          position: relative; z-index: 5;
          display: flex; align-items: center; justify-content: center;
          min-height: calc(100vh - 160px);
          padding: 40px 20px;
        }

        .lp-card {
          width: 100%; max-width: 520px;
          background: rgba(14,14,14,0.92);
          border: 1px solid #222;
          border-radius: 16px;
          padding: 44px 48px;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 0 1px rgba(185,29,29,0.08), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(185,29,29,0.1);
        }

        .lp-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(185,29,29,0.12); border: 1px solid rgba(185,29,29,0.25); border-radius: 20px; padding: 5px 14px; margin-bottom: 20px; }
        .lp-dot { width: 6px; height: 6px; border-radius: 50%; background: #b91d1d; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .lp-badge span { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #b91d1d; font-weight: 500; }

        .lp-card h1 { font-family: 'Bebas Neue', sans-serif; font-size: 62px; letter-spacing: 2px; color: #fff; line-height: 1; margin-bottom: 8px; }
        .lp-cardsub { font-size: 13.5px; color: #666; font-weight: 300; line-height: 1.65; margin-bottom: 32px; }

        .lp-alert { padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 9px; line-height: 1.5; }
        .lp-err { background: rgba(185,29,29,0.1); border: 1px solid rgba(185,29,29,0.3); color: #fca5a5; }
        .lp-ok  { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); color: #86efac; }

        .lp-field { margin-bottom: 20px; }
        .lp-field label { display: block; font-size: 13px; font-weight: 500; color: #bbb; margin-bottom: 9px; }
        .lp-inp { position: relative; }
        .lp-inp input { width: 100%; padding: 14px 18px; background: #121212; border: 1px solid #272727; border-radius: 8px; color: #f0f0f0; font-size: 14px; outline: none; transition: all .2s; }
        .lp-inp input:focus { border-color: #b91d1d; box-shadow: 0 0 0 3px rgba(185,29,29,0.12); }
        
        .lp-showhide { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #484848; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; }

        .lp-btn { width: 100%; padding: 16px; margin-top: 8px; background: #b91d1d; border: none; border-radius: 8px; color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; position: relative; overflow: hidden; transition: all .2s; }
        .lp-btn:hover:not(:disabled) { background: #cc2020; transform: translateY(-1px); box-shadow: 0 10px 30px rgba(185,29,29,0.35); }
        .lp-btn:disabled { opacity: .5; cursor: not-allowed; }
        .lp-spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lp-foot { margin-top: 24px; padding-top: 20px; border-top: 1px solid #141414; text-align: center; }
        .lp-foot p { font-size: 13px; color: #3a3a3a; }
        .lp-foot a { color: #b91d1d; text-decoration: none; font-weight: 500; }

        @media (max-width: 600px) {
          .lp-nav { padding: 28px 24px 0; }
          .lp-card { padding: 36px 26px; }
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-grid" />
        <div className="lp-glow" />

        <nav className="lp-nav">
          <Link href="/" className="lp-brand">Interview<em>Coach</em> AI</Link>
          <div className="lp-deco">
            <div className="lp-deco-vline" />
            <div className="lp-deco-hline" />
          </div>
        </nav>

        <Suspense fallback={<div className="lp-main" style={{color:'#444'}}>Loading...</div>}>
          <ResetPasswordInner />
        </Suspense>
      </div>
    </>
  );
}