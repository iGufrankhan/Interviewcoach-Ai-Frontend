'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Expand first item by default

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
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex flex-col justify-center items-center gap-6">
          <div className="relative">
            <div className="absolute animate-ping w-24 h-24 rounded-full bg-cyan-500/20"></div>
            <div className="absolute animate-ping w-16 h-16 rounded-full bg-emerald-500/20 animation-delay-300"></div>
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-zinc-400 font-medium tracking-wide">AI is analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030014]">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-3xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Analysis Failed</h2>
          <p className="text-zinc-400 mb-8 max-w-md">{error}</p>
          <button
            onClick={() => router.push('/interview/start')}
            className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 hover:scale-105"
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
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-emerald-400 to-emerald-600';
    if (score >= 6) return 'from-amber-400 to-orange-500';
    return 'from-rose-500 to-pink-600';
  };

  const getScoreShadow = (score: number) => {
    if (score >= 8) return 'shadow-[0_0_40px_-10px_rgba(52,211,153,0.3)]';
    if (score >= 6) return 'shadow-[0_0_40px_-10px_rgba(251,191,36,0.3)]';
    return 'shadow-[0_0_40px_-10px_rgba(244,63,94,0.3)]';
  };

  const getScoreText = (percentage: number) => {
    if (percentage >= 80) return { title: 'Exceptional', desc: "Outstanding performance. You're well-prepared for this role.", emoji: '🏆' };
    if (percentage >= 60) return { title: 'Solid', desc: "Good response. A bit more preparation could elevate you to the top tier.", emoji: '👍' };
    return { title: 'Needs Practice', desc: "Consider reviewing the role requirements and practicing more foundational concepts.", emoji: '📚' };
  };

  const scoreInfo = getScoreText(result.percentage);

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden">
      {/* Background ambient glows */}
      <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${
        result.percentage >= 80 ? 'bg-emerald-600/10' : result.percentage >= 60 ? 'bg-amber-600/10' : 'bg-rose-600/10'
      }`} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 py-4 px-6 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
          InterviewCoach<span className="text-cyan-500">.ai</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/interviewprep" className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="relative max-w-5xl mx-auto px-6 py-12 z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6">
            <span className="text-lg">📊</span>
            Comprehensive AI Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Interview Complete! 🎉
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            We've analyzed your responses based on industry standards. Review your comprehensive breakdown and actionable feedback below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          {/* Main Score Card */}
          <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className={`bg-white/[0.02] border border-white/[0.05] rounded-3xl p-10 h-full relative overflow-hidden transition-all duration-500 ${getScoreShadow(result.total_score)}`}>
              {/* Decorative background based on score */}
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
                result.percentage >= 80 ? 'bg-emerald-500' : result.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}></div>
              
              <div className="relative z-10 flex flex-col h-full justify-center">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-zinc-400 font-semibold uppercase tracking-wider text-sm">Overall Performance</h3>
                  <span className="text-4xl">{scoreInfo.emoji}</span>
                </div>
                
                <div className="text-center mb-10">
                  <div className="inline-flex items-baseline justify-center gap-2 mb-4">
                    <span className={`text-8xl font-black tracking-tighter ${getScoreColor(result.total_score)} drop-shadow-md`}>
                      {result.total_score}
                    </span>
                    <span className="text-3xl text-zinc-600 font-bold">/10</span>
                  </div>
                  
                  <div className="w-full bg-white/5 rounded-full h-3 mb-6 overflow-hidden relative">
                    <div
                      className={`bg-linear-to-r ${getScoreGradient(result.total_score)} h-full rounded-full transition-all duration-1500 ease-out`}
                      style={{ width: `${result.percentage}%` }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-white mb-2">{scoreInfo.title}</h4>
                  <p className="text-zinc-400 max-w-sm mx-auto">{scoreInfo.desc}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-5 text-center">
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Percentage</p>
                    <p className="text-2xl font-bold text-white">{result.percentage}%</p>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-5 text-center">
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Avg. per Question</p>
                    <p className="text-2xl font-bold text-white">{result.average_per_question}<span className="text-zinc-500 text-lg">/5</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 h-full">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm">📈</span>
                Quality Breakdown
              </h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Exceptional (5)', count: result.question_answers.filter((q) => q.score === 5).length, color: 'emerald', total: result.question_answers.length },
                  { label: 'Strong (4)', count: result.question_answers.filter((q) => q.score === 4).length, color: 'cyan', total: result.question_answers.length },
                  { label: 'Average (3)', count: result.question_answers.filter((q) => q.score === 3).length, color: 'amber', total: result.question_answers.length },
                  { label: 'Needs Work (1-2)', count: result.question_answers.filter((q) => q.score < 3).length, color: 'rose', total: result.question_answers.length }
                ].map((stat, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-zinc-300">{stat.label}</span>
                      <span className={`text-lg font-bold text-${stat.color}-400`}>{stat.count}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-${stat.color}-500 transition-all duration-1000 ease-out`}
                        style={{ width: stat.total > 0 ? `${(stat.count / stat.total) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-5 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  <strong className="text-white">Pro Tip:</strong> Focus your review on any answers scoring 3 or below. The AI feedback will provide specific frameworks like STAR to structure your responses better.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Feedback Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center text-xl">📝</span>
            Question-by-Question Analysis
          </h2>
          
          <div className="space-y-4">
            {result.question_answers.map((item, index) => {
              const isExpanded = expandedIndex === index;
              const isPerfect = item.score === 5;
              const isGood = item.score === 4;
              const isAverage = item.score === 3;
              
              const scoreBadgeColor = isPerfect ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                      isGood ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                                      isAverage ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                      'bg-rose-500/10 text-rose-400 border-rose-500/30';
                                      
              return (
                <div
                  key={index}
                  className={`bg-white/[0.02] border transition-all duration-300 rounded-3xl overflow-hidden ${
                    isExpanded ? 'border-white/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]' : 'border-white/[0.05] hover:border-white/10 hover:bg-white/[0.03]'
                  }`}
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full px-8 py-6 flex items-start justify-between text-left group"
                  >
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className={`px-4 py-1 rounded-full text-sm font-bold border ${scoreBadgeColor}`}>
                          Score: {item.score}/5
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-white leading-relaxed mb-1 line-clamp-2">
                        {item.question}
                      </h4>
                      {!isExpanded && (
                        <p className="text-sm text-zinc-500 line-clamp-1">
                          {item.answer}
                        </p>
                      )}
                    </div>
                    <div className={`mt-2 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isExpanded ? 'bg-white/10 border-white/20 text-white rotate-180' : 'bg-transparent border-white/10 text-zinc-500 group-hover:text-white group-hover:border-white/30'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-8 pb-8 animate-fade-in-up">
                      <div className="pt-6 border-t border-white/10 space-y-6">
                        {/* Full Question */}
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-6">
                          <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="text-cyan-400">❓</span> The Question
                          </h5>
                          <p className="text-white leading-relaxed">{item.question}</p>
                        </div>

                        {/* Your Answer */}
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-6">
                          <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="text-violet-400">🎙️</span> Your Response
                          </h5>
                          <p className="text-zinc-300 leading-relaxed italic">{item.answer || "No response provided."}</p>
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                          <div className={`absolute top-0 left-0 w-1 h-full ${
                            isPerfect ? 'bg-emerald-500' : isGood ? 'bg-cyan-500' : isAverage ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></div>
                          <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="text-yellow-400">💡</span> Expert AI Feedback
                          </h5>
                          <p className="text-white leading-relaxed whitespace-pre-wrap">{item.feedback}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => router.push('/interviewprep')}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => router.push('/interview/start')}
            className="flex-[2] group relative inline-flex items-center justify-center py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] overflow-hidden gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Another Simulation
          </button>
        </div>
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
