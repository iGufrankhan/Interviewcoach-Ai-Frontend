'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { validateLoginForm } from '@/lib/validators';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationErrors = validateLoginForm(email, password);
    if (validationErrors.length > 0) {
      setError(validationErrors[0].message);
      return;
    }
    
    try {
      setLoading(true);
      const data = await loginUser(email.trim(), password) as any;
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email.trim());
        
        if (data.user_id || data.id) {
          localStorage.setItem('userId', data.user_id || data.id);
        }
      }
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
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

        /* ── GRID — clearly visible ── */
        .lp-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(185,29,29,0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,29,29,0.13) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* ── RED GLOW — big and strong ── */
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

        /* ── TOP NAV ── */
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

        /* red corner lines under brand */
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

        /* taglines under deco */
        .lp-tagblock {
          margin-top: 18px;
        }
        .lp-tagline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 2px;
          color: #fff; line-height: 1.1;
        }
        .lp-tagline span { color: #b91d1d; }
        .lp-tagsub {
          font-size: 12px; color: #4a4a4a;
          font-weight: 300; margin-top: 5px;
          line-height: 1.7; max-width: 260px;
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
        .lp-inp { position: relative; }
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
        .lp-showhide {
          position: absolute; right: 16px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #484848; font-size: 11px; letter-spacing: 1.5px;
          text-transform: uppercase; font-family: 'DM Sans', sans-serif;
          transition: color .2s; padding: 0;
        }
        .lp-showhide:hover { color: #b91d1d; }

        .lp-frow { display: flex; justify-content: flex-end; margin-top: 8px; }
        .lp-forgot {
          font-size: 12.5px; color: #484848;
          text-decoration: none; transition: color .2s;
        }
        .lp-forgot:hover { color: #b91d1d; }

        /* submit */
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
        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { opacity: .5; cursor: not-allowed; }

        .lp-spin {
          width: 16px; height: 16px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* sep */
        .lp-sep { display: flex; align-items: center; gap: 14px; margin: 24px 0; }
        .lp-sepl { flex: 1; height: 1px; background: #1c1c1c; }
        .lp-sep span { font-size: 11px; color: #2e2e2e; letter-spacing: 2px; text-transform: uppercase; }

        /* register */
        .lp-reg {
          width: 100%; padding: 14px;
          background: transparent; border: 1px solid #1e1e1e;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          color: #4a4a4a; transition: border-color .2s, background .2s, color .2s;
        }
        .lp-reg:hover {
          border-color: rgba(185,29,29,0.4);
          background: rgba(185,29,29,0.05);
          color: #ccc;
        }
        .lp-reg strong { color: #b91d1d; font-weight: 600; }

        /* foot */
        .lp-foot {
          margin-top: 24px; padding-top: 20px;
          border-top: 1px solid #141414; text-align: center;
        }
        .lp-foot p { font-size: 11.5px; color: #2e2e2e; }
        .lp-foot a { color: #3a3a3a; text-decoration: none; transition: color .2s; }
        .lp-foot a:hover { color: #b91d1d; }

        @media (max-width: 600px) {
          .lp-nav { padding: 28px 24px 0; }
          .lp-card { padding: 36px 26px; }
        }
      `}</style>

      <div className="lp-root">
        <div className="lp-grid" />
        <div className="lp-glow" />

        {/* top-left brand + deco + taglines */}
        <nav className="lp-nav">
          <Link href="/" className="lp-brand">Interview<em>Coach</em> AI</Link>
          <div className="lp-deco">
            <div className="lp-deco-vline" />
            <div className="lp-deco-hline" />
          </div>
        </nav>

        {/* centered form */}
        <main className="lp-main">
          <div className="lp-card">

            <h1>Sign In</h1>
            <p className="lp-cardsub">Enter your credentials to continue your journey.</p>

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

            <form onSubmit={handleLogin}>
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

              <div className="lp-field">
                <label>Password</label>
                <div className="lp-inp">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ paddingRight: '68px' }}
                  />
                  <button type="button" className="lp-showhide" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="lp-frow">
                  <Link href="/reset-password" className="lp-forgot">Forgot password?</Link>
                </div>
              </div>

              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? <><span className="lp-spin" />Signing in...</> : 'Sign In'}
              </button>
            </form>

            <div className="lp-sep">
              <div className="lp-sepl" />
              <span>or</span>
              <div className="lp-sepl" />
            </div>

            <Link href="/otpsend" className="lp-reg">
              Don&apos;t have an account?&nbsp;<strong>Create one</strong>
            </Link>

            <div className="lp-foot">
              <p>🔐 Secure encryption &nbsp;·&nbsp; <a href="mailto:support@interviewcoach.ai">Support</a></p>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}