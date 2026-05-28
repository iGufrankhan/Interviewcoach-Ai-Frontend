'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    router.prefetch('/login');
    router.prefetch('/OtpSend');

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to dashboard if already logged in
      router.push('/dashboard');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-violet-500/20"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
            InterviewCoach<span className="text-violet-500">.ai</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors duration-200">Workflow</a>
            <Link href="/login" prefetch className="hover:text-white transition-colors duration-200">
              Login
            </Link>
            <Link href="/OtpSend" prefetch className="group relative inline-flex items-center justify-center px-6 py-2.5 font-medium text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Meet your new AI career strategist
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1] text-white">
            Master your next interview with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-fuchsia-400 to-indigo-500">
              intelligent precision.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Upload your resume, match with dream roles, and practice with our advanced AI coach that gives you real-time, actionable feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* The "Best" Premium Button */}
            <Link href="/login" prefetch className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-full hover:from-violet-500 hover:to-indigo-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#030014]">
              <span className="absolute inset-0 w-full h-full rounded-full blur-md bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                Start Free Analysis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link href="/DetailsDocs" className="inline-flex items-center justify-center px-8 py-4 font-medium text-zinc-300 transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white hover:scale-105">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Elevate your preparation</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Everything you need to turn rejection letters into offers.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Resume-Job Matching</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Analyze how well your resume matches any job description. Get precise match scores and actionable improvement suggestions.
              </p>
              <ul className="text-sm text-zinc-500 space-y-3">
                <li className="flex items-center gap-2"><span className="text-blue-400">✧</span> Detailed match scoring</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✧</span> Strengths & weaknesses</li>
                <li className="flex items-center gap-2"><span className="text-blue-400">✧</span> Smart improvement tips</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Targeted Questions</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Generate highly relevant interview questions based on the exact job description and your unique background.
              </p>
              <ul className="text-sm text-zinc-500 space-y-3">
                <li className="flex items-center gap-2"><span className="text-violet-400">✧</span> Role-specific scenarios</li>
                <li className="flex items-center gap-2"><span className="text-violet-400">✧</span> Technical & behavioral mix</li>
                <li className="flex items-center gap-2"><span className="text-violet-400">✧</span> Personalized to resume</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-pink-500/30 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-pink-500/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Performance Analysis</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Practice answering questions and get AI-powered feedback. Receive scores, strengths analysis, and recommendations.
              </p>
              <ul className="text-sm text-zinc-500 space-y-3">
                <li className="flex items-center gap-2"><span className="text-pink-400">✧</span> Instant performance scoring</li>
                <li className="flex items-center gap-2"><span className="text-pink-400">✧</span> Detailed answer feedback</li>
                <li className="flex items-center gap-2"><span className="text-pink-400">✧</span> Personalized tips</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Four simple steps to interview mastery.</p>
          </div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#030014] text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">📄</span>
                  <h3 className="text-xl font-bold text-white">Upload Your Resume</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Start by uploading your resume in PDF or DOCX format. Our AI automatically extracts and analyzes your skills, experience, and education.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#030014] text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">🔍</span>
                  <h3 className="text-xl font-bold text-white">Find Your Dream Job</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Find a job description that interests you and paste it into our platform. We deeply analyze requirements against your background.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#030014] text-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">🎯</span>
                  <h3 className="text-xl font-bold text-white">Get Instant Feedback</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Receive detailed analysis of your match score, strengths, weaknesses, and highly specific recommendations to improve your candidacy.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#030014] text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">🎤</span>
                  <h3 className="text-xl font-bold text-white">Practice & Prepare</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Generate tailored interview questions and get AI-powered feedback on your answers. Iterate and practice until you&apos;re confident!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/[0.05] p-12 md:p-20 text-center">
            <div className="absolute inset-0 bg-linear-to-b from-violet-500/10 to-transparent"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to land your dream job?</h2>
              <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
                Join ambitious professionals who have successfully mastered their interviews with InterviewCoach.ai.
              </p>
              <Link href="/login" className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-full hover:from-violet-500 hover:to-indigo-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]">
                <span className="absolute inset-0 w-full h-full rounded-full blur-md bg-linear-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/[0.05] text-center text-zinc-500 text-sm relative z-10">
        <p>&copy; {new Date().getFullYear()} InterviewCoach.ai. All rights reserved.</p>
      </footer>
    </div>
  );
}
