// Resume API functions

import { getAuthHeaders } from '../utils/authHeaders';
import { handleApiResponse } from '../utils/apiErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch user's resume data
 */
export const fetchUserResumes = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/resume/api/user-resumes`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    await handleApiResponse(response);

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

/**
 * Get a specific resume by ID
 */
export const getResume = async (resumeId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/resume/api/resume/${resumeId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    await handleApiResponse(response);

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

/**
 * Upload a new resume
 */
export const uploadResume = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/resume/api/upload-resume`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
        },
        body: formData,
      }
    );

    await handleApiResponse(response);

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

/**
 * Delete a resume
 */
export const deleteResume = async (resumeId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/resume/api/delete-resume/${resumeId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    await handleApiResponse(response);

    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};
