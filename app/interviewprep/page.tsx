'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserInterviews, SessionDetails } from '@/lib/interview/interviewApi'; 
import { useAuth } from '@/lib/auth/withProtectedRoute';


export default function InterviewPrepPage() {
  const router = useRouter();
  
 
  const { user, isLoading: authLoading } = useAuth(); 

  const [interviews, setInterviews] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true);
        const response = await getUserInterviews() as any; 
        const finalInterviews = response?.data || response || [];
        setInterviews(finalInterviews);

      } catch (err: any) {
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadInterviews();
    }
  }, [user, authLoading]);


  if (authLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111', flexDirection:'column', gap:'16px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#888', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Loading...</p>
      </div>
    );
  }

  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const inProgressInterviews = interviews.filter((i) => i.status === 'in_progress');

  const getScoreColor = (score: number | null) => {
    if (!score) return '#888';
    if (score >= 40) return '#4ade80';
    if (score >= 30) return '#facc15';
    return '#f87171';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ip-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        .ip-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 75% 10%, rgba(180,30,30,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 85%, rgba(140,20,20,0.07) 0%, transparent 60%);
        }

        /* NAV */
        .ip-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(22,22,22,0.95); backdrop-filter: blur(16px);
          border-bottom: 1px solid #2a2a2a; padding: 0 52px;
        }
        .ip-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .ip-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #f0f0f0; text-decoration: none; }
        .ip-logo em { font-style: normal; color: #c0392b; }
        .ip-back { font-size: 13px; color: #aaa; text-decoration: none; transition: color .2s; padding: 6px 16px; border: 1px solid #3a3a3a;border-radius: 20px;  }
        .ip-back:hover {color: #fff;border-color: #c0392b;background: rgba(192,57,43,0.08);}

        /* MAIN */
        .ip-main {
          position: relative; z-index: 2;
          max-width: 1100px; margin: 0 auto;
          padding: 56px 40px 80px;
        }

        /* HEADER */
        .ip-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 52px; gap: 20px;
          padding-bottom: 40px; border-bottom: 1px solid #1e1e1e;
        }
        .ip-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: #c0392b; font-weight: 500; margin-bottom: 14px;
        }
        .ip-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #c0392b; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .ip-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 62px);
          letter-spacing: 2px; line-height: 1; color: #f5f5f5; margin-bottom: 10px;
        }
        .ip-header h1 span { color: #c0392b; }
        .ip-header-sub { font-size: 14px; color: #666; font-weight: 300; line-height: 1.7; }

        /* SECTION LABEL */
        .ip-sec-label {
          display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
        }
        .ip-sec-label h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 4px; text-transform: uppercase;
          color: #c0392b; white-space: nowrap;
        }
        .ip-sec-line { flex: 1; height: 1px; background: linear-gradient(to right, #1e1e1e, transparent); }

        /* QUICK START GRID */
        .ip-top-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin-bottom: 56px;
        }

        /* MOCK START CARD */
        .ip-start-card {
          background: #1c1c1c; border: 1px solid #2e2e2e ;
          border-radius: 14px; padding: 36px;
          position: relative; overflow: hidden;
          transition: border-color .25s;
        }
        .ip-start-card:hover {  border-color: rgba(202,138,4,0.6);}
        .ip-start-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #ca8a04;
        }
        .ip-start-bg-icon {
          position: absolute; right: 20px; top: 20px;
          font-size: 72px; opacity: 0.06; pointer-events: none;
          transition: opacity .25s;
        }
        .ip-start-card:hover .ip-start-bg-icon { opacity: 0.1; }

        .ip-start-card h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; letter-spacing: 1.5px; color: #f0f0f0; margin-bottom: 10px;
        }
        .ip-start-card p { font-size: 13.5px; color: #666; font-weight: 300; line-height: 1.75; margin-bottom: 28px; }

        .ip-start-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; background: rgba(202,138,4,0.18); border: 1px solid rgba(202,138,4,0.35); 
          border-radius: 8px; color: #e6c36a;
          font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 2px;
          cursor: pointer; position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .ip-start-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%); }
        .ip-start-btn:hover {background: rgba(202,138,4,0.28);border-color: rgba(202,138,4,0.5);box-shadow: 0 6px 18px rgba(202,138,4,0.2);}
        /* INFO CARD */
        /* Update the grid to give more space to the timeline on the right */
        .ip-top-grid {
          display: grid; 
          grid-template-columns: 1.2fr 0.8fr; /* Left side wider, right side for timeline */
          gap: 40px; 
          margin-bottom: 56px;
          align-items: start;
        }

        /* Timeline Container */
        .ip-timeline-container {
          position: relative;
          padding-left: 40px; /* Space for the line and circles */
        }

        /* The Vertical Line */
        .ip-timeline-container::before {
          content: '';
          position: absolute;
          left: 10px; /* Aligns the line with the center of the circles */
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: linear-gradient(to bottom, #c0392b 0%, #333 100%);
        }

        .ip-timeline-item {
          position: relative;
          margin-bottom: 32px;
        }

        /* The Circle with Tick */
        .ip-timeline-dot {
          position: absolute;
          left: -40px; /* Move back into the padding area */
          top: 2px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #111;
          border: 2px solid #c0392b;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        /* SVG Tick styling */
        .ip-timeline-dot svg {
          width: 12px;
          height: 12px;
          color: #c0392b;
          stroke-width: 3;
        }

        .ip-timeline-content h4 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          color: #f0f0f0;
          margin-bottom: 4px;
        }

        .ip-timeline-content p {
          font-size: 13px;
          color: #777;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .ip-top-grid { grid-template-columns: 1fr; gap: 32px; }
        }
       
        /* IN PROGRESS */
        .ip-progress-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 14px; margin-bottom: 52px;
        }

        .ip-progress-card {
          background: #1c1c1c; border: 1px solid #2a2a2a;
          border-radius: 12px; padding: 24px 26px;
          position: relative; overflow: hidden;
          transition: border-color .2s;
        }
        .ip-progress-card:hover { border-color: rgba(234,179,8,0.3); }
        .ip-progress-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #ca8a04;
        }

        .ip-progress-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .ip-progress-card h3 { font-size: 15px; font-weight: 600; color: #ddd; }
        .ip-progress-badge {
          font-size: 9.5px; letter-spacing: 2px; text-transform: uppercase;
          background: rgba(202,138,4,0.1); color: #ca8a04;
          border: 1px solid rgba(202,138,4,0.2);
          padding: 3px 10px; border-radius: 20px; flex-shrink: 0;
        }

        .ip-progress-meta { font-size: 12px; color: #555; margin-bottom: 14px; }

        .ip-prog-bar-bg { height: 3px; background: #2a2a2a; border-radius: 3px; overflow: hidden; margin-bottom: 20px; }
        .ip-prog-bar-fill { height: 100%; background: linear-gradient(to right, #854d0e, #ca8a04); border-radius: 3px; transition: width .5s ease; }

        .ip-continue-btn {
          width: 100%; padding: 11px; background: transparent;
          border: 1px solid rgba(202,138,4,0.25); border-radius: 8px;
          color: #ca8a04; font-family: 'Bebas Neue', sans-serif;
          font-size: 15px; letter-spacing: 2px; cursor: pointer;
          transition: background .2s, border-color .2s, color .2s;
        }
        .ip-continue-btn:hover { background: rgba(202,138,4,0.1); border-color: #ca8a04; color: #fde68a; }

        /* COMPLETED */
        .ip-completed-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .ip-completed-card {
        background: #1c1c1c;
        border: 1px solid #2a2a2a;
         border-radius: 12px;
        padding: 24px 26px;position: relative;overflow: hidden; transition: border-color .2s, background .2s;}
         .ip-completed-card::before {
          content: '';position: absolute;left: 0;top: 0; bottom: 0; width: 3px; background: #ca8a04;}
        .ip-completed-card:hover {border-color: rgba(202,138,4,0.4);background: #211a10;}

        .ip-completed-title { font-size: 14px; font-weight: 600; color: #ccc; margin-bottom: 4px; }
        .ip-completed-date { font-size: 11px; color: #444; margin-bottom: 20px; letter-spacing: 0.3px; }

        .ip-score-row { display: flex; align-items: flex-end; justify-content: space-between; }
        .ip-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px; letter-spacing: 1px; line-height: 1;
        }
        .ip-score span { font-size: 16px; color: #444; }
        .ip-view-btn {
          font-size: 11.5px; color: #555; background: none; border: none;
          cursor: pointer; text-decoration: underline; text-underline-offset: 3px;
          transition: color .2s; padding: 0;
        }
        .ip-view-btn:hover { color: #c0392b; }

        @media (max-width: 900px) {
          .ip-main { padding: 40px 20px 60px; }
          .ip-nav { padding: 0 20px; }
          .ip-top-grid { grid-template-columns: 1fr; }
          .ip-progress-grid { grid-template-columns: 1fr; }
          .ip-completed-grid { grid-template-columns: 1fr 1fr; }
          .ip-header { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 560px) {
          .ip-completed-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ip-root">
        <div className="ip-bg" />

        {/* NAV */}
        <nav className="ip-nav">
          <div className="ip-nav-inner">
            <Link href="/" className="ip-logo">Interview<em>Coach</em> AI</Link>
            <Link href="/dashboard" className="ip-back">← Back to Dashboard</Link>
          </div>
        </nav>

        <main className="ip-main">

          {/* HEADER */}
          <div className="ip-header">
            <div>
              <div className="ip-eyebrow">
                <span className="ip-eyebrow-dot" /> Practice Mode
              </div>
              <h1>Interview <span>Preparation.</span></h1>
              <p className="ip-header-sub">Practice with AI-powered interview questions and get instant feedback</p>
            </div>
          </div>

          {/* QUICK START */}
          <div style={{ marginBottom: '52px' }}>
            <div className="ip-sec-label">
              <h2>Quick Start</h2>
              <div className="ip-sec-line" />
            </div>
            <div className="ip-top-grid">

              {/*  CARD */}
              <div className="ip-start-card">
                <span className="ip-start-bg-icon">🚀</span>
                <h3>Setup Practice Room</h3>
                <Link href="/interview/start" className="ip-start-btn">
                  Configure Session →
                </Link>
              </div>

              {/* INFO CARD */}
              <div className="ip-timeline-container">
                <div className="ip-timeline-item">
                  <div className="ip-timeline-dot">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ip-timeline-content">
                    <h4>Tailored Experience</h4>
                    <p>AI generates questions specifically mapped to your resume skills and the target job role.</p>
                  </div>
                </div>
                <div className="ip-timeline-item">
                  <div className="ip-timeline-dot">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ip-timeline-content">
                    <h4>Real-time Assessment</h4>
                    <p>Get instant performance feedback and sentiment analysis after every response.</p>
                  </div>
                </div>
                <div className="ip-timeline-item">
                  <div className="ip-timeline-dot">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                <div className="ip-timeline-content">
                  <h4>Growth Insights</h4>
                  <p>Receive a comprehensive score report with specific tips to improve your weak areas.</p>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* IN PROGRESS */}
          {inProgressInterviews.length > 0 && (
            <div style={{ marginBottom: '52px' }}>
              <div className="ip-sec-label">
                <h2>Resume Saved Sessions</h2>
                <div className="ip-sec-line" />
              </div>
              <div className="ip-progress-grid">
                {inProgressInterviews.map((interview) => (
                  <div key={interview.session_id} className="ip-progress-card">
                    <div className="ip-progress-head">
                      <h3>{interview.job_title}</h3>
                      <span className="ip-progress-badge">In Progress</span>
                    </div>
                    <p className="ip-progress-meta">{interview.answers_count} of {interview.questions_count} Answered</p>
                    <div className="ip-prog-bar-bg">
                      <div className="ip-prog-bar-fill" style={{ width: `${(interview.answers_count / interview.questions_count) * 100}%` }} />
                    </div>
                    <Link href={`/interview/take/${interview.session_id}`} className="ip-continue-btn">
                      Continue Practice
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPLETED */}
          {completedInterviews.length > 0 && (
            <div>
              <div className="ip-sec-label">
                <h2>Past Performance</h2>
                <div className="ip-sec-line" />
              </div>
              <div className="ip-completed-grid">
                {completedInterviews.map((interview) => (
                  <div key={interview.session_id} className="ip-completed-card">
                    <p className="ip-completed-title">{interview.job_title}</p>
                    <p className="ip-completed-date">{new Date(interview.completed_at!).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                    <div className="ip-score-row">
                      <div className="ip-score" style={{ color: getScoreColor(interview.total_score) }}>
                        {interview.total_score}<span>/50</span>
                      </div>
                      <Link href={`/interview/results/${interview.session_id}`} className="ip-view-btn">
                        View Analysis
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}