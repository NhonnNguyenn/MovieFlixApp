// src/constants/index.ts
export { COLORS, FONTS, SHADOWS, SIZES, default as appTheme } from './theme';

export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  API_KEY: '464008ff806e947f7a8e87a3da63321c',
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