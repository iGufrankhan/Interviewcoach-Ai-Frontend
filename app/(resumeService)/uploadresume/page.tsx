'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { uploadResume } from '@/lib/api';
import { useAuth } from '@/lib/auth/withProtectedRoute';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  const allowedExtensions = ['.pdf', '.docx', '.txt'];

  const validateFile = (selectedFile: File): boolean => {
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Invalid file type. Allowed types are: PDF, DOCX, TXT');
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File size exceeds 10MB limit');
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
      const userId = localStorage.getItem('user_id') || 'default-user';
      
      console.log('🚀 Starting resume upload:');
      console.log('   User ID:', userId);
      console.log('   File:', file.name);

      const result = await uploadResume(userId, file);
      
      console.log('✅ Upload successful:', result);
      setUploadResponse({ message: 'Resume uploaded successfully!', data: result });
      setFile(null);
      setFileName('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload resume. Please try again.';
      console.error('❌ Upload failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
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

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            📄 Upload Resume
          </h1>
          <p className="text-xl text-slate-300 max-w-xl mx-auto">
            Upload your resume to extract information and prepare for job matching analysis.
          </p>
        </div>

        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-8 mb-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              dragActive ? 'border-blue-400 bg-blue-400/10' : 'border-slate-500 hover:border-blue-400'
            }`}
          >
            <label htmlFor="file-input" className="cursor-pointer block">
              <div className="text-6xl mb-4">📎</div>
              <p className="text-xl font-semibold text-slate-300 mb-2">Drop your resume here</p>
              <p className="text-slate-400 mb-4">or click to browse</p>
              <p className="text-sm text-slate-500">Supported: PDF, DOCX, TXT (Max 10MB)</p>
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
            <div className="mt-6 bg-slate-800 border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {fileName.endsWith('.pdf') && '📕'}
                    {fileName.endsWith('.docx') && '📗'}
                    {fileName.endsWith('.txt') && '📄'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-300">{fileName}</p>
                    <p className="text-sm text-slate-400">{file && `${(file.size / 1024).toFixed(2)} KB`}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full mt-8 py-3 rounded-lg font-semibold transition ${
              uploading || !file
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
            }`}
          >
            {uploading ? '⚙️ Uploading...' : '🚀 Upload Resume'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-600/50 rounded-lg p-4 mb-8 text-red-300">
            ❌ {error}
          </div>
        )}

        {uploadResponse && (
          <div className="bg-green-900/30 border border-green-600/50 rounded-xl p-6">
            <p className="text-xl font-semibold text-green-400 mb-4">✅ Resume uploaded successfully!</p>
            {uploadResponse.data?.extracted_data && (
              <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                {uploadResponse.data.extracted_data.name && (
                  <div className="text-sm text-slate-300">👤 <span className="font-semibold">Name:</span> {uploadResponse.data.extracted_data.name}</div>
                )}
                {uploadResponse.data.extracted_data.email && (
                  <div className="text-sm text-slate-300">📧 <span className="font-semibold">Email:</span> {uploadResponse.data.extracted_data.email}</div>
                )}
                {uploadResponse.data.extracted_data.skills.length > 0 && (
                  <div><p className="font-semibold text-slate-300 mb-2">🛠️ Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {uploadResponse.data.extracted_data.skills.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-900/50 rounded-full text-xs text-blue-300">{s}</span>
                    ))}
                  </div></div>
                )}
              </div>
            )}
            <Link href="/GetResume" className="inline-block mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
              View All Resumes →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
