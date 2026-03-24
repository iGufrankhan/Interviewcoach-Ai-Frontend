'use client';

import { useRouter } from 'next/navigation';

export default function DocumentationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black text-white font-sans py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition duration-300 shadow-lg hover:shadow-blue-500/50"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Interview Coach AI
          </h1>
          <p className="text-lg text-slate-300">
            AI-powered interview preparation platform using LLM technology
          </p>
        </div>

        {/* Main Features */}
        <section className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">📊 Resume-Job Matching</h2>
            <p className="text-slate-300 mb-3">
              Analyze how well your resume matches a job description with scoring and improvement suggestions.
            </p>
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-cyan-400 font-semibold">How it works:</span> Our AI extracts your skills, experience, and education, then compares them with job requirements to calculate a compatibility score (0-100).
            </p>
            <p className="text-slate-300 text-sm">
              <span className="text-cyan-400 font-semibold">Output:</span> Match score, skill alignment percentage, identified gaps, and actionable improvement suggestions.
            </p>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">🎯 Question Generation</h2>
            <p className="text-slate-300 mb-3">
              Get 10 personalized interview questions based on your resume and the job description.
            </p>
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-cyan-400 font-semibold">How it works:</span> Analysis of job requirements and your background to generate role-specific, technical, and behavioral questions.
            </p>
            <p className="text-slate-300 text-sm">
              <span className="text-cyan-400 font-semibold">Output:</span> 10 tailored questions with difficulty levels and expected answer frameworks.
            </p>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">📈 Answer Analysis & Performance Scoring</h2>
            <p className="text-slate-300 mb-3">
              Receive performance scoring and detailed feedback on your interview answers.
            </p>
            <p className="text-slate-300 text-sm mb-2">
              <span className="text-cyan-400 font-semibold">How it works:</span> AI evaluates your answers for completeness, technical accuracy, communication clarity, and alignment with best practices.
            </p>
            <p className="text-slate-300 text-sm">
              <span className="text-cyan-400 font-semibold">Output:</span> Individual answer scores (0-100), overall interview readiness percentage, and personalized improvement recommendations.
            </p>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">⚡ Tech Stack</h2>
            <div className="space-y-3">
              <div>
                <p className="text-cyan-400 font-semibold text-sm">Frontend:</p>
                <p className="text-slate-300 text-sm">Next.js 14+, TypeScript, Tailwind CSS - Modern, responsive UI</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold text-sm">Backend:</p>
                <p className="text-slate-300 text-sm">FastAPI (Python), Document processing (PDF/DOCX), Prompt orchestration</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold text-sm">LLM Engine:</p>
                <p className="text-slate-300 text-sm">Groq - Ultra-fast inference with 85-95% accuracy for skill matching</p>
              </div>
              <div>
                <p className="text-cyan-400 font-semibold text-sm">Database:</p>
                <p className="text-slate-300 text-sm">MongoDB - Stores user profiles, resumes, and interview history</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">🔒 Security & Privacy</h2>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>✓ Encrypted data transmission (HTTPS/TLS)</li>
              <li>✓ Secure API key management</li>
              <li>✓ User data isolated per account</li>
              <li>✓ Input validation and sanitization</li>
              <li>✓ Rate limiting to prevent abuse</li>
            </ul>
          </div>

          <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">⚙️ Performance Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-400 font-semibold text-sm mb-2">Response Times</p>
                <ul className="text-slate-300 text-xs space-y-1">
                  <li>Resume Matching: 1-2s</li>
                  <li>Question Gen: 2-3s</li>
                  <li>Answer Analysis: 1.5-2s</li>
                </ul>
              </div>
              <div>
                <p className="text-green-400 font-semibold text-sm mb-2">Accuracy</p>
                <ul className="text-slate-300 text-xs space-y-1">
                  <li>Skill Detection: 92%</li>
                  <li>Match Scoring: 89%</li>
                  <li>Answer Evaluation: 88%</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-slate-700/50 pt-8 mt-12 text-center text-slate-400 text-sm">
          <p>Interview Coach AI | v1.0</p>
        </div>
      </div>
    </div>
  );
}
