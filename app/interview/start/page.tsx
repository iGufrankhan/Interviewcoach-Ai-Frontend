'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startInterview, InterviewSession } from '@/lib/interview/interviewApi'; 
import { fetchUserResumes } from '@/lib/resume/resumeApi'; 
import { useAuth } from '@/lib/auth/withProtectedRoute';
import { validateJobDescription } from '@/lib/validators';

interface Resume {
  resume_id: string;
  name: string;
}


export default function StartInterviewPage() {
  const router = useRouter();
  
  
  const { user, isLoading } = useAuth(); 
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingResumes, setFetchingResumes] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setError('');
        
        const response = await fetchUserResumes() as any;
        const finalResumes = response?.data || response || [];
        setResumes(finalResumes);
      

      } catch (err) {
        setError('Failed to load resumes');
      } finally {
        setFetchingResumes(false);
      }
    };

    if (!isLoading && user) {
      loadResumes();
    }
  }, [user, isLoading]);

  if (isLoading || fetchingResumes) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
        </div>
      </>
    );
  }

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }

    const jobDescError = validateJobDescription(jobDescription);
    if (jobDescError) {
      setError(jobDescError);
      return;
    }

    if (!selectedResume) {
      setError('Please select a resume');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const session = await startInterview(jobDescription, selectedResume, jobTitle) as any;
      
      const targetSession = session?.data || session;
      const questionsList = targetSession?.questions || [];
      const id = targetSession?.session_id || targetSession?.id;

      if (!id) {
        setError('Failed to generate interview session identifier.');
        return;
      }

      sessionStorage.setItem(`interview_questions_${id}`, JSON.stringify(questionsList));
      router.push(`/interview/take/${id}`);
      
    } catch (err: any) {
      setError(err.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .si-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        .si-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 50% at 70% 10%, rgba(180,30,30,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 85%, rgba(140,20,20,0.07) 0%, transparent 60%);
        }

        /* NAV */
        .si-nav {
          position: sticky; top: 0; z-index: 100;
          background:  rgba(35,35,35,0.95); backdrop-filter: blur(16px);
          border-bottom: 1px solid #2a2a2a; padding: 0 52px;
        }
        .si-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
          max-width: 100%;   /* remove 900px restriction */
          margin: 0;         /* remove center */
          padding: 0 28px;   /* control spacing */
        }
        
        .si-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #f0f0f0; text-decoration: none; }
        .si-logo em { font-style: normal; color: #c0392b; }
        .si-back {
          font-size: 13px;
          color: #aaa;
          text-decoration: none;
          margin-right: 20px;
          padding: 6px 16px;
          border-radius: 999px; 
          border: 1px solid rgba(255,255,255,0.2);
          background: #1a1a1a;
          transition: all 0.25s ease;
        }

        /* 🔥 Hover effect */
        .si-back:hover {
          color: #fff;
          border-color: #c0392b;
          background: rgba(192,57,43,0.08);
          box-shadow: 0 4px 14px rgba(192,57,43,0.25);
        }

        /* MAIN */
        .si-main {
          position: relative; z-index: 2;
          max-width: 680px; margin: 0 auto;
          padding: 56px 32px 80px;
        }

        /* HEADER */
        .si-header { text-align: center; margin-bottom: 44px; }
        .si-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(192,57,43,0.1); border: 1px solid rgba(192,57,43,0.22);
          border-radius: 20px; padding: 5px 16px; margin-bottom: 20px;
        }
        .si-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #c0392b; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .si-eyebrow span { font-size: 10.5px; letter-spacing: 3px; text-transform: uppercase; color: #c0392b; font-weight: 500; }
        .si-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 6vw, 66px);
          letter-spacing: 2.5px; line-height: 1; color: #f5f5f5; margin-bottom: 12px;
        }
        .si-header h1 span { color: #c0392b; }
        .si-header p { font-size: 14px; color: #666; font-weight: 300; line-height: 1.75; }

        /* FORM CARD */
        .si-card {
          background: #1c1c1c; border: 1px solid #2a2a2a;
          border-radius: 16px; padding: 40px;
          margin-bottom: 16px;
          position: relative; overflow: hidden;
        }
        .si-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, transparent, #c0392b 40%, transparent);
        }

        .si-field { margin-bottom: 22px; }
        .si-field label {
          display: block; font-size: 12px; font-weight: 500;
          color: #aaa; margin-bottom: 9px; letter-spacing: 0.3px;
        }

        .si-input, .si-select, .si-textarea {
          width: 100%; padding: 13px 16px;
          background: #161616; border: 1px solid #2a2a2a;
          border-radius: 8px; color: #f0f0f0;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .si-input::placeholder, .si-textarea::placeholder { color: #383838; }
        .si-input:focus, .si-select:focus, .si-textarea:focus {
          border-color: #c0392b;
          box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
        }
        .si-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; cursor: pointer; }
        .si-select option { background: #1c1c1c; color: #e0e0e0; }
        .si-textarea { resize: none; line-height: 1.7; }

        /* no resume */
        .si-no-resume {
          padding: 14px 16px; background: #161616;
          border: 1px solid #242424; border-radius: 8px;
          font-size: 13.5px; color: #555;
        }
        .si-no-resume a { color: #c0392b; text-decoration: none; font-weight: 500; }
        .si-no-resume a:hover { opacity: 0.8; }

        /* error */
        .si-error {
          display: flex; align-items: flex-start; gap: 9px;
          background: #1e1212; border: 1px solid rgba(192,57,43,0.35);
          border-radius: 10px; padding: 13px 16px; margin-bottom: 20px;
          font-size: 13px; color: #e07070; line-height: 1.5;
        }

        /* submit btn */
        .si-btn {
          width: 100%; padding: 16px; margin-top: 4px;
          background: #8B1E1E; border: none; border-radius: 50px;
          color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 3px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .si-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%); }
        .si-btn:hover:not(:disabled) { background: #d44235; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(192,57,43,0.3); }
        .si-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

        .si-spin {
          width: 18px; height: 18px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
          border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* INSIGHTS — pill/oval shapes only */
       .si-insights {
        background: transparent;   /* box hata diya */
        border: none;              /* border hata diya */
        border-radius: 0;
        padding: 0;                /* spacing reset */
      }
        .si-insights-head {
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
        }
        .si-insights-head .si-ins-icon {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0;
        }
        .si-insights-head p {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 2px; color: #ddd;
        }

        .si-insights-list { display: flex; flex-direction: column; gap: 10px; }
        .si-ins-item {
          display: flex; align-items: flex-start; gap: 10px;
        }
        .si-ins-dot {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: #c0392b; margin-top: 1px;
        }
        .si-ins-item p { font-size: 13px; color: #aaa; font-weight: 300; line-height: 1.65; }

        @media (max-width: 600px) {
          .si-main { padding: 36px 18px 60px; }
          .si-nav { padding: 0 20px; }
          .si-card { padding: 28px 20px; }
          .si-insights { border-radius: 20px; padding: 24px 20px; }
        }
      `}</style>

      <div className="si-root">
        <div className="si-bg" />

        {/* NAV */}
        <nav className="si-nav">
          <div className="si-nav-inner">
            <Link href="/" className="si-logo">Interview<em>Coach</em> AI</Link>
            <Link href="/dashboard" className="si-back">← Back to Dashboard</Link>
          </div>
        </nav>

        <main className="si-main">

          {/* HEADER */}
          <div className="si-header">
            <div className="si-eyebrow">
              <span className="si-eyebrow-dot" />
              <span>New Session</span>
            </div>
            <h1>Start a New <span>Interview.</span></h1>
            <p>Prepare for your interview with AI-powered questions and real-time feedback</p>
          </div>

          {/* FORM CARD */}
          <div className="si-card">
            <form onSubmit={handleStartInterview}>

              <div className="si-field">
                <label>Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior React Developer"
                  className="si-input"
                />
              </div>

              <div className="si-field">
                <label>Select Resume</label>
                {resumes.length > 0 ? (
                  <select
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    className="si-select"
                  >
                    <option value="">Choose a resume...</option>
                    {resumes.map((resume) => (
                      <option key={resume.resume_id} value={resume.resume_id}>{resume.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="si-no-resume">
                    No resumes found. <Link href="/UploadResume">Upload first</Link>
                  </div>
                )}
              </div>

              <div className="si-field">
                <label>Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="si-textarea"
                />
              </div>

              {error && (
                <div className="si-error">
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{flexShrink:0,marginTop:'1px'}}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedResume}
                className="si-btn"
              >
                {loading
                  ? <><span className="si-spin" />Processing...</>
                  : 'Start Interview'
                }
              </button>

            </form>
          </div>

          {/* INSIGHTS — pill shaped container */}
          <div className="si-insights">
            <div className="si-insights-head">
              <div className="si-ins-icon">💡</div>
              <p>Interview Insights</p>
            </div>
            <div className="si-insights-list">
              <div className="si-ins-item">
                <div className="si-ins-dot">•</div>
                <p>Questions are uniquely generated for your resume match.</p>
              </div>
              <div className="si-ins-item">
                <div className="si-ins-dot">•</div>
                <p>Answer clarity and technical depth improve your AI score.</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}