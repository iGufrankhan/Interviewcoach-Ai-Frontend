'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import { validateJobDescription } from '@/lib/validators';

interface Resume {
  resume_id: string;
  name: string;
  email: string;
  skills: string[];
  experience?: string[];
  education?: string[];
  projects?: string[];
  created_at?: string;
}

interface AnalysisResult {
  overallScore: number;
  experienceFit: number;
  skillsMatch: number;
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
  matchCategories?: {
    technical: number;
    experience: number;
    cultural: number;
  };
}

export default function JobMatchingPage() {
   const { user, isLoading: authLoading } = useAuth(); 
  

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      if (!userId) {
        setError('User session not found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/resume/api/user-resumes/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        const fetchedResumes = data.data || data || [];
        setResumes(fetchedResumes);
        if (fetchedResumes.length > 0) {
          setSelectedResume(fetchedResumes[0]);
        }
      } else {
        setError(data.message || 'Failed to load resumes');
      }
    } catch (err) {
      setError('Error loading resumes. Please refresh the page.');
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume) {
      setError('Please select a resume');
      return;
    }

    const jobDescError = validateJobDescription(jobDescription);
    if (jobDescError) {
      setError(jobDescError);
      return;
    }

    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_BASE_URL}/jobmatching/api/analyseresume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          resume_id: selectedResume.resume_id,
          description: jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.detail || 'Analysis failed');
      } else {
        setResult(data.data || data); 
      }
    } catch (err) {
      setError('Failed to analyze. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#facc15';
    return '#f87171';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'linear-gradient(to right, #14532d, #4ade80)';
    if (score >= 60) return 'linear-gradient(to right, #713f12, #facc15)';
    return 'linear-gradient(to right, #7f1d1d, #f87171)';
  };

  if (authLoading) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111', flexDirection:'column', gap:'16px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
          <p style={{ color:'#666', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Verifying access...</p>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .jm-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        .jm-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 75% 10%, rgba(180,30,30,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 85%, rgba(140,20,20,0.07) 0%, transparent 60%);
        }

        /* NAV */
        .jm-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(40,40,40,0.98); backdrop-filter: blur(16px);
          border-bottom: 1px solid #3a3a3a; padding: 0 52px;
        }
        .jm-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .jm-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #f0f0f0; text-decoration: none; }
        .jm-logo em { font-style: normal; color: #c0392b; }
        .jm-nav-links { display: flex; align-items: center; gap: 20px; }
        .jm-nav-link:hover { color: #ddd; }
        .jm-nav-link,.jm-back {
          padding: 8px 18px;
          border-radius: 999px; /* egg shape */
          border: 1px solid #444;
          background: transparent;
          color: #ddd;
          font-size: 13px;
          transition: all 0.25s ease;
        }
        .jm-nav-link:hover,.jm-back:hover {
          border-color: #ef4444; /* yellow border */
          background: rgba(239, 68, 68, 0.1);

          color: #fff;
          transform: translateY(-1px);
        }

        /* MAIN */
        .jm-main {
          position: relative; z-index: 2;
          max-width: 1160px; margin: 0 auto;
          padding: 56px 40px 80px;
        }

        .jm-header { text-align: center; margin-bottom: 52px; }
        .jm-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.22);
          border-radius: 20px; padding: 5px 16px; margin-bottom: 20px;
        }
        .jm-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #c0392b; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .jm-eyebrow span { font-size: 10.5px; letter-spacing: 3px; text-transform: uppercase; color: #c0392b; font-weight: 500; }
        .jm-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 5.5vw, 68px);
          letter-spacing: 2.5px; line-height: 1; color: #f5f5f5; margin-bottom: 14px;
        }
        .jm-header h1 span { color: #c0392b; }
        .jm-header p { font-size: 14.5px; color: #666; font-weight: 300; line-height: 1.75; max-width: 520px; margin: 0 auto; }

        .jm-input-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin-bottom: 20px;
        }

        .jm-step-label {
          font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
          color: #c0392b; font-weight: 600; margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .jm-step-label::before { content: ''; width: 16px; height: 1px; background: #c0392b; }

        .jm-resume-btn {
          background: #1a1a1a; border: 1px solid #facc15; border-radius: 999px;
          padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;
          transition: all 0.25s ease; cursor: pointer; color: white; width: 100%; margin-bottom: 8px;
        }
        .jm-resume-btn.selected { background: linear-gradient(90deg, rgba(250,204,21,0.28), rgba(250,204,21,0.15)); border: 1px solid #facc15; box-shadow: 0 0 14px rgba(250, 204, 21, 0.45); }
        .jm-resume-name { font-size: 13.5px; font-weight: 500; }

        .jm-textarea {
          width: 100%; height: 220px; padding: 14px 16px;
          background: #161616; border: 1px solid #facc15;
          border-radius: 10px; color: #ddd; font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; line-height: 1.75; outline: none; resize: none;
        }

        .jm-analyze-wrap { text-align: center; margin-bottom: 52px; }
        .jm-analyze-btn {
          padding: 17px 48px; background: linear-gradient(135deg, #ef4444, #b91c1c);
          border: none; border-radius: 40px; color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 3px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 12px; transition: 0.25s;
        }
        .jm-analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 35px rgba(185,29,29,0.4); }

        /* ─── NEW RESULTS SECTION ─── */
        .jm-results { margin-top: 40px; animation: fadeUp .6s ease-out forwards; }
        
        /* Side by Side Header: Circle Score & Strengths */
        .jm-results-summary { display: flex; align-items: center; gap: 60px; padding-bottom: 40px; }

        .jm-score-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .jm-score-circle { position: relative; width: 240px; height: 240px; display: flex; align-items: center; justify-content: center; }
        .jm-circle-inner { width: 200px; height: 200px; background: #2a2a2a; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; }
        .jm-revolving-border { position: absolute; inset: 0; border-radius: 50%; border: 4px solid transparent; border-top-color: #facc15; animation: rotateCircle 3s linear infinite; }
        @keyframes rotateCircle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .jm-score-num { font-family: 'Bebas Neue', sans-serif; font-size: 84px; color: #4ade80; }

        .jm-clean-strengths { flex: 1; margin-left: 90px;  }
        .jm-clean-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; color: #fff; margin-bottom: 20px; }
        .jm-clean-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .jm-clean-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14.5px; color: #888; line-height: 1.6; }
        .jm-clean-item b { color: #4ade80; font-size: 18px; }

        /* ─── RESTORING ORIGINAL CARDS FOR IMPROVE & SUGGESTIONS ─── */
        .jm-res-card { background: #181818; border: 1px solid #242424; border-radius: 14px; padding: 28px 30px; position: relative; overflow: hidden; margin-bottom: 14px; }
        .jm-res-card.yellow::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, transparent, #facc15 40%, transparent); }
        .jm-res-head { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .jm-res-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .jm-res-icon.yellow { background: rgba(250,204,21,0.1); border: 1px solid rgba(250,204,21,0.2); }
        .jm-res-card h3 { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1.5px; color: #facc15; }
        .jm-res-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 8px; font-size: 13px; color: #aaa; background: rgba(250,204,21,0.05); border: 1px solid rgba(250,204,21,0.1); margin-bottom: 10px; }

        .jm-suggestions { background: #181818; border: 1px solid #242424; border-radius: 14px; padding: 28px 30px; position: relative; overflow: hidden; }
        .jm-suggestions::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(to right, transparent, #60a5fa 40%, transparent); }
        .jm-sug-head { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .jm-sug-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2); display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .jm-suggestions h3 { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1.5px; color: #60a5fa; }
        .jm-sug-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .jm-sug-item { padding: 14px 16px; background: rgba(96,165,250,0.04); border: 1px solid rgba(96,165,250,0.1); border-radius: 10px; font-size: 13px; color: #aaa; }
        .jm-sug-num { font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 1px; color: #60a5fa; margin-bottom: 6px; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        @media (max-width: 900px) {
          .jm-input-grid { grid-template-columns: 1fr; }
          .jm-results-summary { flex-direction: column; text-align: center; }
          .jm-sug-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="jm-root">
        <div className="jm-bg" />

        {/* NAV */}
        <nav className="jm-nav">
          <div className="jm-nav-inner">
            <Link href="/" className="jm-logo">Interview<em>Coach</em> AI</Link>
            <div className="jm-nav-links">
              <Link href="/getresume" className="jm-nav-link">📂 My Resumes</Link>
              <Link href="/dashboard" className="jm-back">← Back</Link>
            </div>
          </div>
        </nav>

        <main className="jm-main">

          <div className="jm-header">
            <div className="jm-eyebrow">
              <span className="jm-eyebrow-dot" />
              <span>Resume Analysis</span>
            </div>
            <h1>Job Matching <span>Analysis.</span></h1>
            <p>Analyze how your resume matches any job description. Get detailed scoring and identify skill gaps.</p>
          </div>

          <div className="jm-input-grid">
            {/* STEP 1 */}
            <div className="jm-step-card">
              <p className="jm-step-label">Step 1 — Select Resume</p>
              {loadingResumes ? (
                <div className="jm-loading-resumes"><div className="jm-load-spin" /></div>
              ) : (
                <div className="jm-resume-list">
                  {resumes.map((resume) => (
                    <button
                      key={resume.resume_id}
                      onClick={() => setSelectedResume(resume)}
                      className={`jm-resume-btn${selectedResume?.resume_id === resume.resume_id ? ' selected' : ''}`}
                    >
                      <p className="jm-resume-name">📄 {resume.name}</p><span>→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 2 */}
            <div className="jm-step-card">
              <p className="jm-step-label">Step 2 — Paste Job Description</p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="jm-textarea"
              />
            </div>
          </div>

          {error && <div className="jm-error"><p>{error}</p></div>}

          <div className="jm-analyze-wrap">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !selectedResume || !jobDescription.trim()}
              className="jm-analyze-btn"
            >
              {analyzing ? <><div className="jm-a-spin" />Analyzing...</> : 'Analyze Match Now'}
            </button>
          </div>

          {/* RESULTS */}
          {result && (
            <div className="jm-results">
              
              {/* TOP: Score Circle Left + Strengths Right (No Boxes) */}
              <div className="jm-results-summary">
                <div className="jm-score-col">
                  <span style={{fontFamily:'Bebas Neue', letterSpacing:'3px', fontSize:'14px', color:'#aaa'}}> MATCH SCORE</span>
                  <div className="jm-score-circle">
                    <div className="jm-revolving-border"></div>
                    <div className="jm-circle-inner">
                      <div className="jm-score-num">{result.overallScore}%</div>
                    </div>
                  </div>
                </div>

                <div className="jm-clean-strengths">
                  <h2 className="jm-clean-title">✅ Key Strengths</h2>
                  <ul className="jm-clean-list">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="jm-clean-item">
                        <b>✓</b> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* BOTTOM: RESTORED ORIGINAL BOXES */}
              
              {/* Areas to Improve (Original Yellow Box) */}
              <div className="jm-res-card yellow">
                <div className="jm-res-head">
                  <div className="jm-res-icon yellow">⚠️</div>
                  <h3>Areas to Improve</h3>
                </div>
                <div className="jm-res-list">
                  {result.missingSkills.map((s, i) => (
                    <div key={i} className="jm-res-item">
                      <span style={{color:'#facc15'}}>•</span> {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions (Original Blue Box) */}
              <div className="jm-suggestions">
                <div className="jm-sug-head">
                  <div className="jm-sug-icon">💡</div>
                  <h3>Expert Suggestions</h3>
                </div>
                <div className="jm-sug-grid">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="jm-sug-item">
                      <p className="jm-sug-num">Tip {i + 1}</p>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </>
  );
}