const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Read as text first to avoid JSON parse crash on empty responses
    const text = await response.text();
    
    if (!text) {
      throw new Error('Server returned an empty response. Is the backend running on port 8080?');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Server returned an invalid response. Is the backend running on port 8080?');
    }

    if (!response.ok) {
      throw new Error(data.error || 'API Request Failed');
    }
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      error.message = 'Cannot connect to server. Please make sure the backend is running on port 8080.';
    }
    console.error('API Error:', error);
    throw error;
  }
};
