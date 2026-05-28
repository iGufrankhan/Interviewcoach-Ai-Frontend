'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { submitAnswer, getInterviewSession } from '@/lib/interview/interviewApi';
import { useAuth } from '@/lib/auth/withProtectedRoute';

export default function TakeInterviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  
  // Handle sessionId which might be string or array
  const rawSessionId = params.sessionId;
  const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  // Load interview session
  useEffect(() => {
    const currentSessionId = sessionId;

    if (!currentSessionId) {
      setError('Session ID not found. Please refresh the page.');
      setLoadingSession(false);
      return;
    }

    const loadSession = async () => {
      try {
        await getInterviewSession(currentSessionId);
        // We need to fetch questions from a different endpoint or store them
        // For now, we'll reload through startInterview data saved in sessionStorage
        const savedQuestions = sessionStorage.getItem(`interview_questions_${currentSessionId}`);
        if (savedQuestions) {
          setQuestions(JSON.parse(savedQuestions));
        }
      } catch (err) {
        setError('Failed to load interview');
      } finally {
        setLoadingSession(false);
      }
    };

    if (!authLoading && user) {
      loadSession();
    }
  }, [user, authLoading, sessionId]);

  // Clean up audio visualizer on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:audio/wav;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Transcribe audio
  const transcribeAudio = async (blob: Blob) => {
    try {
      setIsTranscribing(true);
      setError('');

      const base64Audio = await blobToBase64(blob);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/interview/transcribe-audio`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio_data: base64Audio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to transcribe audio');
      }

      setAnswer(data.data.transcribed_text);
    } catch (err: any) {
      setError(err.message || 'Failed to transcribe audio. Please try again or type your answer.');
      setAnswer(''); // Clear any partial data
    } finally {
      setIsTranscribing(false);
    }
  };

  // Request microphone permission and setup recorder
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      // Audio visualization setup
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;
        setAudioLevel(average);
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setAudioLevel(0);
        
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        
        // Show loading state while transcribing
        setAnswer('[AI is transcribing your audio...]');
        await transcribeAudio(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setError('');
      updateAudioLevel();
    } catch (err) {
      setError('Unable to access microphone. Please check permissions.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }

    if (!sessionId) {
      setError('Session ID not found. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await submitAnswer(sessionId, answer, false);
      
      // Move to next question
      if (response.remaining > 0) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswer('');
      } else {
        // All answers submitted, go to submit page
        router.push(`/interview/results/${sessionId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014]">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping w-24 h-24 rounded-full bg-cyan-500/20"></div>
          <div className="absolute animate-ping w-16 h-16 rounded-full bg-blue-500/20 animation-delay-300"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030014]">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-3xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Interview Data Missing</h2>
          <p className="text-zinc-400 mb-8 max-w-md">We couldn't retrieve the questions for this session. Please start a new interview.</p>
          <Link
            href="/interview/start"
            className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 hover:scale-105"
          >
            Start New Interview
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions.length > currentQuestionIndex ? questions[currentQuestionIndex] : undefined;
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="relative min-h-screen bg-[#030014] text-white font-sans overflow-x-hidden flex flex-col">
      {/* Background ambient glows */}
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

      {/* Header/Nav */}
      <nav className="relative z-50 backdrop-blur-md bg-[#030014]/60 border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-bold text-white tracking-wide uppercase text-sm">Live Session Active</span>
        </div>
        <button 
          onClick={() => confirm('Are you sure you want to exit? Your progress will be saved but you will have to resume later.') && router.push('/interviewprep')}
          className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full border border-white/10"
        >
          Exit Session
        </button>
      </nav>

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col relative z-10">
        
        {/* Progress Bar */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider mb-1">Current Progress</p>
              <h2 className="text-2xl font-bold text-white">
                Question <span className="text-cyan-400">{questionNumber}</span> <span className="text-zinc-500 text-lg font-medium">of {totalQuestions}</span>
              </h2>
            </div>
            <span className="text-xl font-bold text-cyan-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-linear-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30"></div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {currentQuestion ? (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Decorative question mark watermark */}
              <div className="absolute -top-12 -right-12 text-[15rem] font-bold text-white/[0.02] pointer-events-none select-none">?</div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 font-bold text-xl mb-8 border border-cyan-500/30">
                  Q{questionNumber}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-relaxed tracking-tight">
                  {currentQuestion}
                </h3>
              
                {/* Answer Input Area */}
                <div className="space-y-6 relative">
                  
                  {/* Dynamic background effect when recording */}
                  {isRecording && (
                    <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl animate-pulse pointer-events-none border border-cyan-500/20"></div>
                  )}

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here, or click the microphone to speak..."
                    rows={6}
                    disabled={isRecording || isTranscribing}
                    className={`w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none custom-scrollbar relative z-10 ${
                      isRecording ? 'opacity-50 border-cyan-500/30 bg-cyan-900/10' : ''
                    } ${isTranscribing ? 'opacity-70 animate-pulse' : ''}`}
                  />

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                    
                    {/* Audio Controls */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {!isRecording ? (
                        <button
                          type="button"
                          onClick={startAudioRecording}
                          disabled={isTranscribing}
                          className="group relative flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 rounded-xl text-white font-medium transition-all duration-300 w-full sm:w-auto disabled:opacity-50"
                        >
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                          </div>
                          Speak Answer
                        </button>
                      ) : (
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={stopAudioRecording}
                            className="group relative flex items-center justify-center gap-3 px-6 py-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl text-red-400 font-bold transition-all duration-300 w-full sm:w-auto flex-1"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white animate-pulse">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 2a1 1 0 00-1 1v4a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1H6z" clipRule="evenodd" />
                              </svg>
                            </div>
                            Stop & Transcribe
                          </button>
                          
                          {/* Audio Visualizer */}
                          <div className="flex items-end gap-1 h-10 px-4">
                            {[...Array(8)].map((_, i) => (
                              <div 
                                key={i} 
                                className="w-1.5 bg-cyan-400 rounded-t-sm transition-all duration-75"
                                style={{ 
                                  height: `${Math.max(4, (audioLevel / 255) * 40 * (Math.sin(i + Date.now()/100) * 0.5 + 0.5) + (Math.random() * 10))}px`,
                                  opacity: Math.max(0.3, audioLevel / 255)
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-400 font-medium">Loading next question...</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6 flex items-center gap-3 animate-fade-in-up">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setAnswer('');
              }
            }}
            disabled={currentQuestionIndex === 0 || loading || isRecording || isTranscribing}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous
          </button>

          <button
            onClick={handleSubmitAnswer}
            disabled={loading || !answer.trim() || isRecording || isTranscribing}
            className="flex-[2] group relative inline-flex items-center justify-center py-4 font-bold text-white transition-all duration-300 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] overflow-hidden gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting Analysis...
              </>
            ) : questionNumber === totalQuestions ? (
              <>
                Complete Interview
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <>
                Submit & Next Question
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
