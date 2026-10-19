/**
 * Application API Configuration
 * Reads VITE_API_BASE_URL from environment variables.
 * Allows runtime override via localStorage for seamless testing without redeployment.
 */

const DEFAULT_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

// Retrieve stored override if user modified the target API URL in the UI
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('prompt_user_custom_api_url');
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }
  }
  return DEFAULT_API_BASE_URL;
};

// Update custom API base URL for live debugging/testing
export const setApiBaseUrl = (url) => {
  if (!url || !url.trim()) {
    localStorage.removeItem('prompt_user_custom_api_url');
  } else {
    localStorage.setItem('prompt_user_custom_api_url', url.trim().replace(/\/+$/, ''));
  }
};

// Reset custom API URL to default environment variable
export const resetApiBaseUrl = () => {
  localStorage.removeItem('prompt_user_custom_api_url');
};

// Get endpoint URL generator
export const getApiEndpoints = () => {
  const base = getApiBaseUrl();
  return {
    base,
    login: `${base}/api/auth/login`,
    signup: `${base}/api/auth/signup`,
    forgotPassword: `${base}/api/auth/forgot-password`,
    health: `${base}/api/health`,
  };
};
