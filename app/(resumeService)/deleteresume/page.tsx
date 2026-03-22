'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Resume {
  resume_id: string;
  filename: string;
  created_at: string;
  extracted_data: {
    name: string;
    email: string;
    skills: string[];
  };
}

export default function DeleteResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedForDelete, setSelectedForDelete] = useState<Resume | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletedResumes, setDeletedResumes] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id') || 'default-user';
      
      const response = await fetch(`/api/get-resumes/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setResumes(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch resumes');
      }
    } catch (err) {
      setError('Failed to load resumes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return;

    setDeleting(true);
    try {
      const userId = localStorage.getItem('user_id') || 'default-user';
      
      const response = await fetch(`/api/delete-resume/${userId}/${selectedForDelete.resume_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (response.ok) {
        setDeletedResumes([...deletedResumes, selectedForDelete.resume_id]);
        setResumes(resumes.filter(r => r.resume_id !== selectedForDelete.resume_id));
        setSelectedForDelete(null);
        setConfirmDelete(false);
      } else {
        alert('Failed to delete resume');
      }
    } catch (err) {
      alert('Error deleting resume');
    } finally {
      setDeleting(false);
    }
  };

  const activeResumes = resumes.filter(r => !deletedResumes.includes(r.resume_id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/getresume" className="text-slate-300 hover:text-cyan-400 transition">
              📂 My Resumes
            </Link>
            <Link href="/" className="text-slate-300 hover:text-blue-400 transition">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🗑️ Delete Resumes
          </h1>
          <p className="text-xl text-slate-300">Manage and delete your resume files.</p>
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

        {!loading && activeResumes.length === 0 && !selectedForDelete && (
          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-xl text-slate-300 mb-6">No resumes to delete. Your collection is clean!</p>
            <Link
              href="/getresume"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >
              View All Resumes →
            </Link>
          </div>
        )}

        {!loading && activeResumes.length > 0 && (
          <div>
            {confirmDelete && selectedForDelete ? (
              <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-600/50 rounded-xl p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Confirm Deletion</h2>
                
                <div className="bg-slate-800 rounded-lg p-4 mb-6">
                  <p className="text-slate-300 font-semibold mb-2">{selectedForDelete.filename}</p>
                  {selectedForDelete.extracted_data.name && (
                    <p className="text-slate-400 text-sm">👤 {selectedForDelete.extracted_data.name}</p>
                  )}
                </div>

                <p className="text-slate-300 mb-6">
                  This action cannot be undone. Are you sure you want to delete this resume?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setConfirmDelete(false);
                      setSelectedForDelete(null);
                    }}
                    disabled={deleting}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    ✕ Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {deleting ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-300 mb-4">
                  {activeResumes.length} resume{activeResumes.length !== 1 ? 's' : ''} available
                </p>
                
                {activeResumes.map((resume) => (
                  <div
                    key={resume.resume_id}
                    className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 flex items-center justify-between hover:border-red-400/50 transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-300 mb-1">{resume.filename}</p>
                      <div className="text-sm text-slate-400 space-y-1">
                        {resume.extracted_data.name && (
                          <p>👤 {resume.extracted_data.name}</p>
                        )}
                        <p>📅 {new Date(resume.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedForDelete(resume);
                        setConfirmDelete(true);
                      }}
                      className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition whitespace-nowrap"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}

                {deletedResumes.length > 0 && (
                  <div className="mt-8 p-4 bg-green-900/30 border border-green-600/50 rounded-lg text-green-300">
                    ✅ Successfully deleted {deletedResumes.length} resume{deletedResumes.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/getresume"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            ← Back to Resumes
          </Link>
        </div>
      </div>
    </div>
  );
}
