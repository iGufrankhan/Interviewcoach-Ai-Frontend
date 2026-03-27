'use client';

import { getAuthHeaders } from '../utils/authHeaders';
import { handleApiResponse } from '../utils/apiErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface InterviewSession {
  session_id: string;
  questions: string[];
  total_questions: number;
}

export interface AnswerResponse {
  question_number: number;
  total_questions: number;
  remaining: number;
}

export interface ScoreResult {
  session_id: string;
  total_score: number;
  score_out_of_50: number;
  percentage: number;
  average_per_question: number;
  question_answers: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }>;
}

export interface SessionDetails {
  session_id: string;
  job_title: string;
  status: string;
  questions_count: number;
  answers_count: number;
  total_score: number | null;
  created_at: string;
  completed_at: string | null;
  question_answers: any[];
}

// Start Interview - Generate Questions
export const startInterview = async (
  job_description: string,
  resume_id: string,
  job_title: string = "Interview"
): Promise<InterviewSession> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/start`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_description,
        resume_id,
        job_title,
      }),
    });

    await handleApiResponse(response);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error starting interview:', error);
    throw error;
  }
};

// Submit Answer (Audio or Text)
export const submitAnswer = async (
  session_id: string,
  answer: string,
  use_audio: boolean = false
): Promise<AnswerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/submit-answer`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        answer,
        use_audio,
      }),
    });

    await handleApiResponse(response);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

// Submit Interview - Get Score
export const submitInterview = async (
  session_id: string
): Promise<ScoreResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/submit`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
      }),
    });

    await handleApiResponse(response);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error submitting interview:', error);
    throw error;
  }
};

// Get Interview Session Details
export const getInterviewSession = async (
  session_id: string
): Promise<SessionDetails> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/interview/session/${session_id}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    await handleApiResponse(response);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

// Get All User Interviews
export const getUserInterviews = async (): Promise<SessionDetails[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/interview/sessions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    await handleApiResponse(response);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting interviews:', error);
    throw error;
  }
};
