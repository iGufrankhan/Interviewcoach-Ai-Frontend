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

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setLoading(true);
      const response = await sendOTP(email.trim()) as any;

      if (response?.data?.user_exists || response?.user_exists) {
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

        /* ── GRID ── */
        .lp-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(185,29,29,0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,29,29,0.13) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* ── RED GLOW ── */
        .lp-glow {
          position: fixed; z-index: 0; pointer-events: none;
          width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle,
            rgba(185,29,29,0.28) 0%,
            rgba(185,29,29,0.12) 35%,
            transparent 65%
          );
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }

        /* ── TOP NAV (Matches Login) ── */
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

        .lp-deco {
          display: flex; align-items: center; gap: 0;
        }
        .lp-deco-vline {
          width: 2px; height: 28px;
          background: #b91d1d;
        }
        .lp-deco-hline {
          height: 2px; width: 48px;
          background: linear-gradient(to right, #b91d1d, transparent);
        }

        /* ── MAIN AREA ── */
        .lp-main {
          position: relative; z-index: 5;
          display: flex; align-items: center; justify-content: center;
          min-height: calc(100vh - 160px);
          padding: 40px 20px;
        }

        /* ── CARD ── */
        .lp-card {
          width: 100%; max-width: 520px;
          background: rgba(14,14,14,0.92);
          border: 1px solid #222;
          border-radius: 16px;
          padding: 44px 48px;
          backdrop-filter: blur(12px);
          box-shadow:
            0 0 0 1px rgba(185,29,29,0.08),
            0 32px 64px rgba(0,0,0,0.6),
            0 0 80px rgba(185,29,29,0.1);
        }

        /* badge */
        .lp-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(185,29,29,0.12);
          border: 1px solid rgba(185,29,29,0.25);
          border-radius: 20px; padding: 5px 14px;
          margin-bottom: 20px;
        }
        .lp-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #b91d1d;
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .lp-badge span {
          font-size: 10px; letter-spacing: 2.5px;
          text-transform: uppercase; color: #b91d1d; font-weight: 500;
        }

        /* heading */
        .lp-card h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 62px; letter-spacing: 2px;
          color: #fff; line-height: 1; margin-bottom: 8px;
        }
        .lp-cardsub {
          font-size: 13.5px; color: #666;
          font-weight: 300; line-height: 1.65;
          margin-bottom: 32px;
        }

        /* alerts */
        .lp-alert {
          padding: 12px 14px; border-radius: 8px;
          font-size: 13px; margin-bottom: 20px;
          display: flex; align-items: flex-start; gap: 9px; line-height: 1.5;
        }
        .lp-alert svg { flex-shrink: 0; margin-top: 1px; }
        .lp-err { background: rgba(185,29,29,0.1); border: 1px solid rgba(185,29,29,0.3); color: #fca5a5; }
        .lp-ok  { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); color: #86efac; }

        /* field */
        .lp-field { margin-bottom: 20px; }
        .lp-field label {
          display: block;
          font-size: 13px; font-weight: 500;
          color: #bbb; margin-bottom: 9px;
        }
        .lp-inp input {
          width: 100%; padding: 14px 18px;
          background: #121212; border: 1px solid #272727;
          border-radius: 8px; color: #f0f0f0;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .lp-inp input::placeholder { color: #3a3a3a; }
        .lp-inp input:focus {
          border-color: #b91d1d;
          box-shadow: 0 0 0 3px rgba(185,29,29,0.12);
        }

        /* submit btn */
        .lp-btn {
          width: 100%; padding: 16px; margin-top: 8px;
          background: #b91d1d; border: none; border-radius: 8px;
          color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 3.5px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .lp-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 50%);
        }
        .lp-btn:hover:not(:disabled) {
          background: #cc2020; transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(185,29,29,0.35);
        }
        .lp-btn:disabled { opacity: .5; cursor: not-allowed; }

        .lp-spin {
          width: 16px; height: 16px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* foot */
        .lp-foot {
          margin-top: 24px; padding-top: 20px;
          border-top: 1px solid #141414; text-align: center;
        }
        .lp-foot p { font-size: 13px; color: #3a3a3a; }
        .lp-foot a { color: #b91d1d; text-decoration: none; font-weight: 500; transition: opacity .2s; }
        .lp-foot a:hover { opacity: 0.8; }

        @media (max-width: 600px) {
          .lp-nav { padding: 28px 24px 0; }
          .lp-card { padding: 36px 26px; }
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-grid" />
        <div className="lp-glow" />

        {/* TOP-LEFT NAV (Matches Login UI) */}
        <nav className="lp-nav">
          <Link href="/" className="lp-brand">Interview<em>Coach</em> AI</Link>
          <div className="lp-deco">
            <div className="lp-deco-vline" />
            <div className="lp-deco-hline" />
          </div>
        </nav>

        {/* CENTERED MAIN AREA */}
        <main className="lp-main">
          <div className="lp-card">
            
            <div className="lp-badge">
              <div className="lp-dot" />
              <span>New Account</span>
            </div>

            <h1>Get OTP</h1>
            <p className="lp-cardsub">Enter your email to receive a verification code.</p>

            {error && (
              <div className="lp-alert lp-err">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="lp-alert lp-ok">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            <form onSubmit={handleSendOTP}>
              <div className="lp-field">
                <label>Email Address</label>
                <div className="lp-inp">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? <><span className="lp-spin" />Sending OTP...</> : 'Send OTP Code'}
              </button>
            </form>

            <div className="lp-foot">
              <p>Already have an account?&nbsp;
                <Link href="/login">Sign in here</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}