const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || (import.meta.env.DEV ? '/api' : 'http://localhost:3001');

export default API_BASE_URL;
