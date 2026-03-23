// Resume API functions

import { getAuthHeaders } from '../utils/authHeaders';
import { handleApiResponse } from '../utils/apiErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch user's resume data
 */
export const fetchUserResumes = async (userId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/resume/api/user-resumes/${userId}`,
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
export const uploadResume = async (
  userId: string,
  file: File
) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    console.log('📤 Uploading resume:');
    console.log('   User ID:', userId);
    console.log('   File:', file.name, `(${file.size} bytes)`);
    console.log('   Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    
    const response = await fetch(
      `${API_BASE_URL}/resume/api/upload-resume/${userId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
        body: formData,
      }
    );

    console.log('   Response status:', response.status, response.statusText);

    await handleApiResponse(response);

    const data = await response.json();
    console.log('✅ Upload successful:', data);
    return data.data;
  } catch (error) {
    console.error('❌ Error uploading resume:', error);
    throw error;
  }
};

/**
 * Delete a resume
 */
export const deleteResume = async (resumeId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/resume/api/resume/${resumeId}`,
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
