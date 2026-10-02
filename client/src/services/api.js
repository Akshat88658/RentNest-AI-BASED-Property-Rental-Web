import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://rentnest-ai-based-property-rental-web-2.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 30000, // 30s — Render free-tier cold-start can be slow
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry helper for 503 (server sleeping / cold-start on Render)
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000; // 3 seconds between retries

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Handle 401 / 503 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Handle 401 — clear token and redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 503 — retry up to MAX_RETRIES times (Render cold-start)
    if (error.response?.status === 503 || error.code === 'ECONNABORTED') {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        console.warn(
          `[API] 503 / timeout — retry ${config._retryCount}/${MAX_RETRIES} in ${RETRY_DELAY_MS / 1000}s…`
        );
        await sleep(RETRY_DELAY_MS);
        return api(config);
      }

      // Attach a friendly message after all retries exhausted
      const friendlyError = new Error(
        'The server is taking too long to respond. It may be waking up from sleep — please wait a moment and try again.'
      );
      friendlyError.status = 503;
      friendlyError.isServerSleep = true;
      return Promise.reject(friendlyError);
    }

    return Promise.reject(error);
  }
);

export default api;
