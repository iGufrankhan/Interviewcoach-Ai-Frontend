// Authentication API functions

import { LoginResponse, OTPResponse, RegistrationResponse } from '../types/responses';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
      `/api/auth/send-otp`,
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
      `/api/auth/verify-otp`,
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
      `/api/auth/resend-otp`,
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
