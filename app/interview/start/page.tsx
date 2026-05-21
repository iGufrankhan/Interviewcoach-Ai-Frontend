'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { startInterview, InterviewSession } from '@/lib/interview/interviewApi';
import { fetchUserResumes } from '@/lib/resume/resumeApi';
import { useAuth } from '@/lib/auth/withProtectedRoute';

interface Resume {
  resume_id: string;
  name: string;
}

export default function StartInterviewPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingResumes, setFetchingResumes] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const resumeData = await fetchUserResumes();
        console.log('Loaded resumes:', resumeData);
        setResumes(resumeData);
      } catch (err) {
        console.error('Resume loading error:', err);
        setError('Failed to load resumes');
      } finally {
        setFetchingResumes(false);
      }
    };

    if (!isLoading && user) {
      loadResumes();
    }
  }, [user, isLoading]);

  if (isLoading || fetchingResumes) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-cyan-500/20"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (!selectedResume) {
      setError('Please select a resume');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting interview with resume ID:', selectedResume);
      const session: InterviewSession = await startInterview(
        jobDescription,
        selectedResume,
        jobTitle
      );
      
      // Save questions to sessionStorage for the interview page
      sessionStorage.setItem(`interview_questions_${session.session_id}`, JSON.stringify(session.questions));
      
      // Navigate to interview taking page
      router.push(`/interview/take/${session.session_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            InterviewCoach<span className="text-cyan-500">.ai</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/interviewprep" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              Interview History
            </Link>
            <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative max-w-4xl mx-auto px-6 py-12 z-10">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6">
            <span className="text-lg">⚡</span>
            Interview Setup
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Configure Your Simulator
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Provide the target role details and select your resume. Our AI will instantly craft a hyper-realistic interview tailored to your exact profile.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 animate-fade-in-up">
            {/* Form */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <form onSubmit={handleStartInterview} className="space-y-6 relative z-10">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2">
                    Target Job Title
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                      💼
                    </div>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Senior React Developer"
                      className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Resume Selection */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2 flex justify-between items-end">
                    <span>Select Professional Profile</span>
                    {resumes.length === 0 && (
                      <Link href="/UploadResume" className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors">
                        Upload a resume first →
                      </Link>
                    )}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                      📄
                    </div>
                    {resumes.length > 0 ? (
                      <select
                        value={selectedResume}
                        onChange={(e) => setSelectedResume(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0f172a] text-zinc-500">Choose a resume to base questions on...</option>
                        {resumes.map((resume) => (
                          <option key={resume.resume_id} value={resume.resume_id} className="bg-[#0f172a] text-white">
                            {resume.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full pl-11 pr-4 py-3.5 bg-white/[0.01] border border-red-500/20 rounded-xl text-zinc-500">
                        No resumes found in your portfolio.
                      </div>
                    )}
                    {resumes.length > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-2 flex justify-between items-end">
                    <span>Target Job Description</span>
                    <span className="text-xs font-normal text-zinc-500">{jobDescription.length > 0 ? `${jobDescription.length} chars` : ''}</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none text-zinc-500">
                      📝
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the complete job description here. The more detailed, the better the AI can tailor the interview questions..."
                      rows={8}
                      className="w-full pl-11 pr-4 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none custom-scrollbar"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-fade-in-up">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !selectedResume || !jobTitle.trim() || !jobDescription.trim()}
                  className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] overflow-hidden mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Initializing AI Simulator...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Launch Interview Protocol
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Tips */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 sticky top-24">
              <h3 className="font-bold text-cyan-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-lg">💡</span>
                Simulation Rules
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</span>
                  <span className="text-zinc-300 text-sm leading-relaxed">You will receive <strong className="text-white">2 targeted questions</strong> specifically tailored to this role.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</span>
                  <span className="text-zinc-300 text-sm leading-relaxed">You may respond via <strong className="text-white">voice recording</strong> or <strong className="text-white">text input</strong> based on your preference.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</span>
                  <span className="text-zinc-300 text-sm leading-relaxed">Each response is scored out of <strong className="text-white">5 points</strong>, yielding a final <strong className="text-white">10-point scale</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">4</span>
                  <span className="text-zinc-300 text-sm leading-relaxed">AI will evaluate clarity, relevance, STAR method adherence, and communication flow.</span>
                </li>
              </ul>
            </div>
          </div>
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

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
