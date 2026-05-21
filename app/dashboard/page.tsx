'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import ChatWidget from '@/app/chatbot/ChatWidget';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-24 h-24 rounded-full bg-violet-500/20"></div>
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-cyan-500/20 animation-delay-300"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden selection:bg-violet-500/30">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>
      
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#030014]/60 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white text-sm">✨</span>
            </div>
            InterviewCoach<span className="text-violet-500">.ai</span>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-4 items-center">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userEmail');
                router.push('/');
              }}
              className="group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-white transition-all duration-300 bg-white/[0.03] border border-white/10 rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 z-10 flex flex-col gap-12">
        
        {/* Welcome Hero - Bento Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="lg:col-span-2 relative rounded-3xl p-10 bg-white/[0.02] border border-white/[0.05] overflow-hidden group hover:border-violet-500/30 transition-all duration-500 shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all duration-500 pointer-events-none"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-xs font-bold uppercase tracking-wider mb-6 w-max">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                System Online
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight text-white">
                Welcome back,<br/>
                <span className="bg-linear-to-r from-violet-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  {user?.email?.split('@')[0] || 'Strategist'}
                </span>
              </h1>
              <p className="text-zinc-400 text-lg mb-10 max-w-lg leading-relaxed font-light">
                Your AI-powered career command center. Upload your latest resume to unlock hyper-personalized job matches and realistic interview simulations.
              </p>
              <Link
                href="/UploadResume"
                className="group/btn relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] w-max overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center gap-3">
                  Upload New Resume
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1 grid grid-rows-3 gap-6">
            <div className="group rounded-3xl bg-white/[0.02] border border-white/[0.05] p-6 flex items-center justify-between hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-full bg-linear-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>
              <div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Total Resumes</div>
                <div className="text-4xl font-black text-white">0</div>
              </div>
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-2xl group-hover:scale-110 transition-transform">📄</div>
            </div>
            
            <div className="group rounded-3xl bg-white/[0.02] border border-white/[0.05] p-6 flex items-center justify-between hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-full bg-linear-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
              <div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Interviews Taken</div>
                <div className="text-4xl font-black text-white">0</div>
              </div>
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-2xl group-hover:scale-110 transition-transform">🎤</div>
            </div>

            <div className="group rounded-3xl bg-white/[0.02] border border-white/[0.05] p-6 flex items-center justify-between hover:bg-white/[0.04] hover:border-yellow-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-full bg-linear-to-l from-yellow-500/10 to-transparent pointer-events-none"></div>
              <div>
                <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Avg Score</div>
                <div className="text-4xl font-black text-white">--</div>
              </div>
              <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-2xl group-hover:scale-110 transition-transform">🏆</div>
            </div>
          </div>
        </div>

        {/* Quick Access Pills */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-wrap gap-4">
            <Link href="/GetResumeData" className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(6,182,212,0.3)] flex-1 min-w-[200px] justify-center sm:justify-start">
              <span className="text-xl">🔍</span>
              <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">Analyze Job Match</span>
            </Link>
            <Link href="/GetResume" className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(139,92,246,0.3)] flex-1 min-w-[200px] justify-center sm:justify-start">
              <span className="text-xl">📚</span>
              <span className="font-bold text-white group-hover:text-violet-300 transition-colors">Resume Library</span>
            </Link>
            <Link href="/interviewprep" className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)] flex-1 min-w-[200px] justify-center sm:justify-start">
              <span className="text-xl">🎬</span>
              <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">Start Mock Interview</span>
            </Link>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white">Platform Capabilities</h2>
            <div className="flex-1 h-px bg-linear-to-r from-white/10 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 - Large (Spans 2 cols) */}
            <Link
              href="/interviewprep"
              className="group md:col-span-2 rounded-3xl p-8 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-emerald-500/30 hover:shadow-[0_0_50px_-15px_rgba(16,185,129,0.3)] transition-all duration-500 relative overflow-hidden flex flex-col sm:flex-row gap-8 items-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>
              <div className="w-24 h-24 rounded-[2rem] bg-linear-to-br from-emerald-500/20 to-teal-500/20 flex flex-shrink-0 items-center justify-center border border-emerald-500/30 shadow-inner group-hover:scale-110 transition-transform duration-500 relative z-10">
                <span className="text-4xl">🚀</span>
              </div>
              <div className="relative z-10 flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3 border border-emerald-500/20">
                  Core Engine
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-300 transition-colors">Hyper-Realistic Interview Practice</h3>
                <p className="text-zinc-400 mb-0 leading-relaxed font-light">
                  Simulate high-pressure technical and behavioral interviews. Our AI acts as the hiring manager, dynamically generating questions tailored exclusively to your resume and target job description.
                </p>
              </div>
            </Link>

            {/* Feature 2 - Small */}
            <Link
              href="/GetResumeData"
              className="group md:col-span-1 rounded-3xl p-8 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-cyan-500/30 hover:shadow-[0_0_50px_-15px_rgba(6,182,212,0.3)] transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">ATS Matching</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mt-auto">
                  Cross-reference your resume against actual job postings to expose missing keywords and critical gaps before you apply.
                </p>
              </div>
            </Link>

            {/* Feature 3 - Small */}
            <Link
              href="/interview-results"
              className="group md:col-span-1 rounded-3xl p-8 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-yellow-500/30 hover:shadow-[0_0_50px_-15px_rgba(234,179,8,0.3)] transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all pointer-events-none"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/20 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-300 transition-colors">Performance Insights</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mt-auto">
                  Review graded reports of past interviews. Discover where your STAR method fell short and how to polish your delivery.
                </p>
              </div>
            </Link>

            {/* Feature 4 - Small */}
            <Link
              href="/AnalysisResume"
              className="group md:col-span-1 rounded-3xl p-8 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-indigo-500/30 hover:shadow-[0_0_50px_-15px_rgba(99,102,241,0.3)] transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-500/20 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-300 transition-colors">Top Job Matches</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mt-auto">
                  Our algorithm scans the market to suggest the most lucrative and suitable positions based purely on your parsed profile.
                </p>
              </div>
            </Link>

            {/* Feature 5 - Small */}
            <Link
              href="/GetResume"
              className="group md:col-span-1 rounded-3xl p-8 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-purple-500/30 hover:shadow-[0_0_50px_-15px_rgba(168,85,247,0.3)] transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all pointer-events-none"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-purple-500/20 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl">📁</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">Secure Vault</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light mt-auto">
                  Maintain a centralized, secure repository of all your tailored resumes. Easily select which profile to use for your next mock interview.
                </p>
              </div>
            </Link>

          </div>
        </div>

        {/* Sleek Pro Tips Banner */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="rounded-3xl p-8 bg-linear-to-r from-white/[0.03] to-white/[0.01] border border-white/[0.05] relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-linear-to-b from-yellow-400 to-orange-500"></div>
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-inner flex-shrink-0">
                  <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Maximize Your Success Rate</h3>
                  <p className="text-sm text-zinc-400">Consistent practice is key. Users who complete at least 3 mock interviews increase their actual offer rate by 60%.</p>
                </div>
              </div>
              <Link href="/interview/start" className="w-full lg:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/40 text-white font-bold transition-all whitespace-nowrap text-center group">
                Begin Daily Practice
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
      
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
