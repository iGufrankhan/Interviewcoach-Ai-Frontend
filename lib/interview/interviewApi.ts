// Interview API functions

import { getAuthHeaders } from '../utils/authHeaders';
import { handleApiResponse } from '../utils/apiErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generate interview questions based on job description and resume
 */
export const generateInterviewQuestions = async (
  description: string,
  resumeId: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/interviewservice/question_gen/generate?description=${encodeURIComponent(description)}&resume_id=${resumeId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    await handleApiResponse(response);

    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};
