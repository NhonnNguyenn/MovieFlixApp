// src/types/index.ts
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

// SỬA: Thống nhất interface Movie với API response
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null; // Sửa từ posterPath thành poster_path
  backdrop_path: string | null; // Sửa từ backdropPath thành backdrop_path
  release_date: string; // Sửa từ releaseDate thành release_date
  vote_average: number; // Sửa từ voteAverage thành vote_average
  vote_count: number; // Sửa từ voteCount thành vote_count
  genre_ids?: number[];
  media_type?: string;
  // Giữ thêm các field cũ để compatibility
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}