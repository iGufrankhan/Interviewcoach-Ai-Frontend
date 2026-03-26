import { handleApiResponse } from '../utils/apiErrorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Request forgot password - sends OTP to email
 * No authentication required
 */
export const requestForgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/request-forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Verify forgot password OTP
 * No authentication required
 */
export const verifyForgotPasswordOTP = async (
  email: string,
  otp: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/verify-forgot-password-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Resend forgot password OTP
 * No authentication required
 */
export const resendForgotPasswordOTP = async (email: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/resend-forgot-password-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with new password
 * No authentication required
 */
export const resetForgotPassword = async (
  email: string,
  newPassword: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/reset-forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, new_password: newPassword }),
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};
