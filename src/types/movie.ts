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