'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/withProtectedRoute';

export default function InterviewLandingPage() {
  const router = useRouter();

  const { user, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
        </div>
      </>
    );
  }

  if (!user) return null;

  const steps = [
    {
      title: "Start Session",
      desc: "Select your resume and job role to generate AI questions.",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
      color: '#c0392b',
      link: "/interview/start"
    },
    {
      title: "Take Interview",
      desc: "Answer via audio or text and get real-time transcription.",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      ),
      color: '#facc15',
      link: "/interview/take/mock-id"
    },
    {
      title: "Get Results",
      desc: "Receive a detailed score card and AI-powered feedback.",
      icon: (
        <svg width="34" height="34" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      color: '#4ade80',
      link: "/results/test"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .il-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        /* Sparks wapas aa gaye bina blur ke */
        .il-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: 
            radial-gradient(circle at 70% 20%, rgba(192,57,43,0.08) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(140,20,20,0.05) 0%, transparent 40%);
        }

        /* ── NAV ── */
        .il-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(35,35,35,0.96); backdrop-filter: blur(16px);
          border-bottom: 1px solid #2a2a2a; padding: 0 52px;
        }
        .il-nav-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .il-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 3.5px; color: #f0f0f0; text-decoration: none;
        }
        .il-logo em { font-style: normal; color: #c0392b; }

        .il-nav-links { display: flex; align-items: center; gap: 12px; }

        .il-nav-btn {
          padding: 7px 22px;
          border-radius: 50px;
          font-size: 12.5px; font-weight: 500;
          text-decoration: none; letter-spacing: 0.5px;
          transition: all .2s; display: flex; align-items: center; gap: 6px;
        }
        .il-nav-btn-ghost {
          background: transparent;
          border: 1px solid #aaa;
          color: #aaa;
        }
        .il-nav-btn-ghost:hover { border-color: rgba(192,57,43,0.4); color: #ccc; background: rgba(192,57,43,0.05); }

        .il-nav-btn-prep {
          background: transparent;
          border: 1px solid rgba(250,204,21,0.3);
          color: #a38d0a;
        }
        .il-nav-btn-prep:hover {
          border-color: #facc15;
          color: #facc15;
          background: rgba(250,204,21,0.06);
          box-shadow: 0 0 14px rgba(250,204,21,0.12);
        }

        /* ── MAIN ── */
        .il-main {
          position: relative; z-index: 2;
          max-width: 1060px; margin: 0 auto;
          padding: 72px 40px 80px;
        }

        /* ── HERO ── */
        .il-hero { text-align: center; margin-bottom: 80px; }

        .il-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.22);
          border-radius: 20px; padding: 5px 16px; margin-bottom: 28px;
        }
        .il-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #c0392b; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .il-badge span { font-size: 10.5px; letter-spacing: 3px; text-transform: uppercase; color: #c0392b; font-weight: 500; }

        .il-hero h1 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1.05;
          color: #f5f5f5;
          margin-bottom: 20px;
        }
        .il-hero h1 em { font-style: normal; color: #c0392b; }

        .il-hero-sub {
          font-size: 16px; color: #555; font-weight: 300;
          line-height: 1.8; max-width: 480px; margin: 0 auto 44px;
        }

        .il-hero-btns { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

        .il-btn-primary {
          padding: 16px 40px; background: #b91c1c; border: none;
          border-radius: 50px;
          color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 3px;
          text-decoration: none; cursor: pointer;
          position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s; display: inline-block;
        }
        .il-btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%); }
        .il-btn-primary:hover { background: #d44235; transform: translateY(-1px); box-shadow: 0 12px 32px rgba(192,57,43,0.3); }

        .il-btn-yellow {
          padding: 15px 40px;
          background: transparent;
          border: 1.5px solid rgba(250,204,21,0.45);
          border-radius: 50px;
          color: #a89010;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 3px;
          text-decoration: none; display: inline-block;
          transition: border-color .2s, color .2s, background .2s, box-shadow .2s;
        }
        .il-btn-yellow:hover {
          border-color: #facc15;
          color: #facc15;
          background: rgba(250,204,21,0.06);
          box-shadow: 0 0 28px rgba(250,204,21,0.15);
        }

        /* ── STEPS ── */
        .il-steps-section { margin-bottom: 64px; }

        .il-steps-row {
          display: flex; align-items: center; justify-content: center;
          gap: 0;
        }

        .il-step {
          width: 280px; flex-shrink: 0;
          background: #262626;
          border-radius: 32px 12px 32px 12px;
          padding: 36px 30px 30px;
          border: 1px solid #242424;
          position: relative; overflow: hidden;
          transition: border-color .25s, background .25s, transform .25s;
        }
        .il-step:hover { background: #1e1e1e; transform: translateY(-3px); }

        .il-step::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          opacity: 0.3; transition: opacity .25s;
        }
        .il-step:hover::before { opacity: 1; }
        .il-step.s-red { border-color: rgba(192,57,43,0.18); }
        .il-step.s-red::before { background: #c0392b; }
        .il-step.s-yellow { border-color: rgba(250,204,21,0.15); }
        .il-step.s-yellow::before { background: #facc15; }
        .il-step.s-green { border-color: rgba(74,222,128,0.15); }
        .il-step.s-green::before { background: #4ade80; }

        .il-step-icon {
          width: 60px; height: 60px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; position: relative; z-index: 1;
        }
        .il-step.s-red .il-step-icon { background: rgba(192,57,43,0.12); border: 1px solid rgba(192,57,43,0.25); color: #c0392b; }
        .il-step.s-yellow .il-step-icon { background: rgba(250,204,21,0.1); border: 1px solid rgba(250,204,21,0.22); color: #facc15; }
        .il-step.s-green .il-step-icon { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.2); color: #4ade80; }

        .il-step-num {
          font-size: 9.5px; letter-spacing: 3px; text-transform: uppercase;
          font-weight: 600; margin-bottom: 8px; text-align: center;
        }
        .il-step.s-red .il-step-num { color: rgba(192,57,43,0.7); }
        .il-step.s-yellow .il-step-num { color: rgba(250,204,21,0.7); }
        .il-step.s-green .il-step-num { color: rgba(74,222,128,0.7); }

        .il-step h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 1.5px; color: #e0e0e0;
          margin-bottom: 10px; text-align: center;
        }
        .il-step p {
          font-size: 12.5px; color: #a1a1aa; font-weight: 300;
          line-height: 1.75; text-align: center;
        }

        .il-arrow {
          flex-shrink: 0; width: 56px;
          display: flex; align-items: center; justify-content: center;
        }
        .il-arrow-line {
          height: 1px; width: 100%;
          background: #2e2e2e;
        }

        /* ── QUOTE ── */
        .il-quote {
          background: #161616;
          border: 1px solid #232323;
          border-radius: 40px;
          padding: 36px 52px;
          text-align: center; position: relative;
        }
        .il-quote::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
          background: rgba(250,204,21,0.2);
        }

        .il-quote-mark {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 80px; line-height: 0.55; color: rgba(250,204,21,0.07);
          display: block; margin-bottom: 14px;
        }
        .il-quote-text {
          font-size: 14.5px; color: #595959; font-style: italic;
          font-weight: 300; line-height: 1.8;
          max-width: 520px; margin: 0 auto 10px;
        }
        .il-quote-text strong { color: #facc15; font-weight: 500; }
        .il-quote-attr {
          font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(250,204,21,0.3);
        }

        @media (max-width: 860px) {
          .il-main { padding: 48px 20px 60px; }
          .il-nav { padding: 0 20px; }
          .il-steps-row { flex-direction: column; gap: 16px; }
          .il-arrow { width: 40px; transform: rotate(90deg); }
          .il-step { width: 100%; max-width: 360px; }
        }
      `}</style>

      <div className="il-root">
        <div className="il-bg" />

        {/* NAV */}
        <nav className="il-nav">
          <div className="il-nav-inner">
            <Link href="/dashboard" className="il-logo">Interview<em>Coach</em> AI</Link>
            <div className="il-nav-links">
              <Link href="/interviewprep" className="il-nav-btn il-nav-btn-prep">
                Prep Material
              </Link>
              <Link href="/dashboard" className="il-nav-btn il-nav-btn-ghost">← Dashboard</Link>
            </div>
          </div>
        </nav>

        <main className="il-main">

          {/* HERO */}
          <div className="il-hero">
            <div className="il-badge">
              <span className="il-badge-dot" />
              <span>AI-Powered Interview</span>
            </div>
            <h1>
              Master the <em>Grill.</em>
            </h1>
            <p className="il-hero-sub">
              A 3-step AI-powered process to evaluate your technical skills and personality.
            </p>
            <div className="il-hero-btns">
              <Link href="/interview/start" className="il-btn-primary">
                Start Interview Now
              </Link>
              <Link href="/interviewprep" className="il-btn-yellow">
                Browse Prep
              </Link>
            </div>
          </div>

          {/* STEPS */}
          <div className="il-steps-section">
            <div className="il-steps-row">

              <div className="il-step s-red">
                <div className="il-step-icon">{steps[0].icon}</div>
                <p className="il-step-num">Step 01</p>
                <h3>{steps[0].title}</h3>
                <p>{steps[0].desc}</p>
              </div>

              <div className="il-arrow">
                <div className="il-arrow-line" />
              </div>

              <div className="il-step s-yellow">
                <div className="il-step-icon">{steps[1].icon}</div>
                <p className="il-step-num">Step 02</p>
                <h3>{steps[1].title}</h3>
                <p>{steps[1].desc}</p>
              </div>

              <div className="il-arrow">
                <div className="il-arrow-line" />
              </div>

              <div className="il-step s-green">
                <div className="il-step-icon">{steps[2].icon}</div>
                <p className="il-step-num">Step 03</p>
                <h3>{steps[2].title}</h3>
                <p>{steps[2].desc}</p>
              </div>

            </div>
          </div>

          {/* QUOTE */}
          <div className="il-quote">
            <span className="il-quote-mark">"</span>
            <p className="il-quote-text">
              <strong>The secret of getting ahead is getting started.</strong><br />
              Practice makes you perfect.
            </p>
            <p className="il-quote-attr">— Words to live by</p>
          </div>

        </main>
      </div>
    </>
  );
}