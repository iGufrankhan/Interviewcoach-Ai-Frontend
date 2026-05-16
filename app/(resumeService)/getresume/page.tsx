'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUserResumes, deleteResume } from '@/lib/api'; 
import { useAuth } from '@/lib/auth/withProtectedRoute';

interface Resume {
  resume_id: string;
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects?: string[];
  created_at: string;
}

export default function GetResumePage() {
  const router = useRouter();

  const { user, isLoading: authLoading } = useAuth(); 
 
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchResumes();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111', flexDirection:'column', gap:'16px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#888', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Loading...</p>
      </div>
    );
  }

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchUserResumes() as any;
      const finalResumes = response?.data || response || [];
      setResumes(finalResumes);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load resumes. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      // --- REAL DELETE CALL ---
      await deleteResume(resumeId); 
      setResumes(resumes.filter(r => r.id !== resumeId && r.resume_id !== resumeId));
      if (selectedResume?.id === resumeId || selectedResume?.resume_id === resumeId) {
        setSelectedResume(null);
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete resume';
      alert(errorMsg);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .gr-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        .gr-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 75% 15%, rgba(180,30,30,0.11) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 85%, rgba(140,20,20,0.07) 0%, transparent 60%);
        }

        /* NAV */
        .gr-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(22,22,22,0.95); backdrop-filter: blur(16px);
          border-bottom: 1px solid #2a2a2a; padding: 0 52px;
        }
        .gr-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .gr-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #f0f0f0; text-decoration: none; }
        .gr-logo em { font-style: normal; color: #c0392b; }
        .gr-nav-links { display: flex; align-items: center; gap: 20px; }
        .gr-back { font-size: 15px; color: #aaa; text-decoration: none; transition: color .2s;padding: 6px 14px;   border: 1px solid #3a3a3a;      /* 👈 border */
            border-radius: 20px;  }
        .gr-back:hover {color: #fff;border-color: #c0392b;background: rgba(192,57,43,0.08);}

        /* MAIN */
        .gr-main {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto;
          padding: 56px 40px 80px;
        }

        /* HEADER */
        .gr-header { margin-bottom: 48px; }
        .gr-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: #c0392b; font-weight: 500; margin-bottom: 14px;
        }
        .gr-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #c0392b; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .gr-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 5.5vw, 64px);
          letter-spacing: 2px; line-height: 1; color: #f5f5f5; margin-bottom: 12px;
        }
        .gr-header h1 span { color: #c0392b; }
        .gr-header p { font-size: 14px; color: #777; font-weight: 300; line-height: 1.75; }

        /* LOADING */
        .gr-loading { text-align: center; padding: 80px 0; }
        .gr-spin {
          width: 40px; height: 40px; border-radius: 50%;
          border: 2px solid rgba(192,57,43,0.2); border-top-color: #c0392b;
          animation: spin .7s linear infinite; margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .gr-loading p { font-size: 13px; color: #666; letter-spacing: 1px; }

        /* ERROR */
        .gr-error {
          display: flex; align-items: flex-start; gap: 10px;
          background: #1e1212; border: 1px solid rgba(192,57,43,0.35);
          border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;
          font-size: 13px; color: #e07070; line-height: 1.5;
        }

        /* EMPTY STATE */
        .gr-empty {
          text-align: center; padding: 80px 40px;
          background: #1c1c1c; border: 1.5px dashed #2e2e2e;
          border-radius: 16px;
        }
        .gr-empty-icon { font-size: 56px; margin-bottom: 20px; opacity: 0.5; }
        .gr-empty p { font-size: 15px; color: #777; margin-bottom: 28px; font-weight: 300; }
        .gr-empty-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; background: #c0392b; border: none;
          border-radius: 8px; color: #fff;
          font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 2px;
          text-decoration: none; transition: background .2s, box-shadow .2s;
        }
        .gr-empty-btn:hover { background: #d44235; box-shadow: 0 8px 20px rgba(192,57,43,0.3); }

        /* LAYOUT */
        .gr-layout { display: grid; grid-template-columns: 340px 1fr; gap: 20px; align-items: start; }

        /* LIST PANEL */
        .gr-panel-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 3px; text-transform: uppercase;
          color: #c0392b; margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .gr-panel-label span { color: #444; font-size: 13px; }

        .gr-list { display: flex; flex-direction: column; gap: 8px; }

        .gr-resume-btn {
          width: 100%; text-align: left;
          background: #1c1c1c; border: 1px solid #2a2a2a;
          border-radius: 10px; padding: 16px 18px;
          cursor: pointer; transition: border-color .2s, background .2s;
          position: relative; overflow: hidden;
        }
        .gr-resume-btn::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #c0392b; opacity: 0; transition: opacity .2s;
        }
        .gr-resume-btn:hover { border-color: #3a3a3a; background: #222; }
        .gr-resume-btn:hover::before { opacity: 1; }
        .gr-resume-btn.active { border-color: rgba(192,57,43,0.4); background: #211818; }
        .gr-resume-btn.active::before { opacity: 1; }

        .gr-resume-name { font-size: 13.5px; font-weight: 500; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px; }
        .gr-resume-date { font-size: 11px; color: #555; letter-spacing: 0.5px; }

        /* DETAIL PANEL */
        .gr-detail {
          background: #1c1c1c; border: 1px solid #2a2a2a;
          border-radius: 14px; padding: 32px 36px;
          position: sticky; top: 84px;
          position: relative; overflow: hidden;
        }
        .gr-detail::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, transparent, #facc15  40%, transparent);
        }

        .gr-detail-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 1.5px; color: #f0f0f0;
          margin-bottom: 6px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .gr-detail-sub { font-size: 11.5px; color: #555; margin-bottom: 28px; letter-spacing: 0.5px; }

        .gr-section { margin-bottom: 24px; }
        .gr-section-label {
          font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
          color: #facc15; font-weight: 600; margin-bottom: 10px;
        }

        .gr-skills { display: flex; flex-wrap: wrap; gap: 7px; }
        .gr-skill {
          padding: 4px 13px; background: rgba(250, 204, 21, 0.12); border: 1px solid rgba(250, 204, 21, 0.35);
          border-radius: 20px; font-size: 11.5px; color: #facc15;
        }

        .gr-list-items { display: flex; flex-direction: column; gap: 7px; }
        .gr-list-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: #999; font-weight: 300; line-height: 1.5;
        }
        .gr-list-item::before { content: '—'; color: #444; flex-shrink: 0; }

        .gr-divider { height: 1px; background: #242424; margin: 20px 0; }

        /* ACTIONS */
        .gr-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 28px; }

        .gr-action-match {
          padding: 13px; background: #c0392b; border: none; border-radius: 8px;
          color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 2px; cursor: pointer;
          text-decoration: none; text-align: center;
          transition: background .2s, box-shadow .2s;
          position: relative; overflow: hidden;
        }
        .gr-action-match::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%); }
        .gr-action-match:hover { background: #d44235; box-shadow: 0 6px 18px rgba(192,57,43,0.3); }

        .gr-action-del {
          padding: 13px; background: transparent;
          border: 1px solid #3a2020; border-radius: 8px;
          color: #994040; font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 2px; cursor: pointer;
          transition: background .2s, border-color .2s, color .2s;
        }
        .gr-action-del:hover { background: rgba(192,57,43,0.12); border-color: #c0392b; color: #e07070; }

        /* EMPTY DETAIL */
        .gr-detail-empty {
          background: #181818; border: 1.5px dashed #272727;
          border-radius: 14px; padding: 60px 32px;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 300px;
        }
        .gr-detail-empty-icon { font-size: 36px; margin-bottom: 14px; opacity: 0.3; }
        .gr-detail-empty p { font-size: 13px; color: #444; font-style: italic; }

        @media (max-width: 900px) {
          .gr-layout { grid-template-columns: 1fr; }
          .gr-main { padding: 40px 20px 60px; }
          .gr-nav { padding: 0 20px; }
        }
      `}</style>

      <div className="gr-root">
        <div className="gr-bg" />

        {/* NAV */}
        <nav className="gr-nav">
          <div className="gr-nav-inner">
            <Link href="/" className="gr-logo">Interview<em>Coach</em> AI</Link>
            <div className="gr-nav-links">
              <Link href="/uploadresume" className="gr-back">➕ Upload resume</Link>
              <Link href="/deleteresume" className="gr-back">🗑️ Delete resume</Link>
              <Link href="/dashboard" className="gr-back">← Back to Dashboard</Link>
            </div>
          </div>
        </nav>

        <main className="gr-main">

          {/* HEADER */}
          <div className="gr-header">
            <div className="gr-eyebrow">
              <span className="gr-eyebrow-dot" /> Resume Library
            </div>
            <h1>My <span>Resumes.</span></h1>
            <p>View, manage, and use your uploaded resumes for job matching.</p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="gr-loading">
              <div className="gr-spin" />
              <p>Loading your resumes...</p>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="gr-error">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{flexShrink:0,marginTop:'1px'}}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* EMPTY */}
          {!loading && resumes.length === 0 && (
            <div className="gr-empty">
              <div className="gr-empty-icon">📭</div>
              <p>You haven't uploaded any resumes yet.</p>
              <Link href="/UploadResume" className="gr-empty-btn">Upload Your First Resume →</Link>
            </div>
          )}

          {/* LIST + DETAIL */}
          {!loading && resumes.length > 0 && (
            <div className="gr-layout">

              {/* LEFT — list */}
              <div>
                <p className="gr-panel-label">
                  Your Resumes <span>({resumes.length})</span>
                </p>
                <div className="gr-list">
                  {resumes.map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => setSelectedResume(resume)}
                      className={`gr-resume-btn${selectedResume?.id === resume.id ? ' active' : ''}`}
                    >
                      <p className="gr-resume-name">📄 {resume.name}</p>
                      <p className="gr-resume-date">{new Date(resume.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT — detail */}
              <div>
                {selectedResume ? (
                  <div className="gr-detail">
                    <p className="gr-detail-title">{selectedResume.name}</p>
                    <p className="gr-detail-sub">{selectedResume.email} · {new Date(selectedResume.created_at).toLocaleDateString()}</p>

                    {/* Skills */}
                    <div className="gr-section">
                      <p className="gr-section-label">Skills</p>
                      <div className="gr-skills">
                        {selectedResume.skills.map((s, i) => (
                          <span key={i} className="gr-skill">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="gr-divider" />

                    {/* Experience */}
                    {selectedResume.experience.length > 0 && (
                      <div className="gr-section">
                        <p className="gr-section-label">Experience</p>
                        <div className="gr-list-items">
                          {selectedResume.experience.map((e, i) => (
                            <p key={i} className="gr-list-item">{e}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {selectedResume.education.length > 0 && (
                      <div className="gr-section">
                        <p className="gr-section-label">Education</p>
                        <div className="gr-list-items">
                          {selectedResume.education.map((e, i) => (
                            <p key={i} className="gr-list-item">{e}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {selectedResume.projects && selectedResume.projects.length > 0 && (
                      <div className="gr-section">
                        <p className="gr-section-label">Projects</p>
                        <div className="gr-list-items">
                          {selectedResume.projects.map((p, i) => (
                            <p key={i} className="gr-list-item">{p}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="gr-actions">
                      <Link href="/AnalysisResume" className="gr-action-match">Match Job</Link>
                      <button onClick={() => handleDelete(selectedResume.id)} className="gr-action-del">Delete</button>
                    </div>
                  </div>
                ) : (
                  <div className="gr-detail-empty">
                    <div className="gr-detail-empty-icon">📋</div>
                    <p>Select a resume to view details</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>
    </>
  );
}