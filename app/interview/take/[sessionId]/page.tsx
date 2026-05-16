'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { submitAnswer, getInterviewSession, submitInterview } from '@/lib/interview/interviewApi'; 
import { useAuth } from '@/lib/auth/withProtectedRoute';

export default function TakeInterviewPage() {
  const router = useRouter();
  const params = useParams();

  const { user, isLoading: authLoading } = useAuth(); 

  // ✅ Recommended Fix: pure declaration block ko strictly cast kiya, ab pure page par kahin error nahi aayega
  const rawSessionId = params.sessionId;
  const sessionId = (Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId) as string;

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {

    let isMounted = true;

    const loadSession = async () => {
      if (questions.length > 0 || !sessionId) return;

      try {
        setLoadingSession(true);

        // Session fetch
        await getInterviewSession(sessionId);
        const savedQuestions = sessionStorage.getItem(`interview_questions_${sessionId}`);
        
        if (isMounted && savedQuestions) {
          setQuestions(JSON.parse(savedQuestions));
        }
      } catch (err) {
        if (isMounted) setError('Failed to load interview session metadata.');
      } finally {
        if (isMounted) setLoadingSession(false);
      }
    };

    if (!authLoading && user) {
      loadSession();
    }
    return () => {
      isMounted = false;
    };
    
  }, [authLoading, user, sessionId, questions.length]);

  // --- AUDIO LOGIC (MOCK) ---
  const startAudioRecording = async () => {
    try {
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Unable to access microphone.');
    }
  };

  const stopAudioRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsTranscribing(true);
      setAnswer('[Transcribing audio...]');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || isTranscribing) {
      setError('Please provide a valid answer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      
      const response = await submitAnswer(sessionId, answer, false) as any;
      
      const remainingQuestions = response?.remaining ?? (questions.length - (currentQuestionIndex + 1));

      if (remainingQuestions > 0) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswer('');
      } else {
        router.push(`/interview/results/${sessionId}`);
      }
      
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingSession) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#111', flexDirection:'column', gap:'16px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(192,57,43,0.3)', borderTopColor:'#c0392b', animation:'spin .7s linear infinite' }} />
          <p style={{ color:'#666', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Loading interview room...</p>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLast = questions.length > 0 ? currentQuestionIndex === questions.length - 1 : false;
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ti-root {
          min-height: 100vh;
          background: #111111;
          color: #e8e8e8;
          font-family: 'DM Sans', sans-serif;
        }

        .ti-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 70% 10%, rgba(180,30,30,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 85%, rgba(140,20,20,0.07) 0%, transparent 60%);
        }

        /* NAV */
        .ti-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(30,30,30,0.95); backdrop-filter: blur(16px);
          border-bottom: 1px solid #2a2a2a; padding: 0 60px;
        }
        .ti-nav-inner {
          width: 100%;
          max-width: 100%;   /* remove 860px limit */
          margin: 0;
          padding: 0 40px;
          min-height: 64px;   /* instead of height */
          height: auto;  
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ti-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #f0f0f0; text-decoration: none; }
        .ti-logo em { font-style: normal; color: #c0392b; }

        /* back btn */
        .ti-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          font-size: 13px;
          color: #aaa;
          text-decoration: none;

          padding: 6px 18px;
          border-radius: 999px; /* egg shape */

          border: 1px solid rgba(255,255,255,0.2);
          background: #1a1a1a;

          transition: all 0.25s ease;
          cursor: pointer;
        }

        .ti-back-btn:hover {
          color: #fff;
          background: rgba(185, 28, 28, 0.2);   /* soft red bg */
          border-color: #b91c1c;                /* strong red border */

          transform: translateY(-1px);
        }
        /* MAIN */
        .ti-main {
          position: relative; z-index: 2;
          max-width: 760px; margin: 0 auto;
          padding: 48px 32px 80px;
        }

        /* PROGRESS */
        .ti-progress { margin-bottom: 40px; }
        .ti-progress-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .ti-progress-label { font-size: 12px; color: #555; letter-spacing: 1px; }
        .ti-progress-frac {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px; letter-spacing: 1px; color: #c0392b;
        }
        .ti-prog-bg {
          height: 3px;  background: #333333; border-radius: 3px; overflow: hidden;
        }
        .ti-prog-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(to right, #7f1d1d, #c0392b, #e05555);
          transition: width .5s ease;
        }

        /* QUESTION CARD */
        .ti-qcard {
          background: #1c1c1c; border: 1px solid #2a2a2a;
          border-radius: 16px; padding: 36px 40px;
          margin-bottom: 14px;
          position: relative; overflow: hidden;
        }
        .ti-qcard::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, transparent, #c0392b 40%, transparent);
        }

        .ti-q-num {
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: #c0392b; font-weight: 600; margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .ti-q-num::before {
          content: ''; width: 20px; height: 1px; background: #c0392b;
        }

        .ti-qcard h2 {
          font-size: 17px; font-weight: 500; color: #e8e8e8;
          line-height: 1.6; margin-bottom: 28px;
        }

        /* textarea */
        .ti-textarea {
          width: 100%; padding: 16px 18px;
          background: #161616; border: 1px solid #252525;
          border-radius: 10px; color: #e0e0e0;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          line-height: 1.75; outline: none; resize: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .ti-textarea::placeholder { color: #333; }
        .ti-textarea:focus { border-color: #c0392b; box-shadow: 0 0 0 3px rgba(192,57,43,0.1); }
        .ti-textarea:disabled { opacity: .5; }

        /* mic row */
        .ti-mic-row {
          display: flex; align-items: center; gap: 12px; margin-top: 16px;
        }

        .ti-mic-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: rgba(255, 204, 0, 0.12);
          border: 1px solid rgba(255, 204, 0, 0.5);
          border-radius: 24px;
          color: #ffd54a;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          cursor: pointer;
          transition: all .2s ease;
        }
        .ti-mic-btn:hover {
          background: rgba(255, 204, 0, 0.2);
          border-color: #ffcc00;
          color: #fff3b0;
        }

        .ti-recording-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; background: rgba(192,57,43,0.12);
          border: 1px solid rgba(192,57,43,0.4); border-radius: 24px;
          color: #e07070; font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; cursor: pointer;
          animation: rec-pulse 1s ease-in-out infinite;
          transition: background .2s;
        }
        @keyframes rec-pulse { 0%,100%{opacity:1} 50%{opacity:0.65} }
        .ti-recording-btn:hover { background: rgba(192,57,43,0.2); }

        .ti-transcribing {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; color: #555;
        }
        .ti-t-spin {
          width: 14px; height: 14px; border-radius: 50%;
          border: 1.5px solid rgba(192,57,43,0.2); border-top-color: #c0392b;
          animation: spin .7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* error */
        .ti-error {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; background: #1e1212;
          border: 1px solid rgba(192,57,43,0.3);
          border-radius: 10px; margin-bottom: 14px;
          font-size: 13px; color: #e07070;
        }

        /* NAVIGATION BTNS */
        .ti-nav-btns { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; }

        .ti-prev-btn {
          padding: 15px;
          background: rgba(255, 204, 0, 0.12);
          border: 1px solid rgba(255, 204, 0, 0.5);
          border-radius: 999px;
          color: #ffd54a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all .2s ease;
        }
        .ti-prev-btn:hover:not(:disabled) {background: rgba(255, 204, 0, 0.2);border-color: #ffcc00;color: #fff3b0;}
        .ti-prev-btn:disabled {opacity: 0.3;cursor: not-allowed;background: #1a1a1a;border-color: #2a2a2a;color: #555;}

        .ti-next-btn {
          padding: 15px; background: #991b1b;
          border: none; border-radius: 999px;
          color: #fff; font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 2.5px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative; overflow: hidden;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .ti-next-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%); }
        .ti-next-btn:hover:not(:disabled) { background: #d44235; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(192,57,43,0.3); }
        .ti-next-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

        .ti-btn-spin {
          width: 16px; height: 16px; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
          border-radius: 50%; animation: spin .7s linear infinite;
        }

        @media (max-width: 600px) {
          .ti-main { padding: 36px 18px 60px; }
          .ti-nav { padding: 0 20px; }
          .ti-qcard { padding: 28px 20px; }
          .ti-nav-btns { grid-template-columns: 1fr 1.5fr; }
        }
      `}</style>

      <div className="ti-root">
        <div className="ti-bg" />

        {/* NAV */}
        <nav className="ti-nav">
          <div className="ti-nav-inner">
            <Link href="/" className="ti-logo">Interview<em>Coach</em> AI</Link>
            <Link href="/start" className="ti-back-btn">← Back to Start</Link>
          </div>
        </nav>

        <main className="ti-main">

          {/* PROGRESS */}
          <div className="ti-progress">
            <div className="ti-progress-top">
              <span className="ti-progress-label">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="ti-progress-frac">{Math.round(progress)}%</span>
            </div>
            <div className="ti-prog-bg">
              <div className="ti-prog-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* QUESTION CARD */}
          <div className="ti-qcard">
            <p className="ti-q-num">Question {currentQuestionIndex + 1}</p>
            <h2>{currentQuestion}</h2>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer or use the mic..."
              rows={6}
              disabled={isTranscribing}
              className="ti-textarea"
            />

            <div className="ti-mic-row">
              {!isRecording ? (
                <button onClick={startAudioRecording} className="ti-mic-btn">
                  🎤 Start Mic
                </button>
              ) : (
                <button onClick={stopAudioRecording} className="ti-recording-btn">
                  ⏹️ Stop Recording
                </button>
              )}
              {isTranscribing && (
                <div className="ti-transcribing">
                  <span className="ti-t-spin" />
                  Transcribing...
                </div>
              )}
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="ti-error">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="ti-nav-btns">
            <button
              disabled={currentQuestionIndex === 0 || loading}
              onClick={() => { setCurrentQuestionIndex(prev => prev - 1); setAnswer(''); }}
              className="ti-prev-btn"
            >
              ← Prev
            </button>
            <button
              disabled={loading || !answer.trim() || isTranscribing}
              onClick={handleSubmitAnswer}
              className="ti-next-btn"
            >
              {loading
                ? <><span className="ti-btn-spin" />Submitting...</>
                : isLast ? 'Finish Interview' : 'Next Question →'
              }
            </button>
          </div>

        </main>
      </div>
    </>
  );
}