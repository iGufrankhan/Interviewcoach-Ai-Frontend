'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/withProtectedRoute';

interface Resume {
  resume_id: string;
  name: string;
  email: string;
  skills: string[];
  experience?: string[];
  education?: string[];
  projects?: string[];
  created_at?: string;
}

interface AnalysisResult {
  overallScore: number;
  experienceFit: number;
  skillsMatch: number;
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
  matchCategories?: {
    technical: number;
    experience: number;
    cultural: number;
  };
}

export default function JobMatchingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://interviewcoach-ai-backend.onrender.com';
      
      const response = await fetch(
        `${API_BASE_URL}/api/resume/user-resumes`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setResumes(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedResume(data.data[0]);
        }
      } else {
        // Handle Pydantic validation errors
        let errorMessage = 'Failed to load resumes';
        if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail
              .map((err: any) => err.msg || JSON.stringify(err))
              .join('; ');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
      setError('Error loading resumes. Please refresh the page.');
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume || !jobDescription.trim()) {
      setError('Please select a resume and enter a job description');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://interviewcoach-ai-backend.onrender.com';
      const response = await fetch(
        `${API_BASE_URL}/api/jobmatching/analyseresume`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({
            resume_id: selectedResume.resume_id,
            description: jobDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle Pydantic validation errors (detail is an array of error objects)
        let errorMessage = 'Analysis failed';
        if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          if (Array.isArray(data.detail)) {
            // Extract error messages from Pydantic validation errors
            errorMessage = data.detail
              .map((err: any) => err.msg || JSON.stringify(err))
              .join('; ');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        }
        setError(errorMessage);
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20';
    if (score >= 60) return 'from-amber-500/10 to-amber-500/5 border-amber-500/20';
    return 'from-rose-500/10 to-rose-500/5 border-rose-500/20';
  };

  // Show loading while checking authentication
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

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

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
            <Link href="/GetResume" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              My Resumes
            </Link>
            <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6">
            <span className="text-lg">🎯</span>
            Job Matching Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Discover your perfect fit.
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Analyze how your resume matches any job description. Get detailed scoring, identify skill gaps, and receive highly personalized improvement suggestions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Selection */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm">1</span>
              Select Your Resume
            </h2>
            
            {loadingResumes ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500 mb-6">No resumes uploaded yet</p>
                <Link
                  href="/UploadResume"
                  className="inline-flex items-center justify-center px-6 py-3 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30"
                >
                  Upload Resume →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume, idx) => (
                  <button
                    key={resume.resume_id || `resume-${idx}`}
                    onClick={() => setSelectedResume(resume)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                      selectedResume?.resume_id === resume.resume_id
                        ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                        : 'bg-white/[0.02] border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-semibold ${selectedResume?.resume_id === resume.resume_id ? 'text-cyan-300' : 'text-white'} truncate flex items-center gap-2`}>
                          📄 {resume.name}
                        </p>
                        {resume.email && (
                          <p className="text-xs text-zinc-500 mt-1">{resume.email}</p>
                        )}
                      </div>
                      {selectedResume?.resume_id === resume.resume_id && (
                        <span className="text-cyan-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-3 flex flex-wrap gap-1">
                      {resume.skills && resume.skills.slice(0, 4).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 rounded-md">{s}</span>
                      ))}
                      {resume.skills && resume.skills.length > 4 && (
                        <span className="px-2 py-0.5 bg-white/5 rounded-md text-zinc-500">+{resume.skills.length - 4}</span>
                      )}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm">2</span>
              Paste Job Description
            </h2>
            
            <div className="space-y-4">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="w-full h-64 bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none transition-colors"
              />

              <div className="text-xs font-medium text-zinc-500 flex justify-end">
                {jobDescription.length > 0 ? `${jobDescription.length} characters` : '0 characters'}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-red-400 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{typeof error === 'string' ? error : 'An error occurred. Please try again.'}</span>
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !selectedResume || !jobDescription.trim()}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing match...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Analyze Match
              </span>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Overall Score - Large Card */}
            <div className={`bg-linear-to-r ${getScoreBgColor(result.overallScore)} border rounded-3xl p-10 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/[0.02]"></div>
              <div className="relative z-10 text-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
                  Overall Match Score
                </div>
                <p className={`text-8xl font-bold tracking-tighter ${getScoreColor(result.overallScore)} mb-6 drop-shadow-lg`}>
                  {result.overallScore}<span className="text-4xl text-white/40">/100</span>
                </p>
                <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                  {result.overallScore >= 80 && '🎉 Exceptional fit! You possess the key qualifications to thrive in this role.'}
                  {result.overallScore >= 60 && result.overallScore < 80 && '👍 Solid match! You have the core qualifications, with minor areas for growth.'}
                  {result.overallScore >= 40 && result.overallScore < 60 && '⚠️ Moderate alignment. Focus on addressing the specific gaps highlighted below.'}
                  {result.overallScore < 40 && '📚 Foundational gap. Significant upskilling recommended for this particular role.'}
                </p>
              </div>
            </div>

            {/* Detailed Score Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Experience Fit</p>
                <p className={`text-5xl font-bold tracking-tight mb-4 ${getScoreColor(result.experienceFit)}`}>
                  {result.experienceFit}%
                </p>
                <div className="w-full bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.experienceFit >= 80 ? 'bg-emerald-500' : result.experienceFit >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${result.experienceFit}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">Alignment of your professional journey with role requirements.</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Skills Match</p>
                <p className={`text-5xl font-bold tracking-tight mb-4 ${getScoreColor(result.skillsMatch)}`}>
                  {result.skillsMatch}%
                </p>
                <div className="w-full bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.skillsMatch >= 80 ? 'bg-emerald-500' : result.skillsMatch >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${result.skillsMatch}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">Technical and domain-specific capability intersection.</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors">
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Role Compatibility</p>
                <p className={`text-5xl font-bold tracking-tight mb-4 ${getScoreColor(result.overallScore)}`}>
                  {Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3)}%
                </p>
                <div className="w-full bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3) >= 80 ? 'bg-emerald-500' : Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3) >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3)}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">Holistic assessment of your fit for the position.</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Strengths */}
              {result.strengths && Array.isArray(result.strengths) && result.strengths.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">✅</span>
                    Your Dominant Strengths
                  </h3>
                  <div className="space-y-4">
                    {result.strengths.slice(0, 5).map((strength, idx) => (
                      <div key={`strength-${idx}`} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/[0.02]">
                        <span className="text-emerald-400 mt-0.5">✦</span>
                        <span className="text-zinc-300 text-sm leading-relaxed">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {result.missingSkills && Array.isArray(result.missingSkills) && result.missingSkills.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">⚠️</span>
                    Strategic Skill Gaps
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill, idx) => (
                      <div key={`missing-skill-${idx}`} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm font-medium">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Improvement Suggestions */}
            {result.suggestions && Array.isArray(result.suggestions) && result.suggestions.length > 0 && (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
                <h3 className="text-xl font-bold text-cyan-400 mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-lg">💡</span>
                  Actionable Recommendations
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.suggestions.slice(0, 6).map((suggestion, idx) => (
                    <div key={`suggestion-${idx}`} className="flex gap-4 p-5 bg-white/5 border border-white/[0.02] rounded-2xl hover:bg-white/[0.07] transition-colors">
                      <div className="flex-shrink-0">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs">
                          {idx + 1}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="relative rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/[0.05] p-12 text-center mt-12">
              <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Ready to command the interview?</h3>
                <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
                  Get highly targeted, AI-generated interview questions based on this exact job and your resume. Practice until perfection.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]"
                >
                  Generate Interview Scenarios →
                </Link>
              </div>
            </div>
          </div>
        )}
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
