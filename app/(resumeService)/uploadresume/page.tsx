'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { uploadResume } from '@/lib/api';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import { validateResumeFile } from '@/lib/validators';

interface UploadResponse {
  message: string;
  data?: {
    resume_id: string;
    user_id: string;
    filename: string;
    extracted_data: {
      name: string;
      email: string;
      phone: string;
      skills: string[];
      experience: string[];
      education: string[];
    };
  };
  error_code?: string;
}

export default function UploadResumePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-violet-500/20"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
      </div>
    );
  }

  const allowedExtensions = ['.pdf', '.docx', '.txt'];

  const validateFile = (selectedFile: File): boolean => {
    // Use the validator function from validators.ts
    const error = validateResumeFile(selectedFile);
    if (error) {
      setError(error);
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    setError('');
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadResume(file);
      setUploadResponse({ message: 'Resume uploaded successfully!', data: result });
      setFile(null);
      setFileName('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload resume. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />

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

      <div className="relative max-w-3xl mx-auto px-6 py-16 z-10">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-medium mb-6">
            <span className="text-lg">📄</span>
            Resume Upload
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Let AI extract your profile.
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Upload your resume securely. Our advanced AI will extract your skills, experience, and education to prepare for precise job matching.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 hover:bg-white/[0.03] transition-colors relative overflow-hidden animate-fade-in-up shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.15)] scale-[1.02]' 
                : 'border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.02]'
            }`}
          >
            <label htmlFor="file-input" className="cursor-pointer block w-full h-full">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${dragActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-zinc-400'}`}>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white mb-2 tracking-tight">Drop your resume here</p>
              <p className="text-zinc-400 mb-6 font-medium">or click to browse your files</p>
              
              <div className="flex items-center justify-center gap-4 text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500/80"></div>PDF</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/80"></div>DOCX</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>TXT</span>
                <span className="ml-2 text-zinc-600 border-l border-zinc-700 pl-4">Max 10MB</span>
              </div>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {fileName && (
            <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${
                  fileName.endsWith('.pdf') ? 'bg-red-500/20 text-red-400' :
                  fileName.endsWith('.docx') ? 'bg-blue-500/20 text-blue-400' :
                  'bg-zinc-500/20 text-zinc-400'
                }`}>
                  {fileName.endsWith('.pdf') && '📄'}
                  {fileName.endsWith('.docx') && '📝'}
                  {fileName.endsWith('.txt') && '📃'}
                </div>
                <div>
                  <p className="font-semibold text-white tracking-tight">{fileName}</p>
                  <p className="text-sm text-zinc-500 font-medium">{file && `${(file.size / 1024).toFixed(2)} KB`}</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setFileName(''); }}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                title="Remove file"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] overflow-hidden"
            >
              {uploading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Extracting with AI...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload & Analyze
                </span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-red-400 flex items-center gap-3 animate-fade-in-up">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {uploadResponse && (
          <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xl font-bold text-emerald-400 tracking-tight">Resume processed successfully!</p>
            </div>
            
            {uploadResponse.data?.extracted_data && (
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Extracted Profile</h3>
                
                {uploadResponse.data.extracted_data.name && (
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-500 mt-0.5">👤</span>
                    <div>
                      <span className="text-xs text-zinc-500 block mb-0.5">Full Name</span>
                      <span className="text-white font-medium">{uploadResponse.data.extracted_data.name}</span>
                    </div>
                  </div>
                )}
                
                {uploadResponse.data.extracted_data.email && (
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-500 mt-0.5">📧</span>
                    <div>
                      <span className="text-xs text-zinc-500 block mb-0.5">Email Address</span>
                      <span className="text-white font-medium">{uploadResponse.data.extracted_data.email}</span>
                    </div>
                  </div>
                )}
                
                {uploadResponse.data.extracted_data.skills.length > 0 && (
                  <div className="pt-2 border-t border-white/5 mt-4">
                    <span className="text-xs text-zinc-500 block mb-3">Extracted Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {uploadResponse.data.extracted_data.skills.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 border border-white/5 rounded-lg text-sm text-zinc-300 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <Link 
                href="/GetResume" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-semibold transition-colors"
              >
                View All Resumes
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
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
