'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyForgotPasswordOTP, resendForgotPasswordOTP } from '@/lib/auth/forgotPasswordApi';

function ResetPasswordOTPInner() {
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
      await verifyForgotPasswordOTP(email, otp);
      setSuccess('OTP verified successfully!');
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&step=newpassword&verified=true`);
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    setCountdown(60);

    try {
      await resendForgotPasswordOTP(email);
      setSuccess('Reset code resent successfully!');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to resend code');
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
    <main className="lp-main">
      <div className="lp-card">
        <div className="lp-badge">
          <div className="lp-dot" /><span>Password Reset</span>
        </div>

        <h1>Enter Code</h1>
        <p className="lp-cardsub">Verify your identity to continue.</p>

        {/* Email Chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#121212', border: '1px solid #222',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '24px'
        }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#b91d1d" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#444', letterSpacing: '1px' }}>Code sent to</p>
            <p style={{ fontSize: '13.5px', color: '#ccc', fontWeight: 500 }}>{email}</p>
          </div>
        </div>

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

        <form onSubmit={handleVerifyOTP}>
          <div className="lp-field">
            <label>Reset Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              className="lp-otp-input"
            />
            <p style={{ fontSize: '11.5px', color: '#333', marginTop: '12px', textAlign: 'center' }}>Check your email for the 6-digit code</p>
          </div>

          <button type="submit" className="lp-btn" disabled={loading || otp.length !== 6}>
            {loading ? <><span className="lp-spin" />Verifying...</> : 'Verify Code'}
          </button>
        </form>

        <div className="lp-foot" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {countdown > 0 ? (
            <p style={{ fontSize: '13px', color: '#444' }}>
              Resend code in <span style={{ color: '#b91d1d', fontWeight: 600 }}>{countdown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={loading || countdown > 0}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: '13px' }}
            >
              Didn&apos;t receive code? <strong style={{ color: '#b91d1d' }}>Resend</strong>
            </button>
          )}
          <Link href="/reset-password" className="lp-back-link">
            ← Back to reset password
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordOTPPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-back-link {font-size: 12px;color: #aaa;text-decoration: none;transition: color 0.2s;}

        .lp-back-link:hover {color: #b91d1d;   }

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

        .lp-otp-input {
          width: 100%; padding: 18px;
          background: #121212; border: 1px solid #272727;
          border-radius: 10px; color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px; letter-spacing: 16px;
          text-align: center; outline: none;
          transition: all .2s;
        }
        .lp-otp-input:focus { border-color: #b91d1d; box-shadow: 0 0 0 3px rgba(185,29,29,0.12); }

        .lp-btn { width: 100%; padding: 16px; margin-top: 8px; background: #b91d1d; border: none; border-radius: 8px; color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; position: relative; overflow: hidden; transition: all .2s; }
        .lp-btn:hover:not(:disabled) { background: #cc2020; transform: translateY(-1px); box-shadow: 0 10px 30px rgba(185,29,29,0.35); }
        .lp-btn:disabled { opacity: .5; cursor: not-allowed; }
        .lp-spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lp-foot { margin-top: 24px; padding-top: 20px; border-top: 1px solid #141414; }

        @media (max-width: 600px) {
          .lp-nav { padding: 28px 24px 0; }
          .lp-card { padding: 36px 26px; }
          .lp-otp-input { font-size: 28px; letter-spacing: 10px; }
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
          <ResetPasswordOTPInner />
        </Suspense>
      </div>
    </>
  );
}