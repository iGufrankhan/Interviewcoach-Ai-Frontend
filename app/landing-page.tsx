'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to dashboard if already logged in
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </div>
          <div className="flex gap-6 items-center">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#workflow" className="hover:text-blue-400 transition">Workflow</a>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
              Login
            </Link>
            <Link href="/OtpSend" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Interview Preparation
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get matched with dream jobs, prepare with AI-generated questions, and receive personalized feedback. Your intelligent interview coach powered by advanced LLMs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 text-center">
              Start Free Analysis
            </Link>
            <Link href="/DetailsDocs" className="border border-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg font-semibold transition text-center">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-700/30 backdrop-blur border border-slate-600/50 rounded-xl p-8 hover:border-blue-400/50 transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Resume-Job Matching</h3>
              <p className="text-slate-300 mb-4">
                Analyze how well your resume matches any job description. Get match scores (0-100), eligibility assessment, and actionable improvement suggestions.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>✓ Detailed match scoring</li>
                <li>✓ Strengths & weaknesses analysis</li>
                <li>✓ Smart improvement tips</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-700/30 backdrop-blur border border-slate-600/50 rounded-xl p-8 hover:border-cyan-400/50 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Interview Questions</h3>
              <p className="text-slate-300 mb-4">
                Generate targeted interview questions based on the job description and your resume. Prepare for role-specific scenarios.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>✓ Role-specific questions</li>
                <li>✓ Technical & behavioral mix</li>
                <li>✓ Personalized based on your resume</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-700/30 backdrop-blur border border-slate-600/50 rounded-xl p-8 hover:border-blue-400/50 transition">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-bold mb-3">Performance Analysis</h3>
              <p className="text-slate-300 mb-4">
                Practice answering questions and get AI-powered feedback. Receive scores, strengths analysis, and personalized improvement recommendations.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>✓ Instant performance scoring</li>
                <li>✓ Detailed answer feedback</li>
                <li>✓ Personalized improvement tips</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">1</div>
                  <h3 className="text-2xl font-bold">Upload Your Resume</h3>
                </div>
                <p className="text-slate-300 text-lg">
                  Start by uploading your resume in PDF or DOCX format. Our AI will extract and analyze your skills, experience, and education automatically.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50">
                <div className="text-6xl text-center">📄</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50 order-2 md:order-1">
                <div className="text-6xl text-center">🔍</div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-lg">2</div>
                  <h3 className="text-2xl font-bold">Find Your Dream Job</h3>
                </div>
                <p className="text-slate-300 text-lg">
                  Find a job description that interests you and paste it into our platform. We will match your skills and experience with the job requirements.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg">3</div>
                  <h3 className="text-2xl font-bold">Get Instant Feedback</h3>
                </div>
                <p className="text-slate-300 text-lg">
                  Receive detailed analysis of your match score, strengths, weaknesses, and specific recommendations to improve your candidacy.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50">
                <div className="text-6xl text-center">📊</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700/50 order-2 md:order-1">
                <div className="text-6xl text-center">🎤</div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center font-bold text-lg">4</div>
                  <h3 className="text-2xl font-bold">Practice & Prepare</h3>
                </div>
                <p className="text-slate-300 text-lg">
                  Generate interview questions tailored to the job and get AI-powered feedback on your answers. Practice until you are confident!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users who have successfully prepared for interviews with Interview Coach AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 text-center">
              Get Started Free
            </Link>
        
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-700/50 text-center text-slate-400">
        <p>&copy; 2024 Interview Coach AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
