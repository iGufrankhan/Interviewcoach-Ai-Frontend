'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUserResumes, deleteResume } from '@/lib/api';
import { useAuth } from '@/lib/auth/withProtectedRoute';

interface Resume {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects?: string[];
  created_at: string;
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
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
      setResumes(resumes.filter(r => r.id !== resumeId));
      if (selectedResume?.id === resumeId) {
        setSelectedResume(null);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete resume';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/UploadResume" className="text-slate-300 hover:text-blue-400 transition">
              ➕ Upload
            </Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-blue-400 transition">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            📂 My Resumes
          </h1>
          <p className="text-xl text-slate-300">View, manage, and use your uploaded resumes for job matching.</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-slate-300">Loading your resumes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-8 text-red-300">
            ❌ {error}
          </div>
        )}

        {!loading && resumes.length === 0 && (
          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-slate-300 mb-6">You haven't uploaded any resumes yet.</p>
            <Link
              href="/UploadResume"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              Upload Your First Resume →
            </Link>
          </div>
        )}

        {!loading && resumes.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Resume List */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Your Resumes ({resumes.length})</h2>
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => setSelectedResume(resume)}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      selectedResume?.id === resume.id
                        ? 'bg-blue-900/40 border-blue-600/50'
                        : 'bg-slate-700/30 border-slate-600/50 hover:border-blue-400/50'
                    }`}
                  >
                    <p className="font-semibold text-slate-300 truncate">{resume.name}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
              <Link
                href="/UploadResume"
                className="w-full mt-4 block px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-center transition"
              >
                ➕ Upload New Resume
              </Link>
            </div>

            {/* Resume Details */}
            <div className="lg:col-span-2">
              {selectedResume ? (
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 sticky top-20">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">📋 Resume Details</h3>
                  
                  <div className="space-y-4">
                    {selectedResume.name && (
                      <div>
                        <p className="text-slate-400 text-sm">Name</p>
                        <p className="text-slate-300 font-semibold">{selectedResume.name}</p>
                      </div>
                    )}

                    {selectedResume.email && (
                      <div>
                        <p className="text-slate-400 text-sm">Email</p>
                        <p className="text-slate-300 font-semibold">{selectedResume.email}</p>
                      </div>
                    )}

                    {selectedResume.skills && selectedResume.skills.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-sm mb-2">🛠️ Skills ({selectedResume.skills.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedResume.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-900/50 border border-blue-600/50 rounded-full text-xs text-blue-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedResume.experience && selectedResume.experience.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-sm mb-2">💼 Experience</p>
                        <ul className="space-y-1">
                          {selectedResume.experience.map((exp, i) => (
                            <li key={i} className="text-slate-300 text-sm flex gap-2">
                              <span>•</span> {exp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedResume.education && selectedResume.education.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-sm mb-2">🎓 Education</p>
                        <ul className="space-y-1">
                          {selectedResume.education.map((edu, i) => (
                            <li key={i} className="text-slate-300 text-sm flex gap-2">
                              <span>•</span> {edu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedResume.projects && selectedResume.projects.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-sm mb-2">🚀 Projects</p>
                        <ul className="space-y-1">
                          {selectedResume.projects.map((proj, i) => (
                            <li key={i} className="text-slate-300 text-sm flex gap-2">
                              <span>•</span> {proj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Link
                      href="/GetResumeData"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-center transition text-sm"
                    >
                      ✅ Use for Matching
                    </Link>
                    <button
                      onClick={() => handleDelete(selectedResume.id || selectedResume.resume_id || '')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-12 text-center h-full flex items-center justify-center">
                  <div>
                    <div className="text-6xl mb-4">👈</div>
                    <p className="text-slate-300">Select a resume to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
