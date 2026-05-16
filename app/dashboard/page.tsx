'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import ChatWidget from '@/app/chatbot/ChatWidget';

export default function Dashboard() {
  const router = useRouter();
 
  const { user, isLoading } = useAuth(); 
  

  if (isLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#080808', flexDirection:'column', gap:'16px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(185,29,29,0.2)', borderTopColor:'#b91d1d', animation:'spin .7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#444', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Verifying access...</p>
      </div>
    );
  }

  if (!user) return null;

  const username = user?.email?.split('@')[0] || 'User';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: #000000; 
          color: #e0e0e0;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* bg grid */
        
        .db-glow {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 10% 15%, rgba(185,29,29,0.22) 0%, transparent 40%),
            radial-gradient(circle at 90% 25%, rgba(185,29,29,0.18) 0%, transparent 35%),
            radial-gradient(circle at 50% 85%, rgba(185,29,29,0.20) 0%, transparent 39%),
            radial-gradient(circle at 88% 88%, rgba(185,29,29,0.22) 0%, transparent 38%);
          filter: blur(90px);
        }

        /* ── NAV ── */
        .db-nav {
          position: sticky; top: 0; z-index: 100;
          background:  #1a1a1a;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #111;
          padding: 0 52px;
        }
        .db-nav-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 80px; /* Slightly taller for deco */
        }
        
        /* Deco Styles for Logo */
        .db-logo-wrapper { display: flex; flex-direction: column; align-items: flex-start; }
        .db-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 3.5px; color: #fff;
          text-decoration: none; margin-bottom: 4px;
        }
        .db-logo em { font-style: normal; color: #b91d1d; }
        
        .db-deco { display: flex; align-items: center; gap: 0; }
        .db-vline { width: 2px; height: 16px; background: #b91d1d; }
        .db-hline { height: 2px; width: 32px; background: linear-gradient(to right, #b91d1d, transparent); }

        .db-logout {
          padding: 8px 22px;
          background: transparent;
          border: 1px solid rgba(185,29,29,0.3);
          border-radius: 7px; color: #b91d1d;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          cursor: pointer; transition: background .2s, border-color .2s;
          letter-spacing: 0.3px;
        }
        .db-logout:hover { background: rgba(185,29,29,0.1); border-color: #b91d1d; }

        /* ── MAIN ── */
        .db-main {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 52px 52px 80px;
        }

        /* ── HERO STRIP ── */
        .db-hero {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 40px; margin-bottom: 64px;
          padding-bottom: 48px;
          border-bottom: 1px solid #141414;
        }
        .db-hero-eyebrow {
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: #b91d1d; font-weight: 500; margin-bottom: 12px;
        }
        .db-hero-text h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 5.5vw, 80px);
          letter-spacing: 2px; line-height: 1; color: #fff;
          margin-bottom: 14px;
        }
        .db-hero-text h1 span { color: #b91d1d; }
        .db-hero-text p { font-size: 14px; color: #aaa; font-weight: 300; line-height: 1.7; max-width: 420px; }

        .db-hero-right { display: flex; flex-direction: column; align-items: flex-end; gap: 20px; flex-shrink: 0; }

        .db-started {
          padding: 14px 32px;
          background: #b91d1d; border: none; border-radius: 8px;
          color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 2.5px;
          text-decoration: none; cursor: pointer;
          position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s;
          display: inline-block;
        }
        .db-started::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%); }
        .db-started:hover { background: #cc2020; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(185,29,29,0.3); }

        .db-stats {
            display: flex;
            gap: 12px;                 
            background: transparent;   
            border: none;
        }
         .db-stat:hover {
             border-color: #b91d1d;
             transform: translateY(-2px);
              transition: all 0.2s ease;
          }
        .db-stat {
            flex: 1;
             padding: 20px 28px;
             background: #1a1a1a;   /* 👈 gray look */
               text-align: center;
              position: relative;
               border: 1px solid #2a2a2a;   /* 👈 border add */
                  border-radius: 10px;         /* 👈 smooth look */
          }

        .db-stat::after { content: ''; position: absolute; right: 0; top: 20%; bottom: 20%; width: 1px; background: #141414; }
        .db-stat:last-child::after { display: none; }
        .db-stat-n {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px; letter-spacing: 1px; color: #b91d1d; line-height: 1;
        }
        .db-stat-l { font-size: 10px; color: #9ca3af; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }

        .db-sec-label {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 24px;
        }
        .db-sec-label h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 25px; letter-spacing: 4px; text-transform: uppercase;
          color: #b91d1d; white-space: nowrap;
        }
        .db-sec-line { flex: 1; height: 1px; background: linear-gradient(to right, #1a1a1a, transparent); }

        .db-quick { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 64px; }

        .db-qa {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 20px;
          background: #1a1a1a; border: 1px solid rgba(255,255,255,0.15);;
          border-radius: 40px; text-decoration: none;
          transition: border-color .2s, background .2s;
          position: relative; overflow: hidden;
        }
        .db-qa::before {
          content: ''; position: absolute; inset: 0; border-radius: 40px;
          background: rgba(185,29,29,0.06); opacity: 0; transition: opacity .2s;
        }
        .db-qa:hover { border-color: rgba(185,29,29,0.35); }
        .db-qa:hover::before { opacity: 1; }

        .db-qa-icon { font-size: 18px; line-height: 1; }
        .db-qa-text { font-size: 13px; color: #888; font-weight: 500; transition: color .2s; white-space: nowrap; }
        .db-qa:hover .db-qa-text { color: #e0e0e0; }

        .db-features { margin-bottom: 64px; }
        .db-feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .db-feat {
         background: #1a1a1a;  
         border: 1px solid  #444;
         border-radius: 14px;
        padding: 28px;
          color: #e5e5e5;
          transition: all 0.25s ease;
          position: relative;
          }
        .db-feat:hover {border-color: #b91d1d;
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.6);
          }

        .db-feat::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 14px;
  background: linear-gradient(120deg, transparent, rgba(185,29,29,0.15), transparent);
  opacity: 0;
  transition: 0.3s;
}

.db-feat:hover::before {
  opacity: 1;
}

        .db-feat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .db-feat-icon { font-size: 28px; }
        .db-feat-arrow {
          font-size: 16px; color: #222;
          transition: color .2s, transform .2s;
        }
        .db-feat:hover .db-feat-arrow { color: #b91d1d; transform: translate(2px, -2px); }

        .db-feat h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 1px; color: #ddd;
          margin-bottom: 8px;
          transition: color .2s;
        }
        .db-feat:hover h3 { color: #fff; }
        .db-feat p { font-size: 12.5px; color: #404040; font-weight: 300; line-height: 1.7; flex: 1; }

        .db-feat-tag {
          display: inline-flex; align-items: center;
          margin-top: 18px; padding: 4px 12px;
          background: rgba(185,29,29,0.07); border: 1px solid rgba(185,29,29,0.12);
          border-radius: 20px;
          font-size: 10.5px; color: #b91d1d; letter-spacing: 1px;
          width: fit-content; opacity: 1; transition: opacity .2s;
        }
        .db-feat:hover .db-feat-tag { opacity: 1; }

        .db-feat-plain { cursor: default; }
        .db-feat-plain:hover { border-color: #181818; background: #0e0e0e; }
        .db-feat-plain::before { display: none; }
        .db-feat-plain:hover h3 { color: #ddd; }
        .db-feat-plain:hover .db-feat-arrow { color: #222; transform: none; }
        .db-feat-plain:hover .db-feat-tag { opacity: 0; }

        .db-tips {
  background: transparent;   /* 👈 remove box */
  border: none;
  padding: 40px 0;
}
        .db-tips-grid::before {
  background: linear-gradient(to right, transparent, #b91d1d, transparent);
}
        .db-tips-head {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 4px; text-transform: uppercase;
          color: #b91d1d; margin-bottom: 24px;
        }
        .db-tips-grid {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 40px;
        }

        /* line */
        .db-tips-grid::before {
          content: "";
          position: absolute;
          top: 40px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, #b91d1d, transparent); 
        }
         .db-tip {
          position: relative;
          z-index: 2;

          width: 90px;
          height: 90px;

          border-radius: 50%;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;

          display: flex;
          align-items: center;
          justify-content: center;

          transition: all 0.3s ease;
        }
        .db-tip:hover {
          transform: translateY(-10px) scale(1.1);
        }
        .db-tip-icon {
          font-size: 24px;
          color: #b91d1d;   /* 👈 red accent */
        }
        .db-tip h4 {
          position: absolute;
          top: 95px;
          width: 120px;
          text-align: center;
          font-size: 13px;
          color: #e5e5e5;   /* 👈 visible */
        }

        .db-tip p {
          position: absolute;
          top: 120px;          
          width: 140px;
          font-size: 11px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.4;
        }

        /* 1st */
        .db-tip:nth-child(1) {
          background: #b91d1d;   /* red */
          border-color: #ef4444;
        }

        /* 2nd */
        .db-tip:nth-child(2) {
          background: #ffffff;   /* white */
          border-color: #e5e5e5;
          color: #111;
        }

        /* 3rd */
        .db-tip:nth-child(3) {
          background: #b91d1d;
        }

        /* 4th */
        .db-tip:nth-child(4) {
          background: #ffffff;
          color: #111;
        }
  

        @media (max-width: 1024px) {
          .db-main { padding: 40px 28px 60px; }
          .db-nav { padding: 0 28px; }
          .db-feat-grid { grid-template-columns: repeat(2, 1fr); }
          .db-hero { flex-direction: column; align-items: flex-start; }
          .db-hero-right { align-items: flex-start; }
        }
        @media (max-width: 640px) {
          .db-feat-grid { grid-template-columns: 1fr; }
          .db-tips-grid { grid-template-columns: 1fr 1fr; }
          .db-stats { flex-direction: column; }
        }
      `}</style>

      <div className="db-root">
        
        <div className="db-glow" />

        {/* NAV */}
        <nav className="db-nav">
          <div className="db-nav-inner">
            <div className="db-logo-wrapper">
              <Link href="/" className="db-logo">Interview<em>Coach</em> AI</Link>
              <div className="db-deco">
                <div className="db-vline" />
                <div className="db-hline" />
              </div>
            </div>
            <button
              className="db-logout"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userEmail');
                router.push('/');
              }}
            >
              Logout
            </button>
          </div>
        </nav>

        <main className="db-main">

          {/* HERO */}
          <div className="db-hero">
            <div className="db-hero-text">
              <p className="db-hero-eyebrow">Dashboard</p>
              <h1>Welcome back,<br /><span>{username}</span></h1>
              <p>Your AI-powered interview preparation companion is ready to help you ace your next interview.</p>
            </div>
            <div className="db-hero-right">
              <div className="db-stats">
                <div className="db-stat">
                  <div className="db-stat-n">0</div>
                  <div className="db-stat-l">Resumes</div>
                </div>
                <div className="db-stat">
                  <div className="db-stat-n">0</div>
                  <div className="db-stat-l">Interviews</div>
                </div>
                <div className="db-stat">
                  <div className="db-stat-n">0</div>
                  <div className="db-stat-l">Matched</div>
                </div>
              </div>
              <Link href="/UploadResume" className="db-started">Get Started →</Link>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ marginBottom: '64px' }}>
            <div className="db-sec-label">
              <h2>Quick Actions</h2>
              <div className="db-sec-line" />
            </div>
            <div className="db-quick">
               <Link href="/getresume" className="db-qa">
                <span className="db-qa-icon">📋</span>
                <span className="db-qa-text">My Resumes</span>
              </Link>
              <Link href="/uploadresume" className="db-qa">
                <span className="db-qa-icon">📄</span>
                <span className="db-qa-text">Upload Resume</span>
              </Link>
              <Link href="/AnalysisResume" className="db-qa">
                <span className="db-qa-icon">🔍</span>
                <span className="db-qa-text">Job Matching Analysis</span>
              </Link>
              <Link href="/interviewprep" className="db-qa">
                <span className="db-qa-icon">🎤</span>
                <span className="db-qa-text">Interview Prep</span>
              </Link>
              <Link href="/interview" className="db-qa">
                <span className="db-qa-icon">🎤</span>
                <span className="db-qa-text">TakeInterview</span>
              </Link>
            </div>
          </div>

          {/* FEATURES */}
          <div className="db-features">
            <div className="db-sec-label">
              <h2>Main Features</h2>
              <div className="db-sec-line" />
            </div>
            <div className="db-feat-grid">

               <Link href="/DetailsDocs" className="db-feat">
                <div className="db-feat-top">
                  <span className="db-feat-icon">📖</span>
                  <span className="db-feat-arrow">↗</span>
                </div>
                <h3>Getting Started</h3>
                <p>Learn the best practices and tips for using Interview Coach AI effectively</p>
                <span className="db-feat-tag">Documentation →</span>
              </Link>

              <Link href="/interviewprep" className="db-feat">
                <div className="db-feat-top">
                  <span className="db-feat-icon">🚀</span>
                  <span className="db-feat-arrow">↗</span>
                </div>
                <h3>Interview Practice</h3>
                <p>Get AI-generated interview questions and practice your responses with detailed feedback</p>
                <span className="db-feat-tag">Start Practice →</span>
              </Link>

              <Link href="/interview" className="db-feat">
                <div className="db-feat-top">
                  <span className="db-feat-icon">📊</span>
                  <span className="db-feat-arrow">↗</span>
                </div>
                <h3>Interview Session</h3>
                <p>Start your interview, answer AI questions, and view results after completion.</p>
                <span className="db-feat-tag">Start → Take → Result</span>
              </Link>

              <Link href="/AnalysisResume" className="db-feat">
                <div className="db-feat-top">
                  <span className="db-feat-icon">💼</span>
                  <span className="db-feat-arrow">↗</span>
                </div>
                <h3>Top Job Matches</h3>
                <p>Discover the best job opportunities that align with your skills and experience</p>
                <span className="db-feat-tag">View Matches →</span>
              </Link>

              <Link href="/getresume" className="db-feat">
                <div className="db-feat-top">
                  <span className="db-feat-icon">📁</span>
                  <span className="db-feat-arrow">↗</span>
                </div>
                <h3>Resume Library</h3>
                <p>Manage and organize all your resumes in one convenient location</p>
                <span className="db-feat-tag">Manage →</span>
              </Link>


              <Link href="" className="db-feat">
                <div className="db-feat-top">
                  <span className="db-feat-icon">🤖</span>
                  <span className="db-feat-arrow">↗</span>
                </div>
                <h3>AI Chat Assistant</h3>
                <p>Ask questions, get instant guidance, and chat with your AI interview assistant anytime.</p>
                
              </Link>

            </div>
          </div>

          {/* TIPS */}
          <div className="db-tips">
            <div className="db-tips-head">Pro Tips for Success</div>
            <div className="db-tips-grid">
              <div className="db-tip">
                <span className="db-tip-icon">🎯</span>
                <h4>Update Regularly</h4>
                <p>Keep your resume updated with latest skills and experiences</p>
              </div>
              <div className="db-tip">
                <span className="db-tip-icon">🎤</span>
                <h4>Practice Daily</h4>
                <p>Dedicate time each day to interview practice questions</p>
              </div>
              <div className="db-tip">
                <span className="db-tip-icon">📊</span>
                <h4>Track Progress</h4>
                <p>Monitor your improvement through our analytics dashboard</p>
              </div>
              <div className="db-tip">
                <span className="stat-icon">🚀</span>
                <h4>Apply Smart</h4>
                <p>Use job matching to find roles that fit your profile</p>
              </div>
            </div>
          </div>

        </main>

        <ChatWidget />
      </div>
    </>
  );
}