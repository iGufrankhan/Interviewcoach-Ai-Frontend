export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const isBrowserLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  // If in production OR not on localhost browser, force remote backend if envUrl points to localhost
  if (isProduction || (!isBrowserLocalhost && typeof window !== 'undefined')) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return 'https://interviewcoach-ai-backend.onrender.com';
    }
  }

  const finalUrl = envUrl || 'https://interviewcoach-ai-backend.onrender.com';
  // Strip any trailing slashes to prevent //api/login/ double slash CORS errors
  return finalUrl.replace(/\/+$/, '');
};
