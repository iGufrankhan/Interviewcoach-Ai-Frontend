'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthentication } from './authUtils';

/**
 * Higher-order component to protect pages
 * Redirects to login if user is not authenticated
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = (
      require('react') as typeof import('react')
    ).useState(false);
    const [isLoading, setIsLoading] = (
      require('react') as typeof import('react')
    ).useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = checkAuthentication();
          
          if (!user) {
            // Redirect to login if not authenticated
            router.push('/login');
            return;
          }
          
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication check failed:', error);
          router.push('/login');
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      );
    }

    // Only render component if authenticated
    if (!isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
}

/**
 * Client-side authentication guard hook
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = (
    require('react') as typeof import('react')
  ).useState<any | null>(null);
  const [isLoading, setIsLoading] = (
    require('react') as typeof import('react')
  ).useState(true);

  useEffect(() => {
    const user = checkAuthentication();
    
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
    }
    
    setIsLoading(false);
  }, [router]);

  return { user, isLoading };
}
