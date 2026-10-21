// Central place for app-wide constants and env config.
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'React Starter';
export const API_URL = import.meta.env.VITE_API_URL || '';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

// No API URL configured -> the app runs against mock data, so it works out of the box.
export const USE_MOCK = !API_URL;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const TOKEN_KEY = 'access_token';
