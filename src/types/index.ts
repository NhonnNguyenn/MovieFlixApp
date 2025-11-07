// src/types/index.ts
export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: string;
  }
  
  export interface Movie {
    id: number;
    title: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string;
    voteAverage: number;
    voteCount: number;
    genreIds: number[];
    mediaType?: string;
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
    totalPages: number;
    totalResults: number;
  }