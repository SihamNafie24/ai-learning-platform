import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { api } from '../lib/api';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate({ to: '/login' });
    }
  }, [navigate]);

  // Return children if authenticated, otherwise null (will redirect)
  return api.isAuthenticated() ? <>{children}</> : null;
}