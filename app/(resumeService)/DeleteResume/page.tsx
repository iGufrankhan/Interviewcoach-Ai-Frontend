'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import { fetchUserResumes, deleteResume } from '@/lib/api';

interface Resume {
  id: string;
  filename: string;
  created_at: string;
  extracted_data: {
    name: string;
    email: string;
    skills: string[];
  };
}

export default function DeleteResumePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState<Resume | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletedResumes, setDeletedResumes] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading) {
      fetchResumes();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-rose-500/20"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      </div>
    );
  }

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await fetchUserResumes();
      setResumes(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load resumes.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return;

    setDeleting(true);
    try {
      await deleteResume(selectedForDelete.id);
      setDeletedResumes([...deletedResumes, selectedForDelete.id]);
      setResumes(resumes.filter(r => r.id !== selectedForDelete.id));
      setSelectedForDelete(null);
      setConfirmDelete(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error deleting resume';
      alert(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const activeResumes = resumes.filter(r => !deletedResumes.includes(r.id));

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-linear-to-r from-white via-rose-200 to-rose-400 bg-clip-text text-transparent">
            InterviewCoach<span className="text-rose-500">.ai</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/GetResume" className="text-zinc-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
              <span>📂</span> My Resumes
            </Link>
            <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative max-w-4xl mx-auto px-6 py-16 z-10">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-rose-300 text-sm font-medium mb-6">
            <span className="text-lg">🗑️</span>
            Data Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Delete Resumes
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Manage and permanently delete your resume files from our secure servers.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4"></div>
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

        {!loading && activeResumes.length === 0 && !selectedForDelete && (
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-16 text-center animate-fade-in-up relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-rose-500/5 to-transparent pointer-events-none"></div>
            <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-zinc-500">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">All clean!</h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">No resumes to delete. Your collection is completely clean.</p>
            <Link
              href="/GetResume"
              className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-rose-600 to-pink-600 rounded-full hover:from-rose-500 hover:to-pink-500 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.5)]"
            >
              View All Resumes →
            </Link>
          </div>
        )}

        {!loading && activeResumes.length > 0 && (
          <div className="animate-fade-in-up">
            {confirmDelete && selectedForDelete ? (
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-3xl p-10 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-rose-400 tracking-tight">Confirm Deletion</h2>
                </div>
                
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8">
                  <p className="text-white font-semibold text-lg truncate mb-2">{selectedForDelete.filename}</p>
                  {selectedForDelete.extracted_data.name && (
                    <p className="text-zinc-400 text-sm flex items-center gap-2">
                      <span className="text-rose-400">👤</span> {selectedForDelete.extracted_data.name}
                    </p>
                  )}
                </div>

                <p className="text-zinc-300 mb-8 font-medium">
                  This action cannot be undone. Are you sure you want to permanently delete this resume from our servers?
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setConfirmDelete(false);
                      setSelectedForDelete(null);
                    }}
                    disabled={deleting}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="group relative inline-flex items-center justify-center px-6 py-3.5 font-bold text-white transition-all duration-300 bg-rose-600 rounded-xl hover:bg-rose-500 disabled:opacity-50 hover:shadow-[0_0_20px_-5px_rgba(225,29,72,0.6)]"
                  >
                    {deleting ? 'Deleting...' : 'Permanently Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-xl font-bold text-white">Your Resumes</h3>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-sm font-medium text-zinc-400">
                    {activeResumes.length} available
                  </span>
                </div>
                
                {activeResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-rose-500/30 hover:bg-white/[0.04] transition-all duration-300 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white mb-2 truncate group-hover:text-rose-100 transition-colors">{resume.filename || 'Unnamed Document'}</p>
                      <div className="flex flex-wrap gap-4 text-xs font-medium text-zinc-500">
                        {resume.extracted_data.name && (
                          <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md text-zinc-400">
                            <span className="text-rose-400">👤</span> {resume.extracted_data.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                          📅 {new Date(resume.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedForDelete(resume);
                        setConfirmDelete(true);
                      }}
                      className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-500 rounded-xl font-bold transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                ))}

                {deletedResumes.length > 0 && (
                  <div className="mt-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 animate-fade-in-up">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Successfully deleted {deletedResumes.length} resume{deletedResumes.length !== 1 ? 's' : ''}.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/GetResume"
            className="inline-flex items-center gap-2 px-6 py-3 font-medium text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl"
          >
            ← Back to Resumes
          </Link>
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
