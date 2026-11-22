import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.MODE === 'production' ? 'https://sistemaspb.shop/api' : 'http://localhost:8000/api'),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const clearSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const isLoginRequest = error.config?.url?.includes('/login');

    // Token expirado/inválido: limpa a sessão e volta para o login (rota "/" no HashRouter)
    if (status === 401 && !isLoginRequest) {
      clearSession();
      if (window.location.hash !== '#/' && window.location.hash !== '') {
        window.location.hash = '#/';
      }
    }

    if (import.meta.env.DEV) {
      console.error('API error:', error.config?.method?.toUpperCase(), error.config?.url, status ?? error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
