// Centralized API URL helper
const API_BASE = process.env.REACT_APP_API_URL || 'https://api.careerstar.co';

export function apiUrl(path = '') {
  if (!path) return API_BASE;
  const needsSlash = !path.startsWith('/');
  return `${API_BASE}${needsSlash ? '/' : ''}${path}`;
}

export default apiUrl;

