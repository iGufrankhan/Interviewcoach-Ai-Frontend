'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { submitAnswer, getInterviewSession, submitInterview } from '@/lib/interview/interviewApi';
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
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Load interview session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getInterviewSession(sessionId);
        // We need to fetch questions from a different endpoint or store them
        // For now, we'll reload through startInterview data saved in sessionStorage
        const savedQuestions = sessionStorage.getItem(`interview_questions_${sessionId}`);
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

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Show loading state while transcribing
        setAnswer('[Transcribing audio...]');
        await transcribeAudio(audioBlob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setError('');
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-black">
        <div className="text-center text-slate-400">
          Interview data not found. Please start a new interview.
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-slate-300">
              Question {questionNumber} of {totalQuestions}
            </h2>
            <span className="text-sm text-slate-400">
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 mb-8 backdrop-blur">
          <h3 className="text-2xl font-semibold text-white mb-4">
            {currentQuestion}
          </h3>
          
          {/* Answer Input */}
          <div className="space-y-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              disabled={isRecording || isTranscribing}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition resize-none disabled:opacity-50"
            />

            {/* Audio Recording Buttons */}
            <div className="flex gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startAudioRecording}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded text-slate-300 transition"
                >
                  <span>🎤</span>
                  Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopAudioRecording}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/50 hover:bg-red-600 border border-red-500/50 rounded text-red-300 transition animate-pulse"
                >
                  <span>⏹️</span>
                  Stop Recording
                </button>
              )}
            </div>

            {/* Help Text */}
            <p className="text-xs text-slate-400">
              💡 Tip: You can either type your answer or record audio. If audio fails, you can always type instead.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setAnswer('');
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded transition"
          >
            ← Previous
          </button>

          <button
            onClick={handleSubmitAnswer}
            disabled={loading || !answer.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition"
          >
            {loading ? 'Submitting...' : questionNumber === totalQuestions ? 'Finish Interview' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
