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
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${API_BASE_URL}/resume/api/user-resumes`,
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
        setError(data.message || 'Failed to load resumes');
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
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(
        `${API_BASE_URL}/jobmatching/api/analyseresume`,
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
        setError(data.message || data.detail || 'Analysis failed');
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
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-900/30 to-green-800/30 border-green-600/30';
    if (score >= 60) return 'from-yellow-900/30 to-yellow-800/30 border-yellow-600/30';
    return 'from-red-900/30 to-red-800/30 border-red-600/30';
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/GetResume" className="text-slate-300 hover:text-cyan-400 transition">
              📂 My Resumes
            </Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-blue-400 transition">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            📊 Job Matching Analysis
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Analyze how your resume matches any job description. Get detailed scoring, identify skill gaps, and receive personalized improvement suggestions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Selection */}
          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-6">Step 1: Select Your Resume</h2>
            
            {loadingResumes ? (
              <div className="text-center py-8">
                <p className="text-slate-300">⚙️ Loading resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-300 mb-4">No resumes uploaded yet</p>
                <Link
                  href="/UploadResume"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Upload Resume →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <button
                    key={resume.resume_id}
                    onClick={() => setSelectedResume(resume)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      selectedResume?.resume_id === resume.resume_id
                        ? 'bg-blue-900/40 border-blue-600/50'
                        : 'bg-slate-700/20 border-slate-600/50 hover:border-blue-400/50'
                    }`}
                  >
                    <p className="font-semibold text-slate-300 truncate">📄 {resume.name}</p>
                    {resume.email && (
                      <p className="text-sm text-slate-400 mt-1">📧 {resume.email}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Skills: {resume.skills && resume.skills.slice(0, 3).join(', ')}
                      {resume.skills && resume.skills.length > 3 ? '...' : ''}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {selectedResume && (
              <div className="mt-6 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                <p className="text-green-400 text-sm">✅ Selected: {selectedResume.name}</p>
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Step 2: Paste Job Description</h2>
            
            <div className="space-y-4">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="w-full h-64 bg-slate-800 border border-slate-600 rounded-lg p-4 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
              />

              <div className="text-sm text-slate-400">
                {jobDescription.length > 0 && `${jobDescription.length} characters`}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-8 text-red-300">
            ❌ {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !selectedResume || !jobDescription.trim()}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition transform ${
              analyzing || !selectedResume || !jobDescription.trim()
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:scale-105'
            }`}
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚙️</span> Analyzing...
              </span>
            ) : (
              '🔍 Analyze Match'
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* Overall Score - Large Card */}
            <div className={`bg-linear-to-r ${getScoreBgColor(result.overallScore)} border rounded-xl p-8`}>
              <div className="text-center">
                <p className="text-slate-300 mb-2">Overall Match Score</p>
                <p className={`text-7xl font-bold ${getScoreColor(result.overallScore)} mb-4`}>
                  {result.overallScore}/100
                </p>
                <p className="text-slate-300 text-lg">
                  {result.overallScore >= 80 && '🎉 Excellent match! You\'re a very strong fit for this role.'}
                  {result.overallScore >= 60 && result.overallScore < 80 && '👍 Good match! You have most of the required qualifications.'}
                  {result.overallScore >= 40 && result.overallScore < 60 && '⚠️ Moderate match. Consider addressing the key gaps below.'}
                  {result.overallScore < 40 && '📚 Significant gap. Focus on developing the missing skills.'}
                </p>
              </div>
            </div>

            {/* Detailed Score Breakdown */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <p className="text-slate-300 mb-2">Experience Fit</p>
                <p className={`text-4xl font-bold ${getScoreColor(result.experienceFit)}`}>
                  {result.experienceFit}%
                </p>
                <div className="mt-4 w-full bg-slate-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      result.experienceFit >= 80
                        ? 'bg-green-500'
                        : result.experienceFit >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${result.experienceFit}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">How well your experience matches</p>
              </div>

              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <p className="text-slate-300 mb-2">Skills Match</p>
                <p className={`text-4xl font-bold ${getScoreColor(result.skillsMatch)}`}>
                  {result.skillsMatch}%
                </p>
                <div className="mt-4 w-full bg-slate-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      result.skillsMatch >= 80
                        ? 'bg-green-500'
                        : result.skillsMatch >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${result.skillsMatch}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Technical skills alignment</p>
              </div>

              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <p className="text-slate-300 mb-2">Role Compatibility</p>
                <p className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3)}%
                </p>
                <div className="mt-4 w-full bg-slate-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3) >= 80
                        ? 'bg-green-500'
                        : Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3) >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.round((result.overallScore + result.experienceFit + result.skillsMatch) / 3)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Overall fit for the position</p>
              </div>
            </div>

            {/* Strengths */}
            {result.strengths && Array.isArray(result.strengths) && result.strengths.length > 0 && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-green-400 mb-4">✅ Your Strengths</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.strengths.slice(0, 5).map((strength, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                      <span className="text-green-400 text-xl mt-1">✓</span>
                      <span className="text-slate-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {result.missingSkills && Array.isArray(result.missingSkills) && result.missingSkills.length > 0 && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">⚠️ Skills Gap to Address</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.missingSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                      <span className="text-yellow-400 text-xl mt-1">•</span>
                      <span className="text-slate-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            {result.suggestions && Array.isArray(result.suggestions) && result.suggestions.length > 0 && (
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">💡 Actionable Suggestions</h3>
                <div className="space-y-4">
                  {result.suggestions.slice(0, 5).map((suggestion, idx) => (
                    <div key={idx} className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-300 leading-relaxed">
                            {suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-linear-to-r from-blue-900/40 to-cyan-900/40 border border-blue-600/30 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">🎯 Ready to Prepare for Interview?</h3>
              <p className="text-slate-300 mb-6">Get 10 personalized interview questions based on this job and your resume to practice and improve.</p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition transform hover:scale-105"
              >
                Generate Interview Questions →
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
