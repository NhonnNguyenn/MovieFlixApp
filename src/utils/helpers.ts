// src/utils/helpers.ts
export const debounce = (func: Function, wait: number) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).getFullYear().toString();
  } catch {
    return 'N/A';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Utility functions for movie data
export const getSafeRating = (voteAverage: number | undefined): string => {
  return voteAverage ? voteAverage.toFixed(1) : 'N/A';
};

export const getSafeYear = (releaseDate: string | undefined): string => {
  if (!releaseDate) return 'N/A';
  try {
    return new Date(releaseDate).getFullYear().toString();
  } catch {
    return 'N/A';
  }
};