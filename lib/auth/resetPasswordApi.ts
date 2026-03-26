import { handleApiResponse } from '../utils/apiErrorHandler';
import { getAuthHeaders } from '../utils/authHeaders';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Request password reset - sends OTP to email
 */
export const requestPasswordReset = async (email: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/request-password-reset`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Verify password reset OTP
 */
export const verifyPasswordResetOTP = async (
  email: string,
  otp: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/verify-password-reset-otp`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, otp }),
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Resend password reset OTP
 */
export const resendPasswordResetOTP = async (email: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/resend-password-reset-otp`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
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
 */
export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/reset-password`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, new_password: newPassword }),
      }
    );

    return handleApiResponse(response);
  } catch (error) {
    throw error;
  }
};
