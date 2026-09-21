import { getApiClient } from '@uumiees/api';

export function initApi() {
  const api = getApiClient();
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) api.setToken(token);
  }
  return api;
}

export const api = () => initApi();
