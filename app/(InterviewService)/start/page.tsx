'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { startInterview, InterviewSession } from '@/lib/interview/interviewApi';
import { fetchUserResumes } from '@/lib/resume/resumeApi';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import { validateJobDescription } from '@/lib/validators';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      setError('Please enter a job title');
      return;
    }

    // Validate job description using validator
    const jobDescError = validateJobDescription(jobDescription);
    if (jobDescError) {
      setError(jobDescError);
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Start a New Interview
          </h1>
          <p className="text-slate-300">
            Prepare for your interview with AI-powered questions and real-time feedback
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur">
          <form onSubmit={handleStartInterview} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior React Developer"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition"
              />
            </div>

            {/* Resume Selection */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Select Resume
              </label>
              {resumes.length > 0 ? (
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded text-white focus:outline-none focus:border-blue-400 transition"
                >
                  <option value="">Choose a resume...</option>
                  {resumes.map((resume) => (
                    <option key={resume.resume_id} value={resume.resume_id}>
                      {resume.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-slate-400 p-4 bg-slate-700/30 rounded border border-slate-600/30">
                  No resumes found.{' '}
                  <a href="/UploadResume" className="text-blue-400 hover:text-blue-300">
                    Upload a resume first
                  </a>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={8}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedResume}
              className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Starting Interview...
                </span>
              ) : (
                'Start Interview'
              )}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/50 rounded-lg">
          <h3 className="font-semibold text-blue-400 mb-2">💡 Tips</h3>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• You'll be asked 2 interview questions tailored to the job</li>
            <li>• Answer via audio (using your microphone) or text</li>
            <li>• Each answer will be scored out of 5</li>
            <li>• Final score will be out of 10</li>
            <li>• You'll receive detailed feedback on each answer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
