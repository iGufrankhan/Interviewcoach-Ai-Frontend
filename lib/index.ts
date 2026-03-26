// Main API export file - Re-exports all API functions for easy importing

// Type exports
export type { ApiResponse, LoginResponse, OTPResponse, RegistrationResponse } from './types/responses';

// Utility exports
export { getAuthHeaders } from './utils/authHeaders';

// Auth API exports
export {
  loginUser,
  sendOTP,
  verifyOTP,
  resendOTP,
  completeRegistration,
  logout,
  isAuthenticated,
  getCurrentUser,
} from './auth/authApi';

// Forgot Password API exports
export {
  requestForgotPassword,
  verifyForgotPasswordOTP,
  resendForgotPasswordOTP,
  resetForgotPassword,
} from './auth/forgotPasswordApi';

// Resume API exports
export {
  fetchUserResumes,
  getResume,
  uploadResume,
  deleteResume,
} from './resume/resumeApi';

// Interview API exports
export { generateInterviewQuestions } from './interview/interviewApi';

// Job Matching API exports
export { analyzeJobMatch } from './jobMatching/jobMatchingApi';
