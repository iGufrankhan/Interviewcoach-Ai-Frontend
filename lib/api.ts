// API configuration and utilities for Interview Coach AI

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error_code?: string;
  status_code?: number;
}

export interface LoginResponse {
  access_token: string;
  user_id: string;
  email: string;
  message?: string;
}

export interface OTPResponse {
  message: string;
  registration_token?: string;
}

export interface RegistrationResponse {
  access_token: string;
  user_id: string;
  email: string;
  fullname: string;
  message?: string;
}

/**
 * Get authorization headers with JWT token
 */
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json',
  };
};

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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch resumes');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate questions');
    }

    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error('Error generating questions:', error);
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch resume');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

/**
 * Analyze job match between resume and job description
 */
export const analyzeJobMatch = async (
  jobDescription: string,
  resumeId: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/jobmatching/api/analyseresume?resume_id=${resumeId}&description=${encodeURIComponent(jobDescription)}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze job match');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error analyzing job match:', error);
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

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Upload failed. Backend error:', error);
      
      if (response.status === 401) {
        console.error('   Full error object:', JSON.stringify(error, null, 2));
        console.error('   Error message:', error.message);
        console.error('   Error detail:', error.detail);
        throw new Error(`Authentication failed: ${error.message || error.detail || JSON.stringify(error)}`);
      }
      
      throw new Error(error.message || error.detail || 'Failed to upload resume');
    }

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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete resume');
    }

    return true;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// ============ AUTHENTICATION FUNCTIONS ============

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/login/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.detail || 'Login failed');
    }

    console.log('📝 Login response:', data);

    // Extract from nested response structure
    const responseData = data.data || data;
    const userInfo = responseData.user || {};
    const token = responseData.access_token;

    console.log('🔑 Extracted token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    console.log('👤 User info:', userInfo);

    // Store token and user info
    if (token) {
      localStorage.setItem('token', token);
      console.log('✅ Token stored in localStorage');
    } else {
      console.error('❌ No access_token in response!');
    }

    if (userInfo.email) {
      localStorage.setItem('user_id', userInfo.email);
      console.log('✅ User ID (email) stored in localStorage:', userInfo.email);
    }

    if (userInfo.email) {
      localStorage.setItem('user_email', userInfo.email);
    }

    return {
      access_token: token || '',
      user_id: userInfo.email || '',
      email: userInfo.email || '',
      message: data.message || 'Logged in successfully'
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Send OTP to email for registration
 */
export const sendOTP = async (email: string): Promise<OTPResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/send-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.detail || 'Failed to send OTP');
    }

    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (
  email: string,
  otp: string
): Promise<OTPResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/verify-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.detail || 'OTP verification failed');
    }

    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Resend OTP
 */
export const resendOTP = async (email: string): Promise<OTPResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/resend-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.detail || 'Failed to resend OTP');
    }

    return data;
  } catch (error) {
    console.error('Error resending OTP:', error);
    throw error;
  }
};

/**
 * Complete user registration
 */
export const completeRegistration = async (
  email: string,
  password: string,
  fullname: string,
  registrationToken: string
): Promise<RegistrationResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/complete-registration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullname,
          registration_token: registrationToken,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.detail || 'Registration failed');
    }

    console.log('✅ Registration successful:', data);

    // Store token and user info from nested data object
    if (data.data?.access_token) {
      localStorage.setItem('token', data.data.access_token);
      console.log('✅ Token stored');
    }
    if (data.data?.user_id) {
      localStorage.setItem('user_id', data.data.user_id);
      console.log('✅ User ID stored');
    }
    if (data.data?.user?.email) {
      localStorage.setItem('user_email', data.data.user.email);
    }
    if (data.data?.user?.fullname) {
      localStorage.setItem('user_fullname', data.data.user.fullname);
    }

    return data;
  } catch (error) {
    console.error('Error completing registration:', error);
    throw error;
  }
};

/**
 * Logout user (clear local storage)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_fullname');
  localStorage.removeItem('interviewQuestions');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get current user info from localStorage
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  return {
    userId: localStorage.getItem('user_id'),
    email: localStorage.getItem('user_email'),
    fullname: localStorage.getItem('user_fullname'),
    token: localStorage.getItem('token'),
  };
};
