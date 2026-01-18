import { useCallback } from 'react';
import { handleApiError, isAuthError } from '../utils/errorHandler';
import { logout } from '../api/auth';

/**
 * Custom hook for handling API errors consistently
 */
export const useErrorHandler = () => {
  const handleError = useCallback((error, customMessage) => {
    if (isAuthError(error)) {
      logout();
      window.location.href = '/login';
      return;
    }

    const message = customMessage || handleApiError(error);
    return message;
  }, []);

  return { handleError };
};
