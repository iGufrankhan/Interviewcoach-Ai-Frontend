import { useRouter } from 'next/navigation';

/**
 * Global API error handler for authentication failures
 * Redirects to login on 401/403 errors, handles network errors gracefully
 */
export async function handleApiResponse(response: Response) {
  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    // Clear auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      
      // Redirect to login
      window.location.href = '/login';
    }
    throw new Error('Unauthorized. Please login again.');
  }

  // Handle other errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else if (errorData.detail) {
      // Handle Pydantic validation errors (detail is often an array)
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((err: any) => err.msg || JSON.stringify(err))
          .join('; ');
      } else if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      }
    }
    
    throw new Error(errorMessage);
  }

  return response;
}

/**
 * Fetch wrapper with automatic authentication error handling
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  return handleApiResponse(response);
}
