import { redirect } from 'next/navigation';

/**
 * Check if user is authenticated
 * Returns user info if authenticated, null otherwise
 */
export function checkAuthentication() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const userEmail = localStorage.getItem('user_email');
  
  return token && userId && userEmail ? { token, userId, userEmail } : null;
}

/**
 * Verify token validity (basic check)
 * In production, verify with backend
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false;
  try {
    // Basic check - JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  } catch {
    return false;
  }
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': `Bearer ${token || ''}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_fullname');
  localStorage.removeItem('interviewQuestions');
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
