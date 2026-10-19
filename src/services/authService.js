import { getApiEndpoints } from '../config/api';

/**
 * Helper to process HTTP responses consistently
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = text ? { raw: text } : null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data && (data.message || data.error || data.detail || (typeof data === 'string' ? data : null))) ||
      `Request failed with status ${response.status} (${response.statusText || 'Error'})`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusText = response.statusText;
    error.responseBody = data;
    throw error;
  }

  return {
    status: response.status,
    statusText: response.statusText,
    data,
  };
}

/**
 * Authenticates user credentials via POST /api/auth/login
 * @param {Object} credentials - { identifier, password }
 */
export async function loginUser({ identifier, password }) {
  const { login: endpoint } = getApiEndpoints();

  // Send identifier in multiple common keys for backend flexibility
  const payload = {
    userId: identifier.trim(),
    email: identifier.trim(),
    identifier: identifier.trim(),
    password: password,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error(
        `Unable to connect to backend at ${endpoint}. Please ensure the backend server is running and CORS is enabled.`
      );
      networkError.isNetworkError = true;
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

/**
 * Registers a new user via POST /api/auth/signup
 * @param {Object} userData - { userId, email, password }
 */
export async function signupUser({ userId, email, password }) {
  const { signup: endpoint } = getApiEndpoints();

  const payload = {
    userId: userId.trim(),
    username: userId.trim(),
    email: email.trim(),
    password: password,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error(
        `Unable to reach backend at ${endpoint}. Check your network connection and backend status.`
      );
      networkError.isNetworkError = true;
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

/**
 * Requests password recovery via POST /api/auth/forgot-password
 * @param {Object} payload - { identifier }
 */
export async function forgotPassword({ identifier }) {
  const { forgotPassword: endpoint } = getApiEndpoints();

  const payloadData = {
    identifier: identifier.trim(),
    email: identifier.trim(),
    userId: identifier.trim(),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payloadData),
    });

    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error(
        `Backend server unreachable at ${endpoint}. Please check server connectivity.`
      );
      networkError.isNetworkError = true;
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

/**
 * Performs a health check ping to determine backend availability
 */
export async function checkBackendHealth() {
  const { health: endpoint, base } = getApiEndpoints();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return {
      online: response.ok,
      status: response.status,
      url: base,
    };
  } catch (err) {
    return {
      online: false,
      error: err.name === 'AbortError' ? 'Timeout' : err.message,
      url: base,
    };
  }
}
