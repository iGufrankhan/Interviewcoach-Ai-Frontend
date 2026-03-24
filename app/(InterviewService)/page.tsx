'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/withProtectedRoute';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </div>
          
          <div className="flex gap-8 items-center">
            <Link 
              href="/UploadResume" 
              className="text-slate-300 hover:text-blue-400 transition font-medium"
            >
              My Resume
            </Link>
            <div className="text-sm text-slate-400">
              {user?.email || 'User'}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userEmail');
                router.push('/');
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome, <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </h1>
          <p className="text-slate-400 text-lg">Prepare for your next interview with AI-powered insights</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Add Resume Card */}
          <Link
            href="/UploadResume"
            className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-blue-500/50 rounded-lg p-8 transition duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
          >
            <div className="mb-4 text-4xl">📄</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">Add Resume</h3>
            <p className="text-slate-400">Upload and parse your resume to get started with analysis</p>
          </Link>

          {/* Analyze Resume Card */}
          <Link
            href="/GetResumeData"
            className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-cyan-500/50 rounded-lg p-8 transition duration-300 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
          >
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition">Analyze Resume</h3>
            <p className="text-slate-400">Match your resume with job descriptions and get insights</p>
          </Link>

          {/* My Resume Card */}
          <Link
            href="/GetResume"
            className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-purple-500/50 rounded-lg p-8 transition duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
          >
            <div className="mb-4 text-4xl">📋</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">My Resumes</h3>
            <p className="text-slate-400">View and manage all your uploaded resumes</p>
          </Link>

          {/* Schedule Interview Card */}
          <Link
            href="/dashboard"
            className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-green-500/50 rounded-lg p-8 transition duration-300 hover:shadow-lg hover:shadow-green-500/20 cursor-pointer"
          >
            <div className="mb-4 text-4xl">🎤</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition">Schedule Interview</h3>
            <p className="text-slate-400">Practice interview questions generated by AI</p>
          </Link>

          {/* Interview Results Card */}
          <Link
            href="/interview-results"
            className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-yellow-500/50 rounded-lg p-8 transition duration-300 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer"
          >
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition">Interview Results</h3>
            <p className="text-slate-400">Review your interview performance and feedback</p>
          </Link>

          {/* Job Matching Results Card */}
          <Link
            href="/AnalysisResume"
            className="group bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-indigo-500/50 rounded-lg p-8 transition duration-300 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
          >
            <div className="mb-4 text-4xl">💼</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition">Job Matches</h3>
            <p className="text-slate-400">View your job matching analysis results</p>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-slate-700/50">
          <div className="bg-slate-800/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
            <div className="text-slate-400">Resumes Uploaded</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">0</div>
            <div className="text-slate-400">Interviews Completed</div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
            <div className="text-slate-400">Jobs Analyzed</div>
          </div>
        </div>
      </main>
    </div>
  );
}
