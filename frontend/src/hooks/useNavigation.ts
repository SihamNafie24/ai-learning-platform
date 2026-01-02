import { useNavigate } from '@tanstack/react-router';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  
  return {
    navigateToLogin: () => navigate({ to: '/login' }),
    navigateToSignup: () => navigate({ to: '/signup' }),
    navigateToDashboard: () => navigate({ to: '/dashboard' }),
    navigateToHome: () => navigate({ to: '/' }),
  };
};
