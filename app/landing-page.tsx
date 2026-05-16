'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StarBackground from "@/ui/StarBackground";



export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
    else setIsLoading(false);
  }, [router]);

  

  if (isLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#080808', flexDirection:'column', gap:'16px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'2px solid rgba(185,29,29,0.2)', borderTopColor:'#b91d1d', animation:'spin .7s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:'#444', fontFamily:'sans-serif', fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase' }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .lnd-root {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: #080808; color: #e0e0e0;
          overflow-x: hidden;
        }


        /* ── NAV — gray tint ── */
        .lnd-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(36,36,36,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #1e1e1e;
          padding: 0 52px;
        }
        .lnd-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .lnd-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 3.5px; color: #fff; text-decoration: none; }
        .lnd-logo em { font-style: normal; color: #b91d1d; }
        .lnd-nav-links { display: flex; align-items: center; gap: 32px; }
        .lnd-nav-links a { font-size: 13px; color: #ccc; text-decoration: none; letter-spacing: 0.5px; transition: color .2s; }
        .lnd-nav-links a:hover { color: #fff; }
        .lnd-nav-btns { display: flex; align-items: center; gap: 10px; }
        .btn-ghost { padding: 8px 20px; background: transparent; border: 1px solid #444; border-radius: 7px; color: #ccc; font-family: 'DM Sans', sans-serif; font-size: 13px; text-decoration: none; transition: border-color .2s, color .2s; }
        .btn-ghost:hover { border-color: rgba(185,29,29,0.4); color: #fff; }
        .btn-red { padding: 8px 20px; background: #b91d1d; border: none; border-radius: 7px; color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 2px; text-decoration: none; transition: background .2s; }
        .btn-red:hover { background: #cc2020; }

        /* ── HERO ── */
        .lnd-hero {
          position: relative; z-index: 2;
          min-height: calc(100vh - 64px);
          display: flex; align-items: center; justify-content: center;
          padding: 80px 40px; overflow: hidden;
        }
        .lnd-hero-glow {
          position: absolute; z-index: 0; pointer-events: none;
          width: 1000px; height: 1000px; border-radius: 50%;
          background: radial-gradient(circle, rgba(185,29,29,0.2) 0%, rgba(185,29,29,0.07) 40%, transparent 65%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .lnd-hero-inner { position: relative; z-index: 2; max-width: 860px; text-align: center; }

        .lnd-hero-pre {
          font-family: 'Anton', sans-serif;
          font-size: clamp(52px, 7.5vw, 100px);
          letter-spacing: 3px;
          line-height: 1;

          background: linear-gradient(
          120deg,
          #ff4d4d,
          #ffffff,
          #b91d1d
          );
          background-size: 200% auto;

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation: shine 3s linear infinite;
        }

        
        .lnd-hero-static {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 7.5vw, 100px);
          letter-spacing: 3px; line-height: 1;
          -webkit-text-stroke: 1px #2a2a2a; color: transparent;
        }
        .lnd-hero-typed {
          font-family: 'Anton', sans-serif;
          font-size: clamp(52px, 7.5vw, 100px);  /* 🔥 IMPORTANT */
          letter-spacing: 3px;
          line-height: 1;

          background: linear-gradient(
          120deg,
          #ff4d4d,
          #ffffff,
          #b91d1d
          );
          background-size: 200% auto;

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation: shine 3s linear infinite;
  
        }

       @keyframes shine { to {background-position: 200% center;}}
       
        @keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} }

        .lnd-hero-sub { font-size: 17px; color: #aaa; font-weight: 300; line-height: 1.8; max-width: 560px; margin: 0 auto 44px; }

        .lnd-hero-btns { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
        .btn-primary { padding: 15px 36px; background: #b91d1d; border: none; border-radius: 8px; color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 2.5px; text-decoration: none; cursor: pointer; position: relative; overflow: hidden; transition: background .2s, transform .15s, box-shadow .2s; display: inline-block; }
        .btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%); }
        .btn-primary:hover { background: #cc2020; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(185,29,29,0.35); }
        .btn-outline { padding: 15px 36px; background: transparent; border: 1px solid #444; border-radius: 8px; color: #ccc; font-family: 'DM Sans', sans-serif; font-size: 14px; text-decoration: none; transition: border-color .2s, color .2s; }
        .btn-outline:hover { border-color: rgba(185,29,29,0.4); color: #ccc; }

        /* stats */
        .lnd-stats { max-width: 560px; margin: 56px auto 0; display: flex; border: 1px solid #1a1a1a; border-radius: 12px; background: rgba(36,36,36,0.92); overflow: hidden; gap: 10px; background: transparent; }
        .lnd-stat { flex: 1; padding: 18px 0; text-align: center; border-right: 1px solid #1a1a1a; }
        .lnd-stat:last-child { border-right: none; }
        .lnd-stat-n { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #b91d1d; line-height: 1; }
        .lnd-stat-l { font-size: 10px; color: #aaa; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }

        /* ── SECTION ── */
        .lnd-sec { position: relative; z-index: 2; padding: 100px 40px; }
        .lnd-sec-alt { background: #0b0b0b; border-top: 1px solid #111; border-bottom: 1px solid #111; }
        .lnd-sec-inner { max-width: 1160px; margin: 0 auto; }
        .lnd-sec-head { text-align: center; margin-bottom: 64px; }
        .lnd-sec-head h2 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 5vw, 56px); letter-spacing: 2.5px; color: #fff; line-height: 1; margin-bottom: 10px; }
        .lnd-sec-head h2 span { color: #b91d1d; }
        .lnd-sec-head p { font-size: 13.5px; color: #aaa; font-weight: 300; }

        /* ── BENTO FEATURES — gray cards ── */
        .lnd-bento {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 12px;
        }

        .lnd-bcard {
          background: #1c1c1c;
          border: 1px solid #1e1e1e;
          border-radius: 14px; padding: 36px 32px;
          position: relative; overflow: hidden;
          transition: border-color .25s, background .25s;
        }
        .lnd-bcard:hover { border-color: rgba(185,29,29,0.3); background: #161616; }

        /* first card spans 2 rows */
        .lnd-bcard-big { grid-row: span 2; }

        /* corner glow on hover */
        .lnd-bcard::after {
          content: ''; position: absolute;
          top: 0; left: 0; width: 100px; height: 100px;
          background: radial-gradient(circle at top left, rgba(185,29,29,0.1), transparent 70%);
          opacity: 0; transition: opacity .3s;
        }
        .lnd-bcard:hover::after { opacity: 1; }

        .lnd-bcard-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 3px;
          color: #b91d1d; opacity: 0.6; margin-bottom: 16px;
        }
        .lnd-bcard-icon { font-size: 36px; margin-bottom: 20px; display: block; }
        .lnd-bcard h3 { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1.5px; color: #e0e0e0; margin-bottom: 12px; }
        .lnd-bcard p { font-size: 13.5px; color: #aaa; font-weight: 300; line-height: 1.75; margin-bottom: 18px; }
        .lnd-bcard-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .lnd-tag { padding: 4px 12px; background: rgba(185,29,29,0.08); border: 1px solid rgba(185,29,29,0.15); border-radius: 20px; font-size: 11px; color: #b91d1d; letter-spacing: 0.5px; }

        /* ── WORKFLOW — horizontal timeline ── */
        .lnd-timeline {
          position: relative;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        /* connecting line */
        .lnd-timeline::before {
          content: ''; position: absolute;
          top: 52px; left: 12.5%; right: 12.5%;
          height: 1px;
          background: linear-gradient(to right, transparent, #b91d1d 20%, #222 50%, #b91d1d 80%, transparent);
          z-index: 0;
        }

        .lnd-titem {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 0 20px;
        }

        .lnd-tnum-wrap {
          width: 52px; height: 52px; border-radius: 50%;
          background: #131313; border: 1px solid #222;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px; position: relative;
          transition: border-color .2s;
        }
        .lnd-titem:hover .lnd-tnum-wrap { border-color: #b91d1d; }
        .lnd-tnum-wrap::before {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          background: radial-gradient(circle, rgba(185,29,29,0.15) 0%, transparent 70%);
        }
        .lnd-tnum {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 1px; color: #b91d1d;
          position: relative; z-index: 1;
        }

        .lnd-ticon { font-size: 32px; margin-bottom: 16px; }

        .lnd-titem h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; letter-spacing: 1px; color: #fff;
          margin-bottom: 10px;
        }
        .lnd-titem p { font-size: 13px; color: #aaa; font-weight: 300; line-height: 1.7; }

        /* ── CTA ── */
        .lnd-cta { position: relative; z-index: 2; padding: 100px 40px; text-align: center; border-top: 1px solid #111; overflow: hidden; }
        .lnd-cta-glow { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(185,29,29,0.1) 0%, transparent 70%); }
        .lnd-cta-inner { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; }
        .lnd-cta h2 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(40px, 6vw, 72px); letter-spacing: 2.5px; color: #fff; line-height: 1; margin-bottom: 16px; }
        .lnd-cta h2 span { color: #b91d1d; }
        .lnd-cta p { font-size: 15px; color: #aaa; font-weight: 300; line-height: 1.7; margin-bottom: 40px; }

        /* ── FOOTER ── */
        .lnd-footer { position: relative; z-index: 2; padding: 28px 52px; border-top: 1px solid #0f0f0f; display: flex; align-items: center; justify-content: space-between; background: #080808; }
        .lnd-footer-brand { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 3px; color: #222; }
        .lnd-footer-brand em { font-style: normal; color: #b91d1d; opacity: 0.4; }
        .lnd-footer p { font-size: 12px; color: #222; }

        @media (max-width: 900px) {
          .lnd-nav { padding: 0 24px; }
          .lnd-nav-links { display: none; }
          .lnd-bento { grid-template-columns: 1fr; }
          .lnd-bcard-big { grid-row: span 1; }
          .lnd-timeline { grid-template-columns: 1fr 1fr; gap: 32px; }
          .lnd-timeline::before { display: none; }
          .lnd-footer { flex-direction: column; gap: 8px; text-align: center; padding: 24px; }
        }
      `}</style>

      <div className="lnd-root">
        <StarBackground />

        {/* NAV */}
        <nav className="lnd-nav">
          <div className="lnd-nav-inner">
            <Link href="/" className="lnd-logo">Interview<em>Coach</em> AI</Link>
            <div className="lnd-nav-links">
              <a href="#features">Features</a>
              <a href="#workflow">Workflow</a>
            </div>
            <div className="lnd-nav-btns">
              <Link href="/login" className="btn-ghost">Login</Link>
              <Link href="/otpsend" className="btn-red">Get Started</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="lnd-hero">
          <div className="lnd-hero-glow" />
          <div className="lnd-hero-inner">

            <div className="lnd-hero-pre">Land Your</div>
            <div className="lnd-hero-type-row">
              <span className="lnd-hero-typed">
                Dream Job
              </span>
            </div>

            <p className="lnd-hero-sub">
              Get matched with dream jobs, prepare with AI-generated questions, and receive personalized feedback. Your intelligent interview coach powered by advanced LLMs.
            </p>

            <div className="lnd-hero-btns">
              <Link href="/login" className="btn-primary">Start Free Analysis</Link>
              <Link href="/DetailsDocs" className="btn-outline">View Documentation →</Link>
            </div>

            <div className="lnd-stats">
              <div className="lnd-stat"><div className="lnd-stat-n">10K+</div><div className="lnd-stat-l">Users</div></div>
              <div className="lnd-stat"><div className="lnd-stat-n">95%</div><div className="lnd-stat-l">Success</div></div>
              <div className="lnd-stat"><div className="lnd-stat-n">50K+</div><div className="lnd-stat-l">Interviews</div></div>
              <div className="lnd-stat"><div className="lnd-stat-n">4.9★</div><div className="lnd-stat-l">Rating</div></div>
            </div>
          </div>
        </section>

        {/* FEATURES — BENTO */}
        <section id="features" className="lnd-sec lnd-sec-alt">
          <div className="lnd-sec-inner">
            <div className="lnd-sec-head">
              <h2>Key <span>Features</span></h2>
              <p>Everything you need to ace your next interview</p>
            </div>
            <div className="lnd-bento">

              {/* BIG card */}
              <div className="lnd-bcard lnd-bcard-big">
                <div className="lnd-bcard-num">01 — MAIN</div>
                <span className="lnd-bcard-icon">📊</span>
                <h3>Resume-Job Matching</h3>
                <p>Analyze how well your resume matches any job description. Get match scores (0-100), eligibility assessment, and actionable improvement suggestions.</p>
                <div className="lnd-bcard-tags">
                  <span className="lnd-tag">Detailed match scoring</span>
                  <span className="lnd-tag">Strengths & weaknesses</span>
                  <span className="lnd-tag">Smart improvement tips</span>
                </div>
              </div>

              <div className="lnd-bcard">
                <div className="lnd-bcard-num">02</div>
                <span className="lnd-bcard-icon">🎯</span>
                <h3>Interview Questions</h3>
                <p>Generate targeted interview questions based on the job description and your resume. Prepare for role-specific scenarios.</p>
                <div className="lnd-bcard-tags">
                  <span className="lnd-tag">Role-specific</span>
                  <span className="lnd-tag">Technical & behavioral</span>
                </div>
              </div>

              <div className="lnd-bcard">
                <div className="lnd-bcard-num">03</div>
                <span className="lnd-bcard-icon">🎤</span>
                <h3>Performance Analysis</h3>
                <p>Practice answering questions and get AI-powered feedback. Receive scores, strengths analysis, and personalized improvement recommendations.</p>
                <div className="lnd-bcard-tags">
                  <span className="lnd-tag">Instant scoring</span>
                  <span className="lnd-tag">Detailed feedback</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* WORKFLOW — horizontal timeline */}
        <section id="workflow" className="lnd-sec">
          <div className="lnd-sec-inner">
            <div className="lnd-sec-head">
              <h2>How It <span>Works</span></h2>
              <p>Four simple steps to interview confidence</p>
            </div>
            <div className="lnd-timeline">
              <div className="lnd-titem">
                <div className="lnd-tnum-wrap"><span className="lnd-tnum">01</span></div>
                <div className="lnd-ticon">📄</div>
                <h3>Upload Your Resume</h3>
                <p>Start by uploading your resume in PDF or DOCX format. Our AI will extract and analyze your skills, experience, and education automatically.</p>
              </div>
              <div className="lnd-titem">
                <div className="lnd-tnum-wrap"><span className="lnd-tnum">02</span></div>
                <div className="lnd-ticon">🔍</div>
                <h3>Find Your Dream Job</h3>
                <p>Find a job description that interests you and paste it into our platform. We will match your skills and experience with the job requirements.</p>
              </div>
              <div className="lnd-titem">
                <div className="lnd-tnum-wrap"><span className="lnd-tnum">03</span></div>
                <div className="lnd-ticon">📊</div>
                <h3>Get Instant Feedback</h3>
                <p>Receive detailed analysis of your match score, strengths, weaknesses, and specific recommendations to improve your candidacy.</p>
              </div>
              <div className="lnd-titem">
                <div className="lnd-tnum-wrap"><span className="lnd-tnum">04</span></div>
                <div className="lnd-ticon">🎤</div>
                <h3>Practice & Prepare</h3>
                <p>Generate interview questions tailored to the job and get AI-powered feedback on your answers. Practice until you are confident!</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lnd-cta">
          <div className="lnd-cta-glow" />
          <div className="lnd-cta-inner">
            <h2>Ready to Land Your <span>Dream Job?</span></h2>
            <p>Join thousands of users who have successfully prepared for interviews with Interview Coach AI</p>
            <Link href="/login" className="btn-primary">Get Started Free</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lnd-footer">
          <div className="lnd-footer-brand">Interview<em>Coach</em> AI</div>
          <p>&copy; 2024 Interview Coach AI. All rights reserved.</p>
        </footer>

      </div>
    </>
  );
}