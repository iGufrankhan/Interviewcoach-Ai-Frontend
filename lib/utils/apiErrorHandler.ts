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
    throw new Error(
      errorData.message || 
      errorData.error || 
      `API Error: ${response.status} ${response.statusText}`
    );
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
