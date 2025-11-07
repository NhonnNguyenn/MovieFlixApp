// src/context/MovieContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Movie } from '../types';
import movieService from '../services/movieService';

interface MovieContextType {
  popularMovies: Movie[];
  nowPlayingMovies: Movie[];
  topRatedMovies: Movie[];
  upcomingMovies: Movie[];
  loading: boolean;
  error: string | null;
  refreshMovies: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
        movieService.getPopularMovies(),
        movieService.getNowPlayingMovies(),
        movieService.getTopRatedMovies(),
        movieService.getUpcomingMovies(),
      ]);

      setPopularMovies(popular);
      setNowPlayingMovies(nowPlaying);
      setTopRatedMovies(topRated);
      setUpcomingMovies(upcoming);
    } catch (err: any) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const value: MovieContextType = {
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    loading,
    error,
    refreshMovies: loadMovies,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};