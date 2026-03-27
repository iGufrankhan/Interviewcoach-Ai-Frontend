'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { submitInterview, ScoreResult } from '@/lib/interview/interviewApi';
import { useAuth } from '@/lib/auth/withProtectedRoute';

export default function InterviewResultsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const sessionId = params.sessionId as string;

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const scoreResult = await submitInterview(sessionId);
        setResult(scoreResult);
      } catch (err: any) {
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadResults();
    }
  }, [user, authLoading, sessionId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Analyzing your answers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-black">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/interview/start')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-500';
    if (score >= 6) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Interview Complete! 🎉
          </h1>
          <p className="text-slate-300">
            Your answers have been analyzed and scored
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-12 backdrop-blur mb-8 text-center">
          <div className="mb-8">
            <p className="text-slate-400 mb-2">Final Score</p>
            <div className={`text-6xl font-bold ${getScoreColor(result.total_score)} mb-2`}>
              {result.total_score}/10
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 mb-4">
              <div
                className={`bg-gradient-to-r ${getScoreGradient(result.total_score)} h-3 rounded-full`}
                style={{ width: `${(result.total_score / 10) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-around text-sm text-slate-300">
              <div>
                <p className="text-slate-400">Percentage</p>
                <p className="text-lg font-semibold">{result.percentage}%</p>
              </div>
              <div>
                <p className="text-slate-400">Average per Question</p>
                <p className="text-lg font-semibold">{result.average_per_question}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Performance</h3>
            {result.percentage >= 80 ? (
              <div>
                <p className="text-green-400 font-semibold mb-2">Excellent!</p>
                <p className="text-sm text-slate-300">Outstanding performance. You're well-prepared for this role.</p>
              </div>
            ) : result.percentage >= 60 ? (
              <div>
                <p className="text-yellow-400 font-semibold mb-2">Good</p>
                <p className="text-sm text-slate-300">Solid response. A bit more preparation could help.</p>
              </div>
            ) : (
              <div>
                <p className="text-red-400 font-semibold mb-2">Need Improvement</p>
                <p className="text-sm text-slate-300">Consider reviewing the role requirements and practicing more.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Excellent Answers (5)</span>
                <span className="text-green-400 font-semibold">
                  {result.question_answers.filter((q) => q.score === 5).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Good Answers (4)</span>
                <span className="text-cyan-400 font-semibold">
                  {result.question_answers.filter((q) => q.score === 4).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Answers (3)</span>
                <span className="text-yellow-400 font-semibold">
                  {result.question_answers.filter((q) => q.score === 3).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Below Average (1-2)</span>
                <span className="text-red-400 font-semibold">
                  {result.question_answers.filter((q) => q.score < 3).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-white">Detailed Feedback</h2>
          {result.question_answers.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-start justify-between hover:bg-slate-700/30 transition text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-slate-300">
                      Question {index + 1}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      item.score === 5 ? 'bg-green-500/20 text-green-400' :
                      item.score === 4 ? 'bg-cyan-500/20 text-cyan-400' :
                      item.score === 3 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.score}/5
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-300 font-semibold">Q: {item.question.substring(0, 100)}{item.question.length > 100 ? '...' : ''}</p>
                    <p className="text-sm text-slate-400">A: {item.answer.substring(0, 100)}{item.answer.length > 100 ? '...' : ''}</p>
                  </div>
                </div>
                <span className="text-slate-400 ml-4">
                  {expandedIndex === index ? '▼' : '▶'}
                </span>
              </button>

              {expandedIndex === index && (
                <div className="px-6 py-4 bg-slate-700/20 border-t border-slate-700/50 space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">📝 Question:</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.question}</p>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                    <h4 className="text-sm font-semibold text-cyan-300 mb-2">✏️ Your Answer:</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.answer}</p>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">💭 AI Feedback:</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{item.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/interviewprep')}
            className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/interview/start')}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded transition"
          >
            Take Another Interview
          </button>
        </div>
      </div>
    </div>
  );
}
