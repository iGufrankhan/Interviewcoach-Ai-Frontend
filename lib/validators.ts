/**
 * Frontend validation utilities for user input
 * Used across forms for email, password, username validation
 */

export interface ValidationError {
  field: string;
  message: string;
}

// Email validation
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return "Email is required";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain number";
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain special character (!@#$%^&*)";
  }
  return null;
};

// Confirm password validation
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

// Username validation
export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  if (username.length > 50) {
    return "Username must be less than 50 characters";
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "Username can only contain letters, numbers, underscores, and dashes";
  }
  return null;
};

// OTP validation
export const validateOTP = (otp: string): string | null => {
  if (!otp.trim()) {
    return "OTP is required";
  }
  if (!/^\d{6}$/.test(otp)) {
    return "OTP must be 6 digits";
  }
  return null;
};

// Resume file validation
export const validateResumeFile = (file: File): string | null => {
  const allowedTypes = ["application/pdf", "application/msword"];
  const maxSizeInMB = 5;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (!file) {
    return "Resume file is required";
  }
  if (!allowedTypes.includes(file.type)) {
    return "Resume must be PDF or DOC format";
  }
  if (file.size > maxSizeInBytes) {
    return `Resume size must be less than ${maxSizeInMB}MB`;
  }
  return null;
};

// Job description validation
export const validateJobDescription = (description: string): string | null => {
  if (!description.trim()) {
    return "Job description is required";
  }
  if (description.length < 50) {
    return "Job description must be at least 50 characters";
  }
  return null;
};

// Form validation helper
export const validateForm = (
  data: Record<string, string | File>,
  validators: Record<string, (value: any) => string | null>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  Object.keys(validators).forEach((field) => {
    const error = validators[field](data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return errors;
};

// Batch validation for registration form
export const validateRegistrationForm = (
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(email);
  if (emailError) errors.push({ field: "email", message: emailError });

  const usernameError = validateUsername(username);
  if (usernameError) errors.push({ field: "username", message: usernameError });

  const passwordError = validatePassword(password);
  if (passwordError) errors.push({ field: "password", message: passwordError });

  const matchError = validatePasswordMatch(password, confirmPassword);
  if (matchError) errors.push({ field: "confirmPassword", message: matchError });

  return errors;
};

// Batch validation for login form
export const validateLoginForm = (
  email: string,
  password: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(email);
  if (emailError) errors.push({ field: "email", message: emailError });

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
};
