'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserInterviews, SessionDetails } from '@/lib/interview/interviewApi';
import { useAuth } from '@/lib/auth/withProtectedRoute';

export default function InterviewResultsHistoryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [interviews, setInterviews] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await getUserInterviews();
        setInterviews(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadInterviews();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex flex-col justify-center items-center gap-6">
          <div className="relative">
            <div className="absolute animate-ping w-24 h-24 rounded-full bg-cyan-500/20"></div>
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-zinc-400 font-medium tracking-wide">Loading your result history...</p>
        </div>
      </div>
    );
  }

  const completedInterviews = interviews.filter((i) => i.status === 'completed');

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-zinc-500';
    if (score >= 40) return 'text-emerald-400';
    if (score >= 30) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreShadow = (score: number | null) => {
    if (!score) return '';
    if (score >= 40) return 'shadow-[0_0_30px_-5px_rgba(52,211,153,0.15)] hover:shadow-[0_0_40px_-5px_rgba(52,211,153,0.3)]';
    if (score >= 30) return 'shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)] hover:shadow-[0_0_40px_-5px_rgba(251,191,36,0.3)]';
    return 'shadow-[0_0_30px_-5px_rgba(244,63,94,0.15)] hover:shadow-[0_0_40px_-5px_rgba(244,63,94,0.3)]';
  };

  const getScoreBorder = (score: number | null) => {
    if (!score) return 'border-white/5 hover:border-white/10';
    if (score >= 40) return 'border-emerald-500/20 hover:border-emerald-500/40';
    if (score >= 30) return 'border-amber-500/20 hover:border-amber-500/40';
    return 'border-rose-500/20 hover:border-rose-500/40';
  };

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden flex flex-col">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 py-4 px-6 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
          InterviewCoach<span className="text-cyan-500">.ai</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-12 relative z-10 w-full">
        {/* Header */}
        <div className="mb-16 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6">
            <span className="text-lg">🏆</span>
            Performance History
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight">
            All Interview Results
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Review your past performance, track your improvement, and access detailed AI feedback for every interview you've completed.
          </p>
        </div>

        {/* Completed Interviews Grid */}
        {completedInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {completedInterviews.map((interview) => {
              const scoreColor = getScoreColor(interview.total_score);
              const shadowClass = getScoreShadow(interview.total_score);
              const borderClass = getScoreBorder(interview.total_score);
              
              return (
                <div
                  key={interview.session_id}
                  className={`bg-white/[0.02] border rounded-3xl p-8 transition-all duration-500 group flex flex-col h-full relative overflow-hidden ${borderClass} ${shadowClass}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="pr-4">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-cyan-100 transition-colors">
                        {interview.job_title}
                      </h3>
                      <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(interview.completed_at!).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto mb-8 flex flex-col gap-2 relative z-10">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Final Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-6xl font-black tracking-tighter ${scoreColor}`}>
                        {interview.total_score || 0}
                      </span>
                      <span className="text-zinc-600 font-bold text-2xl">/50</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/interview/results/${interview.session_id}`)}
                    className="w-full py-4 bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/40 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group/btn relative z-10"
                  >
                    View Detailed Report
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/[0.01] border border-white/5 rounded-3xl animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center text-4xl mb-6">
              📝
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No completed results yet</h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">You haven't completed any interviews yet. Start an interview to see your results appear here.</p>
            <Link
              href="/interview/start"
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]"
            >
              Start an Interview
            </Link>
          </div>
        )}
      </div>

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
