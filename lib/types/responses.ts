// API Response Types and Interfaces

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
