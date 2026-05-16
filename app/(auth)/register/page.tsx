'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeRegistration } from '@/lib/api';
import { validatePassword, validatePasswordMatch } from '@/lib/validators';

function RegisterInner() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    
    console.log('📌 Register page loaded with params:');
    console.log('   Email:', emailParam);
    console.log('   Token:', verifiedToken ? `${verifiedToken.substring(0, 20)}...` : 'NOT FOUND');
    console.log('   Verified:', verified);
    
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    
    if (verifiedToken) {
      const decodedToken = decodeURIComponent(verifiedToken);
      console.log('✅ Token decoded:', decodedToken ? `${decodedToken.substring(0, 20)}...` : 'EMPTY');
      setRegistrationToken(decodedToken);
    } else {
      console.log('❌ No token found in URL!');
    }
     if (verified !== 'true' || !verifiedToken) {
      console.log('⚠️ Unauthorized register access. Routing to /otpsend');
      router.push('/otpsend');
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

    // Use validators for password validation
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

    console.log('🚀 Submitting registration with:');
    console.log('   Email:', email);
    console.log('   Full Name:', fullName);
    console.log('   Token:', registrationToken ? `${registrationToken.substring(0, 20)}...` : 'EMPTY/MISSING');

    if (!registrationToken) {
      setError('❌ Registration token missing! Please verify your email again.');
      return;
    }

    setLoading(true);

    try {
      const data = await completeRegistration(email, password, fullName.trim(), registrationToken) as any;

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        if (data.user_id || data.id) {
          localStorage.setItem('userId', data.user_id || data.id);
        }
      }
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = passwordStrength === 'weak' ? '#ef4444' : passwordStrength === 'medium' ? '#eab308' : '#22c55e';
  const strengthWidth = passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%';

  return (
    <main className="lp-main">
      <div className="lp-card">
        <div className="lp-badge">
          <div className="lp-dot" /><span>New Account</span>
        </div>

        <h1>Register</h1>
        <p className="lp-cardsub">Complete your details to finish setting up your account.</p>

        {/* Verified Email Chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#121212', border: '1px solid #222',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '24px'
        }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#444', letterSpacing: '1px' }}>Verified Email</p>
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

        <form onSubmit={handleCompleteRegistration}>
          <div className="lp-field">
            <label>Full Name</label>
            <div className="lp-inp">
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required />
            </div>
          </div>

          <div className="lp-field">
            <label>Password</label>
            <div className="lp-inp">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: '62px' }} />
              <button type="button" className="lp-showhide" onClick={() => setShowPass(p => !p)}>{showPass ? 'Hide' : 'Show'}</button>
            </div>
            {password && (
              <div style={{ marginTop: '10px' }}>
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

          <button type="submit" className="lp-btn" disabled={loading || password !== confirmPassword || password.length < 8 || !fullName.trim()}>
            {loading ? <><span className="lp-spin" />Creating Account...</> : 'Complete Registration'}
          </button>
        </form>

        <div className="lp-foot">
          <p>Already have an account? <Link href="/login">Sign in here</Link></p>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
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
          <RegisterInner />
        </Suspense>
      </div>
    </>
  );
}