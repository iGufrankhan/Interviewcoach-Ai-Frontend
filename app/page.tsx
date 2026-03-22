import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </div>
          <div className="flex gap-6 items-center">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#workflow" className="hover:text-blue-400 transition">Workflow</a>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
              Login
            </Link>
            <Link href="/otpsend" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Interview Preparation
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get matched with dream jobs, prepare with AI-generated questions, and receive personalized feedback. Your intelligent interview coach powered by advanced LLMs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 text-center">
              Start Free Analysis
            </Link>
            <Link href="/detailsDocu" className="border border-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg font-semibold transition text-center">
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
                Generate 10 targeted interview questions based on the job description and your resume. Prepare for role-specific scenarios and scenarios.
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
          
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">1</div>
              <h4 className="font-bold mb-2">Upload Resume</h4>
              <p className="text-slate-400 text-sm">Share your resume in PDF or DOCX format</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">2</div>
              <h4 className="font-bold mb-2">Paste Job Description</h4>
              <p className="text-slate-400 text-sm">Copy the job posting you're interested in</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">3</div>
              <h4 className="font-bold mb-2">Get Match Analysis</h4>
              <p className="text-slate-400 text-sm">Receive detailed scoring and recommendations</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">4</div>
              <h4 className="font-bold mb-2">Practice Questions</h4>
              <p className="text-slate-400 text-sm">Prepare with AI-generated interview questions</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">5</div>
              <h4 className="font-bold mb-2">Get Analyzed</h4>
              <p className="text-slate-400 text-sm">Practice answers & receive AI performance scoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-t border-slate-700/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of candidates using Interview Coach AI to prepare smarter, interview better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105 text-center">
              Begin Free Analysis
            </Link>
            <Link href="/detailsDocu" className="border border-slate-400 hover:border-white px-8 py-3 rounded-lg font-semibold transition text-center">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-6 text-center text-slate-400 text-sm">
        <p>© 2026 Interview Coach AI. All rights reserved. | Powered by LLMs & FastAPI</p>
      </footer>
    </div>
  );
}
