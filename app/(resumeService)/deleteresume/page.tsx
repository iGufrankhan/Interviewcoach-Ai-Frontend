'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
 import { fetchUserResumes, deleteResume } from '@/lib/api'; 
import { useAuth } from '@/lib/auth/withProtectedRoute';

interface Resume {
  id: string;
  filename: string;
  created_at: string;
  extracted_data: {
    name: string;
    email: string;
    skills: string[];
  };
}

export default function DeleteResumePage() {
  const router = useRouter();

  // --- MOCK AUTH LOGIC ---
   const { user, isLoading: authLoading } = useAuth(); 
 

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState<Resume | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletedResumes, setDeletedResumes] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading) {
      fetchResumes();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111', flexDirection:'column', gap:'16px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
          <p style={{ color:'#888', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Loading...</p>
        </div>
      </>
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
      const errorMsg = err instanceof Error ? err.message : 'Failed to load resumes.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return;

    setDeleting(true);
    try {
      // --- REAL DELETE CALL ---
      await deleteResume(selectedForDelete.id); 

      setDeletedResumes([...deletedResumes, selectedForDelete.id]);
      setResumes(resumes.filter(r => r.id !== selectedForDelete.id));
      setSelectedForDelete(null);
      setConfirmDelete(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error deleting resume';
      alert(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const activeResumes = resumes.filter(r => !deletedResumes.includes(r.id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dr-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        .dr-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 45% at 70% 10%, rgba(180,30,30,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 85%, rgba(140,20,20,0.07) 0%, transparent 60%);
        }

        /* NAV */
        .dr-nav {
          position: sticky; top: 0; z-index: 100;
          background: #242424; backdrop-filter: blur(16px);
          border-bottom: 1px solid #2a2a2a; padding: 0 52px;
        }
        .dr-nav-inner {
           max-width: 100%; margin: 0;  margin-left: 40px;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .dr-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #f0f0f0; text-decoration: none; }
        .dr-logo em { font-style: normal; color: #c0392b; }
        .dr-nav-links { display: flex; align-items: center; gap: 20px;  margin-left: 0;margin-right: 70px; }
        .dr-back-link { font-size: 13px; color: #e0e0e0; text-decoration: none; transition: color .2s; padding: 8px 20px;
         border: 1px solid rgba(255,255,255,0.4); 
        border-radius: 999px;}
        .dr-back-link:hover { color: #ffffff; border-color: #c0392b; background: rgba(192,57,43,0.08); /* subtle red glow */ }

        /* MAIN */
        .dr-main {
          position: relative; z-index: 2;
          max-width: 720px; margin: 0 auto;
          padding: 56px 32px 80px;
        }

        /* HEADER */
        .dr-header { margin-bottom: 48px; }
        .dr-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: #c0392b; font-weight: 500; margin-bottom: 14px;
        }
        .dr-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #c0392b; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .dr-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 5.5vw, 64px);
          letter-spacing: 2.5px; line-height: 1; color: #f5f5f5; margin-bottom: 10px;
        }
        .dr-header h1 span { color: #c0392b; }
        .dr-header p { font-size: 14px; color: #9a9a9a; font-weight: 300; line-height: 1.75; }

        /* LOADING */
        .dr-loading { text-align: center; padding: 72px 0; }
        .dr-spin {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid rgba(192,57,43,0.2); border-top-color: #c0392b;
          animation: spin .7s linear infinite; margin: 0 auto 14px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dr-loading p { font-size: 13px; color: #555; letter-spacing: 1px; }

        /* ERROR */
        .dr-error {
          display: flex; align-items: flex-start; gap: 10px;
          background: #1e1212; border: 1px solid rgba(192,57,43,0.35);
          border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;
          font-size: 13px; color: #e07070; line-height: 1.5;
        }

        /* EMPTY */
        .dr-empty {
          text-align: center; padding: 72px 40px;
          background: #1c1c1c; border: 1.5px dashed #2a2a2a;
          border-radius: 16px;
        }
        .dr-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
        .dr-empty p { font-size: 15px; color: #666; margin-bottom: 24px; font-weight: 300; }
        .dr-empty-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px; background: #1e1e1e; border: 1px solid #2e2e2e;
          border-radius: 8px; color: #888; font-size: 14px;
          text-decoration: none; transition: border-color .2s, color .2s;
        }
        .dr-empty-btn:hover { border-color: rgba(192,57,43,0.4); color: #ccc; }

        /* RESUME COUNT */
        .dr-count { font-size: 13px; color: #9a9a9a; font-style: italic; margin-bottom: 16px; }

        /* RESUME LIST */
        .dr-list { display: flex; flex-direction: column; gap: 10px; }

        .dr-item {
          display: flex; align-items: center; justify-content: space-between;
          background: #242424; border: 1px solid #2a2a2a;
          border-radius: 16px; padding: 18px 22px;
          transition: border-color .2s;
          position: relative; overflow: hidden;
        }
        .dr-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;

          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 200, 0, 0.7), /* 🔥 yellow tint */
            transparent
          );

          opacity: 1; /* 🔥 always visible */
        }
        .dr-item:hover {
          border-color: rgba(255, 200, 0, 0.6); 
          background: rgba(255, 200, 0, 0.05);  
          box-shadow: 0 6px 20px rgba(255, 200, 0, 0.15); 
        }
    
        .dr-item-info { flex: 1; min-width: 0; }
        .dr-item-name {
          font-size: 14px; font-weight: 500; color: #ccc;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 6px; transition: color .2s;
        }
        .dr-item:hover .dr-item-name { color: #f0f0f0; }
        .dr-item-meta { display: flex; gap: 16px; flex-wrap: wrap; }
        .dr-item-meta span { font-size: 12px; color: #9a9a9a; display: flex; align-items: center; gap: 4px; }

        .dr-del-btn {
          flex-shrink: 0;
          margin-left: 16px;
          padding: 9px 18px;

          background: rgba(192,57,43,0.08); /* 🔥 subtle red bg */
          border: 1px solid rgba(192,57,43,0.5); /* proper red border */
          border-radius: 8px;

          color: #ff4d4d; /* 🔥 clear red text */
          font-size: 12.5px;
          font-weight: 500;

          cursor: pointer;
          transition: all .2s ease;
        }
        .dr-del-btn:hover {
          background: rgba(192,57,43,0.18);
          border-color: #ff2e2e;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(192,57,43,0.35);
        }

        /* SUCCESS TOAST */
        .dr-success-toast {
          margin-top: 20px; padding: 14px 18px;
          background: #0e1e10; border: 1px solid rgba(34,197,94,0.25);
          border-radius: 10px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #4ade80;
        }

        /* CONFIRM MODAL */
        .dr-confirm {
          background: #1c1c1c; border: 1px solid #2e2e2e;
          border-radius: 16px; padding: 36px;
          max-width: 480px; margin: 0 auto;
          position: relative; overflow: hidden;
        }
        .dr-confirm::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, transparent, #c0392b 40%, transparent);
        }

        .dr-confirm h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 2px; color: #f0f0f0; margin-bottom: 20px;
        }

        .dr-confirm-file {
          background: #161616; border: 1px solid #282828;
          border-radius: 10px; padding: 16px 18px; margin-bottom: 20px;
          position: relative; overflow: hidden;
        }
        .dr-confirm-file::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #c0392b;
        }
        .dr-confirm-file p:first-child { font-size: 14px; font-weight: 500; color: #ddd; margin-bottom: 5px; }
        .dr-confirm-file p:last-child { font-size: 12px; color: #555; }

        .dr-confirm-warn {
          font-size: 13px; color: #666; font-weight: 300;
          line-height: 1.7; margin-bottom: 28px;
        }
        .dr-confirm-warn strong { color: #e07070; font-weight: 500; }

        .dr-confirm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .dr-cancel-btn {
          padding: 13px; background: #1a1a1a; border: 1px solid #2a2a2a;
          border-radius: 8px; color: #777;
          font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px;
          cursor: pointer; transition: background .2s, color .2s;
        }
        .dr-cancel-btn:hover:not(:disabled) { background: #222; color: #ccc; }
        .dr-cancel-btn:disabled { opacity: .4; cursor: not-allowed; }

        .dr-confirm-del-btn {
          padding: 13px; background: #c0392b; border: none;
          border-radius: 8px; color: #fff;
          font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          position: relative; overflow: hidden;
          transition: background .2s, box-shadow .2s;
        }
        .dr-confirm-del-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%); }
        .dr-confirm-del-btn:hover:not(:disabled) { background: #d44235; box-shadow: 0 6px 18px rgba(192,57,43,0.3); }
        .dr-confirm-del-btn:disabled { opacity: .45; cursor: not-allowed; }

        .dr-del-spin {
          width: 15px; height: 15px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
          border-radius: 50%; animation: spin .7s linear infinite;
        }

        /* BOTTOM BACK */
        .dr-bottom { margin-top: 40px; text-align: center; }
        .dr-bottom-link {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.35);
          border-radius: 20px; color: #e5e5e5; font-size: 13.5px;
          text-decoration: none; transition: border-color .2s, color .2s;
        }
        .dr-bottom-link:hover {
  color: #fff;
  border-color: #c0392b; /* 🔥 red */
  background: rgba(192, 57, 43, 0.1); /* subtle red tint */
  box-shadow: 0 4px 14px rgba(192, 57, 43, 0.25); /* red glow */
  transform: translateY(-1px);
}
        @media (max-width: 600px) {
          .dr-main { padding: 36px 18px 60px; }
          .dr-nav { padding: 0 20px; }
          .dr-confirm { padding: 28px 18px; }
          .dr-confirm-actions { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dr-root">
        <div className="dr-bg" />

        {/* NAV */}
        <nav className="dr-nav">
          <div className="dr-nav-inner">
            <Link href="/" className="dr-logo">Interview<em>Coach</em> AI</Link>
            <div className="dr-nav-links">
              <Link href="/dashboard" className="dr-back-link">← Back to Dashboard</Link>
            </div>
          </div>
        </nav>

        <main className="dr-main">

          {/* HEADER */}
          <div className="dr-header">
            <div className="dr-eyebrow">
              <span className="dr-eyebrow-dot" /> Manage Resumes
            </div>
            <h1>Delete <span>Resumes.</span></h1>
            <p>Manage and delete your resume files.</p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="dr-loading">
              <div className="dr-spin" />
              <p>Loading your resumes...</p>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="dr-error">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{flexShrink:0,marginTop:'1px'}}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {/* EMPTY */}
          {!loading && activeResumes.length === 0 && !selectedForDelete && (
            <div className="dr-empty">
              <div className="dr-empty-icon">✨</div>
              <p>No resumes to delete. Your collection is clean!</p>
              <Link href="/GetResume" className="dr-empty-btn">View All Resumes →</Link>
            </div>
          )}

          {/* LIST */}
          {!loading && activeResumes.length > 0 && (
            <div>
              {confirmDelete && selectedForDelete ? (

                /* CONFIRM MODAL */
                <div className="dr-confirm">
                  <h2>⚠️ Confirm Deletion</h2>

                  <div className="dr-confirm-file">
                    <p>{selectedForDelete.filename}</p>
                    {selectedForDelete.extracted_data.name && (
                      <p>👤 {selectedForDelete.extracted_data.name}</p>
                    )}
                  </div>

                  <p className="dr-confirm-warn">
                    This action <strong>cannot be undone.</strong> Are you sure you want to delete this resume?
                  </p>

                  <div className="dr-confirm-actions">
                    <button
                      onClick={() => { setConfirmDelete(false); setSelectedForDelete(null); }}
                      disabled={deleting}
                      className="dr-cancel-btn"
                    >
                      ✕ Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={deleting}
                      className="dr-confirm-del-btn"
                    >
                      {deleting
                        ? <><span className="dr-del-spin" />Deleting...</>
                        : '🗑️ Delete'
                      }
                    </button>
                  </div>
                </div>

              ) : (

                /* RESUME LIST */
                <div>
                  <p className="dr-count">
                    Showing {activeResumes.length} available resume{activeResumes.length !== 1 ? 's' : ''}
                  </p>

                  <div className="dr-list">
                    {activeResumes.map((resume) => (
                      <div key={resume.id} className="dr-item">
                        <div className="dr-item-info">
                          <p className="dr-item-name">{resume.filename}</p>
                          <div className="dr-item-meta">
                            {resume.extracted_data.name && (
                              <span>👤 {resume.extracted_data.name}</span>
                            )}
                            <span>📅 {new Date(resume.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedForDelete(resume); setConfirmDelete(true); }}
                          className="dr-del-btn"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {deletedResumes.length > 0 && (
                    <div className="dr-success-toast">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      ✅ Successfully removed from your list.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* BOTTOM BACK */}
          <div className="dr-bottom">
            <Link href="/getresume" className="dr-bottom-link">← Back to Resumes</Link>
          </div>

        </main>
      </div>
    </>
  );
}