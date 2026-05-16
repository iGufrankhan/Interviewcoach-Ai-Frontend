'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { submitInterview, ScoreResult } from '@/lib/interview/interviewApi'; 
import { useAuth } from '@/lib/auth/withProtectedRoute';



export default function InterviewResultsPage() {
  const router = useRouter();
  const params = useParams();

  
  const { user, isLoading: authLoading } = useAuth(); 
 

  const sessionId = params.sessionId as string;

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      if (result) return; 

      try {
        setLoading(true);

        const scoreResult = await submitInterview(sessionId);
        // Safely check memory leaks before updating state
        if (isMounted) setResult(scoreResult);
        
      } catch (err: any) {
        if (isMounted) setError(err?.response?.data?.message || err?.message || 'Failed to load results');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (!authLoading) {
      loadResults();
    }

    return () => {
      isMounted = false;
    };

  }, [authLoading, result, sessionId]); 

  if (authLoading || loading) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0a0a0a', flexDirection:'column', gap:'16px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.1)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
          <p style={{ color:'#555', fontFamily:'sans-serif', fontSize:'12px', letterSpacing:'3px', textTransform:'uppercase' }}>Decrypting Results</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0a0a0a', flexDirection:'column', gap:'16px' }}>
        <p style={{ color:'#e07070', fontFamily:'sans-serif', fontSize:'14px' }}>{error}</p>
        <button onClick={() => router.push('/interview')} style={{ padding:'10px 24px', background:'#c0392b', border:'none', borderRadius:'8px', color:'#fff', cursor:'pointer' }}>Back to Interview</button>
      </div>
    );
  }

  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#4ade80';
    if (score >= 6) return '#facc15';
    return '#f87171';
  };

  const getPerformanceLabel = () => {
    if (result.percentage >= 80) return { label: 'ELITE STATUS', color: '#4ade80', text: "Your technical depth is impressive." };
    if (result.percentage >= 60) return { label: 'SOLID FOUNDATION', color: '#facc15', text: "Good grasp, refine the edge cases." };
    return { label: 'WORK IN PROGRESS', color: '#f87171', text: "Focus on fundamental concepts." };
  };

  const perf = getPerformanceLabel();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ir-root {
          min-height: 100vh;
          background: #0a0a0a;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* Ambient Glows */
        .ir-glow-1 { position: fixed; top: -10%; right: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(192,57,43,0.08) 0%, transparent 70%); z-index: 0; }
        .ir-glow-2 { position: fixed; bottom: -10%; left: -10%; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(50,50,50,0.1) 0%, transparent 70%); z-index: 0; }

        .ir-nav {
          position: sticky; top: 0; z-index: 100;
          background: #222222; backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.03); padding: 0 40px;
        }
        .ir-nav-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 70px;
        }
        .ir-logo { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 4px; color: #fff; text-decoration: none; }
        .ir-logo em { font-style: normal; color: #c0392b; text-shadow: 0 0 15px rgba(192,57,43,0.5); }
        .ir-back { font-size: 11px; color: #aaa; text-decoration: none; letter-spacing: 1px; text-transform: uppercase; border: 1px solid #aaa; padding: 8px 16px; border-radius: 20px; transition: 0.3s; }
        .ir-back:hover { border-color: #c0392b; color: #fff; background: rgba(192,57,43,0.05); }

        .ir-main {
          position: relative; z-index: 2;
          max-width: 1000px; margin: 0 auto;
          padding: 60px 40px;
        }

        /* Top Hero Section */
        .ir-hero { display: flex; align-items: center; justify-content: space-between; margin-bottom: 80px; gap: 40px; }
        .ir-hero-left { flex: 1; }
        .ir-hero h1 { font-family: 'Bebas Neue', sans-serif; font-size: 80px; line-height: 0.9; margin-bottom: 10px; }
        .ir-hero h1 span { color: #c0392b; }
        .ir-hero p { font-size: 14px; color: #9a9a9a; letter-spacing: 1px; }

        /* CIRCULAR SCORE VISUAL */
        .ir-score-display {
          position: relative; width: 220px; height: 220px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: radial-gradient(circle, #222222 50%, transparent 100%);
          border-radius: 50%;
        }
        .ir-score-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid #1a1a1a;
          border-top: 2px solid #c0392b;
          animation: spin 3s linear infinite;
        }
        .ir-score-val { font-family: 'Bebas Neue', sans-serif; font-size: 80px; line-height: 1; margin-top: 10px; }
        .ir-score-label { font-size: 10px; letter-spacing: 4px; color: #aaa; text-transform: uppercase; }

        /* STATS GRID */
        .ir-stats-bar {
          display: flex; gap: 20px; margin-bottom: 60px;
        }
        .ir-stat-pill {flex: 1;background: #1a1a1a;border-radius: 999px; border: 1px solid rgba(250, 204, 21, 0.3); /* Subtle yellow border */
         padding: 20px 30px;text-align: center;position: relative;box-shadow: 0 4px 15px rgba(250, 204, 21, 0.1);}

        .ir-stat-pill::after {content: '';position: absolute;bottom: -1px; left: 20%; right: 20%; height: 1px;background: #facc15; /* Niche ek bright yellow line */
        box-shadow: 0 0 10px #facc15;
        }
        .ir-stat-pill label { display: block; font-size: 10px; color: #9a9a9a; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
        .ir-stat-pill span { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: #ccc; }

        /* FEEDBACK LIST */
        .ir-timeline { position: relative; margin-top: 40px; }
        .ir-timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, #c0392b, transparent); }

        .ir-titem { position: relative; padding-left: 40px; margin-bottom: 30px; }
        .ir-titem-dot { position: absolute; left: -5px; top: 0; width: 10px; height: 10px; background: #0a0a0a; border: 2px solid #c0392b; border-radius: 50%; }
        
        .ir-titem-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid #555555;
          border-radius: 4px; padding: 24px;
          cursor: pointer; transition: 0.3s;
        }
        .ir-titem-card:hover { border-color: #c0392b;background: rgba(192,57,43,0.05);box-shadow: 0 0 12px rgba(192,57,43,0.2); }
        .ir-titem-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .ir-titem-q { font-size: 15px; color: #eee; font-weight: 500; }
        .ir-titem-score { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: #c0392b; }

        .ir-expanded { margin-top: 20px; padding-top: 20px; border-top: 1px dashed #222; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
        
        .ir-exp-section { margin-bottom: 15px; }
        .ir-exp-label { font-size: 10px; color: #c0392b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; font-weight: 600; }
        .ir-exp-content { font-size: 13px; color: #777; line-height: 1.6; }

        .ir-actions { margin-top: 60px; display: flex; gap: 15px; }
        .ir-btn { flex: 1; height: 55px; border-radius: 4px; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 2px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; text-decoration: none; }
        .ir-btn-p { background: #c0392b; color: #fff; border: none; box-shadow: 0 10px 20px rgba(192,57,43,0.2); }
        .ir-btn-p:hover { background: #e74c3c; transform: translateY(-2px); }
        .ir-btn-s { background: transparent; color: #9a9a9a; border: 1px solid #222; }
        .ir-btn-s:hover { border-color: #444; color: #eee; }

        @media (max-width: 800px) {
          .ir-hero { flex-direction: column; text-align: center; }
          .ir-stats-bar { flex-direction: column; }
          .ir-hero h1 { font-size: 60px; }
        }
      `}</style>

      <div className="ir-root">
        <div className="ir-glow-1" />
        <div className="ir-glow-2" />

        <nav className="ir-nav">
          <div className="ir-nav-inner">
            <Link href="/" className="ir-logo">INTERVIEW<em>COACH</em></Link>
            <Link href="/dashboard" className="ir-back">Exit to Dashboard</Link>
          </div>
        </nav>

        <main className="ir-main">
          
          <div className="ir-hero">
            <div className="ir-hero-left">
              <p style={{ color: '#c0392b', fontWeight: 600, marginBottom: '8px' }}>SESSION COMPLETE</p>
              <h1>THE <span>RESULT.</span></h1>
              <p>Comprehensive analysis of your technical communication and accuracy.</p>
            </div>
            
            <div className="ir-score-display">
              <div className="ir-score-ring" />
              <span className="ir-score-label">Rating</span>
              <span className="ir-score-val" style={{ color: getScoreColor(result.total_score) }}>{result.total_score}</span>
              <span className="ir-score-label">Out of 10</span>
            </div>
          </div>

          <div className="ir-stats-bar">
            <div className="ir-stat-pill">
              <label>Performance</label>
              <span style={{ color: perf.color }}>{perf.label}</span>
            </div>
            <div className="ir-stat-pill">
              <label>Accuracy</label>
              <span>{result.percentage}%</span>
            </div>
            <div className="ir-stat-pill">
              <label>Avg Clarity</label>
              <span>{result.average_per_question}/5.0</span>
            </div>
          </div>

          <p style={{ fontSize:'11px', letterSpacing:'3px', color:'#9a9a9a', textTransform:'uppercase', marginBottom:'30px' }}> Analysis Breakdown</p>

          <div className="ir-timeline">
            {result.question_answers.map((item, index) => (
              <div key={index} className="ir-titem">
                <div className="ir-titem-dot" />
                <div className="ir-titem-card" onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                  <div className="ir-titem-head">
                    <span className="ir-titem-q">{item.question}</span>
                    <span className="ir-titem-score">{item.score}/5</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#9a9a9a' }}>
                    {item.answer.substring(0, 80)}...
                  </p>

                  {expandedIndex === index && (
                    <div className="ir-expanded">
                      <div className="ir-exp-section">
                        <p className="ir-exp-label">Full Transcript</p>
                        <p className="ir-exp-content">"{item.answer}"</p>
                      </div>
                      <div className="ir-exp-section">
                        <p className="ir-exp-label">AI Logic & Feedback</p>
                        <p className="ir-exp-content">{item.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ir-actions">
            <button onClick={() => router.push('/interviewprep')} className="ir-btn ir-btn-p">Start New Session</button>
            <button onClick={() => router.push('/dashboard')} className="ir-btn ir-btn-s">View All History</button>
          </div>

        </main>
      </div>
    </>
  );
}