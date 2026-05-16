'use client';

import { useRouter } from 'next/navigation';

export default function DocumentationPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .doc-root {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: #080808;
          color: #e0e0e0;
          position: relative;
          overflow-x: hidden;
        }

        .doc-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(185,29,29,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(185,29,29,0.07) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .doc-glow {
          position: fixed; z-index: 0; pointer-events: none;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(185,29,29,0.16) 0%, rgba(185,29,29,0.06) 40%, transparent 65%);
          top: 30%; left: 50%;
          transform: translate(-50%, -50%);
        }

        .doc-inner {
          position: relative; z-index: 2;
          max-width: 900px; margin: 0 auto;
          padding: 48px 40px 80px;
        }

        /* back */
        .doc-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        background: transparent;
        border: 2px solid #ff3b3b;   /* 🔴 red border */
        border-radius: 8px;

        color: #ff3b3b;              /* text bhi red */
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        padding: 9px 18px;

        cursor: pointer;
        margin-bottom: 52px;

       transition: all 0.3s ease;
     }

      /* hover effect (neon glow) */
          .doc-back:hover {
          color: #fff;
          border-color: #ff0000;

          box-shadow: 
            0 0 5px #ff0000,
            0 0 10px #ff0000,
            0 0 20px #ff0000;   /* 🔥 neon glow */
        }

        /* header */
        .doc-header { margin-bottom: 60px; }
        .doc-header-deco { display: flex; align-items: center; margin-bottom: 20px; }
        .doc-vline { width: 3px; height: 36px; background: #b91d1d; border-radius: 2px; }
        .doc-hline { height: 2px; width: 56px; background: linear-gradient(to right, #b91d1d, transparent); }
        .doc-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 6vw, 68px);
          letter-spacing: 3px; line-height: 1;
          color: #fff; margin-bottom: 14px;
        }
        .doc-header h1 em { font-style: normal; color: #b91d1d; }
        .doc-header p { font-size: 15px; color: #555; font-weight: 300; line-height: 1.7; max-width: 500px; }

        /* ── CARD TRACK ── */
        .doc-track {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* even cards shift right, odd shift left */
        .doc-card {
          width: 88%;
          background: #1c1c1c;
          border: 1px solid #1f1f1f;
          border-radius: 14px;
          padding: 32px 36px;
          position: relative;
          overflow: hidden;
          transition: border-color .25s, transform .25s;
        }
        .doc-card:hover {
          border-color: rgba(185,29,29,0.35);
          transform: translateY(-2px);
        }

        /* odd = left, even = right */
        .doc-card.left  { align-self: flex-start; margin-left: 0; }
        .doc-card.right { align-self: flex-end;   margin-right: 0; }

        /* subtle top gradient accent per card */
        .doc-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(185,29,29,0.4), transparent);
        }

        /* left red side bar */
        .doc-card::before {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: linear-gradient(to bottom, transparent, #b91d1d, transparent);
          border-radius: 0 2px 2px 0;
        }
        .doc-card.right::before {
          left: auto; right: 0;
          border-radius: 2px 0 0 2px;
        }

        .doc-card-head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 18px;
        }
        .doc-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: rgba(185,29,29,0.1);
          border: 1px solid rgba(185,29,29,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 19px; flex-shrink: 0;
        }
        .doc-card-head h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px; letter-spacing: 1.5px; color: #fff;
        }

        .doc-card p {
          font-size: 13.5px; color: #ccc;
          font-weight: 300; line-height: 1.75; margin-bottom: 10px;
        }
        .doc-card p:last-child { margin-bottom: 0; }
        .doc-label { font-size: 12px; font-weight: 600; color: #b91d1d; letter-spacing: 0.5px; }

        /* tech grid */
        .doc-tech-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-top: 6px;
        }
        .doc-tech-item {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          border-radius: 8px; padding: 14px 16px;
        }
        .doc-tech-key {
          font-size: 10px; letter-spacing: 2px;
          text-transform: uppercase; color: #ccc;
          font-weight: 600; margin-bottom: 5px;
        }
        .doc-tech-item p { font-size: 12.5px; color: #aaa; margin-bottom: 0; }

        /* security list */
        .doc-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
        .doc-list li {
          font-size: 13.5px; color: #ccc;
          display: flex; align-items: center; gap: 10px; font-weight: 300;
        }
        .doc-list li::before {
          content: ''; width: 5px; height: 5px; border-radius: 50%;
          background: #b91d1d; flex-shrink: 0;
        }

        /* perf grid */
        .doc-perf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 6px; }
        .doc-perf-box {
          background: #0d0d0d; border: 1px solid #1a1a1a;
          border-radius: 8px; padding: 16px 18px;
        }
        .doc-perf-title {
          font-size: 10px; letter-spacing: 2px;
          text-transform: uppercase; color: #ccc;
          font-weight: 600; margin-bottom: 12px;
        }
        .doc-perf-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }
        .doc-perf-row:last-child { margin-bottom: 0; }
        .doc-perf-row span:first-child { font-size: 13px; color: #aaa; font-weight: 300; }
        .doc-perf-row span:last-child  { font-size: 13px; color: #aaa; font-weight: 500; }

        /* footer */
        .doc-footer {
          margin-top: 64px; padding-top: 28px;
          border-top: 1px solid #141414;
          display: flex; align-items: center; justify-content: space-between;
        }
        .doc-footer-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 3px; color: #282828;
        }
        .doc-footer-brand em { font-style: normal; color: #b91d1d; opacity: 0.5; }
        .doc-footer p { font-size: 12px; color: #2a2a2a; }

        @media (max-width: 640px) {
          .doc-inner { padding: 36px 20px 60px; }
          .doc-card { width: 100%; }
          .doc-card.right { align-self: flex-start; }
          .doc-tech-grid, .doc-perf-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="doc-root">
        <div className="doc-grid" />
        <div className="doc-glow" />

        <div className="doc-inner">
          <button className="doc-back" onClick={() => router.back()}>← Back</button>

          <div className="doc-header">
            <div className="doc-header-deco">
              <div className="doc-vline" /><div className="doc-hline" />
            </div>
            <h1>Interview<em>Coach</em> AI</h1>
            <p>AI-powered interview preparation platform using LLM technology</p>
          </div>

          <div className="doc-track">

            {/* 1 — LEFT */}
            <div className="doc-card left">
              <div className="doc-card-head">
                <div className="doc-icon">📊</div>
                <h2>Resume-Job Matching</h2>
              </div>
              <p>Analyze how well your resume matches a job description with scoring and improvement suggestions.</p>
              <p><span className="doc-label">How it works: </span>Our AI extracts your skills, experience, and education, then compares them with job requirements to calculate a compatibility score (0-100).</p>
              <p><span className="doc-label">Output: </span>Match score, skill alignment percentage, identified gaps, and actionable improvement suggestions.</p>
            </div>

            {/* 2 — RIGHT */}
            <div className="doc-card right">
              <div className="doc-card-head">
                <div className="doc-icon">🎯</div>
                <h2>Question Generation</h2>
              </div>
              <p>Get 10 personalized interview questions based on your resume and the job description.</p>
              <p><span className="doc-label">How it works: </span>Analysis of job requirements and your background to generate role-specific, technical, and behavioral questions.</p>
              <p><span className="doc-label">Output: </span>10 tailored questions with difficulty levels and expected answer frameworks.</p>
            </div>

            {/* 3 — LEFT */}
            <div className="doc-card left">
              <div className="doc-card-head">
                <div className="doc-icon">📈</div>
                <h2>Answer Analysis & Performance Scoring</h2>
              </div>
              <p>Receive performance scoring and detailed feedback on your interview answers.</p>
              <p><span className="doc-label">How it works: </span>AI evaluates your answers for completeness, technical accuracy, communication clarity, and alignment with best practices.</p>
              <p><span className="doc-label">Output: </span>Individual answer scores (0-100), overall interview readiness percentage, and personalized improvement recommendations.</p>
            </div>

            {/* 4 — RIGHT */}
            <div className="doc-card right">
              <div className="doc-card-head">
                <div className="doc-icon">⚡</div>
                <h2>Tech Stack</h2>
              </div>
              <div className="doc-tech-grid">
                <div className="doc-tech-item">
                  <div className="doc-tech-key">Frontend</div>
                  <p>Next.js 14+, TypeScript, Tailwind CSS — Modern, responsive UI</p>
                </div>
                <div className="doc-tech-item">
                  <div className="doc-tech-key">Backend</div>
                  <p>FastAPI (Python), Document processing (PDF/DOCX), Prompt orchestration</p>
                </div>
                <div className="doc-tech-item">
                  <div className="doc-tech-key">LLM Engine</div>
                  <p>Groq — Ultra-fast inference with 85-95% accuracy for skill matching</p>
                </div>
                <div className="doc-tech-item">
                  <div className="doc-tech-key">Database</div>
                  <p>MongoDB — Stores user profiles, resumes, and interview history</p>
                </div>
              </div>
            </div>

            {/* 5 — LEFT */}
            <div className="doc-card left">
              <div className="doc-card-head">
                <div className="doc-icon">🔒</div>
                <h2>Security & Privacy</h2>
              </div>
              <ul className="doc-list">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure API key management</li>
                <li>User data isolated per account</li>
                <li>Input validation and sanitization</li>
                <li>Rate limiting to prevent abuse</li>
              </ul>
            </div>

            {/* 6 — RIGHT */}
            <div className="doc-card right">
              <div className="doc-card-head">
                <div className="doc-icon">⚙️</div>
                <h2>Performance Metrics</h2>
              </div>
              <div className="doc-perf-grid">
                <div className="doc-perf-box">
                  <div className="doc-perf-title">Response Times</div>
                  <div className="doc-perf-row"><span>Resume Matching</span><span>1–2s</span></div>
                  <div className="doc-perf-row"><span>Question Gen</span><span>2–3s</span></div>
                  <div className="doc-perf-row"><span>Answer Analysis</span><span>1.5–2s</span></div>
                </div>
                <div className="doc-perf-box">
                  <div className="doc-perf-title">Accuracy</div>
                  <div className="doc-perf-row"><span>Skill Detection</span><span>92%</span></div>
                  <div className="doc-perf-row"><span>Match Scoring</span><span>89%</span></div>
                  <div className="doc-perf-row"><span>Answer Evaluation</span><span>88%</span></div>
                </div>
              </div>
            </div>

          </div>

          <div className="doc-footer">
            <div className="doc-footer-brand">Interview<em>Coach</em> AI</div>
            <p>v1.0</p>
          </div>

        </div>
      </div>
    </>
  );
}