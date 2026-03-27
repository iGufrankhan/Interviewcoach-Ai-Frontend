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
        setInterviews(data);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const inProgressInterviews = interviews.filter((i) => i.status === 'in_progress');

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-slate-400';
    if (score >= 40) return 'text-green-400';
    if (score >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Interview Preparation
          </h1>
          <p className="text-slate-300 text-lg">
            Practice with AI-powered interview questions and get instant feedback
          </p>
        </div>

        {/* Quick Start */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-8 backdrop-blur">
            <h3 className="text-2xl font-bold text-white mb-4">🚀 Quick Start</h3>
            <p className="text-slate-300 mb-6">
              Start a new interview session by selecting a job description and your resume.
            </p>
            <Link
              href="/interview/start"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition"
            >
              Start New Interview →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8 backdrop-blur">
            <h3 className="text-2xl font-bold text-white mb-4">📊 How It Works</h3>
            <ul className="text-slate-300 space-y-2 text-sm">
              <li>✓ Generate 2 tailored interview questions</li>
              <li>✓ Answer via audio or text</li>
              <li>✓ Get AI-powered feedback</li>
              <li>✓ Score out of 10</li>
              <li>✓ Review detailed analysis</li>
            </ul>
          </div>
        </div>

        {/* In Progress */}
        {inProgressInterviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="animate-pulse inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
              In Progress ({inProgressInterviews.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inProgressInterviews.map((interview) => (
                <div
                  key={interview.session_id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur hover:border-yellow-500/30 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {interview.job_title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {interview.answers_count}/{interview.questions_count} answered
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded">
                      In Progress
                    </span>
                  </div>

                  <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                      style={{
                        width: `${(interview.answers_count / interview.questions_count) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/interview/take/${interview.session_id}`)
                    }
                    className="w-full py-2 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded transition"
                  >
                    Continue
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Interviews */}
        {completedInterviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Completed ({completedInterviews.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedInterviews.map((interview) => (
                <div
                  key={interview.session_id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur hover:border-blue-500/30 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {interview.job_title}
                      </h3>
                      <p className={`text-2xl font-bold ${getScoreColor(interview.total_score)}`}>
                        {interview.total_score}/50
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                      Completed
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4">
                    {new Date(interview.completed_at!).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/interview/results/${interview.session_id}`)
                    }
                    className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-semibold rounded transition"
                  >
                    View Results
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {interviews.length === 0 && !loading && (
          <div className="text-center py-20 bg-slate-800/30 border border-slate-700/50 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-2">No interviews yet</h3>
            <p className="text-slate-400 mb-6">Take your first interview to get AI-powered feedback</p>
            <Link
              href="/interview/start"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition"
            >
              Start Interview Now
            </Link>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-semibold text-white mb-2">Job-Specific</h4>
            <p className="text-sm text-slate-400">Questions tailored to the job description you provide</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
            <div className="text-3xl mb-3">🔊</div>
            <h4 className="font-semibold text-white mb-2">Audio Support</h4>
            <p className="text-sm text-slate-400">Answer via audio or text - whatever works best for you</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
            <div className="text-3xl mb-3">💡</div>
            <h4 className="font-semibold text-white mb-2">AI Feedback</h4>
            <p className="text-sm text-slate-400">Get detailed feedback on each answer with improvement tips</p>
          </div>
        </div>
      </div>
    </div>
  );
}
