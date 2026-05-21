'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserInterviews, SessionDetails } from '@/lib/interview/interviewApi';
import { useAuth } from '@/lib/auth/withProtectedRoute';

export default function InterviewPrepPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [interviews, setInterviews] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await getUserInterviews();
        // Ensure data is always an array
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err: any) {
        // If no interviews yet, just show empty state
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadInterviews();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-violet-500/20"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const inProgressInterviews = interviews.filter((i) => i.status === 'in_progress');

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-zinc-500';
    if (score >= 40) return 'text-emerald-400';
    if (score >= 30) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
            InterviewCoach<span className="text-violet-500">.ai</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        {/* Header */}
        <div className="mb-16 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium mb-6">
            <span className="text-lg">🎙️</span>
            AI Interview Simulator
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-white via-violet-100 to-violet-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Master your interviews.
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Practice with hyper-realistic AI interviews tailored to your exact job description and resume. Receive instant, actionable feedback to land your dream role.
          </p>
        </div>

        {/* Quick Start */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up">
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.05] p-10 hover:bg-white/[0.04] transition-all duration-300 group shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-cyan-500/20"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl mb-6 shadow-inner border border-cyan-500/30">
                🚀
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Quick Start</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Begin a completely new interview session. We'll generate custom questions based on the exact job you're applying for.
              </p>
              <Link
                href="/interview/start"
                className="group/btn relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] w-full sm:w-auto"
              >
                Start New Interview
                <svg className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.05] p-10 hover:bg-white/[0.04] transition-all duration-300 group shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:bg-violet-500/20"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center text-2xl mb-6 shadow-inner border border-violet-500/30">
                📊
              </div>
              <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">How It Works</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 text-violet-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</span>
                  <span className="text-zinc-300">Generate tailored behavioral and technical questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 text-violet-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</span>
                  <span className="text-zinc-300">Answer seamlessly via audio recording or text</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 text-violet-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</span>
                  <span className="text-zinc-300">Receive an immediate, detailed AI performance analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 font-medium">Loading your interview history...</p>
          </div>
        )}

        {/* In Progress */}
        {!loading && inProgressInterviews.length > 0 && (
          <div className="mb-16 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                In Progress <span className="text-zinc-500 text-lg font-medium ml-2">({inProgressInterviews.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressInterviews.map((interview) => (
                <div
                  key={interview.session_id}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:border-amber-500/30 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="pr-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-snug group-hover:text-amber-100 transition-colors">
                        {interview.job_title}
                      </h3>
                      <p className="text-sm font-medium text-zinc-500">
                        {interview.answers_count}/{interview.questions_count} answered
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-lg flex-shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-2 mb-6 overflow-hidden mt-auto">
                    <div
                      className="bg-linear-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(interview.answers_count / interview.questions_count) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <button
                    onClick={() => router.push(`/interview/take/${interview.session_id}`)}
                    className="w-full py-3.5 bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continue Session
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Interviews */}
        {!loading && completedInterviews.length > 0 && (
          <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">✅</span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Completed <span className="text-zinc-500 text-lg font-medium ml-2">({completedInterviews.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedInterviews.map((interview) => (
                <div
                  key={interview.session_id}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="pr-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-snug group-hover:text-cyan-100 transition-colors">
                        {interview.job_title}
                      </h3>
                      <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(interview.completed_at!).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg flex-shrink-0">
                      Done
                    </span>
                  </div>

                  <div className="mt-auto mb-6 flex items-baseline gap-1">
                    <span className={`text-4xl font-bold tracking-tight ${getScoreColor(interview.total_score)}`}>
                      {interview.total_score || 0}
                    </span>
                    <span className="text-zinc-500 font-medium">/50</span>
                  </div>

                  <button
                    onClick={() => router.push(`/interview/results/${interview.session_id}`)}
                    className="w-full py-3.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Review Analysis
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 rounded-3xl animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center text-4xl mb-6">
              🎙️
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No interviews yet</h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">Take your first interview to get AI-powered feedback and dramatically improve your chances.</p>
            <Link
              href="/interview/start"
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]"
            >
              Start Your First Interview
            </Link>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl mb-6 shadow-inner border border-cyan-500/30">
              🎯
            </div>
            <h4 className="font-bold text-white text-xl mb-3">Job-Specific</h4>
            <p className="text-zinc-400 leading-relaxed font-light">Questions are dynamically generated and hyper-tailored to the specific job description you provide.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-2xl mb-6 shadow-inner border border-violet-500/30">
              🔊
            </div>
            <h4 className="font-bold text-white text-xl mb-3">Audio Support</h4>
            <p className="text-zinc-400 leading-relaxed font-light">Answer via realistic audio recording or text—whichever modality works best for your practice.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl mb-6 shadow-inner border border-emerald-500/30">
              💡
            </div>
            <h4 className="font-bold text-white text-xl mb-3">AI Analysis</h4>
            <p className="text-zinc-400 leading-relaxed font-light">Get granular, qualitative feedback on each answer with structural and content improvement tips.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
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
