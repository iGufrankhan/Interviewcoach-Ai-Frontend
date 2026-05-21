'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUserResumes, deleteResume } from '@/lib/api';
import { useAuth } from '@/lib/auth/withProtectedRoute';

interface Resume {
  resume_id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects?: string[];
  created_at: string;
  user_id?: string;
}

export default function GetResumePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchResumes();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-cyan-500/20"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUserResumes();
      setResumes(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load resumes. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await deleteResume(resumeId);
      setResumes(resumes.filter(r => r.resume_id !== resumeId));
      if (selectedResume?.resume_id === resumeId) {
        setSelectedResume(null);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete resume';
      alert(errorMsg);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            InterviewCoach<span className="text-cyan-500">.ai</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/UploadResume" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">+</span>
              Upload
            </Link>
            <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6">
            <span className="text-lg">📂</span>
            Resume Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Your Professional Portfolio
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            View, manage, and leverage your uploaded resumes to unlock tailored job matching and interview preparation.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 font-medium">Loading your profiles...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 text-red-400 flex items-center gap-3 animate-fade-in-up">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {!loading && resumes.length === 0 && (
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-16 text-center animate-fade-in-up relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
            <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-zinc-500">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No resumes found</h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">Upload your first resume to unlock AI-powered job matching and personalized interview scenarios.</p>
            <Link
              href="/UploadResume"
              className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]"
            >
              Upload Your First Resume →
            </Link>
          </div>
        )}

        {!loading && resumes.length > 0 && (
          <div className="grid lg:grid-cols-12 gap-8 animate-fade-in-up">
            {/* Resume List */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                  Your Resumes
                </h2>
                <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs font-medium text-zinc-400">{resumes.length} total</span>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {resumes.map((resume) => (
                  <button
                    key={resume.resume_id}
                    onClick={() => setSelectedResume(resume)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      selectedResume?.resume_id === resume.resume_id
                        ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                        : 'bg-white/[0.02] border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    {selectedResume?.resume_id === resume.resume_id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"></div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <p className={`font-semibold tracking-tight truncate pr-4 ${selectedResume?.resume_id === resume.resume_id ? 'text-cyan-300' : 'text-white group-hover:text-cyan-100'}`}>
                        📄 {resume.name || 'Unnamed Resume'}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(resume.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </button>
                ))}
              </div>
              
              <Link
                href="/UploadResume"
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-white transition-all duration-300 bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-2xl hover:bg-white/10 hover:text-cyan-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload New Resume
              </Link>
            </div>

            {/* Resume Details */}
            <div className="lg:col-span-7 xl:col-span-8">
              {selectedResume ? (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors relative overflow-hidden shadow-2xl sticky top-24">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl">📋</span>
                      Resume Details
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <Link
                        href="/GetResumeData"
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl font-semibold transition-colors text-sm flex items-center gap-2"
                      >
                        ✅ Match Job
                      </Link>
                      <button
                        onClick={() => handleDelete(selectedResume.resume_id)}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl font-semibold transition-colors text-sm flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {selectedResume.name && (
                        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Full Name</p>
                          <p className="text-white font-medium text-lg">{selectedResume.name}</p>
                        </div>
                      )}

                      {selectedResume.email && (
                        <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Email Address</p>
                          <p className="text-white font-medium text-lg truncate" title={selectedResume.email}>{selectedResume.email}</p>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {selectedResume.skills && selectedResume.skills.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-cyan-400">🛠️</span>
                          <h4 className="text-zinc-300 font-semibold text-lg">Top Skills</h4>
                          <span className="px-2 py-0.5 bg-white/10 rounded-md text-xs font-medium text-zinc-400 ml-2">{selectedResume.skills.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-cyan-900/30 border border-cyan-500/20 rounded-xl text-sm font-medium text-cyan-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {selectedResume.experience && selectedResume.experience.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-violet-400">💼</span>
                          <h4 className="text-zinc-300 font-semibold text-lg">Experience Highlight</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedResume.experience.map((exp, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0"></div>
                              <p className="text-zinc-300 text-sm leading-relaxed">{exp}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {selectedResume.education && selectedResume.education.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-emerald-400">🎓</span>
                          <h4 className="text-zinc-300 font-semibold text-lg">Education</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedResume.education.map((edu, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                              <p className="text-zinc-300 text-sm leading-relaxed">{edu}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {selectedResume.projects && selectedResume.projects.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-amber-400">🚀</span>
                          <h4 className="text-zinc-300 font-semibold text-lg">Key Projects</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedResume.projects.map((proj, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                              <p className="text-zinc-300 text-sm leading-relaxed">{proj}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 text-center h-full min-h-[500px] flex flex-col items-center justify-center border-dashed">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <span className="text-3xl">👈</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Select a resume</h3>
                  <p className="text-zinc-500">Choose a resume from the list to view its full details and extracted information.</p>
                </div>
              )}
            </div>
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
        
        /* Custom Scrollbar for inner scroll areas */
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
