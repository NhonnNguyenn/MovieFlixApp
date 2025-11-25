// src/services/movieService.ts - CẬP NHẬT
import { Movie, ApiResponse } from '../types';
import { API_CONFIG } from '../constants';

class MovieService {
  private apiKey = API_CONFIG.API_KEY;
  private baseUrl = API_CONFIG.BASE_URL;

  private async fetchFromApi<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${this.apiKey}&language=vi-VN`;
    
    console.log('Fetching from:', url); // Debug
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  }

  async getPopularMovies(): Promise<Movie[]> {
    try {
      const data = await this.fetchFromApi<ApiResponse<Movie>>('/movie/popular');
      return data.results || [];
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }

  async getNowPlayingMovies(): Promise<Movie[]> {
    try {
      const data = await this.fetchFromApi<ApiResponse<Movie>>('/movie/now_playing');
      return data.results || [];
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  }

  async getTopRatedMovies(): Promise<Movie[]> {
    try {
      const data = await this.fetchFromApi<ApiResponse<Movie>>('/movie/top_rated');
      return data.results || [];
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  }

  async getUpcomingMovies(): Promise<Movie[]> {
    try {
      const data = await this.fetchFromApi<ApiResponse<Movie>>('/movie/upcoming');
      return data.results || [];
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return [];
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const data = await this.fetchFromApi<ApiResponse<Movie>>(`/search/movie?query=${encodeURIComponent(query)}`);
      return data.results || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    return await this.fetchFromApi<Movie>(`/movie/${movieId}`);
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return 'https://via.placeholder.com/500x750/1C1C1C/FFFFFF?text=No+Image';
    return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
  }
}

export default new MovieService();