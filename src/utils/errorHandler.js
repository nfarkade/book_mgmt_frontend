/**
 * Centralized error handling utilities
 */

export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data?.detail || data?.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return data?.detail || 'Conflict: This resource already exists.';
      case 422:
        return data?.detail || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return data?.detail || data?.message || `Error ${status}: Something went wrong.`;
    }
  } else if (error.request) {
    // Request made but no response received
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      return 'Cannot connect to server. Please check if the backend is running.';
    }
    return 'Network error. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred.';
  }
};

export const handleApiError = (error, customHandler) => {
  const message = getErrorMessage(error);
  
  if (customHandler) {
    customHandler(message, error);
  } else {
    console.error('API Error:', error);
    // Default: show alert (can be replaced with toast notification)
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(message);
    }
  }
  
  return message;
};

export const isNetworkError = (error) => {
  return (
    error.code === 'ECONNREFUSED' ||
    error.message === 'Network Error' ||
    !error.response
  );
};

export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};
