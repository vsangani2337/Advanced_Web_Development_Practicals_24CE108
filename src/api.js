const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const TOKEN_KEY = 'task-manager-token';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const { headers: optionHeaders, ...requestOptions } = options;
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...optionHeaders,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${BASE_URL}${path}`, { ...requestOptions, headers });
    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();
    let data;
    if (contentType.includes('application/json')) {
      data = JSON.parse(rawBody);
    } else if (contentType.includes('text/html') || /^\s*<[/!]?(!doctype html|html)\b/i.test(rawBody)) {
      data = {
        message: `The server responded with an HTML page instead of JSON. Ensure the backend is running at ${BASE_URL}.`,
      };
    } else {
      data = { message: rawBody };
    }

    if (!response.ok) {
      if (response.status === 401) {
        // If unauthorized on protected route, clean stale token
        if (token && path !== '/login' && path !== '/register') {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      const validationMessage = data.details?.map((detail) => detail.message).join(' ');
      const error = new Error(validationMessage || data.message || data.error || 'Request failed.');
      error.status = response.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (error instanceof Error && 'status' in error) throw error;
    throw new Error(`Unable to reach the task server. Start the backend and check VITE_API_URL (${BASE_URL}).`, { cause: error });
  }
}

export const register = (credentials) =>
  request('/register', { method: 'POST', body: JSON.stringify(credentials) });

export const login = async (credentials) => {
  const data = await request('/login', { method: 'POST', body: JSON.stringify(credentials) });
  if (!data.token) throw new Error('Login succeeded without an authentication token.');
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
};

export const logout = () => localStorage.removeItem(TOKEN_KEY);

export const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY));

export const getMe = () => request('/me');

export const getTasks = () => request('/tasks');

export const createTask = (task) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(task) });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: 'DELETE' });

export const generateTaskDescription = (title) =>
  request('/api/ai/generate-description', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
