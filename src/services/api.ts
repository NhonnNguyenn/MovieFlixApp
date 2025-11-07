// src/services/api.ts
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjQwMDhmZjgwNmU5NDdmN2E4ZTg3YTNkYTYzMzIxYyIsIm5iZiI6MTc2MTk5MTg4OC42Mywic3ViIjoiNjkwNWRjZDA0Yzk4YzdlMTU0NTk3YjUzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.7eHGjcVjlfqOGef18k0pFLWinD8nRTcIaHkQqZ5tiAY';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const api = {
  async getPopularMovies() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/popular?language=vi-VN&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  async getNowPlayingMovies() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/now_playing?language=vi-VN&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  },

  async getMovieDetails(movieId: number) {
    try {
      const [movieResponse, creditsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/movie/${movieId}?language=vi-VN`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }),
        fetch(`${API_BASE_URL}/movie/${movieId}/credits?language=vi-VN`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }),
      ]);

      const movie = await movieResponse.json();
      const credits = await creditsResponse.json();

      return { movie, credits };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  },

  async searchMoviesAndActors(query: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=vi-VN&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  },
};

export default api;