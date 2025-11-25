// src/constants/index.ts
export const API_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    API_KEY: '464008ff806e947f7a8e87a3da63321c', // Thay bằng key thực
  };
  
  export const COLORS = {
    primary: '#E50914',
    primaryDark: '#B2070F',
    secondary: '#141414',
    secondaryLight: '#1C1C1C',
    accent: '#F5C518',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#6D6D6D',
    background: '#000000',
    card: '#1C1C1C',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    overlay: 'rgba(0, 0, 0, 0.7)',
  };
  
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    FAVORITES: 'favorite_movies',
  };
  
  export const SCREEN_NAMES = {
    LOGIN: 'Login',
    REGISTER: 'Register',
    HOME: 'Home',
    PROFILE: 'Profile',
    SEARCH: 'Search',
    MOVIE_DETAIL: 'MovieDetail',
    FAVORITES: 'Favorites',
  };