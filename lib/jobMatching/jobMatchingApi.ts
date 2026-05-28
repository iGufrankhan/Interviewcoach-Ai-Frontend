// Job Matching API functions

import { getAuthHeaders } from '../utils/authHeaders';
import { handleApiResponse } from '../utils/apiErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://interviewcoach-ai-backend.onrender.com';

/**
 * Analyze job match between resume and job description
 */
export const analyzeJobMatch = async (
  jobDescription: string,
  resumeId: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/jobmatching/analyseresume?resume_id=${resumeId}&description=${encodeURIComponent(jobDescription)}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    await handleApiResponse(response);

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error analyzing job match:', error);
    throw error;
  }
};
