'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/withProtectedRoute';
import ChatWidget from '@/app/chatbot/ChatWidget';

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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            🚀 Interview Coach AI
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3 items-center">
            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userEmail');
                router.push('/');
              }}
              className="px-4 py-2 text-sm font-medium bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition duration-300 shadow-lg hover:shadow-red-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section with Stats */}
        <div className="mb-16">
          <div className="bg-linear-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-2xl p-10 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  Welcome back, <br/>
                  <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </h1>
                <p className="text-slate-300 text-lg mb-6">
                  Your AI-powered interview preparation companion is ready to help you ace your next interview.
                </p>
                <Link
                  href="/UploadResume"
                  className="inline-block px-8 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition duration-300"
                >
                  Get Started →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">0</div>
                  <div className="text-sm text-slate-300">Resumes</div>
                </div>
                <div className="bg-linear-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">0</div>
                  <div className="text-sm text-slate-300">Interviews</div>
                </div>
                <div className="bg-linear-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
                  <div className="text-sm text-slate-300">Matched</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold">⚡ Quick Actions</h2>
            <div className="flex-1 h-px bg-linear-to-r from-slate-600 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link
              href="/UploadResume"
              className="group relative bg-linear-to-br from-blue-600/20 to-blue-700/10 border border-blue-500/50 hover:border-blue-400 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:shadow-blue-500/30"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">📄</div>
              <h3 className="font-bold text-slate-200 mb-1">Upload Resume</h3>
              <p className="text-sm text-slate-400">Add a new resume</p>
            </Link>

            <Link
              href="/GetResumeData"
              className="group relative bg-linear-to-br from-cyan-600/20 to-cyan-700/10 border border-cyan-500/50 hover:border-cyan-400 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">🔍</div>
              <h3 className="font-bold text-slate-200 mb-1">Job Analysis</h3>
              <p className="text-sm text-slate-400">Match with jobs</p>
            </Link>

            <Link
              href="/GetResume"
              className="group relative bg-linear-to-br from-purple-600/20 to-purple-700/10 border border-purple-500/50 hover:border-purple-400 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:shadow-purple-500/30"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">📋</div>
              <h3 className="font-bold text-slate-200 mb-1">My Resumes</h3>
              <p className="text-sm text-slate-400">View all resumes</p>
            </Link>

            <Link
              href="/interviewprep"
              className="group relative bg-linear-to-br from-green-600/20 to-green-700/10 border border-green-500/50 hover:border-green-400 rounded-xl p-6 transition duration-300 hover:shadow-lg hover:shadow-green-500/30"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition duration-300">🎤</div>
              <h3 className="font-bold text-slate-200 mb-1">Interview Prep</h3>
              <p className="text-sm text-slate-400">Practice questions</p>
            </Link>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold">✨ Main Features</h2>
            <div className="flex-1 h-px bg-linear-to-r from-slate-600 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Resume Analysis */}
            <Link
              href="/GetResumeData"
              className="group bg-linear-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-8 transition duration-300 hover:shadow-xl hover:shadow-cyan-500/20 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300 transform">🎯</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-100 group-hover:text-cyan-300 transition">Resume Matching</h3>
                <p className="text-slate-400 mb-4">Analyze how well your resume matches job descriptions with AI-powered insights</p>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  Explore <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* Interview Practice */}
            <Link
              href="/interviewprep"
              className="group bg-linear-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-green-500/50 rounded-xl p-8 transition duration-300 hover:shadow-xl hover:shadow-green-500/20 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300 transform">🚀</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-100 group-hover:text-green-300 transition">Interview Practice</h3>
                <p className="text-slate-400 mb-4">Get AI-generated interview questions and practice your responses with detailed feedback</p>
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  Start Practice <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* Performance Insights */}
            <Link
              href="/interview-results"
              className="group bg-linear-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-yellow-500/50 rounded-xl p-8 transition duration-300 hover:shadow-xl hover:shadow-yellow-500/20 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300 transform">📊</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-100 group-hover:text-yellow-300 transition">Performance Insights</h3>
                <p className="text-slate-400 mb-4">Review detailed analytics of your interview sessions and get personalized recommendations</p>
                <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                  View Results <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* Job Matches */}
            <Link
              href="/AnalysisResume"
              className="group bg-linear-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl p-8 transition duration-300 hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300 transform">💼</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-100 group-hover:text-indigo-300 transition">Top Job Matches</h3>
                <p className="text-slate-400 mb-4">Discover the best job opportunities that align with your skills and experience</p>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  View Matches <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* My Resumes */}
            <Link
              href="/GetResume"
              className="group bg-linear-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-purple-500/50 rounded-xl p-8 transition duration-300 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300 transform">📁</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-100 group-hover:text-purple-300 transition">Resume Library</h3>
                <p className="text-slate-400 mb-4">Manage and organize all your resumes in one convenient location</p>
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  Manage <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>

            {/* Getting Started */}
            <div className="group bg-linear-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 hover:border-blue-500/50 rounded-xl p-8 transition duration-300 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300 transform">📖</div>
                <h3 className="text-2xl font-bold mb-2 text-slate-100 group-hover:text-blue-300 transition">Getting Started</h3>
                <p className="text-slate-400 mb-4">Learn the best practices and tips for using Interview Coach AI effectively</p>
                <div className="flex items-center gap-2 text-blue-400 font-semibold cursor-default">
                  Documentation <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Recommendations */}
        <div className="bg-linear-to-r from-slate-800/40 to-slate-700/40 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            💡 Pro Tips for Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Update Regularly</h4>
                <p className="text-sm text-slate-400">Keep your resume updated with latest skills and experiences</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🎤</div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Practice Daily</h4>
                <p className="text-sm text-slate-400">Dedicate time each day to interview practice questions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Track Progress</h4>
                <p className="text-sm text-slate-400">Monitor your improvement through our analytics dashboard</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h4 className="font-bold text-slate-100 mb-1">Apply Smart</h4>
                <p className="text-sm text-slate-400">Use job matching to find roles that fit your profile</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
