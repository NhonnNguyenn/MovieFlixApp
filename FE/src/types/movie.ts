// src/types/movie.ts
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  // Thêm các properties mới
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  original_language?: string;
  budget?: number;
  revenue?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetails {
  movie: Movie;
  credits: {
    cast: Cast[];
  };
}