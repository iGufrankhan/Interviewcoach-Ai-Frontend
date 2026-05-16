'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { uploadResume } from '@/lib/api'; 
import { useAuth } from '@/lib/auth/withProtectedRoute';
import { validateResumeFile } from '@/lib/validators';

interface UploadResponse {
  message: string;
  data?: {
    resume_id: string;
    user_id: string;
    filename: string;
    extracted_data: {
      name: string;
      email: string;
      phone: string;
      skills: string[];
      experience: string[];
      education: string[];
    };
  };
  error_code?: string;
}

export default function UploadResumePage() {
  const router = useRouter();
  
  const { user, isLoading } = useAuth(); 
  
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  if (isLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111', flexDirection:'column', gap:'16px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(185,29,29,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#888', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Loading...</p>
      </div>
    );
  }

  const allowedExtensions = ['.pdf', '.docx', '.txt'];

  const validateFile = (selectedFile: File): boolean => {
    const error = validateResumeFile(selectedFile);
    if (error) {
      setError(error);
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    setError('');
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first'); return; }
    setUploading(true);
    setError('');
    try {
      
      const response = await uploadResume(file) as any;
      
      if (response && (response.data || response.resume_id)) {
        setUploadResponse({
          message: response.message || 'Resume uploaded successfully!',
          data: response.data || response
        });
        setFile(null);
        setFileName('');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload resume. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const fileIcon = fileName.endsWith('.pdf') ? '📕' : fileName.endsWith('.docx') ? '📗' : '📄';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ur-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        /* subtle red radial — not grid */
        .ur-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 70% 20%, rgba(180,30,30,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(140,20,20,0.08) 0%, transparent 60%);
        }

        /* NAV */
        .ur-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(28,28,28,0.9);  /* lighter gray */
          backdrop-filter: blur(16px);
           border-bottom: 1px solid #2a2a2a;
          padding: 0 52px;
        }
        .ur-nav-inner {
          max-width: 100%; margin: 0; padding: 0 20px;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .ur-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #e0e0e0;; text-decoration: none; }
        .ur-logo em { font-style: normal; color: #c0392b; }
        .ur-nav-links { display: flex; align-items: center; gap: 24px; margin-right: 20px; }
        .ur-back { font-size: 13px; color: #ccc; text-decoration: none; transition: color .2s;padding: 6px 14px;              /* 👈 ADD */
          border: 1px solid #3a3a3a; border-radius: 20px;  }
        .ur-back:hover {color: #fff;border-color: #c0392b;background: rgba(192,57,43,0.08);}

        /* MAIN */
        .ur-main {
          position: relative; z-index: 2;
          max-width: 680px; margin: 0 auto;
          padding: 56px 32px 80px;
        }

        /* HEADER */
        .ur-header { margin-bottom: 44px; }
        .ur-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          color: #c0392b; font-weight: 500; margin-bottom: 14px;
        }
        .ur-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #c0392b; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .ur-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 6vw, 66px);
          letter-spacing: 2px; line-height: 1; color: #f5f5f5; margin-bottom: 12px;
        }
        .ur-header h1 span { color: #c0392b; }
        .ur-header p { font-size: 14px; color: #777; font-weight: 300; line-height: 1.75; }

        /* MAIN UPLOAD CARD — visible gray */
        .ur-card {
          background: #1c1c1c;
          border: 1px solid #2e2e2e;
          border-radius: 16px;
          padding: 36px;
          margin-bottom: 16px;
        }

        /* DROP ZONE */
        .ur-dropzone {
          border: 1.5px dashed #333;
          border-radius: 12px; padding: 44px 28px;
          text-align: center; cursor: pointer;
          background: #161616;
          transition: border-color .2s, background .2s;
        }
        .ur-dropzone:hover { border-color: #555; background: #1a1a1a; }
        .ur-dropzone.active { border-color: #c0392b; background: rgba(192,57,43,0.06); }

        .ur-drop-icon {
          width: 68px; height: 68px; border-radius: 50%;
          background: linear-gradient(135deg, #331818, #1e1e1e);;
          border: 1px solid #3a2020;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin: 0 auto 18px;
          box-shadow:
              0 0 30px rgba(192,57,43,0.25),   /* glow increase */
              0 0 60px rgba(192,57,43,0.12); 
        }
        .ur-dropzone.active .ur-drop-icon {
          background: linear-gradient(135deg, #3a1a1a, #2a1414);
          border-color: rgba(192,57,43,0.4);
          box-shadow: 0 0 32px rgba(192,57,43,0.3);
        }

        .ur-drop-title { font-size: 16px; font-weight: 600; color: #d0d0d0; margin-bottom: 6px; }
        .ur-drop-sub { font-size: 13px; color: #666; margin-bottom: 20px; }

        .ur-format-pills { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ur-pill {
          padding: 4px 14px; border-radius: 20px;
          background: #222; border: 1px solid #333;
          font-size: 10.5px; color: #777; letter-spacing: 1px; text-transform: uppercase;
          transition: border-color .2s, color .2s;
        }
        .ur-dropzone.active .ur-pill { border-color: rgba(192,57,43,0.3); color: #c0392b; }

        /* FILE PREVIEW */
        .ur-file-preview {
          margin-top: 20px;
          display: flex; align-items: center; gap: 14px;
          background: #242424; border: 1px solid #333;
          border-radius: 10px; padding: 14px 18px;
          position: relative; overflow: hidden;
        }
        .ur-file-preview::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: #c0392b;
        }
        .ur-file-icon { font-size: 26px; flex-shrink: 0; }
        .ur-file-info { flex: 1; min-width: 0; }
        .ur-file-name { font-size: 14px; font-weight: 500; color: #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ur-file-size { font-size: 11.5px; color: #666; margin-top: 2px; }
        .ur-file-badge {
          padding: 4px 12px; background: rgba(192,57,43,0.15); border: 1px solid rgba(192,57,43,0.3);
          border-radius: 20px; font-size: 10px; letter-spacing: 1.5px;
          text-transform: uppercase; color: #e05555; flex-shrink: 0;
        }

        /* UPLOAD BTN */
        .ur-btn {
          width: 100%; padding: 16px; margin-top: 24px;
          background: #c0392b; border: none; border-radius: 10px;
          color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 3px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .ur-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%); }
        .ur-btn:hover:not(:disabled) { background: #d44235; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(192,57,43,0.35); }
        .ur-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; background: #3a3a3a; }

        .ur-spin { width: 18px; height: 18px; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* PROGRESS BAR */
        .ur-progress { height: 3px; background: #2a2a2a; border-radius: 3px; margin-top: 14px; overflow: hidden; }
        .ur-progress-bar {
          height: 100%;
          background: linear-gradient(to right, #8b1414, #c0392b, #e05555);
          border-radius: 3px;
          animation: prog 1.6s ease-in-out infinite;
        }
        @keyframes prog { 0%{width:0;margin-left:0} 50%{width:60%;margin-left:20%} 100%{width:0;margin-left:100%} }

        /* ERROR */
        .ur-error {
          display: flex; align-items: flex-start; gap: 10px;
          background: #1e1212; border: 1px solid rgba(192,57,43,0.35);
          border-radius: 10px; padding: 14px 16px;
          margin-bottom: 16px; font-size: 13px; color: #e07070; line-height: 1.5;
        }

        /* SUCCESS */
        .ur-success {
          background: #1c1c1c; border: 1px solid #2e2e2e;
          border-radius: 16px; padding: 36px;
        }
        .ur-success-head { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
        .ur-success-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: #1a2a1a; border: 1px solid #2a4a2a;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .ur-success-head h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; letter-spacing: 1.5px; color: #f0f0f0;
        }

        /* extracted */
        .ur-extracted {
          background: #222; border: 1px solid #333;
          border-radius: 10px; overflow: hidden;
          margin-bottom: 24px;
        }
        .ur-ext-row {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 14px 20px; border-bottom: 1px solid #2a2a2a;
        }
        .ur-ext-row:last-child { border-bottom: none; }
        .ur-ext-label {
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: #c0392b; font-weight: 600; width: 56px; flex-shrink: 0; padding-top: 2px;
        }
        .ur-ext-val { font-size: 13.5px; color: #bbb; line-height: 1.5; }
        .ur-skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .ur-skill-tag {
          padding: 3px 12px; background: #2a1e1e; border: 1px solid rgba(192,57,43,0.3);
          border-radius: 20px; font-size: 11px; color: #e07070;
        }

        .ur-view-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; background: #242424;
          border: 1px solid #333; border-radius: 8px;
          color: #aaa; font-size: 14px; text-decoration: none;
          transition: border-color .2s, color .2s, background .2s;
        }
        .ur-view-btn:hover { border-color: #c0392b; color: #e0e0e0; background: #2a2020; }

        @media (max-width: 600px) {
          .ur-main { padding: 36px 18px 60px; }
          .ur-nav { padding: 0 20px; }
          .ur-card, .ur-success { padding: 24px 18px; }
        }
      `}</style>

      <div className="ur-root">
        <div className="ur-bg" />

        {/* NAV */}
        <nav className="ur-nav">
          <div className="ur-nav-inner">
            <Link href="/" className="ur-logo">Interview<em>Coach</em> AI</Link>
            <div className="ur-nav-links">
              <Link href="/getresume" className="ur-back">📂 My Resumes</Link>
              <Link href="/dashboard" className="ur-back">← Back</Link>
            </div>
          </div>
        </nav>

        <main className="ur-main">

          {/* HEADER */}
          <div className="ur-header">
            <div className="ur-eyebrow">
              <span className="ur-eyebrow-dot" /> Resume Upload
            </div>
            <h1>Upload Your <span>Resume.</span></h1>
            <p>Upload your resume to extract information and prepare for job matching analysis.</p>
          </div>

          {/* UPLOAD CARD */}
          <div className="ur-card">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`ur-dropzone${dragActive ? ' active' : ''}`}
            >
              <label htmlFor="file-input" style={{ cursor:'pointer', display:'block' }}>
                <div className="ur-drop-icon">📎</div>
                <p className="ur-drop-title">Drop your resume here</p>
                <p className="ur-drop-sub">or click to browse files</p>
                <div className="ur-format-pills">
                  <span className="ur-pill">PDF</span>
                  <span className="ur-pill">DOCX</span>
                  <span className="ur-pill">TXT</span>
                  <span className="ur-pill">Max 10MB</span>
                </div>
                <input
                  id="file-input" type="file" accept=".pdf,.docx,.txt"
                  onChange={handleFileChange} style={{ display:'none' }} disabled={uploading}
                />
              </label>
            </div>

            {fileName && (
              <div className="ur-file-preview">
                <span className="ur-file-icon">{fileIcon}</span>
                <div className="ur-file-info">
                  <p className="ur-file-name">{fileName}</p>
                  <p className="ur-file-size">{file && `${(file.size / 1024).toFixed(2)} KB`}</p>
                </div>
                <span className="ur-file-badge">Ready</span>
              </div>
            )}

            <button onClick={handleUpload} disabled={!file || uploading} className="ur-btn">
              {uploading ? <><span className="ur-spin" />Uploading...</> : 'Upload Resume'}
            </button>

            {uploading && <div className="ur-progress"><div className="ur-progress-bar" /></div>}
          </div>

          {/* ERROR */}
          {error && (
            <div className="ur-error">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{flexShrink:0,marginTop:'1px'}}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {uploadResponse && (
            <div className="ur-success">
              <div className="ur-success-head">
                <div className="ur-success-icon">✅</div>
                <h2>Resume Uploaded!</h2>
              </div>
              {uploadResponse.data?.extracted_data && (
                <div className="ur-extracted">
                  {uploadResponse.data.extracted_data.name && (
                    <div className="ur-ext-row">
                      <span className="ur-ext-label">Name</span>
                      <span className="ur-ext-val">{uploadResponse.data.extracted_data.name}</span>
                    </div>
                  )}
                  {uploadResponse.data.extracted_data.email && (
                    <div className="ur-ext-row">
                      <span className="ur-ext-label">Email</span>
                      <span className="ur-ext-val">{uploadResponse.data.extracted_data.email}</span>
                    </div>
                  )}
                  {uploadResponse.data.extracted_data.skills.length > 0 && (
                    <div className="ur-ext-row">
                      <span className="ur-ext-label">Skills</span>
                      <div className="ur-skills">
                        {uploadResponse.data.extracted_data.skills.map((s, i) => (
                          <span key={i} className="ur-skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Link href="/GetResume" className="ur-view-btn">View All Resumes →</Link>
            </div>
          )}

        </main>
      </div>
    </>
  );
}