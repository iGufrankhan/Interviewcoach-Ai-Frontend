'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUserResumes, generateInterviewQuestions } from '@/lib/api';

interface Resume {
  resume_id: string;
  filename: string;
  created_at: string;
  extracted_data: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string[];
    education: string[];
  };
}

export default function InterviewServicePage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id') || 'default-user';
      const resumesData = await fetchUserResumes(userId);
      setResumes(resumesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerateError('');

    if (!selectedResumeId) {
      setGenerateError('Please select a resume');
      return;
    }

    if (!jobDescription.trim()) {
      setGenerateError('Please enter a job description');
      return;
    }

    try {
      setGenerating(true);
      const questions = await generateInterviewQuestions(jobDescription, selectedResumeId);
      
      // Store questions in localStorage for display on results page
      localStorage.setItem('interviewQuestions', JSON.stringify({
        questions: questions,
        jobDescription: jobDescription,
        timestamp: new Date().toISOString(),
      }));
      router.push('/interview-results');
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Error generating questions. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </Link>
          <div className="flex gap-4">
            <Link href="/getresume" className="text-slate-300 hover:text-white transition">My Resumes</Link>
            <Link href="/settings" className="text-slate-300 hover:text-white transition">Settings</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Interview Question Generator
          </h1>
          <p className="text-xl text-slate-300">
            Upload your resume and job description to generate personalized interview questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Resume Selection */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Selected Resume</h2>
            
            {loading ? (
              <div className="text-slate-400">Loading resumes...</div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded p-4 text-red-400 mb-6">
                {error}
              </div>
            ) : (
              <>
                {resumes.length === 0 ? (
                  <div className="text-slate-400 mb-6">
                    <p className="mb-4">No resumes found. Please upload a resume first.</p>
                    <Link href="/uploadresume" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
                      Upload Resume
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {resumes.map((resume) => (
                      <label key={resume.resume_id} className="flex items-start p-4 border border-slate-600 rounded-lg hover:border-blue-500 cursor-pointer transition bg-slate-900/50">
                        <input
                          type="radio"
                          name="resume"
                          value={resume.resume_id}
                          checked={selectedResumeId === resume.resume_id}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="mt-1 mr-4 w-5 h-5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{resume.filename}</p>
                          <p className="text-sm text-slate-400 mb-2">
                            {resume.extracted_data?.name && `Candidate: ${resume.extracted_data.name}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            Uploaded: {new Date(resume.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                
                {selectedResumeId && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 text-blue-300 text-sm">
                    ✓ Resume selected and ready
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Job Description */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6">Job Description</h2>
            
            <form onSubmit={handleGenerateQuestions} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-200">
                  Paste the Job Description:
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here. Include role, required skills, experience level, responsibilities, and qualifications..."
                  className="w-full h-48 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-slate-400 mt-2">
                  {jobDescription.length} characters entered
                </p>
              </div>

              {generateError && (
                <div className="bg-red-500/10 border border-red-500/50 rounded p-4 text-red-400 text-sm">
                  {generateError}
                </div>
              )}

              <button
                type="submit"
                disabled={generating || !selectedResumeId || !jobDescription.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105 duration-200"
              >
                {generating ? 'Generating Questions...' : 'Generate Interview Questions'}
              </button>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 backdrop-blur">
          <h3 className="text-xl font-bold mb-4">How it works:</h3>
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 font-bold text-sm flex-shrink-0">1</span>
              <span>Select a resume from your uploaded resumes</span>
            </li>
            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 font-bold text-sm flex-shrink-0">2</span>
              <span>Paste the complete job description</span>
            </li>
            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 font-bold text-sm flex-shrink-0">3</span>
              <span>Click "Generate Interview Questions"</span>
            </li>
            <li className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 font-bold text-sm flex-shrink-0">4</span>
              <span>Review and practice with AI-generated questions tailored to the job</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
