'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InterviewData {
  questions: string[];
  jobDescription: string;
  timestamp: string;
}

export default function InterviewResultsPage() {
  const router = useRouter();
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('interviewQuestions');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setInterviewData(parsed);
        setUserAnswers(new Array(parsed.questions.length).fill(''));
      } catch {
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (interviewData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowFeedback(false);
    }
  };

  const handleDownloadReport = () => {
    const report = `Interview Practice Report
Generated: ${new Date(interviewData?.timestamp || '').toLocaleString()}

JOB DESCRIPTION:
${interviewData?.jobDescription}

QUESTIONS & ANSWERS:
${interviewData?.questions.map((q, i) => `
Q${i + 1}: ${q}
A${i + 1}: ${userAnswers[i] || '(No answer provided)'}
`).join('\n')}`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', 'interview_practice_report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExport = () => {
    const exportData = {
      jobDescription: interviewData?.jobDescription,
      questions: interviewData?.questions,
      answers: userAnswers,
      timestamp: interviewData?.timestamp,
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2)));
    element.setAttribute('download', 'interview_session.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading || !interviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading interview questions...</div>
      </div>
    );
  }

  const currentQuestion = interviewData.questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interviewData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Interview Coach AI
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-slate-300 hover:text-white transition">
              Back to Interview
            </Link>
            <Link href="/getresume" className="text-slate-300 hover:text-white transition">
              My Resumes
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">
              Question {currentQuestionIndex + 1} of {interviewData.questions.length}
            </h2>
            <span className="text-sm text-slate-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Question List */}
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 backdrop-blur h-fit">
            <h3 className="text-lg font-bold mb-4">Questions</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {interviewData.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentQuestionIndex(i);
                    setShowFeedback(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    i === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : userAnswers[i]
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">Q{i + 1}</div>
                  <div className="text-xs line-clamp-2 opacity-75">
                    {interviewData.questions[i]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center Column - Question & Answer */}
          <div className="md:col-span-2 space-y-6">
            {/* Question Display */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 backdrop-blur">
              <div className="mb-4">
                <span className="text-sm text-blue-400 font-semibold">Question {currentQuestionIndex + 1}</span>
              </div>
              <h2 className="text-2xl font-bold leading-relaxed">
                {currentQuestion}
              </h2>
            </div>

            {/* Job Context */}
            <div className="bg-slate-900/50 rounded-lg border border-slate-600/30 p-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Job Context:</h4>
              <p className="text-sm text-slate-400 line-clamp-3">
                {interviewData.jobDescription}
              </p>
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="text-xs text-blue-400 hover:text-blue-300 mt-3 transition"
              >
                {showFeedback ? 'Hide' : 'Show'} full context
              </button>
              {showFeedback && (
                <div className="mt-4 p-4 bg-slate-800/50 rounded border border-slate-600/50 text-sm text-slate-300 max-h-48 overflow-y-auto">
                  {interviewData.jobDescription}
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-8 backdrop-blur">
              <label className="block text-sm font-semibold mb-3 text-slate-200">
                Your Answer:
              </label>
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here. Take your time and provide a thorough response as if in a real interview..."
                className="w-full h-40 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
              />
              <p className="text-xs text-slate-400 mt-2">
                {currentAnswer.length} characters
              </p>
            </div>

            {/* Navigation & Actions */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg font-semibold transition"
              >
                ← Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === interviewData.questions.length - 1}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg font-semibold transition"
              >
                Next →
              </button>

              {currentQuestionIndex === interviewData.questions.length - 1 && (
                <>
                  <button
                    onClick={handleDownloadReport}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                  >
                    📥 Download Report
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition"
                  >
                    📊 Export Session
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold text-blue-400">{currentQuestionIndex + 1}</div>
                <div className="text-xs text-slate-400">Current</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold text-green-400">
                  {userAnswers.filter(a => a.trim()).length}
                </div>
                <div className="text-xs text-slate-400">Answered</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold text-cyan-400">
                  {interviewData.questions.length}
                </div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
