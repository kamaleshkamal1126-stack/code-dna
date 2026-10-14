const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('codedna_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return {};
  }

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  // Authentication
  auth: {
    register: async (username, email, password) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ username, email, password }),
      });
      return handleResponse(res);
    },
    login: async (identifier, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ identifier, password }),
      });
      return handleResponse(res);
    },
    logout: async () => {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    me: async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Analysis
  analysis: {
    analyze: async (code, language = 'c', title = '', projectId = null, saveHistory = true) => {
      const res = await fetch(`${BASE_URL}/analyze`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code,
          language,
          title,
          project_id: projectId,
          save_history: saveHistory,
        }),
      });
      return handleResponse(res);
    },
    getHistory: async () => {
      const res = await fetch(`${BASE_URL}/analysis-history`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getHistoryItem: async (id) => {
      const res = await fetch(`${BASE_URL}/analysis-history/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    deleteHistoryItem: async (id) => {
      const res = await fetch(`${BASE_URL}/analysis-history/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    clearHistory: async () => {
      const res = await fetch(`${BASE_URL}/analysis-history`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Projects
  projects: {
    list: async (category = '', query = '') => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (query) params.append('q', query);
      const url = `${BASE_URL}/projects${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    create: async (projectData) => {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      return handleResponse(res);
    },
    update: async (id, projectData) => {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Code Comparison
  comparison: {
    compare: async (codeA, codeB, language = 'c', title = '', saveComparison = true) => {
      const res = await fetch(`${BASE_URL}/compare`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code_a: codeA,
          code_b: codeB,
          language,
          title,
          save_comparison: saveComparison,
        }),
      });
      return handleResponse(res);
    },
    list: async () => {
      const res = await fetch(`${BASE_URL}/comparisons`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${BASE_URL}/comparisons/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/comparisons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // DSA Curriculum
  dsa: {
    getCategories: async () => {
      const res = await fetch(`${BASE_URL}/dsa/categories`);
      return handleResponse(res);
    },
    getTopics: async (categoryId = '') => {
      const url = categoryId
        ? `${BASE_URL}/dsa/topics?category_id=${encodeURIComponent(categoryId)}`
        : `${BASE_URL}/dsa/topics`;
      const res = await fetch(url);
      return handleResponse(res);
    },
    getTopic: async (id) => {
      const res = await fetch(`${BASE_URL}/dsa/topic/${id}`);
      return handleResponse(res);
    },
    getExamples: async () => {
      const res = await fetch(`${BASE_URL}/dsa/examples`);
      return handleResponse(res);
    },
  },

  // Health
  health: {
    check: async () => {
      const res = await fetch(`${BASE_URL}/health`);
      return handleResponse(res);
    },
  },
};
